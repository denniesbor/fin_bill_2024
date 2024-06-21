from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import MarkerViewSet  # Adjust the import to match your directory structure

router = DefaultRouter()
router.register(r'markers', MarkerViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
]
