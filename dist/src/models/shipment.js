"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    productid: String,
    productname: String,
    quantityreceived: Number,
    cost: Number,
    totalcost: Number,
    expirydate: Date,
});
const shipmentSchema = new mongoose_1.default.Schema({
    invoicenumber: String,
    datereceived: Date,
    suppliername: String,
    shipmentdescription: String,
    totalreceived: Number,
    totalcost: Number,
    products: [productSchema],
});
const ShipmentItem = mongoose_1.default.model('Shipment', shipmentSchema, 'shipments');
exports.default = ShipmentItem;
//# sourceMappingURL=shipment.js.map