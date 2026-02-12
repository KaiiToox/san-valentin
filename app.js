const screenAsk = document.getElementById("screen-ask");
const screenYes = document.getElementById("screen-yes");

const playground = document.getElementById("playground");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const hint = document.getElementById("hint");

const confettiContainer = document.getElementById("confetti-container");

const VIDEO_URL = "https://youtu.be/bl_Jy7Q7l7s?list=RDbl_Jy7Q7l7s&t=20";

let noClicks = 0;
let teleportEnabled = false;
let initialized = false;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ensureAbsolute() {
  if (initialized) return;
  btnNo.classList.add("is-escaping");
  initialized = true;
  btnNo.getBoundingClientRect();
}

function teleportButton() {
  if (!teleportEnabled) return;

  ensureAbsolute();

  const pg = playground.getBoundingClientRect();
  const btn = btnNo.getBoundingClientRect();
  const pad = 10;

  const maxLeft = Math.floor(pg.width - btn.width - pad);
  const maxTop = Math.floor(pg.height - btn.height - pad);

  const left = clamp(randInt(pad, maxLeft), pad, maxLeft);
  const top = clamp(randInt(pad, maxTop), pad, maxTop);

  btnNo.style.left = `${left}px`;
  btnNo.style.top = `${top}px`;
}

function goToYesScreen() {
  screenAsk.classList.add("hidden");
  screenYes.classList.remove("hidden");

  screenYes.classList.remove("panel-enter");
  void screenYes.offsetWidth;
  screenYes.classList.add("panel-enter");
}

function launchConfetti() {
  if (!confettiContainer) return;

  // Opcional: limpia confeti anterior para que no se acumule
  confettiContainer.textContent = "";

  const colors = ["#ff4d8d", "#ff9ac2", "#ffffff", "#fbbf24"];
  const w = window.innerWidth;
  const h = window.innerHeight;

  const centerX = w / 2;
  const centerY = h / 2;

  // 1) Corazón gigante en el centro
  const big = document.createElement("div");
  big.className = "confetti big-heart";
  big.textContent = "❤";
  big.style.color = colors[Math.floor(Math.random() * colors.length)];
  confettiContainer.appendChild(big);
  setTimeout(() => big.remove(), 900);

  // 2) Explosión radial
  const burstCount = 220;

  for (let i = 0; i < burstCount; i++) {
    const heart = document.createElement("div");
    heart.className = "confetti";
    heart.textContent = "❤";

    heart.style.left = `${centerX}px`;
    heart.style.top = `${centerY}px`;

    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    heart.style.fontSize = `${Math.random() * 18 + 12}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 420 + 120;

    heart.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

    const dur = Math.random() * 0.55 + 0.75;
    heart.style.animation = `explode ${dur}s cubic-bezier(0.15, 0.8, 0.2, 1) forwards`;

    confettiContainer.appendChild(heart);
    setTimeout(() => heart.remove(), dur * 1000);
  }

  // 3) Lluvia de corazones cayendo
  setTimeout(() => {
    const rainCount = 320;

    for (let i = 0; i < rainCount; i++) {
      const heart = document.createElement("div");
      heart.className = "confetti";
      heart.textContent = "❤";

      heart.style.left = `${Math.random() * w}px`;
      heart.style.top = `-30px`;

      heart.style.color = colors[Math.floor(Math.random() * colors.length)];
      heart.style.fontSize = `${Math.random() * 14 + 12}px`;

      const dur = Math.random() * 2.2 + 3.0;
      const delay = Math.random() * 0.8;

      heart.style.animation = `fall ${dur}s linear ${delay}s forwards`;

      confettiContainer.appendChild(heart);
      setTimeout(() => heart.remove(), (dur + delay) * 1000);
    }
  }, 220);
}

/* EVENTOS */

btnYes.addEventListener("click", () => {
  goToYesScreen();
  launchConfetti();
});

btnNo.addEventListener("mouseenter", () => {
  teleportButton();
});

playground.addEventListener("pointermove", () => {
  teleportButton();
});

btnNo.addEventListener("click", () => {
  noClicks += 1;

  if (noClicks === 1) {
    hint.textContent = "Ah sí? Venga, otra vez graciosita 😉";
    teleportEnabled = true;
    teleportButton();
    return;
  }

  hint.textContent = "Vale, entonces mira esto…";
  window.open(VIDEO_URL, "_blank", "noopener,noreferrer");
});
