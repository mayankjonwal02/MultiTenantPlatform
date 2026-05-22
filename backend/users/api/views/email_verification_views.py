from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
import uuid

from users.api.serializers.email_verification_serializer import (
    EmailVerificationSerializer
)

from users.models import User


class VerifyEmailApiView(APIView):

    permission_classes = []
    authentication_classes = []
    serializer_class = EmailVerificationSerializer

    def post(self, request):

        serializer = EmailVerificationSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {"error": "User ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(id=uuid.UUID(user_id))
            
            # Verify token is valid
            if default_token_generator.check_token(user, token):
                user.is_verified = True
                user.save()
                
                return Response(
                    {"message": "Email verified successfully"}
                )
            else:
                return Response(
                    {"error": "Invalid or expired token"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except (User.DoesNotExist, ValueError):
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )