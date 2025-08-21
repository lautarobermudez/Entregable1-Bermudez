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

// CORRECCIÓN 1: Contador independiente para IDs únicos
let proximoId = 1;

// ========================================
// NUEVAS FUNCIONES FETCH - CARGA ASINCRÓNICA
// ========================================

// FUNCIÓN ASINCRÓNICA PARA CARGAR PRODUCTOS DESDE JSON
async function cargarProductosDesdeJSON() {
    try {
        console.log('🔄 Intentando cargar productos desde data/productos.json...');
        
        // 1. FETCH: Hacer petición HTTP al archivo JSON
        const response = await fetch('./data/productos.json');
        
        // 2. VALIDAR: Verificar que la petición fue exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        // 3. PARSEAR: Convertir la respuesta JSON a objetos JavaScript
        const productosJSON = await response.json();
        
        // 4. VALIDAR: Asegurar que los datos son válidos
        if (!Array.isArray(productosJSON)) {
            throw new Error('El archivo JSON no contiene un array válido');
        }
        
        if (productosJSON.length === 0) {
            console.log('⚠️ El archivo JSON está vacío');
            return 0;
        }
        
        console.log(`✅ ${productosJSON.length} productos encontrados en JSON`);
        
        // 5. PROCESAR: Integrar productos con el sistema existente
        const productosAgregados = await procesarProductosJSON(productosJSON);
        
        return productosAgregados;
        
    } catch (error) {
        // 6. MANEJO DE ERRORES: Si algo falla
        console.error('❌ Error cargando productos desde JSON:', error.message);
        mostrarMensaje('⚠️ No se pudieron cargar los productos iniciales desde JSON', 'info');
        return 0;
    }
}

// FUNCIÓN PARA PROCESAR E INTEGRAR PRODUCTOS DEL JSON
async function procesarProductosJSON(productosJSON) {
    let productosAgregados = 0;
    
    console.log('🔄 Procesando productos del JSON...');
    
    // RECORRER cada producto del JSON
    for (const productoJSON of productosJSON) {
        // VALIDAR que el producto tenga los campos requeridos
        if (!productoJSON.nombre || !productoJSON.precio || productoJSON.stock === undefined) {
            console.log(`⚠️ Producto inválido encontrado:`, productoJSON);
            continue; // Saltar este producto y continuar con el siguiente
        }
        
        // VERIFICAR si ya existe un producto con el mismo nombre
        const productoExistente = inventario.find(producto => 
            producto.nombre.toLowerCase() === productoJSON.nombre.toLowerCase()
        );
        
        if (productoExistente) {
            // Si ya existe, saltar (no duplicar)
            console.log(`⚠️ Producto ya existe en inventario: ${productoJSON.nombre}`);
            continue;
        }
        
        // CREAR nuevo producto con la estructura de tu sistema
        const nuevoProducto = {
            id: proximoId++,                                    // ID único usando tu contador
            nombre: productoJSON.nombre,                        // Nombre del JSON
            precio: parseFloat(productoJSON.precio),            // Asegurar que sea número
            stock: parseInt(productoJSON.stock),                // Asegurar que sea entero
            categoria: productoJSON.categoria || 'General',     // Categoría o 'General' por defecto
            vendidos: 0                                         // Inicializar vendidos en 0
        };
        
        // AGREGAR al inventario
        inventario.push(nuevoProducto);
        productosAgregados++;
        
        console.log(`✅ Producto agregado: ${nuevoProducto.nombre} (ID: ${nuevoProducto.id})`);
    }
    
    return productosAgregados;
}

// FUNCIÓN PARA VERIFICAR SI ES PRIMERA CARGA
function esPrimeraCarga() {
    // Verificar si hay datos en localStorage
    const inventarioGuardado = localStorage.getItem('inventario');
    const primeraCargaFlag = localStorage.getItem('primeraCargaCompletada');
    
    // Es primera carga si:
    // 1. No hay inventario guardado O el inventario está vacío
    // 2. No se ha marcado el flag de primera carga
    return (!inventarioGuardado || JSON.parse(inventarioGuardado).length === 0) && !primeraCargaFlag;
}

// FUNCIÓN PARA MARCAR PRIMERA CARGA COMO COMPLETADA
function marcarPrimeraCargaCompletada() {
    localStorage.setItem('primeraCargaCompletada', 'true');
}

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
    localStorage.setItem('proximoId', proximoId); // Guardar también el contador de IDs
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
    
    // CORRECCIÓN 1: Cargar contador de IDs y ajustarlo si es necesario
    proximoId = parseInt(localStorage.getItem('proximoId')) || 1;
    
    // Si hay productos, asegurar que proximoId sea mayor al ID más alto
    if (inventario.length > 0) {
        const maxId = Math.max(...inventario.map(p => p.id));
        if (proximoId <= maxId) {
            proximoId = maxId + 1;
        }
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
    
    // CORRECCIÓN 2: Validar si el producto ya existe (por nombre)
    const productoExistente = inventario.find(producto => 
        producto.nombre.toLowerCase() === nombre.toLowerCase()
    );
    
    if (productoExistente) {
        // Si el producto ya existe, preguntar si desea actualizar el stock
        Swal.fire({
    title: 'Producto ya existe',
    text: `El producto "${nombre}" ya existe. Stock actual: ${productoExistente.stock}. ¿Desea agregar ${stock} unidades?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, agregar',
    cancelButtonText: 'Cancelar'
}).then((result) => {
    if (result.isConfirmed) {
        // Actualizar stock del producto existente
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
    
    // CORRECCIÓN 1: Usar contador independiente para generar ID único
    const producto = {
        id: proximoId++,
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
    mostrarMensaje(`✅ Producto "${producto.nombre}" agregado correctamente con ID #${producto.id}`, 'exito');
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
// FUNCIÓN PARA MOSTRAR MENSAJES CON TOASTIFY
// ========================================
function mostrarMensaje(mensaje, tipo) {
    // Configuraciones base de Toastify
    let config = {
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "top", // top o bottom
        position: "right", // left, center o right
        stopOnFocus: true, // Pausar al pasar mouse
        style: {}
    };
    
    // Personalizar según el tipo de mensaje
    switch(tipo) {
        case 'exito':
            config.style.background = "linear-gradient(to right, #00b09b, #96c93d)";
            config.duration = 3000;
            break;
            
        case 'error':
            config.style.background = "linear-gradient(to right, #ff5f6d, #ffc371)";
            config.duration = 4000; // Errores duran más
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
            // Mensaje normal (azul)
            config.style.background = "linear-gradient(to right, #4facfe, #00f2fe)";
            config.duration = 3000;
    }
    
    // Mostrar el toast
    Toastify(config).showToast();
}

// FUNCIÓN ADICIONAL: Toast especial para ventas
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
        },
        onClick: function(){
            // Al hacer click, mostrar más detalles
            console.log(`Detalles de venta #${ventaId}`);
        }
    }).showToast();
}

