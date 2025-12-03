# 🤖 Bot de Telegram - KOH STORE

Bot de Telegram para gestionar la tienda KOH STORE con catálogo de productos, carrito de compras y sistema de pedidos.

## 🚀 Características

- ✅ Catálogo de productos con imágenes
- 🛒 Carrito de compras
- 📦 Sistema de pedidos automatizado
- 🔔 Notificaciones al administrador
- 💳 Información de métodos de pago
- 📊 Panel de administración

## 📋 Requisitos Previos

- Node.js 14 o superior
- Una cuenta de Telegram
- Acceso a @BotFather en Telegram

## 🔧 Instalación

### 1. Crear el Bot en Telegram

1. Abre Telegram y busca **@BotFather**
2. Envía el comando `/newbot`
3. Sigue las instrucciones para elegir un nombre y username
4. **Guarda el TOKEN** que te proporciona

### 2. Obtener tu ID de Telegram

1. Busca **@userinfobot** en Telegram
2. Envía `/start`
3. **Copia tu ID** (número que aparece)

### 3. Configurar el Proyecto

```bash
# Clonar o descargar el proyecto
cd koh-store-telegram-bot

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

### 4. Configurar Variables de Entorno

Edita el archivo `.env` y agrega:

```env
TELEGRAM_BOT_TOKEN=tu_token_de_botfather
ADMIN_TELEGRAM_ID=tu_id_de_telegram
```

### 5. Iniciar el Bot

```bash
# Opción 1: Con npm
npm start

# Opción 2: Con el script
./start.sh

# Opción 3: Directamente
node bot.js
```

## 📱 Uso del Bot

### Para Clientes:

1. Busca tu bot en Telegram
2. Envía `/start`
3. Navega por el menú:
   - 🛍️ **Ver Catálogo**: Explora productos
   - 🛒 **Mi Carrito**: Revisa tu carrito
   - 📞 **Contacto**: Información de contacto
   - ℹ️ **Información**: Sobre la tienda

### Para Administradores:

- Envía `/admin` para ver estadísticas
- Recibirás notificaciones de cada pedido nuevo
- Podrás contactar directamente a los clientes

## 🛍️ Productos Configurados

- 🏋️ **Smart Fit Membresía**: 1 mes (S/50) o 3 meses (S/120)
- ⚡ **Zeus Dox**: Consulta de DNI (S/30)
- ✈️ **Vuelos**: Boletos de avión (Consultar)
- 🔥 **Instagram Followers**: 1K (S/40), 5K (S/150), 10K (S/350)

## 🔧 Personalización

### Modificar Productos

Edita el archivo `bot.js` en la sección `products`:

```javascript
const products = {
  tu_producto: {
    id: 'tu_producto',
    name: '🎁 TU PRODUCTO',
    description: 'Descripción del producto',
    image: './productos/imagen.jpg',
    variants: [
      { id: 'variante1', name: 'Opción 1', price: 100 }
    ]
  }
};
```

### Agregar Imágenes

Coloca las imágenes de productos en la carpeta `productos/`:

```bash
productos/
├── smartfit.jpg
├── zeusdox.jpg
├── vuelos.jpg
└── instagram.jpg
```

## 🚀 Despliegue en Producción

### Opción 1: VPS (Recomendado)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar bot con PM2
pm2 start bot.js --name koh-store-bot

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

### Opción 2: Heroku

```bash
# Crear Procfile
echo "worker: node bot.js" > Procfile

# Desplegar
git init
heroku create tu-bot-name
git add .
git commit -m "Initial commit"
git push heroku main

# Configurar variables
heroku config:set TELEGRAM_BOT_TOKEN=tu_token
heroku config:set ADMIN_TELEGRAM_ID=tu_id
```

### Opción 3: Railway / Render

1. Conecta tu repositorio
2. Configura las variables de entorno
3. Despliega automáticamente

## 📊 Comandos del Bot

- `/start` - Iniciar el bot y ver menú principal
- `/admin` - Panel de administración (solo admin)

## 🔒 Seguridad

- ✅ Variables de entorno para credenciales
- ✅ Validación de administrador
- ✅ `.gitignore` configurado
- ✅ No expone información sensible

## 🐛 Solución de Problemas

### El bot no responde

1. Verifica que el TOKEN sea correcto
2. Asegúrate de que el bot esté ejecutándose
3. Revisa los logs en la consola

### No recibo notificaciones de pedidos

1. Verifica que `ADMIN_TELEGRAM_ID` sea correcto
2. Obtén tu ID con @userinfobot
3. Reinicia el bot

### Error al enviar imágenes

1. Verifica que las imágenes existan en `productos/`
2. Asegúrate de que las rutas sean correctas
3. Usa formatos JPG o PNG

## 📞 Soporte

- WhatsApp: +51 974909117
- Telegram: @kohstoreoficial
- Email: kohstore@gmail.com

## 📄 Licencia

ISC License - Libre para uso personal y comercial

## 👨‍💻 Autor

Creado por **ShortNameLucifer** para KOH STORE

---

¡Gracias por usar nuestro bot! 🎉
