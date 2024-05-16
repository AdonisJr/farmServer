
const db = require("../utils/database");

exports.isValidated = async (req, res, next) => {
    const { month, user_id } = req.body;
    try {
        const params = [month, user_id];
        let sql = "SELECT * FROM validation WHERE MONTH(created_at) = ? AND user_id = ?";
        db.query(sql, params, (err, rows) => {
            if (err) {
                console.log(`Server error controller/isValidated: ${err}`);
                return res.status(500).json({
                    status: 500,
                    message: `Internal Server Error, ${err}`,
                });
            }
            if (rows.length === 0) {
                console.log(`Server error controller/isValidated: ${err}`);
                return res.status(401).json({
                    status: 401,
                    message: `You need to request validation for this month`,
                    error: `Duplicate.`
                });
            }
            if (rows[0].status !== 'QUALIFIED') {
                console.log(`Server error controller/isValidated: ${err}`);
                return res.status(401).json({
                    status: 401,
                    message: `You are not qualified to request this month, please contact administrator.`,
                    error: `Duplicate.`
                });
            }

            next();
        })
    } catch (error) {
        console.log(`Server error controller/isValidated/ ${error}`);
        res.status(500).json({
            status: 500,
            message: `Internal Server Error, ${error}`,
        });
    }
}
