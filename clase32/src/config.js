export default {
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: `./DB/ecommerce.sqlite`
        },
        useNullAsDefault: true
    },
    mariaDb: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'coderhouse'
        }
    },
    TIEMPO_EXPIRACION: 600000,
    URL_BASE_DE_DATOS: 'mongodb+srv://sabrinaszpayzer:UAWkfLB84UgJtqhL@cluster0.hn6ycnt.mongodb.net/usuarios?retryWrites=true&w=majority'
}