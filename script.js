// ===== Carrito de Compras =====
let cart = [];

// Elementos del DOM
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const contactForm = document.getElementById('contactForm');

// ===== Funciones del Carrito =====

// Agregar producto al carrito
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: parseFloat(price),
      quantity: 1
    });
  }
  
  updateCart();
  showNotification(`✅ ${name} agregado al carrito`);
}

// Eliminar producto del carrito
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
  showNotification('🗑️ Producto eliminado del carrito');
}

// Actualizar carrito
function updateCart() {
  // Actualizar contador
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Actualizar contenido del modal
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    totalPrice.textContent = 'S/0';
    return;
  }
  
  // Renderizar items del carrito
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>S/${item.price} x ${item.quantity}</p>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${index})">
        Eliminar
      </button>
    </div>
  `).join('');
  
  // Calcular total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalPrice.textContent = `S/${total.toFixed(2)}`;
}

// Mostrar notificación
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #00f0ff 0%, #00e69f 100%);
    color: #000;
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: 600;
    z-index: 3000;
    animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
    box-shadow: 0 5px 20px rgba(0, 240, 255, 0.5);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ===== Event Listeners =====

// Abrir modal del carrito
cartBtn.addEventListener('click', () => {
  cartModal.classList.add('active');
});

// Cerrar modal del carrito
closeCart.addEventListener('click', () => {
  cartModal.classList.remove('active');
});

// Cerrar modal al hacer click fuera
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove('active');
  }
});

// Botones de agregar al carrito
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const name = e.target.dataset.name;
    const price = e.target.dataset.price;
    addToCart(name, price);
  });
});

// Proceder al pago
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    showNotification('⚠️ Tu carrito está vacío');
    return;
  }
  
  // Crear mensaje para WhatsApp
  let message = '🛒 *Nuevo Pedido desde KOH STORE*\n\n';
  
  cart.forEach(item => {
    message += `• ${item.name}\n`;
    message += `  Cantidad: ${item.quantity}\n`;
    message += `  Precio: S/${item.price}\n`;
    message += `  Subtotal: S/${(item.price * item.quantity).toFixed(2)}\n\n`;
  });
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `*TOTAL: S/${total.toFixed(2)}*`;
  
  // Codificar mensaje para URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/974909117?text=${encodedMessage}`;
  
  // Abrir WhatsApp
  window.open(whatsappURL, '_blank');
  
  // Limpiar carrito
  cart = [];
  updateCart();
  cartModal.classList.remove('active');
  showNotification('✅ Redirigiendo a WhatsApp...');
});

// ===== Formulario de Contacto =====
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // Crear mensaje para WhatsApp
  const whatsappMessage = `📧 *Nuevo Mensaje de Contacto*\n\n*Nombre:* ${name}\n*Email:* ${email}\n*Mensaje:* ${message}`;
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappURL = `https://wa.me/974909117?text=${encodedMessage}`;
  
  // Abrir WhatsApp
  window.open(whatsappURL, '_blank');
  
  // Limpiar formulario
  contactForm.reset();
  showNotification('✅ Mensaje enviado. Redirigiendo a WhatsApp...');
});

// ===== Animaciones al Scroll =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observar elementos
document.querySelectorAll('.product-card, .testimonial-card, .contact-item').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ===== Smooth Scroll para navegación =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== Header transparente al hacer scroll =====
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.style.boxShadow = '0 2px 20px rgba(0, 240, 255, 0.3)';
  } else {
    header.style.boxShadow = '0 2px 30px rgba(0, 240, 255, 0.5)';
  }
  
  lastScroll = currentScroll;
});

// ===== Animaciones CSS adicionales =====
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== Inicialización =====
console.log('🚀 KOH STORE cargado correctamente');
updateCart();
