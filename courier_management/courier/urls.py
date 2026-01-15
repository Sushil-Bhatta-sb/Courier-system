from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [

    path('api/add_customer/', views.add_customer),
    path('api/get_customers/', views.get_customers),
    path('api/add_status/',views.add_status),
    path('api/add_staff/',views.add_staff),
    path('api/add_mode/',views.add_mode),
    path('api/get_mode/',views.get_mode),
    path('api/get_status/',views.get_status),
    path('api/add_shipment/',views.add_shipment),
    path('api/get_shipments/',views.get_shipments),
    path('api/get_staff/',views.get_staff),
   

]
