"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const sinon_1 = __importDefault(require("sinon"));
const order_1 = __importDefault(require("../src/controller/order"));
const order_2 = __importDefault(require("../src/models/order"));
const stockitem_1 = __importDefault(require("../src/models/stockitem"));
(0, mocha_1.describe)('OrderController', () => {
    (0, mocha_1.describe)('addOrder', () => {
        (0, mocha_1.it)('should add a new order successfully', async () => {
            const request = {
                body: {
                    customername: 'John Doe',
                    dateordered: new Date(),
                    customerphone: '1234567890',
                    customeremail: 'john.doe@example.com',
                    products: [
                        {
                            productId: '1',
                            quantity: 5,
                        },
                    ],
                },
            };
            const response = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub(),
            };
            // Mock the necessary methods for testing
            sinon_1.default.stub(order_2.default.prototype, 'save').resolves({});
            sinon_1.default.stub(stockitem_1.default, 'findOne').resolves({
                productId: '1',
                shipments: [{ quantityreceived: 10 }],
                save: sinon_1.default.stub(),
            });
            const orderController = new order_1.default();
            await orderController.addOrder(request, response);
            sinon_1.default.assert.calledOnce(response.status);
            sinon_1.default.assert.calledWith(response.status, 201);
            sinon_1.default.assert.calledOnce(response.json);
            sinon_1.default.assert.calledWith(response.json, { message: 'Order added successfully', order: {} });
        });
        (0, mocha_1.it)('should handle error when adding an order', async () => {
            const request = {
                body: {
                // Invalid request to trigger an error
                },
            };
            const response = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub(),
            };
            const orderController = new order_1.default();
            await orderController.addOrder(request, response);
            sinon_1.default.assert.calledOnce(response.status);
            sinon_1.default.assert.calledWith(response.status, 400);
            sinon_1.default.assert.calledOnce(response.json);
            sinon_1.default.assert.calledWith(response.json, { message: 'Enter valid order details with products' });
        });
    });
    // Add more test cases for other methods in OrderController
});
//# sourceMappingURL=orderController.test.js.map