"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import  isAuthenticated  from '../auth/is-auth';
const express_1 = require("express");
const stockitem_1 = __importDefault(require("../controller/stockitem"));
const router = (0, express_1.Router)();
let stockObject = new stockitem_1.default();
router.get('/', (req, res, next) => {
    try {
        stockObject.getAllShipments(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error First layer' });
    }
});
router.get('/:id', async (req, res) => {
    stockObject.getOneShipment(req, res);
});
router.post('/addshipment', async (req, res) => {
    console.log('add shipment');
    await stockObject.addShipment(req, res);
});
module.exports = router;
//# sourceMappingURL=shipment.js.map