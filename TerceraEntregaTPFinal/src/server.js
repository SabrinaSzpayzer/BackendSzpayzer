import express, { query } from 'express';
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
import dotenv from 'dotenv';
dotenv.config();
import minimist from 'minimist';
import { fork } from 'child_process';
import cluster from 'cluster';
import os from 'os';
const numCpu = os.cpus().length;
import compression from 'compression';
import logger from './logger.js'

const { Router } = express;

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

// Routers

const routerProducts = new Router();
const routerCarritos = new Router();

app.use('/productos', routerProducts);
app.use('/carritos', routerCarritos);

routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }));

routerCarritos.use(express.json());
routerCarritos.use(express.urlencoded({ extended: true }));

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

// api Chat

import Chat from '../api/Chat.js';
const historial = new Chat ('./DB/chat.txt');

// api Contenedor Productos y Carrito

import {
    productosDao as product,
    carritosDao as carrito
} from '../api/daos/index.js'

// Router products

routerProducts.get('/', async (req, res) => {
    const allProducts = await product.getAll();
    if (allProducts.length > 0) {
        res.json(allProducts);
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
    const addProduct = await product.saveProduct(newProduct.code, newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.stock);
    res.json(addProduct);
})

routerProducts.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    const putProduct = await product.putProductById(updatedProduct.code, updatedProduct.title, updatedProduct.description, updatedProduct.price, updatedProduct.thumbnail, updatedProduct.stock, id);
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

// Router Carritos

routerCarritos.get('/', async (req, res) => {
    const allCarritos = await carrito.getAll();
    if (allCarritos.length > 0) {
        res.json(allCarritos);
    } else {
        res.send("Carritos no encontrados");
    }
})

routerCarritos.get('/:id/productos', async (req, res) => {
    const { id } = req.params;
    const allCarritos = await carrito.getAll();
    const carritoById = await carrito.getById(id);
    const productosIdCarrito = carritoById.productos;
    if ( id > allCarritos.length ) {
        res.send("Carrito no encontrado");
    } else {
        res.send(productosIdCarrito);
    }
})

routerCarritos.post('/', async (req, res) => {
    const productos = req.body;
    const addCarrito = await carrito.saveCarrito(productos);
    res.json(addCarrito);
})

routerCarritos.post('/:id/productos', async (req, res) => {
    const { id } = req.params;   
    const newProductId = req.body;
    const allProducts = await product.getAll();
    let newProduct = allProducts.filter(prods => prods._id == newProductId._id)
    newProduct = newProduct[0]
    const timestampNow = Date.now()
    await carrito.updateCarrito(id, {code: newProduct.code, title: newProduct.title, description: newProduct.description, price: newProduct.price, thumbnail: newProduct.thumbnail, stock: newProduct.stock, _id: newProductId._id, timestamp: timestampNow})
    res.send("Producto agregado al carrito");
})

routerCarritos.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deleteCarritoById = await carrito.deleteById(id);
    const allCarritos = await carrito.getAll();
    if ( id > allCarritos.length ) {
        res.send("Carrito no encontrado");
    } else {
        res.send(deleteCarritoById);
    }
})

routerCarritos.delete('/:id/productos/:id_Prod', async (req, res) => {
    const { id, id_Prod } = req.params;
    const deleteProd = await carrito.deleteProdCarrito(id, id_Prod);
    res.send(deleteProd);
})

routerCarritos.get('/prueba', async (req, res) => {
    res.sendFile('carrito.html', { root: __dirname + "../../public"});
});


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
        await product.saveProduct(newProduct.code, newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.stock);
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

const mongourl = config.mongodb.cnxStr;

app.use(session({
    store: MongoStore.create({ 
        mongoUrl: mongourl,
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

//INFO
app.get('/info', compression(), (req, res) => {
    const argumentos = process.argv.slice(2);
    const plataforma = process.platform;
    const versionNode = process.version;
    const memoria = process.memoryUsage().rss;
    const path = process.execPath;
    const proceso = process.pid;
    const directorio = process.cwd();
    res.render('info', {argumentos: argumentos, plataforma: plataforma, versionNode: versionNode, memoria: memoria, path: path, proceso: proceso, directorio: directorio, numCpu: numCpu});
});


// Views

app.set('view engine', 'hbs');
app.set('views', './public/views');

// Server

const options = {
    default: {port: 8080, mode: 'FORK'},
    alias: {p: "port", m: "mode"}
}

if ((minimist(process.argv.slice(2), options).mode == 'CLUSTER') && cluster.isPrimary) {
    controllersdb(config.mongodb.cnxStr, err => {
        if (err) return console.log('error en conexión de base de datos', err);
        console.log('BASE DE DATOS CONECTADA');
    });

    logger.info(`Número de procesadores ${numCpu}`);
    logger.info(`PID MASTER ${process.pid}`);

    for (let i = 0; i < numCpu; i++) {
        cluster.fork();
    };

    cluster.on('exit', (worker, code, signal) => {
        logger.info(`Work ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    controllersdb(config.mongodb.cnxStr, err => {
        if (err) return console.log('error en conexión de base de datos', err);
        logger.info('BASE DE DATOS CONECTADA');
    
        const connectedServer = httpServer.listen(minimist(process.argv.slice(2), options), () => {
            logger.info(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
        });
    });
}