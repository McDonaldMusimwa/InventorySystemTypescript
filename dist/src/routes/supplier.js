"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplierController_1 = __importDefault(require("../controller/supplierController"));
const route = (0, express_1.default)();
const supplier = new supplierController_1.default();
route.get('/', (req, res) => {
    supplier.getSuppliers(req, res);
});
route.get('/:supplierId', (req, res) => {
    supplier.getSupplier(req, res);
});
route.post('/addsupplier', (req, res) => {
    supplier.addSupplier(req, res);
});
route.patch('/:supplierId', (req, res) => {
    console.log('its here mow');
    supplier.modifySupplier(req, res);
});
route.delete('/:supplierId', (req, res) => {
    supplier.deleteSupplier(req, res);
});
module.exports = route;
//# sourceMappingURL=supplier.js.map