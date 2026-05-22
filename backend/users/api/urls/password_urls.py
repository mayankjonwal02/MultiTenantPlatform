from django.urls import path

from users.api.views.password_views import (
    ForgotPasswordApiView,
    ResetPasswordApiView,
)

urlpatterns = [

    path(
        "forgot-password/",
        ForgotPasswordApiView.as_view(),
        name="forgot-password"
    ),

    path(
        "reset-password/",
        ResetPasswordApiView.as_view(),
        name="reset-password"
    ),
]