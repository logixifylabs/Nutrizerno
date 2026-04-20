const products = [
  { name: "HormoBalance Talbeena", badge: "Best Seller", icon: "./images/Product3.png", price: "PKR 899", desc: "250g | Dietitian-formulated functional blend specially designed to support hormonal balance in women, particularly those managing PCOS. Combines traditional barley nutrition with seed cycling blend for natural hormone support and healthy weight management." },
  { name: "Golden Age Talbeena", badge: "Premium", icon: "./images/Product2.png", price: "PKR 799", desc: "250g | Luxurious, dietitian-crafted wellness blend inspired by traditional Sunnah nutrition. Ideal for complete nourishment, strength, and balanced health. Supports digestive health, heart vitality, mental calmness, and is suitable for all age groups, especially seniors." },
  { name: "Luteal Phase Seed Mix", badge: "Featured", icon: "./images/Product8.jpeg", price: "PKR 899", desc: "200g | Sunflower Seeds + Sesame Seeds. Designed for your luteal phase (Day 15–28) with a nourishing blend to balance progesterone, reduce PMS symptoms, and promote calm, steady energy. Rich in selenium for liver detox, magnesium for mood support, and Vitamin E for glowing skin." },
  { name: "Follicular Phase Seed Mix", badge: "Popular", icon: "./images/Product7.jpeg", price: "PKR 749", desc: "200g | Pumpkin Seeds + Flaxseeds. Support your body naturally during the follicular phase (Day 1–14) with a powerful blend rich in lignans and zinc. Helps balance estrogen levels, supports PCOS & cycle health, boosts energy & metabolism." },
  { name: "Almonds (Badam)", badge: "Natural", icon: "./images/Product1.jpeg", price: "PKR 449 - 1,120", desc: "Premium quality King of Nuts. 100g = PKR 449 | 250g = PKR 1,120. Boosts brain function and memory, improves skin glow and hair strength, supports heart health. Rich in Vitamin E and healthy fats for maintaining energy levels." },
  { name: "Foxnuts (Makhana)", badge: "Wellness", icon: "./images/Product4.jpeg", price: "PKR 400 - 749", desc: "Low-calorie superfood. 50g = PKR 400 | 100g = PKR 749. High in antioxidants, supports weight loss and fat control. Helps regulate blood sugar levels, supports heart and thyroid health. Perfect for healthy snacking and detox diets." },
];

const grid = document.getElementById('productsGrid');
const cart = [];

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
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
  if (!cart.length) {
    summary.innerHTML = '<p class="empty-cart">Your cart is empty. Add products to continue.</p>';
    return;
  }

  summary.innerHTML = cart.map((item, index) => `
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
}

function openCart() {
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) return;
  cartModal.classList.add('open');
  renderCartItems();
}

function closeCart() {
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) return;
  cartModal.classList.remove('open');
}

function changeCartQty(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }
  updateCartCount();
  renderCartItems();
}

function removeCartItem(index) {
  if (!cart[index]) return;
  cart.splice(index, 1);
  updateCartCount();
  renderCartItems();
}

function clearCart() {
  cart.length = 0;
  updateCartCount();
  renderCartItems();
}

function checkoutCart() {
  if (!cart.length) {
    alert('Your cart is empty. Add products before continuing.');
    return;
  }
  const lineItems = cart.map(item => `${item.quantity} x ${item.name} (${item.price})`).join('\n');
  const message = encodeURIComponent(
    `*🛒 NEW CART ORDER - NutriZerno*\n\n` +
    `*Order Summary:*\n` +
    `${lineItems}\n\n` +
    `Please share delivery charges and confirmation details.\n`
  );
  const whatsappUrl = `https://wa.me/923335558306?text=${message}`;
  window.open(whatsappUrl, '_blank');
  document.getElementById('cart-success').style.display = 'block';
  setTimeout(() => {
    document.getElementById('cart-success').style.display = 'none';
    closeCart();
  }, 3000);
}

products.forEach((p, i) => {
  const whatsappText = encodeURIComponent(`Hi NutriZerno! I want to order ${p.name}. Please send me details about price and delivery.`);
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-body">
      <div class="product-top">
        <span class="product-badge">${p.badge}</span>
        <div class="product-price">${p.price}</div>
      </div>
      <div class="product-img"><img src="${p.icon}" alt="${p.name} - NutriZerno premium wellness product" loading="lazy"></div>
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-actions">
        <button class="outline-btn" onclick="addToCart(${i})">Add to cart</button>
        <button class="buy-btn" onclick="openModal(${i})">Buy Now</button>
      </div>
      <a class="whatsapp-link" href="https://wa.me/923335558306?text=${whatsappText}" target="_blank">Order Via WhatsApp</a>
    </div>`;
  grid.appendChild(card);
});

updateCartCount();

function openModal(i) {
  const p = products[i];
  document.getElementById('modalProductInfo').innerHTML = `Ordering: <strong>${p.name}</strong><br><span style="color:var(--muted);font-size:13px">${p.price} per unit</span>`;
  document.getElementById('buyModal').classList.add('open');
  document.getElementById('order-success').style.display = 'none';
  ['b-fname', 'b-lname', 'b-phone', 'b-email', 'b-address', 'b-notes'].forEach(id => document.getElementById(id).value = '');
}

function closeModal() {
  document.getElementById('buyModal').classList.remove('open');
}

document.getElementById('buyModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

const cartModal = document.getElementById('cartModal');
if (cartModal) {
  cartModal.addEventListener('click', function (e) {
    if (e.target === this) closeCart();
  });
}

function addToCart(i) {
  const p = products[i];
  const existing = cart.find(item => item.name === p.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name: p.name,
      price: p.price,
      quantity: 1
    });
  }
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
    `*🆕 NEW ORDER - NutriZerno*\n\n` +
    `*👤 Customer Details:*\n` +
    `Name: ${fullName}\n` +
    `📱 Phone: ${phone}\n` +
    `📧 Email: ${email}\n` +
    `🏠 Address: ${address}\n\n` +
    `*📦 Order Details:*\n` +
    `${productInfo}\n` +
    `Quantity: ${qty}\n` +
    `💳 Payment Method: ${pay}\n` +
    `${notes ? `📝 Special Instructions: ${notes}\n` : ''}\n` +
    `*⚡ Please contact customer to confirm and process this order immediately.*`
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
    `*📬 NEW MESSAGE - NutriZerno Website*\n\n` +
    `*👤 From:* ${name}\n` +
    `*📧 Email:* ${email}\n\n` +
    `*💬 Message:*\n${msg}\n\n` +
    `*⏰ Please reply to this customer as soon as possible.*`
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