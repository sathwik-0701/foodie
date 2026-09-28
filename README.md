# Foodie — Production-Quality MERN Food Discovery & Ordering Platform

**Foodie** is a modern, full-stack MERN (MongoDB, Express.js, React 18, Node.js) food-tech application. Inspired by leading platforms like Zomato, Foodie features a custom visual identity, database-driven categories/restaurants/menus/coupons/reviews, JWT authentication with role-based access, multi-step checkout, real-time animated order tracking, full admin dashboard, Brevo-ready email integration, and Cloudinary-ready media upload architecture.

---

## Key Features

- **Food Discovery & Category System**: Database-driven category scroll (Salad, Rolls, Desserts, Pasta, Noodles, Pure Veg, Cakes, etc.).
- **Restaurant Search & Advanced Filters**: Debounced search bar, filters by cuisine, price range, veg-only toggle, and multi-option sorting.
- **Restaurant Details & Menu Tab Navigation**: Cover banner, rating pills, menu item cards with veg/non-veg tags, pricing, and quantity controls.
- **Persistent Cart & Multi-Step Checkout**: Slide-over cart drawer with coupon validation, delivery fee & tax calculation, address selector, and mock payment gateway.
- **Live Order Tracking Timeline**: Animated progress tracker (`PLACED` -> `CONFIRMED` -> `PREPARING` -> `READY` -> `OUT_FOR_DELIVERY` -> `DELIVERED`).
- **User Dashboard & Wishlist**: Personal info, saved addresses book (CRUD), and favorite restaurants wishlist.
- **Admin Control Center**: Platform stats analytics, restaurant CRUD, menu item manager, order status switcher, and registered users list.
- **External Services Ready**:
  - **Brevo Email Service**: Configured via environment variables with fallback console logging.
  - **Cloudinary Image Storage**: Configured via environment variables with fallback static asset resolution.
- **Seamless Local Fallback**: Runs out of the box with embedded seed data even when external credentials are unset.

---

## Tech Stack

- **Frontend**: React 18 (Vite), Tailwind CSS, Framer Motion, Lucide-React, Axios, React Router v6.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js.
- **Testing**: Jest & Supertest API integration test suite.

---

## Installation & Setup Instructions

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-username/foodie.git
cd foodie

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `server/.env`:

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/foodie_db
JWT_SECRET=foodie_super_secret_jwt_key_2026_production_ready
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional Third-Party Credentials
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

BREVO_API_KEY=
BREVO_SENDER_EMAIL=noreply@foodie.com
BREVO_SENDER_NAME=Foodie App
```

### 3. Seed MongoDB Database (Optional)

```bash
cd server
npm run seed
```

### 4. Run Development Servers

```bash
# Start Express Backend Server (Port 5000)
cd server
npm run dev

# In another terminal, Start Vite React Client (Port 5173)
cd client
npm run dev
```

### 5. Run API Tests

```bash
cd server
npm run test
```

---


