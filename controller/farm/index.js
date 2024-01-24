const express = require("express");
const router = express.Router();
const crypto = require("node:crypto");
const db = require("../../utils/database");
const bcrypt = require("bcrypt");
const JWT = require("../../middleware/JWT");

// GET ALL AND INSERT OFFICER

// const findEmail = (req, res, next) => {
//     const {email} = req.body;
//     console.log(email)
//     try {
//         let sql = "SELECt * FROM user WHERE email = ?";
//         db.query(sql, email, (err, rows) => {
//             if (err) {
//                 console.log(`Server error controller/findEmail: ${err}`);
//                 return res.status(500).json({
//                     status: 500,
//                     message: `Internal Server Error, ${err}`,
//                 });
//             }
//             if (rows.length !== 0) return res.status(401).json({
//                 status: 401,
//                 message: `Email already exist.`,
//                 error: `Duplicate.`
//             });
//             next();
//         })
//     } catch (error) {
//         console.log(`Server error controller/findEmail/ ${error}`);
//         res.status(500).json({
//             status: 500,
//             message: `Internal Server Error, ${error}`,
//         });
//     }
// }

router
    .route("/")
    .get(JWT.verifyAccessToken, (req, res) => {
        try {
            const sql = "SELECT * FROM farm_data INNER JOIN user ON farm_data.user_id = user.id";


            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/farm/get: ${err}`);
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
            console.log(`Server error controller/farm/get: ${error}`);
            res.status(500).json({
                status: 500,
                message: `Internal Server Error, ${error}`,
            });
        }
    })
    .post(JWT.verifyAccessToken, async (req, res) => {
        const { user_id, lat, lng, establish_date, lot_size } =
            req.body;
        const id = crypto.randomUUID().split("-")[4];
        console.log(lot_size)

        const sql = `INSERT INTO farm_data (id, user_id, lat, lng, lot_size, establish_date) 
    values (?, ?, ?, ?, ?, ?)`;
        try {
            db.query(sql, [id, user_id, lat, lng, lot_size, establish_date], (err, rows) => {
                if (err) {
                    console.log(`Server error controller/farm/post: ${err}`);
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
            console.log(`Server error controller/farm/post: ${error}`);
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
        const { first_name, middle_name, last_name, phone_number, role, password, gender, suffix } = req.body;
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

router.get("/get", JWT.verifyAccessToken, (req, res) => {
    const search = req.query.search || null;
    try {
        let sql = "SELECT user.first_name, user.middle_name, user.last_name, user.suffix, user.barangay, user.email, farm_data.* FROM farm_data INNER JOIN user ON farm_data.user_id = user.id";
        const credentials = [];
        if(search !== null){
            sql += " WHERE user.first_name LIKE ? OR user.middle_name LIKE ? OR user.last_name LIKE ? OR user.suffix LIKE ? or user.barangay LIKE ?"
            credentials.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
        }
        console.log(search)

        db.query(sql, credentials, (err, rows) => {
            if (err) {
                console.log(`Server error controller/farm/get/get: ${err}`);
                return res.status(500).json({
                    status: 500,
                    message: `Internal Server Error, ${err}`,
                });
            }
            console.log(sql)
            console.log(credentials)
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
        console.log(`Server error controller/farm/get/get: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})


router.get("/:id", JWT.verifyAccessToken, (req, res) => {
    const id = req.params.id;
    try {
        sql = "SELECT * FROM farm_data WHERE user_id = ?";

        db.query(sql, id, (err, rows) => {
            if (err) {
                console.log(`Server error controller/farm/get: ${err}`);
                return res.status(500).json({
                    status: 500,
                    message: `Internal Server Error, ${err}`,
                });
            }

            return res.status(200).json({
                status: 200,
                message: `Successfully retrieved ${rows.length} record/s`,
                data: rows,
            });
        });
    } catch (error) {
        console.log(`Server error controller/farm/post: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})

module.exports = router;