import express from 'express';
import handlebars from 'express-handlebars';
import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';
import config from './config.js';
import faker from 'faker';
faker.locale = 'es';
import normalizr from 'normalizr';
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;
import util from 'util';
import session from 'express-session';
import MongoStore from 'connect-mongo';

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

app.set('view engine', 'hbs');
app.set('views', './public/views');

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

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(session({
    store: MongoStore.create({ 
        mongoUrl: 'mongodb+srv://sabrinaszpayzer:UAWkfLB84UgJtqhL@cluster0.hn6ycnt.mongodb.net/sesiones?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.get('/login', (req,res) => {
    res.sendFile('login.html', { root: __dirname + "../../public"})
});

app.get('/logout', (req,res) => {
    const nombre = req.session.user
    req.session.destroy( err => {
        if(!err) {
            res.render('logout', {nombre: nombre})
        }
        else res.send({status: 'Logout ERROR', body: err})
    })
});

app.post('/login', (req,res) => {
    let { nombre } = req.body;
    req.session.user = nombre;
    res.redirect('/home');
});

function auth(req, res, next) {
    if (req.session?.user !== '') {
        return next();
    }
    return res.redirect('/login');
}

app.get('/home', auth, (req, res) => {
    const nombre = req.session.user
    if (req.session.user) {
        res.render('home', {nombre: nombre});
    } else {
        res.redirect('/login');
    }
})

// Server

const PORT = 8080;

const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})

connectedServer.on('error', error => console.log(`Error en servidor ${error}`))