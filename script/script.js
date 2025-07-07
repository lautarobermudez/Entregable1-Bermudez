// ========================================
// SIMULADOR DE TIENDA VIRTUAL
// Primera Entrega - CoderHouse JavaScript
// ========================================

// CONSTANTES DEL SISTEMA
const IVA = 0.21; // 21% de IVA
const DESCUENTO_MAYORISTA = 0.15; // 15% descuento por compras grandes
const CANTIDAD_DESCUENTO = 5; // Cantidad mínima para descuento mayorista

// VARIABLES GLOBALES Y ARRAYS
let inventario = []; // Array para almacenar productos de la tienda
let ventasDelDia = []; // Array para guardar el historial de ventas
let totalRecaudado = 0; // Variable para el total de dinero recaudado
let contadorVentas = 0; // Contador de ventas realizadas

// ========================================
// FUNCIÓN 1: CARGAR INVENTARIO (ENTRADA DE DATOS)
// ========================================
function cargarInventario() {
    console.log("📦 === CARGA DE INVENTARIO ===");
    
    // Ciclo para cargar productos hasta que el usuario decida parar
    let continuarCargando = true;
    
    while (continuarCargando) {
        // ENTRADA: Solicitar datos del producto
        let nombre = prompt("🏷️ Ingrese el nombre del producto:");
        
        // Validar que el nombre no esté vacío
        if (nombre === null || nombre.trim() === "") {
            alert("❌ El nombre del producto no puede estar vacío");
            continue;
        }
        
        let precio = parseFloat(prompt("💰 Ingrese el precio del producto:"));
        
        // Validar que el precio sea un número válido y positivo
        if (isNaN(precio) || precio <= 0) {
            alert("❌ El precio debe ser un número positivo");
            continue;
        }
        
        let stock = parseInt(prompt("📊 Ingrese la cantidad en stock:"));
        
        // Validar que el stock sea un número válido y positivo
        if (isNaN(stock) || stock < 0) {
            alert("❌ El stock debe ser un número positivo o cero");
            continue;
        }
        
        let categoria = prompt("🏷️ Ingrese la categoría del producto:");
        if (categoria === null || categoria.trim() === "") {
            categoria = "General"; // Categoría por defecto
        }
        
        // PROCESAMIENTO: Crear objeto producto y agregarlo al inventario
        let producto = {
            id: inventario.length + 1,
            nombre: nombre.trim(),
            precio: precio,
            stock: stock,
            categoria: categoria.trim(),
            vendidos: 0 // Contador de productos vendidos
        };
        
        inventario.push(producto);
        
        // SALIDA: Confirmar producto agregado
        console.log(`✅ Producto agregado: ${producto.nombre} - $${producto.precio} - Stock: ${producto.stock}`);
        
        // Preguntar si desea continuar cargando productos
        continuarCargando = confirm("¿Desea agregar otro producto al inventario?");
    }
    
    // Mostrar resumen del inventario cargado
    console.log(`\n📋 Inventario cargado: ${inventario.length} productos`);
    alert(`✅ Inventario cargado exitosamente!\nTotal de productos: ${inventario.length}`);
}

