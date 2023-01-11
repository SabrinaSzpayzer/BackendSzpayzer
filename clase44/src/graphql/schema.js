import { buildSchema } from 'graphql';

const ProductosSchema = buildSchema(`
  type Producto {
    id: ID!,
    title: String,
    price: Int,
    thumbnail: String
  }
  input ProductoInput {
    title: String,
    price: Int,
    thumbnail: String
  }
  type Query {
    getProducto(id: ID!): [Producto],
    getProductos: [Producto],
  }
  type Mutation {
    saveProducto(title: String, price: Int, thumbnail: String): Producto
    updateProducto(id: ID!, title: String, price: Int, thumbnail: String): Producto,
    deleteProducto(id: ID!): Producto,
    deleteProductos: [Producto],
  }
`);

export default ProductosSchema;
