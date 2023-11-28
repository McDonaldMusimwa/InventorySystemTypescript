"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockitem_1 = __importDefault(require("../controller/stockitem"));
let stockObject = new stockitem_1.default();
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    try {
        await stockObject.getAllProducts(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error First layer' });
    }
});
router.get('/getproductcatalogue', async (req, res, next) => {
    await stockObject.getproductRange(req, res);
});
router.get('/getoneproduct/:id', async (req, res, next) => {
    console.log('get one product');
    await stockObject.getOneProduct(req, res);
});
router.post('/addproduct', async (req, res, next) => {
    console.log("Add product route");
    await stockObject.addProduct(req, res);
});
router.delete('/deleteproduct', async (req, res, next) => {
    await stockObject.deleteProduct(req, res);
});
module.exports = router;
//# sourceMappingURL=stock.js.map