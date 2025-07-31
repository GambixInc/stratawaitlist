# Strata Waitlist Application - Deployment Guide

This guide explains how to deploy the Strata Waitlist application on an EC2 instance with SQLite database.

## 🏗️ Architecture

- **Frontend**: React + Vite application served by Apache
- **Backend**: Express.js API server with SQLite database
- **Database**: SQLite file-based database
- **Process Manager**: PM2 for Node.js server management
- **Web Server**: Apache with proxy configuration

## 📋 Prerequisites

- EC2 instance with Amazon Linux 2 or similar
- Security group with ports 80 (HTTP) and 443 (HTTPS) open
- SSH access to the instance

## 🚀 Quick Deployment

### Option 1: Automated Deployment Script

1. **Upload files to EC2 instance:**

   ```bash
   scp -r . ec2-user@your-ec2-ip:/home/ec2-user/strata-waitlist
   ```

2. **SSH into your EC2 instance:**

   ```bash
   ssh ec2-user@your-ec2-ip
   ```

3. **Run the deployment script:**
   ```bash
   cd /home/ec2-user/strata-waitlist
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Option 2: Manual Deployment

1. **Install dependencies:**

   ```bash
   # Update system
   sudo yum update -y

   # Install Node.js
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs

   # Install Apache
   sudo yum install -y httpd
   sudo systemctl start httpd
   sudo systemctl enable httpd

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Set up the application:**

   ```bash
   # Create application directory
   sudo mkdir -p /var/www/strata-waitlist
   sudo chown -R ec2-user:ec2-user /var/www/strata-waitlist

   # Copy files
   cp -r . /var/www/strata-waitlist/
   cd /var/www/strata-waitlist

   # Install frontend dependencies and build
   npm install
   npm run build

   # Install server dependencies
   cd server
   npm install
   npm run init-db
   ```

3. **Configure PM2:**

   ```bash
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << 'EOF'
   module.exports = {
     apps: [{
       name: 'strata-waitlist-server',
       cwd: '/var/www/strata-waitlist/server',
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

   # Start server
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Configure Apache:**

   ```bash
   # Create Apache configuration
   sudo tee /etc/httpd/conf.d/strata-waitlist.conf > /dev/null << 'EOF'
   DocumentRoot "/var/www/strata-waitlist/dist"

   ProxyPreserveHost On
   ProxyPass /api http://localhost:3001/api
   ProxyPassReverse /api http://localhost:3001/api

   <Directory "/var/www/strata-waitlist/dist">
       Options Indexes FollowSymLinks
       AllowOverride All
       Require all granted

       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
   </Directory>

   LoadModule proxy_module modules/mod_proxy.so
   LoadModule proxy_http_module modules/mod_proxy_http.so
   LoadModule rewrite_module modules/mod_rewrite.so
   EOF

   # Set permissions and restart
   sudo chown -R apache:apache /var/www/strata-waitlist/dist
   sudo chmod -R 755 /var/www/strata-waitlist/dist
   sudo systemctl restart httpd
   ```

5. **Configure firewall:**
   ```bash
   sudo yum install -y firewalld
   sudo systemctl start firewalld
   sudo systemctl enable firewalld
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --permanent --add-service=https
   sudo firewall-cmd --reload
   ```

## 📁 File Structure

After deployment, your application will be structured as follows:

```
/var/www/strata-waitlist/
├── dist/                    # Built React application
├── server/                  # Express.js server
│   ├── server.js           # Main server file
│   ├── database.js         # Database utilities
│   ├── init-db.js         # Database initialization
│   ├── package.json        # Server dependencies
│   └── waitlist.db        # SQLite database file
├── src/                    # React source code
├── package.json            # Frontend dependencies
└── ecosystem.config.js     # PM2 configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```bash
# Server configuration
NODE_ENV=production
PORT=3001

# Database configuration (SQLite file path)
DB_PATH=/var/www/strata-waitlist/server/waitlist.db
```

### Frontend Configuration

Update the API URL in your frontend if needed:

```bash
# In your .env file or environment
VITE_API_URL=http://your-domain.com/api
```

## 📊 Monitoring and Maintenance

### View Logs

```bash
# Server logs
pm2 logs strata-waitlist-server

# Apache logs
sudo tail -f /var/log/httpd/error_log
sudo tail -f /var/log/httpd/access_log

# PM2 status
pm2 status
```

### Restart Services

```bash
# Restart server
pm2 restart strata-waitlist-server

# Restart Apache
sudo systemctl restart httpd

# Restart PM2
pm2 restart all
```

### Database Management

```bash
# Backup database
cp /var/www/strata-waitlist/server/waitlist.db /backup/waitlist-$(date +%Y%m%d).db

# View database (requires sqlite3)
sqlite3 /var/www/strata-waitlist/server/waitlist.db
```

## 🔒 Security Considerations

1. **HTTPS**: Set up SSL certificate for production
2. **Firewall**: Only open necessary ports
3. **Database**: SQLite file should have restricted permissions
4. **Updates**: Regularly update system packages
5. **Backups**: Regular database backups

## 🚨 Troubleshooting

### Common Issues

1. **Server not starting:**

   ```bash
   pm2 logs strata-waitlist-server
   cd /var/www/strata-waitlist/server
   node server.js
   ```

2. **Apache not serving files:**

   ```bash
   sudo systemctl status httpd
   sudo tail -f /var/log/httpd/error_log
   ```

3. **Database issues:**

   ```bash
   cd /var/www/strata-waitlist/server
   npm run init-db
   ```

4. **Permission issues:**
   ```bash
   sudo chown -R apache:apache /var/www/strata-waitlist/dist
   sudo chmod -R 755 /var/www/strata-waitlist/dist
   ```

### Performance Monitoring

```bash
# Check server resources
htop
pm2 monit

# Check disk space
df -h

# Check memory usage
free -h
```

## 📈 Scaling Considerations

For higher traffic:

1. **Load Balancer**: Use AWS ALB or similar
2. **Multiple Instances**: Deploy across multiple EC2 instances
3. **Database**: Consider migrating to PostgreSQL or MySQL
4. **Caching**: Implement Redis for session management
5. **CDN**: Use CloudFront for static assets

## 🔄 Updates

To update the application:

1. **Pull new code:**

   ```bash
   cd /var/www/strata-waitlist
   git pull origin main
   ```

2. **Rebuild frontend:**

   ```bash
   npm install
   npm run build
   ```

3. **Update server:**

   ```bash
   cd server
   npm install
   pm2 restart strata-waitlist-server
   ```

4. **Update Apache configuration if needed:**
   ```bash
   sudo systemctl restart httpd
   ```

## 📞 Support

For issues or questions:

- Check logs: `pm2 logs` and Apache logs
- Verify configuration files
- Test API endpoints: `curl http://localhost:3001/api/health`
- Check database: `sqlite3 waitlist.db .tables`
