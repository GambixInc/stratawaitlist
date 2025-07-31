# Strata Waitlist

A modern waitlist application built with React, TypeScript, and SQLite, featuring user authentication, referral systems, and a beautiful UI with shadcn/ui components.

## 🚀 Features

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Beautiful Design**: Stunning gradient backgrounds and smooth animations
- **User Authentication**: Simple login system using localStorage
- **Referral System**: Track referrals and earn points
- **Leaderboard**: Real-time leaderboard with user rankings
- **Rewards System**: Earn points and unlock rewards
- **Responsive Design**: Works perfectly on all devices
- **Real-time Updates**: Live data synchronization with polling
- **Share Functionality**: Easy social media sharing
- **Progress Tracking**: Visual progress indicators
- **Mobile Optimized**: Touch-friendly interface

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Backend**: Express.js, Node.js
- **Database**: SQLite (file-based)
- **Deployment**: EC2, Apache, PM2
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
stratawaitlist/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── waitlist/       # Waitlist-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and API client
│   ├── pages/              # Page components
│   └── main.tsx           # Application entry point
├── server/                 # Backend Express.js server
│   ├── server.js          # Main server file
│   ├── database.js        # SQLite database wrapper
│   ├── init-db.js         # Database initialization
│   └── package.json       # Backend dependencies
├── public/                 # Static assets
├── deploy.sh              # Deployment script
├── dev.sh                 # Development setup script
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stratawaitlist
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Initialize the database**
   ```bash
   cd server
   npm run init-db
   cd ..
   ```

5. **Start the development servers**
   ```bash
   # Option 1: Use the development script
   ./dev.sh
   
   # Option 2: Start manually
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **React Query**: Server state management and caching
- **shadcn/ui**: Beautiful, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework

### Backend (Express.js + SQLite)
- **Express.js**: Fast, unopinionated web framework
- **SQLite**: Lightweight, file-based database
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Rate Limiting**: API protection
- **UUID**: Unique identifier generation

### Database Schema

#### Waitlist Table
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

#### Profiles Table
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

#### Referral Rewards Table
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

#### User Achievements Table
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

### Waitlist Management
- `POST /api/waitlist` - Create new waitlist entry
- `GET /api/waitlist/email/:email` - Get entry by email
- `GET /api/waitlist/:id` - Get entry by ID
- `PATCH /api/waitlist/:id` - Update entry

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard data

### Rewards & Achievements
- `GET /api/rewards` - Get available rewards
- `GET /api/users/:userId/achievements` - Get user achievements
- `POST /api/users/:userId/achievements` - Create achievement

### Health Check
- `GET /api/health` - Server health status

## 🚀 Deployment

### Automated Deployment (EC2)

1. **Prepare your EC2 instance**
   - Ubuntu 20.04+ recommended
   - At least 1GB RAM
   - Open ports 80 (HTTP) and 443 (HTTPS)

2. **Run the deployment script**
   ```bash
   # Upload the script to your EC2 instance
   scp deploy.sh ubuntu@your-ec2-ip:/home/ubuntu/
   
   # SSH into your EC2 instance
   ssh ubuntu@your-ec2-ip
   
   # Make the script executable and run it
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Manual Deployment

1. **Install dependencies on EC2**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm apache2
   sudo npm install -g pm2
   ```

2. **Copy application files**
   ```bash
   # Copy frontend build to Apache
   sudo cp -r dist/* /var/www/html/
   
   # Copy backend to /opt/stratawaitlist/
sudo mkdir -p /opt/stratawaitlist
sudo cp -r server/* /opt/stratawaitlist/
   ```

3. **Configure Apache proxy**
   ```bash
   sudo a2enmod proxy
   sudo a2enmod proxy_http
   sudo systemctl restart apache2
   ```

4. **Start the backend**
   ```bash
   cd /opt/stratawaitlist
npm install
npm run init-db
pm2 start server.js --name "stratawaitlist"
   pm2 save
   pm2 startup
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No (defaults to localhost:3001) |
| `PORT` | Backend server port | No (defaults to 3001) |

### Database Configuration

The SQLite database is automatically created in the `server/` directory as `waitlist.db`. No additional configuration is required.

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all dependencies are installed: `npm install`
   - Clear cache: `npm run build -- --force`

2. **API Connection Issues**
   - Verify the backend server is running: `curl http://localhost:3001/api/health`
   - Check CORS configuration in `server/server.js`

3. **Database Issues**
   - Reinitialize the database: `cd server && npm run init-db`
   - Check file permissions on `waitlist.db`

4. **Deployment Issues**
   - Check Apache error logs: `sudo tail -f /var/log/apache2/error.log`
   - Check PM2 logs: `pm2 logs stratawaitlist`
   - Verify firewall settings

### Development Tips

- Use the `dev.sh` script for easy local development
- The backend API runs on port 3001 by default
- Frontend development server runs on port 5173
- Database file is created in `server/waitlist.db`

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vite](https://vitejs.dev/) for the fast build tool
- [React Query](https://tanstack.com/query) for server state management
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
