# Admin Discount Code Management System

This document explains how to set up and use the admin system for managing discount codes for both AlphaPrint and Silverback checkout.

## 🔧 Setup Instructions

### 1. Get Supabase Service Role Key

1. Go to your Supabase project dashboard: [https://supabase.com/dashboard/project/iteixoxyyjhrskrkuuuc](https://supabase.com/dashboard/project/iteixoxyyjhrskrkuuuc)
2. Navigate to **Settings** → **API**
3. Copy the `service_role` key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. Update Environment Variables

Create or update your `.env` file:

```bash
# Copy from .env.example
cp .env.example .env
```

Add the following to your `.env` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://iteixoxyyjhrskrkuuuc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZWl4b3h5eWpocnNrcmt1dXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNzMxMzYsImV4cCI6MjA3MDk0OTEzNn0.th1_Vdi8BfeWfTDEnS3djJD8-dsEIMhLYK6-3w4w6hI

# Admin API Configuration
ADMIN_PORT=3002
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **Replace `your_service_role_key_here` with the actual service role key from step 1.**

### 3. Install Dependencies (if needed)

All required dependencies should already be installed. If not:

```bash
npm install
```

### 4. Start the Admin Server

Start the admin API server:

```bash
npm run dev:admin
```

Or start everything (main app + API + admin):

```bash
npm run dev:full
```

The admin server will run on port 3002.

## 👤 Admin User Setup

### Create Admin Account

The admin email `shazze@silverbacktreatment.se` is already configured in the database with super admin privileges. To use it:

1. Go to your Supabase Auth dashboard: [https://supabase.com/dashboard/project/iteixoxyyjhrskrkuuuc/auth/users](https://supabase.com/dashboard/project/iteixoxyyjhrskrkuuuc/auth/users)
2. Click **"Add user"** → **"Create new user"**
3. Use email: `shazze@silverbacktreatment.se`
4. Set a secure password
5. Click **"Create user"**

The system will automatically recognize this email as an admin.

## 🎫 Using the Admin System

### Access the Admin Dashboard

1. Go to: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
2. Login with `shazze@silverbacktreatment.se` and your password
3. You'll be redirected to the admin dashboard

### Dashboard Features

- **Statistics Overview**: Total codes, active codes, usage in last 30 days, total savings
- **Discount Code Management**: Create, edit, activate/deactivate, and delete codes
- **Usage Analytics**: View how codes are being used

### Creating Discount Codes

1. Click **"New Code"** button
2. Fill in the form:
   - **Code**: Unique code (e.g., "SAVE20")
   - **Name**: Display name (e.g., "Save 20€")
   - **Description**: Customer-facing description
   - **Type**: Percentage or fixed amount
   - **Value**: Discount value (10 for 10% or 20.00 for €20)
   - **Min Order**: Minimum order amount required
   - **Usage Limit**: Maximum number of uses (optional)
   - **Valid From/Until**: Date restrictions (optional)

### Sample Codes Already Created

The system comes with these pre-configured discount codes:

- `WELCOME10` - 10% off orders over €50
- `SAVE20` - €20 off orders over €100
- `VIP50` - 50% off (limited to 10 uses)
- `FREESHIP` - €15 off shipping
- `SUMMER25` - 25% off orders over €75 (100 uses)
- `BLACKFRIDAY` - €50 off orders over €200 (50 uses)

## 🔗 API Endpoints

### Admin Endpoints (Require Authentication)

- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/discount-codes` - List all discount codes
- `POST /api/admin/discount-codes` - Create new discount code
- `PUT /api/admin/discount-codes/:id` - Update discount code
- `DELETE /api/admin/discount-codes/:id` - Delete discount code
- `GET /api/admin/discount-usage` - Usage analytics

### Public Endpoints (For Frontend Integration)

- `POST /api/validate-discount` - Validate a discount code
- `POST /api/apply-discount` - Apply and record discount usage

## 🛒 Frontend Integration

### For AlphaPrint and Silverback Checkout

You can validate discount codes from your checkout forms:

```javascript
// Validate discount code
const response = await fetch('http://localhost:3002/api/validate-discount', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: 'SAVE20',
    orderAmount: 100.00,
    customerEmail: 'customer@example.com'
  })
});

const result = await response.json();

if (result.success && result.validation.valid) {
  console.log('Discount applied:', result.validation);
  // Apply discount to order
} else {
  console.log('Invalid code:', result.validation.error);
}
```

### Record Usage After Payment

```javascript
// After successful payment, record the discount usage
await fetch('http://localhost:3002/api/apply-discount', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: 'SAVE20',
    orderId: 'order_12345',
    customerEmail: 'customer@example.com',
    discountAmount: 20.00,
    orderAmount: 100.00,
    ipAddress: clientIp,
    userAgent: navigator.userAgent
  })
});
```

## 🔒 Security Features

- **Admin authentication** via Supabase Auth
- **Row Level Security** (RLS) on all tables
- **Service role key** protection for admin operations
- **JWT validation** for all admin endpoints
- **IP and user agent tracking** for usage analytics

## 🚀 Production Deployment

For production, make sure to:

1. Update CORS origins in `admin-server.js` to include your production domain
2. Use environment variables for all sensitive keys
3. Deploy the admin server to a secure environment
4. Use HTTPS for all admin operations
5. Regularly rotate the service role key

## 📊 Database Schema

The system creates these tables in your Supabase database:

- `discount_codes` - Stores all discount codes
- `discount_code_usage` - Tracks usage for analytics
- `admin_profiles` - Manages admin users

All tables have RLS enabled and proper security policies in place.

## 🐛 Troubleshooting

### Common Issues

1. **"Authentication failed"** - Check that SUPABASE_SERVICE_ROLE_KEY is correct
2. **"Access denied"** - Make sure `shazze@silverbacktreatment.se` is created in Supabase Auth
3. **"Connection refused"** - Ensure admin server is running on port 3002
4. **CORS errors** - Check the origins in admin-server.js match your frontend URL

### Checking Server Status

Visit: [http://localhost:3002/api/admin/health](http://localhost:3002/api/admin/health)

This should return a success message if the server is running correctly.
