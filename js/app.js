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



function displayProducts(products) {
  const container = document.getElementById("product-list");

  products.forEach(({ node }) => {
    const image = node.images.edges[0]?.node.src || "";
    const alt = node.images.edges[0]?.node.altText || "";
    const handle = node.handle;
    const productUrl = `product.html?handle=${handle}`;

    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${image}" alt="${alt}" width="400">
      <h2>${node.title}</h2>
      <p class="shop-paragraph">${node.description}</p>
      <a href="${productUrl}">
        <button>View</button>
      </a>
    `;
    container.appendChild(div);
  });
}

fetchProducts();

document.querySelectorAll(".shop-paragraph").forEach(p => {
  p.style.display = "none";
});



function displayProducts(products) {
  const container = document.getElementById("product-list");

  products.forEach(({ node }) => {
    const div = document.createElement("div");
    div.className = "product";

    const image = node.images.edges[0]?.node.src || "";
    const alt = node.images.edges[0]?.node.altText || "";

    // Assign 'shop-paragraph' class to <p>
    div.innerHTML = `
      <img src="${image}" alt="${alt}" width="400">
      <h2>${node.title}</h2>
      <p class="shop-paragraph">${node.description}</p>
    `;

    container.appendChild(div);
  });
}

function displayProducts(products) {
  const container = document.getElementById("product-list");

  products.forEach(({ node }) => {
    const div = document.createElement("div");
    div.className = "product";

    const image = node.images.edges[0]?.node.src || "";
    const alt = node.images.edges[0]?.node.altText || "";
    const handle = node.handle; // Make sure your query includes 'handle'
    const productUrl = `product.html?handle=${handle}`;

    div.innerHTML = `
      <img src="${image}" alt="${alt}" width="400">
      <h2>${node.title}</h2>
      <p class="shop-paragraph">${node.description}</p>
      <a href="${productUrl}" target="_blank">
        <button>View</button>
      </a>
    `;

    container.appendChild(div);
  });
}

const productUrl = `product.html?handle=${handle}`;
div.innerHTML = `
  <img src="${image}" alt="${alt}" width="400">
  <h2>${node.title}</h2>
  <p class="shop-paragraph">${node.description}</p>
  <a href="${productUrl}">
    <button>View</button>
  </a>
`;