// products are moved to products.js and loaded before this script
const products = window.products || [];

const grid = document.getElementById('productsGrid');
let cart = JSON.parse(localStorage.getItem('nz_cart') || '[]');

function getCartCount() {
  const c = JSON.parse(localStorage.getItem('nz_cart') || '[]');
  return c.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  const count = getCartCount();
  if (countEl) {
    countEl.textContent = count;
    countEl.style.display = count ? 'inline-flex' : 'none';
  }
}

function renderCartItems() {
  const summary = document.getElementById('cartSummary');
  if (!summary) return;
  const currentCart = JSON.parse(localStorage.getItem('nz_cart') || '[]');
  if (!currentCart.length) {
    summary.innerHTML = '<p class="empty-cart">Your cart is empty. Add products to continue.</p>';
    const orderForm = document.getElementById('cartOrderForm');
    if (orderForm) orderForm.classList.remove('open');
    return;
  }

  summary.innerHTML = currentCart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-meta">${item.quantity} x ${item.price}</span>
      </div>
      <div class="cart-item-controls">
        <button type="button" class="outline-btn small" onclick="changeCartQty(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button type="button" class="outline-btn small" onclick="changeCartQty(${index}, 1)">+</button>
        <button type="button" class="outline-btn small" onclick="removeCartItem(${index})">Remove</button>
      </div>
    </div>
  `).join('');
  const orderForm = document.getElementById('cartOrderForm');
  if (orderForm) orderForm.classList.remove('open');
}

function openCart() {
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) return;
  cartModal.classList.add('open');
  renderCartItems();
  const orderForm = document.getElementById('cartOrderForm');
  if (orderForm) orderForm.classList.remove('open');
}

function closeCart() {
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) return;
  cartModal.classList.remove('open');
}

function changeCartQty(index, delta) {
  const c = JSON.parse(localStorage.getItem('nz_cart') || '[]');
  if (!c[index]) return;
  c[index].quantity = (c[index].quantity || 0) + delta;
  if (c[index].quantity < 1) c.splice(index, 1);
  localStorage.setItem('nz_cart', JSON.stringify(c));
  updateCartCount();
  renderCartItems();
}

function removeCartItem(index) {
  const c = JSON.parse(localStorage.getItem('nz_cart') || '[]');
  if (!c[index]) return;
  c.splice(index, 1);
  localStorage.setItem('nz_cart', JSON.stringify(c));
  updateCartCount();
  renderCartItems();
}

function clearCart() {
  localStorage.setItem('nz_cart', JSON.stringify([]));
  updateCartCount();
  renderCartItems();
}

function checkoutCart() {
  const currentCart = JSON.parse(localStorage.getItem('nz_cart') || '[]');
  if (!currentCart.length) {
    alert('Your cart is empty. Add products before continuing.');
    return;
  }
  showCartOrderForm();
}

function showCartOrderForm() {
  const currentCart = JSON.parse(localStorage.getItem('nz_cart') || '[]');
  if (!currentCart.length) {
    alert('Your cart is empty. Add products before continuing.');
    return;
  }

  const orderForm = document.getElementById('cartOrderForm');
  if (!orderForm) return;

  document.getElementById('cart-order-success').style.display = 'none';
  orderForm.classList.add('open');

  const totalQty = currentCart.reduce((sum, item) => sum + (item.quantity || 0), 0) || 1;
  const qtyInput = document.getElementById('cart-qty');
  if (qtyInput) qtyInput.value = totalQty;

  ['cart-fname', 'cart-lname', 'cart-phone', 'cart-email', 'cart-address', 'cart-notes'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.value = '';
  });
}

function submitCartOrder() {
  const fname = document.getElementById('cart-fname').value.trim();
  const lname = document.getElementById('cart-lname').value.trim();
  const phone = document.getElementById('cart-phone').value.trim();
  const email = document.getElementById('cart-email').value.trim();
  const address = document.getElementById('cart-address').value.trim();
  const qty = document.getElementById('cart-qty').value;
  const pay = document.getElementById('cart-pay').value;
  const notes = document.getElementById('cart-notes').value.trim();

  if (!fname || !phone || !email || !address) {
    alert('Please fill in all required fields: name, phone, email, and address.');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (!/^(\+92|92|0)?[3][0-9]{9}$/.test(phone.replace(/\s+/g, ''))) {
    alert('Please enter a valid Pakistani phone number.');
    return;
  }

  const currentCart = JSON.parse(localStorage.getItem('nz_cart') || '[]');
  if (!currentCart.length) {
    alert('Your cart is empty. Add products before continuing.');
    return;
  }

  const lineItems = currentCart.map(item => `${item.quantity} x ${item.name} (${item.price})`).join('\n');
  const fullName = fname + (lname ? ' ' + lname : '');
  const message = encodeURIComponent(
    `*NEW CART ORDER - NutriZerno*\n\n` +
    `*Customer Details:*\n` +
    `Name: ${fullName}\n` +
    `Phone: ${phone}\n` +
    `Email: ${email}\n` +
    `Delivery Address: ${address}\n\n` +
    `*Order Summary:*\n` +
    `${lineItems}\n\n` +
    `Quantity: ${qty}\n` +
    `Payment Method: ${pay}\n` +
    `${notes ? `Special Instructions: ${notes}\n` : ''}\n` +
    `*Please contact the customer to confirm and process the order.*`
  );

  const whatsappUrl = `https://wa.me/923335558306?text=${message}`;
  window.open(whatsappUrl, '_blank');

  const success = document.getElementById('cart-order-success');
  if (success) success.style.display = 'block';
  setTimeout(() => {
    if (success) success.style.display = 'none';
    closeCart();
  }, 4000);
}

