// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleWare');

// Rutas públicas
router.get('/', movieController.getAllMovies);

// Rutas de administración (requieren autenticación y rol de administrador)
router.get('/add', isAuthenticated, isAdmin, movieController.getAddMovieForm);
router.post('/add', isAuthenticated, isAdmin, movieController.addMovie);

// Rutas con parámetros (deben ir después de las rutas específicas)
router.get('/:id', movieController.getMovieDetails);
router.get('/:id/edit', isAuthenticated, isAdmin, movieController.getEditMovieForm);
router.put('/:id', isAuthenticated, isAdmin, movieController.updateMovie);
router.delete('/:id', isAuthenticated, isAdmin, movieController.deleteMovie);

module.exports = router;