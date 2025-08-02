// ========================================
// SIMULADOR DE TIENDA VIRTUAL - SEGUNDA ENTREGA
// Variables globales y estructura básica
// ========================================

// CONSTANTES
const IVA = 0.21;
const DESCUENTO_MAYORISTA = 0.15;
const CANTIDAD_DESCUENTO = 5;

// ARRAYS PRINCIPALES
let inventario = [];
let carrito = [];
let ventasDelDia = [];
let totalRecaudado = 0;
let contadorVentas = 0;

// ========================================
// FUNCIONES DE LOCALSTORAGE
// ========================================

// Guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem('inventario', JSON.stringify(inventario));
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('ventasDelDia', JSON.stringify(ventasDelDia));
    localStorage.setItem('totalRecaudado', totalRecaudado);
    localStorage.setItem('contadorVentas', contadorVentas);
}

// Cargar datos desde localStorage
function cargarDatos() {
    const inventarioGuardado = localStorage.getItem('inventario');
    const carritoGuardado = localStorage.getItem('carrito');
    const ventasGuardadas = localStorage.getItem('ventasDelDia');
    
    if (inventarioGuardado) {
        inventario = JSON.parse(inventarioGuardado);
    }
    
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    
    if (ventasGuardadas) {
        ventasDelDia = JSON.parse(ventasGuardadas);
    }
    
    totalRecaudado = parseFloat(localStorage.getItem('totalRecaudado')) || 0;
    contadorVentas = parseInt(localStorage.getItem('contadorVentas')) || 0;
}

// ========================================
// FUNCIONES DE CARGA ASINCRÓNICA (FETCH)
// ========================================

// Función para cargar productos iniciales desde JSON
async function cargarProductosIniciales() {
    try {
        mostrarMensaje('🔄 Cargando productos iniciales...', 'info');
        
        const response = await fetch('./data/productos.json');
        
        // Verificar que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const productosJSON = await response.json();
        
        // Solo cargar si el inventario está vacío (para no duplicar)
        if (inventario.length === 0) {
            productosJSON.forEach(productoData => {
                const producto = {
                    id: inventario.length + 1,
                    nombre: productoData.nombre,
                    precio: productoData.precio,
                    stock: productoData.stock,
                    categoria: productoData.categoria,
                    vendidos: 0
                };
                inventario.push(producto);
            });
            
            // Guardar en localStorage
            guardarDatos();
            
            // Actualizar pantalla
            mostrarInventario();
            mostrarCatalogo();
            
            mostrarMensaje(`✅ ${productosJSON.length} productos cargados desde archivo JSON`, 'exito');
        } else {
            mostrarMensaje('📦 Productos ya cargados desde localStorage', 'info');
        }
        
    } catch (error) {
        console.error('Error cargando productos iniciales:', error);
        mostrarMensaje('⚠️ No se pudieron cargar productos iniciales. Puedes agregar productos manualmente.', 'info');
    }
}

