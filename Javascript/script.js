const explorarButton = document.getElementById("explorarGenerosButton");
const dropdownGeneros = document.getElementById("dropdownGeneros");
const closeDropdownButton = document.getElementById("closeDropdown");
const generosList = document.getElementById("generosList");
const selectedGenre = document.getElementById("selectedGenre");
const botonTexto = document.getElementById('botonTexto');

const covers = [
  "./assets/portada-libro.jpg",
  "./assets/portada-libro2.jpg",
  "./assets/portada-libro3.jpg",
  "./assets/portada-libro4.jpg",
  "./assets/portada-libro5.jpg"
];

let currentPage = 1;
let booksPerPage = 12;
let totalBooks = 0;
let selectedGenreValue = "";  // Variable para almacenar el género seleccionado

// Mostrar el dropdown de géneros
explorarButton.addEventListener("click", () => {
  dropdownGeneros.style.display = "block";
  dropdownGeneros.classList.add("tracking-in-contract");
});

// Cerrar el dropdown de géneros
closeDropdownButton.addEventListener("click", () => {
  dropdownGeneros.style.display = "none";
});

// Seleccionar un género y actualizar el botón
generosList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const generoSeleccionado = event.target.getAttribute("data-genero");

    console.log("Género seleccionado:", generoSeleccionado);
    botonTexto.textContent = generoSeleccionado;
    selectedGenreValue = generoSeleccionado;

    if(generoSeleccionado == "Todos los generos"){
      selectedGenreValue = ""
    }

    console.log(selectedGenreValue)

    explorarButton.classList.add('rotate-scale-up-horizontal');
    setTimeout(() => {
      explorarButton.classList.remove('rotate-scale-up-horizontal');
    }, 400);

    dropdownGeneros.style.display = "none";
    currentPage = 1;
    renderBooks();  // Volver a renderizar los libros con el género seleccionado
  }
});

// Cerrar el dropdown cuando se hace clic fuera
dropdownGeneros.addEventListener("click", (event) => {
  
    dropdownGeneros.style.display = "none";
  
});

// Calcular cuántos libros caben por página
function calculateBooksPerPage() {
  const galleryWidth = document.getElementById("gallery-container").offsetWidth;
  const bookWidth = 150 + 15; // Ancho del libro más el gap entre libros
  const booksPerRow = Math.floor(galleryWidth / bookWidth);
  booksPerPage = booksPerRow * 3; // 3 filas visibles por página
}

// Función para renderizar los libros
async function renderBooks() {
  calculateBooksPerPage();
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }

  const galleryContainer = document.getElementById("gallery-container");
  galleryContainer.innerHTML = ""; // Limpiar la galería

  try {
    // Obtener libros de la API para la página actual
    const booksToDisplay = await fetchBooks(currentPage - 1, booksPerPage);

    if (Array.isArray(booksToDisplay) && booksToDisplay.length > 0) {
      booksToDisplay.forEach((book, index) => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        bookDiv.setAttribute("data-id", book.id); // Asignar el ID del libro como data-id
        bookDiv.setAttribute("data-title", book.title); // Asignar el ID del libro como data-id
        bookDiv.setAttribute("data-description", book.description); // Asignar el ID del libro como data-id
        bookDiv.setAttribute("data-genre", book.genres); // Asignar el ID del libro como data-id
        bookDiv.setAttribute("data-release", book.publication_date); // Asignar el ID del libro como data-id
        bookDiv.setAttribute("data-editorial", book.editorial);
        bookDiv.setAttribute("data-author", book.author_name);

        bookDiv.setAttribute("data-comments", JSON.stringify(book.comments.slice().reverse())); // Convertir el array a string JSON


        let averageRating = 0;
        if (book.votes.length !== 0){
          const totalRating = book.votes.reduce((acc, vote) => acc + vote.rating, 0);
          averageRating = totalRating / book.votes.length;
        }

        bookDiv.setAttribute("data-rating", averageRating);



        // Generar HTML de estrellas
        const starsHTML = generateStarsHTML(book.votes);
        
        // Usar imagen del backend o una portada predeterminada
        const coverImage = covers[index % covers.length];

        bookDiv.setAttribute("data-img", coverImage); // Asignar el ID del libro como data-id


        bookDiv.innerHTML = `
          <div class="cover" style="background-image: url('${coverImage}')"></div>
          <div class="content">
            <p>RATING</p>
            <span class="rating">${starsHTML}</span>
            <button class="review-btn" onclick="verReseñas(event)">Ver reseñas</button>
          </div>
        `;
        galleryContainer.appendChild(bookDiv);
      });

      // Añadir eventos a los botones de reseñas
    } else {
      console.error("No se obtuvieron libros válidos o la respuesta no es un arreglo.");
    }
  } catch (error) {
    console.error("Error al obtener los libros:", error);
  }

  updatePagination();
}

