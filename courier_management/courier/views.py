from django.shortcuts import render


def home(request):
    return render(request,'courier/home.html')

# Create your views here.
