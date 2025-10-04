from django.shortcuts import render
from django.views import View
# Create your views here.

class TestView(View):
    http_method_names = ['get']

    def get(self, request):
        return render(request, 'base.html')
