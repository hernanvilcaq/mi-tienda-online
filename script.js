const formularioBusqueda = document.querySelector("#formulario-busqueda");
const campoBusqueda = document.querySelector("#busqueda");
const botonesCategorias = document.querySelectorAll(".categoria");
const listaProductos = document.querySelector("#lista-productos");
const resultadosBusqueda = document.querySelector("#resultados-busqueda");
const contenedorBuscador = document.querySelector(".buscador-contenedor");
const seccionDetalle = document.querySelector("#detalle-producto");
const contenidoDetalle = document.querySelector("#contenido-detalle");
const botonVolver = document.querySelector("#volver-productos");

// Productos temporales para probar la tienda.
// Después los cargaremos desde Supabase.
const productos = [
    {
        id: 1,
        nombre: "Auriculares inalámbricos",
        categoria: "Tecnología",
        precio: 79.90,
        descripcion: "Sonido para tu música y tus actividades.",
        icono: "🎧"
    },
    {
        id: 2,
        nombre: "Reloj digital",
        categoria: "Tecnología",
        precio: 59.90,
        descripcion: "Un estilo moderno para todos los días.",
        icono: "⌚"
    },
    {
        id: 3,
        nombre: "Polera urbana",
        categoria: "Ropa",
        precio: 49.90,
        descripcion: "Una opción cómoda para tu día a día.",
        icono: "👕"
    },
    {
        id: 4,
        nombre: "Zapatillas casuales",
        categoria: "Calzado",
        precio: 119.90,
        descripcion: "Comodidad para acompañarte.",
        icono: "👟"
    },
    {
        id: 5,
        nombre: "Mochila moderna",
        categoria: "Accesorios",
        precio: 69.90,
        descripcion: "Espacio para llevar tus cosas.",
        icono: "🎒"
    },
    {
        id: 6,
        nombre: "Cargador portátil",
        categoria: "Tecnología",
        precio: 45.90,
        descripcion: "Energía para tus dispositivos.",
        icono: "🔋"
    },
    {
        id: 7,
        nombre: "Gorra urbana",
        categoria: "Accesorios",
        precio: 29.90,
        descripcion: "Un accesorio para completar tu estilo.",
        icono: "🧢"
    },
    {
        id: 8,
        nombre: "Casaca ligera",
        categoria: "Ropa",
        precio: 89.90,
        descripcion: "Una prenda versátil para combinar.",
        icono: "🧥"
    }
];

let categoriaActiva = "";
let textoBusqueda = "";
let carrito = [];


function agregarAlCarrito(id) {
    const producto = productos.find(function (item) {
        return item.id === id;
    });

    if (!producto) return;

    const existente = carrito.find(function (item) {
        return item.id === id;
    });

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    mostrarCarrito();
}

function mostrarCarrito() {
    const contenidoCarrito = document.getElementById("contenido-carrito");
    const totalCarrito = document.getElementById("total-carrito");

    if (!contenidoCarrito || !totalCarrito) return;

    contenidoCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenidoCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalCarrito.textContent = "Total: S/ 0.00";
        return;
    }

    let total = 0;

    carrito.forEach(function (item) {
        const fila = document.createElement("div");
        fila.className = "item-carrito";

        const nombre = document.createElement("p");
        nombre.textContent = item.nombre;

        const precio = document.createElement("p");
        precio.textContent = "Precio: S/ " + item.precio.toFixed(2);

        const cantidad = document.createElement("p");
        cantidad.textContent = "Cantidad: " + item.cantidad;

        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const importe = document.createElement("p");
        importe.textContent = "Subtotal: S/ " + subtotal.toFixed(2);

        fila.append(nombre, precio, cantidad, importe);
        contenidoCarrito.appendChild(fila);
    });

    totalCarrito.textContent = "Total: S/ " + total.toFixed(2);
}


// Genera la URL amigable de cada producto.
function crearSlug(nombre) {
    return nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}


