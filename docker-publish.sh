#!/bin/bash

# Docker Private Publishing Script for Medogram
# This script builds and publishes the Docker image to a private registry

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

# Validate required environment variables
validate_env() {
    local required_vars=("REGISTRY_URL" "REGISTRY_USERNAME" "REGISTRY_PASSWORD" "IMAGE_NAME" "IMAGE_TAG")
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "Required environment variable $var is not set"
            exit 1
        fi
    done
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

# Build Docker image
build_image() {
    print_status "Building Docker image..."
    local image_name="${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"
    
    docker build \
        --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL:-https://api.medogram.ir}" \
        --build-arg VITE_LOCAL_API_URL="${VITE_LOCAL_API_URL:-http://127.0.0.1:8000}" \
        --tag "$image_name" \
        --file "${DOCKERFILE:-Dockerfile}" \
        "${BUILD_CONTEXT:-.}"
    
    if [ $? -eq 0 ]; then
        print_status "Docker image built successfully: $image_name"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi
}

# Push image to registry
push_image() {
    print_status "Pushing image to private registry..."
    local image_name="${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"
    
    docker push "$image_name"
    
    if [ $? -eq 0 ]; then
        print_status "Image pushed successfully to registry"
        print_status "Image available at: $image_name"
    else
        print_error "Failed to push image to registry"
        exit 1
    fi
}

# Clean up local images (optional)
cleanup_local() {
    if [ "$CLEANUP_LOCAL" = "true" ]; then
        print_status "Cleaning up local images..."
        local image_name="${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"
        docker rmi "$image_name" 2>/dev/null || true
    fi
}

# Main execution
main() {
    print_status "Starting Docker private publishing process..."
    
    validate_env
    login_to_registry
    build_image
    push_image
    cleanup_local
    
    print_status "Docker private publishing completed successfully!"
    print_status "Your image is now available in your private registry"
}

# Handle script arguments
case "${1:-}" in
    "build-only")
        validate_env
        build_image
        print_status "Build completed. Use 'push-only' to push to registry."
        ;;
    "push-only")
        validate_env
        login_to_registry
        push_image
        ;;
    "cleanup")
        cleanup_local
        ;;
    *)
        main
        ;;
esac