# Docker Private Publishing Guide for Medogram

This guide explains how to set up Docker for private publishing of the Medogram application.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Access to a private Docker registry
- SSL certificates (for production)
- Domain name configured

## 🔧 Setup Instructions

### 1. Configure Private Registry

Create `.env.private` file with your private registry configuration:

```bash
# Copy the template
cp .env.private.example .env.private

# Edit with your private registry details
nano .env.private
```

Required variables:
- `REGISTRY_URL`: Your private registry URL
- `REGISTRY_USERNAME`: Registry username
- `REGISTRY_PASSWORD`: Registry password
- `IMAGE_NAME`: Docker image name
- `IMAGE_TAG`: Image tag (e.g., latest, v1.0.0)

### 2. Build and Publish Image

```bash
# Make scripts executable
chmod +x docker-publish.sh docker-deploy.sh

# Build and publish to private registry
./docker-publish.sh
```

### 3. Deploy Application

```bash
# Deploy using private registry
./docker-deploy.sh deploy
```

## 🚀 Available Commands

### Publishing Commands

```bash
# Full build and publish process
./docker-publish.sh

# Build only (don't push)
./docker-publish.sh build-only

# Push only (assumes image already built)
./docker-publish.sh push-only

# Clean up local images
./docker-publish.sh cleanup
```

### Deployment Commands

```bash
# Deploy application
./docker-deploy.sh deploy

# Pull latest image
./docker-deploy.sh pull

# Check deployment status
./docker-deploy.sh status

# Check application health
./docker-deploy.sh health

# Rollback to previous version
./docker-deploy.sh rollback

# Clean up unused images
./docker-deploy.sh cleanup
```

## 🔒 Security Configuration

### Environment Variables Security

- Never commit `.env.private` to version control
- Use strong passwords for all services
- Rotate credentials regularly
- Use environment-specific configurations

### Docker Security Best Practices

1. **Non-root User**: The Dockerfile creates a non-root user for security
2. **Health Checks**: Built-in health monitoring
3. **Resource Limits**: Configured in docker-compose
4. **Network Isolation**: Services run in isolated network
5. **SSL/TLS**: HTTPS configuration included

### Nginx Security Headers

The configuration includes:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Content Security Policy
- Rate limiting
- SSL/TLS configuration

## 📁 File Structure

```
├── .env.docker              # Docker environment template
├── .env.private             # Private registry configuration (create this)
├── docker-compose.private.yml # Private deployment configuration
├── docker-publish.sh        # Publishing script
├── docker-deploy.sh         # Deployment script
├── docker-security.conf     # Security configuration
├── Dockerfile              # Multi-stage Docker build
└── nginx/                   # Nginx configuration directory
    ├── nginx.conf
    └── ssl/                 # SSL certificates directory
```

## 🌐 Network Configuration

The application uses a custom network (`medogram-network`) with:
- Subnet: `172.20.0.0/16`
- Bridge driver
- Isolated communication between services

## 📊 Monitoring and Health Checks

### Health Check Endpoints

- Frontend: `http://localhost:3000/health`
- Redis: Redis ping command
- Database: Connection check

### Monitoring Commands

```bash
# Check all services status
docker-compose -f docker-compose.private.yml ps

# View logs
docker-compose -f docker-compose.private.yml logs -f

# Check specific service logs
docker-compose -f docker-compose.private.yml logs -f medogram-frontend
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Push
        run: ./docker-publish.sh
      - name: Deploy
        run: ./docker-deploy.sh deploy
```

## 🛠️ Troubleshooting

### Common Issues

1. **Registry Authentication Failed**
   ```bash
   # Check credentials in .env.private
   # Test login manually
   docker login $REGISTRY_URL
   ```

2. **Image Pull Failed**
   ```bash
   # Check network connectivity
   # Verify image exists in registry
   docker pull $REGISTRY_URL/$NAMESPACE/$IMAGE_NAME:$IMAGE_TAG
   ```

3. **Health Check Failed**
   ```bash
   # Check service logs
   docker-compose logs medogram-frontend
   # Verify port configuration
   netstat -tlnp | grep 3000
   ```

### Debug Commands

```bash
# Check Docker daemon status
docker info

# List all images
docker images

# Check running containers
docker ps

# Inspect container
docker inspect <container_id>

# Execute commands in container
docker exec -it <container_id> /bin/sh
```

## 📈 Performance Optimization

### Resource Limits

Configure resource limits in `docker-compose.private.yml`:

```yaml
services:
  medogram-frontend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Caching Strategy

- Use multi-stage builds for smaller images
- Leverage Docker layer caching
- Configure Redis for application caching
- Use CDN for static assets

## 🔐 Backup and Recovery

### Database Backup

```bash
# Create backup
docker exec postgres pg_dump -U medogram_user medogram > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker exec -i postgres psql -U medogram_user medogram < backup_file.sql
```

### Volume Backup

```bash
# Backup volumes
docker run --rm -v medogram_postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-data.tar.gz -C /data .
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Docker logs
3. Verify configuration files
4. Test connectivity to registry

## 🔄 Updates and Maintenance

### Regular Maintenance Tasks

1. **Update Base Images**: Regularly update Node.js and Nginx base images
2. **Security Patches**: Apply security updates
3. **Dependency Updates**: Update npm packages
4. **Registry Cleanup**: Remove old images from registry
5. **Log Rotation**: Configure log rotation for production

### Automated Updates

Use Watchtower for automatic updates:

```bash
# Enable watchtower profile
docker-compose -f docker-compose.private.yml --profile production up -d watchtower
```