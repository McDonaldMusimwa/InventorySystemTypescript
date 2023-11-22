import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ProductItem {
    productId: string;
    productname: string;
    quantity: number;
}

export interface Order {
    customername: string;
    dateordered: Date;
    customerphone:string
    customeremail:string,
    products: ProductItem[]
}


const productSchema = new mongoose.Schema<ProductItem>({
    productId: String,
    productname: String,
    quantity: Number,
});

const stockSchema = new mongoose.Schema<Order>({
    customername: String,
    dateordered: Date,
    customerphone:String,
    customeremail:String,
    products: [productSchema],
});

const PurchaseOrder: Model<Order> = mongoose.model('Order', stockSchema, 'order');

export default PurchaseOrder;
