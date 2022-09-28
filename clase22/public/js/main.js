const socket = io.connect();
/* import normalizr from 'normalizr';
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema; */

// Tabla Productos

const formAgregarProducto = document.getElementById('formAgregarProducto')

formAgregarProducto.addEventListener('submit', e => {
    // e.preventDefault()
    //Armar objeto producto y emitir mensaje a evento update

    const producto = {
        title: document.getElementById('nombre').value,
        price: document.getElementById('precio').value,
        thumbnail: document.getElementById('foto').value
    }

    socket.emit('new-product', producto);
    return false;
})

async function renderProducts(data) {
    const productsHTML = await data
    document.getElementById("productos").innerHTML = productsHTML
}

async function makeHtmlTable(productos) {
    return fetch('./views/main.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ displayProduct: productos, listExists: true })
            return html
        })
}

socket.on('productos', async productos => {
    //generar el html y colocarlo en el tag productos llamando al funcion makeHtmlTable
    const productsDisplay = makeHtmlTable(productos)
    renderProducts(productsDisplay)
});

// Chat

function render(data) {
    const html = data.map(elem => {
        return (`<div><img src="${elem.author.avatar}" width=25px> ${elem.author.alias}: ${elem.text}</>`)
    }).join(" ")
    document.getElementById('messages').innerHTML = html;
}

function addMessage (e) {
    const mensaje = {
        author: {
            email: document.getElementById('inputUsername').value,
            nombre: document.getElementById('firstname').value,
            apellido: document.getElementById('lastname').value,
            edad: document.getElementById('age').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('inputMensaje').value
    }

    socket.emit('new-message', mensaje);
    return false;
}

socket.on('messages', data => {
    render(data);
})