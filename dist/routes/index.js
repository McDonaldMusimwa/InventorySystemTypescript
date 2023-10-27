const router = require('express').Router();
router.use('/user', require('./user'));
router.use('/stock', require('./stock'));
router.use('/order', require('./order'));
router.use('/supplier', require('./supplier'));
module.exports = router;
//# sourceMappingURL=index.js.map