// FUNCIÓN ADICIONAL: Toast especial para carga inicial
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
// NUEVA INICIALIZACIÓN CON FETCH
// ========================================

// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
async function inicializarAplicacion() {
    try {
        console.log('🚀 Iniciando aplicación...');
        
        // 1. CARGAR datos existentes desde localStorage
        cargarDatos();
        console.log(`📦 Datos cargados desde localStorage: ${inventario.length} productos`);
        
        // 2. VERIFICAR si es la primera vez que se carga la aplicación
        if (esPrimeraCarga()) {
            console.log('🆕 Primera carga detectada - Cargando productos desde JSON...');
            
            // Mostrar mensaje de carga inicial
            mostrarMensaje('🔄 Cargando productos iniciales...', 'info');
            
            // 3. CARGAR productos desde JSON
            const productosAgregados = await cargarProductosDesdeJSON();
            
            if (productosAgregados > 0) {
                // 4. GUARDAR los nuevos datos en localStorage
                guardarDatos();
                
                // 5. MARCAR primera carga como completada
                marcarPrimeraCargaCompletada();
                
                // 6. MENSAJE de éxito
                mostrarMensaje(
                    `✅ ${productosAgregados} productos iniciales cargados desde JSON`, 
                    'exito'
                );
                
                console.log(`✅ Primera carga completada: ${productosAgregados} productos agregados`);
            } else {
                console.log('⚠️ No se cargaron productos desde JSON');
            }
        } else {
            console.log('🔄 Carga normal - Usando datos existentes de localStorage');
            mostrarMensaje(`🏪 Simulador cargado. Inventario: ${inventario.length} productos`, 'info');
        }
        
        // 7. ACTUALIZAR la interfaz con todos los datos
        actualizarInterfaz();
        
        console.log('✅ Aplicación inicializada correctamente');
        
    } catch (error) {
        // 8. MANEJO DE ERRORES globales
        console.error('❌ Error durante la inicialización:', error);
        mostrarMensaje('❌ Error al inicializar la aplicación', 'error');
        
        // Aún así, mostrar la interfaz con datos locales
        actualizarInterfaz();
    }
}

// FUNCIÓN PARA ACTUALIZAR TODA LA INTERFAZ
function actualizarInterfaz() {
    // Actualizar todas las secciones de la interfaz
    mostrarInventario();
    mostrarCatalogo();
    mostrarCarrito();
    
    console.log('🔄 Interfaz actualizada');
}

// FUNCIÓN PARA CONFIGURAR TODOS LOS EVENT LISTENERS
function configurarEventListeners() {
    console.log('🔗 Configurando event listeners...');
    
    // Event listener para formulario de productos
    const formProducto = document.getElementById('form-producto');
    formProducto.addEventListener('submit', agregarProducto);
    
    // Event listener para finalizar venta
    const btnFinalizarVenta = document.getElementById('btn-finalizar-venta');
    btnFinalizarVenta.addEventListener('click', finalizarVenta);
    
    // Event listener para limpiar carrito
    const btnLimpiarCarrito = document.getElementById('btn-limpiar-carrito');
    btnLimpiarCarrito.addEventListener('click', limpiarCarrito);
    
    // Event listener para mostrar reportes
    const btnMostrarReportes = document.getElementById('btn-mostrar-reportes');
    btnMostrarReportes.addEventListener('click', mostrarReportes);
    
    // Event listener para limpiar inventario
    const btnLimpiarInventario = document.getElementById('btn-limpiar-inventario');
    btnLimpiarInventario.addEventListener('click', limpiarInventario);
    
    // Event listener para limpiar ventas
    const btnLimpiarVentas = document.getElementById('btn-limpiar-ventas');
    btnLimpiarVentas.addEventListener('click', limpiarHistorialVentas);
    
    // Event listener para exportar datos
    const btnExportarDatos = document.getElementById('btn-exportar-datos');
    btnExportarDatos.addEventListener('click', exportarDatos);
    
    console.log('✅ Event listeners configurados');
}

// NUEVA FUNCIÓN DOMContentLoaded CON FETCH
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 DOM cargado - Iniciando configuración...');
    
    // 1. INICIALIZAR la aplicación (incluyendo fetch si es necesario)
    await inicializarAplicacion();
    
    // 2. CONFIGURAR todos los event listeners
    configurarEventListeners();
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
    proximoId = 1; // CORRECCIÓN 1: Resetear también el contador de IDs
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