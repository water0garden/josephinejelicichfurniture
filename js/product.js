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
      <button onclick="addToCart('${variant.node.id}')">Buy me</button>
    </div>`
  ).join("");

  document.getElementById("product-detail").innerHTML = `
    ${imagesHtml}
    <p class="product-title">${product.title}</p>
    <p class="shop-description">${product.description}</p>
    <p class="product-variant">Options</p>
    ${variantsHtml}
  `;
}

function addToCart(variantId) {
  // Extract numeric ID from Shopify's global ID
  const numericId = variantId.split("/").pop();
  window.location.href = `https://${domain}/cart/${numericId}:1`;
}

// let cart = [];

// function addToCart(variant) {
//   const variantId = variant.id;

//   // Check if item is already in the cart
//   const existingItem = cart.find(item => item.id === variantId);
//   if (existingItem) {
//     existingItem.quantity += 1;
//   } else {
//     cart.push({
//       id: variantId,
//       title: variant.title,
//       price: variant.price.amount,
//       currency: variant.price.currencyCode,
//       quantity: 1
//     });
//   }

//   showCart();
// }





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