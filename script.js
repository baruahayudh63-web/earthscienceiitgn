document.addEventListener('DOMContentLoaded', () => {

  // 2. People Directory Filtering & Search Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('people-search');
  const personCards = document.querySelectorAll('.person-card');

  if (personCards.length > 0) {
    let currentFilter = 'all';
    let searchQuery = '';

    const filterCards = () => {
      personCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const text = card.textContent.toLowerCase();

        const matchesFilter = (currentFilter === 'all' || category === currentFilter);
        const matchesSearch = searchQuery === '' || text.includes(searchQuery);

        if (matchesFilter && matchesSearch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        filterCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterCards();
      });
    }

    // Parse URL parameter for filter
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
      const targetBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === filterParam);
      if (targetBtn) {
        targetBtn.click();
      }
    }
  }

  // 3. Photo Gallery Lightbox Modal
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');

  if (galleryItems.length > 0 && lightboxModal) {
    const lightboxImg = lightboxModal.querySelector('img');
    const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');
    const closeBtn = lightboxModal.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption')?.textContent || '';
        if (img) {
          lightboxImg.src = img.src;
          lightboxCaption.textContent = caption;
          lightboxModal.classList.add('active');
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
      });
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }
});
