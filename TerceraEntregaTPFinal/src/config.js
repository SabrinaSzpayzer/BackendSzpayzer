export default {
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: `./DB/ecommerce.sqlite`
        },
        useNullAsDefault: true
    },
    mongodb: {
        cnxStr: 'mongodb+srv://sabrinaszpayzer:UAWkfLB84UgJtqhL@cluster0.hn6ycnt.mongodb.net/?retryWrites=true&w=majority',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    TIEMPO_EXPIRACION: 600000
}