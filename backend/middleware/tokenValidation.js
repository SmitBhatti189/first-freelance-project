import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';
import { jsonResponse } from '../utils/responseSchema.js';

export function tokenValidation(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.json(jsonResponse(500, 'Token Error', error, true));
    }
}