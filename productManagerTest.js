const ProductManager = require("./productManager");

const producto = new ProductManager;

//title, description, price, thumbnail, code, stock
producto.addProduct({title:'Pick-Up', description:'Ford', price:50000, thumbnail:'img_ranger', code:'FRD_RGR_XL', stock:50});
producto.addProduct({title:'Pick-Up', description:'VW', price:60000, thumbnail:'img_amarok', code:'VW_AMK_TDI', stock:60});
producto.addProduct({title:'Pick-Up', description:'Renaut', price:550000, thumbnail:'img_alaskan', code:'RNT_AKN_S', stock:80});


console.log('=======================================================');
console.log(producto.getProducts());

console.log('=======================================================');
console.log(producto.getProductById(2));

console.log('=======================================================');
const forUpdateProduct = {
    "id": 20,
    "title": "PickUp",
    "description": "renault",
    "price": 5000,
    "thumbnail": "img_alaskan2.0"
 }

console.log(producto.updateProduct(3, forUpdateProduct));
console.log(producto.getProductById(3));

console.log('=======================================================');
console.log(producto.deleteProduct(2));
console.log(producto.getProducts());