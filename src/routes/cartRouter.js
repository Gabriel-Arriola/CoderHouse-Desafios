import { Router } from "express";
import CartManager from "../dao/CartManager.js";
const cartManager = new CartManager();
const router = Router();

router.get("/:cid", async (req, res) => {
    const cartId = Number(req.params.cid);
    const cartById = await cartManager.getCartById(cartId);
    if (cartById)
        return res.json(cartById);
});

router.post("/", async (req, res) => {
    const cart = await cartManager.addCarts();
    res.json(cart);
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    const cart = await cartManager.addProductInCart(cartId, productId);
    res.json(cart);
});


export default router;