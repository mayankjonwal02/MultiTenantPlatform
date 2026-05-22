import os
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tenants.api.serializers.invitation_serializer import (
    InvitationCreateSerializer,
    InvitationSerializer,
)
from tenants.models.invitation import Invitation
from tenants.models.membership import Membership
from tenants.models.organization import Organization
from roles.models.role import Role

from users.models import User
from users.tasks import enqueue_task, send_invitation_email_task


class InvitationApiView(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class = InvitationCreateSerializer

    def post(self, request):

        serializer = InvitationCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        role_id = serializer.validated_data.get('role_id')
        organization_id = serializer.validated_data.get('organization_id')
        organization = getattr(request, "tenant", None)

        if not organization and organization_id:
            organization = Organization.objects.filter(
                id=organization_id,
                memberships__user=request.user,
                memberships__status="active"
            ).first()

        if not organization:
            return Response(
                {"error": "Select an active organization before inviting members."},
                status=status.HTTP_400_BAD_REQUEST
            )

        role = None
        if role_id:
            role = Role.objects.filter(
                id=role_id,
                organization=organization
            ).first()

            if not role:
                return Response(
                    {"error": "Role does not belong to the selected organization."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if Membership.objects.filter(
            user__email__iexact=email,
            organization=organization,
        ).exists():
            return Response(
                {"error": "This user is already a member of the organization."},
                status=status.HTTP_400_BAD_REQUEST
            )

        invitation = Invitation.objects.create(
            email=email,
            organization=organization,
            role=role,
            invited_by=request.user,
            created_by=request.user,
            updated_by=request.user,
        )

        inviter_name = (
            f"{request.user.first_name} {request.user.last_name}".strip()
            or request.user.email
        )
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        invite_link = f"{frontend_url}/invite/{invitation.token}"

        enqueue_task(
            send_invitation_email_task,
            email,
            inviter_name,
            organization.name,
            invite_link
        )

        return Response(
            InvitationSerializer(invitation).data,
            status=status.HTTP_201_CREATED
        )


class InvitationAcceptApiView(APIView):

    permission_classes = []
    serializer_class = InvitationSerializer

    def get_invitation(self, token):
        try:
            return Invitation.objects.select_related(
                "organization",
                "role"
            ).get(token=token)
        except (Invitation.DoesNotExist, ValueError):
            return None

    def get(self, request, token):
        invitation = self.get_invitation(token)

        if not invitation:
            return Response(
                {"error": "Invitation not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if invitation.is_expired and invitation.status == "pending":
            invitation.status = "expired"
            invitation.save(update_fields=["status", "updated_at"])

        return Response(InvitationSerializer(invitation).data)

    def post(self, request, token):
        invitation = self.get_invitation(token)

        if not invitation:
            return Response(
                {"error": "Invitation not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if invitation.status != "pending" or invitation.is_expired:
            if invitation.is_expired and invitation.status == "pending":
                invitation.status = "expired"
                invitation.save(update_fields=["status", "updated_at"])

            return Response(
                {"error": "Invitation is no longer active."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not request.user.is_authenticated:
            return Response(
                {
                    "message": "Please log in or sign up with the invited email to accept.",
                    "requires_auth": True,
                    "email": invitation.email,
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        if request.user.email.lower() != invitation.email.lower():
            return Response(
                {"error": "This invitation was sent to a different email address."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            membership, _ = Membership.objects.update_or_create(
                user=request.user,
                organization=invitation.organization,
                defaults={
                    "role": invitation.role,
                    "status": "active",
                    "updated_by": request.user,
                }
            )

            if not membership.created_by:
                membership.created_by = invitation.invited_by
                membership.save(update_fields=["created_by", "updated_at"])

            invitation.status = "accepted"
            invitation.accepted_by = request.user
            invitation.accepted_at = timezone.now()
            invitation.updated_by = request.user
            invitation.save(
                update_fields=(
                    "status",
                    "accepted_by",
                    "accepted_at",
                    "updated_by",
                    "updated_at",
                )
            )

        return Response(
            {
                "message": "Invitation accepted successfully.",
                "organization": str(invitation.organization_id),
            }
        )
