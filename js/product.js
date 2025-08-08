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
              price
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

   console.log("Handle:", handle);

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
      <strong>${variant.node.title}</strong> - $${variant.node.price}
      <button onclick="addToCart('${variant.node.id}')">Add to Cart</button>
    </div>`
  ).join("");

  document.getElementById("product-detail").innerHTML = `
    <h1>${product.title}</h1>
    ${imagesHtml}
    <p>${product.description}</p>
    <h3>Variants</h3>
    ${variantsHtml}
  `;
}

function addToCart(variantId) {
  alert("Add to cart functionality requires Shopify Buy SDK or custom integration.");
}

fetchProduct();