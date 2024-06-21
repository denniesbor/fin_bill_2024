import requests
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Marker
from .serializers import MarkerSerializer
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class MarkerViewSet(viewsets.ModelViewSet):
    queryset = Marker.objects.all()
    serializer_class = MarkerSerializer

    def perform_create(self, serializer):
        latitude = self.request.data.get('latitude')
        longitude = self.request.data.get('longitude')
        town = self.get_town_name(latitude, longitude)
        serializer.save(town=town)

    def perform_update(self, serializer):
        latitude = self.request.data.get('latitude')
        longitude = self.request.data.get('longitude')
        town = self.get_town_name(latitude, longitude)
        serializer.save(town=town)

    def get_town_name(self, latitude, longitude):
        api_key = os.getenv('GOOGLE_MAPS_API_KEY')
        url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={api_key}"
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200 and data['results']:
            for component in data['results'][0]['address_components']:
                if 'locality' in component['types']:
                    return component['long_name']
        return ""

    @action(detail=False, methods=['get'])
    def nearby(self, request):
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')

        if not latitude or not longitude:
            return Response({"error": "Latitude and Longitude required"}, status=400)

        api_key = os.getenv('GOOGLE_MAPS_API_KEY')
        origin = f"{latitude},{longitude}"
        destinations = "|".join([f"{marker.latitude},{marker.longitude}" for marker in self.queryset])
        
        url = f"https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins={origin}&destinations={destinations}&key={api_key}"
        response = requests.get(url)
        data = response.json()

        if response.status_code != 200 or data['status'] != 'OK':
            return Response({"error": "Error retrieving distances from Google Maps API"}, status=response.status_code)

        nearby_markers = []
        for index, element in enumerate(data['rows'][0]['elements']):
            if element['status'] == 'OK' and element['distance']['value'] <= 5000:  # 5 km radius
                nearby_markers.append(self.queryset[index])

        serializer = self.get_serializer(nearby_markers, many=True)
        return Response(serializer.data)
