# API-FullStack

## 📋 Project Description

This project is a backend API for an e-commerce platform, designed to serve modern web applications. The goal is to provide a robust, scalable, and secure foundation for managing users, products, orders, payments, and integrations with external services such as Stripe and email delivery.

---

## 🚀 Main Features

- **User Management & Authentication**
  - Registration, login, and JWT authentication
  - Google OAuth integration
- **Customer Management**
  - CRUD for customers and their addresses
- **Product Management**
  - CRUD for products, categories, and images
- **Shopping Cart**
  - Add, remove, and update products in the cart
- **Order Management**
  - Create orders from the cart
  - Associate products with orders
  - Order history per customer
- **Online Payments**
  - Stripe integration (credit card and ready for MB WAY)
  - Stripe webhook to confirm payments before creating orders
- **Email Delivery**
  - Automatic order confirmation emails via Nodemailer/SMTP
- **Documentation**
  - Swagger/OpenAPI available for all endpoints
- **Other**
  - Image upload
  - Configurable CORS middleware
  - Environment separation (DEV/PROD) via `.env`

---

## 🛠️ Technologies Used

- **Node.js** (runtime)
- **Express.js** (backend framework)
- **Sequelize** (ORM for SQL databases)
- **MySQL** or **PostgreSQL** (configurable)
- **JWT** (authentication)
- **Nodemailer** (email delivery)
- **Stripe** (online payments)
- **Swagger** (API documentation)
- **dotenv** (environment variable management)
- **Multer** (file uploads)
- **bcrypt** (password hashing)
- **CORS** (request security)

---

## 🎯 Purpose

The goal of this project is to serve as a complete backend for online stores, SaaS applications, or any solution that requires:

- User and permission management
- Product and order management
- Integration with modern payment methods (Stripe)
- Automatic email notifications
- An API documented and easy to consume by modern frontends (React, Next.js, etc.)

---

## 📦 How to Use

1. **Clone the repository**
2. **Configure the `.env`** file with your credentials (database, Stripe, email, etc.)
3. **Install dependencies**

   ```
   pnpm install

   ```

4. **Run migrations and seeds** (if applicable)
5. **Start the server**

   ```
   pnpm start

   ```

6. **Access the Swagger documentation** at `/api/docs` (if enabled)

---

## 📄 Final Notes

- The project is ready for deployment in cloud environments (Coolify, Docker, etc.)
- Support for multiple payment methods can be easily expanded
- Modular and maintainable codebase

---
