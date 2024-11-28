
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCart();
});

function loadProducts() {

    fetch('/products')
        .then(response => response.json())
        .then(products => {
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = ''; // Clear existing content
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Precio: $${product.price}</p>
                    <p>Stock: ${product.stock}</p>
                    <button onclick="addToCart('${product.id}')">Añadir a la cesta</button>
                `;
                productsContainer.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

function loadCart() {

    fetch('/cart')
        .then(response => response.json())
        .then(cartItems => {
            const cartContainer = document.getElementById('cart');
            cartContainer.innerHTML = ''; // Clear existing content
            cartItems.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                
                const price = parseFloat(item.price) || 0;
                const quantity = parseInt(item.quantity) || 1;
                
                cartItemDiv.innerHTML = `
                    <h4>${item.name || 'Producto sin nombre'}</h4>
                    <p>Cantidad: ${quantity}</p>
                    <p>Precio total: $${(price * quantity).toFixed(2)}</p>
                `;
                cartContainer.appendChild(cartItemDiv);
            });
        })
        .catch(error => console.error('Error al cargar la cesta:', error));
}

function addToCart(productId) {

    fetch('/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId })
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'added') {
            loadCart(); // Refresh cart after adding
            alert('Producto añadido a la cesta');
        } else {
            alert('Error al añadir el producto a la cesta');
        }
    })
    .catch(error => console.error('Error al añadir el producto a la cesta:', error));
}

function checkout() {

    fetch('/checkout', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'completed') {
            loadCart(); // Clear the cart display
            alert('Compra completada con éxito');
        } else {
            alert('Error al realizar la compra');
        }
    })
    .catch(error => console.error('Error al realizar la compra:', error));
}
