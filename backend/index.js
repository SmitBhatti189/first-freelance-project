import express from 'express';
import { PORT } from './config/index.js';
import pool from './models/db.js';
import cors from 'cors';
import user from './routes/user.js';
import products from './routes/products.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api',user);
app.use('/api',products);

// app.get('/users', async (req, res) => {
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         const results = await connection.query('SELECT * FROM users');
//         res.json(results);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error fetching users');
//     } finally {
//         if (connection) connection.release();
//     }
// });


app.listen(PORT, () => {
    console.log(`[server] : Server is listining at http://localhost:${PORT}`);
});