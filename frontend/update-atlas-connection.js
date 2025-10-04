#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function updateAtlasConnection() {
  console.log('🚀 MongoDB Atlas Connection Setup for FreelanceHub\n');
  
  console.log('📋 Before we start, make sure you have:');
  console.log('1. Created a MongoDB Atlas account');
  console.log('2. Created a cluster (free tier is fine)');
  console.log('3. Set up database access with username/password');
  console.log('4. Configured network access (allow from anywhere for development)');
  console.log('5. Got your connection string from Atlas\n');
  
  rl.question('Enter your MongoDB Atlas connection string: ', async (connectionString) => {
    if (!connectionString || !connectionString.includes('mongodb+srv://')) {
      console.log('❌ Invalid connection string. Please make sure it starts with "mongodb+srv://"');
      rl.close();
      return;
    }
    
    try {
      // Read current .env.local file
      const envPath = path.join(__dirname, '.env.local');
      let envContent = '';
      
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }
      
      // Update or add MONGODB_URI
      const mongoDbUriRegex = /^MONGODB_URI=.*$/m;
      const newMongoDbUri = `MONGODB_URI=${connectionString}`;
      
      if (mongoDbUriRegex.test(envContent)) {
        // Replace existing MONGODB_URI
        envContent = envContent.replace(mongoDbUriRegex, newMongoDbUri);
        console.log('✅ Updated existing MONGODB_URI in .env.local');
      } else {
        // Add new MONGODB_URI
        envContent += `\n# MongoDB Atlas Connection\n${newMongoDbUri}\n`;
        console.log('✅ Added MONGODB_URI to .env.local');
      }
      
      // Write updated content
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Environment file updated successfully!\n');
      
      console.log('🔧 Next steps:');
      console.log('1. Test the connection: MONGODB_URI="' + connectionString + '" npx prisma db push');
      console.log('2. Seed the database: MONGODB_URI="' + connectionString + '" node seed-mongodb-direct.js');
      console.log('3. Start your app: npm run dev');
      
      console.log('\n🎉 Your FreelanceHub is now connected to MongoDB Atlas!');
      
    } catch (error) {
      console.error('❌ Error updating environment file:', error.message);
    } finally {
      rl.close();
    }
  });
}

updateAtlasConnection();
