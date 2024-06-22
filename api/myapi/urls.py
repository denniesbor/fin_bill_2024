from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import PoliceLocationViewSet
from django.contrib import admin

router = DefaultRouter()
router.register(r'police-locations', PoliceLocationViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    path("admin/", admin.site.urls),
]
