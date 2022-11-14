import ContenedorMongoDb from "../../ContenedorMongoDb.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('productos', {
            code: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            price: { type: Number, required: true },
            thumbnail: { type: String, required: true },
            stock: { type: Number, required: true },
            timestamp: { type: String, required: true }
        })
    }
}

export default ProductosDaoMongoDb