products.forEach((p, i) => {
  if (!grid) return;
  const whatsappText = encodeURIComponent(`Hi NutriZerno! I want to order ${p.name}. Please send me details about price and delivery.`);
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <a class="product-card-link" href="product.html?id=${i}">
      <div class="product-top">
        <span class="product-badge">${p.badge}</span>
        ${window.renderProductPrice(p)}
      </div>
      <div class="product-img"><img src="${p.icon}" alt="${p.name} - NutriZerno premium wellness product" loading="lazy"></div>
      <div class="product-name">${p.name}</div>
      <div class="product-snippet">${p.shortDesc || p.desc}</div>
    </a>
    <div class="product-body">
      <div class="product-actions">
        <a class="outline-btn" href="product.html?id=${i}">See More</a>
        <button class="buy-btn" onclick="openModal(${i}); event.stopPropagation();">Buy Now</button>
      </div>
      <a class="whatsapp-link" href="https://wa.me/923335558306?text=${whatsappText}" target="_blank" onclick="event.stopPropagation();">Order Via WhatsApp</a>
    </div>`;
  grid.appendChild(card);
});

updateCartCount();

function openModal(i) {
  const p = products[i];
  document.getElementById('modalProductInfo').innerHTML = `Ordering: <strong>${p.name}</strong><br><span style="color:var(--muted);font-size:13px">${window.getProductDisplayPrice(p)} per unit</span>`;
  document.getElementById('buyModal').classList.add('open');
  document.getElementById('order-success').style.display = 'none';
  ['b-fname', 'b-lname', 'b-phone', 'b-email', 'b-address', 'b-notes'].forEach(id => document.getElementById(id).value = '');
}

function closeModal() {
  document.getElementById('buyModal').classList.remove('open');
}

const buyModalEl = document.getElementById('buyModal');
if (buyModalEl) {
  buyModalEl.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
}

const cartModal = document.getElementById('cartModal');
if (cartModal) {
  cartModal.addEventListener('click', function (e) {
    if (e.target === this) closeCart();
  });
}

function addToCart(i) {
  const p = products[i];
  const c = JSON.parse(localStorage.getItem('nz_cart') || '[]');
  const existing = c.find(item => item.name === p.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    c.push({ name: p.name, price: window.getProductDisplayPrice(p), quantity: 1 });
  }
  localStorage.setItem('nz_cart', JSON.stringify(c));
  updateCartCount();
  renderCartItems();
  alert(`${p.name} added to cart.`);
}

function submitOrder() {
  const fname = document.getElementById('b-fname').value.trim();
  const lname = document.getElementById('b-lname').value.trim();
  const phone = document.getElementById('b-phone').value.trim();
  const email = document.getElementById('b-email').value.trim();
  const address = document.getElementById('b-address').value.trim();
  const qty = document.getElementById('b-qty').value;
  const pay = document.getElementById('b-pay').value;
  const notes = document.getElementById('b-notes').value.trim();

  if (!fname || !phone || !email || !address) {
    alert('Please fill in all required fields: name, phone, email, and address.');
    return;
  }

  // Validate phone number format (basic Pakistani number validation)
  if (!/^(\+92|92|0)?[3][0-9]{9}$/.test(phone.replace(/\s+/g, ''))) {
    alert('Please enter a valid Pakistani phone number.');
    return;
  }

  // Get product info from modal
  const productInfo = document.getElementById('modalProductInfo').textContent;

  // Construct WhatsApp message
  const fullName = fname + (lname ? ' ' + lname : '');
  const message = encodeURIComponent(
    `*NEW ORDER - NutriZerno*\n\n` +
    `*Customer Details:*\n` +
    `Name: ${fullName}\n` +
    `Phone: ${phone}\n` +
    `Email: ${email}\n` +
    `Address: ${address}\n\n` +
    `*Order Details:*\n` +
    `${productInfo}\n` +
    `Quantity: ${qty}\n` +
    `Payment Method: ${pay}\n` +
    `${notes ? `Special Instructions: ${notes}\n` : ''}\n` +
    `*Please contact customer to confirm and process this order immediately.*`
  );

  // WhatsApp URL
  const whatsappUrl = `https://wa.me/923335558306?text=${message}`;

  // Open WhatsApp
  window.open(whatsappUrl, '_blank');

  // Show success message and close modal
  document.getElementById('order-success').style.display = 'block';
  setTimeout(closeModal, 4000);
}

function sendContactMsg() {
  const name = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const msg = document.getElementById('c-msg').value.trim();

  if (!name || !email || !msg) {
    alert('Please fill in your name, email, and message.');
    return;
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Create WhatsApp message
  const message = encodeURIComponent(
    `*NEW MESSAGE - NutriZerno Website*\n\n` +
    `*From:* ${name}\n` +
    `*Email:* ${email}\n\n` +
    `*Message:*\n${msg}\n\n` +
    `*Please reply to this customer as soon as possible.*`
  );

  // Send via WhatsApp
  const whatsappUrl = `https://wa.me/923335558306?text=${message}`;
  window.open(whatsappUrl, '_blank');

  // Clear form and show success message
  document.getElementById('c-name').value = '';
  document.getElementById('c-email').value = '';
  document.getElementById('c-msg').value = '';
  document.getElementById('contact-success').style.display = 'block';

  // Hide success message after 3 seconds
  setTimeout(() => {
    document.getElementById('contact-success').style.display = 'none';
  }, 3000);
}

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  const navButtons = document.querySelector('.nav-buttons');
  navLinks.classList.toggle('open');
  navButtons.classList.toggle('open');
}