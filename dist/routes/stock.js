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
rout.post('/addproduct', async (req, res, next) => {
    try {
        const result = await stockObject.addInventory(req, res);
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error first layer' });
    }
});
rout.delete('/deleteproduct', async (req, res, next) => {
    try {
        const result = await stockObject.deleteProduct(req, res);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error first layer' });
    }
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