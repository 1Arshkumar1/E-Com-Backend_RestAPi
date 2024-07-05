const express = require('express');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const router = express.Router();

const secretKey = 'your_secret_key';

// Middleware to authenticate the token
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

// Only sellers can create products
router.post('/products', authenticateToken, async (req, res) => {
    if (req.user.role !== 'seller') {
        return res.status(403).send('Only sellers can create products');
    }

    const { name, category, description, price, discount } = req.body;

    try {
        await pool.query(
            'INSERT INTO products (name, category, description, price, discount) VALUES ($1, $2, $3, $4, $5)',
            [name, category, description, price, discount]
        );
        res.status(201).send('Product created successfully');
    } catch (error) {
        res.status(500).send('Error creating product');
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});

// Edit product
router.put('/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'seller') {
        return res.status(403).send('Only sellers can edit products');
    }

    const { id } = req.params;
    const { name, category, description, price, discount } = req.body;

    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, category = $2, description = $3, price = $4, discount = $5 WHERE id = $6',
            [name, category, description, price, discount, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Product not found');
        }

        res.status(200).send('Product updated successfully');
    } catch (error) {
        res.status(500).send('Error updating product');
    }
});

// Delete product
router.delete('/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'seller') {
        return res.status(403).send('Only sellers can delete products');
    }

    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Product not found');
        }

        res.status(200).send('Product deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
});

// Search products by name or category
router.get('/products/search', async (req, res) => {
    const { name, category } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const queryParams = [];

    if (name) {
        queryParams.push(`%${name}%`);
        query += ` AND name ILIKE $${queryParams.length}`;
    }

    if (category) {
        queryParams.push(category);
        query += ` AND category = $${queryParams.length}`;
    }

    try {
        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error searching products');
    }
});



module.exports = router;
