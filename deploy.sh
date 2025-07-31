#!/bin/bash

# Deployment script for Strata Waitlist Application
# This script sets up the application on an EC2 instance with Apache

set -e

echo "🚀 Starting deployment of Strata Waitlist Application..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js and npm
echo "📦 Installing Node.js and npm..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Apache
echo "🌐 Installing Apache..."
sudo yum install -y httpd

# Start and enable Apache
echo "🚀 Starting Apache service..."
sudo systemctl start httpd
sudo systemctl enable httpd

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "📁 Setting up application directory..."
mkdir -p ~/stratawaitlist

# Copy application files (assuming they're in the current directory)
echo "📋 Copying application files..."
cp -r . ~/stratawaitlist/
cd ~/stratawaitlist

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Initialize database
echo "🗄️ Initializing database..."
npm run init-db

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
export default {
  apps: [{
    name: 'stratawaitlist-server',
cwd: '~/stratawaitlist/server',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# Start server with PM2
echo "🚀 Starting server with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Apache to serve the frontend and proxy API requests
echo "⚙️ Configuring Apache..."
sudo tee /etc/httpd/conf.d/stratawaitlist.conf > /dev/null << 'EOF'
# Serve the React app
DocumentRoot "/home/ec2-user/stratawaitlist/dist"

# Proxy API requests to the Node.js server
ProxyPreserveHost On
ProxyPass /api http://localhost:3001/api
ProxyPassReverse /api http://localhost:3001/api

# Handle React Router
<Directory "/home/ec2-user/stratawaitlist/dist">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    
    # Fallback to index.html for client-side routing
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</Directory>

# Enable required modules
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule rewrite_module modules/mod_rewrite.so
EOF

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R apache:apache /home/ec2-user/stratawaitlist/dist
sudo chmod -R 755 /home/ec2-user/stratawaitlist/dist

# Restart Apache
echo "🔄 Restarting Apache..."
sudo systemctl restart httpd

# Configure firewall
echo "🔥 Configuring firewall..."
sudo yum install -y firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

echo "✅ Deployment completed successfully!"
echo "🌐 Application should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "📊 API is available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/api"
echo ""
echo "📋 Useful commands:"
echo "  - View server logs: pm2 logs stratawaitlist-server"
echo "  - Restart server: pm2 restart stratawaitlist-server"
echo "  - View Apache logs: sudo tail -f /var/log/httpd/error_log"
echo "  - Check server status: pm2 status" 