const ProductManager = require("./productManager");

const producto = new ProductManager;

console.log(producto.getProducts());

console.log('=======================================================');
console.log(producto.addProduct('Pick-Up', 'Ford', 50000, 'img_ranger', 'FRD_RGR_XL', 50));
console.log(producto.addProduct('Pick-Up', 'VW', 60000, 'img_amarok', 'VW_AMK_TDI', 60));
console.log(producto.addProduct('Pick-Up', 'Renaut', 55000, 'img_alaskan', 'RNT_AKN_S', 80));
console.log(producto.addProduct('Pick-Up', 'RAM', 900000, 'img_ram2500', 'RAM_2k5', 20));

console.log('=======================================================');
console.log(producto.getProducts());

console.log('=======================================================');
console.log(producto.getProductsById(2));

console.log('=======================================================');
console.log(producto.deleteProduct(2));
console.log(producto.getProductsById(2));

console.log('=======================================================');
const forUpdateProduct = {
    "id": 20,
    "title": "Pick-Up",
    "description": "RENAULT",
    "price": 75000,
    "thumbnail": "img_alaskan2"
 }

console.log(producto.updateProduct(3, forUpdateProduct));

console.log('=======================================================');
console.log(producto.getProducts());