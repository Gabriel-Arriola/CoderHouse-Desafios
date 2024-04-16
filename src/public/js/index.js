const socket = io();

socket.on('productos', productos => {

    const tbody = document.getElementById('productos-body');
    tbody.innerHTML = '';

    productos.forEach(product => {
        const row = tbody.insertRow();
        row.innerHTML = ` 
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.code}</td>
                <td>${product.stock}</td>
                <td>${product.category}</td>
                <td>${product.status ? 'Vigente' : 'Desactualizado'}</td>
                <td>${product.thumbnails.length > 0 ? product.thumbnails[0] : 'No hay imagen'}</td>
        `;
    });
})

const formulario = document.getElementById('producto-form');

formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    const product ={
        title: document.getElementById('titulo').value,
        description:document.getElementById('descripcion').value,
        code:document.getElementById('codigo').value,
        price:document.getElementById('precio').value,
        stock:document.getElementById('stock').value,
        category:document.getElementById('categoria').value
    };

    socket.emit('addProduct', product);
    document.getElementById('producto-form').reset();
});