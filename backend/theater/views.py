from django.shortcuts import render
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Spectacle
from api.serializers import SpectacleSerializer

class SpectacleList(APIView):
    def get(self, request):
        spectacles = Spectacle.objects.all()
        serializer = SpectacleSerializer(spectacles, many=True)
        return Response(serializer.data)

class TestView(View):
    http_method_names = ['get']

    def get(self, request):
        return render(request, 'base.html')
