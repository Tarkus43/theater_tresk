from django.shortcuts import render
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Spectacle
from .api.serializers import SpectacleSerializer

class SpectacleList(APIView):
    def get(self, request):
        spectacles = Spectacle.objects.all()
        serializer = SpectacleSerializer(spectacles, many=True)
        return Response(serializer.data)
    
class SpectacleDetail(APIView):
    def get(self, request, pk):
        try:
            spectacle = Spectacle.objects.get(pk=pk)
        except Spectacle.DoesNotExist:
            return Response({"error": "Spectacle not found"}, status=404)
        
        serializer = SpectacleSerializer(spectacle)
        return Response(serializer.data)
