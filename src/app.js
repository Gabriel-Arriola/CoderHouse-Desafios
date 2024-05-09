import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';

import productsRouter  from './routes/productsRouter.js';
import cartRouter  from './routes/cartRouter.js';
import views from './routes/views.js'
import __dirname from './utils.js'
//import ProductManager from './dao/productManager.js';
import ProductManager from './dao/productManagerMongo.js';
import { dbConnection } from './database/config.js';

const app = express();
const PORT = 8080;

const prod = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use("/",views);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

await dbConnection();


const expressServer = app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
const socketServer = new Server(expressServer);


socketServer.on('connection',async socket=>{
    const products = await prod.getProducts();
    socket.emit('productos', products);

    socket.on('addProduct', async product=>{
        const newProduct = await prod.addProduct({...product})
        console.log({newProduct});
        if(newProduct){
            products.push(newProduct)
            socketServer.emit('productos', products);
        }
    })
})