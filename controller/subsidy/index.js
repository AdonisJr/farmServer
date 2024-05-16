const express = require("express");
const router = express.Router();
const crypto = require("node:crypto");
const db = require("../../utils/database");
const bcrypt = require("bcrypt");
const JWT = require("../../middleware/JWT");
const nodemailer = require('nodemailer');
const RFFA = require('../../middleware/RFFA');

router
    .route("/")
    .get(JWT.verifyAccessToken, (req, res) => {
        const page = parseInt(req.query.page) || 1; // default page is 1
        const limit = parseInt(req.query.limit) || 5; // default limit is 10
        const isCompleted = req.query.isCompleted;
        const q = req.query.q || null;
        const barangay = req.query.barangay || null;
        const type = req.query.type;
        const month = req.query.month || "";
        const year = req.query.year || "";

        try {
            const offset = (page - 1) * limit;
            let sql = ""

            sql = "SELECT COUNT(*) as totalCount FROM subsidy INNER JOIN user ON user.id = subsidy.user_id INNER JOIN farm_data on farm_data.id = subsidy.farm_id";

            let params1 = [];

            if (isCompleted === 'true') {
                sql += " WHERE subsidy.status = ?";
                params1.push("COMPLETED")
            } else {
                sql += " WHERE subsidy.status != ?";
                params1.push("COMPLETED")
            }

            sql += " AND subsidy.type = ?";
            params1.push(type)


            if (q !== null) {
                sql += " AND (first_name LIKE ? OR middle_name LIKE ? OR last_name LIKE ? OR SUFFIX LIKE ?)"
                params1.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`)
            }

            if (barangay !== null) {
                sql += " AND barangay LIKE ?"
                params1.push(`%${barangay}%`)
            }

            if (month !== '') {
                sql += " AND MONTH(subsidy.created_at) = ?"
                params1.push(month)
            } 
            if (year !== '') {
                sql += " AND YEAR(subsidy.created_at) = ?"
                params1.push(year)
            }

            let params2 = [];

            // Query total count
            db.query(sql, params1, (err, countResult) => {
                if (err) {
                    console.log(`Server error controller/subsidy/get: ${err}`);
                    return res.status(500).json({
                        status: 500,
                        message: `Internal Server Error, ${err}`,
                    });
                }

                const totalCount = countResult[0].totalCount;

                // Query data with pagination
                sql = `SELECT 
                user.first_name, user.middle_name, user.last_name, user.suffix, user.barangay, user.email, 
                farm_data.lot_size, farm_data.lat, farm_data.lng, farm_data.type AS crops,
                subsidy.* FROM subsidy INNER JOIN user ON user.id = subsidy.user_id INNER JOIN farm_data on farm_data.id = subsidy.farm_id`;

                if (isCompleted === 'true') {
                    sql += " WHERE subsidy.status = ?";
                    params2.push("COMPLETED")
                } else {
                    sql += " WHERE subsidy.status != ?";
                    params2.push("COMPLETED")
                }

                sql += " AND subsidy.type = ?";
                params2.push(type)

                if (q !== null) {
                    sql += " AND (first_name LIKE ? OR middle_name LIKE ? OR last_name LIKE ? OR SUFFIX LIKE ?)"
                    params2.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`)
                }

                if (barangay !== null) {
                    sql += " AND barangay LIKE ?"
                    params2.push(`%${barangay}%`)
                }

                if (month !== '') {
                    sql += " AND MONTH(subsidy.created_at) = ?"
                    params2.push(month)
                } 
                if (year !== '') {
                    sql += " AND YEAR(subsidy.created_at) = ?"
                    params2.push(year)
                }

                sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
                params2.push(limit, offset);

                db.query(sql, params2, (err, rows) => {
                    if (err) {
                        console.log(`Server error controller/subsidy/get data: ${err}`);
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
    })
    .post(JWT.verifyAccessToken, RFFA.isValidated, async (req, res) => {
        const { email, user_id, farm_id, type, amount, area_planted, number_bags, variety_received, quantity_received, month, year, status, remarks } =
            req.body;


        const sql = `INSERT INTO subsidy (farm_id, user_id, type, amount, area_planted, number_bags, variety_received, quantity_received, month, year, status, remarks) 
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const credentials = [farm_id, user_id, type, amount, area_planted, number_bags, variety_received, quantity_received, month, year, "PENDING", remarks]
        // Create a transporter with your email provider's SMTP settings

        try {
            db.query(sql, credentials, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/subsidy/post: ${err}`);
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
            console.log(`Server error controller/subsidy/post: ${error}`);
            res.status(500).json({
                status: 500,
                error: 500,
                message: `Internal Server Error, ${error}`,
            });
        }
    });

// UPDATE AND DELETE API

router
    .route("/")
    .put(JWT.verifyAccessToken, async (req, res) => {
        const { user_id, farm_id, type, amount, area_planted, number_bags, variety_received, quantity_received, month, year, status, remarks, received_date } =
            req.body;
        const id = req.query.id;
        try {
            const sql = `UPDATE subsidy SET user_id = ?, farm_id = ?, type = ?, amount = ?, area_planted = ?, number_bags = ?, variety_received = ?, quantity_received = ?, month = ?, year = ?, status = ?, remarks = ?, received_date = ?
                WHERE id = ?`;
            const credentials = [user_id, farm_id, type, amount, area_planted, number_bags, variety_received, quantity_received, month, year, status, remarks, received_date, id]

            db.query(sql, credentials, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/subsidy/put: ${err}`);
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
            console.log(`Server error controller/subsidy/put: ${error}`);
            res.status(500).json({
                status: 500,
                message: `Internal Server Error, ${error}`,
            });
        }
    })
    .delete(JWT.verifyAccessToken, (req, res) => {
        const id = req.query.id;
        try {
            const sql = 'DELETE FROM subsidy WHERE id = ?';
            db.query(sql, id, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/subsidy/delete: ${err}`);
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
            console.log(`Server error controller/subsidy/delete: ${error}`);
            res.status(500).json({
                status: 500,
                message: `Internal Server Error, ${error}`,
            });
        }
    });

router.get("/get", JWT.verifyAccessToken, (req, res) => {
    try {
        const sql = "SELECT user.* , farm_data.lat, farm_data.lng, farm_data.lot_size, farm_data.establish_date FROM farm_data INNER JOIN user ON farm_data.user_id = user.id";

        db.query(sql, (err, rows) => {
            if (err) {
                console.log(`Server error controller/farm/get/get: ${err}`);
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
        console.log(`Server error controller/farm/get/get: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})
router.get("/overalltotal", (req, res) => {
    try {
        sql = `SELECT
        type,
        COUNT(*) AS type_count,
        SUM(number_bags) AS total_bags,
        SUM(quantity_received) / 1000 AS total_kilos,
        SUM(amount) as total_cash
    FROM
        subsidy
        WHERE status = 'COMPLETED'
    GROUP BY
        type`;

        db.query(sql, (err, rows) => {
            if (err) {
                console.log(`Server error controller/subsidys/overalltotal/get: ${err}`);
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
        console.log(`Server error controller/subsidys/overalltotal/post: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})
router.get("/totalcash", JWT.verifyAccessToken, (req, res) => {
    try {
        sql = `SELECT
        YEAR(received_date) AS year,
        SUM(CAST(amount AS DECIMAL(10, 2))) AS total_cash_amount
    FROM
        subsidy
    WHERE
        type = 'CASH' AND status = 'COMPLETED'
    GROUP BY
    YEAR(received_date);`;

        db.query(sql, (err, rows) => {
            if (err) {
                console.log(`Server error controller/subsidys/overalltotal/get: ${err}`);
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
        console.log(`Server error controller/subsidys/overalltotal/post: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})
router.get("/totalbags", (req, res) => {
    try {
        sql = `
        SELECT
        YEAR(received_date) AS year,
        SUM(number_bags) AS total_bags
    FROM
        subsidy
    WHERE
        type = 'RCEF RICE SEED DISTIBUTION' AND status = 'COMPLETED'
    GROUP BY YEAR(received_date)`;

        db.query(sql, (err, rows) => {
            if (err) {
                console.log(`Server error controller/subsidys/overalltotal/get: ${err}`);
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
        console.log(`Server error controller/subsidys/overalltotal/post: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})

router.get("/cash", (req, res) => {
    try {
        const sql = `SELECT * FROM subsidy WHERE type = 'CASH' AND status = 'COMPLETED'`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(`Server error controller/subsidy/cash/get: ${err}`);
                return res.status(500).json({
                    status: 500,
                    message: `Internal Server Error, ${err}`,
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Successfully retrieved",
                data: rows,
            });
        });
    } catch (error) {
        console.log(`Server error controller/cash/get: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})

router.get("/rice", (req, res) => {
    try {
        const sql = `SELECT * FROM subsidy WHERE type = 'RCEF RICE SEED DISTIBUTION' AND status = 'COMPLETED'`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(`Server error controller/subsidy/cash/get: ${err}`);
                return res.status(500).json({
                    status: 500,
                    message: `Internal Server Error, ${err}`,
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Successfully retrieved",
                data: rows,
            });
        });
    } catch (error) {
        console.log(`Server error controller/cash/get: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})

router.get("/:id", JWT.verifyAccessToken, (req, res) => {
    const id = req.params.id;
    const type = req.query.type;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const isCompleted = req.query.isCompleted;
    try {
        const offset = (page - 1) * limit;
        let sql = ""

        sql = "SELECT COUNT(*) as totalCount FROM subsidy WHERE user_id = ? AND type = ?";

        let params1 = [id, type];

        if (isCompleted === 'true') {
            sql += " AND status = ?";
            params1.push("COMPLETED")
        } else {
            sql += " AND status != ?";
            params1.push("COMPLETED")
        }

        let params2 = [id, type];

        // Query total count
        db.query(sql, params1, (err, countResult) => {
            if (err) {
                console.log(`Server error controller/subsidys/get totalCount: ${err}`);
                return res.status(500).json({
                    status: 500,
                    message: `Internal Server Error, ${err}`,
                });
            }

            const totalCount = countResult[0].totalCount;

            // Query data with pagination
            sql = "SELECT * FROM subsidy WHERE user_id = ? AND type = ?";

            if (isCompleted === 'true') {
                sql += " AND status = ?";
                params2.push("COMPLETED")
            } else {
                sql += " AND status != ?";
                params2.push("COMPLETED")
            }

            sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            params2.push(limit, offset);

            db.query(sql, params2, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/subsidys/get data: ${err}`);
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
        console.log(`Server error controller/subsidys/post: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
});


router.put("/:id", JWT.verifyAccessToken, (req, res) => {
    const { type } =
        req.body;
    const id = req.params.id;
    try {
        const sql = `UPDATE subsidy SET type = ? WHERE id = ?`;
        db.query(sql, [type, id], (err, rows) => {
            if (err) {
                console.log(`Server error controller/subsidy/id/put: ${err}`);
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
        console.log(`Server error controller/id/put: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})


module.exports = router;