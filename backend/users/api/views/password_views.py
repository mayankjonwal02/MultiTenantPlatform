from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
import os

from users.api.serializers.forgot_password_serializer import (
    ForgotPasswordSerializer
)

from users.api.serializers.reset_password_serializer import (
    ResetPasswordSerializer
)

from users.models import User
from users.tasks import enqueue_task, send_password_reset_email_task


class ForgotPasswordApiView(APIView):

    permission_classes = []
    authentication_classes = []
    serializer_class = ForgotPasswordSerializer

    def post(self, request):

        serializer = ForgotPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
            
            # Generate password reset token
            token = default_token_generator.make_token(user)
            
            # Create reset link (update with your frontend URL)
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
            reset_link = f"{frontend_url}/reset-password?token={token}&email={email}"
            
            user_name = f"{user.first_name} {user.last_name}".strip() or user.email
            
            # Send email asynchronously using Celery
            enqueue_task(send_password_reset_email_task, email, user_name, reset_link)
            
        except User.DoesNotExist:
            # Don't reveal if email exists for security reasons
            pass

        return Response(
            {
                "message": "If an account exists with this email, a password reset link will be sent"
            }
        )


class ResetPasswordApiView(APIView):

    permission_classes = []
    authentication_classes = []
    serializer_class = ResetPasswordSerializer

    def post(self, request):

        serializer = ResetPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']
        email = request.data.get('email')
        
        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            
            # Verify token is valid
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                
                return Response(
                    {"message": "Password reset successful"}
                )
            else:
                return Response(
                    {"error": "Invalid or expired token"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
