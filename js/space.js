const btnBuscar = document.getElementById("btnBuscar");
const inputBuscar = document.getElementById("inputBuscar");
const contenedor = document.getElementById("contenedor");

btnBuscar.addEventListener("click", buscarImagenes);
inputBuscar.addEventListener("keypress", e => {
  if (e.key === "Enter") buscarImagenes();
});

function buscarImagenes() {
  const query = inputBuscar.value.trim();
  if (!query) {
    alert("Por favor, ingresá un término de búsqueda 🚀");
    return;
  }

  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`;

  // Mostrar spinner mientras carga
  contenedor.innerHTML = `
    <div class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status" style="width: 4rem; height: 4rem;">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Error al obtener datos de la NASA 😅");
      return res.json();
    })
    .then(data => {
      const items = data.collection?.items || [];
      mostrarResultados(items);
    })
    .catch(error => {
      console.error("Hubo un problema con la solicitud:", error);
      contenedor.innerHTML = `
        <p class="text-center text-danger mt-4">
          Ocurrió un error al obtener los datos 😔<br>
          <small>${error.message}</small>
        </p>
      `;
    });
}

function mostrarResultados(items) {
  contenedor.innerHTML = ""; // limpiar el spinner o mensajes previos

  if (items.length === 0) {
    contenedor.innerHTML = `
      <p class="text-center mt-4">No se encontraron resultados con ese término 🪐</p>
    `;
    return;
  }

  const fila = document.createElement("div");
  fila.classList.add("row", "row-cols-1", "row-cols-md-3", "g-4");

  items.forEach(item => {
    // Desestructuración segura
    const { title, description, date_created } = item.data?.[0] || {};
    const image = item.links?.[0]?.href || "https://via.placeholder.com/400x300?text=Sin+imagen";

    const card = document.createElement("div");
    card.classList.add("col");
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${image}" class="card-img-top" alt="${title || "Imagen sin título"}">
        <div class="card-body">
          <h5 class="card-title">${title || "Sin título"}</h5>
          <p class="card-text">
            ${description ? description.slice(0, 180) + "..." : "Sin descripción disponible."}
          </p>
        </div>
        <div class="card-footer text-muted small">
          ${date_created ? new Date(date_created).toLocaleDateString() : ""}
        </div>
      </div>
    `;
    fila.appendChild(card);
  });

  contenedor.appendChild(fila);
}
