from django.db import models

class Spectacle(models.Model):
    title = models.CharField(max_length=100, null=False, blank=False)
    description = models.TextField( default='no description yet')
    time = models.TimeField(auto_now=False, auto_now_add=False)
    date = models.DateField(auto_now=False, auto_now_add=False)
    tickets_available = models.IntegerField()
    image = models.ImageField()
    location = models.CharField(max_length=200)


    @property 
    def is_sold_out(self):
        return bool(self.tickets_available)