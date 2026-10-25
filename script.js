const cart = [];
const cartOverlay = document.getElementById('cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const drawerCount = document.getElementById('drawer-count');
const subtotal = document.getElementById('cart-subtotal');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}
function openCart() {
  cartOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('close-cart-x').focus();
}
function closeCart() {
  cartOverlay.hidden = true;
  document.body.style.overflow = '';
  document.getElementById('open-cart').focus();
}
document.getElementById('open-cart').addEventListener('click', openCart);
document.getElementById('close-cart').addEventListener('click', closeCart);
document.getElementById('close-cart-x').addEventListener('click', closeCart);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !cartOverlay.hidden) closeCart(); });

function addToCart(card) {
  const id = card.dataset.id;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({id, name: card.dataset.name, price: Number(card.dataset.price), qty: 1, type: card.dataset.type});
  renderCart();
  showToast(`${card.dataset.name} added to your bag`);
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = count;
  drawerCount.textContent = `(${count})`;
  subtotal.textContent = `$${total.toFixed(0)}`;
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is taking it easy.<br>Find something you love.</p>';
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-art"><div class="mini-hoodie ${item.id.includes('navy') ? 'navy-hoodie' : item.id.includes('oat') ? 'oat-hoodie' : item.id.includes('sage') ? 'sage-hoodie' : 'charcoal-hoodie'}"></div></div>
      <div><h3>${item.name}</h3><p>${item.type === 'classic' ? 'Classic fit' : 'Relaxed fit'} · One size selection demo</p>
        <div class="qty-controls"><button data-action="minus" data-id="${item.id}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-action="plus" data-id="${item.id}" aria-label="Increase quantity">+</button></div>
      </div>
      <div><b style="font-size:11px">$${item.price * item.qty}</b><br><button class="remove-item" data-action="remove" data-id="${item.id}">Remove</button></div>
    </div>`).join('');
}
document.querySelectorAll('.quick-add').forEach(button => {
  button.addEventListener('click', () => addToCart(button.closest('.product-card')));
});
cartItems.addEventListener('click', e => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;
  const item = cart.find(i => i.id === button.dataset.id);
  if (!item) return;
  if (button.dataset.action === 'plus') item.qty++;
  if (button.dataset.action === 'minus') item.qty--;
  if (button.dataset.action === 'remove') item.qty = 0;
  const index = cart.indexOf(item);
  if (item.qty <= 0) cart.splice(index, 1);
  renderCart();
});
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.type !== filter;
    });
  });
});
document.querySelectorAll('.swatches').forEach(group => {
  group.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      group.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      showToast(`${swatch.getAttribute('aria-label')} selected — demo only`);
    });
  });
});
document.getElementById('checkout-button').addEventListener('click', () => {
  showToast('Checkout is a demo. Connect your store platform to accept orders.');
});
document.getElementById('newsletter-form').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('newsletter-message').textContent = 'Thanks for joining us — signup is in demo mode.';
  e.target.reset();
});
document.querySelector('.menu-toggle').addEventListener('click', () => {
  const nav = document.querySelector('.desktop-nav');
  const open = nav.style.display === 'flex';
  nav.style.display = open ? 'none' : 'flex';
  nav.style.position = 'absolute';
  nav.style.top = '70px';
  nav.style.left = '0';
  nav.style.right = '0';
  nav.style.padding = '22px 6%';
  nav.style.background = 'var(--paper)';
  nav.style.borderBottom = '1px solid var(--line)';
  nav.style.flexDirection = 'column';
  nav.style.alignItems = 'flex-start';
  nav.style.gap = '18px';
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', String(!open));
});
document.querySelectorAll('.desktop-nav a').forEach(link => link.addEventListener('click', () => {
  if (window.innerWidth <= 600) document.querySelector('.desktop-nav').style.display = 'none';
}));
document.getElementById('year').textContent = new Date().getFullYear();
