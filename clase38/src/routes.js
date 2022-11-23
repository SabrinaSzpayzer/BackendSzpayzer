import { Router } from 'express'

import {
    productosTest,
    getAll,
    getById,
    post,
    putById,
    deleteById,
    deleteAll
} from './controllers/productsController.js'

import {
    getLogin,
    postLogin,
    getFailLogin,
    getLogout,
    getSignUp,
    postSignup,
    getFailsignup
} from './controllers/pagesController.js'


const routerProducts = new Router();

// Productos test

app.get('/api/productos-test', productosTest)

// Router products

routerProducts.get('/', getAll)

routerProducts.get('/:id', getById)

routerProducts.post('/', post)

routerProducts.put('/:id', putById)

routerProducts.delete('/:id', deleteById)

routerProducts.delete('/', deleteAll)


// Pages

//LOGIN
app.get('/login', routes.getLogin);
app.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin'
}), routes.postLogin);
app.get('/faillogin', routes.getFailLogin);

//SIGNUP
app.get('/signup', routes.getSignUp);
app.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/failsignup'
}), routes.postSignup);
app.get('/failsignup', routes.getFailsignup);

//Home
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.get('/', checkAuthentication, (req, res) => {
    const { user } = req;
    res.render('home', {nombre: user.firstName});
});

//LOGOUT
app.get('/logout', routes.getLogout);