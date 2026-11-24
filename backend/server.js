
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home API
app.get("/", (req, res) => {
    res.send("Welcome to CareerAI Backend!");
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "CareerAI API is working successfully!"
    });
});

// SAVE Assessment Data
app.post("/api/assessment", (req, res) => {

    const {
        studentName,
        education,
        interest,
        goal,
        skills
    } = req.body;

    if (!studentName || !education || !interest || !goal || !Array.isArray(skills)) {
        return res.status(400).json({
            success: false,
            message: "Please provide valid assessment details."
        });
    }

    const sql = `
        INSERT INTO assessments
        (student_name, education, interest, goal, skills)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        studentName,
        education,
        interest,
        goal,
        JSON.stringify(skills)
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log("Database Error:", err);

            return res.status(500).json({
                success: false,
                message: "Data could not be saved."
            });
        }

        res.json({
            success: true,
            message: "Career Assessment saved successfully!",
            studentId: result.insertId
        });

    });

});

// FETCH All Assessment Data
app.get("/api/assessments", (req, res) => {

    const sql = "SELECT * FROM assessments ORDER BY id DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Fetch Error:", err);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch assessment data."
            });
        }

        res.json({
            success: true,
            data: results
        });

    });

});
const bcrypt = require("bcryptjs");

app.post("/api/register", (req, res) => {

console.log("REGISTER API HIT");

    const {
        full_name,
        email,
        mobile,
        education,
        password
    } = req.body;

    if (!full_name || !email || !mobile || !education || !password) {
        return res.json({
            success: false,
            message: "All fields are required"
        });
    }

    const checkSql = "SELECT id FROM students WHERE email = ?";

    db.query(checkSql, [email], (err, result) => {

        if (err) {
            return res.json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length > 0) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {

            if (err) {
                return res.json({
                    success: false,
                    message: "Password hashing failed"
                });
            }

            const sql = `
                INSERT INTO students
                (full_name, email, mobile, education, password)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [full_name, email, mobile, education, hashedPassword],
                (err, result) => {

                    if (err) {
                        return res.json({
                            success: false,
                            message: "Registration failed"
                        });
                    }

                    res.json({
                        success: true,
                        message: "Student Registered Successfully!"
                    });

                }
            );

        });

    });

});
// Start Server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// GET Assessment Records
app.get("/api/assessments", (req, res) => {
    const sql = "SELECT * FROM assessments";

    db.query(sql, (err, result) => {
        if (err) {
            console.log("Fetch Error:", err);
            return res.status(500).json({
                message: "Data Fetch Failed"
            });
        }

        res.json(result);
    });
});
