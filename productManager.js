const fs = require('fs');

class ProductManager {
    constructor() {
        this.createDataFolder();
        this.path = './DataFiles/products.json';
        this.products = this.loadProducts();
        this.nextId = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;

    }

    createDataFolder() {
        try {
            if (!fs.existsSync("./DataFiles")){
                fs.mkdirSync("./DataFiles");
                console.log("Folder created...");
            }
        } catch (error) {
            console.log(`Error when attempt to create folder: ${error}`);
        }
    }

    loadProducts() {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } else {
            return [];
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }


    addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("All fields are required");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error(`Product with code ${code} already exists`);
            return;
        }

        const newProduct = {
            id: this.nextId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(newProduct);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.error("Not found");
            return;
        }
        return product;
    }

    updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            console.error("Not found");
            return;
        }

        this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct, id };
        this.saveProducts();
        return `Product updated sucessfully`;
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            console.error("Not found");
            return;
        }

        this.products.splice(productIndex, 1);
        this.saveProducts();
        return `Product deleted sucessfully`;
    }

}

module.exports = ProductManager;