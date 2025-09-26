# FreelanceHub - Full-Stack Freelance Marketplace

A modern, feature-rich freelance marketplace built with Next.js, featuring social networking, project management, and real-time communication capabilities.

## 🚀 Features

### Core Marketplace
- **Project Management**: Create, browse, and manage freelance projects
- **User Profiles**: Comprehensive freelancer and client profiles
- **Order System**: Secure payment processing with Stripe integration
- **Review System**: Rating and review system for quality assurance

### Social Features
- **Dashboard Home**: Instagram-like social feed with stories and posts
- **Stories Carousel**: 24-hour expiring stories with view tracking
- **Posts Feed**: Rich media posts with likes, comments, and interactions
- **Messaging System**: Direct messages and group chats
- **User Directory**: Browse and connect with other users

### Admin Features
- **Contact Management**: Full contact form submission system
- **User Management**: Admin dashboard for user oversight
- **Content Moderation**: Approve posts, stories, and user content
- **Analytics**: Dashboard with user and project statistics

### Technical Features
- **Authentication**: NextAuth.js with multiple providers
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: WebSocket-ready architecture
- **Email System**: Automated notifications and confirmations
- **Responsive Design**: Mobile-first with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Email**: Nodemailer with Gmail SMTP
- **Testing**: Jest, React Testing Library

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Gmail account for email functionality

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd itwos.cs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/freelance_marketplace"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Email Configuration
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   EMAIL_FROM="FreelanceHub <noreply@freelancehub.com>"
   
   # Stripe (Optional)
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

4. **Database Setup**
   ```bash
   # Push schema to database
   npx prisma db push
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Seed Database**
   ```bash
   # Create admin user and sample data
   node scripts/create-admin.js
   
   # Seed dashboard data
   node scripts/seed-dashboard.js
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Admin login: `admin@freelancehub.com` / `admin123`

## 📁 Project Structure

```
├── app/                          # Next.js 13+ App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── contact/              # Contact form handling
│   │   ├── posts/                # Posts API
│   │   ├── stories/              # Stories API
│   │   └── messages/             # Messaging API
│   ├── dashboard/                # Dashboard pages
│   │   └── home/                # Social feed dashboard
│   ├── mini-office/             # User management
│   ├── admin/                   # Admin dashboard
│   └── auth/                    # Authentication pages
├── components/                   # Reusable components
│   ├── layout/                  # Layout components
│   ├── ui/                      # UI components
│   └── notifications/           # Notification system
├── lib/                         # Utility libraries
├── prisma/                      # Database schema
├── scripts/                     # Database scripts
├── __tests__/                   # Test files
└── types/                       # TypeScript definitions
```

## 🎯 Key Features

### Dashboard Home (`/dashboard/home`)
- **Stories Carousel**: Horizontal scrolling stories with 24-hour expiration
- **Posts Feed**: Instagram-like social feed with rich media support
- **Messages Bar**: Recent direct messages with unread indicators
- **Real-time Updates**: Live notifications and interactions

### Mini Office (`/mini-office`)
- **User Directory**: Browse and search all users
- **Social Features**: Posts, stories, and messaging
- **Content Creation**: Create posts and stories
- **Profile Management**: User profiles and interactions

### Admin Dashboard (`/admin`)
- **Contact Management**: Handle contact form submissions
- **User Management**: Oversee user accounts and permissions
- **Content Moderation**: Approve user-generated content
- **Analytics**: Platform statistics and insights

## 🔧 API Endpoints

### Stories
- `GET /api/stories` - Fetch all active stories
- `POST /api/stories` - Create new story
- `POST /api/stories/[id]/view` - Track story view

### Posts
- `GET /api/posts` - Fetch all public posts
- `POST /api/posts` - Create new post
- `POST /api/posts/[id]/like` - Toggle like on post
- `POST /api/posts/[id]/comments` - Add comment to post

### Messages
- `GET /api/messages/recent` - Get recent messages
- `POST /api/groups/main/messages` - Post to main group (admin only)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact submissions (admin)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts with roles and permissions
- **Project**: Freelance projects and listings
- **Post**: Social media posts with media support
- **Story**: 24-hour expiring stories
- **Message**: Direct and group messages
- **ChatRoom**: Chat rooms and group management
- **ContactSubmission**: Contact form submissions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: See individual component README files
- **Issues**: Open an issue on GitHub
- **Email**: Contact the development team

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this project

---

**Built with ❤️ by the FreelanceHub Team**