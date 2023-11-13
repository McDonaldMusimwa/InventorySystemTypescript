const router = require('express').Router();


router.use('/user',require('./user'));
router.use('/stock',require('./stock'))
router.use('/order',require('./order'));
router.use('/supplier',require('./supplier'));
router.use('/shipment',require('./shipment'));


module.exports = router;