import mariadb from 'mariadb';
import {DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE} from '../config/index.js';

const pool = mariadb.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    connectionLimit: 5 // Adjust this limit based on your application's needs
});

export default pool;
