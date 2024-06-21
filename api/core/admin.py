from django.contrib import admin
from .models import Marker

@admin.register(Marker)
class MarkerAdmin(admin.ModelAdmin):
    list_display = ('label', 'latitude', 'longitude', 'town', 'created_at', 'updated_at')
    search_fields = ('label', 'town')
    list_filter = ('town', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_at = timezone.now()
        obj.updated_at = timezone.now()
        super().save_model(request, obj, form, change)
