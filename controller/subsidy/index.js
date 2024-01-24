const express = require("express");
const router = express.Router();
const crypto = require("node:crypto");
const db = require("../../utils/database");
const bcrypt = require("bcrypt");
const JWT = require("../../middleware/JWT");
const nodemailer = require('nodemailer');

router
    .route("/")
    .get(JWT.verifyAccessToken, (req, res) => {
        const user_id = req.query.user_id;
        const type = req.query.type
        const month = req.query.month
        const year = req.query.year
        try {


            let sql = "SELECT subsidy.*, farm_data.lat, farm_data.lng, farm_data.lot_size FROM subsidy INNER JOIN farm_data ON farm_data.id = subsidy.farm_id WHERE subsidy.user_id = ?";

            const params = [user_id];

            console.log(type, month, year)
            if (type !== "ALL") {
                sql += " AND type = ?";
                params.push(type);
            }
            console.log(user_id)

            // Add conditions for month and year if they are provided
            if (month !== 'undefined') {
                sql += " AND subsidy.month = ?";
                params.push(month);
            }

            if (year !== 'undefined') {
                sql += " AND subsidy.year = ?";
                params.push(year);
            }
            sql += "  ORDER BY created_at desc"

            db.query(sql, params, (err, rows) => {
                if (err) {
                    console.log(`Server error controller/subsidy/get: ${err}`);
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
            console.log(`Server error controller/subsidy/get: ${error}`);
            res.status(500).json({
                status: 500,
                message: `Internal Server Error, ${error}`,
            });
        }
    })
    .post(JWT.verifyAccessToken, async (req, res) => {
        const { email, user_id, farm_id, type, amount, area_planted, number_bags, variety_received, quantity_received, month, year, status, remarks } =
            req.body;

        const sql = `INSERT INTO subsidy (farm_id, user_id, type, amount, area_planted, number_bags, variety_received, quantity_received, month, year, status, remarks) 
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const credentials = [farm_id, user_id, type, amount, area_planted, number_bags, variety_received, quantity_received, month, year, status, remarks]
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
                message: `Internal Server Error, ${error}`,
            });
        }
    });

// UPDATE AND DELETE API

router
    .route("/")
    .put(JWT.verifyAccessToken, async (req, res) => {
        const { user_id, farm_id, type, amount, area_planted, number_bags, variety_received, quantity_received, month, year, status, remarks } =
            req.body;
        const id = req.query.id;
        try {
            const sql = `UPDATE subsidy SET user_id = ?, farm_id = ?, type = ?, amount = ?, area_planted = ?, number_bags = ?, variety_received = ?, quantity_received = ?, month = ?, year = ?, status = ?, remarks = ?
                WHERE id = ?`;
            const credentials = [user_id, farm_id, type, amount, area_planted, number_bags, variety_received, quantity_received, month, year, status, remarks, id]

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
        COUNT(*) AS type_count
    FROM
        subsidy
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
router.get("/totalcash", (req, res) => {
    try {
        sql = `SELECT
        year,
        SUM(CAST(amount AS DECIMAL(10, 2))) AS total_cash_amount
    FROM
        subsidy
    WHERE
        subsidy.type = 'CASH'
    GROUP BY
        subsidy.year;`;

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
        year,
        SUM(number_bags) AS total_bags
    FROM
        subsidy
    WHERE
        type = 'RCEF RICE SEED DISTIBUTION'
    GROUP BY year`;

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

router.get("/:id", JWT.verifyAccessToken, (req, res) => {
    const id = req.params.id;
    const type = req.query.type;
    try {
        sql = "SELECT * FROM subsidy WHERE user_id = ? AND type= ?";

        db.query(sql, [id, type], (err, rows) => {
            if (err) {
                console.log(`Server error controller/subsidys/get: ${err}`);
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
        console.log(`Server error controller/subsidys/post: ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
})

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