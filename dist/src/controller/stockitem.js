"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stockitem_1 = __importDefault(require("../models/stockitem"));
const shipment_1 = __importDefault(require("../models/shipment"));
const productItem_1 = __importDefault(require("../models/productItem"));
class InventoryController {
    async addProduct(req, res) {
        try {
            const { productid, productname, unitspercase, description, } = req.body;
            if (!productid || !productname || !unitspercase || !description) {
                res.status(400).json({ error: 'Missing required fields' });
            }
            else {
                const newProduct = {
                    productid,
                    productname,
                    unitspercase,
                    description
                };
                const newStockItem = {
                    productId: req.body.productid,
                    productname: req.body.productname,
                    totalquantity: 0,
                    totalcost: 0,
                    shipments: []
                };
                console.log(newStockItem);
                console.log('Received data in backend:', req.body);
                const product = new productItem_1.default(newProduct);
                await product.save();
                console.log('Product saved successfully');
                const stock = new stockitem_1.default(newStockItem);
                await stock.save();
                console.log('New Stock saved successfully');
                res.status(201).json({ message: 'New product added successfully', inventory: product });
            }
        }
        catch {
            res.status(401).json({ message: "Internal server error" });
        }
    }
    async addInventory(req, res) {
        //#swagger.tags=['Stock']
        try {
            const { productId, productname, totalquantity, totalcost, shipments, } = req.body;
            // Validate the input
            if (!productId || !productname || !totalquantity || !totalcost) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }
            const newInventory = {
                productId,
                productname,
                totalquantity,
                totalcost,
                shipments: shipments || [],
            };
            console.log(newInventory);
            const stockItem = new stockitem_1.default(newInventory);
            await stockItem.save();
            res.status(201).json({ message: 'Inventory added successfully', inventory: stockItem });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async deleteProduct(req, res) {
        //#swagger.tags=['Stock']
        try {
            await stockitem_1.default.deleteOne({ productId: req.params.productId });
            res.status(200).json({ message: "Product deleted successfully" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Servir Error' });
        }
    }
    async getAllProducts(req, res) {
        //#swagger.tags=['Stock']
        try {
            const result = await stockitem_1.default.find();
            console.log(result);
            const resulte = result.map((product) => {
                const totalquantity = product.shipments.reduce((total, shipment) => {
                    return total + shipment.quantityreceived;
                }, 0);
                const totalcost = product.shipments.reduce((total, shipment) => {
                    return total + shipment.totalcost;
                }, 0);
                const shipments = product.shipments;
                return {
                    productID: product.productId,
                    productname: product.productname,
                    totalquantity: totalquantity,
                    totalcost: totalcost,
                    shipments: shipments
                };
            });
            res.status(200).json(resulte);
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' }); // Corrected typo in the response message
        }
    }
    async addShipment(req, res) {
        console.log(req.body);
        //#swagger.tags=['Shipments']
        try {
            const { invoicenumber, datereceived, suppliername, shipmentdescription, totalreceived, totalcost, products } = req.body;
            if (!invoicenumber || !datereceived || !suppliername || products.length === 0) {
                res.status(400).json({ message: 'Enter valid shipments details with products' });
                return;
            }
            const newShipment = {
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
                    quantityreceived: product.quantityreceived,
                    cost: product.cost,
                    totalcost: product.totalcost,
                    expirydate: product.expirydate // Add the expirydate property
                }))
            };
            const result = await new shipment_1.default(shipmentAdd);
            result.save();
            // Add to stock collection
            const productsToAdd = req.body.products;
            try {
                // Process each product in parallel
                await Promise.all(productsToAdd.map(async (product) => {
                    console.log('Product:', product);
                    const productId = product.productid;
                    let prod = await stockitem_1.default.findOne({ productId });
                    console.log('Existing Product:', prod);
                    const ship = {
                        productid: product.productid,
                        productname: product.productname,
                        productdescription: product.productdescription,
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
            }
            catch (error) {
                res.status(500).json({ message: 'Error adding shipments to stock', error: error.message });
            }
        }
        catch (error) {
            res.status(500).json({ messsage: error });
        }
    }
    async getOneShipment(req, res) {
        //#swagger.tags=['Shipments']
        try {
            const shipmentid = req.params.id;
            console.log(shipmentid);
            if (!shipmentid) {
                res.status(400).json({ message: 'shipmentid query parameter is required' });
                return;
            }
            const result = await shipment_1.default.find({ _id: shipmentid });
            res.status(200).json(result);
        }
        catch (message) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getAllShipments(req, res) {
        //#swagger.tags=['Shipments']
        try {
            const result = await shipment_1.default.find();
            const resulte = result.map((product) => {
                const totalquantity = product.products.reduce((total, shipment) => {
                    return total + shipment.quantityreceived;
                }, 0);
                const totalcost = product.products.reduce((total, shipment) => {
                    return total + shipment.totalcost;
                }, 0);
                const shipments = product.products;
                return {
                    _id: product._id,
                    invoicenumber: product.invoicenumber,
                    datereceived: product.datereceived,
                    suppliername: product.suppliername,
                    shipmentdescrition: product.suppliername,
                    totalreceived: totalquantity,
                    totalcost: totalcost,
                    shipments: shipments
                };
            });
            res.status(200).json(resulte);
        }
        catch (message) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getproductRange(req, res) {
        //#swagger.tags=['Stock']
        try {
            const result = await productItem_1.default.find();
            res.status(200).json(result);
        }
        catch (message) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getOneProduct(req, res) {
        //#swagger.tags=['Shipments']
        try {
            const productid = req.params.id;
            console.log(productid);
            if (!productid) {
                res.status(400).json({ message: 'productid query parameter is required' });
                return;
            }
            console.log(productid);
            const result = await stockitem_1.default.find({ productId: productid });
            res.status(200).json(result);
        }
        catch (message) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
exports.default = InventoryController;
//# sourceMappingURL=stockitem.js.map