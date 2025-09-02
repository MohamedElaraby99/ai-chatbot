# CORS Error Troubleshooting Guide

## Current Error Analysis

You're experiencing a CORS error with these symptoms:
```
Access to XMLHttpRequest at 'https://api.ai.fikra.solutions/api/user/auth-status' 
from origin 'https://www.ai.fikra.solutions' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.

GET https://api.ai.fikra.solutions/api/user/auth-status net::ERR_FAILED 502 (Bad Gateway)
```

## Root Cause

The **502 Bad Gateway** error is the primary issue. When your backend server returns a 502 error, no CORS headers are sent, which causes the browser to block the request.

## Diagnostic Steps

### 1. **Test API Endpoint Directly**
Open your browser and navigate to: `https://api.ai.fikra.solutions/api/user/auth-status`

**Expected Results:**
- ✅ **If working**: You should see a JSON response or authentication error
- ❌ **If broken**: You'll see a 502 Bad Gateway error page

### 2. **Check Backend Server Status**
```bash
# If you're using PM2
pm2 status

# If you're using systemd
sudo systemctl status your-backend-service

# Check if port 5001 is listening
netstat -tulpn | grep :5001
```

### 3. **Verify Domain Configuration**
```bash
# Test if domain resolves correctly
nslookup api.ai.fikra.solutions

# Test direct connection
curl -v https://api.ai.fikra.solutions/api/user/auth-status
```

## Quick Fixes

### Fix 1: Restart Backend Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if needed)
npm install

# Start the server
npm run dev  # For development
# OR
npm run build && npm start  # For production
```

### Fix 2: Check Environment Variables
Ensure your production backend is using the correct environment file:

**Create/Update backend/.env for production:**
```env
NODE_ENV=production
PORT=5001
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
COOKIE_SECRET=your-production-cookie-secret
DOMAIN=.fikra.solutions
```

### Fix 3: Verify Reverse Proxy Configuration
If you're using Nginx, ensure your configuration includes:

```nginx
server {
    listen 443 ssl;
    server_name api.ai.fikra.solutions;
    
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Temporary Workaround

If you need an immediate fix while resolving the backend issue, you can temporarily modify your frontend to use a working backend URL:

1. **Edit frontend/.env.production:**
```env
# Temporarily point to a working backend (if you have one)
VITE_API_BASE_URL=http://your-working-backend-ip:5001/api
```

2. **Rebuild and redeploy frontend:**
```bash
cd frontend
npm run build
# Deploy the dist folder to your frontend hosting
```

## Verification Steps

After implementing fixes:

1. **Test API endpoint**: Visit `https://api.ai.fikra.solutions/api/user/auth-status`
2. **Check browser console**: Should see no CORS errors
3. **Test authentication**: Try logging in through your frontend

## Additional Resources

- **Backend logs**: Check your backend server logs for detailed error messages
- **Frontend network tab**: Use browser dev tools to inspect the exact network requests
- **Server monitoring**: Set up monitoring to detect when your backend goes down

## Contact Support

If the issue persists:
1. Check backend server logs
2. Verify domain DNS settings
3. Ensure SSL certificates are valid
4. Contact your hosting provider if using managed services