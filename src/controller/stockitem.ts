import { Request, Response } from 'express';
import { InventoryItem, Shipment } from '../models/stockitem';
import StockItem from '../models/stockitem';
import ShipmentItem from '../models/shipment';
import NewItem, { ProductItem } from '../models/productItem';



export default class InventoryController {
    public async addProduct(req: Request, res: Response): Promise<void> {
        try {
            const {
                productId,
                productname,
                unitspercase,
                description,

            } = req.body as ProductItem;

            if (!productId || !productname || !unitspercase) {
                res.status(400).json({ error: 'Missing required fields' });
            } else {
                const newProduct: ProductItem = {
                    productId,
                    productname,
                    unitspercase,
                    description
                };
                //console.log(newProduct)
                const product = new NewItem(newProduct);
                await product.save();
                res.status(201).json({ message: 'Inventory added successfully', inventory: product });
            }

        } catch {
            res.status(401).json({ message: "Internal server error" })
        }
    }


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
            console.log(result)
            const resulte = result.map((product) => {
                const totalquantity = product.shipments.reduce((total, shipment) => {
                    return total + shipment.quantityreceived
                }, 0)
                const totalcost = product.shipments.reduce((total, shipment) => {
                    return total + shipment.totalcost
                }, 0)

                const shipments = product.shipments
                return {
                    productID: product.productId,
                    productname: product.productname,
                    totalquantity: totalquantity,
                    totalcost: totalcost,
                    shipments:shipments
                }
            })
            res.status(200).json(resulte);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' }); // Corrected typo in the response message
        }
    }

    public async addShipment(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Shipments']
        try {
            const productId = req.body.productid;

            let product = await StockItem.findOne({ productId: productId });
            const {
                productname,
                productdescription,
                quantityreceived,
                cost,
                totalcost,
                datereceived
            } = req.body as Shipment;



            const newShipment: Shipment = {

                productname,
                productdescription,
                quantityreceived,
                cost,
                totalcost,
                datereceived,
            };

            //add to the shipment collection
            const shipmentadd = {
                productid: productId,
                productname: req.body.productname,
                productdescription: req.body.productdescription,
                quantityreceived: req.body.quantityreceived,
                cost: req.body.cost,
                totalcost: cost * quantityreceived,
                datereceived: req.body.datereceived
            }
            const result = await new ShipmentItem(shipmentadd)
            result.save();
            // add to stock collection
            product.shipments.push(newShipment)
            const response = await product.save()
            res.status(200).json({
                messege: 'Shipment added ',
                response: response
            })

        } catch (message) {
            res.status(500).json({ message: "No product found" })
        }
    }

    public async getAllShipmentsForOneProduct(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Shipments']
        try {

            const productid = req.query.productid;

            const result = await ShipmentItem.find({ productid: productid })
            console.log(result)
            res.status(200).json(result)


        } catch (message) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    public async getAllShipmentsForAllProducts(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Shipments']
        try {


            
            const result = await ShipmentItem.find()
            
            res.status(200).json(result)


        } catch (message) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
    
    public async getproductRange(req:Request,res:Response):Promise<void>{
        try{
            const result = await NewItem.find()
            res.status(200).json(result)
        }catch(message){
            res.status(500).json({message:'Internal Server Error'})
        }
    }

}


