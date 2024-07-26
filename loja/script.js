document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('carro');
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    function atualizarCarrinho() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        carrinho.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <p>Produto: ${item.name}</p>
                <p>Preço: R$ ${item.price.toFixed(2)}</p>
                <p>Quantidade: ${item.quantity}</p>
                <button class="remove-item" data-id="${item.id}">Remover</button>
            `;
            cartItemsContainer.appendChild(itemEl);

            total += item.price * item.quantity;
        });

        totalPriceEl.textContent = total.toFixed(2);
    }

    cartIcon.onclick = function(event) {
        event.preventDefault(); // Previna comportamento padrão do link
        atualizarCarrinho();
        modal.style.display = 'block';
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-item')) {
            const id = event.target.dataset.id;
            const index = carrinho.findIndex(item => item.id === id);

            if (index !== -1) {
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                atualizarCarrinho();
            }
        }
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.parentElement;
            const id = product.getAttribute('data-id');
            const name = product.getAttribute('data-name');
            const price = parseFloat(product.getAttribute('data-price'));

            const existingProduct = carrinho.find(item => item.id === id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                carrinho.push({ id, name, price, quantity: 1 });
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            alert(`${name} foi adicionado ao carrinho!`);
        });
    });
});