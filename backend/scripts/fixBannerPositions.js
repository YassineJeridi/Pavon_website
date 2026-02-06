// Fix invalid banner positions
const mongoose = require('mongoose');
const Banner = require('../models/Banner');

const fixBannerPositions = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/elegance');
        // Find all banners with invalid positions
        const bannersToFix = await Banner.find({
            position: { $nin: ['hero', 'promotional', 'category', 'footer'] }
        });

        console.log(`Found ${bannersToFix.length} banners with invalid positions`);

        // Update each banner directly using MongoDB native driver to bypass validation
        for (const banner of bannersToFix) {
            console.log(`Fixing banner "${banner.title}" with position "${banner.position}"`);

            await Banner.collection.updateOne(
                { _id: banner._id },
                { $set: { position: 'hero' } }
            );
        }

        console.log('✅ All banners fixed!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

fixBannerPositions();
