// ========================================
// SIMULADOR DE TIENDA VIRTUAL - PROYECTO FINAL
// Autor: Lautaro Bermúdez
// ========================================

// CONSTANTES DEL SISTEMA
const IVA = 0.21;
const DESCUENTO_MAYORISTA = 0.15;
const CANTIDAD_DESCUENTO = 5;

// VARIABLES GLOBALES Y ARRAYS PRINCIPALES
let inventario = [];
let carrito = [];
let ventasDelDia = [];
let totalRecaudado = 0;
let contadorVentas = 0;
let proximoId = 1;

// ========================================
// FUNCIONES DE CARGA ASINCRÓNICA CON FETCH
// ========================================

async function cargarProductosDesdeJSON() {
    try {
        const response = await fetch('./data/productos.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const productosJSON = await response.json();
        
        if (!Array.isArray(productosJSON)) {
            throw new Error('El archivo JSON no contiene un array válido');
        }
        
        if (productosJSON.length === 0) {
            return 0;
        }
        
        const productosAgregados = await procesarProductosJSON(productosJSON);
        return productosAgregados;
        
    } catch (error) {
        mostrarMensaje('⚠️ No se pudieron cargar los productos iniciales desde JSON', 'info');
        return 0;
    }
}

async function procesarProductosJSON(productosJSON) {
    let productosAgregados = 0;
    
    for (const productoJSON of productosJSON) {
        if (!productoJSON.nombre || !productoJSON.precio || productoJSON.stock === undefined) {
            continue;
        }
        
        const productoExistente = inventario.find(producto => 
            producto.nombre.toLowerCase() === productoJSON.nombre.toLowerCase()
        );
        
        if (productoExistente) {
            continue;
        }
        
        const nuevoProducto = {
            id: proximoId++,
            nombre: productoJSON.nombre,
            precio: parseFloat(productoJSON.precio),
            stock: parseInt(productoJSON.stock),
            categoria: productoJSON.categoria || 'General',
            vendidos: 0
        };
        
        inventario.push(nuevoProducto);
        productosAgregados++;
    }
    
    return productosAgregados;
}

function esPrimeraCarga() {
    const inventarioGuardado = localStorage.getItem('inventario');
    const primeraCargaFlag = localStorage.getItem('primeraCargaCompletada');
    
    return (!inventarioGuardado || JSON.parse(inventarioGuardado).length === 0) && !primeraCargaFlag;
}

function marcarPrimeraCargaCompletada() {
    localStorage.setItem('primeraCargaCompletada', 'true');
}

// ========================================
// FUNCIONES DE LOCALSTORAGE
// ========================================

function guardarDatos() {
    localStorage.setItem('inventario', JSON.stringify(inventario));
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('ventasDelDia', JSON.stringify(ventasDelDia));
    localStorage.setItem('totalRecaudado', totalRecaudado);
    localStorage.setItem('contadorVentas', contadorVentas);
    localStorage.setItem('proximoId', proximoId);
}

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
    proximoId = parseInt(localStorage.getItem('proximoId')) || 1;
    
    if (inventario.length > 0) {
        const maxId = Math.max(...inventario.map(p => p.id));
        if (proximoId <= maxId) {
            proximoId = maxId + 1;
        }
    }
}

// ========================================
// FUNCIONES DE GESTIÓN DE INVENTARIO
// ========================================

