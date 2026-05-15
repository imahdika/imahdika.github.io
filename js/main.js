/**
 * main.js — Mahdi Khalil Portfolio
 * Marketing Executive · Brand Identity Specialist · Logo Designer · Creative Director
 * Bahrain
 *
 * Dependencies (loaded via CDN before this script):
 *   - GSAP 3
 *   - GSAP ScrollTrigger plugin
 *   - GSAP ScrollToPlugin
 */

/* ============================================================
   INITIALIZATION
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (window.gsap && window.ScrollToPlugin) {
    gsap.registerPlugin(ScrollToPlugin);
  }

  initLoader();
  initNav();
  initHeroGreeting();
  initScrollReveal();
  initParallax();
  initMarquee();
  initPortfolioFilter();
  initLightbox();
  initSkillBars();
  initCounters();
  initContactForm();
  initCustomCursor();
  initSmoothScroll();
});

/* ============================================================
   UTILITIES
   ============================================================ */

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function qs(selector, root) {
  return (root || document).querySelector(selector);
}

function qsa(selector, root) {
  return Array.from((root || document).querySelectorAll(selector));
}

/* ============================================================
   PAGE LOADER
   ============================================================ */

function initLoader() {
  const loader = qs('#loader');
  if (!loader) {
    startHeroEntrance();
    document.body.classList.add('loaded');
    return;
  }

  const loaderBar = qs('.loader-bar');

  if (loaderBar && window.gsap && !prefersReducedMotion()) {
    gsap.fromTo(
      loaderBar,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.0, ease: 'power2.inOut' }
    );
  }

  const hideLoader = () => {
    if (window.gsap && !prefersReducedMotion()) {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          loader.style.display = 'none';
          document.body.classList.add('loaded');
          startHeroEntrance();
        },
      });
    } else {
      loader.style.display = 'none';
      document.body.classList.add('loaded');
      startHeroEntrance();
    }
  };

  setTimeout(hideLoader, prefersReducedMotion() ? 300 : 1300);
}

/* ============================================================
   NAVIGATION
   ============================================================ */

