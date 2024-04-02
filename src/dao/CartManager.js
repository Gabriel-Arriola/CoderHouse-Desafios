import fs from 'fs';
import ProductManager from './productManager.js';

class CartManager {
    #cart;
    #path;

    constructor() {
        this.#cart = [];
        this.#path = './Data/cart.json';
    }

    async init() {
        this.#cart = await this.#readDataFromFile();
    }

    #readDataFromFile = async () => {
        try {
            if (fs.existsSync(this.#path))
                return JSON.parse(await fs.promises.readFile(this.#path, { encoding: 'utf-8' }));
            return [];
        } catch (error) {
            console.log(`Error when attempt to read file: ${error}`);
        }
    }

    #saveFile = async () => {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#cart))
        } catch (error) {
            console.log(`Error when attempt to save file: ${error}`);
        }
    }

    #newId = async () => {
        let id = 1
        this.#cart = await this.#readDataFromFile();
        if (this.#cart.length != 0)
            id = this.#cart[this.#cart.length - 1].id + 1;
        return id
    }

    addCarts = async () => {
        const newCart = { id: await this.#newId(), products: [] };
        this.#cart.push(newCart);
        await this.#saveFile();
        return this.#cart;
    }

    getCarts = async () => {
        return await this.#readDataFromFile();
    }

    getCartById = async (idCart) => {
        const carts = await this.#readDataFromFile();
        let cart = carts.find(cart => cart.id === idCart);
        if (cart)
            return cart;
        else
            return `Cart Not Found By ID ${idCart}`;
    }

    addProductInCart = async (idCart, idProduct) => {
        let message = `Cart not found by ID ${idCart}`;
        this.#cart = await this.#readDataFromFile();
        const indexCart = this.#cart.findIndex(cart => cart.id === idCart);
        if (indexCart !== -1) {
            const indexProdInCart = this.#cart[indexCart].products.findIndex(prod => prod.id === idProduct);
            if (indexProdInCart !== -1) {
                let prodQtty = this.#cart[indexCart].products.find(prod => prod.id === idProduct);
                prodQtty.quantity = prodQtty.quantity + 1;
            }
            else {
                const product = new ProductManager();
                const prod = await product.getProductsById(idProduct);
                if (prod.status) {
                    this.#cart[indexCart].products.push({ id: idProduct, quantity: 1 });
                }
                else { 
                    return prod.message;
                }           
            }
            await this.#saveFile();
            return this.#cart[indexCart];
        }
        return message;
    }
}

export default CartManager;