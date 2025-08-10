# Vercel Deployment Instructions

## Environment Variables Setup on Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: "lets-chat"
3. Go to **Settings** → **Environment Variables**
4. Add these EXACT variables:

```
MONGODB_URI = mongodb+srv://local:local123@cluster0.pc827rg.mongodb.net/letschat?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = mysupersecretkey123456789letschat
```

## Important Notes:

### ⚠️ REMOVE These Variables if Present:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `REACT_APP_API_URL`
- `API_BASE_URL`
- Any URL pointing to Herokuapp or external backends

### MongoDB Atlas Setup:
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Select your Cluster (Cluster0)
3. Go to **Network Access**
4. Add IP Address: `0.0.0.0/0` (Allow from anywhere)
5. Description: "Vercel Deployment"

### Deployment Steps:
1. Push your code to GitHub:
```bash
git add .
git commit -m "Fix backend configuration for Vercel"
git push origin main
```

2. In Vercel Dashboard:
   - Go to **Deployments**
   - Click on the three dots menu on latest deployment
   - Select **Redeploy**
   - Choose **"Redeploy without cache"** ← IMPORTANT!

### Testing:
After deployment, test these endpoints:
- Signup: `https://your-app.vercel.app/Signup`
- Login: `https://your-app.vercel.app/Login`

Check browser DevTools Network tab - API calls should go to:
- `/api/auth/signup` (relative path)
- `/api/auth/login` (relative path)
- NOT any external URL like herokuapp.com

### Debugging:
If you still see errors:
1. Check Vercel Functions logs: Dashboard → Functions → View Logs
2. Look for "Environment check" messages in logs
3. Verify MongoDB connection is successful

### Common Issues:
- **504 Timeout**: MongoDB IP not whitelisted
- **500 Error**: Missing environment variables
- **CORS Error**: Clear Vercel cache and redeploy
- **"Heroku" errors**: Remove all external API URL variables