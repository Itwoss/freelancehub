const { MongoClient } = require('mongodb');

async function testAtlasConnection() {
  console.log('🔍 Testing MongoDB Atlas connection...');
  
  // Get connection string from environment or prompt
  const connectionString = process.env.MONGODB_URI || process.argv[2];
  
  if (!connectionString) {
    console.log('❌ No connection string provided.');
    console.log('Usage: node test-atlas-connection.js "mongodb+srv://..."');
    console.log('Or set MONGODB_URI environment variable');
    process.exit(1);
  }
  
  if (!connectionString.includes('mongodb+srv://')) {
    console.log('❌ Invalid connection string. Must start with "mongodb+srv://"');
    process.exit(1);
  }
  
  const client = new MongoClient(connectionString);
  
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    const db = client.db('freelancehub');
    
    // Test basic operations
    console.log('🧪 Testing database operations...');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections found:', collections.length);
    
    if (collections.length > 0) {
      console.log('📋 Collection names:');
      collections.forEach(col => console.log(`  - ${col.name}`));
    }
    
    // Test insert/delete
    const testCollection = db.collection('atlas_test');
    const result = await testCollection.insertOne({
      message: 'MongoDB Atlas connection test',
      timestamp: new Date(),
      source: 'FreelanceHub'
    });
    console.log('✅ Test document inserted:', result.insertedId);
    
    // Clean up
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test document cleaned up');
    
    console.log('\n🎉 MongoDB Atlas connection test successful!');
    console.log('\n📋 Your FreelanceHub is ready to use with MongoDB Atlas!');
    console.log('\n🔗 Next steps:');
    console.log('1. Run: npx prisma db push');
    console.log('2. Run: node seed-mongodb-direct.js');
    console.log('3. Start your app: npm run dev');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.log('\n💡 Common solutions:');
    console.log('1. Check your connection string is correct');
    console.log('2. Verify your IP address is whitelisted in Atlas');
    console.log('3. Ensure your cluster is running (not paused)');
    console.log('4. Check your username and password');
    console.log('5. Verify network access settings');
  } finally {
    await client.close();
  }
}

testAtlasConnection();
