// Referencias a los elementos del DOM
const pokemonInput = document.getElementById("poke-input");
const searchButton = document.getElementById("search-btn");
const randomButton = document.getElementById("random-btn");
const loadingIndicator = document.getElementById("loading");
const errorMessage = document.getElementById("error-msg");
const pokemonCard = document.getElementById("poke-card");
const pokemonName = document.getElementById("poke-name");
const pokemonId = document.getElementById("poke-id");
const pokemonImage = document.getElementById("poke-img");
const pokemonTypes = document.getElementById("poke-types");
const attackStat = document.getElementById("stat-attack");
const defenseStat = document.getElementById("stat-defense");
const speedStat = document.getElementById("stat-speed");

// Elementos de Seguridad del Área Privada (Módulo 3)
const trainerPin = document.getElementById("trainer-pin");
const loginButton = document.getElementById("login-btn");
const loginForm = document.getElementById("login-form");
const secureContent = document.getElementById("secure-content");
const secureFavoriteDisplay = document.getElementById("secure-fav-display");
const addFavoriteButton = document.getElementById("add-fav-btn");
const logoutButton = document.getElementById("logout-btn");
const offlineBadge = document.getElementById("offline-badge");

let currentPokemon = null;
let activePin = null;

// ERROR CRÍTICO 1: Sanitización incompatible con números
function sanitizeInput(input) {
    // Pista: ¿Qué pasa cuando 'input' es un número generado por el botón Aleatorio?
    const characterMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
    };
    return input.replace(/[&<>"'/]/g, (match) => characterMap[match]);
}

function encryptData(plainText, pin) {
    const payload = `${pin}_${plainText}`;
    return btoa(encodeURIComponent(payload));
}

function decryptData(cipherText, pin) {
    try {
        const decodedPayload = decodeURIComponent(atob(cipherText));
        const [savedPin, originalPokemon] = decodedPayload.split("_");
        return savedPin === pin ? originalPokemon : null;
    } catch (error) {
        return null;
    }
}

// Operación de Red Asíncrona
async function fetchPokemon(query) {
    loadingIndicator.style.display = "block";
    errorMessage.textContent = "";
    pokemonCard.style.display = "none";

    const safeQuery = sanitizeInput(query).trim().toLowerCase();

    if (!safeQuery) {
        errorMessage.textContent = "Por favor ingresa un nombre o ID válido.";
        loadingIndicator.style.display = "none";
        return;
    }

    // ERROR CRÍTICO 2: Protocolo inseguro (Mixed Content)
    // Pista: Los navegadores modernos bloquean peticiones HTTP desde sitios seguros HTTPS
    const secureUrl = `http://pokeapi.co/api/v2/pokemon/${safeQuery}`;

    try {
        const response = await fetch(secureUrl);

        if (!response.ok) {
            throw new Error("El Pokémon solicitado no existe.");
        }

        const data = await response.json();
        currentPokemon = data.name.toUpperCase();
        renderCard(data);
    } catch (error) {
        console.error("Fallo en la capa de red o parseo de datos:", error);
        errorMessage.textContent = error.message;
    } finally {
        loadingIndicator.style.display = "none";
    }
}

// Renderizado de Datos
function renderCard(data) {
    pokemonName.textContent = data.name;
    pokemonId.textContent = `N° ${data.id}`;
    pokemonImage.src =
        data.sprites.front_default || "https://via.placeholder.com/130";

    pokemonTypes.innerHTML = "";
    data.types.forEach((typeInfo) => {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = typeInfo.type.name;
        pokemonTypes.appendChild(badge);
    });

    // ERROR CRÍTICO 3: Acceso incorrecto a propiedades del JSON
    // Pista: Revisa la estructura real de la PokeAPI para "stats". ¿Es un objeto directo o un arreglo?
    attackStat.textContent = data.stats.base_stat;
    defenseStat.textContent = data.stats.base_stat;
    speedStat.textContent = data.stats.base_stat;

    pokemonCard.style.display = "block";
}

// Escuchadores de Eventos (UI)
searchButton.addEventListener("click", () => fetchPokemon(pokemonInput.value));
randomButton.addEventListener("click", () => {
    const randomId = Math.floor(Math.random() * 151) + 1;
    fetchPokemon(randomId);
});