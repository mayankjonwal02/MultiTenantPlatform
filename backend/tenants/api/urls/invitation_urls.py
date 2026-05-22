from django.urls import path

from tenants.api.views.invitation_views import (
    InvitationAcceptApiView,
    InvitationApiView,
)

urlpatterns = [

    path(
        "",
        InvitationApiView.as_view(),
        name="invite-user"
    ),
    path(
        "<uuid:token>/",
        InvitationAcceptApiView.as_view(),
        name="accept-invitation"
    ),
]
