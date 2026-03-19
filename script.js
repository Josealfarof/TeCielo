/* ══════════════════════════════════════════════════════════
   Te Cielo — JavaScript Principal
   ══════════════════════════════════════════════════════════ */

// ── Header scroll detection ───────────────────────────────

const siteHeader = document.getElementById('siteHeader');

function syncHeaderHeight() {
  const h = siteHeader?.offsetHeight ?? 88;
  document.documentElement.style.setProperty('--header-h', h + 'px');
}
syncHeaderHeight();
window.addEventListener('resize', syncHeaderHeight);

window.addEventListener('scroll', () => {
  siteHeader?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ── Mobile nav ────────────────────────────────────────────

const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');

hamburger?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close nav when a link is clicked
mainNav?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});


// ── Scroll Reveal ─────────────────────────────────────────

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── Carousel System ───────────────────────────────────────────

const carousels = {};

function initCarousel(id) {
  const container = document.querySelector(`[data-carousel="${id}"]`);
  if (!container) return;

  const track  = container.querySelector('.carousel-track');
  const dots   = container.querySelectorAll('.dot');
  const slides = container.querySelectorAll('.carousel-slide');

  carousels[id] = {
    currentSlide:     0,
    track,
    dots,
    totalSlides:      slides.length,
    autoPlayInterval: null
  };

  if (slides.length > 1) startAutoPlay(id);
}

function moveCarousel(id, direction) {
  const c = carousels[id];
  if (!c) return;
  c.currentSlide = (c.currentSlide + direction + c.totalSlides) % c.totalSlides;
  updateCarousel(id);
  resetAutoPlay(id);
}

function goToSlide(id, index) {
  const c = carousels[id];
  if (!c) return;
  c.currentSlide = index;
  updateCarousel(id);
  resetAutoPlay(id);
}

function updateCarousel(id) {
  const c = carousels[id];
  if (!c) return;
  c.track.style.transform = `translateX(${-c.currentSlide * 100}%)`;
  c.dots.forEach((dot, i) => dot.classList.toggle('active', i === c.currentSlide));
}

function startAutoPlay(id) {
  if (!carousels[id]) return;
  carousels[id].autoPlayInterval = setInterval(() => moveCarousel(id, 1), 4000);
}

function resetAutoPlay(id) {
  if (!carousels[id]) return;
  clearInterval(carousels[id].autoPlayInterval);
  startAutoPlay(id);
}

// Pause on hover
document.querySelectorAll('.carousel-container').forEach(container => {
  const raw = container.getAttribute('data-carousel');
  if (!raw || raw === 'personalizador') return;
  const id = parseInt(raw);
  container.addEventListener('mouseenter', () => {
    if (carousels[id]) clearInterval(carousels[id].autoPlayInterval);
  });
  container.addEventListener('mouseleave', () => {
    if (carousels[id]) startAutoPlay(id);
  });
});

// Initialize all product carousels (13 products)
for (let i = 1; i <= 13; i++) initCarousel(i);


// ── Image Zoom Modal ──────────────────────────────────────

const zoomModal = document.getElementById('imageModal');
const zoomImg   = document.getElementById('modalImage');

document.querySelectorAll('.carousel-slide img').forEach(img => {
  img.addEventListener('click', e => {
    e.stopPropagation();
    zoomImg.src = img.src;
    zoomModal.style.display = 'block';
  });
});

function closeModal() {
  zoomModal.style.display = 'none';
}


// ── Personalizador Modal ──────────────────────────────────

let personalizadorCarousel = { currentSlide: 0, totalSlides: 9 };

