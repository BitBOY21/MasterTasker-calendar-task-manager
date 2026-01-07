const app = require('./src/app');
const seedData = require('./src/utils/seedData');

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    
    // Run the seeder on startup
    try {
        await seedData();
    } catch (error) {
        console.error('Seeding failed:', error);
    }
});