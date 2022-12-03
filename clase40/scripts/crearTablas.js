import knex from 'knex'
import config from '../src/config.js'

//------------------------------------------
// productos en MariaDb

const mariaDbClient = knex(config.mariaDb)

try {
    //Implementar creación de tabla

    await mariaDbClient.schema.createTable('productos', table => {
        table.increments('id').primary();
        table.string('title', 15).notNullable();
        table.float('price');
        table.string('thumbnail', 150).notNullable();
    });

    console.log('tabla productos en mariaDb creada con éxito')
} catch (error) {
    console.log('error al crear tabla productos en mariaDb')
    console.log(error)
}

//------------------------------------------
// mensajes en SQLite3

const sqliteClient = knex(config.sqlite3)

try {
    //Implementar creación de tabla

    await sqliteClient.schema.createTable('mensajes', table => {
        table.string('author', 25).notNullable();
        table.time('time');
        table.string('text', 150).notNullable();
    });

    console.log('tabla mensajes en sqlite3 creada con éxito')
} catch (error) {
    console.log('error al crear tabla mensajes en sqlite3')
}