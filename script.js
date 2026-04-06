/* ═══════════════════════════════════════════════════
   EMPIRE HAIR & BEAUTY SUPPLY — MAIN SCRIPT
   Vanilla JS: header, mobile menu, scroll reveal,
   reviews snap carousel, FAQ accordion
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════
     SCROLL RESTORATION — always start at top
  ══════════════════════════════════════════ */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ══════════════════════════════════════════
     STICKY HEADER — always visible
  ══════════════════════════════════════════ */
  const header = $('#site-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ══════════════════════════════════════════
     MOBILE MENU
  ══════════════════════════════════════════ */
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const mobileClose = $('#mobile-close');
  const overlay    = $('#mobile-overlay');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    overlay.classList.add('show');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger)   hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (overlay)     overlay.addEventListener('click', closeMenu);
  $$('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ══════════════════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════════════════ */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ══════════════════════════════════════════
     REVIEWS SNAP CAROUSEL
  ══════════════════════════════════════════ */
  (function initReviewsCarousel() {
    var track = document.getElementById('reviews-marquee-track');
    if (!track) return;

    var leftBtn = document.querySelector('.reviews-arrow.left');
    var rightBtn = document.querySelector('.reviews-arrow.right');

    function getScrollAmount() {
      var card = track.querySelector('.review-card');
      if (!card) return track.clientWidth;
      var gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      return card.offsetWidth + gap;
    }

    function updateArrows() {
      if (!leftBtn || !rightBtn) return;
      leftBtn.classList.toggle('hidden', track.scrollLeft <= 2);
      rightBtn.classList.toggle('hidden', track.scrollLeft >= track.scrollWidth - track.clientWidth - 2);
    }

    if (leftBtn) leftBtn.addEventListener('click', function() {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      clearInterval(autoTimer);
    });
    if (rightBtn) rightBtn.addEventListener('click', function() {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      clearInterval(autoTimer);
    });

    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    setTimeout(updateArrows, 300);

    var autoTimer = setInterval(function() {
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    }, 4500);

    track.addEventListener('touchstart', function() { clearInterval(autoTimer); }, { passive: true });
  })();

  /* ══════════════════════════════════════════
     FAQ ACCORDION
  ══════════════════════════════════════════ */
  $$('.faq-item').forEach(item => {
    const btn = $('.faq-question', item);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      $$('.faq-item').forEach(fi => {
        fi.classList.remove('open');
        const q = $('.faq-question', fi);
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  /* ══════════════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════════════ */
  function easeOutQuart(t) { return 1 - (--t) * t * t * t; }

  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      
      const hH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
      const offset = hH + 8;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 800; // ms
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const ease = easeOutQuart(progress);
        window.scrollTo(0, startPosition + (distance * ease));
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }
      requestAnimationFrame(animation);
    });
  });

  /* ══════════════════════════════════════════
     ACTIVE NAV HIGHLIGHT
  ══════════════════════════════════════════ */
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  window.addEventListener('scroll', () => {
    const hH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
    const pos = window.scrollY + hH + 40;
    let activeId = null;
    sections.forEach(s => { if (s.offsetTop <= pos) activeId = s.id; });
    navLinks.forEach(l => { l.style.color = l.getAttribute('href') === '#' + activeId ? 'var(--pink)' : ''; });
  }, { passive: true });

  /* ══════════════════════════════════════════
     CATEGORY MODALS
  ══════════════════════════════════════════ */
  const categoryCards = $$('.cat-card');
  
  // Create modal container dynamically
  const modalHTML = `
    <div id="category-modal" class="modal-overlay" aria-hidden="true">
      <div class="modal-container">
        <button class="modal-close" aria-label="Close modal">&#10005;</button>
        <div class="modal-content-wrap">
          <div class="modal-image-col">
            <div id="modal-image" class="modal-image"></div>
          </div>
          <div class="modal-text-col">
             <div id="modal-icon" class="modal-icon-wrap"></div>
             <h3 id="modal-title" class="modal-title"></h3>
             <p id="modal-desc" class="modal-desc"></p>
             <a href="#contact" class="btn btn-gold modal-btn" onclick="document.getElementById('category-modal').classList.remove('open');">Inquire About This</a>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = $('#category-modal');
  const modalCloseBtn = $('.modal-close', modal);
  const mTitle = $('#modal-title', modal);
  const mDesc = $('#modal-desc', modal);
  const mIcon = $('#modal-icon', modal);
  const mImg = $('#modal-image', modal);

  function openCategoryModal(card) {
    const title = $('.cat-title', card).innerText;
    const desc = $('.cat-desc', card).innerText;
    const iconHTML = $('.cat-icon-wrap', card).innerHTML;
    // Extract bg image url
    const bgUrl = card.style.backgroundImage;

    mTitle.innerText = title;
    mDesc.innerText = desc;
    mIcon.innerHTML = iconHTML;
    mImg.style.backgroundImage = bgUrl;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCategoryModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  categoryCards.forEach(card => {
    // Make them look clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openCategoryModal(card));
  });

  if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeCategoryModal);
  if(modal) modal.addEventListener('click', (e) => {
    if(e.target === modal) closeCategoryModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeCategoryModal(); });

  /* ══════════════════════════════════════════
     BACK BUTTON INTERCEPTOR
  ══════════════════════════════════════════ */
  history.pushState({ __eb: true }, '');
  window.addEventListener('popstate', function () {
    // 1. Close category modal if open
    if (modal && modal.classList.contains('open')) {
      closeCategoryModal();
      history.pushState({ __eb: true }, '');
      return;
    }
    // 2. Close mobile menu if open
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
      history.pushState({ __eb: true }, '');
      return;
    }
    // 3. Scroll to top
    if (window.scrollY > 50) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState({ __eb: true }, '');
    }
  });

})();
