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
    alert('Some images may not display correctly on certain devices. For a better viewing experience, please try another device or visit my Instagram page to see some of the images.');
    localStorage.setItem('popupDisplayed', 'true');
  }

  var galleryContainer = document.querySelector(".gallery-images");

  // Load the images for the initial category (All)
  loadImages('all');

  function loadImages(category) {
    galleryContainer.innerHTML = ''; // Clear existing images

    const categoryImages = {
      'Alex': 71, 'Korba': 45, 'Car': 35, 'Maadi': 45,
      'OldCairo': 13, 'PORT': 22, 'Rand': 22, 'new': 20
    };

    if (category === 'all') {
      // If 'all' is selected, load all categories
      Object.keys(categoryImages).forEach(cat => loadCategoryImages(cat, categoryImages[cat]));
    } else {
      // Load a specific category
      loadCategoryImages(category, categoryImages[category] || 0);
    }

    // Use Intersection Observer for lazy loading
    let lazyImages = document.querySelectorAll('.lazy');
    let imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let img = entry.target;
          if (img && img.dataset && img.dataset.src) {
            img.src = img.dataset.src;
            img.onload = () => {
              console.log(`Successfully loaded image: ${img.src}`);
              img.classList.remove('lazy');
              img.classList.add('loaded');
            };
            img.onerror = () => {
              console.error(`Failed to load image: ${img.dataset.src}`);
              img.src = '/image/NotLoaded.jpg';
              img.classList.remove('lazy');
              img.classList.add('error');
            };
            observer.unobserve(img);
          }
        }
      });
    }, { rootMargin: "0px 0px 500px 0px" });

    lazyImages.forEach(img => {
      if (img) {
        imageObserver.observe(img);
      }
    });
  }
  function loadCategoryImages(category, totalImages) {
    var imageFolder = "/image/All/"; // Verify this path is correct
    var fileExtensions = ['.jpeg', '.jpg', '.png','.HEIC']; // Add more if needed
  
    for (var i = 1; i <= totalImages; i++) {
      try {
        var galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item", category.toLowerCase());
  
        var img = document.createElement("img");
        img.alt = `${category} Image ${i}`;
        img.classList.add("lazy");
  
        // Try different file extensions
        var imagePath = `${imageFolder}${category} (${i})`;
        img.dataset.src = imagePath + fileExtensions[0]; // Default to first extension
  
        console.log(`Preparing to load image: ${img.dataset.src}`);
  
        img.onerror = function() {
          var currentExtIndex = fileExtensions.indexOf(this.src.split('.').pop());
          if (currentExtIndex < fileExtensions.length - 1) {
            // Try next extension
            this.src = imagePath + fileExtensions[currentExtIndex + 1];
          } else {
            console.error(`Failed to load image: ${this.src}`);
            this.src = '/image/NotLoaded.jpg';
            this.classList.remove('lazy');
            this.classList.add('error');
          }
        };
  
        galleryItem.appendChild(img);
        galleryContainer.appendChild(galleryItem);
      } catch (error) {
        console.error(`Error creating image element for ${category} (${i}):`, error);
      }
    }
  }
  
  // Add this function to check server for image existence
  function checkServerForImage(imagePath) {
    return fetch(imagePath, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return true;
      })
      .catch(e => {
        console.error(`Image not found on server: ${imagePath}`, e);
        return false;
      });
  }
  
  // Modify the Intersection Observer callback
  let imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let img = entry.target;
        if (img && img.dataset && img.dataset.src) {
          checkServerForImage(img.dataset.src).then(exists => {
            if (exists) {
              img.src = img.dataset.src;
            } else {
              img.src = '/image/NotLoaded.jpg';
              img.classList.remove('lazy');
              img.classList.add('error');
            }
          });
        }
      }
    });
  }, { rootMargin: "0px 0px 500px 0px" });

  // Filter images based on the selected category
  window.filterImages = function(category) {
    loadImages(category);
    
    // Update active button
    document.querySelectorAll('.filters button').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`.filters button[onclick="filterImages('${category}')"]`).classList.add('active');
  }

  // Modal functionality
  var modal = document.getElementById("modal");
  var modalImg = document.getElementById("modal-img");
  var captionText = document.getElementById("modal-caption");

  document.addEventListener("click", function (e) {
    if (e.target.tagName === "IMG" && e.target.closest(".gallery-item")) {
      modal.style.display = "flex";
      modalImg.src = e.target.src || e.target.dataset.src;
      // captionText.innerHTML = e.target.alt;
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

  // Function for debugging image paths
  function checkImagePaths() {
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach(img => {
      const testImg = new Image();
      testImg.onload = () => console.log(`Image exists: ${img.dataset.src}`);
      testImg.onerror = () => console.error(`Image does not exist: ${img.dataset.src}`);
      testImg.src = img.dataset.src;
    });
  }

  // Call this function after loading images
  setTimeout(checkImagePaths, 1000); // Delay to ensure all image elements are created
});