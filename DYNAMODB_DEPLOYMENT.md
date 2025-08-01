# DynamoDB Integration Deployment Guide

This guide covers deploying the DynamoDB integration to your EC2 instance.

## 🚀 Deployment Instructions

### **Step 1: Update Your EC2 Instance**

```bash
# SSH to your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Navigate to your project
cd ~/stratawaitlist

# Pull the latest changes
git pull origin main

# Install new dependencies
cd server
npm install
```

### **Step 2: Set Up DynamoDB Table**

```bash
# Create the DynamoDB table (run this once)
npm run setup-dynamodb
```

You should see output like:

```
🔄 Creating DynamoDB table: strata-waitlist
✅ DynamoDB table created successfully!
📋 Table name: strata-waitlist
🔍 Indexes created:
   - email-index (for email lookups)
   - points-index (for leaderboard)
```

### **Step 3: Restart the Server**

```bash
# Restart the Node.js server
pm2 restart stratawaitlist-server

# Check the status
pm2 status
```

### **Step 4: Test the Integration**

```bash
# Test the health endpoint
curl http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "dynamodb": "connected"
}
```

### **Step 5: Test User Registration**

```bash
# Test creating a user (both SQLite and DynamoDB)
curl -X POST http://localhost:3001/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com"
  }'
```

## ✅ Verification Steps

### **1. Check Server Logs**

```bash
# View PM2 logs
pm2 logs stratawaitlist-server

# You should see:
# ✅ User saved to DynamoDB: test@example.com
```

### **2. Check DynamoDB Console**

- Go to AWS Console → DynamoDB → Tables
- Find `strata-waitlist` table
- Check the "Items" tab to see your test user

### **3. Test Frontend**

- Visit your website
- Try registering a new user
- Check that the success page shows correctly

## 🔧 Troubleshooting

### **If DynamoDB connection fails:**

```bash
# Check IAM role permissions
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Check if the role has DynamoDB permissions
aws sts get-caller-identity
```

### **If table creation fails:**

```bash
# Check if table already exists
aws dynamodb describe-table --table-name strata-waitlist

# Or check in AWS Console → DynamoDB → Tables
```

### **If server won't start:**

```bash
# Check for errors
pm2 logs stratawaitlist-server --lines 50

# Restart with fresh environment
pm2 delete stratawaitlist-server
pm2 start ecosystem.config.cjs
```

## 📊 What Happens Now

- **Dual Storage**: Every user registration saves to both SQLite (local) and DynamoDB (cloud)
- **Non-blocking**: If DynamoDB fails, the app continues with SQLite
- **Additional Data**: Tracks UTM parameters and source information
- **Scalability**: DynamoDB can handle high traffic and scale automatically

## 🔄 Future Updates

When you deploy updates in the future:

```bash
# Standard update process
cd ~/stratawaitlist
git pull origin main
cd server
npm install
npm run build  # if frontend changes
pm2 restart stratawaitlist-server
```

The DynamoDB integration will continue working automatically with your IAM role!

## 🔐 IAM Role Requirements

Your EC2 instance's IAM role needs the following DynamoDB permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/strata-waitlist",
        "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/strata-waitlist/index/*"
      ]
    }
  ]
}
```

Or simply attach the `AmazonDynamoDBFullAccess` policy to your EC2 role.

## 📋 Environment Variables

The following environment variables are automatically handled by your IAM role:

- `AWS_REGION`: us-east-1 (default)
- `DYNAMODB_TABLE_NAME`: strata-waitlist (default)

No manual configuration needed!
