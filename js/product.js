const domain = "gbg11r-ah.myshopify.com";
const storefrontAccessToken = "e4c45ba5e531c0c76f492bd773f5f339";

const params = new URLSearchParams(window.location.search);
const handle = params.get("handle");

async function fetchProduct() {
  const query = `
    {
      productByHandle(handle: "${handle}") {
        id
        title
        description
        descriptionHtml
        images(first: 5) {
          edges {
            node {
              src
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${domain}/api/2023-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query })
  });

  const json = await response.json();

  if (!json.data || !json.data.productByHandle) {
    document.getElementById("product-detail").innerHTML = "<p>Product not found.</p>";
    return;
  }
  displayProduct(json.data.productByHandle);
}

function displayProduct(product) {
  if (!product) {
    document.getElementById("product-detail").innerHTML = "<p>Product not found.</p>";
    return;
  }

  let imagesHtml = product.images.edges.map(img =>
    `<img src="${img.node.src}" alt="${img.node.altText || ''}" width="400">`
  ).join("");

  // If only one variant, show product title, variant title (if not default), price, and add to cart
  if (product.variants.edges.length === 1) {
    const variant = product.variants.edges[0].node;
    const variantTitle = variant.title && variant.title !== "Default Title"
      ? `${product.title} - ${variant.title}`
      : product.title;
    document.getElementById("product-detail").innerHTML = `
      ${imagesHtml}
      <p class="product-title">${product.title}</p>
      <div class="shop-paragraph">${product.descriptionHtml}</div>
      <div class="product-variant" style="padding-top: 1rem;">
        <span class="product-title">${product.title}</span>
        <span class="product-price">${variant.price.amount} ${variant.price.currencyCode}</span>
        <button onclick="addToCart('${variant.id}', '${variantTitle}', '${variant.price.amount}', '${variant.price.currencyCode}')">Add to Cart</button>
      </div>
    `;
    return;
  }

  // If multiple variants, show options with product.title and variant title, price, and add to cart
  let variantsHtml = product.variants.edges.map(variant =>
    `<div class="product-variant" style="padding-top: 1rem;">
      <span class="p">${variant.node.title}</span>
      <span class="product-price">${variant.node.price.amount} ${variant.node.price.currencyCode}</span>
      <button onclick="addToCart('${variant.node.id}', '${product.title} — ${variant.node.title}', '${variant.node.price.amount}', '${variant.node.price.currencyCode}')">Add to Cart</button>
    </div>`
  ).join("");

  document.getElementById("product-detail").innerHTML = `
    ${imagesHtml}
    <p class="product-title">${product.title}</p>
    <div class="shop-paragraph">${product.descriptionHtml}</div>
    <p class="product-variant">Options</p>
    ${variantsHtml}
  `;
}

function addToCart(variantId, title, price, currency) {
  // Check if item already in cart
  const existing = cart.find(item => item.variantId === variantId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      variantId,
      title,
      price,
      currency,
      quantity: 1
    });
  }
  // Save cart to localStorage so all items are collected and persist
  localStorage.setItem('cart', JSON.stringify(cart));
  showCart();
}

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
          <p>${item.title}</p>
          <p>${item.quantity} × ${item.price} ${item.currency}</p>
          <div>
            <button onclick="updateCartQuantity(${idx}, -1)">—</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartQuantity(${idx}, 1)">+</button>
            <button onclick="removeCartItem(${idx})" style="font-family:'dotum',serif;font-size:1rem;">Remove</button>
          </div>
        </div>`
      )
      .join("");
  }
}

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

fetchProduct();