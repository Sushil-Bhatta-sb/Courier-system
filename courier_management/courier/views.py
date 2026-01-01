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

def get_mode(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT mode_id, mode_name FROM mode_of_transport")
        rows = cursor.fetchall()

    modes = [{"id": r[0], "name": r[1]} for r in rows]
    return JsonResponse(modes, safe=False)


def get_status(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT status_id, status_name FROM status")
        rows = cursor.fetchall()

    statuses = [{"id": r[0], "name": r[1]} for r in rows]
    return JsonResponse(statuses, safe=False)

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

    # check mode multiplier & calculate cost
    with connection.cursor() as cursor:
        cursor.execute("SELECT cost_multiplier FROM mode_of_transport WHERE mode_id=%s", [mode_id])
        row = cursor.fetchone()

    if not row or row[0] is None:
        return JsonResponse({"error": "Invalid mode ID"}, status=400)

    multiplier = float(row[0])
    cost = weight * multiplier * 100

    # insert shipment
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

