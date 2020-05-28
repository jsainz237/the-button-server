import { Sequelize } from 'sequelize-typescript';

/** Sequelize connection to postgres database + model detection */
export const database = new Sequelize({
    host: process.env.NODE_ENV === 'prod' ? `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}` : undefined,
    database: process.env['DB_NAME'],
    dialect: 'postgres',
    username: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    models: [__dirname + '/models/*.ts', __dirname + '/models/*.js']
})

// test connection
try {
    database.authenticate();
} catch (error) {
    console.error('Unable to connect to the database: ', error);
}