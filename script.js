
const formularioBusqueda = document.querySelector("#formulario-busqueda");
const campoBusqueda = document.querySelector("#busqueda");
const botonesCategorias = document.querySelectorAll(".categoria");
const listaProductos = document.querySelector("#lista-productos");

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

formularioBusqueda.addEventListener("submit", function (evento) {
    evento.preventDefault();
    textoBusqueda = campoBusqueda.value.trim().toLowerCase();
    mostrarProductos();
});

campoBusqueda.addEventListener("input", function () {
    textoBusqueda = campoBusqueda.value.trim().toLowerCase();
    mostrarProductos();
});

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

mostrarProductos();
