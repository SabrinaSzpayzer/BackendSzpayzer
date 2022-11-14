const socket = io.connect();

// Tabla Productos

const formAgregarProducto = document.getElementById('formAgregarProducto')

formAgregarProducto.addEventListener('submit', e => {
    // e.preventDefault()
    //Armar objeto producto y emitir mensaje a evento update

    const producto = {
        code: document.getElementById('codigo').value,
        title: document.getElementById('nombre').value,
        description: document.getElementById('descripcion').value,
        price: document.getElementById('precio').value,
        thumbnail: document.getElementById('foto').value,
        stock: document.getElementById('stock').value
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

/* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */
// Definimos un esquema de autor

const schemaAuthor =  new normalizr.schema.Entity('author',{},{idAttribute: 'email'});

// Definimos un esquema de mensaje

const messageSchema = new normalizr.schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'text' })

// Definimos un esquema de posts

const postSchema = new normalizr.schema.Entity('posts', { messages: [messageSchema] })

/* ----------------------------------------------------------------------------- */

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

socket.on('messages', messagesN => {
    const messagesD = normalizr.denormalize(messagesN.result, postSchema, messagesN.entities);
    console.log(messagesD.messages)
    const messagesNlength = JSON.stringify(messagesN).length;
    const messagesDlength = JSON.stringify(messagesD).length;
    const porcentajeC = parseInt((messagesNlength / messagesDlength)*100);
    render(messagesD.messages);
    document.getElementById('compresion-info').innerText = porcentajeC
})