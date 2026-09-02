require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   SERVE WEBSITE FILES
========================= */

app.use(express.static(__dirname));

/* =========================
   MYSQL CONNECTION
========================= */

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL connection failed:");
        console.error(err.message);
        return;
    }

    console.log("✅ MySQL connected successfully!");
});

/* =========================
   TEST ROUTE
========================= */

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Our Little World backend is working!"
    });
});

/* =========================
   REGISTER
========================= */

app.post("/api/register", async (req, res) => {
    console.log("📥 Register request received");

    const { username, email, password } = req.body;

    console.log("Username:", username);
    console.log("Email:", email);

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please complete all fields."
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters."
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users
            (username, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [username, email, hashedPassword],
            (err, result) => {
                if (err) {
                    console.error("❌ Registration database error:");
                    console.error(err);

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            success: false,
                            message:
                                "Username or email is already registered."
                        });
                    }

                    return res.status(500).json({
                        success: false,
                        message: "Unable to create account."
                    });
                }

                console.log(
                    "✅ Account created. User ID:",
                    result.insertId
                );

                return res.status(201).json({
                    success: true,
                    message: "Account created successfully."
                });
            }
        );

    } catch (error) {
        console.error("❌ Password hashing error:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
});

/* =========================
   LOGIN
========================= */

app.post("/api/login", (req, res) => {
    console.log("📥 Login request received");

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter your username and password."
        });
    }

    const sql = `
        SELECT
            id,
            username,
            email,
            password
        FROM users
        WHERE username = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [username],
        async (err, results) => {
            if (err) {
                console.error("❌ Login database error:");
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to process login."
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password."
                });
            }

            const user = results[0];

            try {
                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!passwordMatch) {
                    return res.status(401).json({
                        success: false,
                        message:
                            "Invalid username or password."
                    });
                }

                console.log(
                    "✅ Login successful:",
                    user.username
                );

                return res.json({
                    success: true,
                    message: "Login successful.",
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                });

            } catch (error) {
                console.error(
                    "❌ Password comparison error:"
                );
                console.error(error);

                return res.status(500).json({
                    success: false,
                    message: "Something went wrong."
                });
            }
        }
    );
});

/* =========================
   404 API HANDLER
========================= */

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found.",
        endpoint: req.originalUrl
    });
});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {
    console.log("");
    console.log("=================================");
    console.log("   OUR LITTLE WORLD BACKEND");
    console.log("=================================");
    console.log(
        `Server running at http://localhost:${PORT}`
    );
    console.log(
        `Test API: http://localhost:${PORT}/api/test`
    );
    console.log("=================================");
    console.log("");
});

