document.addEventListener("DOMContentLoaded", function () {
    const themeLink = document.getElementById("theme-style");
    const themeToggle = document.getElementById("toggle-theme");

    // Cargar el tema guardado al iniciar
    cargarTema();

    // Cambiar el tema al hacer clic
    themeToggle.addEventListener("click", () => {
        if (themeLink.getAttribute("href") === "light-mode.css") {
            themeLink.setAttribute("href", "dark-mode.css");
            themeToggle.textContent = "🌙";  // Cambia el ícono a luna en modo oscuro
            guardarTema("dark-mode.css");     // Guarda la elección
        } else {
            themeLink.setAttribute("href", "light-mode.css");
            themeToggle.textContent = "☀️";  // Cambia el ícono a sol en modo claro
            guardarTema("light-mode.css");    // Guarda la elección
        }
    });

    // Función para guardar el tema en el almacenamiento local
    function guardarTema(tema) {
        localStorage.setItem("tema", tema);
    }

    // Función para cargar el tema guardado
    function cargarTema() {
        const temaGuardado = localStorage.getItem("tema");
        if (temaGuardado) {
            themeLink.setAttribute("href", temaGuardado);
            themeToggle.textContent = temaGuardado === "dark-mode.css" ? "🌙" : "☀️"; // Cambia el ícono según el tema
        }
    }
});
