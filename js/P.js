document.addEventListener("DOMContentLoaded", function () {
  var galleryContainer = document.querySelector(".gallery-images");

  // Load the images for the initial category (All)
  loadImages('all');

  // Function to load images based on the category
  function loadImages(category) {
    galleryContainer.innerHTML = ''; // Clear existing images

    if (category === 'all') {
      // If 'all' is selected, load all categories sequentially
      loadCategoryImages('Alex', 71);
      loadCategoryImages('Korba', 21);
      loadCategoryImages('Car', 35);
      loadCategoryImages('Maadi', 30);
      loadCategoryImages('OldCairo', 13);
      loadCategoryImages('Rand', 20);
    } else {
      // Load a specific category
      var totalImages = 0;

      if (category === 'Alex') totalImages = 71;
      else if (category === 'Korba') totalImages = 21;
      else if (category === 'Car') totalImages = 35;
      else if (category === 'Maadi') totalImages = 30;
      else if (category === 'OldCairo') totalImages = 13;
      else if (category === 'Rand') totalImages = 20;

      loadCategoryImages(category, totalImages);
    }

    // Lazy loading function to load images when they are visible
    let lazyImages = document.querySelectorAll('.lazy');
    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let img = entry.target;
          img.src = img.dataset.src;

          console.log('Loading image:', img.dataset.src);  // Debug: Log the image source

          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      img.onerror = function () {
        this.src = '/image/NotLoaded.jpg';  // Fallback image
      };
      observer.observe(img);
    });
    
  }

  // Function to load images from a specific category folder
  function loadCategoryImages(category, totalImages) {
    var imageFolder = "/image/All/";

    for (var i = 1; i <= totalImages; i++) {
      var galleryItem = document.createElement("div");
      galleryItem.classList.add("gallery-item");

      var img = document.createElement("img");
      img.dataset.src = `${imageFolder}${category} (${i}).JPG`; // Dynamic path based on category
      img.alt = `${category} Image ${i}`;
      img.classList.add("lazy");

      // Debug: Log the created image path
      console.log('Created image:', img.dataset.src);

      galleryItem.appendChild(img);
      galleryContainer.appendChild(galleryItem);
    }
  }

  // Filter images based on the selected category
  function filterImages(category) {
    loadImages(category); // Reload images from the correct folder based on category
  }

  // Attach filterImages function to the global scope so buttons can call it
  window.filterImages = filterImages;

  var modal = document.getElementById("modal");
  var modalImg = document.getElementById("modal-img");
  var captionText = document.getElementById("modal-caption");

  document.addEventListener("click", function (e) {
    if (e.target.tagName === "IMG" && e.target.closest(".gallery-item")) {
      modal.style.display = "block";
      modalImg.src = e.target.src;
      captionText.innerHTML = e.target.alt;
    }
  });

  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  };
});