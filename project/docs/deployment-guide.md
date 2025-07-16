# Deployment Guide

## 🚀 Deployment Overview

The Zoomies & Snuggles platform is designed for modern deployment practices with support for multiple hosting providers and environments.

## 🌐 Supported Deployment Platforms

### Primary Platform: Netlify
- **Automatic deployments** from Git repositories
- **Built-in CDN** for global content delivery
- **Form handling** for contact forms
- **Environment variable** management
- **Custom domain** support with SSL

### Alternative Platforms
- **Vercel**: Optimized for React applications
- **GitHub Pages**: Free hosting for static sites
- **AWS S3 + CloudFront**: Enterprise-grade hosting
- **Firebase Hosting**: Google's hosting solution

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration
```bash
# Required environment variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. Build Optimization
```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Build for production
npm run build

# Test production build locally
npm run preview
```

### 3. Database Setup
- Ensure Supabase project is configured
- Database schema is deployed
- Row Level Security policies are active
- API keys are properly configured

## 🔧 Netlify Deployment

### Method 1: Git Integration (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub/GitLab/Bitbucket
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Netlify Configuration**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     ```
     Build command: npm run build
     Publish directory: dist
     ```

3. **Environment Variables**
   ```
   Site Settings → Environment Variables → Add Variable
   
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your_anon_key_here
   ```

4. **Deploy Settings**
   ```
   Branch to deploy: main
   Build command: npm run build
   Publish directory: dist
   ```

### Method 2: Manual Deployment

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Deploy
   netlify deploy --prod --dir=dist
   ```

### Method 3: Drag and Drop
1. Build the project locally: `npm run build`
2. Go to Netlify Dashboard
3. Drag the `dist` folder to the deployment area

## ⚙️ Build Configuration

### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "deploy": "npm run build && netlify deploy --prod --dir=dist"
  }
}
```

## 🔒 Security Configuration

### Content Security Policy (CSP)
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://images.pexels.com https://i.ytimg.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
">
```

### Netlify Headers (`public/_headers`)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/api/*
  Access-Control-Allow-Origin: https://yourdomain.com
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Content-Type, Authorization
```

### Netlify Redirects (`public/_redirects`)
```
# SPA fallback
/*    /index.html   200

# API redirects
/api/*  https://your-supabase-url.supabase.co/rest/v1/:splat  200

# Legacy redirects
/old-page  /new-page  301
```

## 🌍 Custom Domain Setup

### 1. Domain Configuration
```bash
# Add custom domain in Netlify
Site Settings → Domain Management → Add Custom Domain
```

### 2. DNS Configuration
```
# Add these DNS records to your domain provider
Type: CNAME
Name: www
Value: your-site-name.netlify.app

Type: A
Name: @
Value: 75.2.60.5 (Netlify's load balancer)
```

### 3. SSL Certificate
- Netlify automatically provisions SSL certificates
- Force HTTPS redirect in site settings
- Certificate auto-renewal is handled automatically

## 📊 Performance Optimization

### 1. Build Optimization
```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### 2. Asset Optimization
```bash
# Optimize images before deployment
npm install -g imagemin-cli
imagemin src/assets/*.{jpg,png} --out-dir=src/assets/optimized
```

### 3. Caching Strategy
```
# Netlify caching headers
/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: public, max-age=0, must-revalidate
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --prod --dir=dist
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🐛 Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
```bash
# Check for TypeScript errors
npm run build

# Common fixes:
- Update dependencies: npm update
- Clear cache: rm -rf node_modules package-lock.json && npm install
- Check environment variables
```

#### 2. Runtime Errors
```javascript
// Add error boundary for production
if (import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    console.error('Production error:', event.error);
    // Send to error tracking service
  });
}
```

#### 3. Routing Issues
```
# Ensure _redirects file exists in public/
/*    /index.html   200
```

#### 4. Environment Variable Issues
```bash
# Verify environment variables are prefixed with VITE_
VITE_SUPABASE_URL=your_url_here

# Check in browser console
console.log(import.meta.env.VITE_SUPABASE_URL);
```

## 📈 Monitoring and Analytics

### 1. Performance Monitoring
```javascript
// Add to main.tsx
if (import.meta.env.PROD) {
  // Web Vitals monitoring
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}
```

### 2. Error Tracking
```javascript
// Error tracking setup
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to error tracking service
});
```

### 3. Analytics Integration
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 Rollback Procedures

### 1. Netlify Rollback
```bash
# Via Netlify CLI
netlify sites:list
netlify api listSiteDeploys --data='{"site_id":"YOUR_SITE_ID"}'
netlify api restoreSiteDeploy --data='{"site_id":"YOUR_SITE_ID","deploy_id":"DEPLOY_ID"}'
```

### 2. Git-based Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard COMMIT_HASH
git push --force origin main
```

## 📋 Post-Deployment Checklist

- [ ] Site loads correctly on all devices
- [ ] All forms submit successfully
- [ ] Database connections work
- [ ] Authentication flows function
- [ ] Images and assets load properly
- [ ] SSL certificate is active
- [ ] Custom domain resolves correctly
- [ ] Performance metrics are acceptable
- [ ] Error tracking is active
- [ ] Analytics are collecting data

This deployment guide ensures a smooth, secure, and optimized deployment process for the Zoomies & Snuggles platform.