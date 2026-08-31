/* ==========================================================================
   MAHDI KHALIL — PORTFOLIO — behavior
   Vanilla JS, no external libraries. Respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Nav: scroll shadow + mobile toggle ---------------- */
  function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const panel = document.getElementById('mobile-panel');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toggle && panel) {
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        panel.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
      panel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          nav.classList.remove('is-open');
          panel.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (prefersReducedMotion()) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

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
    items.forEach((el) => observer.observe(el));
  }

  /* ---------------- Timeline expand / collapse ---------------- */
  function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item) => {
      const btn = item.querySelector('.timeline-summary');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-expanded');
        items.forEach((other) => {
          if (other !== item) {
            other.classList.remove('is-expanded');
            const s = other.querySelector('.timeline-summary');
            if (s) s.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('is-expanded', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
    // Expand the current role by default
    const current = document.querySelector('.timeline-item.is-current');
    if (current) {
      current.classList.add('is-expanded');
      const s = current.querySelector('.timeline-summary');
      if (s) s.setAttribute('aria-expanded', 'true');
    }
  }

  /* ---------------- Work filters ---------------- */
  function initWorkFilters() {
    const filters = document.querySelectorAll('.work-filter');
    const cards = document.querySelectorAll('.work-card');
    if (!filters.length || !cards.length) return;

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach((f) => f.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.filter;
        cards.forEach((card) => {
          const match = cat === 'all' || card.dataset.category.includes(cat);
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------------- Contact form (Formspree, no page reload) ---------------- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const success = document.getElementById('form-success');
    const submitBtn = document.getElementById('form-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          form.reset();
          if (success) success.classList.add('is-visible-block');
        }
      } catch (err) {
        /* fail silently, form still works via native submit fallback */
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ---------------- Lightbox (zoomed / unzoomed project photos) ---------------- */
  function initLightbox() {
    const triggers = document.querySelectorAll('.work-media[data-full]');
    if (!triggers.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Close">' +
      '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
      '</button>' +
      '<img class="lightbox-img" src="" alt="" />';
    document.body.appendChild(overlay);

    const img = overlay.querySelector('.lightbox-img');
    const closeBtn = overlay.querySelector('.lightbox-close');
    let lastFocused = null;

    function open(src, alt) {
      img.src = src;
      img.alt = alt || '';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lastFocused = document.activeElement;
      closeBtn.focus();
    }
    function close() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });

    triggers.forEach((media) => {
      media.addEventListener('click', () => {
        if (!media.classList.contains('has-photo')) return;
        const full = media.dataset.full;
        const alt = media.querySelector('.work-media-photo')?.alt || '';
        open(full, alt);
      });
    });
  }

  /* ---------------- Footer year ---------------- */
  function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initReveal();
    initTimeline();
    initWorkFilters();
    initLightbox();
    initContactForm();
    initYear();
  });
})();
