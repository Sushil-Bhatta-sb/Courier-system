# Authentication API Documentation

## Overview
This document covers all authentication endpoints using **Raw SQL** with PostgreSQL (no ORM).

---

## Database Schema Requirements

Before using these APIs, ensure your `customer` table has these columns:

```sql
ALTER TABLE customer ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE customer ADD COLUMN IF NOT EXISTS last_password_reset TIMESTAMP;
ALTER TABLE customer ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_customer_email ON customer(email);
ALTER TABLE customer ADD CONSTRAINT unique_customer_email UNIQUE (email);
```

---

## API Endpoints

### 1. **SIGNUP** - Create New Account
**Endpoint:** `POST /api/auth/signup/`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "phone": "9876543210",
  "address": "123 Main St, City"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Account created successfully!",
  "customer_id": 5
}
```

**Response (Error - 400/409):**
```json
{
  "error": "Email already registered"
}
```

**Validations:**
- All fields required
- Password minimum 8 characters
- Valid email format
- Phone must be 10+ digits

---

### 2. **LOGIN** - Authenticate Customer
**Endpoint:** `POST /api/auth/login/`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful!",
  "user_id": 5
}
```

**Response (Error - 401/404):**
```json
{
  "error": "Wrong password"
}
```

---

### 3. **LOGOUT** - Clear Session
**Endpoint:** `POST /api/auth/logout/`

**Request Body:**
```json
{
  "customer_id": 5
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully!"
}
```

---

### 4. **RESET PASSWORD** - Request Password Reset
**Endpoint:** `POST /api/auth/reset-password/`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "If email exists, reset link sent",
  "reset_token": "your_reset_token_here"
}
```

**Note:** 
- The reset token is valid for 1 hour (cached in Django)
- In production, send token via email instead of returning it
- Token stored in Django cache: `reset_token_{customer_id}`

---

### 5. **VERIFY RESET TOKEN** - Validate Reset Token
**Endpoint:** `POST /api/auth/verify-reset-token/`

**Request Body:**
```json
{
  "customer_id": 5,
  "reset_token": "your_reset_token_here"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Token is valid"
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid or expired reset token"
}
```

---

### 6. **SET NEW PASSWORD** - Update Password with Reset Token
**Endpoint:** `POST /api/auth/set-new-password/`

**Request Body:**
```json
{
  "customer_id": 5,
  "reset_token": "your_reset_token_here",
  "new_password": "NewSecurePass456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password reset successfully!"
}
```

**Response (Error - 401/400):**
```json
{
  "error": "Invalid or expired reset token"
}
```

---

### 7. **CHANGE EMAIL** - Change Email (When Logged In)
**Endpoint:** `POST /api/auth/change-email/`

**Request Body:**
```json
{
  "customer_id": 5,
  "current_password": "SecurePass123",
  "new_email": "newemail@example.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Email changed successfully!",
  "old_email": "user@example.com",
  "new_email": "newemail@example.com"
}
```

**Response (Error - 401/409):**
```json
{
  "error": "Email already in use"
}
```

---

### 8. **CHANGE PASSWORD** - Change Password (When Logged In)
**Endpoint:** `POST /api/auth/change-password/`

**Request Body:**
```json
{
  "customer_id": 5,
  "current_password": "SecurePass123",
  "new_password": "NewSecurePass456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully!"
}
```

**Response (Error - 401):**
```json
{
  "error": "Current password is incorrect"
}
```

---

## Frontend Implementation Example (React)

### Signup
```javascript
const signup = async (email, password, name, phone, address) => {
  const response = await fetch('http://localhost:8000/api/auth/signup/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, phone, address })
  });
  return await response.json();
};
```

### Login
```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('customer_id', data.user_id);
  }
  return data;
};
```

### Reset Password Flow
```javascript
// Step 1: Request reset
const requestReset = async (email) => {
  const response = await fetch('http://localhost:8000/api/auth/reset-password/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return await response.json();
};

// Step 2: User clicks email link with token (from email or app)
// Step 3: Verify token
const verifyToken = async (customer_id, reset_token) => {
  const response = await fetch('http://localhost:8000/api/auth/verify-reset-token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id, reset_token })
  });
  return await response.json();
};

// Step 4: Set new password
const setNewPassword = async (customer_id, reset_token, new_password) => {
  const response = await fetch('http://localhost:8000/api/auth/set-new-password/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id, reset_token, new_password })
  });
  return await response.json();
};
```

---

## Security Notes

1. **Password Hashing:** Uses Django's `make_password()` with PBKDF2 algorithm
2. **Email Validation:** Uses Django's built-in email validator
3. **Reset Token:** 32-character URL-safe token, stored in cache for 1 hour
4. **CSRF Protection:** Disabled with `@csrf_exempt` (use JWT tokens for production)
5. **Production Recommendations:**
   - Send reset tokens via email (don't return in response)
   - Implement JWT token authentication
   - Add rate limiting to prevent brute force
   - Use HTTPS only
   - Add two-factor authentication

---

## Raw SQL Queries Used

### Check Email Exists
```sql
SELECT customer_id FROM customer WHERE email = %s
```

### Insert New Customer
```sql
INSERT INTO customer (name, phone, email, address, password)
VALUES (%s, %s, %s, %s, %s)
RETURNING customer_id
```

### Get Password Hash
```sql
SELECT password FROM customer WHERE customer_id = %s
```

### Update Password
```sql
UPDATE customer 
SET password = %s, last_password_reset = NOW()
WHERE customer_id = %s
```

### Update Email
```sql
UPDATE customer 
SET email = %s
WHERE customer_id = %s
```

---

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User",
    "phone": "9876543210",
    "address": "123 Test St"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Change Password
```bash
curl -X POST http://localhost:8000/api/auth/change-password/ \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 5,
    "current_password": "TestPass123",
    "new_password": "NewPass456"
  }'
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Invalid email format` | Ensure email matches standard format |
| `Password must be at least 8 characters` | Use stronger password |
| `Email already in use` | Email already exists in database |
| `Invalid or expired reset token` | Token expired (1 hour) or doesn't match |
| `Current password is incorrect` | Double-check password |
| `All fields required` | Ensure all required fields are sent |

