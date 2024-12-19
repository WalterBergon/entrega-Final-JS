document.getElementById("formPago").addEventListener("submit", (e) => {
    e.preventDefault(); // Evita el tiqui del formulario
    console.log("Formulario enviado");

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const metodoPago = document.getElementById("metodoPago").value;


    if (!nombre || !email) {
        Swal.fire({
            title: "Enserio che?",
            text: "Completá todos los datos, poné onda guachin.",
            icon: "error",
        });
        return;
    }

    // Validación del meeetodo de pago
    if (metodoPago === "tarjeta") {
        const numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
        if (!numeroTarjeta || numeroTarjeta.length !== 16 || isNaN(numeroTarjeta)) {
            Swal.fire({
                title: "Loco, le pifiaste en algún número, son 16",
                text: "Ingresálos de vuelta y más te vale que la tarjeta sea tuya.",
                icon: "Cuak! Error",
            });
            return;
        }
    }

    // Mostrar algun SweetAlert
    Swal.fire({
        title: "Procesando pago...",
        text: "Espere un momento mientras se realiza el pago.",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 2000, // hacemos de cuenta...
    }).then(() => {

        Swal.fire({
            title: `Cheee! Gracias por tu compra, ${nombre}!`,
            text: "Te vamos a mandar un mail para cordinar la entrega y alabarte gentilmente a " + email,
            icon: "success",
        }).then(() => {
            console.log("Pago completado"); //la mirada del destino
            localStorage.clear();
            window.location.href = "index.html";
        });
    });
});


document.getElementById("metodoPago").addEventListener("change", (e) => {
    const detallesTarjeta = document.getElementById("detallesTarjeta");
    if (e.target.value === "tarjeta") {
        detallesTarjeta.style.display = "block";
    } else {
        detallesTarjeta.style.display = "none";
    }
});

// Botoon "Volver al carrito"
document.getElementById("volverCarrito").addEventListener("click", () => {
    console.log("Volver al carrito presionado");
    window.location.href = "index.html";
});