// Muestra las sugerencias del buscador.
function mostrarResultadosBusqueda() {
    const texto = campoBusqueda.value.trim().toLowerCase();

    resultadosBusqueda.innerHTML = "";

    if (texto === "") {
        resultadosBusqueda.hidden = true;
        return;
    }

    const coincidencias = productos.filter(function (producto) {
        return (
            producto.nombre.toLowerCase().includes(texto) ||
            producto.descripcion.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto)
        );
    });

    if (coincidencias.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "resultado-detalle";
        mensaje.style.padding = "16px";
        mensaje.textContent = "No encontramos productos con ese nombre.";
        resultadosBusqueda.appendChild(mensaje);
    } else {
        coincidencias.slice(0, 6).forEach(function (producto) {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "resultado-busqueda";

            const miniatura = document.createElement("span");
            miniatura.className = "resultado-miniatura";
            miniatura.textContent = producto.icono;
            miniatura.setAttribute("aria-hidden", "true");

            const informacion = document.createElement("span");
            informacion.className = "resultado-informacion";

            const nombre = document.createElement("span");
            nombre.className = "resultado-nombre";
            nombre.textContent = producto.nombre;

            const detalle = document.createElement("span");
            detalle.className = "resultado-detalle";
            detalle.textContent = producto.categoria;

            const precio = document.createElement("span");
            precio.className = "resultado-precio";
            precio.textContent = "S/ " + producto.precio.toFixed(2);

            informacion.append(nombre, detalle);
            boton.append(miniatura, informacion, precio);

            boton.addEventListener("click", function () {
                campoBusqueda.value = producto.nombre;
                textoBusqueda = producto.nombre.toLowerCase();
                resultadosBusqueda.hidden = true;
                abrirDetalleProducto(producto.id);
            });

            resultadosBusqueda.appendChild(boton);
        });
    }

    resultadosBusqueda.hidden = false;
}


// Muestra los productos de la tienda.
function mostrarProductos() {
    const resultados = productos.filter(function (producto) {
        const coincideTexto =
            producto.nombre.toLowerCase().includes(textoBusqueda) ||
            producto.descripcion.toLowerCase().includes(textoBusqueda) ||
            producto.categoria.toLowerCase().includes(textoBusqueda);

        const coincideCategoria =
            categoriaActiva === "" ||
            producto.categoria === categoriaActiva;

        return coincideTexto && coincideCategoria;
    });

    listaProductos.innerHTML = "";

    if (resultados.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "mensaje-vacio";
        mensaje.textContent = "No encontramos productos con esos filtros.";
        listaProductos.appendChild(mensaje);
        return;
    }

    resultados.forEach(function (producto) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";
        tarjeta.style.cursor = "pointer";
        tarjeta.setAttribute("role", "button");
        tarjeta.setAttribute("tabindex", "0");
        tarjeta.setAttribute(
            "aria-label",
            "Ver detalles de " + producto.nombre
        );

        tarjeta.addEventListener("click", function () {
            abrirDetalleProducto(producto.id);
        });

        tarjeta.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrirDetalleProducto(producto.id);
            }
        });

        const imagen = document.createElement("div");
        imagen.className = "producto-icono";
        imagen.textContent = producto.icono;
        imagen.setAttribute("aria-hidden", "true");

        const contenido = document.createElement("div");
        contenido.className = "producto-contenido";

        const categoria = document.createElement("p");
        categoria.className = "producto-categoria";
        categoria.textContent = producto.categoria;

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const descripcion = document.createElement("p");
        descripcion.className = "producto-descripcion";
        descripcion.textContent = producto.descripcion;

        const precio = document.createElement("p");
        precio.className = "producto-precio";
        precio.textContent = "S/ " + producto.precio.toFixed(2);

        contenido.append(categoria, nombre, descripcion, precio);
        tarjeta.append(imagen, contenido);
        listaProductos.appendChild(tarjeta);
    });
}