function initNav() {
  const nav = qs('#nav');
  const hamburger = qs('.nav-hamburger');
  const mobileNavLinks = qsa('.mobile-nav-link');

  const handleNavScroll = () => {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('nav-open')) return;
    if (!nav) return;
    if (!nav.contains(e.target)) {
      document.body.classList.remove('nav-open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   HERO GREETING
   ============================================================ */

function initHeroGreeting() {
  const greetingEl = qs('.hero-greeting');
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let greeting;

  if (hour >= 5 && hour <= 11) {
    greeting = 'Good Morning';
  } else if (hour >= 12 && hour <= 16) {
    greeting = 'Good Afternoon';
  } else if (hour >= 17 && hour <= 20) {
    greeting = 'Good Evening';
  } else {
    greeting = 'Good Night';
  }

  greetingEl.textContent = greeting;
}

/* ============================================================
   HERO ENTRANCE ANIMATION
   ============================================================ */

function startHeroEntrance() {
  if (prefersReducedMotion()) {
    qsa('.hero-greeting, .hero-title, .hero-description, .hero-actions, .hero-stats, .hero-scroll-indicator').forEach(
      (el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    );
    qsa('.hero-headline .line').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  if (!window.gsap) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-greeting', { opacity: 0, y: 20, duration: 0.6 })
    .from('.hero-headline .line', { opacity: 0, y: 60, duration: 0.8, stagger: 0.12 }, '-=0.2')
    .from('.hero-title', { opacity: 0, y: 24, duration: 0.6 }, '-=0.4')
    .from('.hero-description', { opacity: 0, y: 24, duration: 0.6 }, '-=0.4')
    .from('.hero-actions', { opacity: 0, y: 20, duration: 0.5 }, '-=0.4')
    .from('.hero-stats', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
    .from('.hero-scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.2');
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */

function initScrollReveal() {
  const revealEls = qsa('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealEls.length) return;

  if (prefersReducedMotion()) {
    revealEls.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ============================================================
   PARALLAX
   ============================================================ */

function initParallax() {
  if (prefersReducedMotion()) return;

  const orb1 = qs('.hero-orb-1');
  const orb2 = qs('.hero-orb-2');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (orb1) orb1.style.transform = `translateY(${scrollY * 0.12}px)`;
        if (orb2) orb2.style.transform = `translateY(${scrollY * 0.08}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   MARQUEE
   ============================================================ */

function initMarquee() {
  const wrapper = qs('.marquee-wrapper');
  const track = qs('.marquee-track');
  if (!wrapper || !track) return;

  // Pause on hover (desktop only)
  if (!('ontouchstart' in window)) {
    wrapper.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    wrapper.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }
}

/* ============================================================
   PORTFOLIO FILTER
   ============================================================ */

function initPortfolioFilter() {
  const tabs = qsa('.filter-tab');
  const cards = qsa('.project-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter || 'all';
      const toShow = [];
      const toHide = [];

      cards.forEach((card) => {
        const category = card.dataset.category || '';
        if (filter === 'all' || category.split(' ').includes(filter)) {
          toShow.push(card);
        } else {
          toHide.push(card);
        }
      });

      if (window.gsap && !prefersReducedMotion()) {
        if (toHide.length) {
          gsap.to(toHide, {
            opacity: 0,
            scale: 0.95,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
              toHide.forEach((card) => {
                card.style.display = 'none';
                card.setAttribute('aria-hidden', 'true');
              });
            },
          });
        }
        if (toShow.length) {
          setTimeout(() => {
            toShow.forEach((card) => {
              card.style.display = '';
              card.setAttribute('aria-hidden', 'false');
            });
            gsap.fromTo(
              toShow,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', stagger: 0.06 }
            );
          }, toHide.length ? 260 : 0);
        }
      } else {
        toHide.forEach((card) => {
          card.style.display = 'none';
          card.setAttribute('aria-hidden', 'true');
        });
        toShow.forEach((card) => {
          card.style.display = '';
          card.setAttribute('aria-hidden', 'false');
        });
      }
    });
  });
}

/* ============================================================
   PROJECT LIGHTBOX
   ============================================================ */

function initLightbox() {
  let currentSlide = 0;
  let currentImages = [];

  const lightbox = qs('#lightbox');
  if (!lightbox) return;

  const panel = qs('#lightbox-panel');
  const closeBtn = qs('#lightbox-close');
  const slidesTrack = qs('#lightbox-slides');
  const prevBtn = qs('#carousel-prev');
  const nextBtn = qs('#carousel-next');
  const dotsContainer = qs('#carousel-dots');
  const titleEl = qs('#lightbox-title-el');
  const categoryEl = qs('#lightbox-category-el');
  const descriptionEl = qs('#lightbox-description-el');
  const tagsEl = qs('#lightbox-tags-el');
  const yearEl = qs('#lightbox-year-el');
  const typeEl = qs('#lightbox-type-el');

  function buildCarouselSlides(images) {
    if (!slidesTrack) return;
    slidesTrack.innerHTML = '';

    images.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'lightbox-slide';
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `Slide ${i + 1} of ${images.length}`);
      if (src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Project image ${i + 1}`;
        img.loading = 'lazy';
        slide.appendChild(img);
      }
      slidesTrack.appendChild(slide);
    });

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      if (images.length > 1) {
        images.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot';
          dot.setAttribute('role', 'tab');
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          dot.addEventListener('click', () => {
            currentSlide = i;
            updateCarousel();
          });
          dotsContainer.appendChild(dot);
        });
      }
    }
  }

  function updateCarousel() {
    if (!slidesTrack) return;
    slidesTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    qsa('.carousel-dot', lightbox).forEach((dot, i) => {
      const isActive = i === currentSlide;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });

    if (prevBtn) {
      prevBtn.disabled = currentSlide === 0;
      prevBtn.setAttribute('aria-disabled', String(currentSlide === 0));
    }
    if (nextBtn) {
      nextBtn.disabled = currentSlide >= currentImages.length - 1;
      nextBtn.setAttribute('aria-disabled', String(currentSlide >= currentImages.length - 1));
    }
  }

  function openLightbox(card) {
    const title = card.dataset.title || '';
    const category = card.dataset.category || '';
    const description = card.dataset.description || '';
    const tagsStr = card.dataset.tags || '';
    const year = card.dataset.year || '';
    const type = card.dataset.type || '';

    let images = [];
    try {
      images = card.dataset.images ? JSON.parse(card.dataset.images) : [];
    } catch (_) {
      images = [];
    }
    currentImages = images.length ? images : [];

    if (titleEl) titleEl.textContent = title;
    if (categoryEl) categoryEl.textContent = category;
    if (descriptionEl) descriptionEl.textContent = description;
    if (yearEl) yearEl.textContent = year;
    if (typeEl) typeEl.textContent = type;
    if (tagsEl && tagsStr) {
      tagsEl.innerHTML = tagsStr
        .split(',')
        .map((tag) => `<span class="project-tag">${tag.trim()}</span>`)
        .join('');
    }

    buildCarouselSlides(currentImages);
    currentSlide = 0;
    updateCarousel();

    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.gsap && !prefersReducedMotion()) {
      gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      if (panel) {
        gsap.fromTo(
          panel,
          { scale: 0.95, y: 24 },
          { scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        );
      }
    }

    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (window.gsap && !prefersReducedMotion()) {
      gsap.to(lightbox, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          lightbox.style.display = 'none';
          lightbox.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          currentSlide = 0;
          currentImages = [];
        },
      });
    } else {
      lightbox.style.display = 'none';
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      currentSlide = 0;
      currentImages = [];
    }
  }

  // Open on card click or Enter/Space keypress
  qsa('.project-card').forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (panel && !panel.contains(e.target)) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentSlide > 0) {
      currentSlide--;
      updateCarousel();
    }
    if (e.key === 'ArrowRight' && currentSlide < currentImages.length - 1) {
      currentSlide++;
      updateCarousel();
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) { currentSlide--; updateCarousel(); }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlide < currentImages.length - 1) { currentSlide++; updateCarousel(); }
    });
  }

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(delta) > 50) {
      if (delta > 0 && currentSlide < currentImages.length - 1) currentSlide++;
      else if (delta < 0 && currentSlide > 0) currentSlide--;
      updateCarousel();
    }
  }, { passive: true });
}

