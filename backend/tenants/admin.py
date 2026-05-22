from django.contrib import admin

from .models import Membership, Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'subscription_plan', 'subscription_status')
    search_fields = ('name', 'slug')
    list_filter = ('is_active', 'subscription_plan', 'subscription_status')


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'organization', 'role', 'status', 'joined_at')
    list_filter = ('status',)
    search_fields = ('user__email', 'organization__name', 'role__name')
