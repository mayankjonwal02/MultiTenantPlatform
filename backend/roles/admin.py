from django.contrib import admin

from .models import Role


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization', 'is_system')
    search_fields = ('name', 'organization__name')
    list_filter = ('is_system',)
