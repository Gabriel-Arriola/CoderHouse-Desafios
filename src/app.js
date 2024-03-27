import express from 'express';
import ProductManager from './classes/productManager.js';

const app = express();
const PORT = 8000;
const productManager = new ProductManager();

app.get("/products", async (req, res) => {

    const products = await productManager.getProducts();
    let limit = Number(req.query.limit);
    if (limit > 0) {
        let info = products;
        info = info.slice(0, limit);
        return res.json(info.slice(0, limit));
    }
    return res.json({ productos: products });
});

app.get("/products/:pid", async (req, res) => {
    const productId = Number(req.params.pid);
    const product = await productManager.getProductsById(productId);
    if (product) {
        res.json(product);
    }
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));

