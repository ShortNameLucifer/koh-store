require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.ADMIN_TELEGRAM_ID;

const bot = new TelegramBot(token, { polling: true });

// Almacenamiento temporal de carritos (en producción usar base de datos)
const carts = {};
const orders = [];

// Productos de KOH STORE
const products = {
  smartfit: {
    id: 'smartfit',
    name: '🏋️ SMART FIT MEMBRESÍA BLACK',
    description: 'Acceso ilimitado a todas las sedes Smart Fit',
    image: './productos/smartfit.jpg',
    variants: [
      { id: '1mes', name: '1 Mes', price: 50 },
      { id: '3meses', name: '3 Meses', price: 120 }
    ]
  },
  zeusdox: {
    id: 'zeusdox',
    name: '⚡ ZEUS DOX',
    description: 'Consulta de DNI y datos personales',
    image: './productos/zeusdox.jpg',
    variants: [
      { id: 'consulta', name: 'Consulta', price: 30 }
    ]
  },
  vuelos: {
    id: 'vuelos',
    name: '✈️ VUELOS',
    description: 'Boletos de avión nacionales e internacionales',
    image: './productos/vuelos.jpg',
    variants: [
      { id: 'consultar', name: 'Consultar precio', price: 0 }
    ]
  },
  instagram: {
    id: 'instagram',
    name: '🔥 INSTAGRAM FOLLOWERS',
    description: 'Seguidores reales para tu cuenta de Instagram',
    image: './productos/instagram.jpg',
    variants: [
      { id: '1k', name: '1,000 Followers', price: 40 },
      { id: '5k', name: '5,000 Followers', price: 150 },
      { id: '10k', name: '10,000 Followers', price: 350 }
    ]
  }
};

// Función para crear el teclado principal
function getMainKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🛍️ Ver Catálogo', callback_data: 'catalog' },
          { text: '🛒 Mi Carrito', callback_data: 'cart' }
        ],
        [
          { text: '📞 Contacto', callback_data: 'contact' },
          { text: 'ℹ️ Información', callback_data: 'info' }
        ]
      ]
    }
  };
}

// Función para crear el teclado del catálogo
function getCatalogKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🏋️ Smart Fit', callback_data: 'product_smartfit' },
          { text: '⚡ Zeus Dox', callback_data: 'product_zeusdox' }
        ],
        [
          { text: '✈️ Vuelos', callback_data: 'product_vuelos' },
          { text: '🔥 Instagram', callback_data: 'product_instagram' }
        ],
        [
          { text: '🔙 Volver al Menú', callback_data: 'main_menu' }
        ]
      ]
    }
  };
}

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'Cliente';
  
  const welcomeMessage = `
🎉 ¡Bienvenido a KOH STORE, ${userName}! 🎉

Tu tienda de confianza para:
🏋️ Membresías Smart Fit
⚡ Consultas Zeus Dox
✈️ Boletos de avión
🔥 Seguidores de Instagram

¿Qué deseas hacer hoy?
  `;
  
  bot.sendMessage(chatId, welcomeMessage, getMainKeyboard());
});

