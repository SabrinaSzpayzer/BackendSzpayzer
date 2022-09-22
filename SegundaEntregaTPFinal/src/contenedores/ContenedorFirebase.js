import admin from "firebase-admin"
import config from '../config.js'

admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL: 'https://sscoderhouse32065.firebaseio.com'
})

const db = admin.firestore();

class ContenedorFirebase {

    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion)
    }

    async saveProduct (code, title, description, price, thumbnail, stock) {
        try {
            const timestampNow = Date.now()
            const product = {code: code, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock, timestamp: timestampNow}
            let doc = this.coleccion.doc()
            await doc.create(product)
        } catch (error) {
            console.log(error)
        }      
    }

    async getById (id) {
        try {
            const doc = this.coleccion.doc(`${id}`)
            const item = await doc.get()
            const byId = item.data()
            return byId            
        } catch (error) {
            console.log(error)
        }
    }

    async getAll () {
        try {
            const querySnapshot = await this.coleccion.get()
            let docs = querySnapshot.docs
            const total = docs.map((doc) => ({
                code: doc.data().code,
                title: doc.data().title,
                description: doc.data().description,
                price: doc.data().price,
                thumbnail: doc.data().thumbnail,
                stock: doc.data().stock,
                timestamp: doc.data().timestamp,
                productos: doc.data().productos,
                id: doc.id
            }))
            return total
        }
        catch (error) {
            console.log(error)
            return []
        }
    }

    async deleteById (id) {
        try {
            const doc = this.coleccion.doc(`${id}`)
            const deleted = await doc.delete()            
        } catch (error) {
            console.log(error)
        }
    }

    async deleteAll () {
        try {
            let items = await this.coleccion.get()
            let docs = items.docs
            docs.map(async (data) => {
                let doc = this.coleccion.doc(`${data.id}`)
                let deleteDoc = await doc.delete()
            })            
        } catch (error) {
            console.log(error)
        }
    }

    async putProductById (code, title, description, price, thumbnail, stock, id) {
        try {
            const doc = this.coleccion.doc(`${id}`)
            const timestampNow = Date.now()
            const item = await doc.update({code: code, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock, timestamp: timestampNow}) 
            return item            
        } catch (error) {
            console.log(error)
        }
    }

    async saveCarrito (productosC) {
        try {
            const timestampNow = Date.now()
            const carrito = {timestamp: timestampNow, productos: productosC.productos}
            let doc = this.coleccion.doc()
            await doc.create(carrito)         
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProdCarrito (id, id_Prod) {
        try {
            const doc = this.coleccion.doc(`${id}`)
            const carrito = await doc.get()
            const carritoById = carrito.data()
            let newCarrito = []
            carritoById.productos.map(data => {if (data.id != id_Prod) {
                newCarrito.push(data)
            }})
            let updateCarrito = await doc.update({productos: newCarrito})
            return updateCarrito
        } catch (error) {
            console.log(error)
        }
    }

    async updateCarrito (id, productCarrito) {
        try {
            const doc = this.coleccion.doc(`${id}`)
            const carrito = await doc.get()
            const carritoById = carrito.data()
            carritoById.productos.push(productCarrito)
            const newProdsCarrito = carritoById.productos
            let newCarrito = await doc.update({productos: newProdsCarrito})
            return newCarrito
        } catch (error) {
            console.log(error)
        }
    }
}

export default ContenedorFirebase