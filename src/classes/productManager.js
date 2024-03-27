import fs from 'fs';

class ProductManager {
    static idProduct = 1;
    #products;
    #path;

    constructor() {
        //this.#createDataFolder();
        this.#path = './Data/products.json';
        this.#products = this.#readDataFromFile();
    }

    // #createDataFolder() {
    //     try {
    //         if (!fs.existsSync("./src/Data")){
    //             fs.mkdirSync("./src/Data");
    //             console.log("Folder created...");
    //         }
                
    //     } catch (error) {
    //         console.log(`Error when attempt to create folder: ${error}`);
    //     }
    // }

    #readDataFromFile() {
        try {
            if (fs.existsSync(this.#path))
                return JSON.parse(fs.readFileSync(this.#path, { encoding: 'utf-8' }));
            return [];
        } catch (error) {
            console.log(`Error when attempt to read file: ${error}`);
        }
    }

    #saveFile() {
        try {
            fs.writeFileSync(this.#path, JSON.stringify(this.#products))
        } catch (error) {
            console.log(`Error when attempt to save file: ${error}`);
        }
    }

    #newId() {
        let id = 1
        if (this.#products.length != 0)
            id = this.#products[this.#products.length - 1].id + 1;
        return id
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock)
            return 'All fields are required'

        const repeatedCode = this.#products.some(prod => prod.code == code);
        if (repeatedCode)
            return `The code ${code} is already in use`;

        const newProduct = {
            id: this.#newId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.#products.push(newProduct);
        this.#saveFile();
        return 'Product added successfully';
    }

    getProducts() {
        return this.#readDataFromFile();
    }

    getProductsById(idProduct) {
        const product = this.#readDataFromFile().find(prod => prod.id == idProduct);
        if (product)
            return product;
        else
            return `Product Not Found By ID ${idProduct}`;
    }

    updateProduct(idProduct, forUpdateProduct) {
        let message = `Product not found for update by ID ${idProduct}`;
        const indexProduct = this.#products.findIndex(prod => prod.id === idProduct);
        if (indexProduct !== -1) {
            const { id, ...parcialProduct } = forUpdateProduct;
            this.#products[indexProduct] = { ...this.#products[indexProduct], ...parcialProduct }
            this.#saveFile();
            message = `Product updated sucessfully`;
        }
        return message;
    }

    deleteProduct(idProduct) {
        let message = `Product not found for delete by ID ${idProduct}`;
        const indexProduct = this.#products.findIndex(prod => prod.id === idProduct);
        if (indexProduct !== -1) {
            this.#products = this.#products.filter(prod => prod.id !== idProduct)
            this.#saveFile();
            message = `Product deleted sucessfully`;
        }
        return message;
    }
}

export default ProductManager;

