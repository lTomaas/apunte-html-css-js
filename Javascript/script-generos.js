const imagenesPorGenero = {
    "Aventura": "url('./assets/generos/aventura2.gif')",
    "Romance": "url('./assets/generos/romance2.gif')",
    "Misterio": "url('./assets/generos/misterio.gif')",
    "Fantasía": "url('./assets/generos/fantasia3.gif')",
    "Drama": "url('./assets/generos/drama.gif')",
    "Ciencia ficción": "url('./assets/generos/ciencia-ficcion.gif')",
    "Terror": "url('./assets/generos/terror.gif')",
    "Comedia": "url('./assets/generos/comedia.gif')",
    "Todos los generos": "url('./assets/generos/todos.gif')",
};

// Seleccionar todos los ítems de la lista
const generosItems = document.querySelectorAll('#generosList li');

generosItems.forEach((item, index) => {
    const genero = item.getAttribute('data-genero');
    if (imagenesPorGenero[genero]) {
        item.style.backgroundImage = imagenesPorGenero[genero];
    }
});