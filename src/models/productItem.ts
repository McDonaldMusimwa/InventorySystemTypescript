import mongoose, { Document, Model, Schema } from 'mongoose';





export interface ProductItem {
    productid: string;
    productname: string;
    unitspercase: string;
    description: string;
}


const stockSchema = new mongoose.Schema<ProductItem>({
    productid: String,
    productname: String,
    unitspercase: String,
    description: String


});

const NewItem: Model<ProductItem> = mongoose.model('ProductRange', stockSchema, 'productrange');

export default NewItem;
