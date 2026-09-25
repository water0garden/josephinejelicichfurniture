let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    countEl.textContent = `[${count}]`;
  }
}

function showCart() {
  document.getElementById("cart-slideout").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
  const cartItems = document.getElementById("cart-items");
  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const currency = cart[0].currency;

    cartItems.innerHTML = cart
      .map(
        (item, idx) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-details">
            <div class="cart-item-top">
              <span class="jos-choice">${item.title}</span>
              <span class="cart-item-price">${item.quantity} × $${parseFloat(item.price).toFixed(2)} ${item.currency}</span>
            </div>
            <div class="cart-item-controls">
              <button onclick="updateCartQuantity(${idx}, -1)">−</button>
              <span>${item.quantity}</span>
              <button onclick="updateCartQuantity(${idx}, 1)">+</button>
              <button class="remove-btn" onclick="removeCartItem(${idx})">Remove</button>
            </div>
          </div>
        </div>`
      )
      .join("") + `
      <div class="cart-subtotal">
        <span>SUBTOTAL</span>
        <span>$${subtotal.toFixed(2)} ${currency}</span>
      </div>
      <label class="cart-instructions-label">Special instructions for seller</label>
      <textarea class="cart-instructions" rows="3"></textarea>
      <p class="cart-shipping-note">Shipping and discount codes are added at checkout.</p>`;
  }
}

function updateCartQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCart();
}

function closeCart() {
  document.getElementById("cart-slideout").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
}

function goToCheckout() {
  if (cart.length === 0) return;
  const domain = "gbg11r-ah.myshopify.com";
  const cartUrl =
    "https://" +
    domain +
    "/cart/" +
    cart
      .map((item) => item.variantId.split("/").pop() + ":" + item.quantity)
      .join(",") +
    "?checkout";

  const width = 500;
  const height = 700;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  window.open(
    cartUrl,
    "checkoutPopup",
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,noopener,noreferrer`
  );
}

// Set the counter correctly as soon as this script loads on any page
updateCartCount();