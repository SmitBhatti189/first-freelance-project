import { Router } from 'express';
import { tokenValidation } from '../middleware/tokenValidation.js';
import pool from '../models/db.js';
import { jsonResponse } from '../utils/responseSchema.js';
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

export default router;