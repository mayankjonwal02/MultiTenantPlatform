from django.db import migrations


def backfill_owner_memberships(apps, schema_editor):
    Organization = apps.get_model("tenants", "Organization")
    Role = apps.get_model("roles", "Role")
    Membership = apps.get_model("tenants", "Membership")

    for organization in Organization.objects.exclude(created_by__isnull=True):
        owner_role, _ = Role.objects.get_or_create(
            organization=organization,
            name="Owner",
            defaults={
                "description": "Organization owner with full access.",
                "is_system": True,
                "created_by_id": organization.created_by_id,
                "updated_by_id": organization.created_by_id,
            }
        )

        Membership.objects.get_or_create(
            user_id=organization.created_by_id,
            organization=organization,
            defaults={
                "role": owner_role,
                "status": "active",
                "created_by_id": organization.created_by_id,
                "updated_by_id": organization.created_by_id,
            }
        )


class Migration(migrations.Migration):

    dependencies = [
        ("tenants", "0003_invitation"),
        ("roles", "0002_initial"),
    ]

    operations = [
        migrations.RunPython(backfill_owner_memberships, migrations.RunPython.noop),
    ]
