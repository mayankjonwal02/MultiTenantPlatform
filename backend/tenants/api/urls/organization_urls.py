from django.urls import path

from tenants.api.views.organization_views import (
    OrganizationCreateView,
    OrganizationDetailView,
    OrganizationListView,
    TransferOwnershipView,
)


urlpatterns = [

    path(
        "",
        OrganizationListView.as_view(),
        name="organization-list"
    ),

    path(
        "create/",
        OrganizationCreateView.as_view(),
        name="organization-create"
    ),

    path(
        "<uuid:pk>/",
        OrganizationDetailView.as_view(),
        name="organization-detail"
    ),

    path(
        "<uuid:pk>/transfer-ownership/",
        TransferOwnershipView.as_view(),
        name="organization-transfer-ownership"
    ),
]
