import { Schema, model } from "mongoose";

const nameCollection = 'Cart';
const CartSchema = new Schema({
    products: {
        type: [
            {
                id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: [true, 'The quantity of the product is required']
                }
            }
        ],
        default: []
    }
});

CartSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

export const cartModel = model(nameCollection, CartSchema);
