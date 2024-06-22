from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.utils import timezone

class PoliceLocation(models.Model):
    label = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    point = models.PointField(geography=True, srid=4326, default=Point(0.0, 0.0))
    date_created = models.DateTimeField(default=timezone.now, unique=True, primary_key=True)
    date_updated = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        self.point = Point(self.longitude, self.latitude)
        if not self.date_created:
            self.date_created = timezone.now()
        self.date_updated = timezone.now()
        super(PoliceLocation, self).save(*args, **kwargs)
