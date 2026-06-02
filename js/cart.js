let cart = JSON.parse(localStorage.getItem('cart')) || [];

function showCart() {
  document.getElementById("cart-slideout").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
  const cartItems = document.getElementById("cart-items");
  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartItems.innerHTML = cart
      .map(
        (item, idx) => `
        <div class="cart-item">
         <div class="cart-image">${item.image}></div><br>
          <div class="jos-choice">${item.title}</div><br>
          ${item.quantity} × ${$item.price} ${item.currency}
          <div>
            <button onclick="updateCartQuantity(${idx}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartQuantity(${idx}, 1)">+</button>
            <button onclick="removeCartItem(${idx})">Remove</button>
          </div>
        </div>`
      )
      .join("");
  }
}

// function showCart() {
//   const cartItems = document.getElementById("cart-items");
//   if (!cart.length) {
//     cartItems.innerHTML = "<p>Your cart is empty.</p>";
//     return;
//   }

//   cartItems.innerHTML = cart.map((item, idx) => {
//     // if image is an HTML snippet, use it; otherwise treat as URL
//     let imageHtml = '';
//     if (item.image) {
//       const s = String(item.image).trim();
//       if (s.startsWith('<')) {
//         imageHtml = s; // already HTML
//       } else {
//         imageHtml = `<img src="${s}" alt="${item.title || ''}" style="width:60px;height:auto;margin-right:10px;">`;
//       }
//     }
//     const priceNumber = Number(item.price) || 0;
//     const formatted = `$${priceNumber.toFixed(2)}`;

//     return `
//       <div class="cart-item">
//         ${imageHtml}
//         <div class="jos-choice">${item.title}</div>
//         ${item.quantity} × ${formatted}
//         <div>
//           <button onclick="updateCartQuantity(${idx}, -1)">−</button>
//           <span>${item.quantity}</span>
//           <button onclick="updateCartQuantity(${idx}, 1)">+</button>
//           <button onclick="removeCartItem(${idx})">Remove</button>
//         </div>
//       </div>`;
//   }).join('');
// }

function updateCartQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  showCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  showCart();
}

function closeCart() {
  document.getElementById("cart-slideout").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
}

function goToCheckout() {
  if (cart.length === 0) return;
  // Use your Shopify domain or custom checkout logic
  const domain = "gbg11r-ah.myshopify.com";
  const cartUrl =
    "https://" +
    domain +
    "/cart/" +
    cart
      .map((item) => item.variantId.split("/").pop() + ":" + item.quantity)
      .join(",") +
    "?checkout";
  window.location.href = cartUrl;
}