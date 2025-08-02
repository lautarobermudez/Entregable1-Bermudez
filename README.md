# 🏪 Simulador de Tienda Virtual

Este proyecto es un simulador interactivo de una tienda virtual desarrollado en JavaScript, pensado para la gestión de inventario, ventas y reportes, ideal para prácticas de lógica de programación, manipulación del DOM y manejo de peticiones asincrónicas.

## 🚀 Características principales
- Carga inicial de productos desde archivo JSON usando fetch() asincrónico
- Gestión dinámica de inventario (agregar, listar y controlar stock de productos)
- Carrito de compras y sistema de ventas con cálculo automático de totales
- Aplicación de IVA (21%) y descuentos mayoristas (15% por 5+ productos)
- Control de stock en tiempo real
- Generación de reportes de ventas y productos más vendidos
- Interfaz interactiva usando formularios, botones y mensajes dinámicos
- Validación de datos de entrada con manejo de errores
- Persistencia de datos con LocalStorage
- Exportación de datos en formato JSON
- Manejo asincrónico con async/await y control de errores

## 📂 Estructura del proyecto
index.html
data/
productos.json
script/
script.js
style/
style.css

## 📝 Instrucciones de uso
1. Clona o descarga este repositorio.
2. Abre el archivo `index.html` en tu navegador.
3. Al cargar por primera vez, se importarán automáticamente productos desde `data/productos.json`.
4. Utiliza la interfaz para agregar más productos, realizar ventas y generar reportes.
5. Los datos se guardan automáticamente en el navegador (LocalStorage).
6. Puedes exportar todos los datos en formato JSON cuando lo necesites.

## 🛠️ Tecnologías utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API para peticiones asincrónicas
- LocalStorage para persistencia de datos
- JSON para intercambio de datos

## 📊 Funcionalidades implementadas
- Carga asincrónica de datos con fetch() y manejo de errores
- Gestión de inventario con arrays y objetos
- Funciones de orden superior (find, filter, forEach)
- Sistema de ventas con cálculo de IVA y descuentos
- Manipulación dinámica del DOM
- Reportes y estadísticas de ventas
- Exportación de datos en formato JSON
- Validación y mensajes interactivos
- Persistencia con LocalStorage

## 🔄 Flujo de datos
1. **Carga inicial**: La aplicación intenta cargar productos desde `data/productos.json`
2. **Persistencia**: Los datos se guardan automáticamente en LocalStorage
3. **Recuperación**: En cargas posteriores, usa los datos guardados localmente
4. **Exportación**: Permite descargar todos los datos en formato JSON

## 🧪 Casos de prueba
- Carga inicial con productos desde JSON
- Agregar productos manualmente
- Realizar ventas con cálculos automáticos
- Generar reportes de estadísticas
- Persistencia al recargar la página
- Manejo de errores en carga de datos

## 📦 Autor
Lautaro Bermudez

---
*Proyecto desarrollado como práctica de JavaScript avanzado, incluyendo programación asincrónica, manipulación del DOM y persistencia de datos.*