import { Router } from 'express';

import {
    getAll,
    getById,
    post,
    putById,
    deleteById,
    deleteAllP
} from './controllers/productsController.js'

const routerProducts = new Router();

// Router products

routerProducts.get('/', getAll)

routerProducts.get('/:id', getById)

routerProducts.post('/', post)

routerProducts.put('/:id', putById)

routerProducts.delete('/:id', deleteById)

routerProducts.delete('/', deleteAllP)

export {routerProducts} 