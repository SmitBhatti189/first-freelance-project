import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_DATABASE = process.env.DB_DATABASE || 'ecomwebsite';
const JWT_SECRET = process.env.JWT_SECRET;


export { 
    PORT, DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, JWT_SECRET
}