/* ============================================================
   SKILL BARS
   ============================================================ */

function initSkillBars() {
  const skillFills = qsa('.skill-fill');
  if (!skillFills.length) return;

  if (prefersReducedMotion()) {
    skillFills.forEach((el) => {
      el.style.width = el.dataset.width || '0%';
    });
    return;
  }

  skillFills.forEach((el) => {
    el.style.width = '0%';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetWidth = el.dataset.width || '0%';
          const index = skillFills.indexOf(el);
          if (window.gsap) {
            gsap.to(el, {
              width: targetWidth,
              duration: 1.2,
              ease: 'power2.out',
              delay: (index % 6) * 0.08,
            });
          } else {
            el.style.width = targetWidth;
          }
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillFills.forEach((el) => observer.observe(el));
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */

function initCounters() {
  const statsSection = qs('.hero-stats');
  if (!statsSection) return;

  const counterEls = qsa('.hero-stat .number', statsSection);
  if (!counterEls.length) return;

  if (prefersReducedMotion()) {
    counterEls.forEach((el) => {
      el.textContent = (el.dataset.target || '0') + (el.dataset.suffix || '');
    });
    return;
  }

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          observer.unobserve(entry.target);

          counterEls.forEach((el) => {
            const target = parseFloat(el.dataset.target) || 0;
            const suffix = el.dataset.suffix || '';
            if (window.gsap) {
              const counterObj = { val: 0 };
              gsap.to(counterObj, {
                val: target,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = Math.round(counterObj.val) + suffix;
                },
                onComplete: () => {
                  el.textContent = target + suffix;
                },
              });
            } else {
              el.textContent = target + suffix;
            }
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(statsSection);
}

/* ============================================================
   CONTACT FORM
   ============================================================ */

function initContactForm() {
  const form = qs('#contact-form');
  if (!form) return;

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameInput = qs('#form-name', form);
  const emailInput = qs('#form-email', form);
  const subjectInput = qs('#form-subject', form);
  const messageInput = qs('#form-message', form);
  const submitBtn = qs('#form-submit', form);
  const submitText = qs('#form-submit-text', form);
  const successEl = qs('#form-success', form);

  function getErrorEl(id) {
    return qs(`#${id}-error`, form);
  }

  function showError(input, errId, msg) {
    if (!input) return;
    input.classList.add('error');
    const errEl = getErrorEl(errId);
    if (errEl) errEl.textContent = msg;
  }

  function clearError(input, errId) {
    if (!input) return;
    input.classList.remove('error');
    const errEl = getErrorEl(errId);
    if (errEl) errEl.textContent = '';
  }

  function validateName() {
    const val = nameInput ? nameInput.value.trim() : '';
    if (!val) { showError(nameInput, 'name', 'Full name is required.'); return false; }
    if (val.length < 2) { showError(nameInput, 'name', 'Name must be at least 2 characters.'); return false; }
    clearError(nameInput, 'name');
    return true;
  }

  function validateEmail() {
    const val = emailInput ? emailInput.value.trim() : '';
    if (!val) { showError(emailInput, 'email', 'Email address is required.'); return false; }
    if (!EMAIL_REGEX.test(val)) { showError(emailInput, 'email', 'Please enter a valid email address.'); return false; }
    clearError(emailInput, 'email');
    return true;
  }

  function validateSubject() {
    const val = subjectInput ? subjectInput.value.trim() : '';
    if (!val) { showError(subjectInput, 'subject', 'Subject is required.'); return false; }
    clearError(subjectInput, 'subject');
    return true;
  }

  function validateMessage() {
    const val = messageInput ? messageInput.value.trim() : '';
    if (!val) { showError(messageInput, 'message', 'Message is required.'); return false; }
    if (val.length < 10) { showError(messageInput, 'message', 'Message must be at least 10 characters.'); return false; }
    clearError(messageInput, 'message');
    return true;
  }

  if (nameInput) nameInput.addEventListener('blur', validateName);
  if (emailInput) emailInput.addEventListener('blur', validateEmail);
  if (subjectInput) subjectInput.addEventListener('blur', validateSubject);
  if (messageInput) messageInput.addEventListener('blur', validateMessage);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const valid = [validateName(), validateEmail(), validateSubject(), validateMessage()].every(Boolean);
    if (!valid) return;

    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Sending...';

    const payload = {
      name: nameInput ? nameInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      subject: subjectInput ? subjectInput.value.trim() : '',
      message: messageInput ? messageInput.value.trim() : '',
    };

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Hide form, show success
        form.style.display = 'none';
        if (successEl) {
          successEl.style.display = 'block';
          if (window.gsap && !prefersReducedMotion()) {
            gsap.fromTo(successEl, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 });
          }
        }
        form.reset();
      } else {
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'Send Message';
        let errMsg = 'Something went wrong. Please try again.';
        try {
          const data = await response.json();
          if (data && data.error) errMsg = data.error;
        } catch (_) {}
        if (successEl) {
          successEl.textContent = errMsg;
          successEl.style.display = 'block';
          successEl.style.borderColor = 'rgba(217, 64, 64, 0.3)';
          successEl.style.color = '#D94040';
        }
      }
    } catch (_) {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Send Message';
      if (successEl) {
        successEl.textContent = 'Network error. Please check your connection and try again.';
        successEl.style.display = 'block';
        successEl.style.borderColor = 'rgba(217, 64, 64, 0.3)';
        successEl.style.color = '#D94040';
      }
    }
  });
}

