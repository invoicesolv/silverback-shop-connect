# 🔍 COMPLETE DEBUG REPORT

## **PROBLEM DIAGNOSIS:**
- ❌ **SUPABASE_SERVICE_ROLE_KEY is invalid/expired**
- ❌ Admin server was not running initially  
- ❌ Port mismatch in vite config (8081 vs 8082)

## **PROOF OF ISSUE:**
```bash
curl -s -H "Authorization: Bearer YOUR_SERVICE_KEY" \
  "https://iteixoxyyjhrskrkuuuc.supabase.co/rest/v1/discount_codes?select=*&limit=1"

Response: {"message":"Invalid API key","hint":"Double check your Supabase `anon` or `service_role` API key."}
```

## **SOLUTION:**

### 1. **FIX SUPABASE SERVICE ROLE KEY**
Go to your Supabase dashboard:
1. Visit: https://supabase.com/dashboard
2. Go to Project Settings > API
3. Copy the **service_role** key (not anon key!)
4. Replace `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file

### 2. **WORKING API SETUP:**
Your APIs are configured correctly:
- ✅ Main API: `localhost:3001` (Stripe, emails)
- ✅ Admin API: `localhost:3002` (discount codes, orders)  
- ✅ Frontend: `localhost:8082` (React app)

### 3. **RUN COMMAND:**
```bash
npm run dev:full
```

### 4. **TEST ENDPOINTS:**
```bash
# Health check
curl http://localhost:3002/api/admin/health

# Discount codes (after fixing Supabase key)
curl http://localhost:3002/api/admin/discount-codes
```

## **CURRENT STATUS:**
- 🔧 **NEEDS FIXING:** Update SUPABASE_SERVICE_ROLE_KEY in .env
- ✅ **WORKING:** All server configurations  
- ✅ **WORKING:** API proxy setup
- ✅ **WORKING:** Authentication flow structure

## **NEXT STEPS:**
1. Update Supabase service role key
2. Restart servers: `npm run dev:full`  
3. Test at: http://localhost:8082/admin/dashboard

**The API architecture is solid - just need the correct Supabase key!**
