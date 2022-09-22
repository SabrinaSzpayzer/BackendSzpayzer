import express from 'express';
import path from 'path';
import url from 'url';
import config from './config.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Router } = express;

const app = express();

// Persistencia

import {
    productosDao as product,
    carritosDao as carrito
} from './daos/index.js'

// Router

const routerProducts = new Router();
const routerCarritos = new Router();

routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }));

routerCarritos.use(express.json());
routerCarritos.use(express.urlencoded({ extended: true }));

// Permisos de administrador

const esAdmin = true

function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else {
        error.descripcion = 'no autorizado'
    }
    return error
}

function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin())
    } else {
        next()
    }
}

// Router productos

routerProducts.get('/', async (req, res) => {
    const allProducts = await product.getAll();
    if (allProducts.length > 0) {
        res.json(allProducts);
    } else {
        res.send("Productos no encontrados");
    }
})

routerProducts.get('/:id', async (req, res) => {
    const { id } = req.params;
    const allProducts = await product.getAll();
    const productById = await product.getById(id);
    
    if ( id > allProducts.length ) {
        res.send("Producto no encontrado");
    } else {
        res.send(productById);
    }
})

routerProducts.post('/', soloAdmins, async (req, res) => {
    const newProduct = req.body;
    const addProduct = await product.saveProduct(newProduct.code, newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.stock);
    res.json(addProduct);
})

routerProducts.put('/:id', soloAdmins, async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    const putProduct = await product.putProductById(updatedProduct.code, updatedProduct.title, updatedProduct.description, updatedProduct.price, updatedProduct.thumbnail, updatedProduct.stock, id);
    res.json(putProduct);
})

routerProducts.delete('/:id', soloAdmins, async (req, res) => {
    const { id } = req.params;
    const deleteProductById = await product.deleteById(id);
    const allProducts = await product.getAll();
    if ( id > allProducts.length ) {
        res.send("Producto no encontrado");
    } else {
        res.send(deleteProductById);
    }
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
    if ( config.selectedDB == 'json') {
        const { id } = req.params;   
        const carritoById = await carrito.getById(id);   
        const arrayProdCarrito = carritoById.productos;
        const newProductId = req.body;
        const newProduct = await product.getById(newProductId.id);
        arrayProdCarrito.push(newProduct);  
        const carritos = await carrito.getAll()
        const carritoPos = id - 1
        const timestampNow = Date.now()
        carritos[carritoPos] = {id: id, timestamp: timestampNow, productos: arrayProdCarrito}
        const addProduct = carrito.updateCarrito(carritos)
        res.send(addProduct);
    } else if ( config.selectedDB == 'mongodb') {
        const { id } = req.params;   
        const newProduct = req.body;
        const timestampNow = Date.now()
        await carrito.updateCarrito(id, {code: newProduct.code, title: newProduct.title, description: newProduct.description, price: newProduct.price, thumbnail: newProduct.thumbnail, stock: newProduct.stock, _id: newProduct._id, timestamp: timestampNow})
        res.send("Producto agregado al carrito");
    } else {
        const { id } = req.params;   
        const newProduct = req.body;
        const timestampNow = Date.now()
        await carrito.updateCarrito(id, {code: newProduct.code, title: newProduct.title, description: newProduct.description, price: newProduct.price, thumbnail: newProduct.thumbnail, stock: newProduct.stock, id: newProduct.id, timestamp: timestampNow})
        res.send("Producto agregado al carrito");
    }
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

// Routers

app.use(express.static('public'));

app.use('/api/productos', routerProducts);

app.use('/api/carritos', routerCarritos);

// Server on

const server = app.listen(8080, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
})

server.on ('error', error => console.log(`Error en servidor ${error}`));