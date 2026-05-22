from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.db.models import Q

from roles.models.role import Role

from tenants.api.serializers.organization_serializer import (
    OrganizationSerializer,
)
from tenants.models.membership import Membership
from tenants.models.organization import Organization


class OrganizationListView(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer

    def get(self, request):
        organizations = Organization.objects.filter(
            Q(
                memberships__user=request.user,
                memberships__status="active",
            )
            | Q(created_by=request.user),
            is_active=True,
        ).distinct().order_by("name")

        return Response(
            OrganizationSerializer(organizations, many=True).data
        )


class OrganizationCreateView(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer

    def post(self, request):

        serializer = OrganizationSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            organization = serializer.save(
                created_by=request.user,
                updated_by=request.user,
            )

            owner_role, _ = Role.objects.get_or_create(
                organization=organization,
                name="Owner",
                defaults={
                    "description": "Organization owner with full access.",
                    "is_system": True,
                    "created_by": request.user,
                    "updated_by": request.user,
                }
            )

            Membership.objects.get_or_create(
                user=request.user,
                organization=organization,
                defaults={
                    "role": owner_role,
                    "status": "active",
                    "created_by": request.user,
                    "updated_by": request.user,
                }
            )

        return Response(
            OrganizationSerializer(organization).data,
            status=status.HTTP_201_CREATED
        )
