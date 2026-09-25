const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Meetup = require('./models/Meetup');
const Moment = require('./models/Moment');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    await User.deleteMany();
    await Meetup.deleteMany();
    await Moment.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@yappers.com',
      password: 'password123',
      role: 'admin'
    });

    const meetups = await Meetup.insertMany([
      { title: 'Morning Run', description: 'A 5k run.', category: 'Run', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', date: '2026-10-01', startTime: '06:00', capacity: 20 },
      { title: 'Tech Talk', description: 'Discussing the latest tech.', category: 'Talk', imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&q=80', date: '2026-10-15', startTime: '18:00', capacity: 50 }
    ]);

    const moments = await Moment.insertMany([
      { title: 'Lush Woods & Golden Hour', image: 'https://plus.unsplash.com/premium_photo-1784158021298-cfd7dbea8dba?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'WALK & TALK TRAIL', isPublished: true },
      { title: 'Treasure Hunt Squad Laughs', image: 'https://plus.unsplash.com/premium_photo-1734737431439-0519be91fb04?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWd8fHx8fA%3D%3D', category: 'SOCIAL QUESTS', isPublished: true },
      { title: 'Chai, Lights & Late Stories', image: 'https://plus.unsplash.com/premium_photo-1661439950418-ef187ac05264?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'CAFÉ CONVERSATIONS', isPublished: true }
    ]);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
