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

  let imagesHtml = `<ul class="image-scroll-list">` +
    product.images.edges.map(img =>
      `<li><img src="${img.node.src}" alt="${img.node.altText || ''}"></li>`
    ).join('') +
    `</ul>`;

  if (product.variants.edges.length === 1) {
    const variant = product.variants.edges[0].node;
    const variantTitle = variant.title && variant.title !== "Default Title"
      ? `${product.title} - ${variant.title}`
      : product.title;
    document.getElementById("product-detail").innerHTML = `
      ${imagesHtml}
      <p class="product-title" style="padding-top: 1rem;">${product.title}</p>
      <div class="shop-paragraph">${product.descriptionHtml}</div>
      <div class="product-variant" style="padding-top: 0.5rem;">
        <span class="product-title">${product.title}</span>
        <span class="product-price">$${parseFloat(variant.price.amount).toFixed(2)}</span>
        <button onclick="addToCart(
          '${variant.id}',
          '${variantTitle}',
          '${variant.price.amount}',
          '${variant.price.currencyCode}',
          '${product.images.edges[0]?.node.src || ""}'
        )">Add to Cart</button>
      </div>
    `;
    return;
  }

  let variantsHtml = product.variants.edges.map(variant =>
    `<div class="product-variant" style="padding-top: 0.5rem;">
      <span class="p">${variant.node.title}</span>
      <span class="product-price">$${parseFloat(variant.node.price.amount).toFixed(2)}</span>
      <button onclick="addToCart(
        '${variant.node.id}',
        '${product.title} — ${variant.node.title}',
        '${variant.node.price.amount}',
        '${variant.node.price.currencyCode}',
        '${product.images.edges[0]?.node.src || ""}'
      )">Add to Cart</button>
    </div>`
  ).join("");

  document.getElementById("product-detail").innerHTML = `
    ${imagesHtml}
    <p class="product-title">${product.title}</p>
    <div class="shop-paragraph">${product.descriptionHtml}</div>
    <p class="product-variant" style="font-weight: bold;">Style</p>
    ${variantsHtml}
  `;
}

function addToCart(variantId, title, price, currency, image) {
  const existing = cart.find(item => item.variantId === variantId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ variantId, title, price, currency, image, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  showCart();
}

fetchProduct();