/* ============================================================
   CUSTOM CURSOR (desktop only)
   ============================================================ */

function initCustomCursor() {
  if ('ontouchstart' in window) return;
  if (prefersReducedMotion()) return;

  const cursor = qs('.cursor');
  const cursorRing = qs('.cursor-ring');
  if (!cursor && !cursorRing) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) cursor.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });

  function tick() {
    if (cursor) {
      cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
    }
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    if (cursorRing) {
      cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
    }
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  const INTERACTIVE = 'a[href], button, .project-card, .filter-tab, .contact-channel, label';

  document.addEventListener('mouseover', (e) => {
    if (!e.target.closest(INTERACTIVE)) return;
    if (window.gsap) {
      gsap.to(cursor, { scale: 2.8, duration: 0.3 });
      gsap.to(cursorRing, { scale: 0, duration: 0.3 });
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (!e.target.closest(INTERACTIVE)) return;
    if (window.gsap) {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(cursorRing, { scale: 1, duration: 0.3 });
    }
  });

  document.addEventListener('mousedown', () => {
    if (window.gsap) gsap.to(cursor, { scale: 0.7, duration: 0.15 });
  });

  document.addEventListener('mouseup', () => {
    if (window.gsap) gsap.to(cursor, { scale: 1, duration: 0.15 });
  });

  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });

  window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */

function initSmoothScroll() {
  const NAV_OFFSET = 84;
  const anchorLinks = qsa('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();

      if (window.gsap && window.ScrollToPlugin) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: NAV_OFFSET },
          duration: 0.9,
          ease: 'power3.inOut',
        });
      } else {
        const targetY = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });
}
