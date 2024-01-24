const express = require("express");
const router = express.Router();
const crypto = require("node:crypto");
const db = require("../../utils/database");
const bcrypt = require("bcrypt");
const JWT = require("../../middleware/JWT");

// GET ALL AND INSERT OFFICER

const findEmail = (req, res, next) => {
    const { email } = req.body;
    console.log(email)
    try {
        let sql = "SELECt * FROM user WHERE email = ?";
        db.query(sql, email, (err, rows) => {
            if (err) {
                console.log(`Server error controller/findEmail: ${err}`);
                return res.status(500).json({
                    status: 500,
                    message: `Internal Server Error, ${err}`,
                });
            }
            if (rows.length !== 0) return res.status(401).json({
                status: 401,
                message: `Email already exist.`,
                error: `Duplicate.`
            });
            next();
        })
    } catch (error) {
        console.log(`Server error controller/findEmail/ ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
}

router
    .route("/")
    .get(JWT.verifyAccessToken, (req, res) => {
        const id = req.query.id;
        try {
            const sql = "SELECT id, first_name, middle_name, last_name, suffix, email, gender, phone_number, birth_date, role, barangay, status FROM user WHERE id != ?";


            db.query(sql, id, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/user/get: ${err}`);
                    return res.status(500).json({
                        status: 500,
                        message: `Internal Server Error, ${err}`,
                    });
                }

                if (rows.length === 0) return res.status(200).json({
                    error: "200",
                    message: "No Record found"
                })

                return res.status(200).json({
                    status: 200,
                    message: `Successfully retrieved ${rows.length} record/s`,
                    data: rows,
                });
            });
        } catch (error) {
            console.log(`Server error controller/user/post: ${error}`);
            res.status(500).json({
                status: 500,
                message: `Internal Server Error, ${error}`,
            });
        }
    })
    .post(findEmail, async (req, res) => {
        const { first_name, middle_name, last_name, suffix, email, gender, password, phone_number, role, birth_date, barangay } =
            req.body;
        const id = crypto.randomUUID().split("-")[4];
        const hashedPassword = await bcrypt.hash(password, 13);

        const credentials = [
            id,
            first_name,
            middle_name,
            last_name,
            email,
            gender,
            hashedPassword,
            phone_number,
            role,
            birth_date,
            suffix,
            barangay
        ];
        console.log(birth_date)

        const sql = `INSERT INTO user (id, first_name, middle_name, last_name, email, gender, password, phone_number, role, birth_date, suffix, barangay) 
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        try {
            db.query(sql, credentials, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/user/post: ${err}`);
                    return res.status(500).json({
                        status: 500,
                        message: `Internal Server Error, ${err}`,
                    });
                }
                return res.status(200).json({
                    status: 200,
                    message: "Successfully created",
                    data: rows,
                });
            });
        } catch (error) {
            console.log(`Server error controller/user/post: ${error}`);
            res.status(500).json({
                status: 500,
                message: `Internal Server Error, ${error}`,
            });
        }
    });

// UPDATE AND DELETE API

router
    .route("/")
    .put(JWT.verifyAccessToken, async (req, res) => {
        const { first_name, middle_name, last_name, phone_number, role, password, gender, suffix, birth_date, email, status } = req.body;
        const id = req.query.id;
        let hashedPassword = "";
        let credentials = [];
        try {
            let sql = "";
            if (!password || password === null) {
                sql = `UPDATE user SET first_name = ?, middle_name = ?, last_name = ?, gender = ?, phone_number = ?, role = ?, suffix = ?
                WHERE id = ?`;
                credentials = [
                    first_name,
                    middle_name,
                    last_name,
                    gender,
                    phone_number,
                    role,
                    suffix,
                    id,
                ];
            } else {
                sql = `UPDATE user SET first_name = ?, middle_name = ?, last_name = ?, gender = ?, phone_number = ?, role = ?, password = ?, suffix = ?
                WHERE id = ?`;
                hashedPassword = await bcrypt.hash(password, 13);
                credentials = [
                    first_name,
                    middle_name,
                    last_name,
                    gender,
                    phone_number,
                    role,
                    hashedPassword,
                    suffix,
                    id,
                ];
            }
            console.log(credentials)
            db.query(sql, credentials, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/user/put: ${err}`);
                    return res.status(500).json({
                        status: 500,
                        message: `Internal Server Error, ${err}`,
                    });
                }

                return res.status(200).json({
                    status: 200,
                    message: "Successfully updated",
                    data: rows,
                });
            });
        } catch (error) {
            console.log(`Server error controller/user/put: ${error}`);
            res.status(500).json({
                status: 500,
                message: `Internal Server Error, ${error}`,
            });
        }
    })
    .delete(JWT.verifyAccessToken, (req, res) => {
        const id = req.query.id;
        try {
            const sql = 'DELETE FROM user WHERE id = ?';
            db.query(sql, id, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/user/delete: ${err}`);
                    return res.status(500).json({
                        status: 500,
                        message: `Internal Server Error, ${err}`,
                    });
                }
                return res.status(200).json({
                    status: 200,
                    message: 'Successfully Deleted',
                    data: rows
                })
            })
        } catch (error) {
            console.log(`Server error controller/user/delete: ${error}`);
            res.status(500).json({
                status: 500,
                message: `Internal Server Error, ${error}`,
            });
        }
    });

router.put('/changepassword', async (req, res) => {
    const { password, cpassword } = req.body
    const id = req.query.id;
    let hashedPassword = "";
    try {
        const sql = `UPDATE user SET password = ? WHERE id = ?`;
            

        hashedPassword = await bcrypt.hash(password, 13);
        db.query(sql, [hashedPassword, id], (err, rows) => {
            if (err) {
                console.log(`Server error controller/user/changepassword/put: ${err}`);
                return res.status(500).json({
                    status: 500,
                    message: `Internal Server Error, ${err}`,
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Successfully updated",
                data: rows,
            });
        });
    } catch (error) {
        console.log(`Server error controller/user/changepassword/put: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})


router.get("/:id", JWT.verifyAccessToken, (req, res) => {
    const id = req.params.id;
    try {
        sql = "SELECT * FROM user WHERE id = ?";

        db.query(sql, id, (err, rows) => {
            if (err) {
                console.log(`Server error controller/user/get: ${err}`);
                return res.status(500).json({
                    status: 500,
                    message: `Internal Server Error, ${err}`,
                });
            }

            if (rows.length === 0) return res.status(401).json({
                error: "401",
                message: "No Record found"
            })


            const result = {
                id: rows[0].id,
                first_name: rows[0].first_name,
                middle_name: rows[0].middle_name,
                last_name: rows[0].last_name,
                gender: rows[0].gender,
                email: rows[0].email,
                ranks: rows[0].ranks,
                suffix: rows[0].suffix,
                phone_number: rows[0].phone_number,
                role: rows[0].role,
                birth_date: rows[0].birth_date,
                address: rows[0].address
            }

            return res.status(200).json({
                status: 200,
                message: `Successfully retrieved ${rows.length} record/s`,
                data: result,
            });
        });
    } catch (error) {
        console.log(`Server error controller/user/post: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})

module.exports = router;