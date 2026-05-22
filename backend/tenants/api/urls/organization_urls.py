from django.urls import path

from tenants.api.views.organization_views import (
    OrganizationCreateView,
    OrganizationListView,
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
]
