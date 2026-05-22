from django.db import models

from common.models import BaseModel
from users.models.user import User
from roles.models.role import Role
from tenants.models.organization import Organization


class Membership(BaseModel):

    STATUS_CHOICES = (
        ("invited", "Invited"),
        ("active", "Active"),
        ("suspended", "Suspended"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="memberships"
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="memberships"
    )

    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active"
    )

    joined_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        unique_together = (
            "user",
            "organization"
        )