const Pool = require(`pg`).Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "logins",
    password: "01027879",
    port: 5432,
});

module.exports = pool;