import pool from "../models/db.js";
import { jsonResponse } from "../utils/responseSchema.js";

export async function productValidation(req, res, next) {
    const { productID } = req.params;
    if (isNaN(productID)) {
        res.json(jsonResponse(400, 'Bad Request', 'Invalid Product ID', true));
    } else {
        let connection;
        try {
            connection = await pool.getConnection();
            const result = await connection.query('SELECT * FROM products WHERE product_id = ?', [productID]);
            if(result.length === 0) {
                res.json(jsonResponse(404, 'Not Found', 'Product Not Found', true));
            }
            else {
                req.product = result[0];
                next();
            }
        } catch (error) {
            console.error(error);
            res.json(jsonResponse(500, 'Internal Server Error', error, true));
        }
    }
}