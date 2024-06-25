from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.utils import timezone
from django.utils.deconstruct import deconstructible
import uuid

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

@deconstructible
class PathAndRename:
    def __init__(self, sub_path):
        self.sub_path = sub_path

    def __call__(self, instance, filename):
        # Get the file extension
        ext = filename.split('.')[-1]
        # Set the filename as a UUID
        filename = f"{uuid.uuid4()}.{ext}"
        # Return the whole path to the file
        return f"{self.sub_path}/{filename}"

def upload_to(instance, filename):
    return PathAndRename(instance.city.name)(instance, filename)

class City(models.Model):
    name = models.CharField(max_length=100)
    location = models.PointField()

    def __str__(self):
        return self.name

class MediaFile(models.Model):
    file = models.FileField(upload_to=upload_to)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        # Generate a unique file name using city name and a UUID
        self.file.name = upload_to(self, self.file.name)
        super().save(*args, **kwargs)
    