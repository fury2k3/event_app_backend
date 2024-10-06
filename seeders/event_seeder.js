const mongoose = require('mongoose');
const Event = require('../models/event');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv').config();


// List of event names and locations
const eventNames = [
    'Festival of Lights', 'Sousse Music Gala', 'Sfax Art Exhibition', 'Monastir Cultural Festival',
    'Carthage Jazz Festival', 'Tunisian Food Fair', 'Mediterranean Dance Extravaganza', 'Ancient History Conference',
    'Sousse International Film Festival', 'Tunisian Poetry Night', 'Sfax Fashion Show', 'Monastir Science Expo',
    'Tunisian Craftsmanship Exhibition', 'Sousse Beach Party', 'Tunisian Traditional Music Concert', 'Monastir Literary Meetup',
    'Sfax Culinary Workshop', 'Carthage Archaeological Symposium', 'Sousse Wine Tasting Event', 'Tunisian Heritage Parade',
    'Monastir Jazz Jam', 'Sfax Eco-Friendly Market', 'Tunisian Art and Culture Gala', 'Sousse Youth Festival',
    'Tunisian Historical Play', 'Monastir Contemporary Art Showcase', 'Sfax Music and Dance Festival', 'Tunisian Architecture Exhibit',
    'Carthage Literary Festival', 'Sousse Carnival', 'Tunisian Theatre Night', 'Monastir Folk Music Celebration',
    'Sfax Tech Innovation Fair', 'Tunisian Visual Arts Exhibition', 'Sousse International Cuisine Day', 'Monastir Urban Art Event',
    'Sfax Maritime Festival', 'Tunisian Musical Theater Performance', 'Carthage Film Premiere', 'Sousse Vintage Market',
    'Tunisian Jewelry Exhibition', 'Monastir Wellness Retreat'
];

// List of locations
const locations = ['Tunis', 'Sousse', 'Sfax', 'Monastir'];

const eventCovers = ['events_1.jpg', 'events_2.png', 'events_3.png'];

// Generate random events
const generateRandomEvents = (num) => {
    const events = [];
    for (let i = 0; i < num; i++) {
        const eventName = faker.helpers.arrayElement(eventNames);
        const location = faker.helpers.arrayElement(locations);
        const eventDate = faker.date.between('2024-09-04', '2024-12-31');
        const price = parseFloat(faker.commerce.price(20, 100));
        const availableTickets = faker.number.int({ min: 25, max: 200 });
        const description = faker.lorem.sentence();

        events.push({
            user: '66c60047b6f939f2297afb89',
            name: eventName,
            date: eventDate,
            location: location,
            price: price,
            availableTickets: availableTickets,
            description: description,
            eventCover: faker.helpers.arrayElement(eventCovers)
        });
    }
    return events;
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,).then(
    async () => {
        console.log('Connected to MongoDB');
        await Event.deleteMany();
        console.log('Existing events removed');
        const events = generateRandomEvents(40);
        await Event.insertMany(events);
        console.log('Events seeded successfully');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        mongoose.disconnect();
    });

