#!/bin/bash

# Pavone Collection Website Deployment Script
# This script automates pulling code, installing dependencies, and restarting services

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/root/Pavon_website"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_PM2_NAME="pavon-backend"
FRONTEND_PM2_NAME="pavon-frontend"
LOG_FILE="/var/log/pavon-deploy.log"

# Helper functions
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

# Main deployment process
main() {
    log "=========================================="
    log "Starting Pavone Collection Deployment"
    log "=========================================="
    
    # Check if running as root or with sudo
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root or with sudo"
    fi
    
    # Change to project directory
    cd "$PROJECT_DIR" || error "Failed to change to project directory: $PROJECT_DIR"
    
    # Step 1: Pull latest code
    log "Step 1: Pulling latest code from git..."
    git pull origin main || warning "Git pull failed or branch is not main. Check manually."
    
    # Step 2: Update backend
    log "Step 2: Installing backend dependencies..."
    cd "$BACKEND_DIR" || error "Failed to change to backend directory"
    npm install --production || error "Failed to install backend dependencies"
    
    # Step 3: Update frontend
    log "Step 3: Installing frontend dependencies..."
    cd "$FRONTEND_DIR" || error "Failed to change to frontend directory"
    npm install || error "Failed to install frontend dependencies"
    
    # Step 4: Build frontend (optional, depends on your setup)
    log "Step 4: Building frontend..."
    npm run build || warning "Frontend build failed. Check if build script exists."
    
    # Step 5: Restart PM2 services
    log "Step 5: Restarting PM2 services..."
    
    # Restart backend
    pm2 restart "$BACKEND_PM2_NAME" || {
        warning "PM2 process '$BACKEND_PM2_NAME' not found. Starting new process..."
        cd "$BACKEND_DIR" || error "Failed to change to backend directory"
        pm2 start server.js --name "$BACKEND_PM2_NAME" --env production
    }
    
    # Restart frontend (if running with PM2)
    pm2 restart "$FRONTEND_PM2_NAME" 2>/dev/null || {
        log "Frontend not managed by PM2 (this is normal if using npm run dev)"
    }
    
    # Step 6: Reload Nginx
    log "Step 6: Testing and reloading Nginx..."
    nginx -t || error "Nginx configuration test failed"
    systemctl reload nginx || error "Failed to reload Nginx"
    
    # Step 7: Verify services are running
    log "Step 7: Verifying services..."
    pm2 status || warning "Failed to get PM2 status"
    
    log "=========================================="
    log "Deployment completed successfully!"
    log "=========================================="
    log "Backend running on: http://localhost:5000"
    log "Frontend available at: https://pavonecollection.com"
    log "=========================================="
}

# Show usage
usage() {
    echo "Usage: sudo bash /root/Pavon_website/deploy.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  (no args)     - Full deployment (pull, install, build, restart)"
    echo "  --nginx-only  - Only test and reload Nginx"
    echo "  --pm2-only    - Only restart PM2 services"
    echo "  --git-only    - Only pull latest code"
    echo "  --help        - Show this help message"
}

# Handle command line arguments
case "${1:-}" in
    --nginx-only)
        log "Reloading Nginx only..."
        nginx -t || error "Nginx configuration test failed"
        systemctl reload nginx || error "Failed to reload Nginx"
        log "Nginx reloaded successfully"
        ;;
    --pm2-only)
        log "Restarting PM2 services only..."
        pm2 restart "$BACKEND_PM2_NAME" || error "Failed to restart backend"
        log "PM2 services restarted successfully"
        ;;
    --git-only)
        cd "$PROJECT_DIR" || error "Failed to change to project directory"
        log "Pulling latest code..."
        git pull origin main || error "Failed to pull from git"
        log "Code pulled successfully"
        ;;
    --help)
        usage
        ;;
    *)
        main
        ;;
esac
