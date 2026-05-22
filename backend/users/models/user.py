import uuid

from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone

from users.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    email = models.EmailField(
        unique=True
    )

    first_name = models.CharField(
        max_length=255
    )

    last_name = models.CharField(
        max_length=255
    )

    is_active = models.BooleanField(
        default=True
    )

    is_staff = models.BooleanField(
        default=False
    )

    is_verified = models.BooleanField(
        default=False
    )

    date_joined = models.DateTimeField(
        default=timezone.now
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email