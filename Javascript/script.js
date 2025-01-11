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

// Función para calcular el número de libros por página según el ancho del contenedor
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

  // Obtener libros de la API para la página actual
  const booksToDisplay = await fetchBooks(currentPage - 1, booksPerPage);

  booksToDisplay.forEach((book, index) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= book.rating) {
        starsHTML += `<img src="./assets/icono-estrella.png" alt="Estrella llena">`;
      } else {
        starsHTML += `<img src="./assets/icono-estrella-vacia.png" alt="Estrella vacía">`;
      }
    }

    // Usar imagen del backend o una portada predeterminada
    const coverImage = covers[index % covers.length];

    bookDiv.innerHTML = `
      <div class="cover" style="background-image: url('${coverImage}')"></div>
      <div class="content">
        <p>RATING</p>
        <span class="rating">${starsHTML}</span>
        <button>Ver reseñas</button>
      </div>
    `;
    galleryContainer.appendChild(bookDiv);
  });

  updatePagination();
}

// Función para obtener los libros de la API
async function fetchBooks(page, size) {
  try {
    const response = await fetch(`http://localhost:8080/api/book/all?page=${page}&size=${size}`);
    const data = await response.json();
    totalBooks = data.totalElements;
    return data.content;
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

// Recalcular y renderizar al cambiar el tamaño de la ventana
window.addEventListener("resize", renderBooks);

// Inicializar la galería
renderBooks();