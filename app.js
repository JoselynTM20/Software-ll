const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const movieRouter = require('./routes/movieRoutes'); // Nuevo: Rutas de películas
const reviewRouter = require('./routes/reviewRoutes'); // Nuevo: Rutas de reseñas
const dashboardRouter = require('./routes/dashboardRoutes'); // Nuevo: Rutas del dashboard
const { isAuthenticated, isAdmin } = require('./middleware/authMiddleWare'); // Nuevo: Middleware de administrador

dotenv.config();

const app = express();
const port = 3002;

// Configuración de express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Middleware para pasar el usuario a todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayout);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'css')));
app.use(methodOverride('_method'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGOD_URI)
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch((error) => console.error("Error al conectar a MongoDB Atlas: ", error));

// Rutas públicas (no requieren autenticación)
app.use('/auth', authRouter);

// Redirigir la ruta principal al login si no está autenticado
app.get('/', (req, res) => {
    if (!req.session.user) {
        res.redirect('/auth/login');
    } else {
        res.render('index', { title: 'Bienvenido' });
    }
});

// Rutas protegidas (requieren autenticación)
app.use('/users', isAuthenticated, userRouter);

// Nuevo: Rutas de películas (protegidas y solo para administradores)
app.use('/movies', isAuthenticated, isAdmin, movieRouter);

// Nuevo: Rutas de reseñas (protegidas y solo para administradores)
app.use('/reviews', isAuthenticated, isAdmin, reviewRouter);

// Nuevo: Rutas del dashboard (protegidas y solo para administradores)
app.use('/dashboard', isAuthenticated, isAdmin, dashboardRouter);

// En lugar de usar una vista 404, simplemente redirigimos al login
app.use((req, res) => {
    res.redirect('/auth/login');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});