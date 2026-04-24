# Proyecto-ventas

## Dashboard de gestión para filtros de agua

Este proyecto es una aplicación web completa para gestionar productos, stock, pedidos y usuarios para un negocio de venta de filtros de agua y equipamiento relacionado.

### Tecnologías

- HTML5
- CSS3 (responsive, grid y flexbox)
- JavaScript vanilla
- localStorage para persistencia de datos

### Estructura del proyecto

- `index.html` — Interfaz principal del dashboard
- `css/styles.css` — Estilos responsivos y visual moderno
- `js/storage.js` — Gestión de datos y persistencia en localStorage
- `js/auth.js` — Simulación de login, registro y sesión
- `js/data.js` — Lógica de productos, pedidos, stock y usuarios
- `js/ui.js` — Renderizado de vistas, formularios y notificaciones
- `js/app.js` — Inicialización general de la aplicación
- `assets/water-drop.svg` — Iconografía ligera para el dashboard

### Cómo usar

1. Abre el proyecto en Visual Studio Code.
2. Abre `index.html` directamente o usa una extensión como Live Server.
3. Inicia sesión con el usuario de ejemplo:
   - Email: `admin@filtros.com`
   - Contraseña: `admin123`
4. También puedes registrar un nuevo usuario vendedor.

### Funcionalidades principales

- Dashboard con métricas clave
- Gestión de productos: crear, editar, eliminar
- Filtro y búsqueda de productos por categoría
- Control de stock con alertas de bajo inventario
- Creación de pedidos con cálculo de total automático
- Actualización automática de stock al generar pedidos
- Historial y cambio de estado de pedidos
- Gestión de usuarios con roles de administrador y vendedor
- Notificaciones visuales y validación básica de formularios

### Módulos y responsabilidad

- `storage.js` inicializa datos de ejemplo y maneja lectura/escritura en localStorage.
- `auth.js` controla el login/logout, registro y estado de sesión.
- `data.js` realiza operaciones CRUD sobre productos, pedidos y usuarios.
- `ui.js` construye la interfaz, enlaza eventos y actualiza la vista.
- `app.js` arranca el sistema y muestra la pantalla de login si no hay sesión activa.

### Notas finales

El sistema está diseñado para ser ampliado como una aplicación SaaS. La arquitectura modular permite escalar la lógica y mejorar la seguridad cuando se agregue un backend real.
