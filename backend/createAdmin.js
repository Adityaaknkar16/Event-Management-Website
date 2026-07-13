require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management');
    console.log('MongoDB Connected successfully.');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'adminpassword123';

    // Check if user already exists
    let user = await User.findOne({ email: adminEmail });

    if (user) {
      console.log(`User ${adminEmail} already exists. Updating role to admin...`);
      user.role = 'admin';
      // Trigger pre-save hook to hash password if we want to reset it
      user.password = adminPassword;
      await user.save();
      console.log('User role updated to admin successfully.');
    } else {
      console.log(`Creating new admin user: ${adminEmail}...`);
      user = await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Admin user created successfully.');
    }

    console.log('----------------------------------------');
    console.log('ADMIN LOGIN CREDENTIALS:');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('----------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
