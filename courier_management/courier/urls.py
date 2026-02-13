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
    
    path('api/auth/signup/', views.signup_customer),
    path('api/auth/login/', views.login_customer),
    path('api/auth/logout/', views.logout_customer),
    path('api/auth/reset-password/', views.reset_password),
    path('api/auth/verify-reset-token/', views.verify_reset_token),
    path('api/auth/set-new-password/', views.set_new_password),
    path('api/auth/change-email/', views.change_email),
    path('api/auth/change-password/', views.change_password),
    path('api/admin/stats/',views.admin_stats),
    path("api/staff_login/", views.staff_login),


    path('api/claim_shipment/',views.claim_shipment),
    path('api/update_shipment_status/', views.update_shipment_status, name='update_shipment_status'),
    path('api/track/<int:shipment_id>/', views.track_shipment),
    path('api/logins/',views.admin_login),
    path("api/upload_proof/", views.upload_proof),

]
