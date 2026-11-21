# Render CORS Setup - Add FRONTEND_URL

## What You Need To Do

1. Go to: https://dashboard.render.com
2. Select: **vijetha-digital-backend**
3. Click: **Environment** tab
4. Click: **Add Environment Variable**
5. Add:
   ```
   Key: FRONTEND_URL
   Value: http://localhost:5173,https://vijetha-digital-store.vercel.app
   ```
   (Use comma to separate multiple URLs - no spaces!)

6. Click **Save Changes**
7. Render will auto-redeploy

## Why This Is Needed
The backend CORS (Cross-Origin Resource Sharing) needs to allow requests from:
- `http://localhost:5173` - Your local dev server
- `https://vijetha-digital-store.vercel.app` - Your Vercel deployment

Without this, you'll get CORS errors and the frontend can't fetch data from the backend.

---

## After Adding FRONTEND_URL

Test that CORS works:
```bash
curl -H "Origin: http://localhost:5173" -I https://vijetha-digital-backend.onrender.com/api/v1/products
```

Look for this header in the response:
```
Access-Control-Allow-Origin: http://localhost:5173
```

✅ If you see it = CORS is working!
❌ If you don't = Check the FRONTEND_URL value in Render
