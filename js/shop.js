const domain = "gbg11r-ah.myshopify.com";
const storefrontAccessToken = "e4c45ba5e531c0c76f492bd773f5f339";

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
      <a href="${productUrl}">
        <img src="${image}" alt="${alt}" width="400">
        <p class="product-title">${node.title}</p>
      </a>
      <p class="shop-paragraph">${node.description}</p>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".shop-paragraph").forEach(p => {
    p.style.display = "none";
  });
}

fetchProducts();