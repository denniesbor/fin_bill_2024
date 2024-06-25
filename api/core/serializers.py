from rest_framework import serializers
from .models import PoliceLocation, MediaFile

class PoliceLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PoliceLocation
        fields = ['label', 'latitude', 'longitude', 'date_created', 'date_updated']

class MediaFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaFile
        fields = '__all__'