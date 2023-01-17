import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/server.js';

let request
let server

describe('test api', () => {
    before(async function () {
        server = await startServer();
        request = supertest(`http://localhost:${server.address().port}/productos`);
    })

    after(function () {
        server.close();
    });

    describe('GET', () => {
        it('get all: debería retornar status 200', async () => {
            const response = await request.get('/');
            expect(response.status).to.eq(200);
        })
    })

    describe('GET', () => {
        it('get by id: debería retornar status 200', async () => {
            const getId = 3;
            const response = await request.get(`/${getId}`);
            expect(response.status).to.eq(200);
        })
    })

    describe('POST', () => {
        it('debería agregar un producto a la db', async () => {
            const newProduct = {title: "Lapiz", price: 101, thumbnail: "https://cdn2.iconfinder.com/data/icons/flat-pack-1/64/Pencil-512.png"};
            const response = await request.post('/').send(newProduct);
            expect(response.status).to.eq(200);

            const product = response.body;
            expect(product).to.include.keys('title', 'price', 'thumbnail');
            expect(product.title).to.eq(newProduct.title);
            expect(product.price).to.eq(newProduct.price);
            expect(product.thumbnail).to.eq(newProduct.thumbnail);
        })
    })

    describe('PUT', () => {
        it('debería modificar un producto de la db', async () => {
            const updatedProduct = {id: 12, title: "Lapiz", price: 105, thumbnail: "https://cdn2.iconfinder.com/data/icons/flat-pack-1/64/Pencil-512.png"};
            const response = await request.put(`/${updatedProduct.id}`).send(updatedProduct);
            expect(response.status).to.eq(200);

            const product = response.body;
            expect(product).to.include.keys('title', 'price', 'thumbnail');
            expect(product.title).to.eq(updatedProduct.title);
            expect(product.price).to.eq(updatedProduct.price);
            expect(product.thumbnail).to.eq(updatedProduct.thumbnail);
        })
    })

    describe('DELETE', () => {
        it('debería eliminar un producto de la db por id', async () => {
            const deletedProductId = 11;
            const response = await request.delete(`/${deletedProductId}`);
            expect(response.status).to.eq(200);
        })
    })
})

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 0
        const server = app.listen(PORT, () => {
            console.log(`Servidor express escuchando en el puerto ${server.address().port}`);
            resolve(server)
        });
        server.on('error', error => {
            console.log(`Error en Servidor: ${error}`)
            reject(error)
        });
    })
}