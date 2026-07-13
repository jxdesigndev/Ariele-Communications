/* ============================================================
   NEXUS — Main JavaScript
   Mobile menu, scroll animations, FAQ accordion, form validation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------
  // 1. Mobile Menu Toggle
  // --------------------------------------------------
  const hamburger = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-menu');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --------------------------------------------------
  // 2. Nav Shadow on Scroll
  // --------------------------------------------------
  const siteNav = document.querySelector('.site-nav');
  if (siteNav) {
    const updateNavShadow = () => {
      siteNav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', updateNavShadow, { passive: true });
    updateNavShadow();
  }

  // --------------------------------------------------
  // 3. Active Nav Link Highlighting
  // --------------------------------------------------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPage = href.split('/').pop();

    if (
      linkPage === currentPage ||
      (currentPage === '' && linkPage === 'index.html') ||
      (currentPage === 'index.html' && linkPage === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  // --------------------------------------------------
  // 4. IntersectionObserver Scroll Animations
  // --------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --------------------------------------------------
  // 5. FAQ Accordion
  // --------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all others
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // --------------------------------------------------
  // 6. Form Validation
  // --------------------------------------------------
  const form = document.getElementById('nexus-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      // Required fields
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        const group = field.closest('.form-group');
        const value = field.value.trim();

        if (!value) {
          isValid = false;
          if (group) group.classList.add('error');
        }
      });

      // Email validation
      const emailField = form.querySelector('#form-email');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          isValid = false;
          const group = emailField.closest('.form-group');
          if (group) {
            group.classList.add('error');
            const err = group.querySelector('.form-error');
            if (err) err.textContent = 'Please enter a valid email address.';
          }
        }
      }

      // Phone validation (Nigerian number)
      const phoneField = form.querySelector('#form-phone');
      if (phoneField && phoneField.value.trim()) {
        const phoneClean = phoneField.value.replace(/[\s\-()]/g, '');
        const phoneRegex = /^(\+234|234|0)[789]\d{9}$/;
        if (!phoneRegex.test(phoneClean)) {
          isValid = false;
          const group = phoneField.closest('.form-group');
          if (group) {
            group.classList.add('error');
            const err = group.querySelector('.form-error');
            if (err) err.textContent = 'Please enter a valid Nigerian phone number.';
          }
        }
      }

      if (isValid) {
        // Simulate submission
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          form.style.display = 'none';
          if (formSuccess) formSuccess.classList.add('show');
        }, 1200);
      }
    });

    // Clear error on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group) group.classList.remove('error');
      });
    });
  }

  // --------------------------------------------------
  // 7. Smooth Scroll for Anchor Links
  // --------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --------------------------------------------------
  // 8. Counter Animation for Stats
  // --------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = el.getAttribute('data-count');
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';

            // If target is numeric, animate
            const num = parseFloat(target);
            if (!isNaN(num)) {
              let current = 0;
              const increment = num / 40;
              const timer = setInterval(() => {
                current += increment;
                if (current >= num) {
                  current = num;
                  clearInterval(timer);
                }
                el.textContent = prefix + Math.ceil(current) + suffix;
              }, 30);
            } else {
              el.textContent = prefix + target + suffix;
            }

            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(el => counterObserver.observe(el));
  }
});
