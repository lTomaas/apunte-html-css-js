const books = [
  { title: "Libro 1", rating: 3, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 2", rating: 4, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 3", rating: 5, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 4", rating: 2, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 5", rating: 1, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 6", rating: 4, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 7", rating: 5, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 8", rating: 3, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 9", rating: 2, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 10", rating: 4, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 11", rating: 4, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 12", rating: 1, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 13", rating: 2, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 14", rating: 3, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 15", rating: 4, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 16", rating: 4, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 17", rating: 1, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 18", rating: 5, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 19", rating: 5, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 20", rating: 3, cover: "./assets/portada-libro.jpg" },
  { title: "Libro 21", rating: 5, cover: "./assets/portada-libro.jpg" },
];

let currentPage = 1;

function calculateBooksPerPage() {
  const screenWidth = window.innerWidth;

  if(screenWidth >= 2560){
    return 14
  }

  if(screenWidth >= 1500){
    return 17
  }

  if (screenWidth >= 1440) {
    return 15; // En pantallas grandes, mostrar 6 libros por página
  }else if (screenWidth >= 1150) {
    return 18; // En pantallas grandes, mostrar 6 libros por página
  }else if (screenWidth >= 860) {
      return 15; // En pantallas grandes, mostrar 6 libros por página
  }else if (screenWidth >= 770) {
      return 8; // En pantallas grandes, mostrar 6 libros por página
  } else if (screenWidth >= 710) {
    return 10; // En pantallas medianas, mostrar 4 libros por página
  }else if (screenWidth >= 570) {
    return 8
  } else if (screenWidth >= 440) {
    return 6
  } else {
    return 4; // En pantallas pequeñas, mostrar 2 libros por página
  }
}

function renderBooks() {
  const galleryContainer = document.getElementById("gallery-container");
  galleryContainer.innerHTML = ""; // Limpiar la galería

  const booksPerPage = calculateBooksPerPage(); // Calcular los libros por página
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const booksToDisplay = books.slice(startIndex, endIndex);

  booksToDisplay.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    // Generar las estrellas de rating
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

  updatePagination(booksPerPage);
}

function updatePagination(booksPerPage) {
  const totalPages = Math.ceil(books.length / booksPerPage);
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

function changePage(direction) {
  const booksPerPage = calculateBooksPerPage(); // Calcular los libros por página
  const totalPages = Math.ceil(books.length / booksPerPage);
  currentPage += direction;

  // Asegurar que no se excedan los límites
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  renderBooks();
}

// Detectar cambios de tamaño de la ventana
window.addEventListener("resize", renderBooks);

// Inicializar la galería
renderBooks();


