/* ==========================================================================
   Department of Earth Sciences | IIT Gandhinagar
   Interactive Logic: Scroll Depth HUD, Filters, Lightbox Modal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC SUBTERRANEAN DEPTH HUD TRACKER
  const depthHudVal = document.getElementById('depth-val');
  const depthHudLayer = document.getElementById('depth-layer');
  
  const layers = [
    { threshold: 0.1, name: 'Topsoil & Atmosphere', depth: '0m' },
    { threshold: 0.25, name: 'Alluvial Sediments', depth: '150m' },
    { threshold: 0.45, name: 'Upper Crust Bedrock', depth: '850m' },
    { threshold: 0.65, name: 'Deep Metamorphic Rock', depth: '2,100m' },
    { threshold: 0.85, name: 'Basaltic Mantle Zone', depth: '3,800m' },
    { threshold: 1.0, name: 'Magma Core Layer', depth: '5,000m+' }
  ];

  window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const currentLayer = layers.find(l => scrollPercent <= l.threshold) || layers[layers.length - 1];
    
    if (depthHudVal && depthHudLayer) {
      depthHudVal.textContent = currentLayer.depth;
      depthHudLayer.textContent = currentLayer.name;
    }

    // Active nav link highlighting
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('nav ul a');
    
    let currentSectionId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 2. TAB SWITCHING (Academics / Research)
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      const container = btn.closest('.tabs-container');
      
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // 3. PEOPLE DIRECTORY FILTER & SEARCH
  const peopleSearchInput = document.getElementById('people-search');
  const peopleGrid = document.getElementById('people-grid');
  const categoryFilterBtns = document.querySelectorAll('.filter-btn');

  let activeCategory = 'all';

  function filterPeople() {
    const query = peopleSearchInput ? peopleSearchInput.value.toLowerCase() : '';
    const cards = peopleGrid ? peopleGrid.querySelectorAll('.person-card') : [];

    cards.forEach(card => {
      const name = card.querySelector('.person-name').textContent.toLowerCase();
      const role = card.querySelector('.person-role').textContent.toLowerCase();
      const research = card.querySelector('.person-research').textContent.toLowerCase();
      const category = card.getAttribute('data-category');

      const matchesSearch = name.includes(query) || role.includes(query) || research.includes(query);
      const matchesCategory = activeCategory === 'all' || category === activeCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (peopleSearchInput) {
    peopleSearchInput.addEventListener('input', filterPeople);
  }

  categoryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      filterPeople();
    });
  });

  // 4. LIGHTBOX MODAL FOR GALLERY
  const galleryCards = document.querySelectorAll('.gallery-card');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalImage = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.gallery-overlay').textContent;
      
      if (modalImage && modalCaption && modalOverlay) {
        modalImage.src = img.src;
        modalCaption.textContent = caption;
        modalOverlay.classList.add('active');
      }
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }
});
