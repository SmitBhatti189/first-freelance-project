import { Router } from 'express';
import pool from '../models/db.js';
import { jsonResponse } from '../utils/responseSchema.js';
import { productValidation } from '../middleware/productValidation.js';
const router = Router();

// all Products API
router.get('/products', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const results = await connection.query('SELECT * FROM products');
        res.json(jsonResponse(200, 'OK', results));
    } catch (error) {
        console.error(error);
        res.json(jsonResponse(500, 'Internal Server Error', error, true));
    }
    finally {
        if(connection) connection.release();
    }
});

// featured Products API
router.get('/featuredproducts', async (req, res) => {
    let { nProducts } = req.query;
    nProducts = parseInt(nProducts);
    if (typeof nProducts !== 'number' || isNaN(nProducts)){
        nProducts = 5;
    }
    nProducts = nProducts > 5 ? nProducts : 5;
    nProducts = nProducts > 10 ? 10 : nProducts;
    let connection;
    try {
        connection = await pool.getConnection();
        const results = await connection.query('SELECT * FROM products');
        // random n products or if n is null then 5 products
        if(nProducts > results.length) nProducts = results.length;
        const randomProducts = results.sort(() => Math.random() - Math.random()).slice(0, nProducts);
        res.json(jsonResponse(200, 'OK', randomProducts));
    } catch (error) {
        console.error(error);
        res.json(jsonResponse(500, 'Internal Server Error', error, true));
    }
    finally {
        if(connection) connection.release();
    }
});

router.get('/product/:productID', productValidation, async (req, res) => {
    const { productID } = req.params;
    let connection;
    try {
        connection = await pool.getConnection();
        const result = await connection.query('SELECT * FROM products WHERE product_id = ?', [productID]);
        res.json(jsonResponse(200, 'OK', result[0]));
    } catch (error) {
        console.error(error);
        res.json(jsonResponse(500, 'Internal Server Error', error, true));
    }
    finally {
        if(connection) connection.release();
    }
});

router.get('/categories', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const results = await connection.query('SELECT * FROM category');
        // for each category get any one product image url
        for(let i = 0; i < results.length; i++) {
            const product = await connection.query('SELECT * FROM products WHERE category = ? ', [results[i].categoryID]);
            results[i].image_url = product[Math.floor(Math.random() * product.length)].image_url;
        }
        res.json(jsonResponse(200, 'OK', results));
    } catch (error) {
        console.error(error);
        res.json(jsonResponse(500, 'Internal Server Error', error, true));
    }
    finally {
        if(connection) connection.release();
    }
});

export default router;