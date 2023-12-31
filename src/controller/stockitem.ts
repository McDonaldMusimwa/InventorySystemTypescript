import { Request, Response } from 'express';
import { InventoryItem, Shipment } from '../models/stockitem';
import StockItem from '../models/stockitem';
import ShipmentItem, { ShipmentReceived } from '../models/shipment';
import NewItem, { ProductItem } from '../models/productItem';



export default class InventoryController {
    public async addProduct(req: Request, res: Response): Promise<void> {
       
        try {
            const {
                productid,
                productname,
                unitspercase,
                description,

            } = req.body as ProductItem;

            if (!productid || !productname || !unitspercase || !description) {
                res.status(400).json({ error: 'Missing required fields' });
            } else {
                const newProduct: ProductItem = {
                    productid,
                    productname,
                    unitspercase,
                    description
                };

                
                const newStockItem ={
                    productId: req.body.productid,   // Check this property
                    productname: req.body.productname, // Check this property
                    totalquantity: 0,
                    totalcost: 0,
                    shipments: []
                }

                console.log(newStockItem)
            
                console.log('Received data in backend:', req.body);

                const product = new NewItem(newProduct);
                await product.save();
                console.log('Product saved successfully');
                
                const stock = new StockItem(newStockItem);
                await stock.save();
                console.log('New Stock saved successfully');
                res.status(201).json({ message: 'New product added successfully', inventory: product });
            }

        } catch {
            res.status(401).json({ message: "Internal server error" })
        }
    }


    public async addInventory(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Stock']
  
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
                res.status(400).json({ message: 'Missing required fields' });
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
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async deleteProduct(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Stock']
        try {
            await StockItem.deleteOne({ productId: req.params.productId })
            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Servir Error' })
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
                    shipments: shipments
                }
            })
            res.status(200).json(resulte);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' }); // Corrected typo in the response message
        }
    }

    public async addShipment(req: Request, res: Response): Promise<void> {
        console.log(req.body)
        //#swagger.tags=['Shipments']
        try {
            const {
                invoicenumber,
                datereceived,
                suppliername,
                shipmentdescription,
                totalreceived,
                totalcost,
                products
            } = req.body as ShipmentReceived;

            if (!invoicenumber || !datereceived || !suppliername || products.length === 0) {
                res.status(400).json({ message: 'Enter valid shipments details with products' });
                return;
            }

            const newShipment: ShipmentReceived = {
                invoicenumber,
                datereceived,
                suppliername,
                shipmentdescription,
                totalreceived,
                totalcost,
                products: products || []
            };

            // Add to the shipment collection
            const shipmentAdd = {
                invoicenumber: req.body.invoicenumber,
                datereceived: req.body.datereceived,
                suppliername: req.body.suppliername,
                shipmentdescription: req.body.shipmentdescription,
                totalreceived: req.body.totalreceived,
                totalcost: req.body.totalcost,
                products: req.body.products.map(product => ({
                    productid: product.productid,
                    productname: product.productname,
                    quantityreceived: product.quantityreceived,  // Add the quantityreceived property
                    cost: product.cost,
                    totalcost: product.totalcost,
                    expirydate: product.expirydate  // Add the expirydate property
                }))
            };

            const result = await new ShipmentItem(shipmentAdd);
            result.save();

            // Add to stock collection
            const productsToAdd = req.body.products;

            try {
                // Process each product in parallel
                await Promise.all(productsToAdd.map(async (product) => {
                    console.log('Product:', product);
                    const productId = product.productid;
                    let prod = await StockItem.findOne({ productId });
                    console.log('Existing Product:', prod);
                    
                    const ship = {
                      productid: product.productid,
                      productname: product.productname,
                      productdescription: product.productdescription,  // Include other properties as needed
                      quantityreceived: product.quantityreceived,
                      cost: product.cost,
                      totalcost: product.totalcost,
                      datereceived: req.body.datereceived,
                      expirydate: product.expirydate
                    };
                  
                    console.log('Ship:', ship);
                    
                    prod.shipments.push(ship);
                    await prod.save();
                  }));

                res.status(200).json({
                    message: 'Shipments added successfully'
                });

            } catch (error) {
                res.status(500).json({ message: 'Error adding shipments to stock', error: error.message });
            }
        } catch (error) {
            res.status(500).json({ messsage: error })
        }
    }


    public async getOneShipment(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Shipments']
        try {

            const shipmentid = req.params.id as string;
            console.log(shipmentid)
            if (!shipmentid) {
                res.status(400).json({ message: 'shipmentid query parameter is required' });
                return;
            }

            const result = await ShipmentItem.find({ _id: shipmentid })

            res.status(200).json(result)


        } catch (message) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    public async getAllShipments(req: Request, res: Response): Promise<void> {

        //#swagger.tags=['Shipments']
        try {



            const result = await ShipmentItem.find()

            const resulte = result.map((product) => {
                const totalquantity = product.products.reduce((total, shipment) => {
                    return total + shipment.quantityreceived
                }, 0)
                const totalcost = product.products.reduce((total, shipment) => {
                    return total + shipment.totalcost
                }, 0)

                const shipments = product.products
                return {
                    _id: product._id,
                    invoicenumber: product.invoicenumber,
                    datereceived: product.datereceived,
                    suppliername: product.suppliername,
                    shipmentdescrition: product.suppliername,

                    totalreceived: totalquantity,
                    totalcost: totalcost,
                    shipments: shipments
                }
            })

            res.status(200).json(resulte)


        } catch (message) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    public async getproductRange(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Stock']
       
        try {
            const result = await NewItem.find()
           
            res.status(200).json(result)
        } catch (message) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    public async getOneProduct(req: Request, res: Response): Promise<void> {
        //#swagger.tags=['Shipments']
        try {

            const productid = req.params.id as string;
            
            console.log(productid)
            if (!productid) {
                res.status(400).json({ message: 'productid query parameter is required' });
                return;
            }
            console.log(productid)
            const result = await StockItem.find({ productId: productid })

            res.status(200).json(result)
            

        } catch (message) {
            res.status(500).json({ message: 'Internal Server Error' })
        }

    }
}