// Función auxiliar para verificar si hay conectividad (opcional)
async function verificarConectividad() {
    try {
        const response = await fetch('./data/productos.json', { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// ========================================
// FUNCIONES DE INVENTARIO
// ========================================

// Función para agregar producto
function agregarProducto(evento) {
    evento.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre-producto').value.trim();
    const precio = parseFloat(document.getElementById('precio-producto').value);
    const stock = parseInt(document.getElementById('stock-producto').value);
    const categoria = document.getElementById('categoria-producto').value.trim() || 'General';
    
    // Validaciones básicas
    if (nombre === '') {
        mostrarMensaje('❌ El nombre del producto no puede estar vacío', 'error');
        return;
    }
    
    if (isNaN(precio) || precio <= 0) {
        mostrarMensaje('❌ El precio debe ser un número mayor a 0', 'error');
        return;
    }
    
    if (isNaN(stock) || stock < 0) {
        mostrarMensaje('❌ El stock debe ser un número mayor o igual a 0', 'error');
        return;
    }
    
    // Crear objeto producto
    const producto = {
        id: inventario.length + 1,
        nombre: nombre,
        precio: precio,
        stock: stock,
        categoria: categoria,
        vendidos: 0
    };
    
    // Agregar al inventario
    inventario.push(producto);
    
    // Guardar en localStorage
    guardarDatos();
    
    // Limpiar formulario
    document.getElementById('form-producto').reset();
    
    // Actualizar pantalla
    mostrarInventario();
    mostrarCatalogo();
    
    // Mensaje de éxito
    mostrarMensaje(`✅ Producto "${producto.nombre}" agregado correctamente`, 'exito');
}

// Función para mostrar inventario en HTML
function mostrarInventario() {
    const listaInventario = document.getElementById('lista-inventario');
    
    if (inventario.length === 0) {
        listaInventario.innerHTML = '<p><em>No hay productos en el inventario</em></p>';
        return;
    }
    
    let html = '';
    
    inventario.forEach(producto => {
        html += `
            <div class="producto-item">
                <h4>${producto.nombre}</h4>
                <p><strong>ID:</strong> ${producto.id}</p>
                <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
                <p><strong>Stock:</strong> ${producto.stock}</p>
                <p><strong>Categoría:</strong> ${producto.categoria}</p>
                <p><strong>Vendidos:</strong> ${producto.vendidos}</p>
            </div>
        `;
    });
    
    listaInventario.innerHTML = html;
}

// Función para mostrar catálogo (productos disponibles para venta)
function mostrarCatalogo() {
    const listaCatalogo = document.getElementById('lista-catalogo');
    
    const productosDisponibles = inventario.filter(producto => producto.stock > 0);
    
    if (productosDisponibles.length === 0) {
        listaCatalogo.innerHTML = '<p><em>No hay productos disponibles para venta</em></p>';
        return;
    }
    
    let html = '';
    
    productosDisponibles.forEach(producto => {
        html += `
            <div class="producto-catalogo">
                <h4>${producto.nombre}</h4>
                <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
                <p><strong>Stock:</strong> ${producto.stock}</p>
                <div class="cantidad-container">
                    <label for="cantidad-${producto.id}">Cantidad:</label>
                    <input type="number" id="cantidad-${producto.id}" min="1" max="${producto.stock}" value="1">
                </div>
                <button onclick="agregarAlCarrito(${producto.id})">🛒 Agregar al Carrito</button>
            </div>
        `;
    });
    
    listaCatalogo.innerHTML = html;
}

// ========================================
// FUNCIONES DE CARRITO Y VENTAS
// ========================================

// Función para agregar producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = inventario.find(p => p.id === idProducto);
    const cantidadInput = document.getElementById(`cantidad-${idProducto}`);
    const cantidad = parseInt(cantidadInput.value);
    
    if (!producto || cantidad <= 0 || cantidad > producto.stock) {
        mostrarMensaje('❌ Cantidad inválida', 'error');
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.producto.id === idProducto);
    
    if (itemExistente) {
        // Si ya existe, aumentar cantidad
        if (itemExistente.cantidad + cantidad <= producto.stock) {
            itemExistente.cantidad += cantidad;
            itemExistente.subtotal = itemExistente.cantidad * producto.precio;
        } else {
            mostrarMensaje('❌ No hay suficiente stock', 'error');
            return;
        }
    } else {
        // Si no existe, agregar nuevo item
        const itemCarrito = {
            producto: producto,
            cantidad: cantidad,
            subtotal: producto.precio * cantidad
        };
        carrito.push(itemCarrito);
    }
    
    // Guardar en localStorage
    guardarDatos();
    
    // Actualizar pantalla
    mostrarCarrito();
    cantidadInput.value = 1; // Reset cantidad
    
    mostrarMensaje(`✅ ${cantidad}x ${producto.nombre} agregado al carrito`, 'exito');
}

// Función para mostrar carrito
function mostrarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const resumenVenta = document.getElementById('resumen-venta');
    
    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p><em>El carrito está vacío</em></p>';
        resumenVenta.style.display = 'none';
        return;
    }
    
    let html = '';
    
    carrito.forEach((item, index) => {
        html += `
            <div class="item-carrito">
                <h4>${item.producto.nombre}</h4>
                <p>Cantidad: ${item.cantidad}</p>
                <p>Precio unitario: $${item.producto.precio.toFixed(2)}</p>
                <p>Subtotal: $${item.subtotal.toFixed(2)}</p>
                <button onclick="eliminarDelCarrito(${index})">🗑️ Eliminar</button>
            </div>
        `;
    });
    
    listaCarrito.innerHTML = html;
    
    // Mostrar resumen
    mostrarResumenVenta();
    resumenVenta.style.display = 'block';
}

// Función para mostrar resumen de venta
function mostrarResumenVenta() {
    const detalleResumen = document.getElementById('detalle-resumen');
    
    // Calcular totales 
    let subtotal = 0;
    let cantidadTotal = 0;
    
    carrito.forEach(item => {
        subtotal += item.subtotal;
        cantidadTotal += item.cantidad;
    });
    
    // Aplicar descuento mayorista si corresponde
    let descuento = 0;
    if (cantidadTotal >= CANTIDAD_DESCUENTO) {
        descuento = subtotal * DESCUENTO_MAYORISTA;
    }
    
    let subtotalConDescuento = subtotal - descuento;
    let impuestos = subtotalConDescuento * IVA;
    let total = subtotalConDescuento + impuestos;
    
    let html = `
        <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    `;
    
    if (descuento > 0) {
        html += `<p><strong>Descuento mayorista (${(DESCUENTO_MAYORISTA * 100)}%):</strong> -$${descuento.toFixed(2)}</p>`;
    }
    
    html += `
        <p><strong>IVA (${(IVA * 100)}%):</strong> $${impuestos.toFixed(2)}</p>
        <p class="total"><strong>TOTAL:</strong> $${total.toFixed(2)}</p>
    `;
    
    detalleResumen.innerHTML = html;
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarDatos();
    mostrarCarrito();
    mostrarMensaje('🗑️ Producto eliminado del carrito', 'info');
}

// Función para limpiar carrito
function limpiarCarrito() {
    carrito = [];
    guardarDatos();
    mostrarCarrito();
    mostrarMensaje('🗑️ Carrito limpiado', 'info');
}

// Función para finalizar venta 
function finalizarVenta() {
    if (carrito.length === 0) {
        mostrarMensaje('❌ El carrito está vacío', 'error');
        return;
    }
    
    // Calcular totales
    let subtotal = 0;
    let cantidadTotal = 0;
    
    carrito.forEach(item => {
        subtotal += item.subtotal;
        cantidadTotal += item.cantidad;
    });
    
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
        carrito: [...carrito], // Copia del carrito
        subtotal: subtotal,
        descuento: descuento,
        impuestos: impuestos,
        total: total,
        cantidadProductos: cantidadTotal
    };
    
    // Actualizar stock e inventario
    carrito.forEach(item => {
        const producto = inventario.find(p => p.id === item.producto.id);
        producto.stock -= item.cantidad;
        producto.vendidos += item.cantidad;
    });
    
    // Guardar venta
    ventasDelDia.push(venta);
    totalRecaudado += total;
    
    // Limpiar carrito
    carrito = [];
    
    // Guardar todo en localStorage
    guardarDatos();
    
    // Actualizar pantallas
    mostrarInventario();
    mostrarCatalogo();
    mostrarCarrito();
    
    // Mensaje de éxito
    mostrarMensaje(`✅ Venta #${venta.id} finalizada. Total: $${total.toFixed(2)}`, 'exito');
}

