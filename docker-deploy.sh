#!/bin/bash

# Docker Private Deployment Script for Medogram
# This script deploys the application using private Docker images

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env.private ]; then
    echo -e "${BLUE}Loading private environment variables...${NC}"
    source .env.private
else
    echo -e "${RED}Error: .env.private file not found!${NC}"
    echo "Please create .env.private file with your private registry configuration."
    exit 1
fi

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Login to private registry
login_to_registry() {
    print_status "Logging in to private registry: $REGISTRY_URL"
    echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY_URL" -u "$REGISTRY_USERNAME" --password-stdin
    if [ $? -eq 0 ]; then
        print_status "Successfully logged in to registry"
    else
        print_error "Failed to login to registry"
        exit 1
    fi
}

# Pull latest image from registry
pull_image() {
    print_status "Pulling latest image from private registry..."
    local image_name="${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"
    
    docker pull "$image_name"
    
    if [ $? -eq 0 ]; then
        print_status "Image pulled successfully: $image_name"
    else
        print_error "Failed to pull image from registry"
        exit 1
    fi
}

# Deploy using docker-compose
deploy() {
    print_status "Deploying application..."
    
    # Create necessary directories
    mkdir -p nginx/ssl backups
    
    # Deploy with docker-compose
    docker-compose -f docker-compose.private.yml --env-file .env.private up -d
    
    if [ $? -eq 0 ]; then
        print_status "Application deployed successfully!"
    else
        print_error "Failed to deploy application"
        exit 1
    fi
}

# Check application health
check_health() {
    print_status "Checking application health..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:${FRONTEND_PORT:-3000}/health >/dev/null 2>&1; then
            print_status "Application is healthy!"
            return 0
        fi
        
        print_warning "Health check attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    print_error "Application health check failed after $max_attempts attempts"
    return 1
}

# Show deployment status
show_status() {
    print_status "Deployment Status:"
    docker-compose -f docker-compose.private.yml --env-file .env.private ps
}

# Rollback to previous version
rollback() {
    print_status "Rolling back to previous version..."
    
    # Stop current deployment
    docker-compose -f docker-compose.private.yml --env-file .env.private down
    
    # Pull previous image (you might need to adjust this based on your tagging strategy)
    local previous_tag="${IMAGE_TAG}-previous"
    local image_name="${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${previous_tag}"
    
    print_status "Pulling previous version: $image_name"
    docker pull "$image_name" || {
        print_error "Failed to pull previous version"
        exit 1
    }
    
    # Update environment to use previous tag
    export IMAGE_TAG="$previous_tag"
    
    # Deploy previous version
    docker-compose -f docker-compose.private.yml --env-file .env.private up -d
    
    print_status "Rollback completed!"
}

# Clean up unused images
cleanup() {
    print_status "Cleaning up unused Docker images..."
    docker image prune -f
    docker system prune -f
}

# Main execution
main() {
    case "${1:-deploy}" in
        "deploy")
            login_to_registry
            pull_image
            deploy
            check_health
            show_status
            ;;
        "pull")
            login_to_registry
            pull_image
            ;;
        "status")
            show_status
            ;;
        "rollback")
            rollback
            ;;
        "cleanup")
            cleanup
            ;;
        "health")
            check_health
            ;;
        *)
            echo "Usage: $0 {deploy|pull|status|rollback|cleanup|health}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Deploy the application (default)"
            echo "  pull     - Pull latest image from registry"
            echo "  status   - Show deployment status"
            echo "  rollback - Rollback to previous version"
            echo "  cleanup  - Clean up unused Docker images"
            echo "  health   - Check application health"
            exit 1
            ;;
    esac
}

main "$@"