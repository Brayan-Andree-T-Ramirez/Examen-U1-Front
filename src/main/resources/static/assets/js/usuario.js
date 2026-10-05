const API = "https://examen-u1.onrender.com/api/v1/usuarios";

let usuariosActuales = [];
let registrando = false;
let buscando = false;
let cargandoUsuarios = false;


// ======================================================
// CARGAR TODOS LOS USUARIOS
// ======================================================

function cargarUsuarios() {

    if (cargandoUsuarios) {
        return;
    }

    cargandoUsuarios = true;

    fetch(API)
        .then(response => {

            if (!response.ok) {
                throw new Error("No se pudieron cargar los usuarios.");
            }

            return response.json();
        })
        .then(data => {

            usuariosActuales = data;

            console.log("Usuarios cargados:", usuariosActuales);
        })
        .catch(error => {

            console.error(error);
        })
        .finally(() => {

            cargandoUsuarios = false;
        });
}


// ======================================================
// VALIDAR USUARIO
// ======================================================

function validacionUsuario(usuario) {

    let errores = [];


    // -------------------------
    // CAMPOS OBLIGATORIOS
    // -------------------------

    if (!usuario.nombre.trim()) {
        errores.push("El nombre es obligatorio.");
    }

    if (!usuario.apellido_paterno.trim()) {
        errores.push("El apellido paterno es obligatorio.");
    }

    if (!usuario.apellido_materno.trim()) {
        errores.push("El apellido materno es obligatorio.");
    }

    if (!usuario.correo.trim()) {
        errores.push("El correo electrónico es obligatorio.");
    }

    if (!usuario.usuario.trim()) {
        errores.push("El nombre de usuario es obligatorio.");
    }

    if (!usuario.password.trim()) {
        errores.push("La contraseña es obligatoria.");
    }

    if (!usuario.fecha_nacimiento) {
        errores.push("La fecha de nacimiento es obligatoria.");
    }


    // -------------------------
    // CORREO
    // -------------------------

    const correoRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        usuario.correo.trim() &&
        !correoRegex.test(usuario.correo.trim())
    ) {
        errores.push("El correo electrónico no tiene un formato válido.");
    }


    // -------------------------
    // USUARIO
    // -------------------------

    if (
        usuario.usuario.trim() &&
        usuario.usuario.trim().length < 5
    ) {
        errores.push(
            "El nombre de usuario debe tener al menos 5 caracteres."
        );
    }


    // -------------------------
    // CONTRASEÑA
    // -------------------------

    if (
        usuario.password.trim() &&
        usuario.password.trim().length < 8
    ) {
        errores.push(
            "La contraseña debe tener al menos 8 caracteres."
        );
    }


    // -------------------------
    // FECHA DE NACIMIENTO
    // -------------------------

    if (usuario.fecha_nacimiento) {

        const fechaNacimiento =
            new Date(usuario.fecha_nacimiento + "T00:00:00");

        const hoy = new Date();

        hoy.setHours(0, 0, 0, 0);

        if (isNaN(fechaNacimiento.getTime())) {

            errores.push(
                "La fecha de nacimiento no es válida."
            );

        } else if (fechaNacimiento > hoy) {

            errores.push(
                "La fecha de nacimiento no puede ser futura."
            );
        }
    }


    // -------------------------
    // MOSTRAR ERRORES
    // -------------------------

    if (errores.length > 0) {

        alert(errores.join("\n"));

        return false;
    }

    return true;
}


// ======================================================
// REGISTRAR USUARIO
// ======================================================

