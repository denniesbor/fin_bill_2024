from rest_framework import serializers
from .models import PoliceLocation

class PoliceLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PoliceLocation
        fields = ['label', 'latitude', 'longitude', 'date_created', 'date_updated']
