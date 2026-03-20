(function () {
  'use strict';

  var header = document.getElementById('header');
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navLinks = document.querySelectorAll('.nav__link');
  var yearEl = document.getElementById('year');
  var toTopBtn = document.getElementById('to-top');
  var contactForm = document.getElementById('contact-form');

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

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

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

  // Scrollspy (active section highlighting)
  if ('IntersectionObserver' in window && navLinks.length) {
    var linkById = {};
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#') linkById[href.slice(1)] = a;
    });

    var sections = Object.keys(linkById)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    var activeId = null;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        activeId = entry.target.id;
      });
      if (!activeId) return;
      navLinks.forEach(function (a) { a.classList.remove('is-active'); });
      if (linkById[activeId]) linkById[activeId].classList.add('is-active');
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.01 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // Contact form -> prefilled mailto (no backend)
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('name') || {}).value || '';
      var email = (document.getElementById('email') || {}).value || '';
      var message = (document.getElementById('message') || {}).value || '';

      var to = 'your.email@example.com';
      var subject = 'New project inquiry';
      var body = [
        'Name: ' + name,
        'Email: ' + email,
        '',
        message
      ].join('\\n');

      var mailto = 'mailto:' + encodeURIComponent(to) +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }
})();
