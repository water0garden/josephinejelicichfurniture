const domain = "gbg11r-ah.myshopify.com"; // Replace with your store
const storefrontAccessToken = "e4c45ba5e531c0c76f492bd773f5f339"; // Replace with your token

async function fetchProducts() {
  const query = `
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            description
            handle
            images(first: 1) {
              edges {
                node {
                  src
                  altText
                }
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
  displayProducts(json.data.products.edges);
}

function displayProducts(products) {
  const container = document.getElementById("product-list");

  products.forEach(({ node }) => {
    const image = node.images.edges[0]?.node.src || "";
    const alt = node.images.edges[0]?.node.altText || "";
    const handle = node.handle;
    const productUrl = `productdetail/index.html?handle=${handle}`;

    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${image}" alt="${alt}" width="400">
      <a href="${productUrl}">
        <button><p class="product-title">${node.title}</p></button>
      </a>
      
      
    `;
    container.appendChild(div);
  });

  // Hide all <p> elements with the shop-paragraph class
  document.querySelectorAll(".shop-paragraph").forEach(p => {
    p.style.display = "none";
  });
}

// Call this once to load products

const domain = 'gbg11r-ah.myshopify.com'; // Replace
const storefrontAccessToken = 'e4c45ba5e531c0c76f492bd773f5f339'; // Replace

let cartId = localStorage.getItem('cartId');

// Get cart popup elements
const cartPopup = document.getElementById('cart-popup');
const cartItemsList = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCartBtn = document.getElementById('close-cart');

// Show/hide cart
function showCart() {
  cartPopup.classList.add('show');
}
function hideCart() {
  cartPopup.classList.remove('show');
}
closeCartBtn.addEventListener('click', hideCart);

// Create cart if not exists
async function createCart() {
  const query = `
    mutation {
      cartCreate {
        cart {
          id
        }
      }
    }
  `;

  const res = await fetch(`https://${domain}/api/2023-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  const id = data.data.cartCreate.cart.id;
  localStorage.setItem('cartId', id);
  return id;
}

// Add item to cart
async function addToCart(variantId, quantity = 1) {
  if (!cartId) cartId = await createCart();

  const mutation = `
    mutation {
      cartLinesAdd(cartId: "${cartId}", lines: [
        {
          merchandiseId: "${variantId}",
          quantity: ${quantity}
        }
      ]) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                quantity
                merchandise {
                  ... on ProductVariant {
                    title
                    product {
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${domain}/api/2023-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({ query: mutation })
  });

  const data = await res.json();
  const cart = data.data.cartLinesAdd.cart;
  renderCart(cart.lines.edges);
  checkoutBtn.onclick = () => window.location.href = cart.checkoutUrl;
  showCart();
}

// Render cart items
function renderCart(lines) {
  cartItemsList.innerHTML = '';
  lines.forEach(({ node }) => {
    const li = document.createElement('li');
    li.textContent = `${node.merchandise.product.title} – ${node.merchandise.title} x${node.quantity}`;
    cartItemsList.appendChild(li);
  });
}


fetchProducts();