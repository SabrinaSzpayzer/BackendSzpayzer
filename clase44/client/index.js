import axios from 'axios';

const host = 'http://localhost:8080/productos';

async function getProducts() {
    try {
        const response = await axios.get(host);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

// getProducts();

async function getProductsById() {
    try {
        const id = 3;
        const response = await axios.get(`${host}/${id}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

// getProductsById();

async function postProduct() {
    try {
        const newProduct = {title: "Lapiz", price: 101, thumbnail: "https://cdn2.iconfinder.com/data/icons/flat-pack-1/64/Pencil-512.png"};
        const response = await axios.post(host, newProduct);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

// postProduct();

async function putProduct() {
    try {
        const id = 10;
        const updatedProduct = {id: id, title: "Lapiz", price: 105, thumbnail: "https://cdn2.iconfinder.com/data/icons/flat-pack-1/64/Pencil-512.png"}
        const response = await axios.put(`${host}/${id}`, updatedProduct);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

// putProduct();

async function deleteProduct() {
    try {
        const idDelete = 10;
        const response = await axios.delete(`${host}/${idDelete}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

// deleteProduct();

async function deleteAll() {
    try {
        const response = await axios.delete(host);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

// deleteAll();