// Función para generar estrellas según el promedio de votos
function generateStarsHTML(votes) {
  let starsHTML = "";

  let averageRating = 0;
  if (votes.length !== 0){
    const totalRating = votes.reduce((acc, vote) => acc + vote.rating, 0);
    averageRating = totalRating / votes.length;
    console.log(totalRating);
  }


  const fullStars = Math.floor(averageRating); // Estrellas llenas
  const halfStar = averageRating % 1 >= 0.5 ? 1 : 0; // Estrella a la mitad (si el resto es >= 0.5)
  const emptyStars = 5 - fullStars - halfStar; // Estrellas vacías restantes

  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<img src="./assets/icono-estrella.png" alt="Estrella llena">`;
  }
  if (halfStar) {
    starsHTML += `<img src="./assets/icono-estrella-mitad.png" alt="Media estrella">`;
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<img src="./assets/icono-estrella-vacia.png" alt="Estrella vacía">`;
  }

  return starsHTML;
}

function verReseñas(event) {
  const bookElement = event.target.closest(".book");
  const bookId = bookElement.getAttribute("data-id");
  const bookTitle = bookElement.getAttribute("data-title");
  const bookDescription = bookElement.getAttribute("data-description");
  const bookImage = bookElement.getAttribute("data-img");
  const bookGenre = bookElement.getAttribute("data-genre");
  const bookDate = bookElement.getAttribute("data-release");
  const bookRating = bookElement.getAttribute("data-rating");
  const bookEditorial = bookElement.getAttribute("data-editorial");
  const bookAuthor = bookElement.getAttribute("data-author");

  const bookComments = JSON.parse(bookElement.getAttribute("data-comments")); 

  
  // Supongamos que tienes los datos del libro almacenados en un objeto
  const bookData = {
    id: bookId,
    title: bookTitle,
    description: bookDescription,
    image: bookImage,
    author: bookAuthor,
    genre: bookGenre,
    releaseDate: bookDate,
    publisher: bookEditorial,
    rating: bookRating,
    comments: bookComments,
  };

  // Guarda los datos en localStorage
  localStorage.setItem("selectedBook", JSON.stringify(bookData));

  // Redirige a la página de reseñas
  window.location.href = "review.html";
}


// Función para obtener los libros de la API
async function fetchBooks(page, size) {
  try {
    const searchText = searchInput.value.trim();
    const response = await fetch(`http://localhost:8080/api/book/by-genre?genre=${selectedGenreValue}&title=${searchText}&page=${page}&size=${size}`);
    const data = await response.json();
    
    if (data && Array.isArray(data.content)) {
      totalBooks = data.totalElements;
      return data.content;
    } else {
      console.error("La respuesta de la API no tiene el formato esperado:", data);
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    return [];
  }
}


// Función para actualizar la paginación
function updatePagination() {
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  const paginationNumbers = document.getElementById("pagination-numbers");
  paginationNumbers.innerHTML = "";

  const maxVisibleButtons = 5;
  let startPage = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1);
  let endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(endPage - maxVisibleButtons + 1, 1);
  }

  if (startPage > 1) {
    createPageButton(1);
    if (startPage > 2) {
      createEllipsis();
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    createPageButton(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      createEllipsis();
    }
    createPageButton(totalPages);
  }
}

// Función para crear un botón de página
function createPageButton(page) {
  const button = document.createElement("button");
  button.classList.add("page-button");
  button.textContent = page;
  button.onclick = () => goToPage(page);
  if (page === currentPage) {
    button.classList.add("active");
  }
  document.getElementById("pagination-numbers").appendChild(button);
}

// Función para crear puntos suspensivos (...)
function createEllipsis() {
  const ellipsis = document.createElement("span");
  ellipsis.classList.add("ellipsis");
  ellipsis.textContent = "...";
  document.getElementById("pagination-numbers").appendChild(ellipsis);
}

// Función para cambiar de página
function goToPage(page) {
  currentPage = page;
  renderBooks();
}

// Función para cambiar de página en una dirección
function changePage(direction) {
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  currentPage += direction;
  if (currentPage < 1) currentPage = 1;
  else if (currentPage > totalPages) currentPage = totalPages;
  renderBooks();
}

searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.trim();
  console.log("Texto de búsqueda:", searchText);
  fetchBooks(0, booksPerPage, searchText).then(() => renderBooks());
});

window.addEventListener("resize", renderBooks);

// Inicializar la galería
renderBooks();
