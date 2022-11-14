let productosDao;
let carritosDao;

const { default: ProductosDaoMongoDb } = await import('./productos/ProductosDaoMongoDb.js');
const { default: CarritosDaoMongoDb } = await import('./carritos/CarritosDaoMongoDb.js');

productosDao = new ProductosDaoMongoDb();
carritosDao = new CarritosDaoMongoDb();


export { productosDao, carritosDao }