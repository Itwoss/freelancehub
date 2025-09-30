# Freelance Marketplace

A full-stack freelance marketplace web application with a clean frontend/backend architecture.

## Project Structure

```
freelancehub/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Frontend utilities
│   └── ...
├── backend/          # Backend API and services
│   ├── api/          # API routes
│   ├── lib/          # Backend utilities
│   ├── prisma/       # Database schema and migrations
│   ├── scripts/      # Database and utility scripts
│   └── ...
└── docs/             # Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Itwoss/freelancehub.git
cd freelancehub
```

2. Install dependencies for all workspaces:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your database and API keys
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### Development

Start both frontend and backend in development mode:
```bash
npm run dev
```

Or start them separately:
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Building for Production

Build both frontend and backend:
```bash
npm run build
```

### Testing

Run all tests:
```bash
npm run test
```

Run tests for specific workspace:
```bash
npm run test:frontend
npm run test:backend
```

## Workspace Commands

### Frontend Commands
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run test:frontend` - Run frontend tests

### Backend Commands
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production
- `npm run test:backend` - Run backend tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

## Technology Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form
- React Query

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Stripe
- Nodemailer

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.