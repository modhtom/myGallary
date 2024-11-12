document.addEventListener("DOMContentLoaded", function () {
  const galleryContainer = document.querySelector(".gallery-images");

  // Load initial images and set up lazy loading for additional images
  loadImages('all', 10);  // Load only 10 images for "All" filter

  function loadImages(category, limit = 10) {
    galleryContainer.innerHTML = '';  // Clear existing images

    const categoryImages = {
      'Alex': 71, 'Korba': 45, 'Car': 35, 'Maadi': 45,
      'OldCairo': 13, 'PORT': 22, 'Rand': 22, 'new': 40
    };

    // If 'all' is selected, only load a limited number initially
    if (category === 'all') {
      Object.keys(categoryImages).forEach(cat => loadCategoryImages(cat, categoryImages[cat], limit));
    } else {
      // Load only a specific category with a limit
      loadCategoryImages(category, categoryImages[category] || 0, limit);
    }

    setupLazyLoading();
  }

  function loadCategoryImages(category, totalImages, limit) {
    const imageFolder = "/image/All/";
    const fileExtensions = ['.jpeg', '.jpg', '.png', '.HEIC'];
    const numImagesToLoad = Math.min(totalImages, limit);

    for (let i = 1; i <= numImagesToLoad; i++) {
      try {
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item", category.toLowerCase());

        const img = document.createElement("img");
        img.alt = `${category} Image ${i}`;
        img.classList.add("lazy");

        // Load images with lazy loading
        const imagePath = `${imageFolder}${category} (${i})`;
        img.dataset.src = imagePath + fileExtensions[0];

        galleryItem.appendChild(img);
        galleryContainer.appendChild(galleryItem);
      } catch (error) {
        console.error(`Error creating image element for ${category} (${i}):`, error);
      }
    }
  }

  function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img && img.dataset && img.dataset.src) {
            img.src = img.dataset.src;
            img.onload = () => {
              img.classList.remove('lazy');
              img.classList.add('loaded');
            };
            img.onerror = () => {
              img.src = '/image/NotLoaded.jpg';
              img.classList.remove('lazy');
              img.classList.add('error');
            };
            observer.unobserve(img);
          }
        }
      });
    }, { rootMargin: "0px 0px 300px 0px" });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Filter images based on the selected category and set a limit
  window.filterImages = function (category) {
    loadImages(category, 10);  // Load 10 images initially

    // Update active button styling
    document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.filters button[onclick="filterImages('${category}')"]`).classList.add('active');
  }
});
