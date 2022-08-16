const {promises : fs} = require('fs');

class Contenedor {
    constructor (archivo) {
        this.archivo = archivo
    }

    async save (title, price, thumbnail) {
        const products = await this.getAll()
        const idP = products.length + 1
        const product = {title: title, price: price, thumbnail: thumbnail, id: idP}
        products.push(product)
        
        try {
            await fs.writeFile(this.archivo, JSON.stringify(products))
            console.log(`id del producto agregado: ${product.id}`)
            console.log(product)
        }
        catch (err) {
            console.log("Error al agregar el producto")
        }
    }

    async getById (id) {
        const products = await this.getAll()
        const productById = products.find(p => p.id = id)
        return productById
    }

    async getAll () {
        try {
            const products = await fs.readFile(this.archivo, 'utf-8')
            return JSON.parse(products)
        }
        catch (err) {
            return []
        }
    }

    async deleteById (id) {
        const products = await this.getAll()
        const productsFinal = products.filter(info => info.id != id)
              
        try {
            await fs.writeFile(this.archivo, JSON.stringify(productsFinal))
            console.log("Se eliminó el producto con id " + id)
          }
          catch (err) {
            console.log("Error en la eliminación de producto por id")
          }
    }

    async deleteAll () {
        try {
            await fs.writeFile(this.archivo, [])
            console.log("Se borraron todos los productos")
        }
        catch (err) {
            console.log("Error en el borrado de todos los productos")
        }
        
    }

    async putById (id, title, price, thumbnail) {
        const products = await this.getAll()
        const productPos = id - 1
        products[productPos] = {title: title, price: price, thumbnail: thumbnail, id: id}

        try {
            await fs.writeFile(this.archivo, JSON.stringify(products))
        }
        catch (err) {
            console.log("Error al actualizar el producto")
        }
    }
}

module.exports = Contenedor;