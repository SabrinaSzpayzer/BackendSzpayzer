import faker from "faker";
faker.locale = 'es';

function generarProducto() {
    return {
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image()
    }
};

export { generarProducto };