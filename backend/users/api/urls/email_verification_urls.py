from django.urls import path

from users.api.views.email_verification_views import (
    VerifyEmailApiView,
)

urlpatterns = [

    path(
        "verify-email/",
        VerifyEmailApiView.as_view(),
        name="verify-email"
    ),
]
