# 🔧 URGENT: Fix Supabase Service Role Key

## The Issue
Your current `SUPABASE_SERVICE_ROLE_KEY` in the `.env` file is invalid/expired, causing authentication failures.

## How to Fix

### Step 1: Get New Service Role Key
1. Go to: https://supabase.com/dashboard/project/iteixoxyyjhrskrkuuuc
2. Click **Settings** → **API**
3. Under **Project API keys**, copy the **service_role** key (NOT the anon key)

### Step 2: Update .env File
Replace line 16 in your `.env` file:

```bash
# Current (INVALID):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZWl4b3h5eWpocnNrcmt1dXVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM3MzEzNiwiZXhwIjoyMDcwOTQ5MTM2fQ.1aOdVqBHXMlGDlL1M4EtV_EkCa5i7PQ9m6B7IxoEPbE

# Replace with new key from dashboard:
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key_here
```

### Step 3: Restart Services
```bash
pkill -f admin-server
node api/admin-server.cjs &
```

### Step 4: Test
```bash
curl -s http://localhost:3002/api/admin/discount-codes
```

Should return discount codes instead of "Invalid API key" error.

## Why This Happened
- Service role keys can expire or be regenerated
- The key in your .env file is no longer valid in the Supabase project
- We need a fresh key with proper permissions

**⚠️ IMPORTANT:** Do this step first before deploying or testing the UI!
