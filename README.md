# 🏪 Simulador de Tienda Virtual

Este proyecto es un simulador interactivo de una tienda virtual desarrollado en JavaScript, pensado para la gestión de inventario, ventas y reportes. Ideal para prácticas de lógica de programación, manipulación del DOM, manejo de peticiones asincrónicas, persistencia de datos e integración de librerías externas.

## 🚀 Características principales
- **Carga automática inicial**: Importa productos desde archivo JSON usando fetch() asincrónico en la primera carga
- **Gestión inteligente de datos**: Combina datos del JSON con localStorage para máxima eficiencia
- **Interfaz profesional**: Confirmaciones elegantes con Sweet Alert y notificaciones modernas con Toastify
- **Sistema de ventas completo**: Carrito de compras con cálculo automático de totales, IVA y descuentos
- **Control de stock en tiempo real**: Actualización automática de inventario tras cada venta
- **Reportes y estadísticas**: Generación dinámica de reportes de ventas y productos más vendidos
- **Validación avanzada**: Control de duplicados con confirmaciones intuitivas
- **Persistencia robusta**: Almacenamiento en LocalStorage con respaldo automático
- **Exportación de datos**: Descarga de información en formato JSON
- **Experiencia de usuario mejorada**: Manejo de errores profesional y feedback visual

## 📂 Estructura del proyecto
```
📁 Simulador-Tienda-Virtual/
├── 📄 index.html
├── 📁 data/
│   └── 📄 productos.json
├── 📁 script/
│   └── 📄 script.js
└── 📁 style/
    └── 📄 style.css
```

## 📝 Instrucciones de uso
1. **Clona o descarga** este repositorio
2. **Abre** el archivo `index.html` en tu navegador web moderno
3. **Primera carga**: La aplicación detectará automáticamente que es la primera vez y cargará los 8 productos iniciales desde `data/productos.json`
4. **Gestión de inventario**: Agrega nuevos productos usando el formulario (el sistema detecta y previene duplicados con confirmaciones elegantes)
5. **Realizar ventas**: Selecciona productos del catálogo, agrégalos al carrito y finaliza las ventas
6. **Ver reportes**: Genera estadísticas detalladas de ventas y rendimiento
7. **Persistencia**: Todos los datos se guardan automáticamente en el navegador
8. **Exportar**: Descarga todos los datos en formato JSON cuando lo necesites

## 🛠️ Tecnologías utilizadas
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño responsivo con Grid y Flexbox
- **JavaScript ES6+**: Programación moderna con programación asincrónica
- **Fetch API**: Peticiones asincrónicas para carga de datos
- **LocalStorage**: Persistencia de datos en el navegador
- **JSON**: Formato de intercambio de datos estándar

## 📚 Librerías externas integradas
- **Sweet Alert 2**: Confirmaciones y alertas elegantes que reemplazan los diálogos básicos del navegador
- **Toastify**: Sistema de notificaciones modernas con animaciones y estilos profesionales

### 🎯 Justificación de librerías seleccionadas
- **Sweet Alert**: Elegida para mejorar las confirmaciones críticas del sistema (duplicados de productos, eliminaciones, etc.), proporcionando una experiencia más profesional y clara que los `confirm()` básicos del navegador
- **Toastify**: Implementada para transformar el sistema de mensajes básico en notificaciones modernas con gradientes, animaciones y mejor posicionamiento

## 📊 Funcionalidades implementadas

### 🔄 Gestión de Datos
- **Carga asincrónica inicial**: fetch() con manejo de errores para productos desde JSON
- **Detección inteligente**: Diferencia entre primera carga y cargas posteriores
- **Prevención de duplicados**: Validación automática con confirmaciones elegantes usando Sweet Alert
- **Persistencia dual**: Combina datos JSON + localStorage para máxima eficiencia

### 📦 Gestión de Inventario
- **Agregado dinámico**: Formulario con validación completa de datos
- **Confirmaciones profesionales**: Sweet Alert para casos de productos duplicados
- **IDs únicos**: Sistema robusto de generación de identificadores
- **Control de stock**: Actualización automática tras ventas
- **Categorización**: Organización de productos por categorías

### 🛒 Sistema de Ventas
- **Carrito inteligente**: Agregado, modificación y eliminación de productos
- **Cálculos automáticos**: Subtotales, IVA (21%), descuentos mayoristas (15% por 5+ productos)
- **Validación de stock**: Control de disponibilidad en tiempo real
- **Historial completo**: Registro detallado de todas las transacciones

### 📈 Reportes y Estadísticas
- **Métricas financieras**: Total recaudado, promedio por venta
- **Análisis de productos**: Más vendidos, stock actual, rotación
- **Estadísticas de ventas**: Cantidad de transacciones, productos vendidos
- **Estado de inventario**: Visualización completa del stock actual

### 🎛️ Controles Avanzados
- **Limpieza selectiva**: Inventario, historial de ventas o datos completos
- **Exportación JSON**: Descarga de toda la información del sistema
- **Notificaciones modernas**: Sistema Toastify para feedback visual
- **Manejo de errores**: Validaciones y alertas profesionales

