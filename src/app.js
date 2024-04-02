import express from 'express';
import productsRouter  from './routes/productsRouter.js';
import cartRouter  from './routes/cartRouter.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));

