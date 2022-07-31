const express = require('express');

const app = express();

const Contenedor = require ('./Contenedor');

const product = new Contenedor ('./productos.txt')

app.get('/productos', async (req, res) => {
    const allProducts = await product.getAll()
    res.send(allProducts)
})

app.get('/productoRandom', async (req, res) => {
    const allProducts = await product.getAll()
    const productById = await product.getById(Math.floor(Math.random() * Math.floor(allProducts.length) + 1));
    res.send(productById)
})

const server = app.listen(8080, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})

server.on ('error', error => console.log(`Error en servidor ${error}`))