function agregarProducto(evento) {
    evento.preventDefault();
    
    const nombre = document.getElementById('nombre-producto').value.trim();
    const precio = parseFloat(document.getElementById('precio-producto').value);
    const stock = parseInt(document.getElementById('stock-producto').value);
    const categoria = document.getElementById('categoria-producto').value.trim() || 'General';
    
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
    
    const productoExistente = inventario.find(producto => 
        producto.nombre.toLowerCase() === nombre.toLowerCase()
    );
    
    if (productoExistente) {
        Swal.fire({
            title: 'Producto ya existe',
            text: `El producto "${nombre}" ya existe. Stock actual: ${productoExistente.stock}. ¿Desea agregar ${stock} unidades?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, agregar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                productoExistente.stock += stock;
                guardarDatos();
                document.getElementById('form-producto').reset();
                mostrarInventario();
                mostrarCatalogo();
                mostrarMensaje(
                    `✅ Stock actualizado: "${productoExistente.nombre}" ahora tiene ${productoExistente.stock} unidades`, 
                    'exito'
                );
            } else {
                mostrarMensaje('❌ Operación cancelada. El producto no fue modificado.', 'info');
            }
        });
        return;
    }
    
    const producto = {
        id: proximoId++,
        nombre: nombre,
        precio: precio,
        stock: stock,
        categoria: categoria,
        vendidos: 0
    };
    
    inventario.push(producto);
    guardarDatos();
    document.getElementById('form-producto').reset();
    mostrarInventario();
    mostrarCatalogo();
    mostrarMensaje(`✅ Producto "${producto.nombre}" agregado correctamente con ID #${producto.id}`, 'exito');
}

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

function agregarAlCarrito(idProducto) {
    const producto = inventario.find(p => p.id === idProducto);
    const cantidadInput = document.getElementById(`cantidad-${idProducto}`);
    const cantidad = parseInt(cantidadInput.value);
    
    if (!producto || cantidad <= 0 || cantidad > producto.stock) {
        mostrarMensaje('❌ Cantidad inválida', 'error');
        return;
    }
    
    const itemExistente = carrito.find(item => item.producto.id === idProducto);
    
    if (itemExistente) {
        if (itemExistente.cantidad + cantidad <= producto.stock) {
            itemExistente.cantidad += cantidad;
            itemExistente.subtotal = itemExistente.cantidad * producto.precio;
        } else {
            mostrarMensaje('❌ No hay suficiente stock', 'error');
            return;
        }
    } else {
        const itemCarrito = {
            producto: producto,
            cantidad: cantidad,
            subtotal: producto.precio * cantidad
        };
        carrito.push(itemCarrito);
    }
    
    guardarDatos();
    mostrarCarrito();
    cantidadInput.value = 1;
    mostrarMensaje(`✅ ${cantidad}x ${producto.nombre} agregado al carrito`, 'exito');
}

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
    mostrarResumenVenta();
    resumenVenta.style.display = 'block';
}

function mostrarResumenVenta() {
    const detalleResumen = document.getElementById('detalle-resumen');
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
    
    let html = `<p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>`;
    
    if (descuento > 0) {
        html += `<p><strong>Descuento mayorista (${(DESCUENTO_MAYORISTA * 100)}%):</strong> -$${descuento.toFixed(2)}</p>`;
    }
    
    html += `
        <p><strong>IVA (${(IVA * 100)}%):</strong> $${impuestos.toFixed(2)}</p>
        <p class="total"><strong>TOTAL:</strong> $${total.toFixed(2)}</p>
    `;
    
    detalleResumen.innerHTML = html;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarDatos();
    mostrarCarrito();
    mostrarMensaje('🗑️ Producto eliminado del carrito', 'info');
}

function limpiarCarrito() {
    carrito = [];
    guardarDatos();
    mostrarCarrito();
    mostrarMensaje('🗑️ Carrito limpiado', 'info');
}

function finalizarVenta() {
    if (carrito.length === 0) {
        mostrarMensaje('❌ El carrito está vacío', 'error');
        return;
    }
    
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
    
    let venta = {
        id: ++contadorVentas,
        fecha: new Date().toLocaleDateString(),
        carrito: [...carrito],
        subtotal: subtotal,
        descuento: descuento,
        impuestos: impuestos,
        total: total,
        cantidadProductos: cantidadTotal
    };
    
    carrito.forEach(item => {
        const producto = inventario.find(p => p.id === item.producto.id);
        producto.stock -= item.cantidad;
        producto.vendidos += item.cantidad;
    });
    
    ventasDelDia.push(venta);
    totalRecaudado += total;
    carrito = [];
    guardarDatos();
    
    mostrarInventario();
    mostrarCatalogo();
    mostrarCarrito();
    
    mostrarMensaje(`✅ Venta #${venta.id} finalizada. Total: $${total.toFixed(2)}`, 'exito');
}

// ========================================
// SISTEMA DE MENSAJES CON TOASTIFY
// ========================================

function mostrarMensaje(mensaje, tipo) {
    let config = {
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {}
    };
    
    switch(tipo) {
        case 'exito':
            config.style.background = "linear-gradient(to right, #00b09b, #96c93d)";
            config.duration = 3000;
            break;
            
        case 'error':
            config.style.background = "linear-gradient(to right, #ff5f6d, #ffc371)";
            config.duration = 4000;
            break;
            
        case 'info':
            config.style.background = "linear-gradient(to right, #667eea, #764ba2)";
            config.duration = 2500;
            break;
            
        case 'warning':
            config.style.background = "linear-gradient(to right, #f093fb, #f5576c)";
            config.duration = 3500;
            break;
            
        default:
            config.style.background = "linear-gradient(to right, #4facfe, #00f2fe)";
            config.duration = 3000;
    }
    
    Toastify(config).showToast();
}

function mostrarToastVenta(ventaId, total) {
    Toastify({
        text: `🎉 ¡Venta #${ventaId} completada! Total: $${total.toFixed(2)}`,
        duration: 5000,
        close: true,
        gravity: "top",
        position: "center",
        style: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontSize: "16px",
            fontWeight: "bold"
        }
    }).showToast();
}

function mostrarToastCargaInicial(cantidad) {
    Toastify({
        text: `🏪 ¡Bienvenido! ${cantidad} productos cargados desde JSON`,
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        style: {
            background: "linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "10px"
        }
    }).showToast();
}

// ========================================
// FUNCIONES DE INICIALIZACIÓN
// ========================================

async function inicializarAplicacion() {
    try {
        cargarDatos();
        
        if (esPrimeraCarga()) {
            mostrarMensaje('🔄 Cargando productos iniciales...', 'info');
            
            const productosAgregados = await cargarProductosDesdeJSON();
            
            if (productosAgregados > 0) {
                guardarDatos();
                marcarPrimeraCargaCompletada();
                mostrarMensaje(
                    `✅ ${productosAgregados} productos iniciales cargados desde JSON`, 
                    'exito'
                );
            }
        } else {
            mostrarMensaje(`🏪 Simulador cargado. Inventario: ${inventario.length} productos`, 'info');
        }
        
        actualizarInterfaz();
        
    } catch (error) {
        mostrarMensaje('❌ Error al inicializar la aplicación', 'error');
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    mostrarInventario();
    mostrarCatalogo();
    mostrarCarrito();
}

function configurarEventListeners() {
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
}

document.addEventListener('DOMContentLoaded', async function() {
    await inicializarAplicacion();
    configurarEventListeners();
});

// ========================================
// FUNCIONES DE REPORTES Y ESTADÍSTICAS
// ========================================

function mostrarReportes() {
    const areaReportes = document.getElementById('area-reportes');
    
    if (ventasDelDia.length === 0) {
        areaReportes.innerHTML = '<p><em>No hay ventas registradas para mostrar reportes</em></p>';
        return;
    }
    
    let totalProductosVendidos = 0;
    let productoMasVendido = null;
    let maxVendidos = 0;
    
    inventario.forEach(producto => {
        totalProductosVendidos += producto.vendidos;
        
        if (producto.vendidos > maxVendidos) {
            maxVendidos = producto.vendidos;
            productoMasVendido = producto;
        }
    });
    
    let promedioVenta = totalRecaudado / ventasDelDia.length;
    
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

function limpiarInventario() {
    if (inventario.length === 0) {
        mostrarMensaje('📦 El inventario ya está vacío', 'info');
        return;
    }
    
    inventario = [];
    carrito = [];
    proximoId = 1;
    guardarDatos();
    
    mostrarInventario();
    mostrarCatalogo();
    mostrarCarrito();
    
    mostrarMensaje('🗑️ Inventario limpiado completamente', 'info');
}

function limpiarHistorialVentas() {
    if (ventasDelDia.length === 0) {
        mostrarMensaje('📊 No hay historial de ventas para limpiar', 'info');
        return;
    }
    
    ventasDelDia = [];
    totalRecaudado = 0;
    contadorVentas = 0;
    
    inventario.forEach(producto => {
        producto.vendidos = 0;
    });
    
    guardarDatos();
    mostrarInventario();
    document.getElementById('area-reportes').innerHTML = '<p><em>Haz clic en "Generar Reporte" para ver las estadísticas</em></p>';
    
    mostrarMensaje('🗑️ Historial de ventas limpiado', 'info');
}

function exportarDatos() {
    const datos = {
        inventario: inventario,
        ventasDelDia: ventasDelDia,
        totalRecaudado: totalRecaudado,
        fecha: new Date().toLocaleDateString()
    };
    
    const datosJSON = JSON.stringify(datos, null, 2);
    
    const blob = new Blob([datosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tienda-datos-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    a.click();
    
    mostrarMensaje('💾 Datos exportados correctamente', 'exito');
}