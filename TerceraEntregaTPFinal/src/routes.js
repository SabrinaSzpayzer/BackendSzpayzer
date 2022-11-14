import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getLogin(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    else {
        res.sendFile('login.html', { root: __dirname + "../../public"});
    }
}

function getSignUp(req, res) {
    res.sendFile('signup.html', { root: __dirname + "../../public"});
}

function postLogin(req, res) {
    const user = req.user;
    console.log(user);
    res.redirect('/');
}

function postSignup(req, res) {
    const user = req.user;
    console.log(user);
    res.redirect('/');
}

function getFailLogin(req, res) {
    console.log('error en login');
    res.render('login-error', {
    });
}

function getFailsignup(req, res) {
    console.log('error en signup');
    res.render('signup-error', {
    });
}

function getLogout(req, res) {
    const user = req.user;
    req.logout((err) => {
        if (err) { return next(err); }
        res.render('logout', {nombre: user.firstName});
    });
}

export default {
    getLogin,
    postLogin,
    getFailLogin,
    getLogout,
    getSignUp,
    postSignup,
    getFailsignup
}