# 📧 Brevo Email & 🔐 Google OAuth Setup Guide

Complete guide for setting up Brevo email service and Google OAuth authentication for your Vijetha Digital application.

---

## Part 1: Brevo Email Setup (Recommended for Render)

### Why Brevo Instead of SMTP?
- ✅ **More Reliable**: HTTP API is more stable than SMTP on cloud platforms
- ✅ **Better Deliverability**: Professional email infrastructure
- ✅ **Free Tier**: 300 emails/day free forever
- ✅ **No Port Issues**: Works on all cloud platforms (Render, Vercel, etc.)
- ✅ **Professional Templates**: Built-in email designer
- ✅ **Analytics**: Track opens, clicks, bounces

### Step 1: Create Brevo Account

1. Go to https://www.brevo.com (formerly Sendinblue)
2. Click "Sign up free"
3. Fill in your details:
   - Email address
   - Password
   - Company name: `Vijetha Digital`
4. Verify your email address

### Step 2: Get API Key

1. Log in to Brevo dashboard
2. Click your name (top right) → **"SMTP & API"**
3. Click **"Create a new API key"**
4. Name it: `Vijetha Digital Production`
5. **Copy the API key** (starts with `xkeysib-...`)
6. ⚠️ **Save it securely** - you won't see it again!

### Step 3: Configure Sender Email

1. In Brevo dashboard, go to **"Senders"** → **"Add a sender"**
2. Add your email:
   - **Email**: `noreply@yourdomain.com` (or use a Gmail for testing)
   - **Name**: `Vijetha Digital`
3. **Verify the email** (check inbox for verification link)

**For Testing (No Domain Required):**
- Use your personal Gmail: `yourname@gmail.com`
- Brevo will send from this email
- Works immediately, no DNS setup needed

**For Production (Custom Domain):**
- Use: `noreply@yourdomain.com`
- Requires DNS verification (SPF, DKIM records)
- Better deliverability and professional appearance

### Step 4: Add to Render Environment Variables

In your Render dashboard → Service → Environment:

```bash
BREVO_API_KEY=xkeysib-your-api-key-here
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_FROM_NAME=Vijetha Digital
```

### Step 5: Test Email Service

After deployment, test with:

```bash
curl -X POST https://your-app.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-test-email@gmail.com",
    "password": "Test123!@#"
  }'
```

Check your inbox for the welcome email!

---

## Part 2: Google OAuth Setup

### Why Google OAuth?
- ✅ **Better UX**: One-click login
- ✅ **More Secure**: No password to manage
- ✅ **Verified Emails**: Google emails are pre-verified
- ✅ **Professional**: Expected by modern users

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **"Select a project"** → **"New Project"**
3. Project name: `Vijetha Digital`
4. Click **"Create"**
5. Wait for project creation (30 seconds)

### Step 2: Enable Google+ API

1. In the project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it → Click **"Enable"**
4. Wait for activation

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** → Click **"Create"**
3. Fill in the form:

**App Information:**
- **App name**: `Vijetha Digital`
- **User support email**: Your email
- **App logo**: (Optional) Upload your logo (120x120px)

**App Domain:**
- **Application home page**: `https://your-app.vercel.app`
- **Privacy policy**: `https://your-app.vercel.app/privacy`
- **Terms of service**: `https://your-app.vercel.app/terms`

**Developer Contact:**
- **Email**: Your email

4. Click **"Save and Continue"**

**Scopes:**
5. Click **"Add or Remove Scopes"**
6. Select these scopes:
   - ✅ `.../auth/userinfo.email`
   - ✅ `.../auth/userinfo.profile`
   - ✅ `openid`
7. Click **"Update"** → **"Save and Continue"**

**Test Users (for development):**
8. Click **"Add Users"**
9. Add your test email addresses
10. Click **"Save and Continue"**

### Step 4: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: `Vijetha Digital Web Client`

**Authorized JavaScript origins:**
```
http://localhost:5173
https://your-app.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:5173/auth/google/callback
https://your-app.vercel.app/auth/google/callback
```

5. Click **"Create"**
6. **Copy the Client ID** (starts with `xxx.apps.googleusercontent.com`)
7. **Copy the Client Secret**
8. Click **"OK"**

### Step 5: Add to Environment Variables

**Backend (Render):**
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Frontend (Vercel):**
```bash
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Step 6: Update Frontend Code

The Google OAuth button is already implemented in your frontend. Just ensure the environment variable is set in Vercel.

### Step 7: Test Google OAuth

1. Go to your deployed frontend
2. Click **"Sign in with Google"**
3. Select your Google account
4. Grant permissions
5. You should be logged in!

---

## Part 3: DNS Configuration (Optional - For Custom Domain Emails)

### For Better Email Deliverability

If using a custom domain for emails (e.g., `noreply@yourdomain.com`):

1. In Brevo dashboard, go to **"Senders"** → Click your domain
2. Copy the DNS records shown
3. Add to your domain DNS (Cloudflare, GoDaddy, etc.):

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:spf.brevo.com ~all
```

