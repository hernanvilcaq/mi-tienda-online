
const formularioBusqueda = document.querySelector("#formulario-busqueda");
const campoBusqueda = document.querySelector("#busqueda");
const botonesCategorias = document.querySelectorAll(".categoria");
const listaProductos = document.querySelector("#lista-productos");

// Por ahora, el catálogo está vacío.
// Más adelante cargaremos los productos desde Supabase.
let productos = [];

function mostrarProductos(productosFiltrados) {
    listaProductos.innerHTML = "";

    if (productosFiltrados.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "mensaje-vacio";
        mensaje.textContent = productos.length === 0
            ? "Pronto aparecerán aquí nuestros productos."
            : "No encontramos productos con ese nombre o categoría.";

        listaProductos.appendChild(mensaje);
        return;
    }

    // Aquí crearemos las tarjetas de productos en el siguiente paso.
}

formularioBusqueda.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const texto = campoBusqueda.value.trim().toLowerCase();

    const resultados = productos.filter(function (producto) {
        return producto.nombre.toLowerCase().includes(texto);
    });

    mostrarProductos(resultados);
});

botonesCategorias.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const categoriaSeleccionada = boton.dataset.categoria;

        const resultados = productos.filter(function (producto) {
            return producto.categoria === categoriaSeleccionada;
        });

        mostrarProductos(resultados);

        document.querySelector("#destacados").scrollIntoView({
            behavior: "smooth"
        });
    });
});

mostrarProductos(productos);
