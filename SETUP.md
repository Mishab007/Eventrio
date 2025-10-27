# Fashion Hub Setup Guide

## Issues Fixed

✅ **Frontend-Backend Connection**: Connected React frontend to Node.js backend API
✅ **Authentication System**: Fixed user registration and login with proper JWT tokens
✅ **Role-Based Access**: Implemented admin, seller, and customer roles
✅ **Seller Approval**: Added admin approval system for seller accounts
✅ **Admin User Creation**: Added special endpoint to create first admin user

## Setup Instructions

### 1. Database Setup

Make sure you have MongoDB running locally:
```bash
# Install MongoDB if not already installed
# Start MongoDB service
mongod
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5001`

### 3. Frontend Setup

```bash
# In the root directory
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Create First Admin User

1. Go to `http://localhost:5173/admin-setup`
2. Fill in admin details and create the first admin account
3. This admin can then approve seller accounts

### 5. User Registration & Roles

#### Customer Registration
- Go to `/signup`
- Select "Customer" as account type
- Register and login immediately

#### Seller Registration  
- Go to `/signup`
- Select "Seller" as account type
- Register and wait for admin approval
- Admin can approve sellers from `/admin` dashboard

#### Admin Login
- Use the admin account created in step 4
- Access admin dashboard at `/admin`
- Approve pending sellers from the dashboard

## Key Features Implemented

### Authentication
- JWT token-based authentication
- Secure password hashing with bcrypt
- Persistent login sessions
- Role-based access control

### User Management
- Customer registration (immediate access)
- Seller registration (requires approval)
- Admin user creation (first-time setup)
- Seller approval workflow

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/create-admin` - Create first admin
- `GET /api/admin/sellers/approve` - Get pending sellers
- `PUT /api/admin/sellers/approve/:id` - Approve seller

### Frontend Components
- Updated signup form with role selection
- Admin setup page for first admin creation
- Admin dashboard with seller approval
- Connected authentication context to backend

## Environment Configuration

The backend is configured to use:
- MongoDB: `mongodb://localhost:27017/fashionhub`
- JWT Secret: `fashionhub_jwt_secret_key_2024`
- Port: 5001

## Testing the System

1. **Create Admin**: Visit `/admin-setup` and create first admin
2. **Register Seller**: Go to `/signup`, select "Seller", register
3. **Approve Seller**: Login as admin, go to `/admin`, approve the seller
4. **Login as Seller**: Seller can now login and access seller features

## Troubleshooting

- Make sure MongoDB is running
- Check backend console for any errors
- Verify frontend can connect to backend (check network tab)
- Ensure all dependencies are installed



