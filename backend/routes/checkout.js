import { Router } from 'express';
import { tokenValidation } from '../middleware/tokenValidation.js';
import { jsonResponse } from '../utils/responseSchema.js';
import pool from '../models/db.js';
import { cartValidation } from '../middleware/cartValidation.js';

const router = Router();

// when the user checkout and want to pay
router.post('/checkout', tokenValidation, async (req, res) => {
	let { paymentMethod } = req.body;
	if(!paymentMethod) {
		paymentMethod = 'Cash';	
	}
	const { id } = req.userData;
	const userId = id;
	let connection;
	try {
		connection = await pool.getConnection();
		await connection.beginTransaction();
		const result = await connection.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
		if (result.length === 0) {
			connection.end();
			res.json(jsonResponse(404, 'Not Found', 'No cart found', true));
		} else {
			// for all the items in the cart we will take their price from product table and calculate the total price
			// add then add details to the user_order table and the orderDetails table
			// then delete the items from the cart
			let totalPrice = 0;
			for (let i = 0; i < result.length; i++) {
				const product = await connection.query('SELECT * FROM products WHERE product_id = ?', [result[i].product_id]);
				product[0].price = product[0].price || 0; // Add this line to set the price to 0 if it is missing
				totalPrice += product[0].price * result[i].quantity;
			}
			await connection.query('INSERT INTO user_order (user_id, total_price, payment_method) VALUES (?, ?, ?)', [userId, totalPrice, paymentMethod]);
			const order = await connection.query('SELECT * FROM user_order WHERE user_id = ? ORDER BY order_id DESC LIMIT 1', [userId]);
			for (let i = 0; i < result.length; i++) {
				const product = await connection.query('SELECT * FROM products WHERE product_id = ?', [result[i].product_id]);
				product[0].price = product[0].price || 0; // Add this line to set the price to 0 if it is missing
				await connection.query('INSERT INTO orderDetails (order_id, product_id, quantity) VALUES (?, ?, ?)', [order[0].order_id, result[i].product_id, result[i].quantity]);
			}
			await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
			connection.commit();
			connection.end();
			res.json(jsonResponse(200, 'Success', 'Checkout Successful'));

		}
	} catch (error) {
		console.error(error);
		connection.rollback();
		connection.end();
		res.json(jsonResponse(500, 'Server Error', error, true));
	}
});

// when the user want to delete a product from the cart
router.delete('/cart/:productID', tokenValidation, async (req, res) => {
	const { id } = req.userData;
	const userId = id;
	const { productID } = req.params;
	let connection;
	try {
		connection = await pool.getConnection();
		const result = await connection.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, productID]);
		console.log(result);
		connection.end();
		res.json(jsonResponse(200, 'Success', 'Product removed from cart'));
	} catch (error) {
		console.error(error);
		res.json(jsonResponse(500, 'Server Error', error, true));
	}
});

// when user wants to update the quantity of a product in the cart
router.put('/cart', tokenValidation, cartValidation, async (req, res) => {
	const { id } = req.userData;
	const userId = id;
	const { product_id, quantity } = req;
	let connection;
	try {
		connection = await pool.getConnection();
		const result = await connection.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, product_id]);
		if (result.length === 0) {
			res.json(jsonResponse(404, 'Not Found', 'No product found in cart', true));
		} else {
			await connection.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, userId, product_id]);
			connection.end();
			res.json(jsonResponse(200, 'Success', 'Product quantity updated'));
		}
	} catch (error) {
		console.error(error);
		res.json(jsonResponse(500, 'Server Error', error, true));
	}
});

// when the add something to cart
router.post('/cart', tokenValidation, cartValidation, async (req, res) => {
	const { id } = req.userData;
	const userId = id;
	const { product_id, quantity } = req;
	let connection;
	try {
		connection = await pool.getConnection();
		const result = await connection.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, product_id]);
		if (result.length === 0) {
			await connection.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, product_id, quantity]);
		} else {
			await connection.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [result[0].quantity + quantity, userId, product_id]);
		}
		connection.end();
		res.json(jsonResponse(200, 'Success', 'Product added to cart'));
	} catch (error) {
		console.error(error);
		res.json(jsonResponse(500, 'Server Error', error, true));
	}
});

// when the user want to see the checkout
router.get('/cart', tokenValidation, async (req, res) => {
	const { id } = req.userData;
	const userId = id;
	let connection;
	try {
		connection = await pool.getConnection();
		const result = await connection.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
		connection.end();
		if (result.length === 0) {
			res.json(jsonResponse(404, 'Not Found', 'No checkout found', true));
		} else {
			res.json(jsonResponse(200, 'Success', result));
		}
	} catch (error) {
		console.error(error);
		res.json(jsonResponse(500, 'Server Error', error, true));
	}
});


export default router;