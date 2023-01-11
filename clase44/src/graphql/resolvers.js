import {
    getAllProducts,
    getProductById,
    postProduct,
    putProductById,
    deleteProductById,
    deleteAll
} from '../services/productsService.js'

export async function getAll(){
    return getAllProducts();
}

export async function getById(producto){
    return getProductById(producto.id);
}

export async function post(producto){
    return postProduct(producto.title, producto.price, producto.thumbnail);
}

export async function putById(producto){
    return putProductById(producto.id, producto.title, producto.price, producto.thumbnail);
}

export async function deleteById(producto){
    return deleteProductById(producto.id);
}

export async function deleteAllP(producto){
    return deleteAll();
}