function registrarUsuario() {

    // Evita que se envíe dos veces por doble clic
    if (registrando) {
        return;
    }


    const usuario = {

        nombre: document.getElementById("nombre").value.trim(),

        apellido_paterno:
            document.getElementById("apellido_paterno").value.trim(),

        apellido_materno:
            document.getElementById("apellido_materno").value.trim(),

        correo:
            document.getElementById("correo").value.trim(),

        usuario:
            document.getElementById("usuario").value.trim(),

        password:
            document.getElementById("password").value,

        fecha_nacimiento:
            document.getElementById("fecha_nacimiento").value
    };


    // -------------------------
    // VALIDACIONES
    // -------------------------

    if (!validacionUsuario(usuario)) {
        return;
    }


    // -------------------------
    // DUPLICADO DE CORREO
    // -------------------------

    const correoDuplicado = usuariosActuales.some(u =>

        u.correo &&
        u.correo.trim().toLowerCase() ===
        usuario.correo.trim().toLowerCase()

    );


    if (correoDuplicado) {

        alert(
            "El correo electrónico ya está registrado."
        );

        return;
    }


    // -------------------------
    // DUPLICADO DE USUARIO
    // -------------------------

    const usuarioDuplicado = usuariosActuales.some(u =>

        u.usuario &&
        u.usuario.trim().toLowerCase() ===
        usuario.usuario.trim().toLowerCase()

    );


    if (usuarioDuplicado) {

        alert(
            "El nombre de usuario ya está registrado."
        );

        return;
    }


    // ==================================================
    // ENVIAR AL BACKEND
    // ==================================================

    registrando = true;


    const boton =
        document.querySelector("#formRegistro button[type='submit']");


    // Desactivar botón
    if (boton) {

        boton.disabled = true;

        boton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm me-2"
                role="status">
            </span>
            Registrando...
        `;
    }


    fetch(API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(usuario)

    })
        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "No se pudo registrar el usuario."
                );
            }

            return response.json();
        })
        .then(data => {

            alert(
                "Usuario registrado correctamente."
            );


            // Limpiar formulario
            document
                .getElementById("formRegistro")
                .reset();


            // Actualizar lista local
            cargarUsuarios();
        })
        .catch(error => {

            console.error(error);

            alert(
                "No se pudo registrar el usuario."
            );
        })
        .finally(() => {

            registrando = false;


            // Restaurar botón
            if (boton) {

                boton.disabled = false;

                boton.innerHTML = `
                    <i class="bi bi-person-plus me-2"></i>
                    Registrar usuario
                `;
            }
        });
}


// ======================================================
// BUSCAR USUARIOS
// ======================================================

function buscarUsuarios() {

    if (buscando) {
        return;
    }


    const input =
        document.getElementById("texto");

    const resultados =
        document.getElementById("resultados");


    if (!input || !resultados) {
        return;
    }


    const texto =
        input.value.trim();


    // -------------------------
    // MÍNIMO 3 CARACTERES
    // -------------------------

    if (texto.length < 3) {

        alert(
            "La búsqueda debe tener al menos 3 caracteres."
        );

        return;
    }


    buscando = true;


    // -------------------------
    // MOSTRAR SPINNER
    // -------------------------

    resultados.innerHTML = `
        <div class="text-center py-5">

            <div
                class="spinner-border text-dark"
                role="status">

                <span class="visually-hidden">
                    Buscando...
                </span>

            </div>

            <p class="mt-3 text-muted">
                Buscando usuarios...
            </p>

        </div>
    `;


    // -------------------------
    // BUSCAR
    // -------------------------

    fetch(
        `${API}/buscar?texto=${encodeURIComponent(texto)}`
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "No se pudo realizar la búsqueda."
                );
            }

            return response.json();
        })

        .then(data => {

            mostrarUsuarios(data);
        })

        .catch(error => {

            console.error(error);

            resultados.innerHTML = `
                <div class="alert alert-danger text-center">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    No se pudo realizar la búsqueda.
                </div>
            `;
        })

        .finally(() => {

            buscando = false;
        });
}


// ======================================================
// MOSTRAR RESULTADOS
// ======================================================

function mostrarUsuarios(usuarios) {

    const resultados =
        document.getElementById("resultados");


    if (!resultados) {
        return;
    }


    // -------------------------
    // SIN RESULTADOS
    // -------------------------

    if (!usuarios || usuarios.length === 0) {

        resultados.innerHTML = `
            <div class="alert alert-secondary text-center">
                <i class="bi bi-person-x me-2"></i>
                No se encontraron usuarios.
            </div>
        `;

        return;
    }


    // -------------------------
    // CREAR RESULTADOS
    // -------------------------

    resultados.innerHTML = usuarios.map(usuario => `

        <div class="card border-0 shadow-sm mb-3">

            <div class="card-body">

                <div class="d-flex align-items-center mb-3">

                    <div class="me-3">
                        <i
                            class="bi bi-person-circle fs-1 text-dark">
                        </i>
                    </div>

                    <div>

                        <h5 class="mb-1">
                            ${usuario.nombre}
                            ${usuario.apellido_paterno}
                            ${usuario.apellido_materno || ""}
                        </h5>

                        <span class="text-muted">
                            @${usuario.usuario}
                        </span>

                    </div>

                </div>


                <div class="row g-2">

                    <div class="col-md-6">

                        <div class="text-muted small">
                            <i class="bi bi-envelope me-2"></i>
                            Correo
                        </div>

                        <div>
                            ${usuario.correo}
                        </div>

                    </div>


                    <div class="col-md-6">

                        <div class="text-muted small">
                            <i class="bi bi-calendar3 me-2"></i>
                            Fecha de nacimiento
                        </div>

                        <div>
                            ${usuario.fecha_nacimiento}
                        </div>

                    </div>

                </div>

            </div>

        </div>

    `).join("");
}


// ======================================================
// INICIALIZACIÓN
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // Cargar usuarios al abrir la página
    cargarUsuarios();


    // ==================================================
    // FORMULARIO DE REGISTRO
    // ==================================================

    const formRegistro =
        document.getElementById("formRegistro");


    if (formRegistro) {

        formRegistro.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                registrarUsuario();
            }
        );
    }


    // ==================================================
    // FORMULARIO DE BÚSQUEDA
    // ==================================================

    const formBuscar =
        document.getElementById("formBuscar");


    if (formBuscar) {

        formBuscar.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                buscarUsuarios();
            }
        );
    }

});

