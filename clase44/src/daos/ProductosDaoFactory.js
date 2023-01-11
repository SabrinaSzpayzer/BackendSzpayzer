import ContenedorSQL from './ProductosDaoSQL.js';
import process from 'process';
import config from '../config.js';

const option = process.argv[2] || 'SQL';

let dao

switch (option) {
    case 'SQL':
        dao = new ContenedorSQL(config.mariaDb, 'productos');
        break;
    default:
        dao = new ContenedorSQL(config.mariaDb, 'productos');
}

export default class ProductosDaoFactory {
    static getDao() {
        return dao;
    }
}