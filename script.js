// the hover of the navlinks to change color when this section is in the viewport
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".links-container a");

  function removeActiveClasses() {
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });
  }

  function addActiveClass(currentSectionId) {
    navLinks.forEach((link) => {
      if (link.getAttribute("href").substring(1) === currentSectionId) {
        link.classList.add("active");
      }
    });
  }

  function handleScroll() {
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const scrollY = window.scrollY;

      if (
        scrollY >= sectionTop - sectionHeight / 3 &&
        scrollY < sectionTop + sectionHeight
      ) {
        const currentSectionId = section.getAttribute("id");
        removeActiveClasses();
        addActiveClass(currentSectionId);
      }
    });
  }

  window.addEventListener("scroll", handleScroll);

  handleScroll();
});

// custom alert open

function showCustomAlert() {
  const customAlert = document.getElementById("custom-alert");
  const customAlertOverlay = document.getElementById("custom-alert-overlay");
  customAlert.style.display = "block";
  customAlertOverlay.style.display = "block";
}

function closeCustomAlert() {
  const customAlert = document.getElementById("custom-alert");
  const customAlertOverlay = document.getElementById("custom-alert-overlay");
  customAlert.style.display = "none";
  customAlertOverlay.style.display = "none";
}

document
  .querySelector(".bx.bxs-phone")
  .addEventListener("click", function (event) {
    event.preventDefault();
    showCustomAlert();
  });


// scroll to the top of the screen

  document.addEventListener('DOMContentLoaded', function() {
    var scrollButton = document.querySelector('.back-to-top a');
  
    scrollButton.addEventListener('click', function(e) {
      e.preventDefault();
      var targetId = this.getAttribute('href').substring(1);
      var targetElement = document.getElementById(targetId);
  
      if (targetElement) {
        var offsetTop = targetElement.offsetTop;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  