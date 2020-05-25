import { Sequelize } from 'sequelize-typescript';

/** Sequelize connection to postgres database + model detection */
export const database = new Sequelize({
    host: process.env['DB_HOST'],
    database: process.env['DB_NAME'],
    dialect: 'postgres',
    username: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    models: [__dirname + '/models/*.ts']
})

// test connection
try {
    database.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database: ', error);
}