import { Router } from 'express';
import { userValidation } from '../middleware/userValidation.js';
import { jsonResponse } from '../utils/responseSchema.js';
import pool from '../models/db.js';
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/index.js'

const router = Router();

// Signin API
router.post('/signin', userValidation, async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const results = await connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [req.body.username, req.body.password]); 
        if(results.length === 0) {
            res.json(jsonResponse(404, 'Not Found', 'User not found', true));
        }
        else {
            // create a JWT token and send it to the user
            const payload = {
                username: req.body.username,
                id: results[0].id
            }
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            res.json(jsonResponse(200, 'OK', { token }));
        }
    } catch (error) {
        console.error(error);
        res.json(jsonResponse(500, 'Internal Server Error', error, true));
    }
    finally {
        if (connection) connection.release();
    }
});

// Singup API
router.post('/signup', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const results = await connection.query('SELECT * FROM users WHERE username = ?', [req.body.username, req.body.password]); 
        if(results.length === 0) {
            // store the user in the database
            const results = await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [req.body.username, req.body.password]);
            res.json(jsonResponse(200, 'OK', 'User created successfully'));
        }
        else {
            res.json(jsonResponse(409, 'Conflict', 'User already exists', true));
        }
    } catch (error) {
        console.error(error);
        res.json(jsonResponse(500, 'Internal Server Error', error, true));
    }
    finally {
        if (connection) connection.release();
    }
});

export default router;