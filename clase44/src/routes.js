import express from 'express';
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
routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }));

// Router products

routerProducts.get('/', getAll)

routerProducts.get('/:id', getById)

routerProducts.post('/', post)

routerProducts.put('/:id', putById)

routerProducts.delete('/:id', deleteById)

routerProducts.delete('/', deleteAllP)

export default routerProducts