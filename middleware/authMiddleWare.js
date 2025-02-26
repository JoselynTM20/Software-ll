// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'administrador') {
        next();
    } else {
        res.status(403).send('Acceso denegado'); // O redirige a una página de error
    }
};

// Exportar ambos middlewares
module.exports = { isAuthenticated, isAdmin };