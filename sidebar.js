// Código para manejar la sidebar
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const toggleLabel = document.getElementById("toggle-menu");
    const mainContent = document.querySelector('.main-content');

    // Lógica para abrir y cerrar el menú
    toggleLabel.addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que el clic en el botón cierre la sidebar
        toggleSidebar();
    });

    // Cerrar la sidebar si se hace clic fuera de ella
    document.addEventListener('click', () => {
        if (sidebar.classList.contains('visible')) {
            closeSidebar();
        }
    });

    sidebar.addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que el clic dentro de la sidebar la cierre
    });

    function toggleSidebar() {
        sidebar.classList.toggle('visible'); // Alternar la visibilidad de la barra lateral
        mainContent.classList.toggle('open', sidebar.classList.contains('visible')); // Remover o agregar clase de desenfoque
    }

    function closeSidebar() {
        sidebar.classList.remove('visible'); // Ocultar el menú
        mainContent.classList.remove('open'); // Remover la clase que desenfoca el contenido
    }
});
