from rest_framework.permissions import BasePermission

from tenants.models.membership import Membership


class IsOrganizationMember(BasePermission):

    def has_permission(self, request, view):

        tenant = getattr(
            request,
            "tenant",
            None
        )

        if not tenant:
            return False

        return Membership.objects.filter(
            user=request.user,
            organization=tenant,
            status="active"
        ).exists()