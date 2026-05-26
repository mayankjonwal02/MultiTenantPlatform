from django.contrib import admin

from audit_logs.models.audit_log import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "resource_type", "created_at")
    list_filter = ("action", "resource_type")
    search_fields = ("user__email", "resource_type")
    readonly_fields = ("user", "action", "resource_type", "resource_id", "metadata", "created_at")
