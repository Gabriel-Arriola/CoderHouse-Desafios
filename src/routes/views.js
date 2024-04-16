import { Router } from "express";
import ProductManager from "../dao/productManager.js";
const productManager = new ProductManager();
const router = Router();

router.get('/',async(req,res)=>{
    const products = await productManager.getProducts(); 
    return res.render('home',{products});
})

router.get('/realtimeproducts',async(req,res)=>{
   
    return res.render('realTimeProducts');
})


export default router;