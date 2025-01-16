const textarea = document.querySelector(".input-comentario");
const contador = document.querySelector(".contador-caracteres");
const comentariosContenedor = document.querySelector(".contenedor-comentarios");
const enviarButton = document.querySelector("button[type='button']");
const maxLength = 300;
const bearerToken = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhIiwiaWF0IjoxNzM3MDUzMTQzLCJleHAiOjE3MzcwNTQ5NDN9.BcGvWMH_i1Mj6h2-HRbSMbn4SCft1n8VtOb3rCzle209bMIHaJCzp6135htqapij";



document.addEventListener("DOMContentLoaded", async () => {

    // Obtener el libro desde localStorage
    const bookData = JSON.parse(localStorage.getItem("selectedBook"));

    if (bookData) {
        // Actualizar información del libro
        document.querySelector(".imagen-libro img").src = bookData.image;
        document.querySelector(".informacion-principal").innerHTML = `
            <h1>${bookData.title}</h1>
            <p>${bookData.description}</p>
        `;
        document.querySelector(".informacion-libro").innerHTML = `
            Autor: ${bookData.author}<br>
            Género: ${bookData.genre}<br>
            Fecha de lanzamiento: ${bookData.releaseDate}<br>
            Editorial: ${bookData.publisher}<br>
        `;

        // Actualizar estrellas de rating
        const fullStars = Math.floor(bookData.rating);
        const halfStar = bookData.rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        const estrellasDiv = document.querySelector(".estrellas");
        estrellasDiv.innerHTML = "";

        for (let i = 0; i < fullStars; i++) {
            estrellasDiv.innerHTML += `<img src="./assets/icono-estrella.png" alt="Estrella llena">`;
        }
        if (halfStar) {
            estrellasDiv.innerHTML += `<img src="./assets/icono-estrella-mitad.png" alt="Media estrella">`;
        }
        for (let i = 0; i < emptyStars; i++) {
            estrellasDiv.innerHTML += `<img src="./assets/icono-estrella-vacia.png" alt="Estrella vacía">`;
        }

        // Cargar y mostrar comentarios
        await cargarComentarios(bookData.id);
    } else {
        console.error("No se encontraron datos del libro.");
    }



    // Actualiza el contador de caracteres cada vez que se escribe
    textarea.addEventListener("input", () => {
        const caracteresActuales = textarea.value.length;
        contador.textContent = `${caracteresActuales}/${maxLength} caracteres`;

        // Cambia el color del contador si queda poco espacio
        if (caracteresActuales > maxLength * 0.8) {
            contador.style.color = "red"; // Advertencia cuando supera el 80% del límite
        } else {
            contador.style.color = "white"; // Color normal
        }
    });

    // Manejo del envío de comentario
    enviarButton.addEventListener("click", async () => {
        const comentarioTexto = textarea.value.trim();

        // Validar que el comentario no esté vacío
        if (!comentarioTexto) {
            alert("El comentario no puede estar vacío.");
            return;
        }

        try {
            // Realizar el POST a la API
            const response = await fetch(`http://127.0.0.1:8080/api/comment?bookId=${bookData.id}&text=${encodeURIComponent(comentarioTexto)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${bearerToken}` // Agregar el token aquí
                },
            });

            if (!response.ok) {
                throw new Error("Error al enviar el comentario.");
            }

            // Limpiar el textarea y contador
            textarea.value = "";
            contador.textContent = `0/${maxLength} caracteres`;

            // Recargar los comentarios
            await cargarComentarios(bookData.id);
        } catch (error) {
            console.error(error);
            alert("Hubo un problema al enviar el comentario.");
        }
    });

    // Función para cargar los comentarios desde la API
    async function cargarComentarios(bookId) {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/comment/${bookId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${bearerToken}`
                },
            });

            if (!response.ok) {
                throw new Error("Error al cargar los comentarios.");
            }

            const comentarios = await response.json();
            comentariosContenedor.innerHTML = ""; // Limpiar comentarios existentes

            if (Array.isArray(comentarios) && comentarios.length > 0) {
                comentarios.forEach(comment => {
                    comentariosContenedor.innerHTML += `
                        <div class="comentario">
                            <strong>${comment.username || "Usuario"}:</strong> ${comment.text}
                        </div>
                    `;
                });
            } else {
                comentariosContenedor.innerHTML = `
                    <div class="comentario" style="text-align: center;">
                        Aún no hay comentarios.
                    </div>
                `;
            }
        } catch (error) {
            console.error(error);
            alert("Hubo un problema al cargar los comentarios.");
        }
    }
});