// ========================================
// FUNCIÓN 2: PROCESAR VENTA (PROCESAMIENTO DE DATOS)
// ========================================
function procesarVenta() {
    console.log("\n🛒 === NUEVA VENTA ===");
    
    // Validar que haya productos en inventario
    if (inventario.length === 0) {
        alert("❌ No hay productos en el inventario. Primero debe cargar productos.");
        return;
    }
    
    // Mostrar catálogo de productos disponibles
    console.log("🏪 CATÁLOGO DE PRODUCTOS:");
    console.log("========================");
    
    let catalogoTexto = "🏪 CATÁLOGO DE PRODUCTOS:\n\n";
    
    // Ciclo FOR para mostrar todos los productos
    for (let i = 0; i < inventario.length; i++) {
        let producto = inventario[i];
        if (producto.stock > 0) {
            let linea = `${producto.id}. ${producto.nombre} - $${producto.precio} (Stock: ${producto.stock})`;
            console.log(linea);
            catalogoTexto += linea + "\n";
        }
    }
    
    alert(catalogoTexto);
    
    let carrito = []; // Array para los productos de esta venta
    let continuarComprando = true;
    
    // Ciclo para agregar productos al carrito
    while (continuarComprando) {
        // ENTRADA: Solicitar producto y cantidad
        let idProducto = parseInt(prompt("🔢 Ingrese el ID del producto que desea comprar:"));
        
        // Validar ID del producto
        if (isNaN(idProducto) || idProducto < 1 || idProducto > inventario.length) {
            alert("❌ ID de producto inválido");
            continue;
        }
        
        let producto = inventario[idProducto - 1];
        
        // Verificar que el producto tenga stock
        if (producto.stock === 0) {
            alert(`❌ El producto "${producto.nombre}" no tiene stock disponible`);
            continue;
        }
        
        let cantidad = parseInt(prompt(`📦 ¿Cuántas unidades de "${producto.nombre}" desea comprar?\nStock disponible: ${producto.stock}`));
        
        // Validar cantidad
        if (isNaN(cantidad) || cantidad <= 0) {
            alert("❌ La cantidad debe ser un número positivo");
            continue;
        }
        
        if (cantidad > producto.stock) {
            alert(`❌ No hay suficiente stock. Stock disponible: ${producto.stock}`);
            continue;
        }
        
        // PROCESAMIENTO: Agregar al carrito y actualizar stock
        let itemCarrito = {
            producto: producto,
            cantidad: cantidad,
            subtotal: producto.precio * cantidad
        };
        
        carrito.push(itemCarrito);
        producto.stock -= cantidad;
        producto.vendidos += cantidad;
        
        console.log(`✅ Agregado al carrito: ${cantidad}x ${producto.nombre} = $${itemCarrito.subtotal}`);
        
        continuarComprando = confirm("¿Desea agregar otro producto al carrito?");
    }
    
    // Validar que haya productos en el carrito
    if (carrito.length === 0) {
        alert("❌ No se agregaron productos al carrito");
        return;
    }
    
    // PROCESAMIENTO: Calcular totales
    let subtotal = 0;
    
    // Ciclo para sumar subtotales
    for (let i = 0; i < carrito.length; i++) {
        subtotal += carrito[i].subtotal;
    }
    
    // Calcular cantidad total de productos
    let cantidadTotal = 0;
    for (let i = 0; i < carrito.length; i++) {
        cantidadTotal += carrito[i].cantidad;
    }
    
    // Aplicar descuento mayorista si corresponde
    let descuento = 0;
    if (cantidadTotal >= CANTIDAD_DESCUENTO) {
        descuento = subtotal * DESCUENTO_MAYORISTA;
    }
    
    let subtotalConDescuento = subtotal - descuento;
    let impuestos = subtotalConDescuento * IVA;
    let total = subtotalConDescuento + impuestos;
    
    // Crear objeto venta
    let venta = {
        id: ++contadorVentas,
        fecha: new Date().toLocaleDateString(),
        carrito: carrito,
        subtotal: subtotal,
        descuento: descuento,
        impuestos: impuestos,
        total: total,
        cantidadProductos: cantidadTotal
    };
    
    ventasDelDia.push(venta);
    totalRecaudado += total;
    
    // SALIDA: Mostrar ticket de venta
    mostrarTicketVenta(venta);
}

// Función auxiliar para mostrar el ticket de venta
function mostrarTicketVenta(venta) {
    console.log("\n🧾 === TICKET DE VENTA ===");
    console.log(`Venta #${venta.id} - ${venta.fecha}`);
    console.log("========================");
    
    let ticketTexto = `🧾 TICKET DE VENTA #${venta.id}\n`;
    ticketTexto += `📅 Fecha: ${venta.fecha}\n\n`;
    ticketTexto += "PRODUCTOS:\n";
    
    // Mostrar productos del carrito
    for (let i = 0; i < venta.carrito.length; i++) {
        let item = venta.carrito[i];
        let linea = `${item.cantidad}x ${item.producto.nombre} - $${item.subtotal}`;
        console.log(linea);
        ticketTexto += linea + "\n";
    }
    
    console.log("------------------------");
    console.log(`Subtotal: $${venta.subtotal.toFixed(2)}`);
    
    ticketTexto += "\n------------------------\n";
    ticketTexto += `Subtotal: $${venta.subtotal.toFixed(2)}\n`;
    
    if (venta.descuento > 0) {
        console.log(`Descuento mayorista (${(DESCUENTO_MAYORISTA * 100)}%): -$${venta.descuento.toFixed(2)}`);
        ticketTexto += `Descuento mayorista (${(DESCUENTO_MAYORISTA * 100)}%): -$${venta.descuento.toFixed(2)}\n`;
    }
    
    console.log(`IVA (${(IVA * 100)}%): $${venta.impuestos.toFixed(2)}`);
    console.log(`TOTAL: $${venta.total.toFixed(2)}`);
    
    ticketTexto += `IVA (${(IVA * 100)}%): $${venta.impuestos.toFixed(2)}\n`;
    ticketTexto += `TOTAL: $${venta.total.toFixed(2)}`;
    
    alert(ticketTexto);
}

