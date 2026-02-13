from django.shortcuts import render
from django.db import connection
from datetime import date
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.hashers import check_password, make_password
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import json
import secrets
import string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import os
import base64
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

@csrf_exempt
def add_mode(request):
    if request.method == "POST":
        data = json.loads(request.body)
        mode_name = data.get("mode_name")
        cost_multiplier = data.get("cost_multiplier")
        if not mode_name or not cost_multiplier:
            return JsonResponse({"error": "Mode name and multiplier required"}, status=400)
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO mode_of_transport (mode_name, cost_multiplier)
                    VALUES (%s, %s)
                """, [mode_name, cost_multiplier])
            return JsonResponse({"message": "Mode of transport added successfully!"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "POST request required"}, status=400)

@csrf_exempt
def add_status(request):
    msg = ""
    if request.method == "POST":
        data = json.loads(request.body)
        status_name = data.get("status_name")
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO status (status_name)
                VALUES (%s)
            """, [status_name])
        msg = "Status added successfully!"
    return JsonResponse({"msg": msg})

@csrf_exempt
def add_customer(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        phone = data.get("phone")
        email = data.get("email")
        address = data.get("address")
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO customer (name, phone, email, address)
                VALUES (%s, %s, %s, %s)
            """, [name, phone, email, address])
        return JsonResponse({"message": "Customer added successfully!"})
    return JsonResponse({"error": "POST request required"}, status=400)

@csrf_exempt
def add_staff(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        phone = data.get("phone")
        area = data.get("area")
        status = data.get("status")
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO staff (name, phone, assigned_area, status)
                VALUES (%s, %s, %s, %s)
            """, [name, phone, area, status])
        return JsonResponse({"message": "Staff added successfully!"})

