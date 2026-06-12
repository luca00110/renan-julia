/* ============================================================
   script.js — Dia dos Namorados
   Vanilla JS · Sem bibliotecas externas
============================================================ */

'use strict';

// ============================================================
// UTILITÁRIOS
// ============================================================

/** Selector helper */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Roda depois que o DOM está pronto */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initParticles();
  initHeartsCanvas();
  initGallery();
  initTimeline();
  initEnvelope();
  initGiftCard();
  initMusic();
  initScrollButtons();
  initBackTop();
});

// ============================================================
// 1. SCROLL REVEAL
// Observe elementos com classe reveal-* e adiciona .is-visible
// ============================================================

function initScrollReveal() {
  const targets = $$('.reveal-fade, .reveal-up, .reveal-photo, .reveal-tl');

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));

  // Hero revela imediatamente após pequeno delay
  setTimeout(() => {
    $$('.hero .reveal-fade, .hero .reveal-up').forEach((el) =>
      el.classList.add('is-visible')
    );
  }, 200);
}

// ============================================================
// 2. PARTÍCULAS DO HERO
// Canvas com pontos flutuantes e linhas conectoras sutis
// ============================================================

function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.55 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p) => {
      // Mover
      p.x += p.dx;
      p.y += p.dy;

      // Wrap around
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Desenhar ponto
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,132,158,${p.alpha})`;
      ctx.fill();
    });

    // Linhas entre partículas próximas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(212,132,158,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  draw();
}

// ============================================================
// 3. CORAÇÕES ANIMADOS NA SEÇÃO FINAL
// Canvas com corações flutuando de baixo para cima
// ============================================================

function initHeartsCanvas() {
  const canvas = $('#hearts-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  const hearts = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function spawnHeart() {
    hearts.push({
      x: Math.random() * W,
      y: H + 20,
      size: Math.random() * 18 + 8,
      alpha: Math.random() * 0.35 + 0.1,
      speed: Math.random() * 0.8 + 0.4,
      drift: (Math.random() - 0.5) * 0.5,
      wobble: Math.random() * Math.PI * 2,
    });
  }

  function drawHeart(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#d4849e';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - size * 0.3, x - size * 0.5, y - size * 0.6, x - size * 0.5, y - size * 0.3);
    ctx.bezierCurveTo(x - size * 0.5, y - size * 0.7, x, y - size * 0.7, x, y - size * 0.4);
    ctx.bezierCurveTo(x, y - size * 0.7, x + size * 0.5, y - size * 0.7, x + size * 0.5, y - size * 0.3);
    ctx.bezierCurveTo(x + size * 0.5, y - size * 0.6, x, y - size * 0.3, x, y);
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    hearts.forEach((h, i) => {
      h.y -= h.speed;
      h.wobble += 0.025;
      h.x += Math.sin(h.wobble) * h.drift;
      h.alpha -= 0.0012;
      drawHeart(h.x, h.y, h.size, Math.max(0, h.alpha));
    });

    // Remover corações invisíveis
    for (let i = hearts.length - 1; i >= 0; i--) {
      if (hearts[i].alpha <= 0) hearts.splice(i, 1);
    }

    requestAnimationFrame(tick);
  }

  // Observar quando a seção final fica visível para iniciar os corações
  const finalSection = $('#final');
  let spawnInterval = null;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !spawnInterval) {
        spawnInterval = setInterval(spawnHeart, 400);
      } else if (!entry.isIntersecting && spawnInterval) {
        clearInterval(spawnInterval);
        spawnInterval = null;
      }
    });
  }, { threshold: 0.1 });

  if (finalSection) obs.observe(finalSection);

  window.addEventListener('resize', resize);
  resize();
  tick();
}

// ============================================================
// 4. GALERIA — MODAL DE FOTO
// ============================================================

function initGallery() {
  const items = $$('.gallery-item');
  const modal = $('#photo-modal');
  const modalImg = $('#modal-img');
  const closeBtn = $('#modal-close');
  const prevBtn = $('#modal-prev');
  const nextBtn = $('#modal-next');

  if (!items.length || !modal) return;

  // Coletar sources na ordem
  const srcs = items.map((el) => $('img', el).src);
  let current = 0;

  function openModal(idx) {
    current = idx;
    modalImg.src = srcs[current];
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Limpar src depois da animação
    setTimeout(() => { modalImg.src = ''; }, 400);
  }

  function navigate(dir) {
    current = (current + dir + srcs.length) % srcs.length;
    // Fade suave na troca
    modalImg.style.opacity = '0';
    setTimeout(() => {
      modalImg.src = srcs[current];
      modalImg.style.opacity = '1';
    }, 180);
  }

  items.forEach((item, idx) => {
    item.addEventListener('click', () => openModal(idx));
  });

  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  // Fechar ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Navegação por teclado
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Transição de opacidade do modalImg
  modalImg.style.transition = 'opacity 0.18s ease';
}

// ============================================================
// 5. LINHA DO TEMPO — animações CSS via Intersection Observer
// (já gerenciado pelo initScrollReveal para .reveal-tl)
// Aqui adicionamos o stagger dos cards
// ============================================================

function initTimeline() {
  const items = $$('.timeline-item');
  items.forEach((item, idx) => {
    item.style.transitionDelay = `${idx * 0.12}s`;
  });
}

// ============================================================
// 6. ENVELOPE / CARTA
// ============================================================

function initEnvelope() {
  const envelope = $('#envelope');
  const cartaModal = $('#carta-modal');
  const cartaClose = $('#carta-close');

  if (!envelope || !cartaModal) return;

  envelope.addEventListener('click', () => {
    envelope.classList.add('opened');
    setTimeout(() => {
      cartaModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 350);
  });

  function closeCartaModal() {
    cartaModal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => envelope.classList.remove('opened'), 400);
  }

  cartaClose.addEventListener('click', closeCartaModal);

  cartaModal.addEventListener('click', (e) => {
    if (e.target === cartaModal) closeCartaModal();
  });

  document.addEventListener('keydown', (e) => {
    if (cartaModal.classList.contains('open') && e.key === 'Escape') {
      closeCartaModal();
    }
  });
}

// ============================================================
// 7. PLAYER DE MÚSICA
// ============================================================

function initMusic() {
  const btn = $('#music-btn');
  const disc = $('#music-disc');
  const iconPlay = $('#icon-play');
  const iconPause = $('#icon-pause');
  const label = $('#music-label');

  if (!btn) return;

  let audio = null;
  let isPlaying = false;

  function createAudio() {
    if (!audio) {
      audio = new Audio('musica.mp3');
      audio.loop = true;

      // Fade in ao iniciar
      audio.volume = 0;
      const fadeIn = setInterval(() => {
        if (audio.volume < 0.92) {
          audio.volume = Math.min(1, audio.volume + 0.04);
        } else {
          clearInterval(fadeIn);
        }
      }, 80);

      audio.addEventListener('ended', () => {
        // redundante com loop=true, mas por segurança
        isPlaying = false;
        updateUI();
      });

      audio.addEventListener('error', () => {
        console.warn('Não foi possível carregar musica.mp3. Coloque o arquivo na mesma pasta.');
        label.textContent = '♪ Arquivo não encontrado';
        label.classList.add('visible');
        setTimeout(() => label.classList.remove('visible'), 3000);
      });
    }
  }

  function updateUI() {
    if (isPlaying) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
      disc.classList.add('spinning');
      label.classList.add('visible');
    } else {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      disc.classList.remove('spinning');
      label.classList.remove('visible');
    }
  }

  btn.addEventListener('click', () => {
    createAudio();

    if (isPlaying) {
      // Fade out antes de pausar
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.04) {
          audio.volume = Math.max(0, audio.volume - 0.04);
        } else {
          audio.pause();
          audio.volume = 0;
          clearInterval(fadeOut);
        }
      }, 60);
      isPlaying = false;
    } else {
      // Fade in
      audio.volume = 0;
      audio.play().catch(() => {
        console.warn('Reprodução bloqueada pelo navegador. Clique novamente.');
      });
      const fadeIn = setInterval(() => {
        if (audio.volume < 0.92) {
          audio.volume = Math.min(1, audio.volume + 0.04);
        } else {
          clearInterval(fadeIn);
        }
      }, 80);
      isPlaying = true;
    }

    updateUI();
  });
}

// ============================================================
// 8. SCROLL SUAVE DOS BOTÕES
// ============================================================

function initScrollButtons() {
  const btnStart = $('#btn-start');
  const btnTop = $('#btn-top');

  if (btnStart) {
    btnStart.addEventListener('click', () => {
      const galeria = $('#galeria');
      if (galeria) {
        galeria.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ============================================================
// 9. BOTÃO VOLTAR AO TOPO (visibilidade)
// ============================================================

function initBackTop() {
  const btn = $('#back-top');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    throttle(() => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, 100)
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// HELPERS
// ============================================================

/** Throttle para eventos de scroll */
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}
// ============================================================
// VALE-PRESENTE RENNER
// ============================================================

function initGiftCard() {
  const giftTrigger = $('#gift-trigger');
  const giftModal = $('#gift-modal');
  const giftClose = $('#gift-close');

  if (!giftTrigger || !giftModal || !giftClose) return;

  function openGift() {
    giftModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeGift() {
    giftModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  giftTrigger.addEventListener('click', openGift);
  giftClose.addEventListener('click', closeGift);

  giftModal.addEventListener('click', (e) => {
    if (e.target === giftModal) closeGift();
  });

  document.addEventListener('keydown', (e) => {
    if (giftModal.classList.contains('open') && e.key === 'Escape') {
      closeGift();
    }
  });
}
