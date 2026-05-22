from django.db import models

from common.models import BaseModel


class Organization(BaseModel):

    name = models.CharField(
        max_length=255
    )

    slug = models.SlugField(
        unique=True
    )

    logo = models.ImageField(
        upload_to="organization_logos/",
        null=True,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    subscription_plan = models.CharField(
        max_length=100,
        default="free"
    )

    subscription_status = models.CharField(
        max_length=100,
        default="active"
    )

    def __str__(self):
        return self.name