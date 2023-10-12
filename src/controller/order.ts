import { Request, Response } from 'express';
import PurchaseOrder, { Order } from '../models/order';
import StockItem from '../models/shipment';
import Stock from '../models/stockitem';

export default class OrderController {
    public async addOrder(req: Request, res: Response): Promise<void> {
        try {
            const { customername, dateordered, products } = req.body as Order;

            if (!customername || !dateordered || !products || products.length === 0) {
                res.status(400).json({ message: 'Enter valid order details with products' });
                return;
            }

            const newOrder: Order = {
                customername,
                dateordered,
                products: products || [],
            };

            const orderItem = new PurchaseOrder(newOrder);
            await orderItem.save();

            const stockItem: any = await Stock.findOne({ productId: 20 })
            console.log("Item => " + stockItem)

            for (const product of newOrder.products) {
                const { productId, quantity } = product;

                if (productId && quantity) {
                    const stockItem: any = await Stock.findOne({ productId: productId });
                    console.log(stockItem)
                    if (!stockItem) {
                        console.log(`No StockItem found for productId: ${productId}`);
                        // Handle this case, e.g., by returning an error response
                        continue; // Skip this product and proceed to the next one
                    }

                    // Sort shipments by date received, earliest first
                    stockItem.shipments.sort(
                        (a, b) => new Date(a.datereceived).getTime() - new Date(b.datereceived).getTime()
                    );

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
                        } else {
                            // Deduct the entire quantityreceived from this shipment
                            remainingQuantity -= quantityreceived;
                            shipment.quantityreceived = 0; // No more quantity in this shipment
                        }
                        // Handle the case where there are no more shipments to deduct from
                        if (remainingQuantity > 0 && stockItem.shipments.indexOf(shipment) === stockItem.shipments.length - 1) {
                            // No more shipments to deduct from, handle this as needed
                            res.status(500).json({message:`Insufficient stock for productId: ${productId}`});
                        }
                    }

                    // Save the updated stockItem with deducted quantities
                    const result = await stockItem.save();
                    console.log(result);
                }
            }
            res.status(201).json({ message: 'Order added successfully', order: orderItem });
        } catch (error) {
            console.error(`Error adding order: ${error}`);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async getAllOrder(req: Request, res: Response): Promise<void> {

    }

    public async modifyOrder(req: Request, res: Response): Promise<void> {

    }
}