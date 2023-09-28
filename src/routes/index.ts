const router = require('express').Router();


router.use('/user',require('./user'));
router.use('/stock',require('./stock'));

module.exports = router;