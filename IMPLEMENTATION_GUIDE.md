# Quick Implementation Guide

## Step 1: Update PostgreSQL Database

Connect to your PostgreSQL database and run:

```sql
ALTER TABLE customer ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE customer ADD COLUMN IF NOT EXISTS last_password_reset TIMESTAMP;
ALTER TABLE customer ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_customer_email ON customer(email);

-- Make email unique
ALTER TABLE customer ADD CONSTRAINT unique_customer_email UNIQUE (email);
```

---

## Step 2: Verify Django Settings

Make sure your `settings.py` has:

```python
# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'courierinfo',  
        'USER': 'postgres',            
        'PASSWORD': 'sushil123@#',    
        'HOST': 'localhost',            
        'PORT': '5432',                
    }
}

# Cache (for reset tokens)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# Email Configuration (for production)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # or your email provider
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your_email@gmail.com'
EMAIL_HOST_PASSWORD = 'your_app_password'
```

---

## Step 3: API Endpoints Available

All endpoints are at `/api/auth/`:

1. **POST** `/api/auth/signup/` - Register new customer
2. **POST** `/api/auth/login/` - Login customer
3. **POST** `/api/auth/logout/` - Logout customer
4. **POST** `/api/auth/reset-password/` - Request password reset
5. **POST** `/api/auth/verify-reset-token/` - Verify reset token
6. **POST** `/api/auth/set-new-password/` - Set new password
7. **POST** `/api/auth/change-email/` - Change email (logged in)
8. **POST** `/api/auth/change-password/` - Change password (logged in)

---

## Step 4: Frontend Integration (React Example)

### Setup API Service

```javascript
// src/services/authService.js
const API_URL = 'http://localhost:8000/api/auth';

export const authService = {
  signup: (credentials) => 
    fetch(`${API_URL}/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(r => r.json()),

  login: (email, password) => 
    fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json()),

  logout: (customerId) => 
    fetch(`${API_URL}/logout/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: customerId })
    }).then(r => r.json()),

  resetPassword: (email) => 
    fetch(`${API_URL}/reset-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(r => r.json()),

  changePassword: (customerId, currentPassword, newPassword) => 
    fetch(`${API_URL}/change-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        customer_id: customerId, 
        current_password: currentPassword, 
        new_password: newPassword 
      })
    }).then(r => r.json()),

  changeEmail: (customerId, currentPassword, newEmail) => 
    fetch(`${API_URL}/change-email/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        customer_id: customerId, 
        current_password: currentPassword, 
        new_email: newEmail 
      })
    }).then(r => r.json()),
};
```

### Use in Components

```javascript
// Login Component
import { authService } from '../services/authService';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const response = await authService.login(email, password);
    
    if (response.success) {
      localStorage.setItem('customer_id', response.user_id);
      localStorage.setItem('email', email);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      alert('Login failed: ' + response.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
}
```

---

## Step 5: Test Your APIs

### Using Postman or cURL:

**Test Signup:**
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123",
    "name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Account created successfully!",
  "customer_id": 1
}
```

**Test Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

---

## Raw SQL Used (No ORM)

Key raw SQL queries used internally:

```sql
-- Check if email exists
SELECT customer_id FROM customer WHERE email = %s

-- Insert new customer
INSERT INTO customer (name, phone, email, address, password)
VALUES (%s, %s, %s, %s, %s)
RETURNING customer_id

-- Get customer with password
SELECT customer_id, password FROM customer WHERE email = %s

-- Update password
UPDATE customer 
SET password = %s, last_password_reset = NOW()
WHERE customer_id = %s

-- Update email
UPDATE customer 
SET email = %s
WHERE customer_id = %s
```

---

## Production Checklist

- [ ] Install `django-cors-headers` for CORS (already in your project)
- [ ] Use HTTPS only
- [ ] Implement JWT tokens instead of customer_id
- [ ] Add rate limiting (django-ratelimit)
- [ ] Send reset tokens via email, not in response
- [ ] Add two-factor authentication
- [ ] Hash reset tokens before storing
- [ ] Use environment variables for secrets
- [ ] Add logging for security events
- [ ] Implement CSRF tokens properly (use JWT)

---

## Key Features

✅ **Pure Raw SQL** - No ORM, direct database queries  
✅ **PostgreSQL** - Optimized for your setup  
✅ **Password Hashing** - PBKDF2 with Django's make_password()  
✅ **Email Validation** - Built-in validation  
✅ **Reset Token** - 32-char secure tokens, 1-hour expiry  
✅ **CORS Ready** - Already configured in your project  
✅ **Error Handling** - Proper HTTP status codes  
✅ **Security** - Password verification, email uniqueness, input validation

---

## Need Help?

Check [AUTHENTICATION_API_DOCS.md](AUTHENTICATION_API_DOCS.md) for detailed endpoint documentation.
