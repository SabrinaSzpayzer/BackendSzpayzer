import express from 'express'
import handlebars from 'express-handlebars'
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import config from './config.js'

const { Router } = express;

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

// Routers

const routerProducts = new Router();
app.use('/productos', routerProducts);
routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }));
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
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials'
    })
)

app.set('view engine', 'hbs');
app.set('views', './views');

import ContenedorSQL from '../api/ContenedorSQL.js'

// api Chat

const historial = new ContenedorSQL (config.sqlite3, 'mensajes');

// api Contenedor Productos

const product = new ContenedorSQL (config.mariaDb, 'productos');

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

// socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');

    // Mensajes Chat

    const messages = await historial.getAll();
    
    socket.emit('messages', messages);
    
    socket.on('new-message', data => {
        messages.push(data);
        historial.saveMsg(data);
        io.sockets.emit('messages', messages);
    })
    
    // Productos

    const allProducts = await product.getAll();
    
    socket.emit('productos', allProducts);
    
    socket.on('new-product', async newProduct => {
        await product.save(newProduct.title, newProduct.price, newProduct.thumbnail);
        allProducts.push(newProduct);
        io.sockets.emit('productos', allProducts);
    })

})

// Server

const PORT = 8080;

const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})

connectedServer.on('error', error => console.log(`Error en servidor ${error}`))