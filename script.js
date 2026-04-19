(function () {
  'use strict';

  var header = document.getElementById('header');
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navLinks = document.querySelectorAll('.nav__link');
  var yearEl = document.getElementById('year');
  var toTopBtn = document.getElementById('to-top');

  // Current year in footer
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  var linkById = {};
  navLinks.forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') linkById[href.slice(1)] = a;
  });

  function setNavActive(id) {
    navLinks.forEach(function (a) { a.classList.remove('is-active'); });
    if (id && linkById[id]) linkById[id].classList.add('is-active');
  }

  function sectionsInNavOrder() {
    var out = [];
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;
      var el = document.getElementById(href.slice(1));
      if (el) out.push(el);
    });
    return out;
  }

  var ignoreScrollSpyUntil = 0;

  function syncNavActiveFromScroll() {
    if (Date.now() < ignoreScrollSpyUntil) return;

    var sections = sectionsInNavOrder();
    if (!sections.length) return;

    var headerEl = document.getElementById('header');
    var offset = headerEl ? headerEl.offsetHeight + 20 : 84;
    var refY = window.scrollY + offset;

    var activeId = null;
    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].getBoundingClientRect().top + window.scrollY;
      if (top <= refY) activeId = sections[i].id;
    }
    setNavActive(activeId);
  }

  var scrollNavScheduled = false;
  function onScrollNav() {
    if (scrollNavScheduled) return;
    scrollNavScheduled = true;
    window.requestAnimationFrame(function () {
      scrollNavScheduled = false;
      syncNavActiveFromScroll();
    });
  }

  window.addEventListener('scroll', onScrollNav, { passive: true });
  window.addEventListener('resize', onScrollNav, { passive: true });
  window.addEventListener('hashchange', syncNavActiveFromScroll);
  syncNavActiveFromScroll();

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) === '#') {
        setNavActive(href.slice(1));
        // Smooth-scroll can leave `refY` in the previous section for a few frames; keep the clicked tab highlighted briefly.
        ignoreScrollSpyUntil = Date.now() + 600;
      }

      if (navMenu && navToggle) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  // Optional: subtle header background on scroll
  if (header && window.requestAnimationFrame) {
    function onScroll() {
      header.style.background = window.scrollY > 20
        ? 'rgba(15, 15, 18, 0.95)'
        : 'rgba(15, 15, 18, 0.85)';
    }
    window.addEventListener('scroll', function () {
      requestAnimationFrame(onScroll);
    }, { passive: true });
  }

  // Services carousel (arrows + wrap-around; scrollbar hidden in CSS)
  var servicesScroller = document.getElementById('services-scroller');
  var servicesPrev = document.getElementById('services-prev');
  var servicesNext = document.getElementById('services-next');
  if (servicesScroller && servicesPrev && servicesNext) {
    var servicesTrack = servicesScroller.querySelector('.services__track');
    var servicesCards = servicesTrack ? servicesTrack.querySelectorAll('.info-card') : [];

    function servicesCardCount() {
      return servicesCards.length;
    }

    function servicesCurrentIndex() {
      var n = servicesCardCount();
      if (!n) return 0;
      var sl = Math.round(servicesScroller.scrollLeft);
      var maxScroll = servicesScroller.scrollWidth - servicesScroller.clientWidth;
      if (maxScroll > 0 && sl >= maxScroll - 2) return n - 1;

      var best = 0;
      for (var i = 0; i < n; i++) {
        var left = servicesCards[i].offsetLeft;
        if (left <= sl + 12) best = i;
      }
      return best;
    }

    function servicesGo(delta) {
      var n = servicesCardCount();
      if (!n) return;
      var idx = servicesCurrentIndex();
      var nextIdx = (idx + delta + n) % n;
      var wraps = (delta === 1 && idx === n - 1) || (delta === -1 && idx === 0);
      var left = servicesCards[nextIdx].offsetLeft;
      servicesScroller.scrollTo({
        left: left,
        behavior: wraps ? 'auto' : 'smooth'
      });
    }

    servicesPrev.addEventListener('click', function () {
      servicesGo(-1);
    });
    servicesNext.addEventListener('click', function () {
      servicesGo(1);
    });

    servicesScroller.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        servicesGo(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        servicesGo(1);
      }
    });
  }

  // Back to top button
  if (toTopBtn) {
    function syncToTopVisibility() {
      var shouldShow = window.scrollY > 600;
      toTopBtn.classList.toggle('is-visible', shouldShow);
    }
    window.addEventListener('scroll', syncToTopVisibility, { passive: true });
    syncToTopVisibility();
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
