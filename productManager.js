class ProductManager{
    static idProduct = 1;
    #products;

    constructor(){
        this.#products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock){
        if (!title || !description || !price || !thumbnail || !code || !stock)
            return 'All fields are required'

        const repeatedCode = this.#products.some(prod => prod.code == code);
        if(repeatedCode)
            return `The code ${code} is already in use`;

        const newProduct = {
            id : ProductManager.idProduct ++,
            title, 
            description, 
            price, 
            thumbnail, 
            code, 
            stock
        };
        this.#products.push(newProduct);
        return 'Product added successfully';
    }

    getProducts(){
        return this.#products;
    }

    getProductsById(idProduct){
        const product = this.#products.find(prod => prod.id == idProduct);
        if (product)
            return product;
        else
            return `Product Not Found By ID ${idProduct}`;
    }

}

module.exports = ProductManager;


