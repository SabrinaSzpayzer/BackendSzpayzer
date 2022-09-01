const {promises : fs} = require('fs');

class Contenedor {
    constructor (archivo) {
        this.archivo = archivo
    }

    async saveProduct (code, title, description, price, thumbnail, stock) {
        const products = await this.getAll()
        const idP = products.length + 1
        const timestampNow = Date.now()
        const product = {code: code, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock, id: idP, timestamp: timestampNow}
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
        const total = await this.getAll()
        const byId = total.find(prod => prod.id == id)
        return byId
    }

    async getAll () {
        try {
            const total = await fs.readFile(this.archivo, 'utf-8')
            return JSON.parse(total)
        }
        catch (err) {
            return []
        }
    }

    async deleteById (id) {
        const total = await this.getAll()
        const totalFinal = total.filter(info => info.id != id)
              
        try {
            await fs.writeFile(this.archivo, JSON.stringify(totalFinal))
            console.log("Se eliminó el producto o carrito con id " + id)
          }
          catch (err) {
            console.log("Error en la eliminación por id")
          }
    }

    async deleteAll () {
        try {
            await fs.writeFile(this.archivo, [])
            console.log("Se borraron todos los productos o carritos")
        }
        catch (err) {
            console.log("Error en el borrado de todos los productos o carritos")
        }
        
    }

    async putProductById (code, title, description, price, thumbnail, stock, id, timestamp) {
        const products = await this.getAll()
        const productPos = id - 1
        products[productPos] = {code: code, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock, id: id, timestamp: timestamp}

        try {
            await fs.writeFile(this.archivo, JSON.stringify(products))
        }
        catch (err) {
            console.log("Error al actualizar el producto")
        }
    }

    async saveCarrito (productosC) {
        const carritos = await this.getAll()
        const idC = carritos.length + 1
        const timestampNow = Date.now()
        const carrito = {id: idC, timestamp: timestampNow, productos: productosC}
        carritos.push(carrito)
        
        try {
            await fs.writeFile(this.archivo, JSON.stringify(carritos))
        }
        catch (err) {
            console.log("Error al crear carrito")
        }
    }

    async deleteProdCarrito (id, id_Prod) {
        const carritoById = await this.getById(id);
        const prodCarrito = carritoById.productos;
        const newCartProducts = prodCarrito.filter(prod => prod.id != id_Prod);
        const carritos = await this.getAll()
        const carritoPos = id - 1
        const timestampNow = Date.now()
        carritos[carritoPos] = {id: id, timestamp: timestampNow, productos: newCartProducts}
    
        try {
            await fs.writeFile(this.archivo, JSON.stringify(carritos))
        }
        catch (err) {
            console.log("Error al borrar el producto del carrito")
        }   
    }

    async updateCarrito (carrito) {
        try {
            await fs.writeFile(this.archivo, JSON.stringify(carrito))
        }
        catch (err) {
            console.log("Error al actualizar el carrito")
        }   
    }
}

module.exports = Contenedor;