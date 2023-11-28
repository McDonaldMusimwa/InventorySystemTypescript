"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = __importDefault(require("../controller/order"));
const router = (0, express_1.default)();
const orderController = new order_1.default();
router.get('/', (req, res) => {
    orderController.getAllOrders(req, res);
});
router.patch('/orderid', (req, res) => {
    orderController.modifyOrder(req, res);
});
router.post('/addorder', (req, res) => {
    orderController.addOrder(req, res);
});
router.get('/getorder/:orderid', (req, res) => {
    orderController.getOrder(req, res);
});
module.exports = router;
//# sourceMappingURL=order.js.map