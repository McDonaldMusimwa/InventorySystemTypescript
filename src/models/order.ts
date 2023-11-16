import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ProductItem {
    productId: string;
    productname: string;
    quantity: number;
}

export interface Order {
    customername: string;
    dateordered: Date;
    contactphone:string
    contactemail:string,
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
    contactphone:String,
    contactemail:String,
    products: [productSchema],
});

const PurchaseOrder: Model<Order> = mongoose.model('Order', stockSchema, 'order');

export default PurchaseOrder;
