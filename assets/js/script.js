/* ==========================================================================
   PORTOFOLIO DIGITAL REFLEKSI PEMBELAJARAN LK 2 - SCRIPT.JS
   Interactive functionality: Tabs, Filter, Search, Modal, Theme, Print
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reading Progress Bar
  const progressBar = document.getElementById('reading-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  });

  // 2. Dark / Light Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  const currentTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
    } else {
      themeIcon.className = 'fas fa-moon';
    }
  }

  // 3. Meeting Tab Filtering
  const tabButtons = document.querySelectorAll('.tab-btn');
  const meetingCards = document.querySelectorAll('.meeting-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-target');
      meetingCards.forEach(card => {
        if (target === 'all' || card.getAttribute('data-meeting') === target) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 4. Live Search in Reflection Cards
  const searchInput = document.getElementById('reflection-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      meetingCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });

      // Also reset tab button if searching
      if (query.length > 0) {
        tabButtons.forEach(b => b.classList.remove('active'));
        const allBtn = document.querySelector('.tab-btn[data-target="all"]');
        if (allBtn) allBtn.classList.add('active');
      }
    });
  }

  // 5. Deep Dive Accordion
  const accordionToggles = document.querySelectorAll('.deep-dive-toggle');
  accordionToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      const body = toggle.nextElementSibling;
      if (body) {
        body.classList.toggle('open');
      }
    });
  });

  // 6. Modal Viewer for Artefacts
  const modal = document.getElementById('artefact-modal');
  const modalImg = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalDownload = document.getElementById('modal-download');
  const modalClose = document.getElementById('modal-close');
  const viewArtefactButtons = document.querySelectorAll('.btn-view-artefact');

  viewArtefactButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const imgUrl = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      const download = btn.getAttribute('data-download');

      if (modalImg) modalImg.src = imgUrl;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.innerHTML = desc;
      if (modalDownload) {
        if (download) {
          modalDownload.href = download;
          modalDownload.style.display = 'inline-flex';
        } else {
          modalDownload.style.display = 'none';
        }
      }

      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  }

  // 7. Print Handler
  const printButtons = document.querySelectorAll('.btn-print-portfolio');
  printButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // open all accordions before printing for complete document export
      document.querySelectorAll('.deep-dive-body').forEach(b => b.classList.add('open'));
      document.querySelectorAll('.meeting-card').forEach(c => c.style.display = 'block');
      setTimeout(() => {
        window.print();
      }, 300);
    });
  });

  // 8. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 9. Smooth Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});

