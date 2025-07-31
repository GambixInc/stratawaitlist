# Strata Waitlist - Early Access Platform

A modern waitlist application built with React, TypeScript, and Supabase, featuring user authentication, referral systems, and a beautiful UI with shadcn/ui components.

## 🚀 Live Demo

**Production URL**: [https://lovable.dev/projects/1bc6f77b-a3ef-492d-8429-a67644ce6d68](https://lovable.dev/projects/1bc6f77b-a3ef-492d-8429-a67644ce6d68)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with dark theme
- **User Authentication**: Secure login/signup with Supabase Auth
- **Waitlist Management**: Collect and manage early access signups
- **Referral System**: Track user referrals and rewards
- **Dashboard**: User dashboard with progress tracking
- **Social Proof**: Display testimonials and user counts
- **Mobile Responsive**: Optimized for all device sizes
- **Real-time Updates**: Live data synchronization with Supabase

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Services
- **Supabase** - Backend as a Service (Database, Auth, Real-time)
- **Netlify** - Hosting and deployment

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** or **bun** - Package managers
- **Git** - Version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd stratawaitlist
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# API Configuration (optional - defaults to localhost:3001)
VITE_API_URL=http://localhost:3001/api
```

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using bun
bun dev
```

The application will be available at `http://localhost:5173`

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── waitlist/       # Waitlist-specific components
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions and configurations
├── pages/              # Page components
└── App.tsx             # Main application component
```

## 🗄 Database Setup

This project uses SQLite as the backend database. The database is automatically initialized when you run the server.

### Database Configuration

- **Database Type**: SQLite (file-based)
- **Database File**: `server/waitlist.db`
- **Tables**: Automatically created on first run

### Database Tables

The application uses the following SQLite tables:
- `waitlist` - Waitlist entries and user information
- `profiles` - User profile information (if needed)
- `referral_rewards` - Available referral rewards
- `user_achievements` - User achievement tracking

### API Endpoints

The application includes a REST API with the following endpoints:
- `POST /api/waitlist` - Create new waitlist entry
- `GET /api/waitlist/:id` - Get waitlist entry by ID
- `GET /api/waitlist/email/:email` - Get waitlist entry by email
- `GET /api/leaderboard` - Get leaderboard data
- `GET /api/rewards` - Get available rewards
- `PATCH /api/waitlist/:id` - Update waitlist entry

## 🚀 Deployment

### Option 1: Deploy to EC2 with Apache (Recommended)

See the detailed deployment guide in [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions on deploying to an EC2 instance with Apache.

### Option 2: Deploy with Netlify (Frontend Only)

1. **Connect to Netlify**:
   - Push your code to GitHub
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**:
   Add the following environment variables in Netlify:
   ```
   VITE_API_URL=https://your-api-domain.com/api
   ```

3. **Deploy**:
   - Netlify will automatically deploy on every push to main branch
   - Manual deployments can be triggered from the Netlify dashboard

### Option 3: Local Development

```bash
# Start the backend server
cd server
npm install
npm run init-db
npm start

# In another terminal, start the frontend
npm install
npm run dev
```

## 📁 Project Structure

```
stratawaitlist/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── waitlist/      # Waitlist-specific components
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Third-party integrations
│   ├── lib/               # Utilities and configurations
│   ├── pages/             # Page components
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── supabase/              # Supabase configuration
├── netlify.toml           # Netlify deployment config
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration Files

### Netlify Configuration (`netlify.toml`)
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
This ensures proper routing for the SPA.

### Supabase Configuration (`supabase/config.toml`)
```toml
project_id = "xnjcoexivndpcmjapzbl"
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Test your changes locally before pushing

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed with `npm install`
2. **Supabase Connection**: Verify environment variables are set correctly
3. **Routing Issues**: Check that `netlify.toml` is configured properly
4. **TypeScript Errors**: Run `npm run lint` to identify issues

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review [Vite Documentation](https://vitejs.dev/)
- Consult [shadcn/ui Documentation](https://ui.shadcn.com/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vite](https://vitejs.dev/) for the fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
