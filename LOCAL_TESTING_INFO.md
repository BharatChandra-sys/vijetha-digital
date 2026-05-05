# 🚀 Local Testing Setup - Vijetha Digital

## ✅ Services Running

### Backend API
- **Local URL**: http://localhost:8000
- **Status**: ✅ Running
- **Process**: Uvicorn with auto-reload
- **Port**: 8000

### Frontend Application
- **Local URL**: http://localhost:5173
- **Status**: ✅ Running
- **Process**: Vite dev server
- **Port**: 5173

### Tunnel Status
- **Status**: Setting up...
- **Tool**: LocalTunnel
- **Purpose**: Mobile device testing

---

## 📱 Testing on Mobile

### Option 1: Same WiFi Network
If your mobile is on the same WiFi as your computer:

1. Find your computer's local IP:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (usually 192.168.x.x)

2. Access on mobile:
   - Frontend: `http://YOUR_IP:5173`
   - Backend: `http://YOUR_IP:8000`

### Option 2: Tunnel (Public URL)
The tunnel is being set up to provide a public URL.

**Note**: LocalTunnel may take a moment to establish. Check the terminal output for the URL.

---

## 🔧 Manual Tunnel Setup

If the automatic tunnel isn't working, you can set it up manually:

### Using LocalTunnel:
```bash
# Frontend tunnel
npx localtunnel --port 5173

# Backend tunnel (in another terminal)
npx localtunnel --port 8000
```

### Using Ngrok (Alternative):
```bash
# Install ngrok first
# Download from: https://ngrok.com/download

# Frontend tunnel
ngrok http 5173

# Backend tunnel (in another terminal)
ngrok http 8000
```

---

## 🎯 What to Test on Mobile

### Homepage
- [ ] Hero section displays correctly
- [ ] Buttons are easy to tap (44px minimum)
- [ ] Images load properly
- [ ] No horizontal scroll
- [ ] Spacing looks good
- [ ] Text is readable

### Products Page
- [ ] Grid layout adapts to mobile
- [ ] Filter button works
- [ ] Product cards are tappable
- [ ] Images load
- [ ] Pagination works

### Forms
- [ ] Inputs don't zoom on iOS
- [ ] Buttons are easy to tap
- [ ] Validation messages show
- [ ] Submit works

### Navigation
- [ ] Mobile menu opens/closes
- [ ] Links work
- [ ] Search works
- [ ] Cart icon visible

### Performance
- [ ] Pages load quickly
- [ ] Scrolling is smooth
- [ ] Animations are smooth
- [ ] No lag or jank

---

## 🛠️ Troubleshooting

### Backend not accessible
```bash
# Make sure backend is running
cd C:\Users\bc833\vijetha-digital-backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend not accessible
```bash
# Make sure frontend is running
cd frontend
npm run dev
```

### Tunnel not working
Try these alternatives:
1. Use same WiFi network (easier)
2. Use ngrok instead of localtunnel
3. Use VS Code port forwarding
4. Use Cloudflare Tunnel (if installed)

---

## 📊 Current Status

```
✅ Backend: Running on port 8000
✅ Frontend: Running on port 5173
⏳ Tunnel: Setting up...
```

---

## 🔍 Check Logs

### Backend Logs
Check terminal ID: 2

### Frontend Logs
Check terminal ID: 4

### Tunnel Logs
Check terminal ID: 6

---

## 🎨 UI/UX Improvements to Verify

### Mobile Enhancements
- ✅ Touch targets ≥ 44px
- ✅ Responsive typography
- ✅ No iOS zoom on inputs
- ✅ Smooth scrolling
- ✅ Proper spacing

### Accessibility
- ✅ Focus indicators
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ High contrast text

### Performance
- ✅ GPU-accelerated animations
- ✅ Lazy loading
- ✅ Optimized scrolling

---

## 📝 Next Steps

1. **Get your local IP** (if using same WiFi)
   ```bash
   ipconfig
   ```

2. **Access on mobile**
   - Open browser on phone
   - Go to `http://YOUR_IP:5173`

3. **Test thoroughly**
   - Use the checklist above
   - Test all pages
   - Try different interactions

4. **Report issues**
   - Take screenshots
   - Note which device/browser
   - Describe the issue

---

## 🌐 Alternative: Use Your Computer's IP

### Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

### Access Format:
```
Frontend: http://192.168.x.x:5173
Backend: http://192.168.x.x:8000
```

Replace `192.168.x.x` with your actual IP address.

---

## ⚠️ Important Notes

1. **Firewall**: Make sure Windows Firewall allows connections on ports 5173 and 8000
2. **Same Network**: Your mobile must be on the same WiFi as your computer
3. **HTTPS**: Some features may require HTTPS (use tunnel for that)
4. **Backend URL**: Frontend is configured to use `http://localhost:8000` - you may need to update this for mobile testing

---

## 🔧 Update Frontend API URL for Mobile

If testing via IP address, update `frontend/.env`:

```env
VITE_API_URL=http://YOUR_IP:8000
```

Then restart the frontend server.

---

**Status**: ✅ Servers Running
**Date**: May 4, 2026
**Ready for Testing**: Yes
