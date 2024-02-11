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
            const sql = "SELECT user.first_name, user.middle_name, user.last_name, user.suffix, user.barangay, farm_data.* FROM farm_data INNER JOIN user ON farm_data.user_id = user.id";


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
        const { user_id, lat, lng, establish_date, lot_size, status } =
            req.body;
        const id = crypto.randomUUID().split("-")[4];
        console.log(lot_size)

        const sql = `INSERT INTO farm_data (id, user_id, lat, lng, lot_size, establish_date, status) 
    values (?, ?, ?, ?, ?, ?, ?)`;
        try {
            db.query(sql, [id, user_id, lat, lng, lot_size, establish_date, status], (err, rows) => {
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
        const { user_id, lat, lng, lot_size, establish_date, status, remarks, id } = req.body;

        try {
            const sql = `UPDATE farm_data SET user_id = ?, lat = ?, lng = ?, lot_size = ?, establish_date = ?, status = ?, remarks = ? WHERE id = ?`;
            const params = [
                user_id,
                lat,
                lng,
                lot_size,
                establish_date,
                status,
                remarks,
                id
            ];
            db.query(sql, params, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/farm/put: ${err}`);
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
            console.log(`Server error controller/farm/put: ${error}`);
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
        if (search !== null) {
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

router.get("/list", JWT.verifyAccessToken, (req, res) => {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1; // default page is 1
    const limit = parseInt(req.query.limit) || 5; // default limit is 10
    const isCompleted = req.query.isCompleted;
    const q = req.query.q || null;

    try {
        const offset = (page - 1) * limit;
        let sql = ""

        sql = "SELECT COUNT(*) as totalCount FROM farm_data INNER JOIN user ON farm_data.user_id = user.id";

        let params1 = [];

        if (isCompleted === 'true') {
            sql += " WHERE farm_data.status = ?";
            params1.push("APPROVED")
        } else {
            sql += " WHERE farm_data.status != ?";
            params1.push("APPROVED")
        }

        if(q !== null){
            sql += " AND (first_name LIKE ? OR middle_name LIKE ? OR last_name LIKE ? OR SUFFIX LIKE ? OR barangay LIKE ?)"
            params1.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`)
        }

        let params2 = [];

        // Query total count
        db.query(sql, params1, (err, countResult) => {
            if (err) {
                console.log(`Server error controller/farm/list/get: ${err}`);
                return res.status(500).json({
                    status: 500,
                    message: `Internal Server Error, ${err}`,
                });
            }

            const totalCount = countResult[0].totalCount;

            // Query data with pagination
            sql = "SELECT user.first_name, user.middle_name, user.last_name, user.suffix, user.barangay, farm_data.* FROM farm_data INNER JOIN user ON farm_data.user_id = user.id";

            if (isCompleted === 'true') {
                sql += " WHERE farm_data.status = ?";
                params2.push("APPROVED")
            } else {
                sql += " WHERE farm_data.status != ?";
                params2.push("APPROVED")
            }

            if(q !== null){
                sql += " AND (first_name LIKE ? OR middle_name LIKE ? OR last_name LIKE ? OR SUFFIX LIKE ? OR barangay LIKE ?)"
                params2.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`)
            }

            sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            params2.push(limit, offset);

            db.query(sql, params2, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/farm/list/get data: ${err}`);
                    return res.status(500).json({
                        status: 500,
                        message: `Internal Server Error, ${err}`,
                    });
                }

                return res.status(200).json({
                    status: 200,
                    message: `Successfully retrieved ${rows.length} record/s`,
                    data: rows,
                    totalCount: totalCount // Include total count in the response
                });
            });
        });
    } catch (error) {
        console.log(`Server error controller/farm/list/get: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
});


router.get("/:id", JWT.verifyAccessToken, (req, res) => {
    const id = req.params.id;
    const status = req.query.status || null;
    try {
        sql = "SELECT * FROM farm_data WHERE user_id = ?";
        const params = [id];
        if (status !== null) {
            if (status === "APPROVED") {
                sql += " AND status = ?";
                params.push(status)
            } else {
                sql += " AND status <> ?";
                params.push("APPROVED")
            }

        }


        db.query(sql, params, (err, rows) => {
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