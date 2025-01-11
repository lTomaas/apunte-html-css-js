const numBooks = 1000; // Número de libros a generar
const covers = [
  "./assets/portada-libro.jpg",
  "./assets/portada-libro2.jpg",
  "./assets/portada-libro3.jpg",
  "./assets/portada-libro4.jpg",
  "./assets/portada-libro5.jpg"
];

const books = [];

for (let i = 0; i < numBooks; i++) {
  books.push({
    title: `Libro ${i + 1}`,
    rating: Math.floor(Math.random() * 5) + 1, // Rating aleatorio entre 1 y 5
    cover: covers[i % covers.length] // Portadas de forma cíclica
  });
}

let currentPage = 1;
let booksPerPage = 0;

// Función para calcular el número de libros por página
function calculateBooksPerPage() {
  const galleryWidth = document.getElementById("gallery-container").offsetWidth;
  const bookWidth = 150 + 15; // Ancho mínimo del libro + gap
  const booksPerRow = Math.floor(galleryWidth / bookWidth);
  booksPerPage = booksPerRow * 8; // 3 filas visibles por página
}

// Función para renderizar los libros
function renderBooks() {
  calculateBooksPerPage();
  const totalPages = Math.ceil(books.length / booksPerPage);

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const galleryContainer = document.getElementById("gallery-container");
  galleryContainer.innerHTML = ""; // Limpiar la galería

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const booksToDisplay = books.slice(startIndex, endIndex);

  booksToDisplay.forEach((book) => {
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

    bookDiv.innerHTML = `
      <div class="cover" style="background-image: url('${book.cover}')"></div>
      <div class="content">
        <p>${book.title}</p>
        <p>RATING</p>
        <span class="rating">${starsHTML}</span>
        <button>Ver reseñas</button>
      </div>
    `;
    galleryContainer.appendChild(bookDiv);
  });

  updatePagination();
}

// Función para actualizar la paginación
function updatePagination() {
  const totalPages = Math.ceil(books.length / booksPerPage);
  const paginationNumbers = document.getElementById("pagination-numbers");
  paginationNumbers.innerHTML = "";

  const maxVisibleButtons = 5; // Número máximo de botones visibles
  let startPage = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1);
  let endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(endPage - maxVisibleButtons + 1, 1);
  }

  // Botón para la primera página si no está en el rango visible
  if (startPage > 1) {
    createPageButton(1);
    if (startPage > 2) {
      createEllipsis();
    }
  }

  // Crear botones del rango visible
  for (let i = startPage; i <= endPage; i++) {
    createPageButton(i);
  }

  // Botón para la última página si no está en el rango visible
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
  const totalPages = Math.ceil(books.length / booksPerPage);
  currentPage += direction;
  if (currentPage < 1) currentPage = 1;
  else if (currentPage > totalPages) currentPage = totalPages;
  renderBooks();
}

// Recalcular y renderizar al cambiar el tamaño de la ventana
window.addEventListener("resize", renderBooks);

// Inicializar la galería
renderBooks();
