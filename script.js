document.addEventListener("DOMContentLoaded", () => {
    const agregarBtn = document.getElementById("agregar");
    const listaDatos = document.getElementById("lista-datos");
    const eliminarSeleccionadosBtn = document.getElementById("eliminar-seleccionados");
    const boteBasuraBtn = document.getElementById("bote-basura");
    const guardarBtn = document.getElementById("bote-guardar");
    const archivoImportar = document.getElementById("archivo-importar");
    let seleccionando = false;

    cargarDatos();
    establecerFechaHoraActual();

    document.getElementById("kw").addEventListener("input", function (e) {
        this.value = this.value.replace(/[^0-9]/g, ''); // Solo permite números
    });

    document.getElementById('eliminar-todo').addEventListener('click', function() {
        const confirmDelete = confirm("¿Estás seguro de que quieres eliminar todos los registros?");
        if (confirmDelete) {
            document.getElementById('lista-datos').innerHTML = ''; 
            localStorage.removeItem('datos'); 
        }
    });
    
    agregarBtn.addEventListener("click", agregarDato);
    boteBasuraBtn.addEventListener("click", toggleSeleccionar);
    eliminarSeleccionadosBtn.addEventListener("click", eliminarSeleccionados);
    guardarBtn.addEventListener("click", guardarDatos);
    archivoImportar.addEventListener("change", importarDatos);

    function toggleSeleccionar() {
        seleccionando = !seleccionando;
        const checkboxes = document.querySelectorAll(".checkbox");
        checkboxes.forEach(checkbox => {
            checkbox.style.display = seleccionando ? 'inline-block' : 'none';
        });
        eliminarSeleccionadosBtn.style.display = seleccionando ? 'block' : 'none';
    }

    function agregarDato() {
        const kw = document.getElementById("kw").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;
        const comentario = document.getElementById("comentario").value || 'Sin comentario';

        if (kw && fecha && hora) {
            const dato = { kw, fecha, hora, comentario };
            guardarDato(dato);
            agregarDatoALista(dato);
            limpiarCampos();
        } else {
            alert("Por favor, completa todos los campos obligatorios.");
        }
    }

    function eliminarSeleccionados() {
        const checkboxes = document.querySelectorAll(".checkbox");
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar los datos seleccionados?");

        if (confirmDelete) {
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    const li = checkbox.parentElement;
                    eliminarDato(li.dataset);
                    listaDatos.removeChild(li);
                }
            });
            toggleSeleccionar();
        }
    }

    function guardarDato(dato) {
        const datos = JSON.parse(localStorage.getItem("datos")) || [];
        datos.push(dato);
        localStorage.setItem("datos", JSON.stringify(datos));
    }

    function cargarDatos() {
        const datos = JSON.parse(localStorage.getItem("datos")) || [];
        datos.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));
        datos.forEach(dato => agregarDatoALista(dato));
    }

    function agregarDatoALista(dato) {
        const li = document.createElement("li");
        li.dataset.kw = dato.kw;
        li.dataset.fecha = dato.fecha;
        li.dataset.hora = dato.hora;
        li.dataset.comentario = dato.comentario;
    
        const fechaTexto = new Date(`${dato.fecha}T00:00:00`).toLocaleDateString('es-ES');
    
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkbox.style.display = 'none';
        li.appendChild(checkbox);
    
        li.appendChild(document.createTextNode(`kW: ${dato.kw}, Fecha: ${fechaTexto}, Hora: ${dato.hora}, Comentario: ${dato.comentario}`));
        listaDatos.appendChild(li);
        ordenarLista();
    }

    function eliminarDato(dato) {
        const datos = JSON.parse(localStorage.getItem("datos")) || [];
        const updatedDatos = datos.filter(d => !(d.kw === dato.kw && d.fecha === dato.fecha && d.hora === dato.hora && d.comentario === dato.comentario));
        localStorage.setItem("datos", JSON.stringify(updatedDatos));
    }

    function limpiarCampos() {
        document.getElementById("kw").value = '';
        establecerFechaHoraActual();
        document.getElementById("comentario").value = '';
    }

    function establecerFechaHoraActual() {
        const fechaInput = document.getElementById("fecha");
        const horaInput = document.getElementById("hora");
        const ahora = new Date();

        const dia = String(ahora.getDate()).padStart(2, '0');
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const anio = ahora.getFullYear();
        fechaInput.value = `${anio}-${mes}-${dia}`;

        horaInput.value = String(ahora.getHours()).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0');
    }

    function ordenarLista() {
        const items = Array.from(listaDatos.getElementsByTagName("li"));
        items.sort((a, b) => {
            const fechaA = a.dataset.fecha;
            const horaA = a.dataset.hora;
            const fechaB = b.dataset.fecha;
            const horaB = b.dataset.hora;
            return new Date(`${fechaA}T${horaA}`) - new Date(`${fechaB}T${horaB}`);
        });
        listaDatos.innerHTML = "";
        items.forEach(item => listaDatos.appendChild(item));
    }

    function guardarDatos() {
        const datos = JSON.parse(localStorage.getItem("datos")) || [];
        if (datos.length === 0) {
            alert("No hay datos para guardar.");
            return;
        }

        const csvContent = "data:text/csv;charset=utf-8," 
            + ["kW", "Fecha", "Hora", "Comentario"].join(",") + "\n" 
            + datos.map(e => `${e.kw},${e.fecha},${e.hora},${e.comentario}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "datos.csv");
        document.body.appendChild(link); // requerido para Firefox
        link.click();
        document.body.removeChild(link);
    }

    function importarDatos(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const contenido = e.target.result;
                const lineas = contenido.split("\n").slice(1); // Saltar el encabezado
                lineas.forEach(linea => {
                    const datos = linea.split(",");
                    if (datos.length === 4) {
                        const dato = {
                            kw: datos[0].trim(),
                            fecha: datos[1].trim(),
                            hora: datos[2].trim(),
                            comentario: datos[3].trim() || 'Sin comentario' // Comentario opcional
                        };
                        guardarDato(dato);
                        agregarDatoALista(dato);
                    }
                });
            };
            reader.readAsText(file);
        }
    }
});
