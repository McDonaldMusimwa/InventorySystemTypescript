import mongoose, { Document, Model, Schema } from 'mongoose';



export interface Shipment {
    productid: string,
    productname: string;
    productdescription: string;
    quantityreceived: number;
    cost: number;
    totalcost: number;
    datereceived: Date;
    expirydate:Date;
}


const shipmentSchema = new mongoose.Schema<Shipment>({
    productid: String,
    productname: String,
    productdescription: String,
    quantityreceived: Number,
    cost: Number,
    totalcost: Number,
    datereceived: Date,
    expirydate:Date
});



const ShipmentItem: Model<Shipment> = mongoose.model('Shipment', shipmentSchema, 'shipments');

export default ShipmentItem;
