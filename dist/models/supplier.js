"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
// Define the user schema
const supplierSchema = new Schema({
    supplier: {
        type: String,
        required: true,
    },
    contactname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    adress: {
        type: String,
        required: false, // It's better to use `required` instead of `require`
    },
});
// Create models based on the schemas
const Supplier = model('Supplier', supplierSchema, 'suppliers');
//const OAuthUser = model('OAuthUser', oauthUserSchema, 'users');
exports.default = Supplier;
//# sourceMappingURL=supplier.js.map