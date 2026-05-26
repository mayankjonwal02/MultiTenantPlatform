from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from roles.models.role import Role
from roles.models.permission import Permission
from roles.api.serializers.role_serializer import (
    RoleSerializer,
    RoleCreateUpdateSerializer,
    PermissionSerializer,
)
from tenants.models.membership import Membership


class IsOrganizationAdmin(IsAuthenticated):
    """
    Custom permission to check if user is an admin of the organization.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        organization = getattr(request, "tenant", None)
        if not organization:
            return False
        
        membership = Membership.objects.filter(
            user=request.user,
            organization=organization,
            status="active",
            role__name="Owner"
        ).exists()
        
        return membership


class RoleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing roles within an organization.
    Only organization admins (with Owner role) can create, update, or delete roles.
    System roles are read-only.
    """

    permission_classes = [IsAuthenticated]
    queryset = Role.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return RoleCreateUpdateSerializer
        return RoleSerializer

    def get_queryset(self):
        """
        Filter roles by the current organization from request.tenant
        """
        organization = getattr(self.request, "tenant", None)
        if not organization:
            return Role.objects.none()
        
        return Role.objects.filter(
            organization=organization
        ).prefetch_related('permissions')

    def create(self, request, *args, **kwargs):
        """
        Create a new role (admin only).
        """
        if not self._is_org_admin():
            return Response(
                {"error": "Only organization admins can create roles."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        organization = getattr(request, "tenant", None)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        validated_data = serializer.validated_data.copy()
        validated_data['organization'] = organization
        validated_data['is_system'] = False
        validated_data['created_by'] = request.user
        validated_data['updated_by'] = request.user
        
        permissions_data = validated_data.pop('permissions', [])
        
        role = Role.objects.create(**validated_data)
        
        for permission_code in permissions_data:
            if permission_code in [code for code, _ in Permission.PERMISSION_CHOICES]:
                Permission.objects.create(
                    role=role,
                    permission=permission_code,
                    created_by=request.user,
                    updated_by=request.user,
                )
        
        return Response(
            RoleSerializer(role).data,
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        """
        Update a role (admin only). Cannot update system roles.
        """
        if not self._is_org_admin():
            return Response(
                {"error": "Only organization admins can update roles."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        role = self.get_object()
        
        if role.is_system:
            return Response(
                {"error": "System roles cannot be modified."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a role (admin only). Only custom roles can be deleted.
        """
        if not self._is_org_admin():
            return Response(
                {"error": "Only organization admins can delete roles."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        role = self.get_object()
        
        if role.is_system:
            return Response(
                {"error": "System roles cannot be deleted."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def permissions(self, request, pk=None):
        """
        Update permissions for a role.
        Expects: {"permissions": ["permission_code1", "permission_code2"]}
        """
        if not self._is_org_admin():
            return Response(
                {"error": "Only organization admins can manage permissions."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        role = self.get_object()
        
        if role.is_system:
            return Response(
                {"error": "System role permissions cannot be modified."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        permissions_data = request.data.get('permissions', [])
        
        if not isinstance(permissions_data, list):
            return Response(
                {"error": "permissions must be a list"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        role.permissions.all().delete()
        
        for permission_code in permissions_data:
            if permission_code not in [code for code, _ in Permission.PERMISSION_CHOICES]:
                return Response(
                    {"error": f"Invalid permission: {permission_code}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            Permission.objects.create(
                role=role,
                permission=permission_code,
                created_by=request.user,
                updated_by=request.user,
            )
        
        return Response(
            RoleSerializer(role).data,
            status=status.HTTP_200_OK
        )

    def _is_org_admin(self):
        """
        Check if the current user is an admin of the organization.
        """
        organization = getattr(self.request, "tenant", None)
        if not organization:
            return False
        
        return Membership.objects.filter(
            user=self.request.user,
            organization=organization,
            status="active",
            role__name="Owner"
        ).exists()
