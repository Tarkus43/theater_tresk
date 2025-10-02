from django.db import models
from django.core.validators import MinValueValidator

class Spectacle(models.Model):
    title = models.CharField(max_length=100, null=False, blank=False)
    description = models.TextField( default='no description yet')
    time = models.TimeField(auto_now=False, auto_now_add=False)
    date = models.DateField(auto_now=False, auto_now_add=False)
    tickets_available = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    image = models.ImageField()
    location = models.CharField(max_length=200)


    @property 
    def is_sold_out(self):
        return bool(self.tickets_available)
    
class Ticket(models.Model):
    spectacle = models.ForeignKey("app.Spectacle",on_delete=models.CASCADE)
    name = models.CharField(max_length=20, blank=False, null=False)
    surname = models.CharField(max_length=50, blank=False, name=False)
    email = models.EmailField(max_length=254)
    quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)

class Partner(models.Model):
    name = models.CharField(max_length=200)
    website = models.URLField(blank=True)
    logo = models.ImageField()
