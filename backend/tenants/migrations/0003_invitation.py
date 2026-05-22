# Generated manually for invitation acceptance flow.

import django.db.models.deletion
import tenants.models.invitation
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('roles', '0002_initial'),
        ('tenants', '0002_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('email', models.EmailField(max_length=254)),
                ('token', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('revoked', 'Revoked'), ('expired', 'Expired')], default='pending', max_length=20)),
                ('expires_at', models.DateTimeField(default=tenants.models.invitation.default_invitation_expiry)),
                ('accepted_at', models.DateTimeField(blank=True, null=True)),
                ('accepted_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='accepted_invitations', to=settings.AUTH_USER_MODEL)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_%(class)s', to=settings.AUTH_USER_MODEL)),
                ('invited_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sent_invitations', to=settings.AUTH_USER_MODEL)),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invitations', to='tenants.organization')),
                ('role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='invitations', to='roles.role')),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='updated_%(class)s', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'indexes': [
                    models.Index(fields=['token'], name='tenants_inv_token_9e2edb_idx'),
                    models.Index(fields=['email', 'organization'], name='tenants_inv_email_5232cc_idx'),
                ],
            },
        ),
    ]
