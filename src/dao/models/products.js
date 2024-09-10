import mongoose, { Schema, model } from "mongoose";

const nameCollection = 'Product'

const ProductSchema = new Schema({
    
    title:{type:String, required:[true, 'The product title is required'], },
    description:{type:String, required:[true, 'The product description is required'], },
    price:{type: Number , required:[true, 'The product price is required'], },
    code:{type: String, required:[true, 'The product code is required'], unique: true },
    stock:{type: Number, required:[true, 'The product stock is required'], },
    category:{type:String, required:[true, 'The product category is required'], },
    status:{type: Boolean, default: true },
    thumbnails: [{type: String}],
    owner: { type: String, ref: 'User', default: "admin" }
});

ProductSchema.set('toJSON',{
    transform: function(doc, ret){
        delete ret.__v;
        return ret;
    }
})

export const productModel = model(nameCollection, ProductSchema)