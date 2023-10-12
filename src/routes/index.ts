const router = require('express').Router();


router.use('/user',require('./user'));
router.use('/stock',require('./stock'));
router.use('/order',require('./order'));


module.exports = router;