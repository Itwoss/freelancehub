# Dashboard Home - Technical Specification

## Overview
A social media-style dashboard home page with stories carousel, posts feed, and messaging system built on Next.js with PostgreSQL and NextAuth.js.

## Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Real-time**: Optional WebSocket/Pusher (not required for MVP)

## Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  role          Role      @default(USER) // USER | ADMIN
  image         String?
  bio           String?
  skills        String[]
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  stories       Story[]
  posts         Post[]
  likes         Like[]
  comments      Comment[]
  sentMessages  Message[] @relation("MessageSender")
  receivedMessages Message[] @relation("MessageReceiver")
  chatRooms     ChatRoomMember[]
}

enum Role {
  USER
  ADMIN
}
```

### Story Model
```prisma
model Story {
  id          String      @id @default(cuid())
  content     String      // URL to image/video
  type        StoryType   // IMAGE | VIDEO
  isApproved  Boolean     @default(false)
  isPublic    Boolean     @default(true)
  viewsCount  Int         @default(0)
  expiresAt   DateTime    // Stories expire after 24 hours
  createdAt   DateTime    @default(now())
  
  authorId    String
  author      User        @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

enum StoryType {
  IMAGE
  VIDEO
}
```

### Post Model
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
  commentsCount Int         @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  authorId      String
  author        User        @relation(fields: [authorId], references: [id], onDelete: Cascade)
  likes         Like[]
  comments      Comment[]
}

model Like {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@unique([userId, postId])
}

model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
}
```

### Group/Messaging Model
```prisma
model ChatRoom {
  id        String   @id @default(cuid())
  name      String?
  slug      String?  @unique // 'main-group' for main group
  type      ChatRoomType @default(DIRECT) // DIRECT | GROUP
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  members   ChatRoomMember[]
  messages  Message[]
}

model ChatRoomMember {
  id        String   @id @default(cuid())
  joinedAt  DateTime @default(now())
  isAdmin   Boolean  @default(false) // For group admin permissions
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  chatRoomId String
  chatRoom  ChatRoom @relation(fields: [chatRoomId], references: [id], onDelete: Cascade)
  
  @@unique([userId, chatRoomId])
}

model Message {
  id        String   @id @default(cuid())
  content   String   @db.Text
  type      MessageType @default(TEXT)
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  
  senderId  String
  sender    User     @relation("MessageSender", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId String?
  receiver  User?    @relation("MessageReceiver", fields: [receiverId], references: [id], onDelete: Cascade)
  chatRoomId String?
  chatRoom  ChatRoom? @relation(fields: [chatRoomId], references: [id], onDelete: Cascade)
}

enum ChatRoomType {
  DIRECT
  GROUP
}

enum MessageType {
  TEXT
  IMAGE
  VIDEO
  AUDIO
}
```

## API Endpoints

### Stories API
```typescript
// GET /api/stories
// Fetch all active stories (not expired, public, approved)
// Returns: { stories: Story[] }
// Auth: Required

// POST /api/stories
// Create new story
// Body: { content: string, type: 'IMAGE' | 'VIDEO' }
// Returns: { story: Story }
// Auth: Required

// POST /api/stories/[id]/view
// Track story view
// Returns: { success: boolean, viewsCount: number }
// Auth: Required
```

### Posts API
```typescript
// GET /api/posts
// Fetch all public posts with user's like status
// Returns: { posts: Post[] }
// Auth: Required

// POST /api/posts
// Create new post
// Body: { title?: string, caption: string, images?: string[], audioUrl?: string, audioTitle?: string }
// Returns: { post: Post }
// Auth: Required

// POST /api/posts/[id]/like
// Toggle like on post
// Returns: { liked: boolean }
// Auth: Required

// GET /api/posts/[id]/comments
// Get post comments
// Returns: { comments: Comment[] }
// Auth: Required

// POST /api/posts/[id]/comments
// Add comment to post
// Body: { content: string }
// Returns: { comment: Comment }
// Auth: Required
```

### Messages API
```typescript
// GET /api/messages/recent
// Get recent messages from user's chat rooms
// Returns: { messages: Message[] }
// Auth: Required

// GET /api/groups/main
// Get main group info
// Returns: { group: ChatRoom, isAdmin: boolean }
// Auth: Required

// POST /api/groups/main/messages
// Post message to main group (admin only)
// Body: { content: string }
// Returns: { message: Message }
// Auth: Required, Admin only
```

## UI Components

### StoriesCarousel
```typescript
interface StoriesCarouselProps {
  stories: Story[]
  onStoryClick: (story: Story) => void
}

// Features:
// - Horizontal scrolling
// - Avatar + story status indicator
// - Click to open StoryModal
// - Only shows active stories (not expired)
// - Responsive design
```

### StoryModal
```typescript
interface StoryModalProps {
  story: Story
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

// Features:
// - Full-screen modal
// - Story content display
// - Navigation between stories
// - View tracking
// - Author info
// - Expiration handling
```

### MessagesRow
```typescript
interface MessagesRowProps {
  messages: Message[]
  onMessageClick: (message: Message) => void
}

// Features:
// - Horizontal scrolling
// - Unread badge indicators
// - Click to open DM
// - Recent contacts display
// - Responsive design
```

### PostsFeed
```typescript
interface PostsFeedProps {
  posts: Post[]
  onLike: (postId: string) => void
  onComment: (postId: string, content: string) => void
  onPostClick: (post: Post) => void
}

// Features:
// - Vertical list sorted by createdAt (newest first)
// - PostCard components
// - Like/comment functionality
// - Media display (images, audio)
// - Author information
// - Timestamp display
```

### PostCard
```typescript
interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onComment: (postId: string, content: string) => void
  onPostClick: (post: Post) => void
}

// Features:
// - Image/media display
// - Title/description
// - Author info with avatar
// - Timestamp
// - Like button with count
// - Comment button with count
// - Click to open post details
```

## Main Group Logic

### Group Creation
```typescript
// Auto-create main group on app initialization
const mainGroup = await prisma.chatRoom.create({
  data: {
    name: 'Main Group',
    slug: 'main-group',
    type: 'GROUP'
  }
})

// Add admin as group admin
await prisma.chatRoomMember.create({
  data: {
    userId: adminId,
    chatRoomId: mainGroup.id,
    isAdmin: true
  }
})
```

### Auto-join New Users
```typescript
// In user registration handler
const newUser = await prisma.user.create({...})

// Auto-add to main group
const mainGroup = await prisma.chatRoom.findUnique({
  where: { slug: 'main-group' }
})

await prisma.chatRoomMember.create({
  data: {
    userId: newUser.id,
    chatRoomId: mainGroup.id,
    isAdmin: false
  }
})
```

### Admin-only Posting
```typescript
// Check if user can post to main group
const canPost = await prisma.chatRoomMember.findFirst({
  where: {
    userId: session.user.id,
    chatRoomId: mainGroupId,
    isAdmin: true
  }
})

if (!canPost && user.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}
```

## Authentication & Authorization

### Session Protection
```typescript
// All API routes protected with NextAuth.js
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Continue with authenticated logic
}
```

### Role-based Access
```typescript
// Admin-only endpoints
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { role: true }
})

if (user?.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

## Real-time Features (Optional)

### WebSocket Integration
```typescript
// Optional: Real-time updates
// - Story view updates
// - New message notifications
// - Post like/comment updates
// - Online status indicators

// Implementation with Pusher or Socket.io
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER
})