// Comando /admin (solo para el administrador)
bot.onText(/\/admin/, (msg) => {
  const chatId = msg.chat.id;
  
  if (chatId.toString() !== adminId) {
    bot.sendMessage(chatId, '❌ No tienes permisos para acceder a esta función.');
    return;
  }
  
  const stats = `
📊 PANEL DE ADMINISTRACIÓN - KOH STORE

📦 Total de pedidos: ${orders.length}
👥 Clientes únicos: ${new Set(orders.map(o => o.userId)).size}
💰 Pedidos completados: ${orders.filter(o => o.status === 'completed').length}

Últimos 5 pedidos:
${orders.slice(-5).reverse().map((order, i) => 
  `${i + 1}. Pedido #${order.id} - ${order.userName} - S/${order.total}`
).join('\n') || 'No hay pedidos aún'}
  `;
  
  bot.sendMessage(chatId, stats);
});

// Manejador de callbacks
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;
  const userId = query.from.id;
  
  // Inicializar carrito si no existe
  if (!carts[userId]) {
    carts[userId] = [];
  }
  
  // Menú principal
  if (data === 'main_menu') {
    bot.editMessageText('🏠 Menú Principal\n\n¿Qué deseas hacer?', {
      chat_id: chatId,
      message_id: messageId,
      ...getMainKeyboard()
    });
  }
  
  // Catálogo
  else if (data === 'catalog') {
    bot.editMessageText('🛍️ CATÁLOGO DE PRODUCTOS\n\nSelecciona un producto para ver más detalles:', {
      chat_id: chatId,
      message_id: messageId,
      ...getCatalogKeyboard()
    });
  }
  
  // Ver producto específico
  else if (data.startsWith('product_')) {
    const productId = data.replace('product_', '');
    const product = products[productId];
    
    if (product) {
      const variantButtons = product.variants.map(variant => [{
        text: `${variant.name} - S/${variant.price}`,
        callback_data: `add_${productId}_${variant.id}`
      }]);
      
      variantButtons.push([{ text: '🔙 Volver al Catálogo', callback_data: 'catalog' }]);
      
      const productMessage = `
${product.name}

📝 ${product.description}

💰 Precios disponibles:
${product.variants.map(v => `• ${v.name}: S/${v.price}`).join('\n')}

