from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404

from roles.models.role import Role

from tenants.api.serializers.organization_serializer import (
    OrganizationSerializer,
    OrganizationDetailSerializer,
)
from tenants.models.membership import Membership
from tenants.models.organization import Organization

from users.tasks import enqueue_task, send_ownership_transfer_email_task


class OrganizationListView(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer

    def get(self, request):
        organizations = Organization.objects.filter(
            Q(
                memberships__user=request.user,
                memberships__status="active",
            )
            | Q(created_by=request.user),
            is_active=True,
        ).distinct().order_by("name")

        return Response(
            OrganizationSerializer(organizations, many=True).data
        )


class OrganizationCreateView(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer

    def post(self, request):

        serializer = OrganizationSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            organization = serializer.save(
                created_by=request.user,
                updated_by=request.user,
            )

            owner_role, _ = Role.objects.get_or_create(
                organization=organization,
                name="Owner",
                defaults={
                    "description": "Organization owner with full access.",
                    "is_system": True,
                    "created_by": request.user,
                    "updated_by": request.user,
                }
            )

            Membership.objects.get_or_create(
                user=request.user,
                organization=organization,
                defaults={
                    "role": owner_role,
                    "status": "active",
                    "created_by": request.user,
                    "updated_by": request.user,
                }
            )

        return Response(
            OrganizationSerializer(organization).data,
            status=status.HTTP_201_CREATED
        )


class OrganizationDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        organization = get_object_or_404(Organization, id=pk, is_active=True)

        is_member = Membership.objects.filter(
            user=request.user,
            organization=organization,
            status="active",
        ).exists()
        is_creator = (organization.created_by_id == request.user.id)

        if not is_member and not is_creator:
            return Response(
                {"error": "You do not have access to this organization."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OrganizationDetailSerializer(
            organization,
            context={"request": request}
        )
        return Response(serializer.data)

    def put(self, request, pk):
        organization = get_object_or_404(Organization, id=pk, is_active=True)

        is_member = Membership.objects.filter(
            user=request.user,
            organization=organization,
            status="active",
        ).exists()
        if not is_member:
            return Response(
                {"error": "You do not have access to this organization."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OrganizationSerializer(
            organization,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)


class TransferOwnershipView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        organization = get_object_or_404(Organization, id=pk, is_active=True)

        owner_membership = Membership.objects.filter(
            user=request.user,
            organization=organization,
            role__name="Owner",
            status="active",
        ).first()

        if not owner_membership:
            return Response(
                {"error": "Only the organization owner can transfer ownership."},
                status=status.HTTP_403_FORBIDDEN
            )

        membership_id = request.data.get("membership_id")
        if not membership_id:
            return Response(
                {"error": "membership_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_owner_membership = Membership.objects.filter(
            id=membership_id,
            organization=organization,
            status="active",
        ).exclude(user=request.user).select_related("user").first()

        if not new_owner_membership:
            return Response(
                {"error": "Invalid membership. User must be an active member of this organization."},
                status=status.HTTP_400_BAD_REQUEST
            )

        owner_role = Role.objects.get(organization=organization, name="Owner")

        member_role, _ = Role.objects.get_or_create(
            organization=organization,
            name="Member",
            defaults={
                "description": "Standard organization member.",
                "is_system": True,
                "created_by": request.user,
                "updated_by": request.user,
            }
        )

        with transaction.atomic():
            owner_membership.role = member_role
            owner_membership.updated_by = request.user
            owner_membership.save(update_fields=["role", "updated_by", "updated_at"])

            new_owner_membership.role = owner_role
            new_owner_membership.updated_by = request.user
            new_owner_membership.save(update_fields=["role", "updated_by", "updated_at"])

        new_owner = new_owner_membership.user
        new_owner_name = f"{new_owner.first_name} {new_owner.last_name}".strip() or new_owner.email
        previous_owner_name = (
            f"{request.user.first_name} {request.user.last_name}".strip()
            or request.user.email
        )

        enqueue_task(
            send_ownership_transfer_email_task,
            new_owner.email,
            new_owner_name,
            organization.name,
            previous_owner_name,
        )

        return Response({"message": "Ownership transferred successfully."})
