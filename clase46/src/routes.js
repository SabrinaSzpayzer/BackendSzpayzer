import koaRouter from 'koa-router';

import {
    getAll,
    getById,
    post,
    putById,
    deleteById,
    deleteAllP
} from './controllers/productsController.js'

const routerProducts = new koaRouter({
    prefix: '/productos'
});

// Router products

routerProducts.get('/', getAll)

routerProducts.get('/:id', getById)

routerProducts.post('/', post)

routerProducts.put('/:id', putById)

routerProducts.delete('/:id', deleteById)

routerProducts.delete('/', deleteAllP)

export default routerProducts