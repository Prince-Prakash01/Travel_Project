# TravelDivya - Complete Project Documentation

## 1. Project Overview
**TravelDivya** is a comprehensive, full-stack travel booking platform built using the MERN stack (MongoDB, Express.js, React, Node.js). It is designed to facilitate seamless hotel and tour package bookings for users while providing a robust management interface for administrators. The application features a modern, responsive user interface with a premium "Glassmorphism" aesthetic, dark mode elements, and vibrant travel imagery.

---

## 2. Technology Stack

### Frontend (User Interface)
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (with custom configurations for glassmorphism and animations)
- **Routing**: React Router DOM (v6)
- **State Management**: React Hooks (useState, useEffect, useContext)
- **HTTP Client**: Axios
- **Icons**: React Icons (Fa, Md, Bi sets)

### Backend (Server & API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **File Handling**: FileReader API (Base64 storage) / Multer (optional configuration)
- **Security**: CORS, Bcrypt (password hashing)

### Database
- **Database**: MongoDB (NoSQL)
- **ODM**: Mongoose (Schemas for Users, Listings, Bookings)

---

## 3. Key Features & Modules

### A. Public User Features
1.  **Home Page**:
    -   **Hero Slider**: Dynamic, automatic image carousel showcasing 5 premium travel destinations.
    -   **Search Bar**: Advanced filtering by destination, dates, and number of guests.
    -   **Featured Listings**: Curated list of popular hotels and packages.
    
2.  **Explore / Search**:
    -   View all available hotels and tour packages.
    -   Filter results based on price, location, and type.
    
3.  **Deals Page**:
    -   Displays active promotional offers created by admins.
    -   Shows original price vs. discounted price with savings percentage.
    -   Dynamic content fetched directly from the live database.

4.  **Listing Details**:
    -   Comprehensive view with image galleries, amenities, location map (visual), and pricing.
    -   "Request to Book" functionality.

### B. Authenticated User Features
1.  **User Authentication**:
    -   Secure Registration and Login.
    -   Password encryption and JWT session management.
    
2.  **User Dashboard**:
    -   **My Bookings**: View history of past and upcoming trips (Status: Confirmed/Done).
    -   **Wishlist**: Save favorite packages for later.
    -   **Profile Management**: Update personal details.
    
3.  **Booking System**:
    -   Multi-step checkout process.
    -   Booking confirmation with status tracking.

### C. Admin Features (Control Panel)
The Admin Dashboard is a secured area for platform management.

1.  **User Management**:
    -   View all registered users.
    -   Approve or Reject new user registrations.
    
2.  **Package Management**:
    -   **Add Package**: Create new Listings (Hotels or Tour Packages).
        -   *Features*: System file upload (image preview), rich text description, pure black/white placeholders for readability.
    -   **Manage Packages**: Grid view of all inventory.
        -   *Actions*: Edit existing details, Update images, Delete packages.
        
3.  **Deals Management**:
    -   **Create Deals**: Select an existing package and apply a discount % and expiration date.
    -   **Manage Deals**: View, Edit, or Remove active promotions.
    
---

## 4. System Architecture & Workflow

### 1. Data Flow
1.  **Client (React)** sends HTTP requests (GET, POST, PUT, DELETE) to the **Server**.
2.  **Server (Express)** receives the request, passes it through **Middleware** (Auth/Admin checks).
3.  **Controller Logic** processes the data (validations, calculations).
4.  **Mongoose Models** interact with **MongoDB** to Create, Read, Update, or Delete (CRUD) data.
5.  **Response** is sent back to the Client in JSON format.
6.  **Client** updates the UI state (React State) to reflect changes (e.g., showing a success message or updating a list).

### 2. Authentication Flow
-   **Login**: User submits credentials -> Server verifies hash -> Returns JWT Token.
-   **Session**: Token is stored in `localStorage`.
-   **Protected Routes**: Token is sent in `Authorization` header. Server verifies token before granting access to Booking or Admin routes.

---

## 5. Database Schema Structure

### User Model
-   `username`: String
-   `email`: String (Unique)
-   `password`: String (Hashed)
-   `role`: String ('user' or 'admin')
-   `isVerified`: Boolean

### Listing (Package) Model
-   `title`: String
-   `description`: String
-   `price`: Number
-   `location`: Object { city, country }
-   `type`: String ('hotel' or 'package')
-   `images`: Array [String (Base64/URL)]
-   `amenities`: Array

### Booking Model
-   `user`: ObjectId (Ref -> User)
-   `listing`: ObjectId (Ref -> Listing)
-   `dates`: Object { checkIn, checkOut }
-   `status`: String ('confirmed', 'completed', 'cancelled')
-   `totalPrice`: Number

---

## 6. Project Structure

```
traveldivya/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, Footer, Cards)
│   │   ├── context/        # Global State (AuthContext)
│   │   ├── pages/          # Full Page Views (Home, AdminDashboard, Deals)
│   │   ├── App.jsx         # Main Router Setup
│   │   └── main.jsx        # Entry Point
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── config/             # DB Connection (db.js)
│   ├── controllers/        # Business Logic
│   ├── middleware/         # Auth & Role Checks
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Endpoints (auth, listings, admin)
│   ├── server.js           # Server Entry Point
│   └── package.json
│
└── PROJECT_DOCUMENTATION.md # This file
```

---

## 7. How to Run the Project

1.  **Prerequisites**: Node.js and MongoDB installed locally.
2.  **Start Backend**:
    ```bash
    cd server
    npm run dev
    # Runs on http://localhost:5000
    ```
3.  **Start Frontend**:
    ```bash
    cd client
    npm run dev
    # Runs on http://localhost:5173
    ```
4.  **Access**: Open your browser to the client URL.

---

## 8. Recent Enhancements (Change Log)

-   **Admin UI Overhaul**: Fixed visibility issues by updating text colors and placeholders to high-contrast white/black where appropriate.
-   **Dynamic Systems**: Converted static Deals page to a dynamic system driven by Admin inputs.
-   **Visual Upgrades**: Implemented an automated Hero Image slider on the homepage replacing static backgrounds.
-   **Package Handling**: Added File Upload support and Edit capabilities for all listings.
-   **Solo Traveler Safety Score**: Added an advanced, AI-powered safety analytics module with 6 sub-categories (Accommodation, Night Safety, Transport, etc.), risk meter, and safety badges. (See `SOLO_TRAVELER_SAFETY_SCORE.md` for details).
