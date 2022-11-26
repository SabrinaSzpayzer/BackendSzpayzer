import { promises as fs } from 'fs';
import logger from '../../src/logger.js'

class Chat {
    constructor (archivo) {
        this.archivo = archivo
    }

    async save (msj) {
        const mensajes =  await this.getAll()
        mensajes.push(msj)
        
        try {
            await fs.writeFile(this.archivo, JSON.stringify(mensajes))
        }
        catch (err) {
            console.log("Error al guardar mensaje de chat")
            logger.error("Error al guardar mensaje de chat")
        }
    }

    async getAll () {
        try {
            const mensajes = await fs.readFile(this.archivo, 'utf-8')
            return JSON.parse(mensajes)
        }
        catch (err) {
            logger.error("Error al obtener todos los mensajes de chat")
            return []
        }
    }

    async deleteAll () {
        try {
            await fs.writeFile(this.archivo, [])
            console.log("Se borraron todos los mensajes")
            logger.info("Se borraron todos los mensajes")
        }
        catch (err) {
            console.log("Error en el borrado de los mensajes")
            logger.error("Error en el borrado de los mensajes")
        }
        
    }
}

export default Chat;