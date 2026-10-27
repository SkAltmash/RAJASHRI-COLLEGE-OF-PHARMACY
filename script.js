/* =============================================
   RCP MEHKAR – PHARMACY COLLEGE WEBSITE
   Interactivity Script
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 500); // 500ms smooth delay
    });
    // Fallback if window load event already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 500);
    }
  }

  // ===== STICKY NAVBAR =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===== MOBILE MENU TOGGLE (HAMBURGER & DROPDOWNS) =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  if (hamburger && navLinks) {
    function closeMobileMenu() {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      const openDropdowns = navLinks.querySelectorAll('.dropdown.open, .dropdown.active');
      openDropdowns.forEach(d => {
        d.classList.remove('open');
        d.classList.remove('active');
      });
    }

    function toggleMobileMenu() {
      const isActive = navLinks.classList.toggle('active');
      hamburger.classList.toggle('active', isActive);
      hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      if (!isActive) {
        closeMobileMenu();
      }
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Handle dropdown menus on mobile and touch devices
    const dropdowns = navLinks.querySelectorAll('.dropdown');
    dropdowns.forEach(drop => {
      const dropTrigger = drop.querySelector(':scope > a');
      if (dropTrigger) {
        dropTrigger.addEventListener('click', (e) => {
          // In mobile view (<= 991px), first tap expands the dropdown submenu
          if (window.innerWidth <= 991) {
            if (!drop.classList.contains('open')) {
              e.preventDefault();
              // Close sibling dropdowns
              dropdowns.forEach(other => {
                if (other !== drop) {
                  other.classList.remove('open');
                  other.classList.remove('active');
                }
              });
              drop.classList.add('open');
              drop.classList.add('active');
            } else {
              // If already open, allow following the link and close the mobile menu
              closeMobileMenu();
            }
          }
        });
      }

      // Close mobile menu when clicking any submenu item inside drop-menu
      const subItems = drop.querySelectorAll('.drop-menu a');
      subItems.forEach(subItem => {
        subItem.addEventListener('click', () => {
          if (window.innerWidth <= 991) {
            closeMobileMenu();
          }
        });
      });
    });

    // Close mobile menu when clicking direct nav links (e.g. Home, Admissions, Faculty, etc.)
    const directLinks = navLinks.querySelectorAll(':scope > a');
    directLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
          closeMobileMenu();
        }
      });
    });

    // Close menu when clicking outside navbar
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active')) {
        const navbar = document.getElementById('navbar');
        if (navbar && !navbar.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Automatically reset mobile menu state when resizing window back to desktop (> 991px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && navLinks.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // ===== HERO SLIDER =====
  const heroSlider = document.getElementById('heroSlider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let slideInterval;

    // Create dots if not present
    if (dotsContainer && dotsContainer.children.length === 0) {
      slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    function updateSlides() {
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
      });
      if (dots.length > 0) {
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
        });
      }
    }

    function nextSlideFunc() {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlides();
    }

    function prevSlideFunc() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlides();
    }

    function goToSlide(index) {
      currentSlide = index;
      updateSlides();
      resetInterval();
    }

    function startInterval() {
      slideInterval = setInterval(nextSlideFunc, 6000); // 6s rotation
    }

    function resetInterval() {
      clearInterval(slideInterval);
      startInterval();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlideFunc();
        resetInterval();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlideFunc();
        resetInterval();
      });
    }

    startInterval();
  }

  // ===== STATS COUNTER ANIMATION =====
  const counterElements = document.querySelectorAll('.counter');
  if (counterElements.length > 0) {
    const runCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const count = parseInt(el.innerText, 10);
      const speed = target / 80; // duration control
      
      if (count < target) {
        el.innerText = Math.ceil(count + speed);
        setTimeout(() => runCounter(el), 20);
      } else {
        el.innerText = target;
      }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target); // only count once
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(counter => counterObserver.observe(counter));
  }

  // ===== ADMISSION ALERT CLOSE =====
  const admAlert = document.getElementById('admAlert');
  const closeAlert = document.getElementById('closeAlert');
  if (admAlert && closeAlert) {
    closeAlert.addEventListener('click', () => {
      admAlert.style.display = 'none';
    });
  }

  // ===== TESTIMONIAL SLIDER =====
  const testiSlider = document.getElementById('testiSlider');
  if (testiSlider) {
    const cards = testiSlider.querySelectorAll('.testi-card');
    const dotsContainer = document.getElementById('testiDots');
    let activeIndex = 0;
    let testiInterval;

    if (dotsContainer && dotsContainer.children.length === 0) {
      cards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showTestimonial(index));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    function showTestimonial(index) {
      activeIndex = index;
      cards.forEach((card, idx) => {
        card.classList.toggle('active', idx === activeIndex);
      });
      if (dots.length > 0) {
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });
      }
      resetTestiInterval();
    }

    function nextTestimonial() {
      activeIndex = (activeIndex + 1) % cards.length;
      showTestimonial(activeIndex);
    }

    function startTestiInterval() {
      testiInterval = setInterval(nextTestimonial, 5000); // 5s rotation
    }

    function resetTestiInterval() {
      clearInterval(testiInterval);
      startTestiInterval();
    }

    startTestiInterval();
  }

  // ===== NEWS & EVENTS SLIDER =====
  const newsTrack = document.getElementById('newsTrack');
  const newsPrevBtn = document.getElementById('newsPrev');
  const newsNextBtn = document.getElementById('newsNext');
  const newsDotsContainer = document.getElementById('newsDots');

  if (newsTrack && newsPrevBtn && newsNextBtn) {
    const newsCards = newsTrack.querySelectorAll('.news-card');

    function getScrollStep() {
      const firstCard = newsTrack.querySelector('.news-card');
      if (!firstCard) return 340;
      const trackStyle = window.getComputedStyle(newsTrack);
      const gap = parseFloat(trackStyle.gap) || 24;
      return firstCard.offsetWidth + gap;
    }

    // Build pagination dots
    if (newsDotsContainer && newsCards.length > 0) {
      newsDotsContainer.innerHTML = '';
      newsCards.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to news item ${idx + 1}`);
        dot.addEventListener('click', () => {
          const step = getScrollStep();
          newsTrack.scrollTo({ left: idx * step, behavior: 'smooth' });
          resetAutoSlide();
        });
        newsDotsContainer.appendChild(dot);
      });
    }

    function updateActiveDot() {
      if (!newsDotsContainer) return;
      const dots = newsDotsContainer.querySelectorAll('.dot');
      if (dots.length === 0) return;
      const step = getScrollStep();
      const currentIdx = Math.round(newsTrack.scrollLeft / step);
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === Math.min(currentIdx, newsCards.length - 1));
      });
    }

    newsPrevBtn.addEventListener('click', () => {
      const step = getScrollStep();
      if (newsTrack.scrollLeft <= 15) {
        newsTrack.scrollTo({ left: newsTrack.scrollWidth, behavior: 'smooth' });
      } else {
        newsTrack.scrollBy({ left: -step, behavior: 'smooth' });
      }
      resetAutoSlide();
    });

    newsNextBtn.addEventListener('click', () => {
      const step = getScrollStep();
      const maxScroll = newsTrack.scrollWidth - newsTrack.clientWidth;
      if (newsTrack.scrollLeft >= maxScroll - 15) {
        newsTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        newsTrack.scrollBy({ left: step, behavior: 'smooth' });
      }
      resetAutoSlide();
    });

    let scrollDebounce;
    newsTrack.addEventListener('scroll', () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(updateActiveDot, 40);
    }, { passive: true });

    // Auto-slide every 5s with pause on hover/touch
    let newsInterval = null;
    function startAutoSlide() {
      if (newsInterval) clearInterval(newsInterval);
      newsInterval = setInterval(() => {
        const step = getScrollStep();
        const maxScroll = newsTrack.scrollWidth - newsTrack.clientWidth;
        if (newsTrack.scrollLeft >= maxScroll - 15) {
          newsTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          newsTrack.scrollBy({ left: step, behavior: 'smooth' });
        }
      }, 5000);
    }

    function stopAutoSlide() {
      if (newsInterval) {
        clearInterval(newsInterval);
        newsInterval = null;
      }
    }

    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }

    newsTrack.addEventListener('mouseenter', stopAutoSlide);
    newsTrack.addEventListener('mouseleave', startAutoSlide);
    newsTrack.addEventListener('touchstart', stopAutoSlide, { passive: true });
    newsTrack.addEventListener('touchend', () => setTimeout(startAutoSlide, 2000), { passive: true });

    startAutoSlide();
  }

  // ===== SCROLL REVEAL EFFECT =====
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ===== SCROLL TO TOP BUTTON =====
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== CONTACT FORM VALIDATION =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fname = document.getElementById('fname');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const successMsg = document.getElementById('formSuccess');

    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Simple 10 digit phone format (ignoring spaces or prefix)
    const phoneRegex = /^[+]?[0-9]{10,13}$/;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (fname.value.trim().length < 3) {
        showError(fname, 'fnameErr', 'Name must be at least 3 characters.');
        isValid = false;
      } else {
        clearError(fname, 'fnameErr');
      }

      // Validate Phone
      // strip spaces/dashes for regex testing
      const cleanPhone = phone.value.replace(/[\s-]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        showError(phone, 'phoneErr', 'Please enter a valid mobile number (e.g. +91 9567914242).');
        isValid = false;
      } else {
        clearError(phone, 'phoneErr');
      }

      // Validate Email
      if (!emailRegex.test(email.value.trim())) {
        showError(email, 'emailErr', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(email, 'emailErr');
      }

      if (isValid) {
        // Prevent double submit
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Sending...';
        }

        // FormSubmit AJAX endpoint (sends leads directly to your email)
        const emailSubmitURL = 'https://formsubmit.co/ajax/rcpmehkar@gmail.com';

        fetch(emailSubmitURL, {
          method: 'POST',
          body: new FormData(contactForm)
        })
        .then(response => response.json())
        .then(data => {
          contactForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Send Message →';
          }
          if (successMsg) {
            successMsg.style.display = 'block';
            setTimeout(() => {
              successMsg.style.display = 'none';
            }, 6000);
          }
        })
        .catch(error => {
          console.error('Error!', error.message);
          alert('Inquiry submission failed. Please check connection and try again.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Send Message →';
          }
        });
      }
    });

    function showError(input, errId, msg) {
      input.classList.add('invalid');
      const errSpan = document.getElementById(errId);
      if (errSpan) {
        errSpan.innerText = msg;
      }
    }

    function clearError(input, errId) {
      input.classList.remove('invalid');
      const errSpan = document.getElementById(errId);
      if (errSpan) {
        errSpan.innerText = '';
      }
    }
  }

});

// Global newsletter subscribe helper
window.subscribeNewsletter = function() {
  const emailInput = document.getElementById('newsEmail');
  if (emailInput && emailInput.value.trim() !== '') {
    alert('Thank you for subscribing to our newsletter!');
    emailInput.value = '';
  } else {
    alert('Please enter a valid email address.');
  }
};

// ===== SITE SEARCH =====
(function() {
  const searchData = [
    { title: 'Home Page', url: 'index.html', section: 'Home', icon: '🏠', keywords: 'home rcp mehkar pharmacy college welcome principal' },
    { title: 'About the College', url: 'about.html', section: 'About', icon: '🏛️', keywords: 'about history rajashri rajgad college pharmacy mehkar vidarbha marathwada' },
    { title: 'Vision & Mission', url: 'about.html#vision', section: 'About', icon: '🎯', keywords: 'vision mission goals objectives quality education' },
    { title: 'College History', url: 'about.html#history', section: 'About', icon: '📜', keywords: 'history established 2023 founded timeline milestones' },
    { title: 'Management Desk', url: 'about.html#management', section: 'About', icon: '👥', keywords: 'management president secretary jadhao prataprao rushikesh leadership desk' },
    { title: 'PCI & MSBTE Affiliations', url: 'about.html#approvals', section: 'About', icon: '✅', keywords: 'approvals msbte pci affiliated accredited recognition' },
    { title: 'D.Pharm – Diploma in Pharmacy', url: 'courses.html#dpharm', section: 'Courses', icon: '💊', keywords: 'dpharm diploma pharmacy 2 years 60 seats eligibility 10+2 science' },
    { title: 'B.Pharm – Bachelor of Pharmacy', url: 'courses.html#bpharm', section: 'Courses', icon: '🔬', keywords: 'bpharm bachelor pharmacy 4 years 60 seats pcb pcm science degree' },
    { title: 'Admissions', url: 'admissions.html', section: 'Admissions', icon: '📋', keywords: 'admissions apply form fees scholarship entrance seats open' },
    { title: 'Our Team (Faculty & Staff)', url: 'faculty.html', section: 'Our Team', icon: '👨‍🏫', keywords: 'faculty staff professors teachers experts phd mpharm principal hod lecturers' },
    { title: 'Dept. of Pharmaceutics', url: 'departments.html#pharmaceutics', section: 'Departments', icon: '🧪', keywords: 'pharmaceutics tablet dissolution dosage formulation machine room punching friability' },
    { title: 'Dept. of Pharmacology', url: 'departments.html#pharmacology', section: 'Departments', icon: '💉', keywords: 'pharmacology drugs anatomy physiology kymograph rotarod actophotometer aphe' },
    { title: 'Dept. of Pharmaceutical Chemistry', url: 'departments.html#chemistry', section: 'Departments', icon: '⚗️', keywords: 'pharmaceutical chemistry hplc uv spectrophotometer analytical synthesis purification' },
    { title: 'Dept. of Pharmacognosy', url: 'departments.html#pharmacognosy', section: 'Departments', icon: '🌿', keywords: 'pharmacognosy herbal plant natural crude drug herbarium soxhlet extraction microscope' },
    { title: 'Infrastructure & Facilities', url: 'infrastructure.html', section: 'Infrastructure', icon: '🏢', keywords: 'infrastructure labs library hostel sports internet seminar hall canteen smart classroom' },
    { title: 'Campus Gallery', url: 'gallery.html', section: 'Gallery', icon: '📷', keywords: 'gallery photos campus events life pictures images labs students' },
    { title: 'Contact Admissions', url: 'contact.html', section: 'Contact', icon: '📞', keywords: 'contact phone email address location mehkar buldhana maharashtra enquiry admission office' }
  ];

  const searchInput = document.getElementById('searchInput');
  const searchResultsBox = document.getElementById('searchResults');
  const searchBtn = document.getElementById('searchBtn');

  if (!searchInput || !searchResultsBox) return;

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      searchResultsBox.classList.remove('active');
      searchResultsBox.innerHTML = '';
      return;
    }

    const results = searchData.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q)
    ).slice(0, 6);

    if (results.length === 0) {
      searchResultsBox.innerHTML = `<div class="search-no-results">No results found for "<strong>${query}</strong>"</div>`;
    } else {
      searchResultsBox.innerHTML = results.map(item => `
        <div class="search-result-item" onclick="window.location.href='${item.url}'">
          <div class="search-result-icon">${item.icon}</div>
          <div>
            <div class="search-result-title">${item.title}</div>
            <div class="search-result-section">${item.section}</div>
          </div>
        </div>
      `).join('');
    }
    searchResultsBox.classList.add('active');
  }

  searchInput.addEventListener('input', () => performSearch(searchInput.value));

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim().toLowerCase();
      const first = searchData.find(item =>
        item.title.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q)
      );
      if (first) window.location.href = first.url;
      searchResultsBox.classList.remove('active');
    }
    if (e.key === 'Escape') {
      searchResultsBox.classList.remove('active');
      searchInput.value = '';
    }
    if (e.key === 'ArrowDown') {
      const items = searchResultsBox.querySelectorAll('.search-result-item');
      if (items.length > 0) { e.preventDefault(); items[0].focus(); }
    }
  });

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (searchInput.value.trim()) performSearch(searchInput.value);
      else searchInput.focus();
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search')) {
      searchResultsBox.classList.remove('active');
    }
  });
})();

