# 🎫 COMPLETE DISCOUNT CODE API ANALYSIS

## **📁 ALL DISCOUNT-RELATED FILES:**

### **1. DATABASE/MIGRATION FILES:**
```
supabase/migrations/20250829135300_create_discount_codes_table.sql
supabase/migrations/20250829132500_add_stripe_payment_fields.sql
```

### **2. API ENDPOINTS:**
```
api/admin-server.cjs - Main admin API server
api/admin/discount-codes.js - Serverless discount codes endpoint  
api/validate-discount.js - Public discount validation endpoint
api/orders.js - Order creation with discount support
api/admin/orders.js - Admin order management
api/admin/dashboard-stats.js - Dashboard stats with discount metrics
```

### **3. FRONTEND COMPONENTS:**
```
src/pages/AdminDashboard.tsx - Admin discount management interface
src/pages/AlphaPrintStart.tsx - Discount application in print flow
src/pages/AlphaPrintQuote.tsx - Quote with discount calculation
src/services/orderService.ts - Order service with discount handling
```

### **4. CONFIGURATION:**
```
.env - Environment variables
vite.config.ts - API proxy configuration
debug_report.md - Debug analysis
```

## **🔧 CURRENT ISSUES IDENTIFIED:**

### **ISSUE 1: Multiple API Servers Conflict**
- `api/admin-server.cjs` (local dev server on port 3002)
- `api/admin/discount-codes.js` (Vercel serverless function)
- **CONFLICT:** Both handle same endpoints differently

### **ISSUE 2: Database Connection Problems**
```bash
# Test shows Supabase connection failing:
curl -s "https://iteixoxyyjhrskrkuuuc.supabase.co/rest/v1/discount_codes?select=*&limit=1"
# Returns: {"message":"Invalid API key"}
```

### **ISSUE 3: Authentication Flow Issues**
```javascript
// In AdminDashboard.tsx - Line 119-125
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json'
  };
};
```

## **🎯 EXACT PROBLEM LOCATIONS:**

### **api/admin-server.cjs - Lines 105-122:**
```javascript
// Get all discount codes (admin only) - temporarily bypass auth for testing
app.get('/api/admin/discount-codes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get discount codes error:', error);
    res.status(500).json({ error: 'Failed to fetch discount codes' });
  }
});
```

### **AdminDashboard.tsx - Lines 239-269:**
```javascript
const fetchDiscountCodes = async () => {
  try {
    // Test basic connectivity first without auth headers
    const url = getApiUrl('/api/admin/health');
    const healthResponse = await fetch(url);
    console.log('Health check:', await healthResponse.text());
    
    // Now try with auth headers
    const headers = await getApiHeaders();
    console.log('Auth headers:', headers);
    
    const codesUrl = getApiUrl('/api/admin/discount-codes');
    const response = await fetch(codesUrl, {
      headers
    });
    // ... error handling
  }
};
```

## **💡 ROOT CAUSE ANALYSIS:**

1. **Supabase Service Role Key Invalid** - Line 16 in .env
2. **discount_codes Table Missing/Inaccessible** - RLS policies blocking access
3. **Multiple API Servers Confusion** - Local vs Serverless conflict
4. **Port Configuration Mismatch** - vite.config vs actual ports

## **🔨 EXACT FIXES NEEDED:**

### **FIX 1: Database Setup**
```sql
-- Run this in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  description TEXT,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed_amount')) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2) DEFAULT 0,
  maximum_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Allow admin access (replace with your admin user email)
CREATE POLICY "Admin can manage discount codes" ON discount_codes
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'shazze@silverbacktreatment.se')
  WITH CHECK (auth.jwt() ->> 'email' = 'shazze@silverbacktreatment.se');

-- Allow service role access
CREATE POLICY "Service role full access" ON discount_codes
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
```

### **FIX 2: Environment Variables**
```bash
# Update .env with correct Supabase keys:
VITE_SUPABASE_URL=https://iteixoxyyjhrskrkuuuc.supabase.co
VITE_SUPABASE_ANON_KEY=<your_actual_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_actual_service_role_key>
```

### **FIX 3: Test Commands**
```bash
# Test database connection:
curl -H "Authorization: Bearer YOUR_SERVICE_KEY" \
     -H "apikey: YOUR_SERVICE_KEY" \
     "https://iteixoxyyjhrskrkuuuc.supabase.co/rest/v1/discount_codes?select=*"

# Start servers:
npm run dev:full

# Test admin API:
curl http://localhost:3002/api/admin/health
curl http://localhost:3002/api/admin/discount-codes
```

## **⚡ IMMEDIATE ACTION ITEMS:**

1. **Run the SQL commands above in Supabase**
2. **Get fresh Supabase keys from dashboard**
3. **Update .env file**
4. **Restart all servers**
5. **Test endpoints with curl commands**

**The API architecture is correct - it's a database access issue!**