// Abre el detalle de un producto y actualiza su URL.
function abrirDetalleProducto(id) {
    const producto = productos.find(function (item) {
        return item.id === id;
    });

    if (!producto) return;

    const slug = crearSlug(producto.nombre);
    const parametros = new URLSearchParams(window.location.search);

    if (parametros.get("producto") !== slug) {
        parametros.set("producto", slug);

        history.pushState(
            { productoId: producto.id },
            "",
            window.location.pathname + "?" + parametros.toString()
        );
    }

    resultadosBusqueda.hidden = true;

    contenidoDetalle.innerHTML = "";

    const tarjeta = document.createElement("div");
    tarjeta.className = "detalle-tarjeta";

    const imagen = document.createElement("div");
    imagen.className = "detalle-imagen";
    imagen.textContent = producto.icono;

    const informacion = document.createElement("div");
    informacion.className = "detalle-informacion";

    const categoria = document.createElement("p");
    categoria.className = "producto-categoria";
    categoria.textContent = producto.categoria;

    const nombre = document.createElement("h2");
    nombre.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = producto.descripcion;

    const precio = document.createElement("p");
    precio.className = "producto-precio";
    precio.textContent = "S/ " + producto.precio.toFixed(2);

    
    const botonCarrito = document.createElement("button");
    botonCarrito.type = "button";
    botonCarrito.className = "boton-principal";
    botonCarrito.textContent = "🛒 Agregar al carrito";

    botonCarrito.addEventListener("click", function (evento) {
        evento.stopPropagation();
        agregarAlCarrito(producto.id);
    });

    informacion.append(categoria, nombre, descripcion, precio, botonCarrito);
    tarjeta.append(imagen, informacion);
    contenidoDetalle.appendChild(tarjeta);


    document.querySelector("#destacados").hidden = true;
    seccionDetalle.hidden = false;

    seccionDetalle.scrollIntoView({ behavior: "smooth" });
}


// Vuelve al catálogo y quita el producto de la URL.
function volverAProductos(actualizarURL = true) {
    seccionDetalle.hidden = true;
    document.querySelector("#destacados").hidden = false;

    if (actualizarURL && window.location.search.includes("producto=")) {
        const parametros = new URLSearchParams(window.location.search);
        parametros.delete("producto");

        const nuevaURL =
            window.location.pathname +
            (parametros.toString() ? "?" + parametros.toString() : "") +
            window.location.hash;

        history.pushState({}, "", nuevaURL);
    }

    document.querySelector("#destacados").scrollIntoView({
        behavior: "smooth"
    });
}
const botonVolver = document.querySelector("#volver-productos");

botonVolver.addEventListener("click", function () {
    volverAProductos();
});


// Permite buscar productos mediante el formulario.
formularioBusqueda.addEventListener("submit", function (evento) {
    evento.preventDefault();

    textoBusqueda = campoBusqueda.value.trim().toLowerCase();

    mostrarProductos();
    mostrarResultadosBusqueda();
});


// Actualiza los productos mientras se escribe.
campoBusqueda.addEventListener("input", function () {
    textoBusqueda = campoBusqueda.value.trim().toLowerCase();

    mostrarProductos();
    mostrarResultadosBusqueda();
});


// Cierra las sugerencias cuando se hace clic fuera del buscador.
document.addEventListener("click", function (evento) {
    if (
        contenedorBuscador &&
        !contenedorBuscador.contains(evento.target)
    ) {
        resultadosBusqueda.hidden = true;
    }
});


// Activa o desactiva las categorías.
botonesCategorias.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const categoriaSeleccionada = boton.dataset.categoria;

        categoriaActiva =
            categoriaActiva === categoriaSeleccionada
                ? ""
                : categoriaSeleccionada;

        botonesCategorias.forEach(function (otroBoton) {
            const seleccionado =
                otroBoton.dataset.categoria === categoriaActiva;

            otroBoton.classList.toggle("activa", seleccionado);
            otroBoton.setAttribute("aria-pressed", String(seleccionado));
        });

        mostrarProductos();

        document.querySelector("#destacados").scrollIntoView({
            behavior: "smooth"
        });
    });
});


// Abre el producto indicado en la URL al cargar o navegar.
function cargarProductoDesdeURL() {
    const parametros = new URLSearchParams(window.location.search);
    const slugURL = parametros.get("producto");

    if (!slugURL) {
        seccionDetalle.hidden = true;
        document.querySelector("#destacados").hidden = false;
        return;
    }

    const producto = productos.find(function (item) {
        return crearSlug(item.nombre) === slugURL;
    });

    if (producto) {
        abrirDetalleProducto(producto.id);
    } else {
        seccionDetalle.hidden = true;
        document.querySelector("#destacados").hidden = false;
    }
}


// Detecta los botones atrás y adelante del navegador.
window.addEventListener("popstate", function () {
    cargarProductoDesdeURL();
});


// Inicia la tienda.
mostrarProductos();
cargarProductoDesdeURL();
