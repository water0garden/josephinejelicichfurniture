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

    // Get the first variant (you can show more if needed)
    const variant = node.variants.edges[0]?.node;
    const variantId = variant?.id;

    // Add product HTML
    div.innerHTML = `
      <img src="${image}" alt="${alt}" width="400">
      <a href="${productUrl}">
        <button><p class="product-title">${node.title}</p></button>
      </a>
    `;

    // Add "Add to Cart" button if variant exists
    if (variantId) {
      const addBtn = document.createElement("button");
      addBtn.textContent = "Add to Cart";
      addBtn.onclick = () => {
        window.currentProduct = node; // So addToCart can access variant info
        addToCart(variantId);
      };
      div.appendChild(addBtn);
    }

    container.appendChild(div);
  });
}

  // Hide all <p> elements with the shop-paragraph class
  document.querySelectorAll(".shop-paragraph").forEach(p => {
    p.style.display = "none";
  });
}

// Call this once to load products


let cart = [];

// Adds a variant to the cart and shows the popup
function addToCart(variantId) {
  const variant = window.currentProduct.variants.edges.find(
    (v) => v.node.id === variantId
  )?.node;

  if (!variant) {
    console.error("Variant not found:", variantId);
    return;
  }

  // Check if item already in cart
  const existingItem = cart.find((item) => item.id === variantId);
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

// Show the cart popup and render items
function showCart() {
  const cartPopup = document.getElementById("cart-popup");
  const cartItems = document.getElementById("cart-items");

  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <strong>${item.title}</strong><br>
        ${item.quantity} × ${item.price} ${item.currency}
      </div>`
    )
    .join("");

  cartPopup.style.display = "block";
}

// Hide the cart popup
function closeCart() {
  document.getElementById("cart-popup").style.display = "none";
}

// Checkout: redirect to Shopify with variant IDs and quantities
function goToCheckout() {
  if (cart.length === 0) return;

  const domain = "your-store.myshopify.com"; // 🔁 Replace this
  const cartUrl =
    "https://" +
    domain +
    "/cart/" +
    cart
      .map((item) => item.id.split("/").pop() + ":" + item.quantity)
      .join(",") +
    "?checkout";

  window.location.href = cartUrl;
}



fetchProducts();