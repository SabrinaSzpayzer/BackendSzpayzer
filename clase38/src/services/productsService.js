import config from "../config.js";

import ContenedorSQL from "../repositories/ContenedorSQL.js";
const product = new ContenedorSQL(config.mariaDb, 'productos')

async function getProductosTest() {
    const allProducts = await product.popular()
    return allProducts
}

async function getAllProducts() {
    const allProducts = await product.getAll();
    return allProducts
}

async function getProductById (id) {
    const productById = await product.getById(id);
    return productById
}

async function postProduct (title, price, thumbnail) {
    const addProduct = await product.save(title, price, thumbnail);
    return addProduct
}

async function putProductById (id, title, price, thumbnail) {
    const putProduct = await product.putById(id, title, price, thumbnail);
    return putProduct
}

async function deleteProductById (id) {
    const deleteProductById = await product.deleteById(id);
    return deleteProductById
}

async function deleteAll () {
    const deleteAllProd = await product.deleteAll();
    return deleteAllProd
}

export {
    getProductosTest,
    getAllProducts,
    getProductById,
    postProduct,
    putProductById,
    deleteProductById,
    deleteAll
}