// ========================================
// FUNCIÓN PARA MOSTRAR MENSAJES
// ========================================
function mostrarMensaje(mensaje, tipo) {
    const areaMensajes = document.getElementById('area-mensajes');
    
    const div = document.createElement('div');
    div.className = `mensaje mensaje-${tipo}`;
    div.textContent = mensaje;
    
    areaMensajes.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 3000);
}

// ========================================
// INICIALIZACIÓN - Eventos del DOM (VERSIÓN ACTUALIZADA)
// ========================================
document.addEventListener('DOMContentLoaded', async function() {
    // 1. Cargar datos guardados en localStorage
    cargarDatos();
    
    // 2. Si no hay productos en inventario, cargar desde JSON
    await cargarProductosIniciales();
    
    // 3. Mostrar datos actuales (ya sea de localStorage o JSON)
    mostrarInventario();
    mostrarCatalogo();
    mostrarCarrito();
    
    // 4. Vincular todos los eventos (igual que antes)
    const formProducto = document.getElementById('form-producto');
    formProducto.addEventListener('submit', agregarProducto);
    
    const btnFinalizarVenta = document.getElementById('btn-finalizar-venta');
    btnFinalizarVenta.addEventListener('click', finalizarVenta);
    
    const btnLimpiarCarrito = document.getElementById('btn-limpiar-carrito');
    btnLimpiarCarrito.addEventListener('click', limpiarCarrito);
    
    const btnMostrarReportes = document.getElementById('btn-mostrar-reportes');
    btnMostrarReportes.addEventListener('click', mostrarReportes);
    
    const btnLimpiarInventario = document.getElementById('btn-limpiar-inventario');
    btnLimpiarInventario.addEventListener('click', limpiarInventario);
    
    const btnLimpiarVentas = document.getElementById('btn-limpiar-ventas');
    btnLimpiarVentas.addEventListener('click', limpiarHistorialVentas);
    
    const btnExportarDatos = document.getElementById('btn-exportar-datos');
    btnExportarDatos.addEventListener('click', exportarDatos);
    
    // 5. Mensaje inicial
    if (inventario.length > 0) {
        mostrarMensaje(`🏪 Simulador cargado. Inventario: ${inventario.length} productos`, 'info');
    } else {
        mostrarMensaje('🏪 Simulador cargado. Agrega productos para comenzar.', 'info');
    }
});

// ========================================
// FUNCIONES DE REPORTES 
// ========================================

