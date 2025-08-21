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

  let variantsHtml = product.variants.edges.map(variant =>
    `<div>
      <strong>${variant.node.title}</strong> - ${variant.node.price.amount} ${variant.node.price.currencyCode}   
      <button onclick="addToCart('${variant.node.id}', '${product.title}', '${variant.node.price.amount}', '${variant.node.price.currencyCode}')">Add to Cart</button>
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
  showCart();
}

let cart = [];

function showCart() {
  document.getElementById("cart-slideout").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
  const cartItems = document.getElementById("cart-items");
  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <strong>${item.title}</strong><br>
          ${item.quantity} × ${item.price} ${item.currency}
        </div>`
      )
      .join("");
  }
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