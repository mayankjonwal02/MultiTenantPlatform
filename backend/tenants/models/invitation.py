import uuid
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone

from common.models import BaseModel
from roles.models.role import Role
from tenants.models.organization import Organization


def default_invitation_expiry():
    return timezone.now() + timedelta(days=7)


class Invitation(BaseModel):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("revoked", "Revoked"),
        ("expired", "Expired"),
    )

    email = models.EmailField()

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="invitations"
    )

    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invitations"
    )

    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="sent_invitations"
    )

    accepted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="accepted_invitations"
    )

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    expires_at = models.DateTimeField(
        default=default_invitation_expiry
    )

    accepted_at = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        indexes = [
            models.Index(fields=("token",)),
            models.Index(fields=("email", "organization")),
        ]

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    def __str__(self):
        return f"{self.email} -> {self.organization}"
