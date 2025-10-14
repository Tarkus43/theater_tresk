from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, AbstractUser
from django.db import transaction
from django.db.models import F


class Spectacle(models.Model):
    title = models.CharField(max_length=100, null=False, blank=False)
    description = models.CharField(max_length=50, default='no description yet')
    full_description = models.TextField( default='no full description yet')
    time = models.TimeField(auto_now=False, auto_now_add=False)
    date = models.DateField(auto_now=False, auto_now_add=False)
    tickets_available = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    image = models.ImageField()
    location = models.CharField(max_length=200)


    @property 
    def is_sold_out(self):
        return bool(self.tickets_available)
    
class Ticket(models.Model):
    spectacle = models.ForeignKey("theater.Spectacle",on_delete=models.CASCADE)
    name = models.CharField(max_length=20, blank=False, null=False)
    surname = models.CharField(max_length=50, blank=False)
    email = models.EmailField(max_length=254)
    quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        with transaction.atomic():
            spectacle = Spectacle.objects.select_for_update().get(pk=self.spectacle.pk)

            if spectacle.tickets_available < self.quantity:
                raise ValueError("Not enough tickets available")

            spectacle.tickets_available = spectacle.tickets_available - self.quantity
            spectacle.save()
            return super().save(*args, **kwargs) 

class Partner(models.Model):
    name = models.CharField(max_length=200)
    website = models.URLField(blank=True)
    logo = models.ImageField()
    description = models.TextField(default='no description yet')


class User(AbstractUser):
    email = models.EmailField(unique=True)