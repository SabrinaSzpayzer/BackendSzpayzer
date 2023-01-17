import {
    getProductosTest,
    getAllProducts,
    getProductById,
    postProduct,
    putProductById,
    deleteProductById,
    deleteAll
} from '../services/productsService.js'

// Productos test

async function productosTest () {
    const allProducts = await getProductosTest()
    ctx.body = {
        status: 'success',
        data: allProducts
    }
}

// Router products

async function getAll () {
    const allProducts = await getAllProducts();
    ctx.body = {
        status: 'success',
        data: allProducts
    }
}

async function getById () {
    const { id } = ctx.params;
    const productById = await getProductById(id);
    ctx.body = {
        status: 'success',
        data: productById
    }
}

async function post () {
    const newProduct = ctx.request.body;
    const addProduct = await postProduct(newProduct.title, newProduct.price, newProduct.thumbnail);
    ctx.body = {
        status: 'success',
        message: 'New product added'
    }
}

async function putById () {
    const { id } = ctx.params;
    const updatedProduct = ctx.request.body;
    const putProduct = await putProductById(id, updatedProduct.title, updatedProduct.price, updatedProduct.thumbnail);
    ctx.body = {
        status: 'success',
        message: 'Product updated'
    }
}

async function deleteById () {
    const { id } = ctx.params;
    const deleteById = await deleteProductById(id);
    ctx.body = {
        status: 'success',
        message: 'Product deleted by id'
    }
}

async function deleteAllP () {
    const deleteAllProd = await deleteAll();
    ctx.body = {
        status: 'success',
        message: 'All products deleted'
    }
}

export {
    productosTest,
    getAll,
    getById,
    post,
    putById,
    deleteById,
    deleteAllP
}