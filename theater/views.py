from django.shortcuts import render
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import Spectacle
from .api.serializers import SpectacleSerializer, TicketSerializer

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
    


class BuyTicketView(APIView):
    serializer_class = TicketSerializer

    def post(self, request, pk):
        try:
            form_data = request.data
            spectacle = Spectacle.objects.get(pk=form_data['id'])

        except Spectacle.DoesNotExist:
            return Response(
                {"status": "error", "message": "Spectacle not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.serializer_class(data={
            "spectacle": spectacle.id,
            "name": form_data.get("name"),
            "surname": form_data.get("surname"),
            "email": form_data.get("email"),
            "quantity": form_data.get("quantity", 1),
        })

        if serializer.is_valid():
            try:
                ticket = serializer.save()

                
                subject = f"Подтверждение покупки — {ticket.spectacle.title}"
                message = (
                    f"Здравствуйте, {ticket.name} {ticket.surname}!\n\n"
                    f"Вы успешно купили {ticket.quantity} билет(ов) на спектакль «{ticket.spectacle.title}».\n"
                    f"Дата: {getattr(ticket.spectacle, 'date', 'уточняется')}\n"
                    f"Место: {getattr(ticket.spectacle, 'location', 'уточняется')}\n\n"
                    f"Осталось билетов: {ticket.spectacle.tickets_available}\n\n"
                    "Спасибо, что выбрали Театр Трёск!\n"
                )
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL, 
                    [ticket.email],                
                    fail_silently=False,
)



                return Response({
                    "status": "success",
                    "message": "Ticket successfully purchased",
                    "remaining_tickets": ticket.spectacle.tickets_available
                }, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({
                    "status": "error",
                    "message": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "status": "error",
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
