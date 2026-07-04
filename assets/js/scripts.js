document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', event => {
      if (!mainNav.classList.contains('open')) return;
      if (mainNav.contains(event.target) || navToggle.contains(event.target)) return;
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  if (header) {
    const updateHeader = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader);
  }

  if (backToTop) {
    const toggleTopButton = () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    };
    toggleTopButton();
    window.addEventListener('scroll', toggleTopButton);
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const runFallbackHeroSlider = () => {
    const slides = document.querySelectorAll('.hero-swiper .hero-slide');
    const dotsWrap = document.querySelector('.hero-swiper .swiper-pagination');
    const next = document.querySelector('.hero-swiper .swiper-button-next');
    const prev = document.querySelector('.hero-swiper .swiper-button-prev');
    if (!slides.length) return;

    let current = 0;
    let timer;

    const dots = Array.from(slides).map((_, index) => {
      if (!dotsWrap) return null;
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'fallback-dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => showSlide(index));
      dotsWrap.appendChild(dot);
      return dot;
    });

    const showSlide = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('fallback-active', slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        if (dot) dot.classList.toggle('active', dotIndex === current);
      });
      window.clearInterval(timer);
      timer = window.setInterval(() => showSlide(current + 1), 5500);
    };

    next?.addEventListener('click', () => showSlide(current + 1));
    prev?.addEventListener('click', () => showSlide(current - 1));
    showSlide(0);
  };

  if (window.Swiper) {
    if (document.querySelector('.hero-swiper')) {
      new Swiper('.hero-swiper', {
        loop: true,
        speed: 1200,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
        navigation: {
          nextEl: '.hero-swiper .swiper-button-next',
          prevEl: '.hero-swiper .swiper-button-prev',
        },
      });
    }

    if (document.querySelector('.testimonial-carousel')) {
      new Swiper('.testimonial-carousel', {
        loop: true,
        speed: 900,
        slidesPerView: 1,
        spaceBetween: 24,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
        },
        pagination: { el: '.testimonial-carousel .swiper-pagination', clickable: true },
        breakpoints: {
          820: { slidesPerView: 2 },
          1120: { slidesPerView: 3 },
        },
      });
    }
  } else {
    runFallbackHeroSlider();
  }

  if (window.AOS) {
    document.documentElement.classList.add('aos-ready');
    AOS.init({ duration: 800, once: true, offset: 80 });
  }

  const counters = document.querySelectorAll('.counter');
  const statsSection = document.querySelector('.statistics-section');
  let countersPlayed = false;

  const animateCounters = () => {
    if (countersPlayed) return;
    countersPlayed = true;

    counters.forEach(counter => {
      const target = Number(counter.getAttribute('data-target')) || 0;
      const suffix = counter.getAttribute('data-suffix') || '+';
      const duration = 1400;
      const startTime = performance.now();

      const updateCount = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = progress < 1 ? value : `${target}${suffix}`;
        if (progress < 1) requestAnimationFrame(updateCount);
      };

      requestAnimationFrame(updateCount);
    });
  };

  if (statsSection && counters.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.35 });
    observer.observe(statsSection);
  } else if (counters.length) {
    animateCounters();
  }

  document.querySelectorAll('.accordion-header').forEach(accordion => {
    const item = accordion.parentElement;
    const body = accordion.nextElementSibling;
    if (item?.classList.contains('active') && body) {
      body.style.maxHeight = `${body.scrollHeight}px`;
    }

    accordion.addEventListener('click', () => {
      if (!item || !body) return;
      item.classList.toggle('active');
      body.style.maxHeight = item.classList.contains('active') ? `${body.scrollHeight}px` : null;
    });
  });

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const name = document.getElementById('name')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!name || !phone || !email || !subject || !message) {
        formFeedback.textContent = 'Please complete all fields to submit the form.';
        formFeedback.style.color = '#E74C3C';
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[0-9+\-\s()]{7,15}$/;

      if (!phonePattern.test(phone)) {
        formFeedback.textContent = 'Please enter a valid phone number.';
        formFeedback.style.color = '#E74C3C';
        return;
      }

      if (!emailPattern.test(email)) {
        formFeedback.textContent = 'Please enter a valid email address.';
        formFeedback.style.color = '#E74C3C';
        return;
      }

      formFeedback.textContent = 'Thank you! Your message has been received. We will contact you soon.';
      formFeedback.style.color = '#22c55e';
      contactForm.reset();
    });
  }

  document.querySelectorAll('.newsletter form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input) return;
      input.value = '';
      input.placeholder = 'Thank you for subscribing';
    });
  });
});
