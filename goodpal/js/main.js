/* ============================================
   GoodPal — Main JavaScript
   Interactions · Animations · Navigation
   ============================================ */

(function () {
  'use strict';

  // === 1. MOBILE MENU TOGGLE ===
  const hamburger = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // === 2. SMOOTH SCROLL FOR ANCHOR LINKS ===
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // === 3. ACTIVE NAV LINK HIGHLIGHTING ===
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop().split('#')[0] || 'index.html';

    if (linkPage === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' && linkPage === 'index.html') {
      link.classList.add('active');
    }
  });

  // === 4. FAQ ACCORDION ===
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // === 5. TOPIC PILL MULTI-SELECT ===
  const selectablePills = document.querySelectorAll('.topic-pill-select');
  const maxPills = 4; // Companion limit

  selectablePills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      const formCard = pill.closest('.form-card');
      if (formCard && formCard.querySelector('#companion-form')) {
        const currentlySelected = formCard.querySelectorAll('.topic-pill-select.selected').length;
        if (!pill.classList.contains('selected') && currentlySelected >= maxPills) {
          alert('Please select up to 4 topics.');
          return;
        }
      }
      pill.classList.toggle('selected');
    });
  });

  // === 6. SCROLL-TRIGGERED FADE-IN ANIMATIONS ===
  const fadeElements = document.querySelectorAll('.fade-in, .animate-on-scroll');

  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Add hero-animate for things that might need it
          if (entry.target.classList.contains('animate-on-scroll')) {
            entry.target.classList.add('hero-animate');
          }
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
      if (el.classList.contains('animate-on-scroll')) {
        el.classList.add('hero-animate');
      }
    });
  }

  // === 7. NAV STYLE CHANGE ON SCROLL ===
  const nav = document.querySelector('.nav');

  if (nav) {
    function updateNav() {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  // === 8. FORM VALIDATION VISUAL FEEDBACK ===
  const forms = document.querySelectorAll('form');

  forms.forEach(function (form) {
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');

    // Real-time validation on blur
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });

      input.addEventListener('input', function () {
        // Clear error state on typing
        if (input.classList.contains('error')) {
          input.classList.remove('error');
        }
      });
    });

    // Form submission
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;

      inputs.forEach(function (input) {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Show success state
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Submitted ✓';
          submitBtn.style.background = '#4CAF50';
          submitBtn.style.borderColor = '#4CAF50';
          submitBtn.disabled = true;

          setTimeout(function () {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            submitBtn.disabled = false;
            form.reset();
            // Clear selected pills
            form.querySelectorAll('.topic-pill-select.selected').forEach(function (pill) {
              pill.classList.remove('selected');
            });
            inputs.forEach(function (input) {
              input.classList.remove('success');
            });
          }, 2500);
        }
      }
    });
  });

  function validateField(input) {
    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');

    if (isRequired && !value) {
      input.classList.add('error');
      input.classList.remove('success');
      return false;
    }

    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        input.classList.add('error');
        input.classList.remove('success');
        return false;
      }
    }

    if (value) {
      input.classList.add('success');
      input.classList.remove('error');
    }

    return true;
  }

})();
