import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Product {
    productid: string;
    productname: string;
    quantityreceived: number;
    cost: number;
    totalcost: number;
    expirydate: Date;
}

export interface ShipmentReceived {
    invoicenumber: string;
    datereceived: Date; // Corrected from String to Date
    suppliername: string;
    shipmentdescription: string;
    totalreceived: number;
    totalcost: number;
    products: Product[];
}

const productSchema = new mongoose.Schema<Product>({
    productid: String,
    productname: String,
    quantityreceived: Number,
    cost: Number,
    totalcost: Number,
    expirydate: Date,
});

const shipmentSchema = new mongoose.Schema<ShipmentReceived>({
    invoicenumber: String,
    datereceived: Date, // Corrected from String to Date
    suppliername: String,
    shipmentdescription: String,
    totalreceived: Number,
    totalcost: Number,
    products: [productSchema],
});

const ShipmentItem: Model<ShipmentReceived> = mongoose.model('Shipment', shipmentSchema, 'shipments');

export default ShipmentItem;
