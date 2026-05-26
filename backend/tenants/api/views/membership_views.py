from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from roles.permissions.role_permission import (
    IsOrganizationMember
)

from tenants.models.membership import Membership
from tenants.models.organization import Organization

from tenants.api.serializers.membership_serializer import (
    MembershipSerializer
)


class MembershipViewSet(ModelViewSet):

    serializer_class = MembershipSerializer

    permission_classes = [
        IsAuthenticated,
        IsOrganizationMember
    ]

    def get_queryset(self):

        tenant = getattr(
            self.request,
            "tenant",
            None
        )

        if not tenant:
            return Membership.objects.none()

        return Membership.objects.filter(
            organization=tenant
        ).order_by("created_at")

    def partial_update(self, request, *args, **kwargs):
        """
        Allow updating member role if the user is an organization admin.
        """
        if not self._is_org_admin(request):
            return Response(
                {"error": "Only organization admins can update member roles."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        membership = self.get_object()
        
        if 'role' in request.data:
            role_id = request.data.get('role')
            organization = membership.organization
            
            from roles.models.role import Role
            
            role = Role.objects.filter(
                id=role_id,
                organization=organization
            ).first()
            
            if not role:
                return Response(
                    {"error": "Role does not belong to this organization."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        return super().partial_update(request, *args, **kwargs)

    def _is_org_admin(self, request):
        """
        Check if the current user is an admin of the organization.
        """
        organization = getattr(request, "tenant", None)
        if not organization:
            return False
        
        return Membership.objects.filter(
            user=request.user,
            organization=organization,
            status="active",
            role__name="Owner"
        ).exists()
