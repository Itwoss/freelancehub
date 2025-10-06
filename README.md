# 🚀 FreelanceHub - Modern Freelance Marketplace

A comprehensive freelance marketplace platform built with Next.js, featuring user management, project listings, payment integration, and admin dashboard.

## ✨ Features

- **User Authentication**: Secure login/signup with NextAuth.js
- **Project Management**: Create, browse, and manage freelance projects
- **Payment Integration**: Razorpay payment gateway integration
- **Admin Dashboard**: Complete admin panel for platform management
- **Real-time Chat**: Built-in messaging system
- **Responsive Design**: Mobile-first, modern UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (production), SQLite (development)
- **Authentication**: NextAuth.js
- **Payments**: Razorpay
- **Deployment**: DigitalOcean App Platform

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freelancehub
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp env.example .env.local
   
   # Edit .env.local with your configuration
   ```

4. **Database Setup**
   ```bash
   cd frontend
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

## 📁 Project Structure

```
freelancehub/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # User dashboard
│   │   └── ...
│   ├── components/         # Reusable components
│   ├── lib/               # Utilities and configurations
│   └── prisma/            # Database schema and migrations
├── backend/               # Backend services (if needed)
└── docs/                 # Documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/freelancehub"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RAZORPAY_ENVIRONMENT="development"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Razorpay Setup

1. Create a Razorpay account
2. Get your API keys from the dashboard
3. Add keys to environment variables
4. Configure webhook URL: `https://yourdomain.com/api/payment/razorpay/webhook`

## 🚀 Deployment

### DigitalOcean App Platform

1. **Connect Repository**: Link your GitHub repository
2. **Configure Build**: 
   - Build Command: `cd frontend && npm run build`
   - Run Command: `cd frontend && npm start`
3. **Set Environment Variables**: Add all required environment variables
4. **Deploy**: Click deploy and wait for completion

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="strong-production-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="your-live-secret"
RAZORPAY_ENVIRONMENT="production"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

## 📱 Usage

### For Users
1. **Sign Up**: Create an account at `/auth/signup`
2. **Browse Projects**: View available projects at `/projects`
3. **Create Projects**: Post your own projects
4. **Dashboard**: Manage your projects and orders

### For Admins
1. **Admin Login**: Access admin panel at `/admin/login`
2. **Dashboard**: View platform analytics and manage users
3. **Orders**: Monitor and manage all orders
4. **Users**: Manage user accounts and permissions

## 🔒 Security Features

- JWT-based authentication
- CSRF protection
- Secure payment processing
- Input validation and sanitization
- Environment variable protection

## 🧪 Testing

```bash
# Run tests (if available)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📝 API Documentation

The API endpoints are organized under `/api/`:

- **Authentication**: `/api/auth/*`
- **Projects**: `/api/projects/*`
- **Orders**: `/api/orders/*`
- **Payments**: `/api/payment/*`
- **Admin**: `/api/admin/*`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review environment variable setup
- Check deployment logs
- Open an issue on GitHub

## 🔄 Updates

To update the application:
1. Pull latest changes
2. Update dependencies: `npm update`
3. Run migrations: `npx prisma db push`
4. Restart the application

---

**Built with ❤️ using Next.js and modern web technologies**