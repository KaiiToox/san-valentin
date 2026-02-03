/*
  Interacción principal
  1) Pantalla pregunta con botones Sí y No
  2) El botón No se mueve dentro del contenedor
  3) Primer click en No muestra “Piénsatelo bien…”
  4) Segundo click en No abre un link a un vídeo que pondrás después
  5) Click en Sí cambia a la pantalla de celebración
*/

const screenAsk = document.getElementById("screen-ask");
const screenYes = document.getElementById("screen-yes");

const playground = document.getElementById("playground");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const hint = document.getElementById("hint");

const btnRestart = document.getElementById("btn-restart");

// Pon aquí tu link cuando lo tengas
const VIDEO_URL = "https://youtu.be/bl_Jy7Q7l7s?list=RDbl_Jy7Q7l7s&t=20";

// Estado simple
let noClicks = 0;
let escapingInitialized = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function moveNoButton() {
  // Asegura que el botón NO está en modo absoluto dentro del contenedor
  if (!escapingInitialized) {
    btnNo.classList.add("is-escaping");
    escapingInitialized = true;
  }

  // Medimos límites reales dentro del contenedor
  const pgRect = playground.getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();

  const padding = 10;

  const maxLeft = Math.max(padding, Math.floor(pgRect.width - btnRect.width - padding));
  const maxTop = Math.max(padding, Math.floor(pgRect.height - btnRect.height - padding));

  // Si el contenedor es muy pequeño, ajustamos a lo que se pueda
  const left = clamp(getRandomInt(padding, maxLeft), padding, maxLeft);
  const top = clamp(getRandomInt(padding, maxTop), padding, maxTop);

  btnNo.style.left = `${left}px`;
  btnNo.style.top = `${top}px`;
}

function goToYesScreen() {
  screenAsk.classList.add("hidden");
  screenYes.classList.remove("hidden");
}

function goToAskScreen() {
  screenYes.classList.add("hidden");
  screenAsk.classList.remove("hidden");

  // Reset estado para poder repetir
  noClicks = 0;
  hint.textContent = "";
  escapingInitialized = false;

  // Reset estilo del botón NO
  btnNo.classList.remove("is-escaping");
  btnNo.style.left = "";
  btnNo.style.top = "";
}

// Click en Sí, cambia pantalla
btnYes.addEventListener("click", () => {
  goToYesScreen();
});

// Click en No, se mueve y dispara mensajes
btnNo.addEventListener("click", () => {
  noClicks += 1;

  // Se mueve en cada click
  moveNoButton();

  if (noClicks === 1) {
    hint.textContent = "Ah si? A ver ahora listilla…";
    return;
  }

  if (noClicks >= 2) {
    hint.textContent = "Vale, entonces mira esto…";

    // Abre el link en una pestaña nueva
    // Si el navegador bloquea el popup, cambia a window.location.href para abrir en la misma pestaña
    window.open(VIDEO_URL, "_blank", "noopener,noreferrer");
  }
});

// También lo movemos si intentan atraparlo con el ratón
btnNo.addEventListener("mouseenter", () => {
  if (noClicks > 0) moveNoButton();
});

// Reinicio desde la pantalla 2
btnRestart.addEventListener("click", () => {
  goToAskScreen();
});
