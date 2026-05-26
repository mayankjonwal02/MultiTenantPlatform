from django.db import models

from common.models import BaseModel
from roles.models.role import Role


class Permission(BaseModel):
    """
    Permission model for managing role permissions.
    Permissions are scoped to organizations through the Role model.
    """

    PERMISSION_CHOICES = [
        ('invite_members', 'Invite Members'),
        ('manage_members', 'Manage Members'),
        ('manage_roles', 'Manage Roles'),
        ('manage_organization', 'Manage Organization'),
    ]

    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name="permissions"
    )

    permission = models.CharField(
        max_length=100,
        choices=PERMISSION_CHOICES
    )

    class Meta:
        unique_together = (
            "role",
            "permission"
        )
        verbose_name = "Role Permission"
        verbose_name_plural = "Role Permissions"

    def __str__(self):
        return f"{self.role.name} - {self.get_permission_display()}"
