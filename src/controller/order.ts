import { Request, Response } from 'express';
import PurchaseOrder, { Order } from '../models/order';
import StockItem from '../models/shipment';
import Stock from '../models/stockitem';

export default class OrderController {
    public async addOrder(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Order']
        try {
            const { customername, dateordered,contactphone,contactemail, products } = req.body as Order;

            if (!customername || !dateordered ||!contactemail ||!contactphone || !products || products.length === 0) {
                res.status(400).json({ message: 'Enter valid order details with products' });
                return;
            }

            
            const newOrder: Order = {
                customername,
                dateordered,
                contactphone,
                contactemail,
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
                            res.status(500).json({ message: `Insufficient stock for productId: ${productId}` });
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

    public async getAllOrders(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Order']
        try {
          const orders = await PurchaseOrder.find(); // Use 'await' to handle the asynchronous operation
          res.status(200).json(orders ); // Correct the 'messsage' typo and include the 'orders'
        } catch (error) {
          res.status(401).json({ message: error.message }); // Include the error message in the response
        }
      }


    public async getOrder(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Order']
        try {
            const orderid = req.params.orderid as string;
            const response =await PurchaseOrder.find({_id:orderid})
            if (response.length === 0) {
                res.status(404).json({ message: 'Order not found' });
            } else {
                res.status(200).json( response );
            }
           

        } catch (error) {
            res.status(401).json({ message: error })
        }

    }




    public async modifyOrder(req: Request, res: Response): Promise<void> {

    }
}