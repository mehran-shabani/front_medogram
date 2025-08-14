# 🚀 Deployment Guide

This document provides comprehensive instructions for deploying the Medogram Modern React application to various platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Build Process](#build-process)
- [Deployment Options](#deployment-options)
  - [Vercel](#vercel-deployment)
  - [Netlify](#netlify-deployment)
  - [Docker](#docker-deployment)
  - [AWS S3 + CloudFront](#aws-s3--cloudfront)
  - [DigitalOcean](#digitalocean)
- [CI/CD Pipeline](#cicd-pipeline)
- [Security Considerations](#security-considerations)
- [Monitoring & Health Checks](#monitoring--health-checks)
- [Troubleshooting](#troubleshooting)

## 📋 Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Access to your chosen deployment platform
- Environment variables configured
- SSL certificates (for custom domains)

## 🔧 Environment Variables

Create environment files for different environments:

### Production (.env.production)
```env
VITE_API_BASE_URL=https://api.medogram.ir
VITE_LOCAL_API_URL=https://api.medogram.ir
NODE_ENV=production
```

### Staging (.env.staging)
```env
VITE_API_BASE_URL=https://staging-api.medogram.ir
VITE_LOCAL_API_URL=https://staging-api.medogram.ir
NODE_ENV=staging
```

### Development (.env.development)
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_LOCAL_API_URL=http://127.0.0.1:8000
NODE_ENV=development
```

## 🏗️ Build Process

### Local Build
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Optimization
The build process includes:
- ✅ Tree shaking for unused code elimination
- ✅ Code splitting for optimal loading
- ✅ Asset optimization and compression
- ✅ CSS purging and minification
- ✅ Bundle analysis and optimization

## 🚀 Deployment Options

### Vercel Deployment

#### Automatic Deployment (Recommended)
1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Settings**:
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://api.medogram.ir
   VITE_LOCAL_API_URL=https://api.medogram.ir
   ```

4. **Deploy**: Click "Deploy" and wait for completion

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Netlify Deployment

#### Automatic Deployment
1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**:
   Add in Site Settings > Environment Variables:
   ```
   VITE_API_BASE_URL=https://api.medogram.ir
   VITE_LOCAL_API_URL=https://api.medogram.ir
   ```

#### Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Docker Deployment

#### Single Container
```bash
# Build image
docker build -t medogram-modern .

# Run container
docker run -p 3000:80 \
  -e VITE_API_BASE_URL=https://api.medogram.ir \
  -e VITE_LOCAL_API_URL=https://api.medogram.ir \
  medogram-modern
```

#### Docker Compose
```bash
# Start all services
docker-compose up -d

# Production mode
docker-compose --profile production up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### AWS S3 + CloudFront

#### Prerequisites
- AWS CLI configured
- S3 bucket created
- CloudFront distribution set up

#### Deployment Script
```bash
#!/bin/bash
# deploy-aws.sh

# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

#### GitHub Actions for AWS
```yaml
# .github/workflows/deploy-aws.yml
name: Deploy to AWS S3

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

### DigitalOcean

#### App Platform
1. **Create App**:
   - Go to DigitalOcean App Platform
   - Connect your repository

2. **Configure**:
   - Type: Static Site
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://api.medogram.ir
   VITE_LOCAL_API_URL=https://api.medogram.ir
   ```

#### Droplet Deployment
```bash
# Connect to droplet
ssh root@your-droplet-ip

# Install Node.js and nginx
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs nginx

# Clone repository
git clone https://github.com/your-username/medogram-modern.git
cd medogram-modern

# Install and build
npm install
npm run build

# Configure nginx
cp nginx.conf /etc/nginx/sites-available/medogram
ln -s /etc/nginx/sites-available/medogram /etc/nginx/sites-enabled/
systemctl reload nginx

# Copy build files
cp -r dist/* /var/www/html/
```

## 🔄 CI/CD Pipeline

Our GitHub Actions workflow automatically:

1. **Quality Checks**:
   - Code linting
   - Security auditing
   - Dependency scanning

2. **Build & Test**:
   - Multi-environment builds
   - Cross-browser testing
   - Performance testing

3. **Security Scanning**:
   - SAST analysis
   - Dependency vulnerabilities
   - Container scanning

4. **Deployment**:
   - Staging deployment (develop branch)
   - Production deployment (main branch)
   - Automatic rollback on failure

### Deployment Environments

| Environment | Branch | URL | Auto-Deploy |
|-------------|---------|-----|-------------|
| Development | feature/* | - | ❌ |
| Staging | develop | staging.medogram.ir | ✅ |
| Production | main | medogram.ir | ✅ |

## 🔒 Security Considerations

### Security Headers
All deployments include:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` with strict rules

### HTTPS Configuration
- Always use HTTPS in production
- Configure HSTS headers
- Use modern TLS versions (1.2+)

### Environment Security
- Never commit secrets to repository
- Use platform-specific secret management
- Rotate API keys regularly
- Monitor for exposed credentials

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- `/health` - Application health status
- `/api/health` - Backend API health

### Monitoring Tools
- **Vercel**: Built-in analytics and monitoring
- **Netlify**: Site analytics and form handling
- **Docker**: Health check containers
- **AWS**: CloudWatch monitoring

### Performance Monitoring
```javascript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for dependency conflicts
npm ls
```

#### Environment Variable Issues
```bash
# Check if variables are loaded
echo $VITE_API_BASE_URL

# Verify in build output
grep -r "VITE_" dist/
```

#### CORS Issues
- Ensure API endpoints allow your domain
- Check proxy configuration
- Verify environment-specific URLs

#### Performance Issues
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/

# Check for unused dependencies
npx depcheck
```

### Debug Commands
```bash
# Local development with specific environment
VITE_API_BASE_URL=https://staging-api.medogram.ir npm run dev

# Build with verbose output
npm run build -- --mode development

# Serve built files locally
npx serve dist -p 3000
```

## 📞 Support

For deployment issues:
- **Documentation**: Check this guide first
- **GitHub Issues**: Create an issue with deployment logs
- **Email**: devops@medogram.ir
- **Slack**: #deployment channel

## 📝 Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] DNS records updated
- [ ] Security headers configured
- [ ] Performance optimized
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Rollback plan prepared
- [ ] Team notified
- [ ] Documentation updated

---

**Last updated**: December 2024
**Version**: 2.0

Happy deploying! 🚀