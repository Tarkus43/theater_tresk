from rest_framework import serializers
from theater.models import Spectacle, Ticket, Partner

class SpectacleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spectacle
        fields = "__all__"

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = "__all__"

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = "__all__"
