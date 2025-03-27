// controllers/movieController.js
const Movie = require('../models/movieModel');
const Review = require('../models/reviewModel');
const Favorite = require('../models/favoriteModel');

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render('movies/index', { title: 'Lista de Películas', movies, user: req.session.user || null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la lista de películas');
    }
};

exports.getAddMovieForm = (req, res) => {
    if (!req.session.user || req.session.user.role !== 'administrador') {
        return res.redirect('/');
    }
    res.render('movies/add', { title: 'Agregar Nueva Película', user: req.session.user || null });
};

exports.addMovie = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'administrador') {
            return res.redirect('/');
        }

        // Validar que todos los campos requeridos estén presentes
        const requiredFields = ['title', 'director', 'releaseYear', 'genre', 'synopsis', 'duration', 'coverImage'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.render('movies/add', {
                title: 'Agregar Nueva Película',
                user: req.session.user,
                error: `Faltan campos requeridos: ${missingFields.join(', ')}`,
                formData: req.body // Mantener los datos del formulario
            });
        }

        const movie = new Movie(req.body);
        await movie.save();
        res.redirect('/movies');
    } catch (error) {
        console.error('Error al agregar película:', error);
        res.render('movies/add', {
            title: 'Agregar Nueva Película',
            user: req.session.user,
            error: 'Error al agregar la película. Por favor, verifica los datos e intenta nuevamente.',
            formData: req.body // Mantener los datos del formulario
        });
    }
};

exports.getMovieDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await Movie.findById(id).populate('reviews').exec();
        if (!movie) {
            return res.status(404).send('Película no encontrada');
        }

        let isFavorite = false;
        if (req.session.user) {
            const favorite = await Favorite.findOne({ user: req.session.user.id, movie: id });
            isFavorite = !!favorite;
        }

        res.render('movieDetails', { title: movie.title, movie, isFavorite, user: req.session.user || null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los detalles de la película');
    }
};

exports.getEditMovieForm = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Película no encontrada');
        }
        res.render('movies/edit', { title: 'Editar Película', movie, user: req.session.user || null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el formulario de edición');
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) {
            return res.status(404).send('Película no encontrada');
        }
        res.redirect(`/movies/${movie._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la película');
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).send('Película no encontrada');
        }
        res.redirect('/movies');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la película');
    }
};