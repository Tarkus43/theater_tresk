from django.urls import path
from .views import SpectacleList, SpectacleDetail

urlpatterns = [
    path("spectacles/", SpectacleList.as_view(), name="spectacle-list"),
    path("spectacles/<int:pk>/", SpectacleDetail.as_view(), name="spectacle-detail"),
]
