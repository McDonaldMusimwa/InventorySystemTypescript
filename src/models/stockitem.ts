import mongoose, { Document, Model, Schema } from 'mongoose';



export interface Shipment {
  productname: string;
  productdescription: string;
  quantityreceived: number;
  cost: number;
  totalcost: number;
  datereceived: Date;
}

export interface InventoryItem  {
  productId: string;
  productname: string;
  totalquantity: number;
  totalcost: number;
  shipments: Shipment[];
}

const shipmentSchema = new mongoose.Schema<Shipment>({
  productname: String,
  productdescription: String,
  quantityreceived: Number,
  cost: Number,
  totalcost: Number,
  datereceived: Date,
});

const stockSchema = new mongoose.Schema<InventoryItem>({
  productId: String,
  productname: String,
  totalquantity: Number,
  totalcost: Number,
  shipments: [shipmentSchema],
});

const StockItem: Model<InventoryItem> = mongoose.model('Stock', stockSchema, 'stock');

export default StockItem;
