const express = require('express');
const router = express.Router();
const pool = require('./db');  // Adjust the path to your db.js file
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

// Authenticate token middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Token is required');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }

        req.user = user;
        next();
    });
};

// Add product to cart
router.post('/cart', authenticateToken, async (req, res) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).send('Only buyers can add products to the cart');
    }

    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity',
            [userId, productId, quantity]
        );
        res.status(201).send('Product added to cart');
    } catch (error) {
        res.status(500).send('Error adding product to cart');
    }
});

// Show cart items
router.get('/cart', authenticateToken, async (req, res) => {
    const userId = req.user.userId; // Assuming authenticate middleware adds user to req

    try {
        const result = await pool.query(
            'SELECT c.product_id, p.name as product_name, p.description, p.price, c.quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Remove product from cart
router.delete('/cart/:productId', authenticateToken, async (req, res) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).send('Only buyers can remove products from the cart');
    }

    const { productId } = req.params;
    const userId = req.user.userId;

    try {
        const result = await pool.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);
        if (result.rowCount === 0) {
            return res.status(404).send('Product not found in cart');
        }
        res.status(200).send('Product removed from cart');
    } catch (error) {
        res.status(500).send('Error removing product from cart');
    }
});

module.exports = router;