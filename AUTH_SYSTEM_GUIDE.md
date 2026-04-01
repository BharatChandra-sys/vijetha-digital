# Authentication System - Quick Start Guide

## 🎯 Overview

Your Vijetha Digital platform now has a professional, production-ready authentication system with separate portals for admin and staff users.

## 🔐 Login Portals

### Admin Portal
**URL:** `/admin/login`
- **Who:** System administrators
- **Features:** Dark professional theme, full system access
- **After Login:** Redirected to `/admin/dashboard`
- **Email:** Use your admin email (e.g., admin@vijetha.com)

### Staff Portal
**URL:** `/staff/login`
- **Who:** Operations managers, drivers, floor staff
- **Features:** Vibrant modern theme, role-based workspace access
- **After Login:** Redirected to `/staff/workspace`
- **Email:** Use your work email (e.g., your.name@vijetha.com)

## 📧 Password Recovery

### Forgot Password
Both portals have "Forgot Password" links that:
1. Send a secure reset link to your email
2. Link expires in 1 hour
3. Rate limited for security (2 attempts per minute)

### Reset Password
Click the link in your email to:
1. Validate the reset token
2. Create a new password (min 8 characters)
3. Automatically redirect to login

## 🏢 Staff Workspace

After staff login, you'll see available workspaces based on your role:

### Operations Dashboard
- **Who Can Access:** Managers, Admins, Super Admins
- **What You Can Do:**
  - View all production jobs
  - Update order status
  - Track manufacturing progress
  - Auto-refresh every 30 seconds

### Delivery Dashboard
- **Who Can Access:** Drivers, Admins, Super Admins
- **What You Can Do:**
  - View delivery trips
  - Update shipment status
  - Track deliveries
  - Auto-refresh every 30 seconds

### No Access?
If you don't see any workspace cards, contact your administrator to assign IAM roles.

## 🚪 Logout

Logout button automatically redirects you to:
- **Admins** → `/admin/login`
- **Staff** → `/staff/login`
- **Customers** → `/login`

## 🔄 Role-Based Redirects

The system intelligently redirects users based on their role:

| User Type | Has IAM Roles | Login Redirect |
|-----------|---------------|----------------|
| Admin | Any | `/admin/dashboard` |
| Staff | Yes (manager, driver, etc.) | `/staff/workspace` |
| Customer | No | `/` (home) |

## 🛡️ Security Features

### Built-in Protection
- ✅ JWT tokens with expiration
- ✅ Rate limiting on sensitive endpoints
- ✅ Password strength requirements
- ✅ Secure token validation
- ✅ Generic error messages (security best practice)
- ✅ Auto-logout on token expiration

### Best Practices
- Never share your password
- Use strong passwords (min 8 characters)
- Log out when done working
- Report suspicious activity immediately

## 🎨 UI Features

### Visual Themes
- **Admin:** Dark slate/purple gradient (professional authority)
- **Staff:** Vibrant indigo/purple/pink gradient (modern energy)

### UX Enhancements
- 👁️ Password visibility toggle
- 🔔 Error notifications with auto-dismiss
- ⏳ Loading states on actions
- ✅ Success confirmations
- 🔄 Auto-refresh dashboards
- 📱 Mobile responsive

## 📱 Accessing the System

### Admin Users
```
1. Navigate to: https://your-domain.com/admin/login
2. Enter admin email and password
3. Click "Sign In"
4. Redirected to Admin Dashboard
5. Full system access granted
```

### Staff Users
```
1. Navigate to: https://your-domain.com/staff/login
2. Enter work email and password
3. Click "Access Workspace"
4. View available workspaces
5. Click desired workspace (Operations/Delivery)
6. Start working!
```

## 🆘 Troubleshooting

### Can't Login?
1. Check email spelling
2. Verify password (use eye icon to reveal)
3. Try "Forgot Password" if needed
4. Contact admin if account is locked

### No Workspaces Available?
1. Verify you have IAM roles assigned
2. Contact administrator to request access
3. Check your role assignments in admin dashboard

### Reset Link Expired?
1. Request new reset link
2. Complete reset within 1 hour
3. Check spam folder for emails

### Page Won't Load?
1. Clear browser cache
2. Try incognito/private mode
3. Check internet connection
4. Contact support if issue persists

## 📞 Support

### For Administrators
- Access Staff Access tab in Admin Dashboard
- Assign IAM roles to staff
- View user permissions
- Bulk role assignments available

### For Staff
- Contact your manager for access issues
- Use Help & Support link in workspace
- Check profile settings

### Technical Issues
- Check browser console for errors
- Report to IT/development team
- Include: URL, error message, steps to reproduce

## 🔧 Developer Notes

### Route Structure
```
/admin/login               → Admin login portal
/staff/login               → Staff login portal
/admin/forgot-password     → Admin password recovery
/staff/forgot-password     → Staff password recovery
/reset-password?token=...  → Unified reset page
/staff/workspace           → Staff workspace landing
/staff/operations          → Operations dashboard (manager role)
/staff/delivery            → Delivery dashboard (driver role)
```

### Key Components
- `AdminLogin.jsx` - Admin portal
- `StaffLogin.jsx` - Staff portal
- `StaffWorkspace.jsx` - Role-based workspace selector
- `AdminRoute.jsx` - Admin-only route guard
- `StaffRoute.jsx` - Staff-only route guard
- `IamRoleRoute.jsx` - IAM role-based guard

### Authentication Flow
```
Login → Validate → Get JWT → Store Token → Decode User Info → Route Based on Role
```

## 📊 Production Checklist

Before going live, complete the [Production Auth Checklist](./PRODUCTION_AUTH_CHECKLIST.md):
- ✅ Test all login flows
- ✅ Verify password reset emails
- ✅ Test rate limiting
- ✅ Check route guards
- ✅ Validate token expiration
- ✅ Mobile testing
- ✅ Cross-browser testing

---

**System Version:** 1.0.0  
**Last Updated:** $(date)  
**Status:** Production Ready 🚀
