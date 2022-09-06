const socket = io.connect();

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
        return (`<div>${elem.author} (${elem.time}): ${elem.text}</>`)
    }).join(" ")
    document.getElementById('messages').innerHTML = html;
}

function addMessage (e) {
    const d = new Date().toLocaleString();

    const mensaje = {
        author: document.getElementById('inputUsername').value,
        time: d,
        text: document.getElementById('inputMensaje').value
    }

    socket.emit('new-message', mensaje);
    return false;
}

socket.on('messages', data => {
    render(data);
})