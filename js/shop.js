
const shopDomain = "gbg11r-ah.myshopify.com";
const storefrontAccessToken = "e4c45ba5e531c0c76f492bd773f5f339";

async function fetchProducts() {
  const query = `
    {
      products(first: 50) {
        edges {
          node {
            handle
            title
            description
            descriptionHtml
            images(first: 1) {
              edges {
                node {
                  src
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const response = await fetch(`https://${shopDomain}/api/2023-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query })
  });
  const json = await response.json();
  return json.data.products.edges;
}

function renderProducts(products) {
  const container = document.getElementById("product-list");
  if (!products.length) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }
  container.innerHTML = products.map(({ node: product }) => {
    const image = product.images.edges[0]?.node.src || "";
    const alt = product.images.edges[0]?.node.altText || "";
    const price = product.variants.edges[0]?.node.price.amount || "";
    const currency = product.variants.edges[0]?.node.price.currencyCode || "";
    const handle = product.handle;
    return `
      <article class="product-list">
        <figure class="product">
          <a href="productdetail/index.html?handle=${handle}"><img src="${image}" alt="${alt}"></a>
        </figure>
        <figcaption>
          <a href="productdetail/index.html?handle=${handle}" class="shop-detail-link"><p class="product-title">${product.title}</p></a>
        </figcaption>
      </article>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", async function() {
  const products = await fetchProducts();
  renderProducts(products);
});
