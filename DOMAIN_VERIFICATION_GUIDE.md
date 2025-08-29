# Domain Verification Guide - Fix Email Spam Issues

## Why Emails Go to Spam

Even with Resend SMTP configured, emails can still go to spam due to:

### 1. **Domain Authentication Missing**
Your domain `silverbacktreatment.se` needs proper DNS records for email authentication.

### 2. **Content Triggers** ✅ FIXED
- Removed all-caps subjects like "NEW ORDER ALERT"
- Reduced excessive emojis in admin emails
- Changed "IMMEDIATE ACTION REQUIRED" to "Action Items"

---

## Required DNS Records for silverbacktreatment.se

### **SPF Record (Required)**
Add this TXT record to your DNS:
```
Name: @
Type: TXT
Value: v=spf1 include:_spf.resend.com ~all
```

### **DKIM Record (Required)**
1. In your Resend dashboard, go to Domains
2. Add `silverbacktreatment.se` as a verified domain
3. Copy the DKIM record provided by Resend
4. Add it to your DNS as a TXT record

### **DMARC Record (Recommended)**
Add this TXT record:
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:silverbacktreatment@gmail.com
```

---

## How to Add DNS Records

### **If using Cloudflare:**
1. Login to Cloudflare dashboard
2. Select your domain `silverbacktreatment.se`
3. Go to DNS → Records
4. Click "Add record"
5. Add each record above

### **If using other DNS providers:**
Similar process - access DNS management and add TXT records.

---

## Immediate Fixes Applied ✅

1. **Removed spam trigger words:**
   - "NEW ORDER ALERT" → "New Order Received"
   - "IMMEDIATE ACTION REQUIRED" → "Action Items"
   - Reduced excessive emojis in subject lines

2. **Professional email structure:**
   - Clean subject lines
   - Proper sender names
   - Consistent from addresses

---

## Testing Email Deliverability

### **Test Tools:**
1. **Mail Tester**: https://www.mail-tester.com/
2. **MX Toolbox**: https://mxtoolbox.com/deliverability
3. **Gmail Postmaster Tools**: For Gmail delivery insights

### **Best Practices:**
1. Send test emails to yourself first
2. Check spam folder initially
3. Mark emails as "Not Spam" to improve reputation
4. Monitor delivery rates in Resend dashboard

---

## Expected Results After DNS Setup

✅ **SPF + DKIM + DMARC** = ~95% inbox delivery
✅ **Clean content** = No content-based spam filtering
✅ **Consistent sender** = Better reputation building

---

## Priority Actions

1. **HIGH**: Add SPF record immediately
2. **HIGH**: Set up domain verification in Resend
3. **MEDIUM**: Add DMARC record
4. **LOW**: Monitor delivery rates

Once DNS records are added, emails should start landing in inbox within 24-48 hours.