function openPersonalizador() {
  document.getElementById('personalizadorModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
  personalizadorCarousel.currentSlide = 0;
  updateCarouselPersonalizador();
  calcularTotal();
}

function closePersonalizador() {
  document.getElementById('personalizadorModal').style.display = 'none';
  document.body.style.overflow = '';
}

function moveCarouselPersonalizador(direction) {
  const c = personalizadorCarousel;
  c.currentSlide = (c.currentSlide + direction + c.totalSlides) % c.totalSlides;
  updateCarouselPersonalizador();
}

function goToSlidePersonalizador(index) {
  personalizadorCarousel.currentSlide = index;
  updateCarouselPersonalizador();
}

function updateCarouselPersonalizador() {
  const track = document.querySelector('[data-carousel="personalizador"] .carousel-track');
  const dots  = document.querySelectorAll('[data-carousel="personalizador"] .dot');
  if (!track) return;
  track.style.transform = `translateX(${-personalizadorCarousel.currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === personalizadorCarousel.currentSlide));
}


// ── Accessories Gallery Modal ─────────────────────────────

const accesoriosImagenes = {
  'tiara-grande':    ['images/image_48.jpg', 'images/image_49.jpg', 'images/image_50.jpg'],
  'corona-mediana':  ['images/image_51.jpg', 'images/image_52.jpg'],
  'corona-pequena':  ['images/image_53.jpg'],
  'tiara-pequena':   ['images/image_54.jpg'],
  'mariposas':       ['images/image_55.png'],
  'mensaje':         ['images/image_56.jpg'],
  'peluche-mediano': ['images/image_57.jpg', 'images/image_58.jpg', 'images/image_59.jpg',
                      'images/image_60.jpg', 'images/image_61.jpg', 'images/image_62.jpg'],
  'peluche-pequeno': ['images/image_63.jpg']
};

let galeriaState = { currentSlide: 0, totalSlides: 0 };

function mostrarImagenAccesorio(tipo) {
  const modal   = document.getElementById('accesorioGaleriaModal');
  const track   = document.getElementById('galeriaTrack');
  const dots    = document.getElementById('galeriaDots');
  const prevBtn = document.getElementById('galeriaPrev');
  const nextBtn = document.getElementById('galeriaNext');

  const imagenes = accesoriosImagenes[tipo];
  if (!imagenes || imagenes.length === 0) {
    alert('No hay imágenes disponibles para este accesorio');
    return;
  }

  galeriaState = { currentSlide: 0, totalSlides: imagenes.length };
  track.innerHTML = '';
  dots.innerHTML  = '';

  imagenes.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'galeria-slide';

    const img = document.createElement('img');
    img.src = src;
    img.alt = tipo;
    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToGaleriaSlide(i);
    dots.appendChild(dot);
  });

  const multi = imagenes.length > 1;
  prevBtn.style.display = multi ? 'flex' : 'none';
  nextBtn.style.display = multi ? 'flex' : 'none';

  modal.style.display = 'block';
}

function cerrarGaleriaAccesorio() {
  document.getElementById('accesorioGaleriaModal').style.display = 'none';
}

function moveGaleriaAccesorio(direction) {
  galeriaState.currentSlide =
    (galeriaState.currentSlide + direction + galeriaState.totalSlides) % galeriaState.totalSlides;
  updateGaleriaCarousel();
}

function goToGaleriaSlide(index) {
  galeriaState.currentSlide = index;
  updateGaleriaCarousel();
}

function updateGaleriaCarousel() {
  const track = document.getElementById('galeriaTrack');
  const dots  = document.querySelectorAll('#galeriaDots .dot');
  track.style.transform = `translateX(${-galeriaState.currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === galeriaState.currentSlide));
}


// ── Price Calculator ──────────────────────────────────────

function getVal(id) {
  return parseInt(document.getElementById(id).value) || 0;
}

function calcularTotal() {
  const rosas    = getVal('cantidadRosas');
  const tiaraG   = getVal('tiaraGrande');
  const coronaM  = getVal('coronaMediana');
  const coronaP  = getVal('coronaPequena');
  const tiaraP   = getVal('tiaraPequena');
  const mariposas = getVal('mariposas');
  const luces    = getVal('lucesLed');
  const mensaje  = getVal('mensajeCinta');
  const pelucheM = getVal('pelucheMediano');
  const pelucheP = getVal('peluchePequeno');

  const precioRosas = rosas * (rosas < 20 ? 1200 : 1000);

  const total = precioRosas
    + tiaraG   * 10000
    + coronaM  * 4000
    + coronaP  * 2000
    + tiaraP   * 2000
    + mariposas * 500
    + luces    * 1000
    + mensaje  * 4000
    + pelucheM * 10000
    + pelucheP * 5000;

  document.getElementById('totalPrecio').textContent = formatoPrecio(total);
}

function formatoPrecio(n) {
  return n.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  });
}


// ── Order Confirmation Modal ──────────────────────────────

function mostrarConfirmacion() {
  generarDetallePedido();
  document.getElementById('confirmacionModal').style.display = 'block';
}

function cerrarConfirmacion() {
  document.getElementById('confirmacionModal').style.display = 'none';
}

