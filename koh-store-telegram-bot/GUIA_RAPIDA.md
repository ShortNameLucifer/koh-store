# 🚀 Guía Rápida - Bot de Telegram KOH STORE

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Crear tu Bot 🤖

1. Abre Telegram y busca: **@BotFather**
2. Envía: `/newbot`
3. Nombre: `KOH STORE Bot`
4. Username: `kohstore_bot` (o el que prefieras, debe terminar en `_bot`)
5. **Copia el TOKEN** que te da (ejemplo: `123456789:ABC...`)

### Paso 2: Obtener tu ID 🆔

1. Busca en Telegram: **@userinfobot**
2. Envía: `/start`
3. **Copia tu ID** (ejemplo: `123456789`)

### Paso 3: Configurar 🔧

```bash
# Crear archivo .env
cp .env.example .env

# Editar con tus datos
nano .env
```

Pega tus credenciales:
```env
TELEGRAM_BOT_TOKEN=123456789:ABC-tu-token-aqui
ADMIN_TELEGRAM_ID=123456789
```

### Paso 4: Instalar e Iniciar 🚀

```bash
# Instalar dependencias
npm install

# Iniciar el bot
npm start
```

### Paso 5: Probar 🎉

1. Busca tu bot en Telegram
2. Envía `/start`
3. ¡Listo! Tu tienda está funcionando

---

## 📱 Comandos Disponibles

- `/start` - Menú principal
- `/admin` - Panel de administración (solo tú)

---

## 🎯 Próximos Pasos

1. **Personalizar productos** - Edita `bot.js`
2. **Agregar imágenes** - Coloca fotos en `productos/`
3. **Desplegar en servidor** - Lee `DEPLOY.md`

---

¡Eso es todo! Tu bot está listo para vender 🎉
