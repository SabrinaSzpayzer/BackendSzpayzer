import mongoose from 'mongoose'

class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, new mongoose.Schema(esquema))
    }

    async saveProduct (code, title, description, price, thumbnail, stock) {
        try {
            const timestampNow = Date.now()
            const product = {code: code, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock, timestamp: timestampNow}
            const productColeccion = await new this.coleccion(product)
            const productSave = await productColeccion.save()        
        } catch (error) {
            console.log(error)
        }
    }

    async getById (id) {
        try {
            const byId = await this.coleccion.find({_id:id})
            return byId 
        } catch (error) {
            console.log(error)
        }
    }

    async getAll () {
        try {
            const total = await this.coleccion.find({})
            return total
        }
        catch (err) {
            console.log(err)
            return []
        }
    }

    async deleteById (id) {
        try {
            const productDelete = await this.coleccion.deleteOne({_id:id})
            return productDelete        
        } catch (error) {
            console.log(error)
        }
    }

    async deleteAll () {
        try {
            const productsDelete = await this.coleccion.deleteMany({})
            return productsDelete            
        } catch (error) {
            console.log(error)
        }
    }

    async putProductById (code, title, description, price, thumbnail, stock, id) {
        try {
            const timestampNow = Date.now()
            const productPut = await this.coleccion.updateOne({_id: id}, {$set: {code: code, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock, timestamp: timestampNow}})                
        } catch (error) {
            console.log(error)
        }
    }

    async saveCarrito (productosC) {
        try {
            const timestampNow = Date.now()
            const carrito = {timestamp: timestampNow, productos: productosC}
            const carritoColeccion = await new this.coleccion(carrito)
            const productSave = await carritoColeccion.save()            
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProdCarrito (id, id_Prod) {
        try {
            let newProd = await this.coleccion.updateOne({_id:id}, {$pull: {productos: {_id: id_Prod}}})
            return newProd            
        } catch (error) {
            console.log(error)
        }
    }

    async updateCarrito (id, productCarrito) {
        try {
            let newProd = await this.coleccion.updateOne({_id:id}, {$push: {productos: productCarrito}})
            return newProd            
        } catch (error) {
            console.log(error)
        }
    }
}

export default ContenedorMongoDb