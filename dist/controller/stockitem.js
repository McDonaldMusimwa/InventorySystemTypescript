"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Inventory_1 = require("../models/Inventory");
class InventoryController {
    async addInventory(req, res) {
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
            const stockItem = new Inventory_1.default(newInventory);
            await stockItem.save();
            res.status(201).json({ message: 'Inventory added successfully', inventory: stockItem });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
exports.default = InventoryController;
//# sourceMappingURL=stockitem.js.map