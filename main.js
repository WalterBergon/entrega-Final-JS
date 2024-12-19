
document.getElementById("carritoIcon").addEventListener("click", () => {
    document.getElementById("carrito").classList.toggle("active");
});

document.getElementById("cerrarCarrito").addEventListener("click", () => {
    document.getElementById("carrito").classList.remove("active");
});

let Carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productos = document.getElementById("productos");
const productosCarrito = document.getElementById("productosCarrito");
const total = document.getElementById("total");
const carritoIcon = document.getElementById("carritoIcon");
const botonQueLimpia = document.getElementById("botonQueLimpia");

// Fetch - async await
const cargarProductos = async () => {
    try {
        const response = await fetch("./data.json");
        if (!response.ok) throw new Error("Error al cargar los productos");
        const productosLibreria = await response.json();
        mostrarProductos(productosLibreria);
    } catch (error) {
        console.error("Hubo un problema al cargar los productos:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los productos. Intenta recargar la página.",
            icon: "error"
        });
    }
};

//  para mostrar los productos en el Don
const mostrarProductos = (productosLibreria) => {
    productos.innerHTML = "";
    productosLibreria.forEach((el) => {
        productos.innerHTML += `
            <div id="${el.id}" class="producto">
                <h3>${el.nombre}</h3>
                <div class="img"><img src="${el.img}" alt="${el.nombre}"></div>
                <p>Precio: $<span>${el.precio}</span></p>
                <p>Categoría: ${el.categoria}</p>
                <button class="botonesCompra">Comprar</button>
            </div>
        `;
    });
    botonesComprar();
};

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizadoraCarrito();
});

function botonesComprar() {
    const botones = document.getElementsByClassName("botonesCompra");
    const arrayBotones = Array.from(botones);

    arrayBotones.forEach(el => {
        el.addEventListener("click", (evento) => {
            const nombre = evento.target.parentElement.children[0].innerText;
            const precio = Number(evento.target.parentElement.children[2].children[0].innerText);

            const productoABuscar = Carrito.find(el => el.nombre === nombre);

            if (productoABuscar) {
                productoABuscar.cantidad++;
            } else {
                Carrito.push({ nombre, precio, cantidad: 1 });
            }

            actualizadoraCarrito();

            // para confirmar de compra
            Swal.fire({
                title: "¡EH!! Producto agregado!",
                text: `${nombre} ha sido añadido a tu carrito.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: "bottom-start",
            });
        });
    });
}

function actualizadoraCarrito() {
    productosCarrito.innerHTML = "";
    Carrito.forEach((el, index) => {

        productosCarrito.innerHTML += `
            <div class="producto">
                <img src="${el.img}" alt="${el.nombre}" class="miniatura">
                <h3>${el.nombre}</h3>
                <p>Precio: $${el.precio}</p>
                <p>Cantidad: ${el.cantidad}</p>
                <button class="aumentarCantidad" data-index="${index}">+</button>
                <button class="disminuirCantidad" data-index="${index}">-</button>
            </div>
        `;
    });

    total.innerText = `Total: $${Carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0)}`;
    carritoIcon.children[0].innerText = Carrito.reduce((acc, el) => acc + el.cantidad, 0);

    localStorage.setItem("carrito", JSON.stringify(Carrito));

    agregarEventosCantidad();
}

function agregarEventosCantidad() {
    const botonesAumentar = document.getElementsByClassName("aumentarCantidad");
    const botonesDisminuir = document.getElementsByClassName("disminuirCantidad");

    Array.from(botonesAumentar).forEach(boton => {
        boton.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            Carrito[index].cantidad++;
            actualizadoraCarrito();
        });
    });

    Array.from(botonesDisminuir).forEach(boton => {
        boton.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            if (Carrito[index].cantidad > 1) {
                Carrito[index].cantidad--;
            } else {
                Carrito.splice(index, 1);
            }
            actualizadoraCarrito();
        });
    });
}

// SweetAlert2 para el botón "Limpiar Carrito"
document.getElementById("botonQueLimpia").addEventListener("click", () => {
    Swal.fire({
        title: "¿Está seguro de limpiar el carrito?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, limpiar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            Carrito = [];
            localStorage.clear();
            actualizadoraCarrito();
            Swal.fire({
                title: "Carrito limpiado",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    });
});


// SweetAlert2 para el botón "Pagar"
document.getElementById("botonPagar").addEventListener("click", () => {
    if (Carrito.length > 0) {
        const totalCompra = Carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
        Swal.fire({
            title: `Total a pagar: $${totalCompra}`,
            text: "¿Desea proceder al pago?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ir a pagar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "pago.html"; // Redirige al proceso de pago
            }
        });
    } else {
        Swal.fire({
            title: "El carrito está vacío",
            icon: "warning",
            timer: 1500,
            showConfirmButton: false,
        });
    }
});



// Cargar productos al inicio del DOM
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizadoraCarrito();
});
