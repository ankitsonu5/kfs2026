const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
    param: {
        type: String,
        required: false, // For future use if we want to link the banner to a category or product
    },
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
