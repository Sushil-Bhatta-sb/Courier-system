from django.shortcuts import render
from django.db import connection
from datetime import date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def api_add_mode(request):
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
def api_add_customer(request):
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


def api_get_customers(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT customer_id, name, phone, email, address FROM customer")
        rows = cursor.fetchall()

    customers = [
        {"id": r[0], "name": r[1], "phone": r[2], "email": r[3], "address": r[4]}
        for r in rows
    ]

    return JsonResponse(customers, safe=False)




@csrf_exempt
def api_add_staff(request):
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




def shipment(request):
    message = ""
    modes = []
    statuses = []
    cost = 0.0
    pickup_address = ""
    delivery_address = ""
    weight = ""

    with connection.cursor() as cursor:
        cursor.execute("SELECT mode_id, mode_name FROM mode_of_transport")
        modes = cursor.fetchall()
        cursor.execute("SELECT status_id, status_name FROM status")
        statuses = cursor.fetchall()

    if request.method == "POST":
        customer_id = request.POST.get("customer_id")
        pickup_address = request.POST.get("pickup_address")
        delivery_address = request.POST.get("delivery_address")
        weight = request.POST.get("weight")
        mode_id = request.POST.get("mode_id")
        status_id = request.POST.get("status_id")
        booking_date = date.today()

        with connection.cursor() as cursor:
            cursor.execute("SELECT cost_multiplier FROM mode_of_transport WHERE mode_id=%s", [mode_id])
            row = cursor.fetchone()
            
            if row and row[0] is not None:
                multiplier = float(row[0]) 
                weight_val = float(weight) if weight and weight.strip() else 0.0
                cost = weight_val * multiplier * 100
            else:
             
                message = f"Error: Multiplier not found for Mode ID {mode_id}."
                return render(request, "courier/shipment.html", {
                    "modes": modes, "statuses": statuses, "message": message
                })

    
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO shipment 
                    (customer_id, staff_id, mode_id, status_id, pickup_address, 
                     delivery_address, weight, cost, booking_date)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, [customer_id, None, mode_id, status_id, pickup_address, 
                      delivery_address, weight, cost, booking_date])
                
            message = "Shipment booked successfully!"
        except Exception as e:
            message = f"Database Error: {str(e)}"

    return render(request, "courier/shipment.html", {
        "modes": modes,
        "statuses": statuses,
        "message": message,
        "cost": cost,
        "pickup_address": pickup_address,
        "delivery_address": delivery_address,
        "weight": weight
    })