import express, { query } from 'express';
import handlebars from 'express-handlebars';
import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';
import config from './config.js';
import { routerProducts } from './routes.js';
import controllersdb from './controllersdb.js';
import faker from 'faker';
faker.locale = 'es';
import normalizr from 'normalizr';
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;
import util from 'util';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
dotenv.config();
import minimist from 'minimist';
import { fork } from 'child_process';
import cluster from 'cluster';
import os from 'os';
const numCpu = os.cpus().length;
import compression from 'compression';
import logger from './logger.js';
import passport from './passport.js';
import pagesController from './controllers/pagesController.js';

//const { Router } = express;

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

// Routers

// const routerProducts = new Router();
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

import ContenedorSQL from './repositories/ContenedorSQL.js'

// api Chat

import Chat from './repositories/Chat.js';
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

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const mongourl = process.env.MONGOURL;

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
app.get('/login', pagesController.getLogin);
app.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin'
}), pagesController.postLogin);
app.get('/faillogin', pagesController.getFailLogin);

//SIGNUP
app.get('/signup', pagesController.getSignUp);
app.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/failsignup'
}), pagesController.postSignup);
app.get('/failsignup', pagesController.getFailsignup);

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
app.get('/logout', pagesController.getLogout);

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
    controllersdb(config.URL_BASE_DE_DATOS, err => {
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
    controllersdb(config.URL_BASE_DE_DATOS, err => {
        if (err) return console.log('error en conexión de base de datos', err);
        logger.info('BASE DE DATOS CONECTADA');
    
        const connectedServer = httpServer.listen(minimist(process.argv.slice(2), options), () => {
            logger.info(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
        });
    });
}