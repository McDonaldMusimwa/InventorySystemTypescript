"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stockSchema = new mongoose_1.default.Schema({
    productid: String,
    productname: String,
    unitspercase: String,
    description: String
});
const NewItem = mongoose_1.default.model('ProductRange', stockSchema, 'productrange');
exports.default = NewItem;
//# sourceMappingURL=productItem.js.map