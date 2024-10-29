document.addEventListener("DOMContentLoaded", function () {
    const themeLink = document.getElementById("theme-style");
    const themeToggle = document.getElementById("toggle-theme");

    themeToggle.addEventListener("click", () => {
        if (themeLink.getAttribute("href") === "light-mode.css") {
            themeLink.setAttribute("href", "dark-mode.css");
            themeToggle.textContent = "🌙";  // Cambia el ícono a luna en modo oscuro
        } else {
            themeLink.setAttribute("href", "light-mode.css");
            themeToggle.textContent = "☀️";  // Cambia el ícono a sol en modo claro
        }
    });
});
