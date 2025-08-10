const domain = "gbg11r-ah.myshopify.com";
const storefrontAccessToken = "e4c45ba5e531c0c76f492bd773f5f339";

const params = new URLSearchParams(window.location.search);
const handle = params.get("handle");

let cart = [];

async function fetchProduct() {
  const query = `
    {
      productByHandle(handle: "${handle}") {
        id
        title
        description
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
    body: JSON.stringify({ query }),
  });

  const json = await response.json();

  if (!json.data || !json.data.productByHandle) {
    document.getElementById("product-detail").innerHTML = "<p>Product not found.</p>";
    return;
  }

  displayProduct(json.data.productByHandle);
}

function displayProduct(product) {
  if (!product) return;

  // Save globally so we can reuse it
  window.currentProduct = product;

  const container = document.getElementById("product-detail");

  // Images
  const imagesHtml = product.images.edges.map(img =>
    `<img src="${img.node.src}" alt="${img.node.altText || ''}" width="400">`
  ).join("");

  // Description
  const descriptionHtml = `
    <p class="product-title">${product.title}</p>
    <p class="product-description">${product.description}</p>
  `;

  // First variant only (you can add a loop later)
  const variant = product.variants.edges[0]?.node;

  let addToCartHtml = "";
  if (variant) {
    addToCartHtml = `
      <div>
        <strong>${variant.title}</strong><br>
        ${variant.price.amount} ${variant.price.currencyCode}<br>
        <button id="add-to-cart-btn">Add to Cart</button>
      </div>
    `;
  }

  container.innerHTML = `
    ${imagesHtml}
    ${descriptionHtml}
    ${addToCartHtml}
  `;

  // Add event listener to button
  if (variant) {
    const btn = document.getElementById("add-to-cart-btn");
    btn.addEventListener("click", () => addToCart(variant));
  }
}

function addToCart(variant) {
  const variantId = variant.id;

  const existingItem = cart.find(item => item.id === variantId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: variantId,
      title: variant.title,
      price: variant.price.amount,
      currency: variant.price.currencyCode,
      quantity: 1
    });
  }

  showCart();
}

function showCart() {
  const cartPopup = document.getElementById("cart-popup");
  const cartItems = document.getElementById("cart-items");

  cartItems.innerHTML = cart.map(item => `
    <div style="margin-bottom: 10px;">
      <strong>${item.title}</strong><br>
      ${item.quantity} × ${item.price} ${item.currency}
    </div>
  `).join("");

  cartPopup.style.display = "block";
}

function closeCart() {
  document.getElementById("cart-popup").style.display = "none";
}

function goToCheckout() {
  if (cart.length === 0) return;

  const cartUrl = `https://${domain}/cart/` + cart
    .map(item => `${item.id.split("/").pop()}:${item.quantity}`)
    .join(",") + "?checkout";

  window.location.href = cartUrl;
}

// Call the fetch function on page load
fetchProduct();




// let cart = [];

// function addToCart(variantId) {
//   // Find the variant details from the page data
//   const variant = window.currentProduct.variants.edges.find(v => v.node.id === variantId).node;
//   cart.push({
//     id: variantId,
//     title: variant.title,
//     price: variant.price.amount,
//     currency: variant.price.currencyCode
//   });
//   showCart();
// }

// function showCart() {
//   const cartPopup = document.getElementById("cart-popup");
//   const cartItems = document.getElementById("cart-items");
//   cartItems.innerHTML = cart.map(item =>
//     `<div>
//       <strong>${item.title}</strong> - ${item.price} ${item.currency}
//     </div>`
//   ).join("");
//   cartPopup.style.display = "block";
// }

// function closeCart() {
//   document.getElementById("cart-popup").style.display = "none";
// }

// // Save product globally for cart lookup
// function displayProduct(product) {
//   window.currentProduct = product;
//   // ...existing code...
// }



fetchProduct();