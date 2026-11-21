# 🔒 SECURITY REMINDER - IMPORTANT!

## ⚠️ CRITICAL: Credentials Exposed

You shared these credentials in chat:
- ✅ Google Client ID (public, safe to share)
- ❌ Brevo API Key (PRIVATE - compromised!)

## 🚨 Immediate Actions Required

### 1. Regenerate Brevo API Key (DO THIS NOW!)

1. Go to https://app.brevo.com
2. Login with your account
3. Click your name → **"SMTP & API"**
4. Find the key: `Vijetha Digital Production`
5. Click **"Delete"** or **"Regenerate"**
6. Create a new API key
7. **Copy the new key**
8. Update in Render environment variables

### 2. Update Render Environment Variables

1. Go to Render dashboard
2. Your service → **"Environment"**
3. Update `BREVO_API_KEY` with the new key
4. Click **"Save Changes"**
5. Service will auto-redeploy

### 3. Never Commit Credentials to Git

```bash
# Verify .env is in .gitignore
cat .gitignore | grep .env

# Should show:
# .env
# .env.local
# .env.production
```

### 4. Check Git History

```bash
# Check if .env was ever committed
git log --all --full-history -- .env

# If it shows commits, you need to clean history:
# (This is advanced - be careful!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

## ✅ Safe Practices

### What's Safe to Share
- ✅ Google Client ID (public)
- ✅ Razorpay Key ID (public, for frontend)
- ✅ Cloudinary Cloud Name (public)
- ✅ Frontend URL
- ✅ API documentation (in development)

### What's NEVER Safe to Share
- ❌ API Keys (Brevo, Cloudinary, etc.)
- ❌ API Secrets (Razorpay, Google, etc.)
- ❌ JWT Secret Key
- ❌ Database passwords
- ❌ Admin passwords
- ❌ Webhook secrets
- ❌ Any token or key marked "secret"

## 🔐 Best Practices

### 1. Use Environment Variables
```bash
# Never hardcode secrets
# BAD:
api_key = "xkeysib-abc123..."

# GOOD:
api_key = os.getenv("BREVO_API_KEY")
```

### 2. Use .env Files Locally
```bash
# .env (local development only)
BREVO_API_KEY=your-key-here

# .gitignore (always!)
.env
.env.local
.env.production
```

### 3. Use Platform Environment Variables
- **Render**: Service → Environment
- **Vercel**: Project → Settings → Environment Variables
- **Never** commit these to Git

### 4. Rotate Keys Regularly
- Change API keys every 90 days
- Change passwords every 90 days
- Rotate JWT secrets periodically

### 5. Use Different Keys for Environments
```bash
# Development
BREVO_API_KEY=xkeysib-dev-key...

# Production
BREVO_API_KEY=xkeysib-prod-key...
```

## 📋 Security Checklist

Before deployment:
- [ ] All secrets in environment variables
- [ ] `.env` in `.gitignore`
- [ ] No secrets in Git history
- [ ] Different keys for dev/prod
- [ ] API keys regenerated if exposed
- [ ] Strong passwords used
- [ ] JWT secret is random 64+ chars
- [ ] Database password is strong
- [ ] Admin password is strong

## 🆘 If Credentials Are Compromised

### Immediate Actions:
1. **Regenerate all compromised keys**
2. **Update in deployment platforms**
3. **Check for unauthorized usage**
4. **Review access logs**
5. **Enable 2FA where possible**

### For Each Service:

**Brevo:**
- Regenerate API key
- Check email sending logs
- Review account activity

**Razorpay:**
- Regenerate key/secret
- Check transaction logs
- Enable webhook signature verification

**Cloudinary:**
- Regenerate API secret
- Check upload logs
- Review storage usage

**Google OAuth:**
- Regenerate client secret
- Review OAuth consent logs
- Check authorized apps

**Database:**
- Change password
- Review connection logs
- Check for suspicious queries

## 📞 Support

If you suspect a security breach:
1. Regenerate all credentials immediately
2. Review all service logs
3. Check for unauthorized access
4. Contact service providers if needed

---

## ✅ Current Status

**What You Need to Do NOW:**
1. ✅ Google Client ID is configured (safe)
2. ❌ **Regenerate Brevo API Key** (compromised in chat)
3. ✅ Update Render with new key
4. ✅ Verify `.env` is in `.gitignore`

**Time Required**: 5 minutes

**Priority**: 🔴 HIGH - Do this before deployment!

---

**Remember**: When in doubt, regenerate the key. It's better to be safe!
