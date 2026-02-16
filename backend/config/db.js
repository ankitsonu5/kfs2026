const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB connected");
    } catch (error) {
        console.log("Error: ", error.message);
    }
}

module.exports = connectDB;