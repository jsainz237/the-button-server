import { Sequelize } from 'sequelize-typescript';

/** Sequelize connection to postgres database + model detection */
export const database = new Sequelize({
    database: 'the-button-db',
    dialect: 'postgres',
    models: [__dirname + '/models/*.ts']
})

// test connection
try {
    database.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}