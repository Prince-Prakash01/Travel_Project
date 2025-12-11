require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dreamroute');
        console.log('MongoDB Connected');

        const users = await User.find({}).select('-password');
        console.log('\n=== All Users in Database ===');
        console.log(`Total users: ${users.length}\n`);

        users.forEach((user, index) => {
            console.log(`User ${index + 1}:`);
            console.log(`  Name: ${user.name}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Created: ${user.createdAt}`);
            console.log(`  Verified: ${user.isVerified}`);
            console.log('---');
        });

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();
