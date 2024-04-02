import { Router } from "express";
import ProductManager from "../dao/productManager.js";
const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    let limit = Number(req.query.limit);
    if (limit > 0) {
        let info = products;
        info = info.slice(0, limit);
        return res.json(info.slice(0, limit));
    }
    return res.json(products);
});

router.get("/:pid", async (req, res) => {
    const productId = Number(req.params.pid);
    const product = await productManager.getProductsById(productId);
    return res.json(product.message);
});

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const newProduct = await productManager.addProduct(
        title, description, code, price, status, stock, category, thumbnails
    );
    return res.json(newProduct);
});

router.put("/:pid", async (req, res) => {
    const productId = Number(req.params.pid);
    const products = await productManager.updateProduct(productId, req.body);
    return res.json(products);
});

router.delete("/:pid", async (req, res) => {
    const productId = Number(req.params.pid);
    const products = await productManager.deleteProduct(productId);
    return res.json(products);

});

export default router;