// Trigger events
await pusher.trigger('dashboard', 'new-story', { story })
await pusher.trigger('dashboard', 'new-message', { message })
```

## Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_stories_expires_at ON "Story"("expiresAt");
CREATE INDEX idx_stories_author ON "Story"("authorId");
CREATE INDEX idx_posts_created_at ON "Post"("createdAt");
CREATE INDEX idx_posts_author ON "Post"("authorId");
CREATE INDEX idx_messages_chat_room ON "Message"("chatRoomId");
CREATE INDEX idx_messages_created_at ON "Message"("createdAt");
CREATE INDEX idx_chat_room_members_user ON "ChatRoomMember"("userId");
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Optional: Real-time
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="your-cluster"
```

## Testing Strategy

### Unit Tests
```typescript
// API endpoint tests
describe('Stories API', () => {
  it('should require authentication', async () => {
    const response = await fetch('/api/stories')
    expect(response.status).toBe(401)
  })
  
  it('should create story with valid data', async () => {
    // Test with authenticated user
  })
})

// Component tests
describe('StoriesCarousel', () => {
  it('should render stories correctly', () => {
    // Test component rendering
  })
})
```

### Integration Tests
```typescript
// Database integration
describe('Main Group', () => {
  it('should auto-add new users', async () => {
    // Test user registration flow
  })
  
  it('should enforce admin-only posting', async () => {
    // Test permission system
  })
})
```

## Performance Considerations

### Database Optimization
- **Pagination** for posts feed (limit 20 per page)
- **Indexes** on frequently queried fields
- **Connection pooling** for database connections
- **Caching** for frequently accessed data

### Frontend Optimization
- **Lazy loading** for images and media
- **Virtual scrolling** for large lists
- **Debounced** search and interactions
- **Memoization** for expensive calculations

## Security Considerations

### Input Validation
```typescript
// Validate all inputs
const { content, type } = await request.json()

if (!content || !type || !['IMAGE', 'VIDEO'].includes(type)) {
  return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
}
```

### Rate Limiting
```typescript
// Implement rate limiting for API endpoints
// - Story creation: 5 per hour
// - Post creation: 10 per hour
// - Like/comment: 100 per hour
```

### Content Moderation
```typescript
// Optional: Content filtering
const isAppropriate = await moderateContent(content)
if (!isAppropriate) {
  return NextResponse.json({ error: 'Content not allowed' }, { status: 400 })
}
```

## Deployment Checklist

### Database Setup
- [ ] Run Prisma migrations
- [ ] Create database indexes
- [ ] Set up connection pooling
- [ ] Configure backup strategy

### Application Setup
- [ ] Set environment variables
- [ ] Configure NextAuth.js
- [ ] Set up file upload (if needed)
- [ ] Configure CDN for media

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure performance monitoring
- [ ] Set up database monitoring
- [ ] Configure uptime monitoring

## Future Enhancements

### Phase 2 Features
- **Real-time notifications** with WebSocket
- **Advanced moderation** tools
- **Analytics dashboard** for engagement
- **Mobile app** with React Native
- **Push notifications** for mobile

### Phase 3 Features
- **AI-powered content** recommendations
- **Advanced search** functionality
- **Content scheduling** for admins
- **Advanced analytics** and reporting
- **Multi-language** support

---

## Quick Start

1. **Install dependencies**: `npm install`
2. **Set up database**: `npx prisma db push`
3. **Seed data**: `node scripts/seed-dashboard.js`
4. **Start development**: `npm run dev`
5. **Access dashboard**: `http://localhost:3000/dashboard/home`

## Support

For technical questions or issues:
- **Documentation**: See `DASHBOARD_README.md`
- **API Reference**: See individual endpoint files
- **Database Schema**: See `prisma/schema.prisma`
- **Tests**: See `__tests__/api/dashboard.test.ts`
