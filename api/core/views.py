from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from .models import PoliceLocation
from .serializers import PoliceLocationSerializer
from django.utils import timezone
from datetime import datetime

class PoliceLocationViewSet(viewsets.ModelViewSet):
    queryset = PoliceLocation.objects.all()
    serializer_class = PoliceLocationSerializer

    def create(self, request, *args, **kwargs):
        markers = request.data.get('markers', [])
        deleted_markers = request.data.get('deletedMarkers', [])

        # Convert deleted markers to a set of datetime objects
        deleted_ids = set(datetime.fromisoformat(date["date_created"].replace("Z", "+00:00")) for date in deleted_markers)

        # Delete markers in deletedMarkers
        if deleted_ids:
            PoliceLocation.objects.filter(date_created__in=deleted_ids).delete()

        for marker in markers:
            date_created = marker.get('date_created')
            if date_created:
                print(date_created)
                date_created = datetime.fromisoformat(date_created.replace("Z", "+00:00"))
                user_location = Point(marker['longitude'], marker['latitude'], srid=4326)
                existing_markers = PoliceLocation.objects.annotate(distance=Distance('point', user_location)).filter(distance__lte=100)

                if existing_markers.exists():
                    # If a marker exists within 100 meters, skip updating or creating
                    continue

                # Update or create marker with same date_created
                PoliceLocation.objects.update_or_create(
                    date_created=date_created,
                    defaults={
                        'label': marker['label'],
                        'latitude': marker['latitude'],
                        'longitude': marker['longitude'],
                        'date_updated': timezone.now(),
                    }
                )
            else:
                user_location = Point(marker['longitude'], marker['latitude'], srid=4326)
                existing_markers = PoliceLocation.objects.annotate(distance=Distance('point', user_location)).filter(distance__lte=100)

                if existing_markers.exists():
                    # Skip creating a new marker if one exists within 100 meters
                    continue

                PoliceLocation.objects.create(
                    label=marker['label'],
                    latitude=marker['latitude'],
                    longitude=marker['longitude'],
                    date_created=timezone.now(),
                    date_updated=timezone.now(),
                )

        return Response({'status': 'success'}, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')
        if latitude and longitude:
            user_location = Point(float(longitude), float(latitude), srid=4326)
            queryset = self.queryset.annotate(distance=Distance('point', user_location)).filter(distance__lte=5000)
        else:
            queryset = self.queryset.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
