from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
import os

from rest_framework_simplejwt.tokens import RefreshToken

from users.api.serializers.login_serializer import LoginSerializer
from users.api.serializers.signup_serializer import SignupSerializer
from users.tasks import enqueue_task, send_verification_email_task


class SignupView(APIView):

    permission_classes = []
    authentication_classes = []
    serializer_class = SignupSerializer

    def post(self, request):

        serializer = SignupSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        
        # Generate verification token
        token = default_token_generator.make_token(user)
        
        # Create verification link (update with your frontend URL)
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        verification_link = f"{frontend_url}/verify-email?token={token}&user_id={user.id}"
        
        user_name = f"{user.first_name} {user.last_name}".strip() or user.email
        
        # Send verification email asynchronously
        enqueue_task(send_verification_email_task, user.email, user_name, verification_link)

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user_id": str(user.id),
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "message": "Signup successful. Please check your email to verify your account."
            },
            status=status.HTTP_201_CREATED
        )


class LoginView(APIView):

    permission_classes = []
    authentication_classes = []
    serializer_class = LoginSerializer

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user_id": str(user.id),
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )
