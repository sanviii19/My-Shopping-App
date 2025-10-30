# My Shopping App

A full-stack e-commerce application with a modern React frontend and robust Node.js/Express backend. Features include user authentication, product management, shopping cart functionality, order processing with Cashfree payment integration, and a comprehensive admin dashboard.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features in Detail](#features-in-detail)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Features

- **Authentication & Authorization**: Secure user registration and login with JWT and OTP verification
- **Shopping Cart**: Add, update, and remove items from cart
- **Product Search & Filter**: Browse and search through products
- **Order Management**: Place orders and track order history
- **Payment Integration**: Secure payment processing via Cashfree
- **User Profile**: Manage personal information and view order history

### Admin Features

- **Admin Dashboard**: Comprehensive overview of store metrics
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage all customer orders
- **Analytics**: Track sales and user activity

### Technical Features

- **Real-time Updates**: Automatic abandoned cart detection via cron jobs
- **Secure Authentication**: JWT-based authentication with HTTP-only cookies
- **Email Notifications**: Automated email system using Nodemailer
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **RESTful API**: Well-structured API with versioning support

## Tech Stack

### Frontend

- **React 19.1.1** - Modern UI library
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite 7** - Fast build tool and dev server
- **React Toastify** - Elegant notifications
- **React Icons** - Icon library
- **Cashfree JS SDK** - Payment integration

### Backend

- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Node-cron** - Task scheduling
- **Cashfree PG SDK** - Payment gateway integration

## Project Structure

```
My-Shopping-App/
├── backend/
│   ├── api/
│   │   ├── routes.js              # Main API router
│   │   └── v1/                    # API version 1
│   │       ├── middlewares.js     # Authentication & validation
│   │       ├── admin/             # Admin endpoints
│   │       ├── auth/              # Authentication endpoints
│   │       ├── cart/              # Shopping cart endpoints
│   │       ├── orders/            # Order management
│   │       ├── otp/               # OTP verification
│   │       ├── products/          # Product endpoints
│   │       └── users/             # User management
│   ├── config/
│   │   ├── cashfreePayment.js    # Payment gateway config
│   │   └── db.js                  # Database connection
│   ├── models/                    # Mongoose schemas
│   │   ├── cartSchema.js
│   │   ├── orderSchema.js
│   │   ├── otpSchema.js
│   │   ├── productSchema.js
│   │   └── userSchema.js
│   ├── utils/
│   │   └── emailHelper.js         # Email utilities
│   ├── migration/                 # Database migration scripts
│   ├── app.js                     # Application entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/            # Reusable components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── cartSideBar.jsx
    │   │   ├── Paginator.jsx
    │   │   └── ui/                # UI components
    │   ├── pages/                 # Page components
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── SearchPage.jsx
    │   │   ├── ViewPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── PaymentPage.jsx
    │   │   └── Admin/             # Admin pages
    │   ├── context/               # React Context API
    │   │   ├── AppContext.jsx
    │   │   └── AdminContext.jsx
    │   ├── utils/                 # Utility functions
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/                    # Static assets
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cluster)
- **Git**

### Installation

1. **Clone the repository**

   ```powershell
   git clone https://github.com/sanviii19/My-Shopping-App.git
   cd My-Shopping-App
   ```

2. **Install Backend Dependencies**

   ```powershell
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```powershell
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3900
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/shopping-app
# Or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopping-app

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Cashfree Payment Gateway
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_API_VERSION=2023-08-01

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@yourapp.com

# OTP Configuration
OTP_EXPIRY=10
```

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3900/api/v1
VITE_CASHFREE_MODE=sandbox
```

### Running the Application

#### Development Mode

1. **Start the Backend Server**

   ```powershell
   cd backend
   npm run dev
   ```

   The backend will run on `http://localhost:3900`

2. **Start the Frontend Development Server**

   ```powershell
   cd frontend
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3900/api/v1

#### Production Build

1. **Build Frontend**

   ```powershell
   cd frontend
   npm run build
   ```

2. **Start Backend in Production**
   ```powershell
   cd backend
   node app.js
   ```

## API Documentation

### Base URL

```
http://localhost:3900/api/v1
```

### Authentication Endpoints

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/register` | Register new user | No            |
| POST   | `/auth/login`    | User login        | No            |
| POST   | `/auth/logout`   | User logout       | Yes           |
| GET    | `/auth/verify`   | Verify JWT token  | Yes           |

### Product Endpoints

| Method | Endpoint           | Description       | Auth Required |
| ------ | ------------------ | ----------------- | ------------- |
| GET    | `/products`        | Get all products  | No            |
| GET    | `/products/:id`    | Get product by ID | No            |
| GET    | `/products/search` | Search products   | No            |

### Cart Endpoints

| Method | Endpoint           | Description           | Auth Required |
| ------ | ------------------ | --------------------- | ------------- |
| GET    | `/cart`            | Get user's cart       | Yes           |
| POST   | `/cart/add`        | Add item to cart      | Yes           |
| PUT    | `/cart/update`     | Update cart item      | Yes           |
| DELETE | `/cart/remove/:id` | Remove item from cart | Yes           |

### Order Endpoints

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| GET    | `/orders`        | Get user's orders | Yes           |
| POST   | `/orders/create` | Create new order  | Yes           |
| GET    | `/orders/:id`    | Get order details | Yes           |

### Admin Endpoints

| Method | Endpoint                 | Description              | Auth Required |
| ------ | ------------------------ | ------------------------ | ------------- |
| GET    | `/admin/products`        | Get all products (admin) | Yes (Admin)   |
| POST   | `/admin/products/create` | Create new product       | Yes (Admin)   |
| PUT    | `/admin/products/:id`    | Update product           | Yes (Admin)   |
| DELETE | `/admin/products/:id`    | Delete product           | Yes (Admin)   |
| GET    | `/admin/orders`          | Get all orders           | Yes (Admin)   |
| PUT    | `/admin/orders/:id`      | Update order status      | Yes (Admin)   |

### OTP Endpoints

| Method | Endpoint      | Description       | Auth Required |
| ------ | ------------- | ----------------- | ------------- |
| POST   | `/otp/send`   | Send OTP to email | No            |
| POST   | `/otp/verify` | Verify OTP        | No            |

## Features in Detail

### Authentication System

- JWT-based authentication with secure HTTP-only cookies
- Password hashing using bcrypt
- OTP verification for email validation
- Protected routes with middleware authentication

### Shopping Cart

- Persistent cart stored in MongoDB
- Real-time cart updates
- Cart sidebar for quick access
- Quantity management

### Payment Processing

- Integration with Cashfree Payment Gateway
- Secure payment flow
- Order confirmation and receipt generation

### Admin Dashboard

- Product CRUD operations with image upload support
- Order management with status updates
- User management
- Sales analytics and reporting

### Automated Tasks

- Abandoned cart detection (runs every 30 minutes)
- Email notifications for order updates
- Automatic order expiry for pending payments

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

## License

This project is licensed under the ISC License.

## Authors

- **sanviii19** - [GitHub Profile](https://github.com/sanviii19)

## Acknowledgments

- Cashfree for payment gateway integration
- MongoDB for database solutions
- React and Vite teams for excellent development tools
- The open-source community

## Support

For support, email your-email@example.com or create an issue in the GitHub repository.

---

<div align="center">
  Made with love by sanviii19
</div>
