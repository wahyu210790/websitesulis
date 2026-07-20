document.addEventListener('DOMContentLoaded', () => {
  // === STICKY HEADER ===
  const header = document.getElementById('site-header');
  
  const handleScroll = () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  // Initial check
  handleScroll();
  window.addEventListener('scroll', handleScroll);

  // === MOBILE NAVIGATION ===
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      
      // Toggle body scroll
      if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // === ACTIVE NAV LINK ===
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    // Check if it's the index page (can be / or /index.html)
    if ((currentPath === '/' || currentPath.endsWith('index.html')) && linkPath.endsWith('index.html')) {
      link.classList.add('active');
    } 
    // Check other pages
    else if (currentPath !== '/' && !currentPath.endsWith('index.html') && linkPath.includes(currentPath.split('/').pop())) {
      link.classList.add('active');
    }
  });

  // === ANIMATE ON SCROLL ===
  const animateElements = document.querySelectorAll('.animate-fade-up, .animate-fade-in');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // === STATS COUNTER ANIMATION (Home Page) ===
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-target'));
          let startValue = 0;
          const duration = 2000;
          let startTime = null;

          const updateCounter = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentValue = Math.floor(easeProgress * endValue);
            target.textContent = currentValue;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              target.textContent = endValue;
            }
          };

          requestAnimationFrame(updateCounter);
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    statNumbers.forEach(stat => statsObserver.observe(stat));
  }

  // === PROJECT FILTER (Projects Page) ===
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add to clicked
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.classList.remove('hide');
            // Small delay to allow display:block to apply before animating opacity
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            // Wait for transition before hiding
            setTimeout(() => {
              card.classList.add('hide');
            }, 300);
          }
        });
      });
    });
  }

  // === CONTACT FORM VALIDATION (Contact Page) ===
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset errors
      document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
      
      let isValid = true;
      
      // Validate Name
      const name = document.getElementById('name');
      if (!name.value.trim()) {
        document.getElementById('name-error').textContent = 'Full name is required';
        isValid = false;
      }
      
      // Validate Email
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        document.getElementById('email-error').textContent = 'Email address is required';
        isValid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        isValid = false;
      }
      
      // Validate Subject
      const subject = document.getElementById('subject');
      if (!subject.value) {
        document.getElementById('subject-error').textContent = 'Please select a subject';
        isValid = false;
      }
      
      // Validate Message
      const message = document.getElementById('message');
      if (!message.value.trim()) {
        document.getElementById('message-error').textContent = 'Message is required';
        isValid = false;
      } else if (message.value.trim().length < 10) {
        document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
        isValid = false;
      }
      
      if (isValid) {
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const formSuccess = document.getElementById('form-success');
        
        // Show loading state
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        submitBtn.disabled = true;
        
        // Simulate API call / Email sending
        // TODO: Integrate with actual email backend (e.g., Formspree, EmailJS, PHP)
        setTimeout(() => {
          // Reset button
          btnText.classList.remove('hidden');
          btnLoading.classList.add('hidden');
          submitBtn.disabled = false;
          
          // Show success message and reset form
          formSuccess.classList.remove('hidden');
          contactForm.reset();
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            formSuccess.classList.add('hidden');
          }, 5000);
        }, 1500);
      }
    });
  }
});
