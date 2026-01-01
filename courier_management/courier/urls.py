from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [

    path('api/add_customer/', views.api_add_customer),
    path('api/customers/', views.api_get_customers),
    path('api/add_status/',views.add_status),
    path('api/add_staff/',views.api_add_staff),
    path('api/add_mode/',views.api_add_mode),
    path('api/get_mode/',views.get_mode),
    path('api/get_status/',views.get_status),
    path('api/add_shipment/',views.add_shipment),

]
