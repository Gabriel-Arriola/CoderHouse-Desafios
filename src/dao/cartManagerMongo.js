import { cartModel } from "./models/carts.js";

export default class CartManager {


    addCarts = async () => {
        try {
            return await cartModel.create({ products: [] });
        } catch (error) {
            return error;
        }
    }

    getCarts = async () => {
        return await cartModel.find();
    }

    getCartById = async (idCart) => {
        try {
            return await cartModel.findById({_id:idCart});
        } catch (error) {
            return error;
        }
    }

    addProductInCart = async (idCart, idProduct) => {
        let message = `Cart not found by ID ${idCart}`;
        let cart = cartModel.findById({_id:idCart}).lean; 
        if (cart){

 
            return cart;
            // const indexProdInCart = cart.products.find(prod => prod.id.toString() === idProduct);
            // if(indexProdInCart){
            //     try {
            //         await cartModel.findOneAndUpdate(
            //             {_id:idCart},
            //             {$inc:{'products.$.quantity':1}},
            //             {new: true}
            //         )
            //         return `Product ${idProduct} added to cart ${idCart}`
            //     } catch (error) {
            //         return error
            //     }
            // }
            // else{
            //     await cartModel.findOneAndUpdate({_id: cart._id}, {$push:{products:{id:idProduct, quantity: 1}}})
            //     return `Product ${idProduct} added to cart ${idCart}`
            // }
        }
        return message;
    }
}
