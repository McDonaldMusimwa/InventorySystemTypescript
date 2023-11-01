"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rout = require('express').Router();
const stockitem_1 = __importDefault(require("../controller/stockitem"));
let stockObject = new stockitem_1.default();
rout.get('/', (req, res, next) => {
    try {
        stockObject.getAllProducts(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error First layer' });
    }
});
rout.get('/getproductcatalogue', async (req, res, next) => {
    await stockObject.getproductRange(req, res);
});
rout.post('/addproduct', async (req, res, next) => {
    await stockObject.addProduct(req, res);
});
rout.delete('/deleteproduct', async (req, res, next) => {
    await stockObject.deleteProduct(req, res);
});
rout.post('/addshipment', async (req, res) => {
    await stockObject.addShipment(req, res);
});
rout.get('/shipments', async (req, res) => {
    await stockObject.getAllShipments(req, res);
});
rout.get('/allshipments', async (req, res) => {
    await stockObject.getAllShipmentsForAllProducts(req, res);
});
module.exports = rout;
//# sourceMappingURL=stock.js.map