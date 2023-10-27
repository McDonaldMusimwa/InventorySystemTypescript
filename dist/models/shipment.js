"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const shipmentSchema = new mongoose_1.default.Schema({
    productid: String,
    productname: String,
    productdescription: String,
    quantityreceived: Number,
    cost: Number,
    totalcost: Number,
    datereceived: Date,
});
const ShipmentItem = mongoose_1.default.model('Shipment', shipmentSchema, 'shipments');
exports.default = ShipmentItem;
//# sourceMappingURL=shipment.js.map