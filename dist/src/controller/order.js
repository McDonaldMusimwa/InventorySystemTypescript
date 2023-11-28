"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = __importDefault(require("../models/order"));
const stockitem_1 = __importDefault(require("../models/stockitem"));
class OrderController {
    async addOrder(req, res) {
        //#swagger.tags=['Order']
        try {
            const { customername, dateordered, customerphone, customeremail, products } = req.body;
            if (!customername || !dateordered || !customeremail || !customerphone || !products || products.length === 0) {
                res.status(400).json({ message: 'Enter valid order details with products' });
                return;
            }
            const newOrder = {
                customername,
                dateordered,
                customerphone,
                customeremail,
                products: products || [],
            };
            const orderItem = new order_1.default(newOrder);
            await orderItem.save();
            console.log(newOrder.products);
            for (const product of newOrder.products) {
                console.log(product);
                const { productId, quantity } = product;
                console.log(productId, quantity);
                if (productId && quantity) {
                    const stockItem = await stockitem_1.default.findOne({ productId: productId });
                    console.log(stockItem);
                    if (!stockItem) {
                        console.log(`No StockItem found for productId: ${productId}`);
                        // Handle this case, e.g., by returning an error response
                        continue; // Skip this product and proceed to the next one
                    }
                    // Sort shipments by date received, earliest first
                    stockItem.shipments.sort((a, b) => new Date(a.datereceived).getTime() - new Date(b.datereceived).getTime());
                    let remainingQuantity = quantity;
                    // Loop through shipments and deduct quantities
                    for (const shipment of stockItem.shipments) {
                        if (remainingQuantity <= 0) {
                            break; // No more quantity to deduct
                        }
                        const { quantityreceived } = shipment;
                        if (quantityreceived >= remainingQuantity) {
                            // Deduct the remainingQuantity from this shipment
                            shipment.quantityreceived -= remainingQuantity;
                            remainingQuantity = 0; // All quantity deducted
                        }
                        else {
                            // Deduct the entire quantityreceived from this shipment
                            remainingQuantity -= quantityreceived;
                            shipment.quantityreceived = 0; // No more quantity in this shipment
                        }
                        // Handle the case where there are no more shipments to deduct from
                        if (remainingQuantity > 0 && stockItem.shipments.indexOf(shipment) === stockItem.shipments.length - 1) {
                            // No more shipments to deduct from, handle this as needed
                            res.status(500).json({ message: `Insufficient stock for productId: ${productId}` });
                        }
                    }
                    // Save the updated stockItem with deducted quantities
                    const result = await stockItem.save();
                    console.log(result);
                }
            }
            res.status(201).json({ message: 'Order added successfully', order: orderItem });
        }
        catch (error) {
            console.error(`Error adding order: ${error}`);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getAllOrders(req, res) {
        //#swagger.tags=['Order']
        try {
            const orders = await order_1.default.find(); // Use 'await' to handle the asynchronous operation
            res.status(200).json(orders); // Correct the 'messsage' typo and include the 'orders'
        }
        catch (error) {
            res.status(401).json({ message: error.message }); // Include the error message in the response
        }
    }
    async getOrder(req, res) {
        //#swagger.tags=['Order']
        try {
            const orderid = req.params.orderid;
            const response = await order_1.default.find({ _id: orderid });
            if (response.length === 0) {
                res.status(404).json({ message: 'Order not found' });
            }
            else {
                res.status(200).json(response);
            }
        }
        catch (error) {
            res.status(401).json({ message: error });
        }
    }
    async modifyOrder(req, res) {
    }
}
exports.default = OrderController;
//# sourceMappingURL=order.js.map