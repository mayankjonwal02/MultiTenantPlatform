from rest_framework import serializers

from tenants.models.membership import Membership


class MembershipSerializer(serializers.ModelSerializer):

    organization_name = serializers.CharField(
        source="organization.name",
        read_only=True
    )

    user_email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    user_name = serializers.SerializerMethodField()

    role_name = serializers.CharField(
        source="role.name",
        read_only=True
    )

    class Meta:

        model = Membership

        fields = [
            "id",
            "user",
            "user_email",
            "user_name",
            "organization",
            "organization_name",
            "role",
            "role_name",
            "status",
            "joined_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "user_email",
            "user_name",
            "organization",
            "organization_name",
            "role_name",
            "joined_at",
            "created_at",
            "updated_at",
        ]

    def get_user_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.email
