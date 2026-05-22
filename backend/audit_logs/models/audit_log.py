from django.db import models

from common.models import BaseModel

from tenants.models.organization import Organization

from users.models.user import User


class AuditLog(BaseModel):

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    action = models.CharField(
        max_length=255
    )

    resource_type = models.CharField(
        max_length=255
    )

    resource_id = models.CharField(
        max_length=255
    )

    metadata = models.JSONField(
        default=dict
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True
    )

    def __str__(self):

        return self.action