#!/bin/bash

# Pavon Collection - Single Deployment Script
# Run this after every git push to update the website

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Paths
PROJECT_DIR="/root/Pavon_website"
FRONTEND_DIR="$PROJECT_DIR/frontend"
WEB_DIR="/var/www/pavon-frontend"

# Functions
log() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗ ERROR:${NC} $1"
    exit 1
}

section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    error "Must run with sudo: sudo bash /root/Pavon_website/update.sh"
fi

section "PAVON WEBSITE DEPLOYMENT"

# Step 1: Pull latest code
section "Step 1/5: Pulling latest code"
cd "$PROJECT_DIR" || error "Cannot navigate to $PROJECT_DIR"
git pull origin main || error "Git pull failed"
log "Code updated"

# Step 2: Install/update frontend dependencies
section "Step 2/5: Installing frontend dependencies"
cd "$FRONTEND_DIR" || error "Cannot navigate to $FRONTEND_DIR"
npm install --legacy-peer-deps 2>&1 | grep -E "added|up to date|packages" | tail -1 || true
log "Dependencies installed"

# Step 3: Build frontend
section "Step 3/5: Building frontend"
npm run build || error "Frontend build failed"
log "Frontend built successfully"

# Step 4: Deploy to web directory
section "Step 4/5: Deploying to production"
rm -rf "$WEB_DIR"/* || true
cp -r "$FRONTEND_DIR/dist/"* "$WEB_DIR/" || error "Failed to copy build files"
sudo chown -R www-data:www-data "$WEB_DIR" || true
log "Files deployed to $WEB_DIR"

# Step 5: Test Nginx and reload
section "Step 5/5: Reloading Nginx"
sudo nginx -t || error "Nginx configuration test failed"
sudo systemctl reload nginx || error "Failed to reload Nginx"
log "Nginx reloaded"

# Final summary
section "DEPLOYMENT COMPLETE ✓"
echo -e "${GREEN}Website is live at:${NC}"
echo -e "  🌐 https://pavonecollection.com"
echo -e "\n${GREEN}Check status:${NC}"
echo -e "  sudo systemctl status nginx"
echo -e "  curl https://localhost/"
echo ""
