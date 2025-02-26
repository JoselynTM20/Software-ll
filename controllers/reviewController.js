const Review = require('../models/reviewModel');

// Eliminar una reseña
exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReview = await Review.findByIdAndDelete(id);
        if (!deletedReview) {
            return res.status(404).send('Reseña no encontrada');
        }
        res.redirect('/movies');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la reseña');
    }
};