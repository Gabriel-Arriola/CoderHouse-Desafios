import mongoose from "mongoose";

const nameCollection = 'cart';

const CartSchema = new mongoose.Schema({
    products:
        [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: [true, 'The QUANTITY is required']
                }
            }
        ]

},
    {
        timestamps: true,
    }
);

export const cartModel = mongoose.model(nameCollection, CartSchema);