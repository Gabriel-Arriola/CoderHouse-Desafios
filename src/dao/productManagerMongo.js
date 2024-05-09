import { productsModel } from "./models/products.js";

export default class ProductManager{

    addProduct = async (product) => {
        try {
            await productsModel.create(product);
            return await productsModel.findOne({ title: product.title })
        }
        catch (err) {
            return err
        } 
    };

    getProducts = async () => {
        try {
            return await productsModel.find().lean();
        } catch (err) {
            return err
        }
    };
        
    getProductsById = async (id) => {
        try {
            return await productsModel.findById({_id:id})
            
        } catch (err) {
            return {error: err.message}
        }
    };


    updateProduct = async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product });
        } catch (err) {
            return err
        }
    };


    deleteProduct = async (id) => {
        try {
            return await productsModel.findByIdAndDelete({_id:id})
        } catch (err) {
            return err
        }
    };
}