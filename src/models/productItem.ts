import mongoose, { Document, Model, Schema } from 'mongoose';





export interface ProductItem {
    productId: string;
    productname: string;
    unitspercase: string;
    description: string;
}


const stockSchema = new mongoose.Schema<ProductItem>({
    productId: String,
    productname: String,
    unitspercase: String,
    description: String


});

const NewItem: Model<ProductItem> = mongoose.model('ProductRange', stockSchema, 'productrange');

export default NewItem;
