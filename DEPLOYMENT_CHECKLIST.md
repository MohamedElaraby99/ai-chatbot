# Deployment Checklist for AI Chat Bot MERN Application

## Backend Deployment Checklist

### ✅ **Pre-Deployment Configuration**

1. **Environment Variables Setup**
   - [ ] Copy `backend/.env.production` to `backend/.env`
   - [ ] Update MongoDB connection string in production `.env`
   - [ ] Set strong JWT and Cookie secrets
   - [ ] Configure OpenAI API key
   - [ ] Set NODE_ENV=production

2. **Domain Configuration**
   - [ ] Ensure `api.ai.fikra.solutions` points to your backend server
   - [ ] Verify DNS A record points to correct IP address
   - [ ] Test domain resolution: `nslookup api.ai.fikra.solutions`

3. **SSL Certificate**
   - [ ] Install SSL certificate for `api.ai.fikra.solutions`
   - [ ] Verify certificate is valid and not expired
   - [ ] Test HTTPS access: `curl -v https://api.ai.fikra.solutions`

### ✅ **Backend Server Deployment**

4. **Build and Start Backend**
   ```bash
   cd backend
   npm install --production
   npm run build
   npm start
   ```

5. **Process Management**
   - [ ] Use PM2 or systemd to keep backend running
   - [ ] Configure auto-restart on server reboot
   - [ ] Set up log rotation

6. **Firewall and Security**
   - [ ] Open port 5001 on server firewall
   - [ ] Configure reverse proxy (Nginx/Apache) if needed
   - [ ] Ensure server binds to 0.0.0.0:5001 (not just localhost)

### ✅ **Frontend Deployment Checklist**

7. **Frontend Configuration**
   - [ ] Verify `frontend/.env.production` has correct API URL
   - [ ] Build frontend: `npm run build`
   - [ ] Deploy `dist` folder to web hosting

8. **Domain Configuration**
   - [ ] Ensure `ai.fikra.solutions` and `www.ai.fikra.solutions` point to frontend
   - [ ] Configure SSL certificates for frontend domains
   - [ ] Set up redirect from `ai.fikra.solutions` to `www.ai.fikra.solutions` (or vice versa)

### ✅ **Verification Steps**

9. **Backend API Testing**
   - [ ] Test: `curl https://api.ai.fikra.solutions/api/user/auth-status`
   - [ ] Should return JSON response (not 502 error)
   - [ ] Check CORS headers are present in response

10. **Frontend Testing**
    - [ ] Visit `https://www.ai.fikra.solutions`
    - [ ] Open browser dev tools → Network tab
    - [ ] Try to authenticate
    - [ ] Verify no CORS errors in console

11. **Cross-Origin Testing**
    - [ ] Ensure requests from `www.ai.fikra.solutions` to `api.ai.fikra.solutions` work
    - [ ] Test login/logout functionality
    - [ ] Test chat functionality

## Common Deployment Issues

### Issue: 502 Bad Gateway
**Causes:**
- Backend server not running
- Port 5001 not accessible
- Reverse proxy misconfiguration

**Solutions:**
- Check if backend process is running: `ps aux | grep node`
- Verify port is listening: `netstat -tulpn | grep :5001`
- Check server logs for errors

### Issue: CORS Errors
**Causes:**
- Backend returning errors before CORS headers sent
- Incorrect domain configuration
- Missing SSL certificates

**Solutions:**
- Fix backend 502 errors first
- Verify allowed origins in backend code
- Ensure HTTPS is working

### Issue: Authentication Not Working
**Causes:**
- Cookie domain mismatch
- Incorrect environment variables
- Database connection issues

**Solutions:**
- Check cookie domain setting in backend
- Verify MongoDB connection
- Test API endpoints individually

## Production Environment Files

### Backend Production Environment (.env)
```env
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai
JWT_SECRET=your-super-secret-jwt-secret-change-this
COOKIE_SECRET=your-super-secret-cookie-secret-change-this
DOMAIN=.fikra.solutions
OPENAI_API_KEY=your-openai-api-key
```

### Frontend Production Environment (.env.production)
```env
VITE_API_BASE_URL=https://api.ai.fikra.solutions/api
VITE_NODE_ENV=production
```

## Nginx Configuration Example

```nginx
# Backend API
server {
    listen 443 ssl;
    server_name api.ai.fikra.solutions;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
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

# Frontend
server {
    listen 443 ssl;
    server_name ai.fikra.solutions www.ai.fikra.solutions;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Monitoring and Maintenance

- [ ] Set up server monitoring (CPU, memory, disk)
- [ ] Configure log monitoring and alerts
- [ ] Schedule regular SSL certificate renewal
- [ ] Monitor API response times and errors
- [ ] Set up database backups

## Support and Troubleshooting

If deployment issues persist:
1. Check server logs: `tail -f /var/log/your-app.log`
2. Test individual components separately
3. Use browser dev tools to inspect network requests
4. Verify DNS and SSL configuration
5. Contact hosting provider support if needed