/*const Pool = require(`pg`).Pool;*/

require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });



/*
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
*/
// Example of using the pool to query the database
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error executing query', err.stack);
    } else {
        console.log('Database connected:', res.rows);
    }
});

/*const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "logins",
    password: "01027879",
    port: 5432,
});*/

module.exports = pool;
