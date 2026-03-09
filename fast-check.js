const mongoose = require('mongoose');
const mongoUri = "mongodb://127.0.0.1:27017/kfs2026";

async function check() {
    try {
        console.log('Connecting to:', mongoUri);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected.');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const categories = await mongoose.connection.db.collection('categories').find({}).toArray();
        console.log('Categories found:', categories.length);
        categories.forEach(c => console.log(' -', c.name));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}
check();
