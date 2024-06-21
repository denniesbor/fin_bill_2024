from rest_framework import serializers
from .models import Marker

class MarkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marker
        fields = ['id', 'label', 'latitude', 'longitude', 'town', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
