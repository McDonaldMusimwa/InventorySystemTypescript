"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    productId: String,
    productname: String,
    quantity: Number,
});
const stockSchema = new mongoose_1.default.Schema({
    customername: String,
    dateordered: Date,
    customerphone: String,
    customeremail: String,
    products: [productSchema],
});
const PurchaseOrder = mongoose_1.default.model('Order', stockSchema, 'order');
exports.default = PurchaseOrder;
//# sourceMappingURL=order.js.map