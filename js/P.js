var loader = document.getElementById("preload");
window.addEventListener("load", function() {
  loader.style.display = "none";
});

    document.addEventListener("DOMContentLoaded", function() {
      var galleryContainer = document.querySelector(".gallery-images");
      var totalImages = 190;
      var imageFolder = "/image/All/";

      for (var i = 1; i <= totalImages; i++) {
        var galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");

        var img = document.createElement("img");
        img.dataset.src = imageFolder + "i (" + i + ").JPG"; 
        img.alt = "Image " + i;
        img.classList.add("lazy");

        // var description = document.createElement("div");
        // description.classList.add("description");
        // description.textContent = "Description of Image " + i;

        galleryItem.appendChild(img);
        // galleryItem.appendChild(description);
        galleryContainer.appendChild(galleryItem);
      }

      let lazyImages = document.querySelectorAll('.lazy');
      let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => {
        observer.observe(img);
      });
    });

    var modal = document.getElementById("modal");
    var modalImg = document.getElementById("modal-img");
    var captionText = document.getElementById("modal-caption");

    document.addEventListener("click", function(e) {
      if (e.target.tagName === "IMG" && e.target.closest(".gallery-item")) {
        modal.style.display = "block";
        modalImg.src = e.target.src;
        captionText.innerHTML = e.target.nextElementSibling.innerText;
      }
    });

    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
      modal.style.display = "none";
    };