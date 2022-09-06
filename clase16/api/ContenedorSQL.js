import knex from 'knex'

class ContenedorSQL {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async save (title, price, thumbnail) {       
        try {
            await this.knex(`${this.tabla}`).insert({title: title, price: price, thumbnail: thumbnail})
            console.log(`Producto agregado`)
        }
        catch (err) {
            console.log("Error al agregar el producto")
            console.log(err)
        }
    }

    async saveMsg (data) {       
        try {
            await this.knex(`${this.tabla}`).insert(data)
            console.log(`Mensaje guardado`)
        }
        catch (err) {
            console.log("Error al guardar mensaje")
            console.log(err)
        }
    }

    async getById (id) {
        try {
            const productById = await this.knex.from(`${this.tabla}`).select('*').where('id', id);
            // return JSON.parse(productById)
            return productById
        }
        catch (err) {
            console.log(err)
            return []
        }
    }

    async getAll () {
        try {
            const products = await this.knex(`${this.tabla}`).select('*');
            // return JSON.parse(products)
            return products
        }
        catch (err) {
            console.log(err)
            return []
        }
    }

    async deleteById (id) {      
        try {
            await this.knex.from(`${this.tabla}`).where('id', id).del()
            console.log("Se eliminó el producto con id " + id)
        }
        catch (err) {
            console.log("Error en la eliminación de producto por id")
            console.log(err)
        }
    }

    async deleteAll () {
        try {
            await this.knex.from(`${this.tabla}`).del()
            console.log("Se borraron todos los productos")
        }
        catch (err) {
            console.log("Error en el borrado de todos los productos")
            console.log(err)
        }
    }

    async putById (id, title, price, thumbnail) {
        try {
            await this.knex.from(`${this.tabla}`).where('id', id).update({title: title, price: price, thumbnail: thumbnail})
        }
        catch (err) {
            console.log("Error al actualizar el producto")
            console.log(err)
        }
    }
}

export default ContenedorSQL