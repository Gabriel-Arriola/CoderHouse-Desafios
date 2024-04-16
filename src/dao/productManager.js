import fs from 'fs';

class ProductManager {
    #products;
    #path;
    static #instance;

    constructor() {
        if (ProductManager.#instance)
            return ProductManager.#instance;
        this.#path = './Data/products.json';
        this.#products = [];

        ProductManager.#instance = this;
    }

    async init() {
        this.#products = await this.#readDataFromFile();
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
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products))
        } catch (error) {
            console.log(`Error when attempt to save file: ${error}`);
        }
    }

    #newId = () => {
        let id = 1
        if (this.#products.length != 0)
            id = this.#products[this.#products.length - 1].id + 1;
        return id
    }

    addProduct = async ({ title, description, code, price, status = true, stock, category, thumbnails = [] }) => {
        if (!title || !description || !price || !code || !stock || !category)
            return 'All fields are required'
        this.#products = await this.#readDataFromFile();
        const repeatedCode = this.#products.some(prod => prod.code == code);
        if (repeatedCode)
            return `The code ${code} is already in use`;

        const newProduct = {
            id: this.#newId(), title, description, code,
            price, status, stock, category, thumbnails
        };
        this.#products.push(newProduct);
        await this.#saveFile();
        return 'Product added successfully';
    }

    getProducts = async () => {
        return await this.#readDataFromFile();
    }

    getProductsById = async (idProduct) => {
        let status = false;
        let message = `Product Not Found By ID ${idProduct}`;
        const products = await this.#readDataFromFile();
        let product = products.find(prod => prod.id === idProduct);
        if (product) {
            status = true;
            message = product;
        }
        return { status, message }
    }

    updateProduct = async (idProduct, forUpdateProduct) => {
        let message = `Product not found for update by ID ${idProduct}`;
        this.#products = await this.#readDataFromFile();
        const indexProduct = this.#products.findIndex(prod => prod.id === idProduct);
        if (indexProduct !== -1) {
            const { id, ...parcialProduct } = forUpdateProduct;
            this.#products[indexProduct] = { ...this.#products[indexProduct], ...parcialProduct }
            await this.#saveFile();
            message = this.#products[indexProduct];
        }
        return message;
    }

    deleteProduct = async (idProduct) => {
        let message = `Product not found for delete by ID ${idProduct}`;
        this.#products = await this.#readDataFromFile();
        const indexProduct = this.#products.findIndex(prod => prod.id === idProduct);
        if (indexProduct !== -1) {
            this.#products = this.#products.filter(prod => prod.id !== idProduct)
            await this.#saveFile();
            message = `Product deleted sucessfully`;
        }
        return message;
    }
}

export default ProductManager;

