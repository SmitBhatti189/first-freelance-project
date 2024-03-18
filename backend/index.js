import express from 'express';
import { PORT } from './config/index.js';
import cors from 'cors';
import user from './routes/user.js';
import products from './routes/products.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api',user);
app.use('/api',products);


app.listen(PORT, () => {
    console.log(`[server] : Server is listining at http://localhost:${PORT}`);
});