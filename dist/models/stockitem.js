"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shipmentSchema = new mongoose_1.default.Schema({
    productname: String,
    productdescription: String,
    quantityreceived: Number,
    cost: Number,
    totalcost: Number,
    datereceived: Date,
});
const stockSchema = new mongoose_1.default.Schema({
    productId: String,
    productname: String,
    totalquantity: Number,
    totalcost: Number,
    shipments: [shipmentSchema],
});
const StockItem = mongoose_1.default.model('Stock', stockSchema, 'stock');
exports.default = StockItem;
//# sourceMappingURL=stockitem.js.map