from django.shortcuts import render
from django.db import connection
from datetime import date
from django.http import JsonResponse
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

    data = json.loads(request.body)

    customer_id = data.get("customer_id")
    pickup_address = data.get("pickup_address")
    delivery_address = data.get("delivery_address")
    weight = float(data.get("weight"))
    mode_id = data.get("mode_id")
    status_id = data.get("status_id")

    with connection.cursor() as cursor:
        cursor.execute("SELECT cost_multiplier FROM mode_of_transport WHERE mode_id=%s", [mode_id])
        row = cursor.fetchone()

    if not row or row[0] is None:
        return JsonResponse({"error": "Invalid mode ID"}, status=400)

    multiplier = float(row[0])
    cost = weight * multiplier * 100

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO shipment 
                (customer_id, staff_id, mode_id, status_id, pickup_address, 
                 delivery_address, weight, cost, booking_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, [customer_id, None, mode_id, status_id, pickup_address, 
                  delivery_address, weight, cost, date.today()])
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({
        "message": "Shipment booked successfully!",
        "pickup_address": pickup_address,
        "delivery_address": delivery_address,
        "weight": weight,
        "cost": cost
    })
    
def get_shipments(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT s.shipment_id,
                   s.pickup_address,
                   s.delivery_address,
                   s.weight,
                   s.cost,
                   m.mode_name,
                   st.status_name
            FROM shipment s
            JOIN mode_of_transport m ON s.mode_id = m.mode_id
            JOIN status st ON s.status_id = st.status_id
            ORDER BY s.shipment_id DESC
        """)
        rows = cursor.fetchall()

    data = []
    for r in rows:
        data.append({
            "id": r[0],
            "pickup": r[1],
            "delivery": r[2],
            "weight": r[3],
            "cost": float(r[4]),
            "mode": r[5],
            "status": r[6],
        })

    return JsonResponse(data, safe=False)

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
        cursor.execute("SELECT staff_id,name , phone ,assigned_area,status FROM staff")
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
                
                # LINE 9: If it matches, tell the frontend "You are good!"
                # In a real app, you'd send a Token here.
                return JsonResponse({
                    "success": True,
                    "message": "Login successful!",
                    "user_id": db_user_id
                })
            else:
                
                return JsonResponse({"error": "Wrong password"}, status=401)
        
        
        return JsonResponse({"error": "User does not exist"}, status=404)

    return JsonResponse({"error": "POST required"}, status=400)


# ============== AUTHENTICATION APIS ==============

@csrf_exempt
def signup_customer(request):
    """
    Signup API - Create new customer account
    Expects: email, password, name, phone, address
    """
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
    
    # Validation
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
            # Check if email already exists
            cursor.execute("SELECT customer_id FROM customer WHERE email = %s", [email])
            if cursor.fetchone():
                return JsonResponse({"error": "Email already registered"}, status=409)
            
            # Hash password
            hashed_password = make_password(password)
            
            # Insert new customer
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
    """
    Logout API - Clear session/token on frontend
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    
    try:
        data = json.loads(request.body)
        customer_id = data.get("customer_id")
        
        if not customer_id:
            return JsonResponse({"error": "Customer ID required"}, status=400)
        
        # Optional: Clear any cached session tokens
        cache.delete(f"customer_session_{customer_id}")
        
        return JsonResponse({
            "success": True,
            "message": "Logged out successfully!"
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def reset_password(request):
    """
    Reset Password API - Request password reset
    Expects: email
    Returns: Reset token (store in email/cache)
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    
    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip()
        
        if not email:
            return JsonResponse({"error": "Email required"}, status=400)
        
        with connection.cursor() as cursor:
            # Check if email exists
            cursor.execute("SELECT customer_id FROM customer WHERE email = %s", [email])
            row = cursor.fetchone()
            
            if not row:
                # Don't reveal if email exists (security best practice)
                return JsonResponse({
                    "success": True,
                    "message": "If email exists, reset link sent"
                })
            
            customer_id = row[0]
            
            # Generate reset token
            reset_token = secrets.token_urlsafe(32)
            
            # Store token with expiry (1 hour)
            cache.set(f"reset_token_{customer_id}", reset_token, 3600)
            
            # Update last reset request time in DB (optional)
            cursor.execute("""
                UPDATE customer 
                SET last_password_reset = NOW()
                WHERE customer_id = %s
            """, [customer_id])
        
        # In production, send this token via email
        # For now, return it (only for testing)
        return JsonResponse({
            "success": True,
            "message": "Password reset link sent to email",
            "reset_token": reset_token  # Remove this in production
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def verify_reset_token(request):
    """
    Verify Reset Token - Check if token is valid
    Expects: customer_id, reset_token
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)
    
    try:
        data = json.loads(request.body)
        customer_id = data.get("customer_id")
        reset_token = data.get("reset_token", "").strip()
        
        if not customer_id or not reset_token:
            return JsonResponse({"error": "Customer ID and token required"}, status=400)
        
        # Verify token from cache
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
    """
    Set New Password - Update password with valid reset token
    Expects: customer_id, reset_token, new_password
    """
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
        
        # Verify token
        stored_token = cache.get(f"reset_token_{customer_id}")
        if not stored_token or stored_token != reset_token:
            return JsonResponse({"error": "Invalid or expired reset token"}, status=401)
        
        # Hash new password and update in DB
        hashed_password = make_password(new_password)
        
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE customer 
                SET password = %s, last_password_reset = NOW()
                WHERE customer_id = %s
            """, [hashed_password, customer_id])
        
        # Clear reset token
        cache.delete(f"reset_token_{customer_id}")
        
        return JsonResponse({
            "success": True,
            "message": "Password reset successfully!"
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def change_email(request):
    """
    Change Email API - Change customer email with password verification
    Expects: customer_id, current_password, new_email
    """
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
            # Get current email and password hash
            cursor.execute("""
                SELECT email, password FROM customer WHERE customer_id = %s
            """, [customer_id])
            row = cursor.fetchone()
            
            if not row:
                return JsonResponse({"error": "Customer not found"}, status=404)
            
            current_email = row[0]
            hashed_password = row[1]
            
            # Verify current password
            if not check_password(current_password, hashed_password):
                return JsonResponse({"error": "Current password is incorrect"}, status=401)
            
            # Check if new email already exists
            cursor.execute("""
                SELECT customer_id FROM customer WHERE email = %s AND customer_id != %s
            """, [new_email, customer_id])
            
            if cursor.fetchone():
                return JsonResponse({"error": "Email already in use"}, status=409)
            
            # Update email
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
    """
    Change Password API - Change password when logged in
    Expects: customer_id, current_password, new_password
    """
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
            # Get current password hash
            cursor.execute("""
                SELECT password FROM customer WHERE customer_id = %s
            """, [customer_id])
            row = cursor.fetchone()
            
            if not row:
                return JsonResponse({"error": "Customer not found"}, status=404)
            
            hashed_password = row[0]
            
            # Verify current password
            if not check_password(current_password, hashed_password):
                return JsonResponse({"error": "Current password is incorrect"}, status=401)
            
            # Hash and update new password
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