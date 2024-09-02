class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
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
}

module.exports = ProductManager;