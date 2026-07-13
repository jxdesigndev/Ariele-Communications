/* ===================================================
   ARIELE COMMUNICATIONS — MAIN JAVASCRIPT
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Active Nav Based on Page ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Nav Shadow on Scroll ---
  const nav = document.getElementById('main-nav');
  if (nav) {
    let lastScrollY = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 20) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
      lastScrollY = scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- IntersectionObserver Scroll Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Hero Globe Particles Animation ---
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    createParticles(particlesContainer, 25);
  }

  function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      // Randomize position and timing
      const left = Math.random() * 100;
      const size = Math.random() * 2 + 2;
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 15;
      const drift = (Math.random() - 0.5) * 100;

      particle.style.left = `${left}%`;
      particle.style.bottom = `-10px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.setProperty('--drift', `${drift}px`);
      particle.style.opacity = '0';
      particle.style.boxShadow = `0 0 ${size * 2}px rgba(201, 168, 76, 0.3)`;

      container.appendChild(particle);
    }
  }

  // --- Form Dropdown Interaction ---
  const formSelect = document.getElementById('contact-interest');
  if (formSelect) {
    formSelect.addEventListener('change', function() {
      if (this.value) {
        this.style.color = 'var(--text-on-light)';
      } else {
        this.style.color = 'var(--text-on-light-muted)';
      }
    });
  }

  // --- Contact Form Handling ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Message Sent ✓';
      submitBtn.style.background = '#2E7D32';
      submitBtn.style.borderColor = '#2E7D32';
      submitBtn.style.color = '#fff';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
