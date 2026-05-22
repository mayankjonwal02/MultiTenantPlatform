from rest_framework import serializers


class ResetPasswordSerializer(serializers.Serializer):

    token = serializers.CharField()

    password = serializers.CharField(
        min_length=8
    )