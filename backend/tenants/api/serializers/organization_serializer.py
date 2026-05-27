from rest_framework import serializers

from tenants.models.organization import Organization
from tenants.models.membership import Membership


class OrganizationSerializer(serializers.ModelSerializer):

    class Meta:

        model = Organization

        fields = (
            "id",
            "name",
            "slug",
            "logo",
            "subscription_plan",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class OrganizationDetailSerializer(serializers.ModelSerializer):

    owner_id = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()
    owner_email = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
            "slug",
            "logo",
            "subscription_plan",
            "created_at",
            "owner_id",
            "owner_name",
            "owner_email",
            "member_count",
            "is_owner",
        )
        read_only_fields = fields

    def _get_owner_membership(self, obj):
        return (
            Membership.objects
            .filter(organization=obj, role__name="Owner", status="active")
            .select_related("user")
            .first()
        )

    def get_owner_id(self, obj):
        m = self._get_owner_membership(obj)
        return str(m.user.id) if m else None

    def get_owner_name(self, obj):
        m = self._get_owner_membership(obj)
        if not m:
            return None
        full_name = f"{m.user.first_name} {m.user.last_name}".strip()
        return full_name or m.user.email

    def get_owner_email(self, obj):
        m = self._get_owner_membership(obj)
        return m.user.email if m else None

    def get_member_count(self, obj):
        return Membership.objects.filter(organization=obj, status="active").count()

    def get_is_owner(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return Membership.objects.filter(
            organization=obj,
            user=request.user,
            role__name="Owner",
            status="active",
        ).exists()