@csrf_exempt
def add_shipment(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    try:
        data = json.loads(request.body)
        customer_id = data.get("customer_id")
        pickup_address = data.get("pickup_address")
        delivery_address = data.get("delivery_address")
        weight = float(data.get("weight"))
        mode_id = data.get("mode_id")
        status_id = data.get("status_id")

        # 1. Calculate Cost
        with connection.cursor() as cursor:
            cursor.execute("SELECT cost_multiplier FROM mode_of_transport WHERE mode_id=%s", [mode_id])
            row = cursor.fetchone()

        if not row or row[0] is None:
            return JsonResponse({"error": "Invalid mode ID"}, status=400)

        multiplier = float(row[0])
        cost = weight * multiplier * 100

        # 2. Insert into Database
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO shipment 
                (customer_id, staff_id, mode_id, status_id, pickup_address, 
                 delivery_address, weight, cost, booking_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, [customer_id, None, mode_id, status_id, pickup_address, 
                  delivery_address, weight, cost, date.today()])
        return JsonResponse({
            "message": "Shipment booked successfully!",
            "pickup_address": pickup_address,
            "delivery_address": delivery_address,
            "weight": weight,
            "cost": cost
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
def get_shipments(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                sh.shipment_id, sh.pickup_address, sh.delivery_address, 
                sh.weight, sh.cost, m.mode_name, st.status_name, sh.staff_id, sh.remarks
            FROM shipment sh
            JOIN mode_of_transport m ON sh.mode_id = m.mode_id
            JOIN status st ON sh.status_id = st.status_id
        """)
        rows = cursor.fetchall()
    shipments = []
    for r in rows:
        shipments.append({
            "id": r[0],
            "pickup_address": r[1],
            "delivery_address": r[2],
            "weight": r[3],
            "cost": r[4],
            "mode": r[5],
            "status": r[6],
            "staff_id": r[7],
            "remarks": r[8],
        })
    return JsonResponse(shipments, safe=False)

def get_status(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT status_id, status_name FROM status")
        rows = cursor.fetchall()
    statuses = [{"id": r[0], "name": r[1]} for r in rows]
    return JsonResponse(statuses, safe=False)

def get_mode(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT mode_id, mode_name FROM mode_of_transport")
        rows = cursor.fetchall()
    modes = [{"id": r[0], "name": r[1]} for r in rows]
    return JsonResponse(modes, safe=False)

def get_customers(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT customer_id, name, phone, email, address FROM customer")
        rows = cursor.fetchall()
    customers = [
        {"id": r[0], "name": r[1], "phone": r[2], "email": r[3], "address": r[4]}
        for r in rows
    ]
    return JsonResponse(customers, safe=False)

def get_staff(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT staff_id, name, phone, assigned_area, status FROM staff")
        rows = cursor.fetchall()
    staff = [
        {"id": r[0], "name": r[1], "phone": r[2], "area": r[3], "status": r[4]}
        for r in rows
    ]
    return JsonResponse(staff, safe=False)

@csrf_exempt
def login_customer(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        with connection.cursor() as cursor:
            cursor.execute("SELECT customer_id, password FROM customer WHERE email = %s", [email])
            row = cursor.fetchone()
        if row:
            db_user_id = row[0]
            db_hashed_password = row[1]
            if check_password(password, db_hashed_password):
                return JsonResponse({
                    "success": True,
                    "message": "Login successful!",
                    "user_id": db_user_id
                })
            else:
                return JsonResponse({"error": "Wrong password"}, status=401)
        return JsonResponse({"error": "User does not exist"}, status=404)
    return JsonResponse({"error": "POST required"}, status=400)

@csrf_exempt
def signup_customer(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()
    name = data.get("name", "").strip()
    phone = data.get("phone", "").strip()
    address = data.get("address", "").strip()
    if not all([email, password, name, phone, address]):
        return JsonResponse({"error": "All fields are required"}, status=400)
    if len(password) < 8:
        return JsonResponse({"error": "Password must be at least 8 characters"}, status=400)
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"error": "Invalid email format"}, status=400)
    if not phone.isdigit() or len(phone) < 10:
        return JsonResponse({"error": "Invalid phone number"}, status=400)
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT customer_id FROM customer WHERE email = %s", [email])
            if cursor.fetchone():
                return JsonResponse({"error": "Email already registered"}, status=409)
            hashed_password = make_password(password)
            cursor.execute("""
                INSERT INTO customer (name, phone, email, address, password)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING customer_id
            """, [name, phone, email, address, hashed_password])
            result = cursor.fetchone()
            customer_id = result[0] if result else None
        return JsonResponse({
            "success": True,
            "message": "Account created successfully!",
            "customer_id": customer_id
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def logout_customer(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    try:
        data = json.loads(request.body)
        customer_id = data.get("customer_id")
        if not customer_id:
            return JsonResponse({"error": "Customer ID required"}, status=400)
        cache.delete(f"customer_session_{customer_id}")
        return JsonResponse({
            "success": True,
            "message": "Logged out successfully!"
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def reset_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip()
        if not email:
            return JsonResponse({"error": "Email required"}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("SELECT customer_id FROM customer WHERE email = %s", [email])
            row = cursor.fetchone()
            if not row:
                return JsonResponse({
                    "success": True,
                    "message": "If email exists, reset link sent"
                })
            customer_id = row[0]
            reset_token = secrets.token_urlsafe(32)
            cache.set(f"reset_token_{customer_id}", reset_token, 3600)
            cursor.execute("""
                UPDATE customer 
                SET last_password_reset = NOW()
                WHERE customer_id = %s
            """, [customer_id])
        return JsonResponse({
            "success": True,
            "message": "Password reset link sent to email",
            "reset_token": reset_token 
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def verify_reset_token(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    try:
        data = json.loads(request.body)
        customer_id = data.get("customer_id")
        reset_token = data.get("reset_token", "").strip()
        if not customer_id or not reset_token:
            return JsonResponse({"error": "Customer ID and token required"}, status=400)
        stored_token = cache.get(f"reset_token_{customer_id}")
        if not stored_token or stored_token != reset_token:
            return JsonResponse({"error": "Invalid or expired reset token"}, status=401)
        return JsonResponse({
            "success": True,
            "message": "Token is valid"
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def set_new_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    try:
        data = json.loads(request.body)
        customer_id = data.get("customer_id")
        reset_token = data.get("reset_token", "").strip()
        new_password = data.get("new_password", "").strip()
        if not all([customer_id, reset_token, new_password]):
            return JsonResponse({"error": "All fields required"}, status=400)
        if len(new_password) < 8:
            return JsonResponse({"error": "Password must be at least 8 characters"}, status=400)
        stored_token = cache.get(f"reset_token_{customer_id}")
        if not stored_token or stored_token != reset_token:
            return JsonResponse({"error": "Invalid or expired reset token"}, status=401)
        hashed_password = make_password(new_password)
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE customer 
                SET password = %s, last_password_reset = NOW()
                WHERE customer_id = %s
            """, [hashed_password, customer_id])
        cache.delete(f"reset_token_{customer_id}")
        return JsonResponse({
            "success": True,
            "message": "Password reset successfully!"
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def change_email(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    try:
        data = json.loads(request.body)
        customer_id = data.get("customer_id")
        current_password = data.get("current_password", "").strip()
        new_email = data.get("new_email", "").strip()
        if not all([customer_id, current_password, new_email]):
            return JsonResponse({"error": "All fields required"}, status=400)
        try:
            validate_email(new_email)
        except ValidationError:
            return JsonResponse({"error": "Invalid email format"}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT email, password FROM customer WHERE customer_id = %s
            """, [customer_id])
            row = cursor.fetchone()
            if not row:
                return JsonResponse({"error": "Customer not found"}, status=404)
            current_email = row[0]
            hashed_password = row[1]
            if not check_password(current_password, hashed_password):
                return JsonResponse({"error": "Current password is incorrect"}, status=401)
            cursor.execute("""
                SELECT customer_id FROM customer WHERE email = %s AND customer_id != %s
            """, [new_email, customer_id])
            if cursor.fetchone():
                return JsonResponse({"error": "Email already in use"}, status=409)
            cursor.execute("""
                UPDATE customer 
                SET email = %s
                WHERE customer_id = %s
            """, [new_email, customer_id])
        return JsonResponse({
            "success": True,
            "message": "Email changed successfully!",
            "old_email": current_email,
            "new_email": new_email
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def change_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    try:
        data = json.loads(request.body)
        customer_id = data.get("customer_id")
        current_password = data.get("current_password", "").strip()
        new_password = data.get("new_password", "").strip()
        if not all([customer_id, current_password, new_password]):
            return JsonResponse({"error": "All fields required"}, status=400)
        if len(new_password) < 8:
            return JsonResponse({"error": "Password must be at least 8 characters"}, status=400)
        if current_password == new_password:
            return JsonResponse({"error": "New password must be different"}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT password FROM customer WHERE customer_id = %s
            """, [customer_id])
            row = cursor.fetchone()
            if not row:
                return JsonResponse({"error": "Customer not found"}, status=404)
            hashed_password = row[0]
            if not check_password(current_password, hashed_password):
                return JsonResponse({"error": "Current password is incorrect"}, status=401)
            new_hashed_password = make_password(new_password)
            cursor.execute("""
                UPDATE customer 
                SET password = %s
                WHERE customer_id = %s
            """, [new_hashed_password, customer_id])
        return JsonResponse({
            "success": True,
            "message": "Password changed successfully!"
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def claim_shipment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            shipment_id = data.get("shipment_id")
            staff_id = data.get("staff_id") 
            if not shipment_id or not staff_id:
                return JsonResponse({"error": "Shipment and Staff ID required"}, status=400)
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE shipment 
                    SET staff_id = %s 
                    WHERE shipment_id = %s
                """, [staff_id, shipment_id])
            return JsonResponse({"message": "Shipment successfully assigned to you!"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "POST required"}, status=405)

@csrf_exempt
def update_shipment_status(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    data = json.loads(request.body)
    shipment_id = data.get("shipment_id")
    new_status = data.get("status")  # "Shipped" or "Delivered"

    with connection.cursor() as cursor:
        # get status_id from name
        cursor.execute(
            "SELECT status_id FROM status WHERE status_name=%s",
            [new_status]
        )
        row = cursor.fetchone()

        if not row:
            return JsonResponse({"error": "Invalid status"}, status=400)

        status_id = row[0]

        cursor.execute(
            "UPDATE shipment SET status_id=%s WHERE shipment_id=%s",
            [status_id, shipment_id]
        )

    return JsonResponse({"message": "Status updated"})

@csrf_exempt
def track_shipment(request, shipment_id):
    try:
        with connection.cursor() as cursor:
            # Join with status table to get the status name instead of just the ID
            cursor.execute("""
                SELECT 
                    sh.shipment_id, 
                    sh.pickup_address, 
                    sh.delivery_address, 
                    sh.weight, 
                    st.status_name 
                FROM shipment sh
                JOIN status st ON sh.status_id = st.status_id
                WHERE sh.shipment_id = %s
            """, [shipment_id])
            row = cursor.fetchone()

        if row:
            return JsonResponse({
                "id": row[0],
                "pickup": row[1],
                "delivery": row[2],
                "weight": row[3],
                "status": row[4]
            })
        return JsonResponse({"error": "Shipment not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def admin_stats(request):
    with connection.cursor() as cursor:

        # Total shipments
        cursor.execute("SELECT COUNT(*) FROM shipment")
        total_shipments = cursor.fetchone()[0]

        # By status
        cursor.execute("""
            SELECT status_name, COUNT(*) 
            FROM shipment 
            JOIN status ON shipment.status_id = status.status_id
            GROUP BY status_name
        """)
        status_rows = cursor.fetchall()

        stats = { row[0]: row[1] for row in status_rows }

        # Revenue
        cursor.execute("SELECT COALESCE(SUM(cost),0) FROM shipment")
        revenue = cursor.fetchone()[0]

        # Customers
        cursor.execute("SELECT COUNT(*) FROM customer")
        customers = cursor.fetchone()[0]

        # Staff
        cursor.execute("SELECT COUNT(*) FROM staff")
        staff = cursor.fetchone()[0]

    return JsonResponse({
        "total_shipments": total_shipments,
        "booked": stats.get("booked", 0),
        "shipped": stats.get("Shipped", 0),
        "delivered": stats.get("Delivered", 0),
        "revenue": float(revenue),
        "customers": customers,
        "staff": staff
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # This checks against the users created via createsuperuser
    user = authenticate(username=username, password=password)
    
    if user is not None and user.is_staff:
        login(request, user)
        return JsonResponse({"message": "Login successful", "isAdmin": True}, status=200)
    else:
        return JsonResponse({"error": "Invalid credentials or not an admin"}, status=401)

@csrf_exempt
def staff_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=400)

    try:
        data = json.loads(request.body)
        phone = data.get("phone")
    except Exception as e:
        return JsonResponse({"error": f"Invalid JSON: {str(e)}"}, status=400)

    if not phone:
        return JsonResponse({"error": "Phone required"}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT staff_id, name FROM staff WHERE phone = %s",
                [phone]
            )
            row = cursor.fetchone()
            
        if not row:
            return JsonResponse({"error": "Staff not found"}, status=404)

        staff_id, name = row
        return JsonResponse({
            "success": True,
            "staff_id": staff_id,
            "name": name
        })
    except Exception as e:
        # This will send the actual error message to your React app
        return JsonResponse({"error": f"Database error: {str(e)}"}, status=500)

@csrf_exempt
def upload_proof(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    try:
        shipment_id = request.POST.get("shipment_id")
        photo = request.FILES.get("photo")
        signature_data = request.POST.get("signature")  
        if not photo or not signature_data or not shipment_id:
            return JsonResponse({"error": "Missing data (photo, signature, or ID)"}, status=400)
        photo_path = default_storage.save(f"proof/photos/ship_{shipment_id}_{photo.name}", photo)
        try:
            format, imgstr = signature_data.split(';base64,')
            ext = format.split('/')[-1]
            signature_file = ContentFile(base64.b64decode(imgstr), name=f"sig_{shipment_id}.{ext}")
            sign_path = default_storage.save(f"proof/signatures/sig_{shipment_id}.{ext}", signature_file)
        except Exception as e:
            return JsonResponse({"error": f"Signature decoding failed: {str(e)}"}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE shipment 
                SET delivery_photo=%s, 
                    delivery_signature=%s, 
                    delivered_at=%s,
                    status_id = (SELECT status_id FROM status WHERE status_name='Delivered')
                WHERE shipment_id=%s
            """, [photo_path, sign_path, timezone.now(), shipment_id])

        return JsonResponse({"success": True})

    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
