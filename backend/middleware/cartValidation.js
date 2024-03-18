import pool from "../models/db.js";
import { jsonResponse } from "../utils/responseSchema.js";

export async function cartValidation(req, res, next){
    const {product_id, quantity} = req.body;
    if (product_id === undefined || quantity === undefined) {
        res.json(jsonResponse(400, 'Bad Request', 'product_id and quantity are required', true));
    } else if (typeof product_id !== 'number' || typeof quantity !== 'number') {
        res.json(jsonResponse(400, 'Bad Request', 'product_id and quantity should be numbers', true));
    } else {
        let connection;
        try {
            connection = await pool.getConnection();
            const result = await connection.query('SELECT * FROM products WHERE product_id = ?', [product_id]);
            if(result.length === 0) {
                res.json(jsonResponse(404, 'Not Found', 'No product found', true));
            }
            req.product_id = product_id;
            req.quantity = quantity;
            next();
        } catch (error) {
            console.error(error);
            res.json(jsonResponse(500, 'Server Error', error, true))
        }
        finally {
            connection.end();
        }
    }
}