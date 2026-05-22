from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class RefreshTokenApiView(TokenRefreshView):
    pass


class LogoutApiView(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class = TokenRefreshSerializer

    def post(self, request):

        try:

            refresh_token = request.data["refresh"]

            token = RefreshToken(refresh_token)

            token.blacklist()

            return Response(
                {
                    "message": "Logged out successfully"
                }
            )

        except Exception:

            return Response(
                {
                    "message": "Invalid token"
                },
                status=400
            )