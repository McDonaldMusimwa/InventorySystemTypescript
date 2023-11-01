"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const stockitem_1 = __importDefault(require("../controller/stockitem"));
let stockObject = new stockitem_1.default();
router.get('/', (req, res, next) => {
    try {
        stockObject.getAllProducts(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error First layer' });
    }
});
router.get('/getproductcatalogue', async (req, res, next) => {
    await stockObject.getproductRange(req, res);
});
router.post('/addproduct', async (req, res, next) => {
    await stockObject.addProduct(req, res);
});
router.delete('/deleteproduct', async (req, res, next) => {
    await stockObject.deleteProduct(req, res);
});
router.post('/addshipment', async (req, res) => {
    await stockObject.addShipment(req, res);
});
router.get('/productshipments', async (req, res) => {
    await stockObject.getAllShipmentsForOneProduct(req, res);
});
router.get('/allshipments', async (req, res) => {
    await stockObject.getAllShipmentsForAllProducts(req, res);
});
module.exports = router;
//# sourceMappingURL=stock.js.map