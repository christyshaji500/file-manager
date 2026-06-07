const pool = require("../config/db");

const createUser = async (username, email, password) => {
    const query = `
        INSERT INTO users(username,email,password)
        VALUES($1,$2,$3)
        RETURNING id,username,email,created_at
    `;

    const result = await pool.query(query, [
        username,
        email,
        password
    ]);

    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );

    return result.rows[0];
};

module.exports = {
    createUser,
    findUserByEmail
};