from rest_framework.routers import DefaultRouter

from tenants.api.views.membership_views import (
    MembershipViewSet
)

router = DefaultRouter()

router.register(
    r"",
    MembershipViewSet,
    basename="memberships"
)

urlpatterns = router.urls