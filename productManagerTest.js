const ProductManager = require("./productManager");

const producto = new ProductManager;

//title, description, price, thumbnail, code, stock
console.log(producto.addProduct('Pick-Up', 'Ford', 50000, 'img_ranger', 'FRD_RGR_XL', 50));
console.log(producto.addProduct('Pick-Up', 'VW', 60000, 'img_amarok', 'VW_AMK_TDI', 60));
console.log(producto.addProduct('Pick-Up', 'Renaut', 550000, 'img_alaskan', 'RNT_AKN_S', 80));


console.log('=======================================================');
console.log(producto.getProducts());

console.log('=======================================================');
console.log(producto.getProductsById(2));