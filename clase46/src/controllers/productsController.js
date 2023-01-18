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
    ctx.response.status = 200
    const allProducts = await getProductosTest()
    ctx.body = {
        status: 'success',
        data: allProducts
    }
}

// Router products

async function getAll () {
    ctx.response.status = 200
    const allProducts = await getAllProducts();
    ctx.body = {
        status: 'success',
        data: allProducts
    }
}

async function getById () {
    ctx.response.status = 200
    const productById = await getProductById(ctx.params.id);
    ctx.body = {
        status: 'success',
        data: productById
    }
}

async function post () {
    ctx.response.status = 200
    const addProduct = await postProduct(ctx.request.body.title, ctx.request.body.price, ctx.request.body.thumbnail);
    ctx.body = {
        status: 'success',
        data: addProduct,
        message: 'New product added'
    }
}

async function putById () {
    ctx.response.status = 200
    const putProduct = await putProductById(ctx.params.id, ctx.request.body.title, ctx.request.body.price, ctx.request.body.thumbnail);
    ctx.body = {
        status: 'success',
        data: putProduct,
        message: 'Product updated'
    }
}

async function deleteById () {
    ctx.response.status = 200
    const { id } = ctx.params;
    const deleteById = await deleteProductById(id);
    ctx.body = {
        status: 'success',
        data: deleteById,
        message: 'Product deleted by id'
    }
}

async function deleteAllP () {
    ctx.response.status = 200
    const deleteAllProd = await deleteAll();
    ctx.body = {
        status: 'success',
        data: deleteAllProd,
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