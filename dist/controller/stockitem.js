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
            const { productId, productname, unitspercase, description, } = req.body;
            if (!productId || !productname || !unitspercase) {
                res.status(400).json({ error: 'Missing required fields' });
            }
            else {
                const newProduct = {
                    productId,
                    productname,
                    unitspercase,
                    description
                };
                //console.log(newProduct)
                const product = new productItem_1.default(newProduct);
                await product.save();
                res.status(201).json({ message: 'Inventory added successfully', inventory: product });
            }
        }
        catch {
            res.status(401).json({ message: "Internal server error" });
        }
    }
    async addInventory(req, res) {
        //#swagger.tags=['Stock']
        console.log(req.body);
        try {
            const { productId, productname, totalquantity, totalcost, shipments, } = req.body;
            // Validate the input
            if (!productId || !productname || !totalquantity || !totalcost) {
                res.status(400).json({ error: 'Missing required fields' });
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
            res.status(500).json({ error: 'Internal Server Error' });
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
            res.status(500).json({ error: 'Internal Servir Error' });
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
        //#swagger.tags=['Shipments']
        try {
            const productId = req.body.productid;
            let product = await stockitem_1.default.findOne({ productId: productId });
            const { productname, productdescription, quantityreceived, cost, totalcost, datereceived } = req.body;
            const newShipment = {
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
            };
            const result = await new shipment_1.default(shipmentadd);
            result.save();
            // add to stock collection
            product.shipments.push(newShipment);
            const response = await product.save();
            res.status(200).json({
                messege: 'Shipment added ',
                response: response
            });
        }
        catch (message) {
            res.status(500).json({ message: "No product found" });
        }
    }
    async getAllShipmentsForOneProduct(req, res) {
        //#swagger.tags=['Shipments']
        try {
            const productid = req.params.productid;
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
    async getAllShipmentsForAllProducts(req, res) {
        //#swagger.tags=['Shipments']
        try {
            const result = await shipment_1.default.find();
            res.status(200).json(result);
        }
        catch (message) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getproductRange(req, res) {
        try {
            const result = await productItem_1.default.find();
            res.status(200).json(result);
        }
        catch (message) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
exports.default = InventoryController;
//# sourceMappingURL=stockitem.js.map