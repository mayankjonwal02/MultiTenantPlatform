from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from roles.permissions.role_permission import (
    IsOrganizationMember
)

from tenants.models.membership import Membership

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
