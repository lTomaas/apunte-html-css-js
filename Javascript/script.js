const numBooks = 30; // Número de libros a generar
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
  booksPerPage = booksPerRow * 5; // 3 filas visibles por página (puedes ajustarlo)
}

// Función para renderizar los libros
function renderBooks() {
  calculateBooksPerPage();
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
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

// Función para cambiar de página
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