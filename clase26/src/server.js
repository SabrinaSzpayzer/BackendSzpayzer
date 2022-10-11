import express from 'express';
import handlebars from 'express-handlebars';
import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';
import config from './config.js';
import routes from './routes.js';
import controllersdb from './controllersdb.js';
import User from './models.js';
import faker from 'faker';
faker.locale = 'es';
import normalizr from 'normalizr';
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;
import util from 'util';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import passportlocal from 'passport-local';
const LocalStrategy = passportlocal.Strategy;
import bCrypt from 'bcrypt';

const { Router } = express;

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

// Routers

const routerProducts = new Router();
app.use('/productos', routerProducts);
routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handlebars

import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '../../public/views/layouts',
        partialsDir: __dirname + '../../public/views/partials'
    })
)

import ContenedorSQL from '../api/ContenedorSQL.js'

// api Chat

import Chat from '../api/Chat.js';
const historial = new Chat ('./DB/chat.txt')

// api Contenedor Productos

const product = new ContenedorSQL (config.mariaDb, 'productos');

// Productos

app.get('/api/productos-test', async (req, res) => {
    const allProducts = await product.popular()
    if (allProducts.length > 0) {
        res.render('main', {displayProduct: allProducts, listExists: true});
    } else {
        res.render('main', {listExists: false});
    }
})

// Router products

routerProducts.get('/', async (req, res) => {
    const allProducts = await product.getAll();
    if (allProducts.length > 0) {
        res.render('main', {displayProduct: allProducts, listExists: true});
    } else {
        res.render('main', {listExists: false});
    }
})

routerProducts.get('/:id', async (req, res) => {
    const { id } = req.params;
    const productById = await product.getById(id);
    res.send(productById);
})

routerProducts.post('/', async (req, res) => {
    const newProduct = req.body;
    const addProduct = await product.save(newProduct.title, newProduct.price, newProduct.thumbnail);
    res.json(addProduct);
})

routerProducts.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    const putProduct = await product.putById(id, updatedProduct.title, updatedProduct.price, updatedProduct.thumbnail);
    res.json(putProduct);
})

routerProducts.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deleteProductById = await product.deleteById(id);
    const allProducts = await product.getAll();
    if ( id > allProducts.length ) {
        res.send("Producto no encontrado");
    } else {
        res.send(deleteProductById);
    }
})

routerProducts.delete('/', async (req, res) => {
    const deleteAllProd = await product.deleteAll();
    res.send(deleteAllProd)
})

//--------------------------------------------
// NORMALIZACIÓN DE MENSAJES

// Definimos un esquema de autor

const schemaAuthor =  new schema.Entity('author',{},{idAttribute: 'email'});

// Definimos un esquema de mensaje

const messageSchema = new schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'text' })

// Definimos un esquema de posts

const postSchema = new schema.Entity('posts', { messages: [messageSchema] })

const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, postSchema)

//--------------------------------------------

async function listarMensajesNormalizados() {
    const messages = await historial.getAll();
    const normalizedData = normalizarMensajes({ id: 'messages', messages });
    // console.log(util.inspect(normalizedData, false, 12, true));
    return normalizedData
}

// socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');

    // Productos

    const allProducts = await product.getAll();

    socket.emit('productos', allProducts);
    
    socket.on('new-product', async newProduct => {
        await product.save(newProduct.title, newProduct.price, newProduct.thumbnail);
        allProducts.push(newProduct);
        io.sockets.emit('productos', allProducts);
    })

    // Mensajes Chat

    const messages = await historial.getAll();
    
    socket.emit('messages', await listarMensajesNormalizados());
    
    socket.on('new-message', async data => {
        messages.push(data);
        await historial.save(data);
        io.sockets.emit('messages', await listarMensajesNormalizados());
    })
})

// Sesiones

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
    (req, username, password, done) => {
        User.findOne({ 'username': username }, (err, user) => {
            if (err) {
                return done(err);
            };

            if (user) {
                return done(null, false);
            }

            const newUser = {
                username: username,
                password: createHash(password),
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            };

            User.create(newUser, (err, userWithId) => {
                if (err) {
                    return done(err);
                }
                return done(null, userWithId);
            })
        });
    }
));

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                return done(null, false);
            }

            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(session({
    store: MongoStore.create({ 
        mongoUrl: 'mongodb+srv://sabrinaszpayzer:UAWkfLB84UgJtqhL@cluster0.hn6ycnt.mongodb.net/sesiones?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: config.TIEMPO_EXPIRACION
    }
}));

app.use(passport.initialize());
app.use(passport.session());

//LOGIN
app.get('/login', routes.getLogin);
app.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin'
}), routes.postLogin);
app.get('/faillogin', routes.getFailLogin);

//SIGNUP
app.get('/signup', routes.getSignUp);
app.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/failsignup'
}), routes.postSignup);
app.get('/failsignup', routes.getFailsignup);

//Home
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.get('/', checkAuthentication, (req, res) => {
    const { user } = req;
    res.render('home', {nombre: user.firstName});
});

//LOGOUT
app.get('/logout', routes.getLogout);

// Views

app.set('view engine', 'hbs');
app.set('views', './public/views');

// Server

const PORT = 8080;

controllersdb(config.URL_BASE_DE_DATOS, err => {

    if (err) return console.log('error en conexión de base de datos', err);
    console.log('BASE DE DATOS CONECTADA');

    const connectedServer = httpServer.listen(PORT, () => {
        console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
    });
});