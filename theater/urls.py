from django.urls import path
from .views import SpectacleList, SpectacleDetail, BuyTicketView

urlpatterns = [
    path("spectacles/", SpectacleList.as_view(), name="spectacle_list"),
    path("spectacles/<int:pk>/", SpectacleDetail.as_view(), name="spectacle_detail"),
    path("spectacles/<int:pk>/buy_ticket", BuyTicketView.as_view(), name="buy_ticket"),

]
