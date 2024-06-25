from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import PoliceLocationViewSet, MediaFileViewSet
from django.contrib import admin

router = DefaultRouter()
router.register(r'police-locations', PoliceLocationViewSet)
router.register(r'upload', MediaFileViewSet, basename='mediafile')


urlpatterns = [
    path('api/', include(router.urls)),
    path("admin/", admin.site.urls),
]
