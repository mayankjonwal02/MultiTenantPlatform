from rest_framework import serializers

from users.models import User


class SignupSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:

        model = User

        fields = (
            "email",
            "first_name",
            "last_name",
            "password",
        )

    def create(self, validated_data):

        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user