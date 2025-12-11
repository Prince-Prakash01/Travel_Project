require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dreamroute')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const addMoreListings = async () => {
    try {
        const newListings = [
            // More Hotels
            {
                title: 'Grand Hotel New York',
                description: 'Experience luxury in the heart of Manhattan with stunning city views, world-class dining, and premium amenities.',
                type: 'hotel',
                location: { city: 'New York', country: 'USA' },
                price: 350,
                amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service'],
                rating: 4.8,
                images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                hotelDetails: {
                    starRating: 5,
                    propertyType: 'hotel',
                    totalRooms: 200
                }
            },
            {
                title: 'Boutique Hotel Barcelona',
                description: 'Charming boutique hotel in the Gothic Quarter with authentic Catalan architecture and modern comforts.',
                type: 'hotel',
                location: { city: 'Barcelona', country: 'Spain' },
                price: 180,
                amenities: ['WiFi', 'Rooftop Terrace', 'Bar', 'Breakfast Included'],
                rating: 4.6,
                images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                hotelDetails: {
                    starRating: 4,
                    propertyType: 'hotel',
                    totalRooms: 50
                }
            },
            {
                title: 'Luxury Resort Maldives',
                description: 'Overwater villas with private pools, pristine beaches, and world-class diving experiences.',
                type: 'hotel',
                location: { city: 'Malé', country: 'Maldives' },
                price: 650,
                amenities: ['WiFi', 'Private Pool', 'Beach Access', 'Spa', 'Water Sports', 'Fine Dining'],
                rating: 4.9,
                images: ['https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                hotelDetails: {
                    starRating: 5,
                    propertyType: 'resort',
                    totalRooms: 100
                }
            },
            {
                title: 'Historic Hotel Rome',
                description: 'Stay in a beautifully restored 18th-century palazzo near the Colosseum and Roman Forum.',
                type: 'hotel',
                location: { city: 'Rome', country: 'Italy' },
                price: 220,
                amenities: ['WiFi', 'Restaurant', 'Bar', 'Concierge', 'Garden'],
                rating: 4.7,
                images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                hotelDetails: {
                    starRating: 4,
                    propertyType: 'hotel',
                    totalRooms: 75
                }
            },
            {
                title: 'Modern Hotel Dubai',
                description: 'Ultra-modern hotel with panoramic views of the Burj Khalifa and Dubai Marina.',
                type: 'hotel',
                location: { city: 'Dubai', country: 'UAE' },
                price: 400,
                amenities: ['WiFi', 'Infinity Pool', 'Spa', 'Gym', 'Multiple Restaurants', 'Valet Parking'],
                rating: 4.8,
                images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                hotelDetails: {
                    starRating: 5,
                    propertyType: 'hotel',
                    totalRooms: 300
                }
            },
            {
                title: 'Safari Lodge Kenya',
                description: 'Luxury tented camp in the heart of the Maasai Mara with incredible wildlife viewing.',
                type: 'hotel',
                location: { city: 'Maasai Mara', country: 'Kenya' },
                price: 450,
                amenities: ['WiFi', 'Game Drives', 'All-Inclusive', 'Pool', 'Spa'],
                rating: 4.9,
                images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                hotelDetails: {
                    starRating: 5,
                    propertyType: 'resort',
                    totalRooms: 30
                }
            },
            {
                title: 'Ski Resort Switzerland',
                description: 'Alpine luxury resort with ski-in/ski-out access and breathtaking mountain views.',
                type: 'hotel',
                location: { city: 'Zermatt', country: 'Switzerland' },
                price: 380,
                amenities: ['WiFi', 'Ski Storage', 'Spa', 'Restaurant', 'Bar', 'Heated Pool'],
                rating: 4.8,
                images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                hotelDetails: {
                    starRating: 5,
                    propertyType: 'resort',
                    totalRooms: 120
                }
            },
            {
                title: 'Ryokan Traditional Inn Kyoto',
                description: 'Authentic Japanese ryokan with tatami rooms, onsen baths, and kaiseki cuisine.',
                type: 'hotel',
                location: { city: 'Kyoto', country: 'Japan' },
                price: 280,
                amenities: ['WiFi', 'Hot Spring Bath', 'Traditional Meals', 'Garden', 'Tea Ceremony'],
                rating: 4.9,
                images: ['https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                hotelDetails: {
                    starRating: 4,
                    propertyType: 'guesthouse',
                    totalRooms: 15
                }
            },

            // More Tour Packages
            {
                title: 'European Grand Tour',
                description: '14-day journey through Paris, Rome, Barcelona, and Amsterdam. Experience the best of European culture, cuisine, and history.',
                type: 'package',
                location: { city: 'Multiple', country: 'Europe' },
                price: 2800,
                amenities: ['Guided Tours', 'All Meals', 'Transport', 'Accommodation', 'Museum Tickets'],
                rating: 4.9,
                images: ['https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                activityDetails: {
                    duration: '14 days',
                    difficulty: 'easy',
                    category: 'Cultural',
                    groupSize: 20,
                    includes: ['Accommodation', 'All Meals', 'Guided Tours', 'Transport', 'Museum Entries']
                }
            },
            {
                title: 'Southeast Asia Adventure',
                description: '21-day exploration of Thailand, Vietnam, Cambodia, and Laos. Temples, beaches, and authentic local experiences.',
                type: 'package',
                location: { city: 'Multiple', country: 'Southeast Asia' },
                price: 2200,
                amenities: ['Guided Tours', 'Meals', 'Transport', 'Accommodation', 'Activities'],
                rating: 4.8,
                images: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                activityDetails: {
                    duration: '21 days',
                    difficulty: 'moderate',
                    category: 'Adventure',
                    groupSize: 15,
                    includes: ['Accommodation', 'Most Meals', 'Guided Tours', 'Transport', 'Temple Entries']
                }
            },
            {
                title: 'Australian Outback Experience',
                description: '10-day adventure through Sydney, Uluru, and the Great Barrier Reef. Wildlife, nature, and iconic landmarks.',
                type: 'package',
                location: { city: 'Multiple', country: 'Australia' },
                price: 3500,
                amenities: ['Guided Tours', 'All Meals', 'Transport', 'Accommodation', 'Activities'],
                rating: 4.9,
                images: ['https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                activityDetails: {
                    duration: '10 days',
                    difficulty: 'moderate',
                    category: 'Nature & Wildlife',
                    groupSize: 12,
                    includes: ['Accommodation', 'All Meals', 'Guided Tours', 'Transport', 'Snorkeling Equipment']
                }
            },
            {
                title: 'South American Discovery',
                description: '18-day journey through Peru, Bolivia, and Chile. Machu Picchu, Uyuni Salt Flats, and Atacama Desert.',
                type: 'package',
                location: { city: 'Multiple', country: 'South America' },
                price: 3200,
                amenities: ['Guided Tours', 'Meals', 'Transport', 'Accommodation', 'Trekking Gear'],
                rating: 4.8,
                images: ['https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                activityDetails: {
                    duration: '18 days',
                    difficulty: 'moderate',
                    category: 'Adventure',
                    groupSize: 16,
                    includes: ['Accommodation', 'Most Meals', 'Guided Tours', 'Transport', 'Entry Fees']
                }
            },
            {
                title: 'African Safari Explorer',
                description: '12-day safari through Kenya and Tanzania. Witness the Great Migration and Big Five in their natural habitat.',
                type: 'package',
                location: { city: 'Multiple', country: 'East Africa' },
                price: 4200,
                amenities: ['Guided Tours', 'All Meals', 'Transport', 'Luxury Lodges', 'Game Drives'],
                rating: 5.0,
                images: ['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                activityDetails: {
                    duration: '12 days',
                    difficulty: 'easy',
                    category: 'Wildlife Safari',
                    groupSize: 8,
                    includes: ['Luxury Accommodation', 'All Meals', 'Game Drives', 'Transport', 'Park Fees']
                }
            },
            {
                title: 'Northern Lights Iceland',
                description: '7-day winter adventure in Iceland. Northern Lights, ice caves, hot springs, and glacier hiking.',
                type: 'package',
                location: { city: 'Reykjavik', country: 'Iceland' },
                price: 2600,
                amenities: ['Guided Tours', 'Meals', 'Transport', 'Accommodation', 'Winter Gear'],
                rating: 4.9,
                images: ['https://images.unsplash.com/photo-1483347756197-71ef80e95f73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                activityDetails: {
                    duration: '7 days',
                    difficulty: 'moderate',
                    category: 'Nature & Adventure',
                    groupSize: 10,
                    includes: ['Accommodation', 'Some Meals', 'Guided Tours', 'Transport', 'Winter Equipment']
                }
            },
            {
                title: 'Japan Cultural Journey',
                description: '12-day immersive experience through Tokyo, Kyoto, Osaka, and Hiroshima. Temples, gardens, and traditional culture.',
                type: 'package',
                location: { city: 'Multiple', country: 'Japan' },
                price: 3400,
                amenities: ['Guided Tours', 'Meals', 'Transport', 'Accommodation', 'Cultural Activities'],
                rating: 4.9,
                images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                activityDetails: {
                    duration: '12 days',
                    difficulty: 'easy',
                    category: 'Cultural',
                    groupSize: 14,
                    includes: ['Accommodation', 'Most Meals', 'Guided Tours', 'JR Pass', 'Temple Entries']
                }
            },
            {
                title: 'Caribbean Island Hopping',
                description: '10-day tropical paradise tour through Jamaica, Barbados, and St. Lucia. Beaches, water sports, and island culture.',
                type: 'package',
                location: { city: 'Multiple', country: 'Caribbean' },
                price: 2900,
                amenities: ['Guided Tours', 'All Meals', 'Transport', 'Beach Resorts', 'Water Activities'],
                rating: 4.7,
                images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'],
                activityDetails: {
                    duration: '10 days',
                    difficulty: 'easy',
                    category: 'Beach & Relaxation',
                    groupSize: 18,
                    includes: ['Resort Accommodation', 'All Meals', 'Island Tours', 'Boat Transfers', 'Snorkeling']
                }
            }
        ];

        const created = await Listing.insertMany(newListings);
        console.log(`✅ Successfully added ${created.length} new listings!`);
        console.log(`   - Hotels: ${created.filter(l => l.type === 'hotel').length}`);
        console.log(`   - Tour Packages: ${created.filter(l => l.type === 'package').length}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding listings:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation Error [${key}]:`, error.errors[key].message);
            });
        }
        process.exit(1);
    }
};

addMoreListings();
