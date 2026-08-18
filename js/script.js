// mobile nav
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("navMenu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }),
);

// scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("in");
    });
  },
  { threshold: 0.15 },
);
revealEls.forEach((el) => io.observe(el));

// Portfolio data.
// Projetos com "images" mostram as fotos reais (clique abre a galeria em tela cheia).
// Projetos sem "images" usam uma plantinha ilustrativa de espaço reservado — troque por fotos quando tiver.
const projects = [
  {
    tag: "Comercial · 2025",
    title: "Escritório Executivo",
    area: "95 m²",
    images: [],
  },
  {
    tag: "Interiores · 2025",
    title: "Cozinha Gourmet",
    area: "38 m²",
    images: [],
  },
  {
    tag: "Residencial · 2025",
    title: "Casa Alto da Serra",
    area: "210 m²",
  },
  {
    tag: "Interiores · 2024",
    title: "Apartamento Jardins",
    area: "140 m²",
  },
  { tag: "Residencial · 2024", title: "Casa Vista Mar", area: "260 m²" },
  { tag: "Comercial · 2024", title: "Café Terra", area: "70 m²" },
  {
    tag: "Interiores · 2023",
    title: "Cobertura Bela Vista",
    area: "180 m²",
  },
];

const plans = [
  "M20,80 L20,20 L60,20 L60,45 L80,45 L80,80 Z",
  "M15,20 L85,20 L85,55 L55,55 L55,80 L15,80 Z",
  "M20,20 L80,20 L80,50 L50,50 L50,80 L20,80 Z M50,50 L20,50",
  "M15,60 L15,20 L70,20 L70,40 L85,40 L85,80 L40,80 L40,60 Z",
  "M25,15 L75,15 L75,60 L50,60 L50,85 L25,85 Z",
  "M15,25 L60,25 L60,15 L85,15 L85,55 L65,55 L65,85 L15,85 Z",
];

const grid = document.getElementById("portfolioGrid");
projects.forEach((p, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.imgIndex = "0";

  const visual = p.images
    ? `<img class="plan photo" src="${p.images[0]}" alt="${p.title}" loading="lazy">`
    : `<svg class="plan" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
           <rect width="100" height="100" fill="var(--cream-deep)"/>
           <path d="${plans[i % plans.length]}" fill="none" stroke="var(--clay)" stroke-width="1.1" opacity="0.8"/>
         </svg>`;

  const carouselControls =
    p.images && p.images.length > 1
      ? `
      <button class="card-nav card-prev" aria-label="Foto anterior">&#8249;</button>
      <button class="card-nav card-next" aria-label="Próxima foto">&#8250;</button>
      <div class="card-dots">
        ${p.images.map((_, di) => `<span class="dot${di === 0 ? " active" : ""}"></span>`).join("")}
      </div>
    `
      : "";

  card.innerHTML = `
      <span class="card-badge mono">${p.area}</span>
      ${visual}
      ${carouselControls}
      <div class="card-info">
        <span class="tag mono">${p.tag}</span>
        <h3>${p.title}</h3>
      </div>
    `;

  if (p.images) {
    const imgEl = card.querySelector("img.photo");
    const dots = card.querySelectorAll(".dot");

    const setIndex = (idx) => {
      const n = p.images.length;
      const clamped = (idx + n) % n;
      card.dataset.imgIndex = clamped;
      imgEl.src = p.images[clamped];
      dots.forEach((d, di) => d.classList.toggle("active", di === clamped));
    };

    const prevBtn = card.querySelector(".card-prev");
    const nextBtn = card.querySelector(".card-next");
    if (prevBtn)
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setIndex(parseInt(card.dataset.imgIndex, 10) - 1);
      });
    if (nextBtn)
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setIndex(parseInt(card.dataset.imgIndex, 10) + 1);
      });
    dots.forEach((dot, di) =>
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        setIndex(di);
      }),
    );

    card.addEventListener("click", () =>
      openLightbox(p, parseInt(card.dataset.imgIndex, 10)),
    );
  }
  grid.appendChild(card);
});

// ---------- lightbox for projects with real photo galleries ----------
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lightboxImg");
const lbTitle = document.getElementById("lightboxTitle");
const lbCounter = document.getElementById("lightboxCounter");
let lbImages = [];
let lbIndex = 0;

function openLightbox(project, startIndex = 0) {
  lbImages = project.images;
  lbIndex = startIndex;
  lbTitle.textContent = project.title;
  updateLightbox();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}
function updateLightbox() {
  lbImg.src = lbImages[lbIndex];
  lbCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
}
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}
document
  .getElementById("lightboxClose")
  .addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.getElementById("lightboxPrev").addEventListener("click", () => {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  updateLightbox();
});
document.getElementById("lightboxNext").addEventListener("click", () => {
  lbIndex = (lbIndex + 1) % lbImages.length;
  updateLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") {
    lbIndex = (lbIndex + 1) % lbImages.length;
    updateLightbox();
  }
  if (e.key === "ArrowLeft") {
    lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
    updateLightbox();
  }
});
