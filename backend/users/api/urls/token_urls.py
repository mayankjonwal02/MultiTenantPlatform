from django.urls import path

from users.api.views.token_views import (
    RefreshTokenApiView,
    LogoutApiView,
)

urlpatterns = [

    path(
        "refresh/",
        RefreshTokenApiView.as_view(),
        name="token-refresh"
    ),

    path(
        "logout/",
        LogoutApiView.as_view(),
        name="logout"
    ),
]