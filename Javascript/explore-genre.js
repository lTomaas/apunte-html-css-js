const explorarButton = document.getElementById("explorarGenerosButton");
const dropdownGeneros = document.getElementById("dropdownGeneros");
const closeDropdownButton = document.getElementById("closeDropdown");
const generosList = document.getElementById("generosList");
const selectedGenre = document.getElementById("selectedGenre");
const botonTexto = document.getElementById('botonTexto');



explorarButton.addEventListener("click", () => {
    dropdownGeneros.style.display = "block";        
    dropdownGeneros.classList.add("tracking-in-contract");
});


closeDropdownButton.addEventListener("click", () => {
    dropdownGeneros.style.display = "none";
});


generosList.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        const generoSeleccionado = event.target.getAttribute("data-genero");
            
        console.log("Género seleccionado:", generoSeleccionado);
        botonTexto.textContent = generoSeleccionado;

        explorarButton.classList.add('rotate-scale-up-horizontal');

        setTimeout(() => {
            explorarButton.classList.remove('rotate-scale-up-horizontal');
        }, 400);

        dropdownGeneros.style.display = "none"; 
    }
});


dropdownGeneros.addEventListener("click", (event) => {
    if (event.target === dropdownGeneros) {
        dropdownGeneros.style.display = "none";
    }
});


