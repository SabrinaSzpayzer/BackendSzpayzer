const {promises : fs} = require('fs');

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
        }
    }

    async getAll () {
        try {
            const mensajes = await fs.readFile(this.archivo, 'utf-8')
            return JSON.parse(mensajes)
        }
        catch (err) {
            return []
        }
    }

    async deleteAll () {
        try {
            await fs.writeFile(this.archivo, [])
            console.log("Se borraron todos los mensajes")
        }
        catch (err) {
            console.log("Error en el borrado de los mensajes")
        }
        
    }
}

module.exports = Chat;