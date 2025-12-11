require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Listing = require('./models/Listing');
const SafetyData = require('./models/SafetyData');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dreamroute')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        await User.deleteMany({});
        await Listing.deleteMany({});
        await SafetyData.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 12);
        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: hashedPassword
        });

        const listings = await Listing.create([
            {
                title: 'Luxury Hotel Paris',
                description: 'Experience the best of Paris in this luxury hotel.',
                type: 'hotel',
                location: { city: 'Paris', country: 'France' },
                price: 250,
                amenities: ['WiFi', 'Pool', 'Spa'],
                rating: 4.8,
                images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80']
            },
            {
                title: 'Cozy Apartment Tokyo',
                description: 'A cozy apartment in the heart of Tokyo.',
                type: 'hotel',
                location: { city: 'Tokyo', country: 'Japan' },
                price: 120,
                amenities: ['WiFi', 'Kitchen'],
                rating: 4.5,
                images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80']
            },
            {
                title: 'Beach Resort Bali',
                description: 'Relax by the beach in Bali.',
                type: 'hotel',
                location: { city: 'Bali', country: 'Indonesia' },
                price: 180,
                amenities: ['WiFi', 'Pool', 'Beach Access'],
                rating: 4.7,
                images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80']
            },
            {
                title: 'Asia Tour Package',
                description: 'A complete tour of the best spots in Asia.',
                type: 'package',
                location: { city: 'Multiple', country: 'Asia' },
                price: 1500,
                amenities: ['Guided Tours', 'Meals', 'Transport'],
                rating: 4.9,
                images: ['https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80']
            }
        ]);

        await SafetyData.create([
            {
                location: { city: 'Paris', country: 'France' },
                crimeRate: 40, // Lower is better? No, prompt said "40% local police data (crime rate)". Let's assume 0-100 score where 100 is best.
                // Actually, let's assume the prompt meant "Safety Score calculation uses 40% weight of crime rate".
                // And let's assume the stored values are "Safety Scores" for that category (0-100, 100=Safe).
                crimeRate: 70,
                nightlifeSafety: 80,
                transportAvailability: 90
            },
            {
                location: { city: 'Tokyo', country: 'Japan' },
                crimeRate: 95,
                nightlifeSafety: 90,
                transportAvailability: 95
            },
            {
                location: { city: 'Bali', country: 'Indonesia' },
                crimeRate: 80,
                nightlifeSafety: 70,
                transportAvailability: 60
            }
        ]);

        console.log('Data Seeded');
        process.exit();
    } catch (error) {
        console.error('Seed Error:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation Error [${key}]:`, error.errors[key].message);
            });
        }
        process.exit(1);
    }
};

seedData();
