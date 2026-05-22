from rest_framework import serializers


class EmailVerificationSerializer(serializers.Serializer):

    token = serializers.CharField()