// ========================================
// FUNCIÓN 3: MOSTRAR REPORTES (SALIDA DE DATOS)
// ========================================
function mostrarReportes() {
    console.log("\n📊 === REPORTES DE LA TIENDA ===");
    
    if (ventasDelDia.length === 0) {
        alert("📊 No hay ventas registradas para mostrar reportes");
        return;
    }
    
    // PROCESAMIENTO: Calcular estadísticas
    let totalProductosVendidos = 0;
    let productoMasVendido = null;
    let maxVendidos = 0;
    
    // Ciclo para encontrar el producto más vendido
    for (let i = 0; i < inventario.length; i++) {
        let producto = inventario[i];
        totalProductosVendidos += producto.vendidos;
        
        if (producto.vendidos > maxVendidos) {
            maxVendidos = producto.vendidos;
            productoMasVendido = producto;
        }
    }
    
    let promedioVenta = totalRecaudado / ventasDelDia.length;
    
    // SALIDA: Mostrar reporte completo
    let reporte = "📊 REPORTE DE VENTAS\n";
    reporte += "===================\n\n";
    reporte += `💰 Total recaudado: $${totalRecaudado.toFixed(2)}\n`;
    reporte += `🛒 Ventas realizadas: ${ventasDelDia.length}\n`;
    reporte += `📦 Productos vendidos: ${totalProductosVendidos}\n`;
    reporte += `📈 Promedio por venta: $${promedioVenta.toFixed(2)}\n\n`;
    
    if (productoMasVendido) {
        reporte += `🏆 Producto más vendido: ${productoMasVendido.nombre} (${productoMasVendido.vendidos} unidades)\n\n`;
    }
    
    reporte += "📋 INVENTARIO ACTUAL:\n";
    reporte += "====================\n";
    
    // Mostrar estado del inventario
    for (let i = 0; i < inventario.length; i++) {
        let producto = inventario[i];
        reporte += `${producto.nombre}: Stock ${producto.stock}, Vendidos ${producto.vendidos}\n`;
    }
    
    console.log(reporte);
    alert(reporte);
}

// ========================================
// FUNCIÓN PRINCIPAL DEL SIMULADOR
// ========================================
function iniciarSimulador() {
    // Mensaje de bienvenida
    console.log("🏪 ¡Bienvenido al Simulador de Tienda Virtual!");
    alert("🏪 ¡Bienvenido al Simulador de Tienda Virtual!\n\n" +
          "Este simulador te permitirá:\n" +
          "• Cargar productos al inventario\n" +
          "• Realizar ventas con cálculos automáticos\n" +
          "• Ver reportes de ventas y estadísticas\n\n" +
          "¡Comencemos!");
    
    let continuarSimulador = true;
    
    // Menú principal con ciclo
    while (continuarSimulador) {
        let opcion = prompt("🏪 MENÚ PRINCIPAL\n\n" +
                           "1. 📦 Cargar productos al inventario\n" +
                           "2. 🛒 Realizar una venta\n" +
                           "3. 📊 Ver reportes de ventas\n" +
                           "4. 📋 Ver inventario actual\n" +
                           "5. 🚪 Salir del simulador\n\n" +
                           "Seleccione una opción (1-5):");
        
        // Estructuras condicionales para el menú
        if (opcion === "1") {
            cargarInventario();
        } else if (opcion === "2") {
            procesarVenta();
        } else if (opcion === "3") {
            mostrarReportes();
        } else if (opcion === "4") {
            mostrarInventarioActual();
        } else if (opcion === "5") {
            let confirmarSalida = confirm("¿Está seguro que desea salir del simulador?");
            if (confirmarSalida) {
                continuarSimulador = false;
                console.log("👋 ¡Gracias por usar el Simulador de Tienda Virtual!");
                alert("👋 ¡Gracias por usar el Simulador de Tienda Virtual!\n\nHasta pronto!");
            }
        } else {
            alert("❌ Opción no válida. Por favor seleccione una opción del 1 al 5.");
        }
    }
}

// Función auxiliar para mostrar inventario actual
function mostrarInventarioActual() {
    console.log("\n📋 === INVENTARIO ACTUAL ===");
    
    if (inventario.length === 0) {
        alert("📋 El inventario está vacío. Primero debe cargar productos.");
        return;
    }
    
    let inventarioTexto = "📋 INVENTARIO ACTUAL:\n\n";
    
    for (let i = 0; i < inventario.length; i++) {
        let producto = inventario[i];
        let linea = `${producto.id}. ${producto.nombre}\n` +
                   `   💰 Precio: $${producto.precio}\n` +
                   `   📦 Stock: ${producto.stock}\n` +
                   `   🏷️ Categoría: ${producto.categoria}\n` +
                   `   📊 Vendidos: ${producto.vendidos}\n\n`;
        
        console.log(`${producto.id}. ${producto.nombre} - Precio: $${producto.precio} - Stock: ${producto.stock} - Vendidos: ${producto.vendidos}`);
        inventarioTexto += linea;
    }
    
    alert(inventarioTexto);
}

// ========================================
// INICIO AUTOMÁTICO DEL SIMULADOR
// ========================================
// El simulador se inicia automáticamente cuando se carga la página
iniciarSimulador();