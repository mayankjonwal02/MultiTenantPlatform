from rest_framework import serializers

from tenants.models.organization import Organization


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