**DKIM Record:**
```
Type: TXT
Name: mail._domainkey
Value: (provided by Brevo)
```

**DMARC Record (Optional):**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

4. Wait 24-48 hours for DNS propagation
5. Verify in Brevo dashboard

---

## Part 4: Testing Checklist

### Email Testing

- [ ] Welcome email on registration
- [ ] Order confirmation email
- [ ] Order shipped notification
- [ ] Password reset email
- [ ] Payment success email
- [ ] Check spam folder if not received
- [ ] Verify email formatting on mobile
- [ ] Test with different email providers (Gmail, Outlook, Yahoo)

### OAuth Testing

- [ ] Google sign-in works
- [ ] User profile data is captured
- [ ] Email is verified automatically
- [ ] Redirect after login works
- [ ] Token refresh works
- [ ] Logout works properly

---

## Part 5: Troubleshooting

### Brevo Issues

**Emails not sending:**
- Check API key is correct in Render
- Verify sender email is verified in Brevo
- Check Brevo dashboard for error logs
- Ensure you haven't exceeded free tier limit (300/day)

**Emails going to spam:**
- Add SPF/DKIM records
- Use a custom domain instead of Gmail
- Warm up your sending domain gradually
- Avoid spam trigger words in subject

### Google OAuth Issues

**"Redirect URI mismatch":**
- Ensure redirect URI in Google Console matches exactly
- Include both http://localhost:5173 and production URL
- No trailing slashes

**"Access blocked: This app's request is invalid":**
- Complete OAuth consent screen configuration
- Add test users in development mode
- Verify scopes are correct

**"Invalid client ID":**
- Check VITE_GOOGLE_CLIENT_ID in Vercel
- Ensure it matches Google Console
- Rebuild frontend after adding env var

---

## Part 6: Production Checklist

### Before Going Live

- [ ] Brevo API key added to Render
- [ ] Sender email verified in Brevo
- [ ] SPF/DKIM records added (if using custom domain)
- [ ] Google OAuth credentials created
- [ ] OAuth consent screen published (not in testing mode)
- [ ] Redirect URIs include production URL
- [ ] Environment variables set in Render and Vercel
- [ ] Test all email types
- [ ] Test Google OAuth flow
- [ ] Monitor Brevo dashboard for delivery rates

### Monitoring

**Brevo Dashboard:**
- Track email delivery rates
- Monitor bounces and complaints
- Check API usage

**Google Cloud Console:**
- Monitor OAuth usage
- Check for errors in logs
- Review security alerts

---

## Part 7: Cost & Limits

### Brevo Free Tier
- **300 emails/day** (9,000/month)
- Unlimited contacts
- Email templates
- Basic analytics
- **Cost**: $0/month

**Paid Plans (if needed):**
- Lite: $25/month (10,000 emails)
- Premium: $65/month (20,000 emails)
- Enterprise: Custom pricing

### Google OAuth
- **Free** for most use cases
- No limits on authentication requests
- **Cost**: $0/month

---

## Part 8: Email Templates Preview

Your emails will look like this:

### Welcome Email
```
┌─────────────────────────────────────┐
│   [Vijetha Digital Logo]            │
│   Professional Printing Services    │
├─────────────────────────────────────┤
│                                     │
│   Welcome, John! 👋                 │
│                                     │
│   Thank you for joining...          │
│                                     │
│   🚀 What's Next?                   │
│   • Browse products                 │
│   • Get instant quotes              │
│   • Upload designs                  │
│                                     │
│   [Explore Products Button]         │
│                                     │
├─────────────────────────────────────┤
│   Need Help?                        │
│   📧 support@vijetha.com            │
│   📱 WhatsApp Support               │
└─────────────────────────────────────┘
```

### Order Confirmation
```
┌─────────────────────────────────────┐
│   [Vijetha Digital Logo]            │
├─────────────────────────────────────┤
│                                     │
│   Order Confirmed! ✅               │
│                                     │
│   Order Summary                     │
│   Order ID: #12345                  │
│   Items: 3                          │
│   Total: ₹2,500.00                  │
│   Status: ✅ Confirmed              │
│                                     │
│   [Track Your Order Button]         │
│                                     │
└─────────────────────────────────────┘
```

---

## Part 9: Quick Reference

### Environment Variables Summary

**Render (Backend):**
```bash
# Brevo Email
BREVO_API_KEY=xkeysib-...
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_FROM_NAME=Vijetha Digital

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

**Vercel (Frontend):**
```bash
# Google OAuth
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

### Important Links

- **Brevo Dashboard**: https://app.brevo.com
- **Google Cloud Console**: https://console.cloud.google.com
- **Brevo API Docs**: https://developers.brevo.com
- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2

---

## 🎉 You're All Set!

Your application now has:
- ✅ Professional email service with Brevo
- ✅ Google OAuth authentication
- ✅ Beautiful branded email templates
- ✅ Reliable delivery on cloud platforms

**Next Steps:**
1. Test all email flows
2. Test Google OAuth
3. Monitor delivery rates
4. Collect user feedback

Need help? Check the troubleshooting section or contact support!
