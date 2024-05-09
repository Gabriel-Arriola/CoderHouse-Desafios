import mongoose from "mongoose";

const productCollection = 'products';

const ProductsSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'The TITLE is required'] },
    description: { type: String, required: [true, 'The DESCRIPTION is required'] },
    code: { type: String, required: [true, 'The CODE is required'], unique: true },
    price: { type: Number, required: [true, 'The PRICE is required'] },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: [true, 'The STOCK is required'] },
    category: { type: String, required: [true, 'The CATEGORY is required'] },
    thumbnails: [{ type: String }]
});

export const productsModel = mongoose.model(productCollection, ProductsSchema);