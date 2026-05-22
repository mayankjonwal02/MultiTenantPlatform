from rest_framework import serializers

from tenants.models.invitation import Invitation


class InvitationCreateSerializer(serializers.Serializer):

    email = serializers.EmailField()

    role_id = serializers.UUIDField(required=False)

    organization_id = serializers.UUIDField(required=False)


class InvitationSerializer(serializers.ModelSerializer):

    organization_name = serializers.CharField(
        source="organization.name",
        read_only=True
    )

    class Meta:
        model = Invitation
        fields = (
            "id",
            "email",
            "token",
            "organization",
            "organization_name",
            "role",
            "status",
            "created_at",
            "expires_at",
        )
        read_only_fields = fields
