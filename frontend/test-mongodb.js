const { MongoClient } = require('mongodb');

async function testMongoDB() {
  console.log('🔍 Testing MongoDB connection...');
  
  const uri = 'mongodb://localhost:27017/freelancehub';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db('freelancehub');
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections found:', collections.length);
    
    if (collections.length > 0) {
      console.log('📋 Collection names:');
      collections.forEach(col => console.log(`  - ${col.name}`));
    }
    
    // Test inserting a simple document
    const testCollection = db.collection('test');
    const result = await testCollection.insertOne({
      message: 'MongoDB connection test',
      timestamp: new Date()
    });
    console.log('✅ Test document inserted:', result.insertedId);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test document cleaned up');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Solutions:');
    console.log('1. Make sure MongoDB is running: brew services start mongodb/brew/mongodb-community');
    console.log('2. Try MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    console.log('3. Check MongoDB logs for errors');
  } finally {
    await client.close();
  }
}

testMongoDB();
