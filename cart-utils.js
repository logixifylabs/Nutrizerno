// Utility functions to manage cart in localStorage and update cart badge
(function () {
  function getCart() {
    return JSON.parse(localStorage.getItem('nz_cart') || '[]');
  }

  function saveCart(c) {
    localStorage.setItem('nz_cart', JSON.stringify(c));
  }

  function getCartCount() {
    return getCart().reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  function updateCartCountElement() {
    const count = getCartCount();
    const el = document.getElementById('cartCount');
    if (!el) return;
    el.textContent = count;
    el.style.display = count ? 'inline-flex' : 'none';
  }

  function addProductToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
      existing.quantity = (existing.quantity || 0) + 1;
    } else {
      cart.push({ name: product.name, price: (window.getProductDisplayPrice ? window.getProductDisplayPrice(product) : product.price), quantity: 1 });
    }
    saveCart(cart);
    updateCartCountElement();
    return cart;
  }

  window.nzCart = {
    getCart,
    saveCart,
    addProductToCart,
    updateCartCountElement,
    getCartCount
  };

  // Update badge on load
  document.addEventListener('DOMContentLoaded', updateCartCountElement);
})();
