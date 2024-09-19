document.addEventListener("DOMContentLoaded", function () {

  // Hide preloader after the page loads
  window.addEventListener('load', function () {
    document.getElementById('preload').style.display = 'none';
  });

  // Fallback to hide preloader after 1 minute even if page is not loaded
  setTimeout(function () {
    document.getElementById('preload').style.display = 'none';
  }, 60000); 

  if (!localStorage.getItem('popupDisplayed')) {
    alert('Some images may not display correctly on certain devices. For a better viewing experience, please try another device or visit my Instagram page to some of the images.');
    localStorage.setItem('popupDisplayed', 'true');
  }

  var galleryContainer = document.querySelector(".gallery-images");

  // Load the images for the initial category (All)
  loadImages('all');

  // Function to load images based on the category
  function loadImages(category) {
    galleryContainer.innerHTML = ''; // Clear existing images

    if (category === 'all') {
      // If 'all' is selected, load all categories sequentially
      loadCategoryImages('Alex', 71);
      loadCategoryImages('Korba', 23);
      loadCategoryImages('Car', 35);
      loadCategoryImages('Maadi', 45);
      loadCategoryImages('OldCairo', 13);
      loadCategoryImages('PORT', 22);
      loadCategoryImages('Rand', 21);
    } else {
      // Load a specific category
      var totalImages = 0;

      if (category === 'Alex') totalImages = 71;
      else if (category === 'Korba') totalImages = 23;
      else if (category === 'Car') totalImages = 35;
      else if (category === 'Maadi') totalImages = 45;
      else if (category === 'OldCairo') totalImages = 13;
      else if (category === 'Rand') totalImages = 21;
      else if (category === 'PORT') totalImages = 22;

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
      img.dataset.src = `${imageFolder}${category} (${i}).jpeg`; // Dynamic path based on category
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
      modal.style.display = "flex";
      modalImg.src = e.target.src || e.target.dataset.src;
      modal.classList.add("show");
    }
  });

  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  };

  // Close modal when clicking outside the image
  modal.onclick = function(event) {
    if (event.target === modal) {
      span.onclick();
    }
  };
});

document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filters button');
  const galleryImages = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove 'active' class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add 'active' class to the clicked button
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      galleryImages.forEach(image => {
        if (filter === 'all' || image.classList.contains(filter)) {
          image.style.display = 'block';
        } else {
          image.style.display = 'none';
        }
      });
    });
  });
});

function filterImages(category) {
  const filterButtons = document.querySelectorAll('.filters button');
  const galleryImages = document.querySelectorAll('.gallery-item');

  // Remove 'active' class from all buttons
  filterButtons.forEach(btn => btn.classList.remove('active'));
  
  // Add 'active' class to the clicked button
  const clickedButton = document.querySelector(`.filters button[onclick="filterImages('${category}')"]`);
  if (clickedButton) {
    clickedButton.classList.add('active');
  }

  galleryImages.forEach(image => {
    if (category === 'all' || image.classList.contains(category)) {
      image.style.display = 'block';
    } else {
      image.style.display = 'none';
    }
  });
}