Selecciona una opción para agregar al carrito:
      `;
      
      // Enviar imagen si existe
      if (fs.existsSync(product.image)) {
        await bot.sendPhoto(chatId, product.image, {
          caption: productMessage,
          reply_markup: {
            inline_keyboard: variantButtons
          }
        });
        bot.deleteMessage(chatId, messageId);
      } else {
        bot.editMessageText(productMessage, {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: variantButtons
          }
        });
      }
    }
  }
  
  // Agregar al carrito
  else if (data.startsWith('add_')) {
    const [_, productId, variantId] = data.split('_');
    const product = products[productId];
    const variant = product.variants.find(v => v.id === variantId);
    
    carts[userId].push({
      productId,
      productName: product.name,
      variantId,
      variantName: variant.name,
      price: variant.price
    });
    
    bot.answerCallbackQuery(query.id, {
      text: `✅ ${product.name} - ${variant.name} agregado al carrito`,
      show_alert: false
    });
    
    bot.sendMessage(chatId, `✅ Producto agregado al carrito\n\n¿Deseas continuar comprando?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛍️ Seguir Comprando', callback_data: 'catalog' },
            { text: '🛒 Ver Carrito', callback_data: 'cart' }
          ],
          [
            { text: '🏠 Menú Principal', callback_data: 'main_menu' }
          ]
        ]
      }
    });
  }
  
  // Ver carrito
  else if (data === 'cart') {
    const cart = carts[userId] || [];
    
    if (cart.length === 0) {
      bot.editMessageText('🛒 Tu carrito está vacío\n\n¡Explora nuestro catálogo!', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [{ text: '🛍️ Ver Catálogo', callback_data: 'catalog' }],
            [{ text: '🏠 Menú Principal', callback_data: 'main_menu' }]
          ]
        }
      });
    } else {
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      const cartMessage = `
🛒 TU CARRITO

${cart.map((item, i) => `${i + 1}. ${item.productName}\n   ${item.variantName} - S/${item.price}`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━
💰 TOTAL: S/${total}
      `;
      
      bot.editMessageText(cartMessage, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Realizar Pedido', callback_data: 'checkout' },
              { text: '🗑️ Vaciar Carrito', callback_data: 'clear_cart' }
            ],
            [
              { text: '🛍️ Seguir Comprando', callback_data: 'catalog' },
              { text: '🏠 Menú Principal', callback_data: 'main_menu' }
            ]
          ]
        }
      });
    }
  }
  
  // Vaciar carrito
  else if (data === 'clear_cart') {
    carts[userId] = [];
    bot.answerCallbackQuery(query.id, {
      text: '🗑️ Carrito vaciado',
      show_alert: false
    });
    bot.editMessageText('🗑️ Carrito vaciado\n\n¿Deseas ver el catálogo?', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: '🛍️ Ver Catálogo', callback_data: 'catalog' }],
          [{ text: '🏠 Menú Principal', callback_data: 'main_menu' }]
        ]
      }
    });
  }
  
  // Realizar pedido
  else if (data === 'checkout') {
    const cart = carts[userId] || [];
    
    if (cart.length === 0) {
      bot.answerCallbackQuery(query.id, {
        text: '❌ Tu carrito está vacío',
        show_alert: true
      });
      return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const orderId = Date.now();
    const userName = query.from.first_name + (query.from.last_name ? ' ' + query.from.last_name : '');
    const userUsername = query.from.username ? '@' + query.from.username : 'Sin username';
    
    // Guardar pedido
    const order = {
      id: orderId,
      userId,
      userName,
      userUsername,
      items: [...cart],
      total,
      date: new Date().toLocaleString('es-PE'),
      status: 'pending'
    };
    orders.push(order);
    
    // Mensaje para el cliente
    const orderMessage = `
✅ ¡PEDIDO REALIZADO CON ÉXITO!

📦 Pedido #${orderId}

${cart.map((item, i) => `${i + 1}. ${item.productName}\n   ${item.variantName} - S/${item.price}`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━
💰 TOTAL: S/${total}

📞 Nos pondremos en contacto contigo pronto para coordinar el pago y entrega.

💳 Métodos de pago:
• Yape / Plin
• Transferencia bancaria
• Efectivo

¡Gracias por tu compra! 🎉
    `;
    
    bot.editMessageText(orderMessage, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: '🏠 Volver al Menú', callback_data: 'main_menu' }]
        ]
      }
    });
    
    // Notificar al administrador
    if (adminId) {
      const adminMessage = `
🔔 NUEVO PEDIDO - KOH STORE

📦 Pedido #${orderId}
👤 Cliente: ${userName}
📱 Usuario: ${userUsername}
🆔 ID: ${userId}

🛍️ Productos:
${cart.map((item, i) => `${i + 1}. ${item.productName}\n   ${item.variantName} - S/${item.price}`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━
💰 TOTAL: S/${total}

📅 Fecha: ${order.date}
      `;
      
      bot.sendMessage(adminId, adminMessage, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '💬 Contactar Cliente', url: `tg://user?id=${userId}` }]
          ]
        }
      });
    }
    
    // Vaciar carrito
    carts[userId] = [];
  }
  
  // Contacto
  else if (data === 'contact') {
    const contactMessage = `
📞 CONTACTO - KOH STORE

¿Tienes alguna pregunta? ¡Contáctanos!

📱 WhatsApp: +51 974909117
💬 Telegram: @kohstoreoficial
📧 Email: kohstore@gmail.com

🕐 Horario de atención:
Lunes a Domingo: 9:00 AM - 10:00 PM

¡Estamos para ayudarte! 😊
    `;
    
    bot.editMessageText(contactMessage, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📱 WhatsApp', url: 'https://wa.me/51974909117' },
            { text: '💬 Telegram', url: 'https://t.me/kohstoreoficial' }
          ],
          [
            { text: '🔙 Volver al Menú', callback_data: 'main_menu' }
          ]
        ]
      }
    });
  }
  
  // Información
  else if (data === 'info') {
    const infoMessage = `
ℹ️ INFORMACIÓN - KOH STORE

🏪 Sobre nosotros:
Somos tu tienda de confianza para servicios digitales y membresías.

✅ ¿Por qué elegirnos?
• Precios competitivos
• Entrega rápida
• Atención personalizada
• Productos garantizados
• Soporte 24/7

💳 Métodos de pago:
• Yape / Plin
• Transferencia bancaria
• Efectivo

🚚 Entrega:
• Digital: Inmediata
• Física: Coordinamos contigo

🔒 Seguridad:
Todos tus datos están protegidos
    `;
    
    bot.editMessageText(infoMessage, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔙 Volver al Menú', callback_data: 'main_menu' }]
        ]
      }
    });
  }
  
  bot.answerCallbackQuery(query.id);
});

// Manejo de errores
bot.on('polling_error', (error) => {
  console.error('Error de polling:', error);
});

console.log('🤖 Bot de KOH STORE iniciado correctamente');
console.log('📱 Esperando mensajes...');
