const { MongoClient, ObjectId } = require('mongodb');

async function seedMongoDB() {
  console.log('🌱 Starting direct MongoDB database seeding...');
  
  const uri = 'mongodb://localhost:27017/freelancehub';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('freelancehub');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('projects').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('reviews').deleteMany({});
    await db.collection('contact_submissions').deleteMany({});
    await db.collection('notifications').deleteMany({});
    await db.collection('posts').deleteMany({});
    await db.collection('stories').deleteMany({});
    await db.collection('prebookings').deleteMany({});
    await db.collection('transactions').deleteMany({});
    console.log('✅ Existing data cleared');
    
    // 1. Create Users
    console.log('👥 Creating users...');
    const users = [
      {
        _id: new ObjectId(),
        name: 'Admin User',
        email: 'admin@freelancehub.com',
        role: 'ADMIN',
        bio: 'FreelanceHub Platform Administrator',
        rating: 5.0,
        image: '/placeholder-image/admin-avatar.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'John Smith',
        email: 'john@example.com',
        role: 'USER',
        bio: 'Full-stack developer with 5+ years experience in React, Node.js, and MongoDB',
        rating: 4.8,
        image: '/placeholder-image/user-avatar-1.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'USER',
        bio: 'UI/UX Designer specializing in modern web and mobile app design',
        rating: 4.9,
        image: '/placeholder-image/user-avatar-2.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'Mike Davis',
        email: 'mike@example.com',
        role: 'USER',
        bio: 'Digital marketing expert with focus on SEO, content strategy, and social media',
        rating: 4.7,
        image: '/placeholder-image/user-avatar-3.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'Emma Wilson',
        email: 'emma@example.com',
        role: 'USER',
        bio: 'Graphic designer and brand identity specialist',
        rating: 4.6,
        image: '/placeholder-image/user-avatar-4.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('users').insertMany(users);
    console.log('✅ Users created:', users.length);
    
    // 2. Create Projects
    console.log('📁 Creating projects...');
    const projects = [
      {
        _id: new ObjectId(),
        title: 'E-commerce Platform Development',
        description: 'Build a modern e-commerce platform with React, Node.js, and Stripe integration. Looking for a full-stack developer with e-commerce experience.',
        price: 2500.00,
        category: 'Web Development',
        status: 'ACTIVE',
        authorId: users[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Mobile App Design',
        description: 'Design a sleek mobile app interface for a fitness tracking application. Need modern, intuitive design with excellent user experience.',
        price: 1200.00,
        category: 'UI/UX Design',
        status: 'ACTIVE',
        authorId: users[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Content Marketing Strategy',
        description: 'Create engaging content strategy and social media campaigns for a tech startup. Looking for creative marketer with startup experience.',
        price: 800.00,
        category: 'Marketing',
        status: 'ACTIVE',
        authorId: users[3]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Logo Design Package',
        description: 'Comprehensive logo design package including multiple concepts, revisions, and final files in various formats.',
        price: 500.00,
        category: 'Graphic Design',
        status: 'ACTIVE',
        authorId: users[4]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'WordPress Website Development',
        description: 'Develop a responsive WordPress website for a small business, including custom theme and plugin integration.',
        price: 1500.00,
        category: 'Web Development',
        status: 'COMPLETED',
        authorId: users[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('projects').insertMany(projects);
    console.log('✅ Projects created:', projects.length);
    
    // 3. Create Orders
    console.log('🛒 Creating orders...');
    const orders = [
      {
        _id: new ObjectId(),
        totalAmount: 2500.00,
        status: 'COMPLETED',
        userId: users[0]._id,
        projectId: projects[0]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        totalAmount: 1200.00,
        status: 'PAID',
        userId: users[0]._id,
        projectId: projects[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        totalAmount: 800.00,
        status: 'PENDING',
        userId: users[1]._id,
        projectId: projects[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('orders').insertMany(orders);
    console.log('✅ Orders created:', orders.length);
    
    // 4. Create Reviews
    console.log('⭐ Creating reviews...');
    const reviews = [
      {
        _id: new ObjectId(),
        rating: 5,
        comment: 'Excellent work! Very professional and delivered on time. Highly recommended!',
        reviewerId: users[0]._id,
        projectId: projects[0]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        rating: 4,
        comment: 'Good design, but took longer than expected. Overall satisfied with the result.',
        reviewerId: users[0]._id,
        projectId: projects[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        rating: 5,
        comment: 'Outstanding marketing strategy! Our engagement increased by 300%.',
        reviewerId: users[1]._id,
        projectId: projects[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('reviews').insertMany(reviews);
    console.log('✅ Reviews created:', reviews.length);
    
    // 5. Create Contact Submissions
    console.log('📞 Creating contact submissions...');
    const contacts = [
      {
        _id: new ObjectId(),
        name: 'Alice Johnson',
        email: 'alice@example.com',
        subject: 'Website Development Inquiry',
        message: 'I am interested in your web development services. Could you please provide more information about your packages and pricing?',
        status: 'NEW',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'Bob Wilson',
        email: 'bob@example.com',
        subject: 'Design Consultation',
        message: 'I need help with my brand identity design. Are you available for a consultation this week?',
        status: 'READ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'Carol Brown',
        email: 'carol@example.com',
        subject: 'Marketing Services',
        message: 'Looking for digital marketing services for my startup. Please contact me to discuss our requirements.',
        status: 'REPLIED',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'David Lee',
        email: 'david@example.com',
        subject: 'Logo Design Request',
        message: 'I need a professional logo for my new business. What are your rates and timeline?',
        status: 'NEW',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('contact_submissions').insertMany(contacts);
    console.log('✅ Contact submissions created:', contacts.length);
    
    // 6. Create Notifications
    console.log('🔔 Creating notifications...');
    const notifications = [
      {
        _id: new ObjectId(),
        title: 'Welcome to FreelanceHub!',
        message: 'Thank you for joining our platform. Start by creating your first project or browsing available opportunities.',
        type: 'GENERAL',
        read: false,
        userId: users[0]._id,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'New Project Available',
        message: 'A new project matching your skills has been posted: E-commerce Platform Development',
        type: 'PROJECT_APPROVED',
        read: false,
        userId: users[1]._id,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'New Contact Form Submission',
        message: 'New message from Alice Johnson: Website Development Inquiry',
        type: 'CONTACT_SUBMISSION',
        read: false,
        userId: users[0]._id,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Payment Received',
        message: 'Payment of ₹2,500 received for E-commerce Platform Development project',
        type: 'PAYMENT_RECEIVED',
        read: true,
        userId: users[1]._id,
        createdAt: new Date()
      }
    ];
    
    await db.collection('notifications').insertMany(notifications);
    console.log('✅ Notifications created:', notifications.length);
    
    // 7. Create Posts
    console.log('📝 Creating posts...');
    const posts = [
      {
        _id: new ObjectId(),
        title: 'Building Scalable E-commerce Backends',
        caption: 'Sharing insights on building robust and scalable e-commerce backends using Node.js and microservices architecture.',
        isApproved: true,
        isPublic: true,
        authorId: users[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'The Art of Minimalist UI Design',
        caption: 'Exploring the principles of minimalist UI design and how it enhances user experience. Less is more!',
        isApproved: true,
        isPublic: true,
        authorId: users[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Content Marketing Trends 2024',
        caption: 'Latest trends in content marketing and how to leverage them for better engagement and ROI.',
        isApproved: true,
        isPublic: true,
        authorId: users[3]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('posts').insertMany(posts);
    console.log('✅ Posts created:', posts.length);
    
    // 8. Create Stories
    console.log('📸 Creating stories...');
    const stories = [
      {
        _id: new ObjectId(),
        content: '/placeholder-story/story-image-1.jpg',
        type: 'IMAGE',
        isApproved: true,
        isPublic: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        authorId: users[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        content: '/placeholder-story/story-video-1.mp4',
        type: 'VIDEO',
        isApproved: true,
        isPublic: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        authorId: users[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('stories').insertMany(stories);
    console.log('✅ Stories created:', stories.length);
    
    // 9. Create Prebookings
    console.log('📋 Creating prebookings...');
    const prebookings = [
      {
        _id: new ObjectId(),
        productId: 'website-package-1',
        productTitle: 'Website Development Package',
        userDetails: JSON.stringify({
          name: 'David Lee',
          email: 'david@example.com',
          phone: '+1234567890',
          message: 'Interested in the basic website package',
          requirements: 'Responsive design, SEO optimization'
        }),
        amount: 1.00,
        currency: 'INR',
        status: 'PAID',
        paymentId: 'pay_123456789',
        orderId: 'order_123456789',
        receipt: 'receipt_123456789',
        userId: users[0]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        productId: 'design-package-1',
        productTitle: 'Logo Design Package',
        userDetails: JSON.stringify({
          name: 'Emma Wilson',
          email: 'emma@example.com',
          phone: '+0987654321',
          message: 'Need logo design for my new business',
          brand: 'Tech startup in fintech'
        }),
        amount: 1.00,
        currency: 'INR',
        status: 'PENDING',
        userId: users[1]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        productId: 'marketing-package-1',
        productTitle: 'Digital Marketing Package',
        userDetails: JSON.stringify({
          name: 'Frank Miller',
          email: 'frank@example.com',
          phone: '+1122334455',
          message: 'Looking for comprehensive digital marketing strategy',
          industry: 'E-commerce'
        }),
        amount: 1.00,
        currency: 'INR',
        status: 'COMPLETED',
        paymentId: 'pay_987654321',
        orderId: 'order_987654321',
        receipt: 'receipt_987654321',
        userId: users[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('prebookings').insertMany(prebookings);
    console.log('✅ Prebookings created:', prebookings.length);
    
    // 10. Create Transactions
    console.log('💰 Creating transactions...');
    const transactions = [
      {
        _id: new ObjectId(),
        amount: 500.00,
        type: 'COIN_PURCHASE',
        status: 'COMPLETED',
        description: 'Purchased 500 coins for project bidding',
        userId: users[1]._id,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        amount: 100.00,
        type: 'MESSAGE_PURCHASE',
        status: 'PENDING',
        description: 'Purchased message credits for communication',
        userId: users[2]._id,
        createdAt: new Date()
      }
    ];
    
    await db.collection('transactions').insertMany(transactions);
    console.log('✅ Transactions created:', transactions.length);
    
    console.log('\n🎉 MongoDB database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length} (including admin)`);
    console.log(`- Projects: ${projects.length}`);
    console.log(`- Orders: ${orders.length}`);
    console.log(`- Reviews: ${reviews.length}`);
    console.log(`- Contact Submissions: ${contacts.length}`);
    console.log(`- Notifications: ${notifications.length}`);
    console.log(`- Posts: ${posts.length}`);
    console.log(`- Stories: ${stories.length}`);
    console.log(`- Prebookings: ${prebookings.length}`);
    console.log(`- Transactions: ${transactions.length}`);
    
    console.log('\n🚀 Your FreelanceHub MongoDB database is now ready for testing!');
    console.log('\n🔗 Test your application:');
    console.log('- Admin Dashboard: http://localhost:3000/admin/dashboard');
    console.log('- User Dashboard: http://localhost:3000/dashboard');
    console.log('- Contact Form: http://localhost:3000/contact');
    console.log('- Products: http://localhost:3000/products');
    
  } catch (error) {
    console.error('❌ Error seeding MongoDB database:', error);
    throw error;
  } finally {
    await client.close();
  }
}

seedMongoDB();
