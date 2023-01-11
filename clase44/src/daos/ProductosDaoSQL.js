import knex from 'knex'
import { generarProducto } from '../../utils/generadorDeProductos.js'
import logger from '../logger.js'
import { asDto } from '../dtos/ProductoDto.js'

let instance = null;

class ContenedorSQL {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async popular (cant = 5) {
        const nuevos = []
        for (let i = 1; i <= cant; i++) {
            const nuevoProducto = generarProducto()
            nuevos.push(nuevoProducto)
        }
        return asDto(nuevos)
    }

    async save (title, price, thumbnail) {       
        try {
            const saveP = await this.knex(`${this.tabla}`).insert({title: title, price: price, thumbnail: thumbnail})
            return asDto(saveP)
            console.log(`Producto agregado`)
            logger.info(`Producto agregado`)
        }
        catch (err) {
            console.log("Error al agregar el producto")
            console.log(err)
            logger.error("Error al agregar el producto")
        }
    }

    async saveMsg (data) {       
        try {
            await this.knex(`${this.tabla}`).insert(data)
            console.log(`Mensaje guardado`)
            logger.info(`Mensaje guardado`)
        }
        catch (err) {
            console.log("Error al guardar mensaje")
            console.log(err)
            logger.error("Error al guardar mensaje")
        }
    }

    async getById (id) {
        try {
            const productById = await this.knex.from(`${this.tabla}`).select('*').where('id', id);
            // return JSON.parse(productById)
            return asDto(productById)
        }
        catch (err) {
            console.log(err)
            logger.error("Error al obtener por id")
            return []
        }
    }

    async getAll () {
        try {
            const products = await this.knex(`${this.tabla}`).select('*');
            // return JSON.parse(products)
            return asDto(products)
        }
        catch (err) {
            console.log(err)
            logger.error("Error al obtener todos los productos")
            return []
        }
    }

    async deleteById (id) {      
        try {
            const deleteP = await this.knex.from(`${this.tabla}`).where('id', id).del()
            return asDto(deleteP)
            console.log("Se eliminó el producto con id " + id)
            logger.info("Se eliminó el producto con id " + id)
        }
        catch (err) {
            console.log("Error en la eliminación de producto por id")
            console.log(err)
            logger.error("Error en la eliminación de producto por id")
        }
    }

    async deleteAll () {
        try {
            const deleteAllP = await this.knex.from(`${this.tabla}`).del()
            return asDto(deleteAllP)
            console.log("Se borraron todos los productos")
            logger.info("Se borraron todos los productos")
        }
        catch (err) {
            console.log("Error en el borrado de todos los productos")
            console.log(err)
            logger.error("Error en el borrado de todos los productos")
        }
    }

    async putById (id, title, price, thumbnail) {
        try {
            const putP = await this.knex.from(`${this.tabla}`).where('id', id).update({title: title, price: price, thumbnail: thumbnail})
            return asDto(putP)
        }
        catch (err) {
            console.log("Error al actualizar el producto")
            console.log(err)
            logger.error("Error al actualizar el producto")
        }
    }

    static getInstance() {
        if (!instance) {
            instance = new ContenedorSQL(config, tabla);
        }
        return instance;
    }
}

export default ContenedorSQL