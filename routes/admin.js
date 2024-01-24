const express = require('express');
const router = express.Router();

router.use('/user', require('../controller/user/index'));
router.use('/fileUpload', require('../controller/fileUpload/index'));
router.use('/otherInfo', require('../controller/otherInfo/index'));
router.use('/farm', require('../controller/farm/index'));
router.use('/subsidy', require('../controller/subsidy/index'));
router.use('/sendEmail', require('../controller/sendEmail/index'));


module.exports = router;