function generarDetallePedido() {
  const rosas    = getVal('cantidadRosas');
  const tiaraG   = getVal('tiaraGrande');
  const coronaM  = getVal('coronaMediana');
  const coronaP  = getVal('coronaPequena');
  const tiaraP   = getVal('tiaraPequena');
  const mariposas = getVal('mariposas');
  const luces    = getVal('lucesLed');
  const mensaje  = getVal('mensajeCinta');
  const pelucheM = getVal('pelucheMediano');
  const pelucheP = getVal('peluchePequeno');

  const unitRosa   = rosas < 20 ? 1200 : 1000;
  const precioRosas = rosas * unitRosa;

  const items = [
    { emoji: '🌹', label: `${rosas} Rosas Eternas (${formatoPrecio(unitRosa)} c/u)`, val: precioRosas,       show: rosas    > 0 },
    { emoji: '👑', label: `${tiaraG} Tiara Grande`,                                  val: tiaraG   * 10000, show: tiaraG   > 0 },
    { emoji: '👑', label: `${coronaM} Corona Mediana`,                               val: coronaM  * 4000,  show: coronaM  > 0 },
    { emoji: '👑', label: `${coronaP} Corona Pequeña`,                               val: coronaP  * 2000,  show: coronaP  > 0 },
    { emoji: '👑', label: `${tiaraP} Tiara Pequeña`,                                 val: tiaraP   * 2000,  show: tiaraP   > 0 },
    { emoji: '🦋', label: `${mariposas} Mariposas`,                                  val: mariposas * 500,  show: mariposas > 0 },
    { emoji: '💡', label: `${luces} Luces LED`,                                      val: luces    * 1000,  show: luces    > 0 },
    { emoji: '🎀', label: `${mensaje} Mensaje en Cinta`,                             val: mensaje  * 4000,  show: mensaje  > 0 },
    { emoji: '🧸', label: `${pelucheM} Peluche Mediano`,                             val: pelucheM * 10000, show: pelucheM > 0 },
    { emoji: '🧸', label: `${pelucheP} Peluche Pequeño`,                             val: pelucheP * 5000,  show: pelucheP > 0 },
  ];

  const total = items.reduce((sum, item) => sum + (item.show ? item.val : 0), 0);

  const html = items
    .filter(item => item.show)
    .map(item => `
      <div class="detalle-item">
        <span class="detalle-label">${item.emoji} ${item.label}</span>
        <span class="detalle-valor">${formatoPrecio(item.val)}</span>
      </div>
    `).join('')
    + `
      <div class="detalle-total">
        <span class="detalle-label">Total a pagar:</span>
        <span class="detalle-valor">${formatoPrecio(total)}</span>
      </div>
    `;

  document.getElementById('detalleContenido').innerHTML = html;

  // Build WhatsApp message
  const lines = items
    .filter(i => i.show)
    .map(i => `• ${i.emoji} ${i.label}: ${formatoPrecio(i.val)}`);
  lines.push(`\n*Total: ${formatoPrecio(total)}*`);
  const msg = encodeURIComponent('Hola Te Cielo! Quiero hacer este pedido:\n\n' + lines.join('\n'));
  document.getElementById('whatsappLink').href = `https://wa.me/56912345678?text=${msg}`;
}


// ── FAQ Accordion ─────────────────────────────────────────

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
  });

  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}


// ── Category Filter ───────────────────────────────────────

let currentFilter = 'todos';

function filterProducts(category) {
  if (category === currentFilter) return;
  currentFilter = category;

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === category);
  });

  const allCards = document.querySelectorAll('.product-card');

  allCards.forEach(card => card.classList.add('filtering-out'));

  setTimeout(() => {
    allCards.forEach(card => {
      const matches = category === 'todos' || card.dataset.category === category;
      card.style.display = matches ? '' : 'none';
      if (matches) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(18px) scale(.98)';
      }
      card.classList.remove('filtering-out');
    });

    const visible = [...allCards].filter(c => c.style.display !== 'none');
    updateResultsCount(visible.length, category);

    visible.forEach((card, i) => {
      setTimeout(() => {
        card.style.transition = 'opacity .4s var(--ease), transform .4s var(--ease)';
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, i * 55);
    });

    setTimeout(() => {
      visible.forEach(card => { card.style.transition = ''; });
    }, visible.length * 55 + 450);

  }, 280);
}

function updateResultsCount(count, category) {
  const el = document.getElementById('resultsCount');
  if (!el) return;

  const names = {
    'todos':            'todos los productos',
    'ramos-lujo':       'Ramos de Lujo',
    'ramos-romanticos': 'Ramos Románticos',
    'arreglos':         'Arreglos',
    'cuadros':          'Cuadros',
    'personalizados':   'Personalizados',
  };

  if (category === 'todos') {
    el.innerHTML = `<strong>${count}</strong> regalos disponibles`;
  } else {
    el.innerHTML = `<strong>${count}</strong> ${count === 1 ? 'producto' : 'productos'} en <em>${names[category] || category}</em>`;
  }
}

document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => filterProducts(pill.dataset.filter));
});


// ── Back to top ───────────────────────────────────────────

const backTopBtn = document.getElementById('backTop');
if (backTopBtn) {
  window.addEventListener('scroll', () => {
    backTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ── Global Keyboard & Click Events ───────────────────────

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeModal();
  closePersonalizador();
  cerrarGaleriaAccesorio();
  cerrarConfirmacion();
});

document.getElementById('personalizadorModal').addEventListener('click', function (e) {
  if (e.target === this) closePersonalizador();
});

document.getElementById('confirmacionModal').addEventListener('click', function (e) {
  if (e.target === this) cerrarConfirmacion();
});
