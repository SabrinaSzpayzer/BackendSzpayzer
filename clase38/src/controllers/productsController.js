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

async function productosTest (req, res) {
    const allProducts = await getProductosTest()
    if (allProducts.length > 0) {
        res.render('main', {displayProduct: allProducts, listExists: true});
    } else {
        res.render('main', {listExists: false});
    }
}

// Router products

async function getAll (req, res) {
    const allProducts = await getAllProducts();
    if (allProducts.length > 0) {
        res.render('main', {displayProduct: allProducts, listExists: true});
    } else {
        res.render('main', {listExists: false});
    }
}

async function getById (req, res) {
    const { id } = req.params;
    const productById = await getProductById(id);
    res.send(productById);
}

async function post (req, res) {
    const newProduct = req.body;
    const addProduct = await postProduct(newProduct.title, newProduct.price, newProduct.thumbnail);
    res.json(addProduct);
}

async function putById (req, res) {
    const { id } = req.params;
    const updatedProduct = req.body;
    const putProduct = await putProductById(id, updatedProduct.title, updatedProduct.price, updatedProduct.thumbnail);
    res.json(putProduct);
}

async function deleteById (req, res) {
    const { id } = req.params;
    const deleteById = await deleteProductById(id);
    const allProducts = await getAllProducts();
    if ( id > allProducts.length ) {
        res.send("Producto no encontrado");
    } else {
        res.send(deleteById);
    }
}

async function deleteAllP (req, res) {
    const deleteAllProd = await deleteAll();
    res.send(deleteAllProd)
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