from django.db import models
from django.utils import timezone

class Marker(models.Model):
    label = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    town = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Marker {self.label} at ({self.latitude}, {self.longitude})"
