# Migration Summary: Supabase to SQLite

This document summarizes the changes made to migrate the Strata Waitlist application from Supabase to SQLite.

## 🔄 What Changed

### Backend Architecture
- **Before**: Supabase (PostgreSQL cloud database)
- **After**: Express.js API server with SQLite database

### Database
- **Before**: Supabase PostgreSQL tables
- **After**: SQLite file-based database (`server/waitlist.db`)

### API Layer
- **Before**: Supabase client with real-time subscriptions
- **After**: REST API with polling for updates

## 📁 New Files Created

### Server Files
- `server/package.json` - Backend dependencies
- `server/server.js` - Express.js API server
- `server/database.js` - SQLite database utilities
- `server/init-db.js` - Database initialization script

### Frontend Files
- `src/lib/api.ts` - New API client to replace Supabase client

### Deployment Files
- `deploy.sh` - Automated deployment script for EC2
- `dev.sh` - Development environment script
- `DEPLOYMENT.md` - Detailed deployment guide

## 🔧 Modified Files

### Frontend Components
- `src/components/WaitlistForm.tsx` - Updated to use new API client
- `src/components/Leaderboard.tsx` - Updated to use new API client

### Configuration Files
- `package.json` - Removed Supabase dependencies
- `README.md` - Updated documentation

## 🗄️ Database Schema

The SQLite database includes the following tables:

### waitlist
```sql
CREATE TABLE waitlist (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  referral_count INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  tier_level INTEGER DEFAULT 1,
  referral_link TEXT UNIQUE,
  referred_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_referral_at DATETIME,
  FOREIGN KEY (referred_by) REFERENCES waitlist (id)
);
```

### profiles
```sql
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### referral_rewards
```sql
CREATE TABLE referral_rewards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### user_achievements
```sql
CREATE TABLE user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  points_earned INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES waitlist (id)
);
```

## 🌐 API Endpoints

The new Express.js server provides the following REST API endpoints:

- `GET /api/health` - Health check
- `POST /api/waitlist` - Create new waitlist entry
- `GET /api/waitlist/:id` - Get waitlist entry by ID
- `GET /api/waitlist/email/:email` - Get waitlist entry by email
- `GET /api/leaderboard` - Get leaderboard data
- `GET /api/rewards` - Get available rewards
- `PATCH /api/waitlist/:id` - Update waitlist entry
- `GET /api/users/:userId/achievements` - Get user achievements
- `POST /api/users/:userId/achievements` - Create user achievement

## 🚀 Deployment Options

### Option 1: EC2 with Apache (Recommended)
- Full-stack deployment on EC2 instance
- Apache serves frontend and proxies API requests
- SQLite database file stored on EC2
- PM2 manages Node.js server process

### Option 2: Netlify (Frontend Only)
- Deploy frontend to Netlify
- Requires separate API server deployment
- Configure `VITE_API_URL` environment variable

### Option 3: Local Development
- Run both frontend and backend locally
- Use `dev.sh` script for easy setup

## 🔧 Development Setup

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd stratawaitlist

# Run development environment
./dev.sh  # On Linux/Mac
# or manually:
# cd server && npm install && npm run init-db && npm start
# npm install && npm run dev
```

### Manual Setup
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
npm run init-db
npm start

# In another terminal, start frontend
npm run dev
```

## 🔒 Security Considerations

### Production Deployment
1. **HTTPS**: Set up SSL certificate
2. **Firewall**: Only open necessary ports (80, 443)
3. **Database**: Restrict SQLite file permissions
4. **Updates**: Regular system package updates
5. **Backups**: Regular database backups

### Environment Variables
```bash
# Frontend (.env.local)
VITE_API_URL=http://your-domain.com/api

# Backend (server/.env)
NODE_ENV=production
PORT=3001
DB_PATH=/var/www/strata-waitlist/server/waitlist.db
```

## 📊 Monitoring

### Logs
- **Server logs**: `pm2 logs strata-waitlist-server`
- **Apache logs**: `/var/log/httpd/error_log`
- **PM2 status**: `pm2 status`

### Health Checks
- **API health**: `curl http://localhost:3001/api/health`
- **Database**: `sqlite3 waitlist.db .tables`

## 🔄 Migration Benefits

### Advantages
1. **Self-hosted**: Complete control over data and infrastructure
2. **Cost-effective**: No cloud database costs
3. **Simple**: File-based database, no complex setup
4. **Portable**: Easy to backup and migrate
5. **Customizable**: Full control over API and business logic

### Trade-offs
1. **No real-time**: Replaced with polling (30-second intervals)
2. **Manual scaling**: Requires manual setup for high traffic
3. **Backup responsibility**: You must manage database backups
4. **Infrastructure management**: You manage the server

## 🚨 Breaking Changes

1. **Real-time updates**: Now uses polling instead of WebSocket subscriptions
2. **Authentication**: Removed Supabase Auth (can be re-implemented if needed)
3. **Database queries**: Changed from Supabase client to REST API calls
4. **Environment variables**: Updated from Supabase config to API URL

## 📈 Future Enhancements

### Potential Improvements
1. **WebSocket support**: Add real-time updates
2. **Authentication**: Implement JWT-based auth
3. **Caching**: Add Redis for session management
4. **Load balancing**: Multiple server instances
5. **Database migration**: PostgreSQL for higher scale

### Scaling Considerations
1. **Database**: Migrate to PostgreSQL for high traffic
2. **Load balancer**: AWS ALB or similar
3. **Caching**: Redis for session and data caching
4. **CDN**: CloudFront for static assets
5. **Monitoring**: CloudWatch or similar for metrics

## 📞 Support

For issues or questions:
1. Check logs: `pm2 logs` and Apache logs
2. Verify configuration files
3. Test API endpoints: `curl http://localhost:3001/api/health`
4. Check database: `sqlite3 waitlist.db .tables`
5. Review deployment guide: `DEPLOYMENT.md` 