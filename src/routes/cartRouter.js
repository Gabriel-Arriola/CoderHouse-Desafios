import { Router } from "express";
//import CartManager from "../dao/CartManager.js";
import CartManager from "../dao/cartManagerMongo.js";
import ProductManager from "../dao/productManagerMongo.js";
const cartManager = new CartManager();
const productManager = new ProductManager();
const router = Router();

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const cartById = await cartManager.getCartById(cartId);
    if (cartById)
        return res.json(cartById);
});

router.post("/", async (req, res) => {
    const cart = await cartManager.addCarts();
    res.json(cart);
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cartValid = await cartManager.getCartById(cartId);
    const prodValid = await productManager.getProductsById(productId);
    if (cartValid){
        console.log("cartValid");
    }
    else{
        res.status(404).json({"error": "Cart not found"});
    }
        

    //const cart = await cartManager.addProductInCart(cartId, productId);
    res.json(null);
});

export default router;