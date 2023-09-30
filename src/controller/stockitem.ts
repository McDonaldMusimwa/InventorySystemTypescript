import { Request, Response } from 'express';
import { InventoryItem } from '../models/stockitem';
import StockItem from '../models/stockitem';
//const { StockItem, InventoryItem } = require('../models/stockitem');

export default class InventoryController {
    public async addInventory(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Stock']
        console.log(req.body)
        try {
            const {
                productId,
                productname,
                totalquantity,
                totalcost,
                shipments,
            } = req.body as InventoryItem;
            /* {
                productId: string;
                productname: string;
                totalquantity: number;
                totalcost: number;
                shipments?: InventoryItem['shipments'];
            };*/

            // Validate the input
            if (!productId || !productname || !totalquantity || !totalcost) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const newInventory: InventoryItem = {
                productId,
                productname,
                totalquantity,
                totalcost,
                shipments: shipments || [],
            };

            console.log(newInventory)

            const stockItem = new StockItem(newInventory);
            await stockItem.save();

            res.status(201).json({ message: 'Inventory added successfully', inventory: stockItem });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public async deleteProduct(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Stock']
        try {
            await StockItem.deleteOne({ productId: req.params.productId })
            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Servir Error' })
        }
    }

    public async getAllProducts(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Stock']
        try {
            const result = await StockItem.find();
            const resulte = result.map((product) => {
                const totalquantity = product.shipments.reduce((total, shipment) => {
                    return total + shipment.quantityreceived
                }, 0)
                const totalcost = product.shipments.reduce((total, shipment) => {
                    return total + shipment.totalcost
                },0)
                return {
                    productID: product.productId,
                    productname: product.productname,
                    totalquantity: totalquantity,
                    totalcost: totalcost
                }
            })
            res.status(200).json(resulte);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' }); // Corrected typo in the response message
        }
    }

    public async addShipment(req:Request,res:Response):Promise<void>{
        //#swagger.tags=['Stock']
    }
}


