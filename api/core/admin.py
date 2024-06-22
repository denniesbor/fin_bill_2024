from django.contrib import admin
from .models import PoliceLocation

@admin.register(PoliceLocation)
class PoliceLocationAdmin(admin.ModelAdmin):
    list_display = ('label', 'latitude', 'longitude', 'date_created', 'date_updated')
    search_fields = ('label',)
    list_filter = ('date_created', 'date_updated')
    ordering = ('-date_created',)