// Función para generar reportes completos
function mostrarReportes() {
    const areaReportes = document.getElementById('area-reportes');
    
    if (ventasDelDia.length === 0) {
        areaReportes.innerHTML = '<p><em>No hay ventas registradas para mostrar reportes</em></p>';
        return;
    }
    
    // Calcular estadísticas 
    let totalProductosVendidos = 0;
    let productoMasVendido = null;
    let maxVendidos = 0;
    
    // Encontrar producto más vendido
    inventario.forEach(producto => {
        totalProductosVendidos += producto.vendidos;
        
        if (producto.vendidos > maxVendidos) {
            maxVendidos = producto.vendidos;
            productoMasVendido = producto;
        }
    });
    
    let promedioVenta = totalRecaudado / ventasDelDia.length;
    
    // Generar HTML del reporte
    let html = `
        <div class="reporte-container">
            <h3>📊 Reporte de Ventas</h3>
            
            <div class="estadisticas-principales">
                <div class="estadistica">
                    <h4>💰 Total Recaudado</h4>
                    <p class="valor-grande">$${totalRecaudado.toFixed(2)}</p>
                </div>
                
                <div class="estadistica">
                    <h4>🛒 Ventas Realizadas</h4>
                    <p class="valor-grande">${ventasDelDia.length}</p>
                </div>
                
                <div class="estadistica">
                    <h4>📦 Productos Vendidos</h4>
                    <p class="valor-grande">${totalProductosVendidos}</p>
                </div>
                
                <div class="estadistica">
                    <h4>📈 Promedio por Venta</h4>
                    <p class="valor-grande">$${promedioVenta.toFixed(2)}</p>
                </div>
            </div>
    `;
    
    if (productoMasVendido) {
        html += `
            <div class="producto-destacado">
                <h4>🏆 Producto Más Vendido</h4>
                <p><strong>${productoMasVendido.nombre}</strong> (${productoMasVendido.vendidos} unidades)</p>
            </div>
        `;
    }
    
    // Estado del inventario
    html += `
        <div class="inventario-estado">
            <h4>📋 Estado del Inventario</h4>
            <div class="productos-estado">
    `;
    
    inventario.forEach(producto => {
        html += `
            <div class="producto-estado">
                <span class="nombre">${producto.nombre}:</span>
                <span class="stock">Stock ${producto.stock}</span>
                <span class="vendidos">Vendidos ${producto.vendidos}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        </div>
    `;
    
    areaReportes.innerHTML = html;
}

// ========================================
// FUNCIONES DE CONTROLES GENERALES
// ========================================

// Función para limpiar inventario
function limpiarInventario() {
    if (inventario.length === 0) {
        mostrarMensaje('📦 El inventario ya está vacío', 'info');
        return;
    }
    
    inventario = [];
    carrito = [];
    guardarDatos();
    
    mostrarInventario();
    mostrarCatalogo();
    mostrarCarrito();
    
    mostrarMensaje('🗑️ Inventario limpiado completamente', 'info');
}

// Función para limpiar historial de ventas
function limpiarHistorialVentas() {
    if (ventasDelDia.length === 0) {
        mostrarMensaje('📊 No hay historial de ventas para limpiar', 'info');
        return;
    }
    
    ventasDelDia = [];
    totalRecaudado = 0;
    contadorVentas = 0;
    
    // Resetear vendidos en inventario
    inventario.forEach(producto => {
        producto.vendidos = 0;
    });
    
    guardarDatos();
    
    mostrarInventario();
    document.getElementById('area-reportes').innerHTML = '<p><em>Haz clic en "Generar Reporte" para ver las estadísticas</em></p>';
    
    mostrarMensaje('🗑️ Historial de ventas limpiado', 'info');
}

// Función para exportar datos (simulada)
function exportarDatos() {
    const datos = {
        inventario: inventario,
        ventasDelDia: ventasDelDia,
        totalRecaudado: totalRecaudado,
        fecha: new Date().toLocaleDateString()
    };
    
    const datosJSON = JSON.stringify(datos, null, 2);
    
    // Crear blob y descargar
    const blob = new Blob([datosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tienda-datos-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    a.click();
    
    mostrarMensaje('💾 Datos exportados correctamente', 'exito');
}

// ========================================
// ACTUALIZAR INICIALIZACIÓN - AGREGAR al final de DOMContentLoaded
// ========================================

// AGREGAR estos event listeners dentro de DOMContentLoaded, después de los existentes:

    const btnMostrarReportes = document.getElementById('btn-mostrar-reportes');
    btnMostrarReportes.addEventListener('click', mostrarReportes);
    
    const btnLimpiarInventario = document.getElementById('btn-limpiar-inventario');
    btnLimpiarInventario.addEventListener('click', limpiarInventario);
    
    const btnLimpiarVentas = document.getElementById('btn-limpiar-ventas');
    btnLimpiarVentas.addEventListener('click', limpiarHistorialVentas);
    
    const btnExportarDatos = document.getElementById('btn-exportar-datos');
    btnExportarDatos.addEventListener('click', exportarDatos);