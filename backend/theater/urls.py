from django.urls import path
from .views import SpectacleList

urlpatterns = [
    path("spectacles/", SpectacleList.as_view(), name="spectacle-list"),
]
