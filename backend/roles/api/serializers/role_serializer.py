from rest_framework import serializers

from roles.models.role import Role
from roles.models.permission import Permission


class PermissionSerializer(serializers.ModelSerializer):
    
    permission_display = serializers.CharField(
        source="get_permission_display",
        read_only=True
    )

    class Meta:
        model = Permission
        fields = (
            "id",
            "permission",
            "permission_display",
            "created_at",
        )
        read_only_fields = (
            "id",
            "permission_display",
            "created_at",
        )


class RoleSerializer(serializers.ModelSerializer):

    permissions = PermissionSerializer(
        many=True,
        read_only=True
    )

    organization_name = serializers.CharField(
        source="organization.name",
        read_only=True
    )

    class Meta:
        model = Role
        fields = (
            "id",
            "name",
            "description",
            "organization",
            "organization_name",
            "is_system",
            "permissions",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "is_system",
            "organization_name",
            "created_at",
            "updated_at",
        )


class RoleCreateUpdateSerializer(serializers.ModelSerializer):

    permissions = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of permission codes to assign to this role"
    )

    class Meta:
        model = Role
        fields = (
            "name",
            "description",
            "permissions",
        )

    def create(self, validated_data):
        permissions_data = validated_data.pop('permissions', [])
        role = Role.objects.create(**validated_data)
        
        for permission_code in permissions_data:
            if permission_code in [code for code, _ in Permission.PERMISSION_CHOICES]:
                Permission.objects.create(
                    role=role,
                    permission=permission_code
                )
        
        return role

    def update(self, instance, validated_data):
        permissions_data = validated_data.pop('permissions', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if permissions_data is not None:
            instance.permissions.all().delete()
            for permission_code in permissions_data:
                if permission_code in [code for code, _ in Permission.PERMISSION_CHOICES]:
                    Permission.objects.create(
                        role=instance,
                        permission=permission_code
                    )
        
        return instance
