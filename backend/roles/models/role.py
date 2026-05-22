from django.db import models

from common.models import BaseModel
from tenants.models.organization import Organization


class Role(BaseModel):

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="roles"
    )

    name = models.CharField(
        max_length=100
    )

    description = models.TextField(
        blank=True
    )

    is_system = models.BooleanField(
        default=False
    )

    class Meta:

        unique_together = (
            "organization",
            "name"
        )

    def __str__(self):
        return self.name