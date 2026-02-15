# 📦 Courier Management System

> A full-stack, production-ready parcel & logistics platform built for speed, scale, and real-world operations.

<div align="center">

![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

[Features](#-key-features) • [Installation](#-installation) • [API Documentation](#-api-endpoints) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

Courier Management System is a comprehensive logistics solution that enables admins, staff, and customers to manage parcel delivery operations in real-time. Built with modern full-stack technologies, it emphasizes performance, security, and scalability for real-world courier businesses.

**From shipment creation to proof-of-delivery — everything is automated.**

---

## 🎯 Problem & Solution

| Challenge | Our Solution |
|-----------|--------------|
| ❌ Manual parcel tracking | ✅ Real-time dashboards with live updates |
| ❌ No delivery proof | ✅ Photo & signature upload functionality |
| ❌ Staff coordination issues | ✅ Intelligent task claiming system |
| ❌ Poor scalability | ✅ Django + React architecture |

---

## ✨ Key Features

### 👑 Admin Portal
- **Full Shipment Management** — Create, read, update shipments
- **Staff Management** — Assign roles and monitor performance
- **Analytics Dashboard** — Track KPIs and delivery metrics
- **Customer Management** — View and manage customer accounts

### 🚚 Staff Portal
- **Phone Number Authentication** — Quick and secure login
- **Task Claiming System** — Claim available deliveries
- **Real-time Updates** — Update shipment status on-the-go
- **Proof of Delivery** — Upload photos and signatures

### 📦 Customer Portal
- **Shipment Creation** — Book new deliveries instantly
- **Live Tracking** — Monitor delivery status in real-time
- **Delivery History** — Access complete shipment records

---

## 🛠️ Tech Stack

<table>
<tr>
<td>

**Backend**
- Django 4.2
- Django REST Framework
- PostgreSQL 15
- Session-based Authentication

</td>
<td>

**Frontend**
- React 18
- Vite
- Tailwind CSS
- Axios

</td>
</tr>
</table>

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.9 or higher
- **Node.js** 16.x or higher
- **PostgreSQL** 15.x
- **npm** or **yarn**
- **Git**

---

## ⚡ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sushilbhatt567/courier-management-system.git
cd Courier-System
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd courier_management

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
show

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (see Environment Variables section)
# Create a .env file in the courier_management directory

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### 3️⃣ Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd Courier_Frontendd

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 🖼️ Frontend Showcase
 
| Stage | Preview |
|------|---------|
| 🚀 Home Page | <img src="images/ii1.png" width="240"/> |
| 🚀 Admin Portal | <img src="images/ii2.png" width="240"/> |
| 🚀 Detail Section | <img src="images/ii3.png" width="240"/> |
| 🚀 Staff Portal | <img src="images/ii4.png" width="240"/> |
| 🚀 Customer  Login | <img src="images/ii5.png" width="240"/> |
| 🚀 Customer Dashboard | <img src="images/ii6.png" width="240"/> |

## 🌐 Environment Variables

Create a `.env` file in the `courier_management` directory:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production

# Database Configuration
DB_ENGINE=django.db.backends.postgresql
DB_NAME=courierdb
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432

# Media Files
MEDIA_URL=/media/
MEDIA_ROOT=media/

---

## 📁 Project Structure

```
Courier-System/
│
├── Courier_Frontendd/              # Frontend application
│   ├── src/
│   │   ├── assets/                 # Images, icons, static files
│   │   ├── auth/                   # Authentication components
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Page components
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── courier_management/             # Backend application
│   ├── courier/                    # Main app
│   │   ├── migrations/             # Database migrations
│   │   ├── models.py               # Data models
│   │   ├── views.py                # API views
│   │   ├── urls.py                 # URL routing
│   │   └── serializers.py          # DRF serializers
│   │
│   ├── courier_management/         # Project settings
│   │   ├── settings.py             # Django settings
│   │   ├── urls.py                 # Root URL config
│   │   └── wsgi.py                 # WSGI config
│   │
│   ├── media/                      # Uploaded files
│   ├── db.sqlite3                  # SQLite database (dev)
│   ├── manage.py                   # Django CLI
│   └── requirements.txt            # Python dependencies
│
└── README.md
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/staff_login/` | Staff authentication via phone number |
| `POST` | `/api/customer_login/` | Customer authentication |
| `POST` | `/api/logout/` | User logout |

### Customer Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/add_customer/` | Register new customer |
| `GET` | `/api/get_customers/` | Fetch all customers |

### Shipment Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/get_shipments/` | Fetch all shipments |
| `POST` | `/api/create_shipment/` | Create new shipment |
| `GET` | `/api/get_shipment/<id>/` | Get shipment details |
|

### Delivery Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/claim_shipment/` | Staff claims delivery task |
| `POST` | `/api/update_shipment_status/` | Update delivery status |
| `POST` | `/api/upload_proof/` | Upload proof of delivery |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard_stats/` | Get dashboard statistics |
| `GET` | `/api/delivery_analytics/` | Delivery performance metrics |

---

## 🔐 Security Features

- ✅ **CSRF Protection** — Enabled for all state-changing operations
- ✅ **Server-side Validation** — All inputs validated on backend
- ✅ **Session-based Authentication** — Secure user sessions
- ✅ **Media File Isolation** — Uploaded files stored securely
- ✅ **SQL Injection Prevention** — Using Django ORM

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines
- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript
- Write meaningful commit messages
- Add tests for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Development Team

<table>
<tr>
<td align="center">
<img src="https://github.com/sushilbhatt567.png" width="100px;" alt="Sushil Bhatta"/><br />
<sub><b>Sushil Bhatta</b></sub><br />
<a href="https://github.com/Sushil-Bhatta-sb">GitHub</a>
</td>
<td align="center">
<sub><b>Subodh Bhatta</b></sub><br />
Co-Developer
</td>
</tr>
</table>

---

## 📬 Contact & Support

- **GitHub**: [@sushilbhatt567](https://github.com/Sushil-Bhatta-sb)
- **Twitter/X**: [@sushilbhatt567](https://twitter.com/sushilbhatt567)
- **Email**: bhattsushil567@gmail.com

---

## 🙏 Acknowledgments

- Django and React communities for excellent documentation
- All contributors who helped improve this project
- Open source libraries that made this possible

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/sushilbhatt567/Courier_System?style=social)
![GitHub forks](https://img.shields.io/github/forks/sushilbhatt567/Courier_System?style=social)
![GitHub issues](https://img.shields.io/github/issues/sushilbhatt567/Courier_System)
![GitHub pull requests](https://img.shields.io/github/issues-pr/sushilbhatt567/Courier_System)

---

<div align="center">

**⭐ If you find this project useful, please give it a star!**

Made with ❤️ in Nepal 🇳🇵

</div>
