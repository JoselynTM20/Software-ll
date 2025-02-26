const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    genre: { type: String, required: true },
    synopsis: { type: String, required: true },
    duration: { type: Number, required: true },
    coverImage: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;