from django.db import models

class cours(models.Model):
    name=models.CharField(max_length=200)
    phone=models.CharField(max_length=12)
    address=models.CharField(max_length=34)
    
    def __str__(self):
        return self.name

# Create your models here.
