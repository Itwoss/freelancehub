# Dashboard Home Feature

## Overview
A comprehensive social media-style dashboard with stories carousel, posts feed, and messaging system.

## Features Implemented

### 🎬 Stories Carousel
- **Horizontal scrolling** stories at the top
- **Click to view** in modal with full-screen experience
- **Auto-expiration** after 24 hours
- **View tracking** with real-time updates
- **Responsive design** for mobile and desktop

### 📱 Posts Feed
- **Instagram-like interface** with images, captions, and interactions
- **Like/Unlike functionality** with real-time count updates
- **Comments system** with nested replies
- **Audio posts** support with custom players
- **Author information** with profile pictures
- **Infinite scroll** ready for pagination

### 💬 Messages Bar
- **Recent DMs** horizontal scroll
- **Unread indicators** with visual badges
- **Quick access** to chat conversations
- **Group and direct** message support

### 🏢 Main Group System
- **Auto-join** all users to main group
- **Admin-only posting** for announcements
- **Member read-only** access for regular users
- **Welcome message** from admin

## API Endpoints

### Stories
- `GET /api/stories` - Fetch all public stories
- `POST /api/stories` - Create new story
- `POST /api/stories/[id]/view` - Track story view

### Posts
- `GET /api/posts` - Fetch all public posts
- `POST /api/posts` - Create new post
- `POST /api/posts/[id]/like` - Toggle like on post
- `GET /api/posts/[id]/comments` - Get post comments
- `POST /api/posts/[id]/comments` - Add comment to post

### Messages
- `GET /api/messages/recent` - Get recent messages

## Database Schema

### Stories
```prisma
model Story {
  id          String      @id @default(cuid())
  content     String      // URL to image/video
  type        StoryType   // IMAGE | VIDEO
  isApproved  Boolean     @default(false)
  isPublic    Boolean     @default(true)
  viewsCount  Int         @default(0)
  expiresAt   DateTime    // 24-hour expiration
  createdAt   DateTime    @default(now())
  authorId    String
  author      User        @relation(fields: [authorId], references: [id])
}
```

### Posts
```prisma
model Post {
  id            String      @id @default(cuid())
  title         String?
  caption       String      @db.Text
  images        String[]
  audioUrl      String?
  audioTitle    String?
  isApproved    Boolean     @default(false)
  isPublic      Boolean     @default(true)
  likesCount    Int         @default(0)
  commentsCount Int        @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  authorId      String
  author        User        @relation(fields: [authorId], references: [id])
  likes         Like[]
  comments      Comment[]
}
```

### Messages & Groups
```prisma
model ChatRoom {
  id        String   @id @default(cuid())
  name      String?
  type      ChatRoomType @default(DIRECT) // DIRECT | GROUP
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  members   ChatRoomMember[]
  messages  Message[]
}

model Message {
  id          String      @id @default(cuid())
  content     String      @db.Text
  type        MessageType @default(TEXT)
  isRead      Boolean     @default(false)
  createdAt   DateTime    @default(now())
  senderId    String
  sender      User        @relation("MessageSender", fields: [senderId], references: [id])
  receiverId  String?
  receiver    User?       @relation("MessageReceiver", fields: [receiverId], references: [id])
  chatRoomId  String?
  chatRoom    ChatRoom?   @relation(fields: [chatRoomId], references: [id])
}
```

## Authentication
All API endpoints are protected with NextAuth.js session authentication:
- **Session required** for all operations
- **User context** available in all endpoints
- **Role-based access** for admin features

## Setup Instructions

### 1. Database Setup
```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 2. Seed Data
```bash
# Run seed script to create sample data
node scripts/seed-dashboard.js
```

### 3. Access Dashboard
- Navigate to `/dashboard/home`
- Login with admin credentials: `admin@freelancehub.com` / `admin123`
- Or create new user account

## Sample Data Created
- **Admin user** with full permissions
- **4 sample users** with different roles
- **5 sample stories** with various content types
- **8 sample posts** with likes and comments
- **Main group** with all users as members
- **3 direct message** conversations

## Testing
```bash
# Run tests
npm test

# Run specific dashboard tests
npm test __tests__/api/dashboard.test.ts
```

## Features in Detail

### Stories Carousel
- **Responsive design** that works on all screen sizes
- **Smooth scrolling** with touch/swipe support
- **Modal overlay** for full-screen story viewing
- **Auto-expiration** after 24 hours
- **View tracking** with real-time updates

### Posts Feed
- **Rich media support** for images and audio
- **Interactive elements** like likes and comments
- **Real-time updates** for engagement metrics
- **Responsive layout** for mobile and desktop
- **Infinite scroll** ready for large datasets

### Messages System
- **Group messaging** with admin controls
- **Direct messaging** between users
- **Unread indicators** for new messages
- **Message history** with pagination
- **Real-time notifications** (ready for WebSocket integration)

## Future Enhancements
- **WebSocket integration** for real-time updates
- **Push notifications** for mobile devices
- **File upload** for images and videos
- **Advanced moderation** tools for admins
- **Analytics dashboard** for engagement metrics
- **Mobile app** integration with React Native
