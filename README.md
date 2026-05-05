# Proyecto-ventas

## Dashboard de gestión para filtros de agua

Este proyecto es una aplicación web completa para gestionar productos, stock, pedidos y usuarios para un negocio de venta de filtros de agua y equipamiento relacionado.

### Tecnologías

- HTML5
- CSS3 (responsive, grid y flexbox)
- JavaScript vanilla
- Firebase (Authentication, Firestore, Analytics)

### Estructura del proyecto

- `index.html` — Interfaz principal del dashboard
- `css/styles.css` — Estilos responsivos y visual moderno
- `js/firebase-config.js` — Configuración de Firebase
- `js/storage.js` — Gestión de datos en Firestore
- `js/auth.js` — Autenticación con Firebase Auth
- `js/data.js` — Lógica de productos, pedidos, stock y usuarios
- `js/ui.js` — Renderizado de vistas, formularios y notificaciones
- `js/app.js` — Inicialización general de la aplicación
- `assets/water-drop.svg` — Iconografía ligera para el dashboard

### Cómo usar

1. Abre el proyecto en Visual Studio Code.
2. Sirve el proyecto desde un servidor local (debido a los módulos ES6 y Firebase). Por ejemplo, ejecuta `python -m http.server 8000` en la carpeta del proyecto y ve a `http://localhost:8000`.
3. Registra el usuario administrador con:
   - Email: `admin@filtros.com`
   - Contraseña: `admin123`
   - Rol: Administrador
4. Luego inicia sesión con esas credenciales.
5. También puedes registrar nuevos usuarios vendedores.

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

- `firebase-config.js` configura la conexión a Firebase.
- `storage.js` maneja operaciones CRUD en Firestore.
- `auth.js` controla login/logout, registro y estado de sesión con Firebase Auth.
- `data.js` realiza operaciones sobre productos, pedidos y usuarios.
- `ui.js` construye la interfaz, enlaza eventos y actualiza la vista.
- `app.js` arranca el sistema y muestra la pantalla de login si no hay sesión activa.

### Notas finales

El sistema está conectado a Firebase para autenticación y persistencia de datos. La arquitectura modular permite escalar la lógica y mejorar la seguridad. Asegúrate de configurar las reglas de Firestore y Auth en la consola de Firebase para permitir el acceso adecuado.