### 🎨 Mejoras de Experiencia de Usuario
- **Confirmaciones elegantes**: Sweet Alert reemplaza diálogos básicos del navegador
- **Notificaciones animadas**: Toastify para feedback visual inmediato
- **Validación intuitiva**: Prevención de errores con mensajes claros
- **Interfaz profesional**: Experiencia similar a aplicaciones comerciales

## 🔄 Flujo de datos y lógica de carga

### Primera carga (Usuario nuevo)
1. **Detección**: Sistema identifica que no hay datos en localStorage
2. **Fetch automático**: Carga productos desde `data/productos.json`
3. **Validación**: Verifica integridad de datos JSON
4. **Integración**: Procesa productos y asigna IDs únicos
5. **Persistencia**: Guarda en localStorage para futuras sesiones
6. **Notificación**: Toastify informa la carga exitosa
7. **Marcado**: Registra que la primera carga fue completada

### Cargas posteriores (Usuario recurrente)
1. **Detección**: Sistema encuentra datos existentes en localStorage
2. **Carga rápida**: Utiliza datos guardados localmente
3. **Validación**: Verifica consistencia de IDs y estructura
4. **Restauración**: Reconstituye el estado completo de la aplicación
5. **Notificación**: Mensaje de bienvenida con Toastify

### Gestión de duplicados mejorada
1. **Detección**: Al agregar producto, verifica si ya existe
2. **Confirmación elegante**: Sweet Alert muestra información detallada
3. **Opciones claras**: Permite actualizar stock o cancelar operación
4. **Feedback visual**: Toastify confirma la acción realizada

## 🧪 Casos de prueba verificados
✅ **Carga inicial**: Productos desde JSON en primera ejecución  
✅ **Persistencia**: Mantenimiento de datos al recargar página  
✅ **Gestión de inventario**: Agregado manual con prevención de duplicados  
✅ **Confirmaciones Sweet Alert**: Funcionamiento en productos duplicados  
✅ **Notificaciones Toastify**: Sistema de mensajes moderno operativo  
✅ **Sistema de ventas**: Transacciones con cálculos automáticos correctos  
✅ **Reportes**: Generación de estadísticas precisas  
✅ **Exportación**: Descarga de datos en formato JSON válido  
✅ **Manejo de errores**: Respuesta adecuada a archivos faltantes o datos corruptos  
✅ **Responsividad**: Funcionamiento en diferentes tamaños de pantalla  
✅ **Experiencia de usuario**: Interfaz profesional y intuitiva  

## 🎯 Casos de uso principales

### Para estudiantes de JavaScript
- **Práctica de fetch()**: Implementación real de peticiones asincrónicas
- **Integración de librerías**: Uso práctico de CDN y librerías externas
- **Manejo del DOM**: Manipulación dinámica de elementos HTML
- **Persistencia de datos**: Uso combinado de localStorage y JSON
- **Validaciones avanzadas**: Control de entrada y duplicados
- **Promesas y callbacks**: Manejo de .then() con Sweet Alert

### Para demostraciones profesionales
- **Sistema funcional completo**: Tienda virtual operativa desde el primer uso
- **Interfaz moderna**: Confirmaciones y notificaciones profesionales
- **Datos de prueba incluidos**: 8 productos listos para demostrar funcionalidades
- **Flujo completo**: Desde gestión de inventario hasta reportes de ventas
- **UX profesional**: Experiencia similar a aplicaciones comerciales

## 🔧 Instalación y configuración
1. **Descarga**: Clona o descarga el repositorio completo
2. **Estructura**: Mantén la estructura de carpetas intacta
3. **Servidor**: Usa Live Server o servidor local para evitar errores CORS
4. **Navegador**: Compatible con navegadores modernos que soporten ES6+
5. **Internet**: Requiere conexión para cargar CDN de librerías (Sweet Alert y Toastify)

## 📦 Datos iniciales incluidos
El archivo `data/productos.json` contiene 8 productos de ejemplo:
- **Electrónicos**: Notebook Dell, Monitor Samsung, Webcam HD
- **Accesorios**: Mouse Logitech, Teclado Mecánico, Cargador USB-C
- **Audio**: Auriculares Bluetooth
- **Cables**: Cable HDMI

Estos productos se cargan automáticamente en la primera ejecución y sirven como base para comenzar a usar el simulador inmediatamente.

## 🌐 CDN utilizados
- **Sweet Alert 2**: `https://cdn.jsdelivr.net/npm/sweetalert2@11`
- **Toastify CSS**: `https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css`
- **Toastify JS**: `https://cdn.jsdelivr.net/npm/toastify-js`

## 👨‍💻 Autor
**Lautaro Bermúdez**

---
*Proyecto desarrollado como práctica de JavaScript avanzado, incluyendo programación asincrónica, manipulación del DOM, persistencia de datos, integración de librerías externas y arquitectura de aplicaciones web modernas.*