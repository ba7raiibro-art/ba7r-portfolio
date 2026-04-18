/* ═══════════════════════════════════════════════════════════
   B_A_7_R — MAIN JAVASCRIPT v2
   Features: Language toggle · Dark/light mode · FAQ accordion
             Portfolio filter · About modal · WhatsApp links
             Particles · Scroll counter · Sticky navbar
             Mobile menu · Scroll reveal (IntersectionObserver)
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── GLOBALS ───────────────────────────────────────────── */
let currentLang  = localStorage.getItem('ba7r-lang')  || 'en';
let currentTheme = localStorage.getItem('ba7r-theme') || 'dark';

/* ─── DOM READY ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLang(currentLang);

  initNavbar();
  initMobileMenu();
  initThemeToggle();
  initLangToggle();
  initScrollReveal();
  initStats();
  initWhatsAppLinks();
  initFAQ();
  initPortfolioFilter();
  initAboutModal();
});

/* ─── NAVBAR SCROLL ─────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── MOBILE MENU ───────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ─── THEME TOGGLE ──────────────────────────────────────── */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  currentTheme = theme;
  localStorage.setItem('ba7r-theme', theme);

  const iconMoon = document.querySelectorAll('.icon-moon');
  const iconSun  = document.querySelectorAll('.icon-sun');

  iconMoon.forEach(el => el.style.display = theme === 'dark'  ? 'block' : 'none');
  iconSun.forEach(el  => el.style.display = theme === 'light' ? 'block' : 'none');
}

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

/* ─── LANGUAGE TOGGLE ───────────────────────────────────── */
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('ba7r-lang', lang);

  const html = document.documentElement;
  html.setAttribute('data-lang', lang);
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-en][data-ar]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;
    if (text.includes('<br>') || text.includes('&amp;') || text.includes('&')) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  const metaOgLocale = document.querySelector('meta[property="og:locale"]');
  if (metaOgLocale) {
    metaOgLocale.setAttribute('content', lang === 'ar' ? 'ar_JO' : 'en_US');
  }

  // Nav lang toggle (has .lang-label-en / .lang-label-ar spans)
  const navLangBtn = document.getElementById('lang-toggle');
  if (navLangBtn) {
    const enSpan = navLangBtn.querySelector('.lang-label-en');
    const arSpan = navLangBtn.querySelector('.lang-label-ar');
    if (enSpan) enSpan.style.display = lang === 'en' ? 'block' : 'none';
    if (arSpan) arSpan.style.display = lang === 'ar' ? 'block' : 'none';
  }

  // Footer lang button (no spans — just text)
  const footerLangBtn = document.getElementById('footer-lang-btn');
  if (footerLangBtn) {
    footerLangBtn.textContent = lang === 'en' ? 'AR' : 'EN';
  }
}

function initLangToggle() {
  document.addEventListener('click', e => {
    if (e.target.closest('#lang-toggle') || e.target.closest('#footer-lang-btn')) {
      applyLang(currentLang === 'en' ? 'ar' : 'en');
    }
  });
}

/* ─── SCROLL REVEAL (IntersectionObserver) ──────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ─── STATS COUNTER ─────────────────────────────────────── */
function initStats() {
  const statNumbers = document.querySelectorAll('.stat-num[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      animateCounter(entry.target);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1400;
  const start    = performance.now();

  const tick = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };

  requestAnimationFrame(tick);
}

/* ─── WHATSAPP LINKS ────────────────────────────────────── */
function buildWAMessage(serviceEn, serviceAr) {
  const service = currentLang === 'ar' ? serviceAr : serviceEn;

  if (currentLang === 'ar') {
    return encodeURIComponent(
      `مرحباً بحر! أنا مهتم بـ ${service}.\n\nاسمي:\nمشروعي / نشاطي:\nتفاصيل إضافية:`
    );
  }

  return encodeURIComponent(
    `Hi Bahr! I'm interested in ${service}.\n\nMy name:\nMy business/project:\nAdditional details:`
  );
}

function initWhatsAppLinks() {
  document.querySelectorAll('.wa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceEn = btn.getAttribute('data-service-en') || '';
      const serviceAr = btn.getAttribute('data-service-ar') || serviceEn;
      const msg       = buildWAMessage(serviceEn, serviceAr);
      window.open(`https://wa.me/962777832959?text=${msg}`, '_blank', 'noopener,noreferrer');
    });
  });
}

/* ─── FAQ ACCORDION ─────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-q');
    const answer   = item.querySelector('.faq-a');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all others
      items.forEach(other => {
        if (other === item) return;
        const q = other.querySelector('.faq-q');
        const a = other.querySelector('.faq-a');
        if (q) q.setAttribute('aria-expanded', 'false');
        if (a) a.classList.remove('open');
      });

      // Toggle this one
      question.setAttribute('aria-expanded', (!isOpen).toString());
      answer.classList.toggle('open', !isOpen);
    });
  });
}

/* ─── PORTFOLIO FILTER ──────────────────────────────────── */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.port-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'portfolioReveal 0.4s ease-out forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ─── ABOUT MODAL ───────────────────────────────────────── */
function initAboutModal() {
  const modal    = document.getElementById('about-modal');
  const openBtn  = document.getElementById('read-story-btn');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !openBtn) return;

  const open = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    applyLang(currentLang);
  };

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    openBtn.focus();
  };

  openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* ─── SMOOTH SCROLL ─────────────────────────────────────── */
document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  const targetId = anchor.getAttribute('href');
  if (targetId === '#') return;

  const target = document.querySelector(targetId);
  if (!target) return;

  e.preventDefault();
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
  const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ─── PORTFOLIO REVEAL KEYFRAME ─────────────────────────── */
const portfolioStyle = document.createElement('style');
portfolioStyle.textContent = `
  @keyframes portfolioReveal {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(portfolioStyle);
