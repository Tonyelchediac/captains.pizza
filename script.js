document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section"); // Select all sections
  const navLinks = document.querySelectorAll(".links-container a"); // Select all nav links

  // Function to remove 'active' class from all nav links
  function removeActiveClasses() {
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });
  }

  // Function to add 'active' class to the current nav link
  function addActiveClass(currentSectionId) {
    navLinks.forEach((link) => {
      if (link.getAttribute("href").substring(1) === currentSectionId) {
        link.classList.add("active");
      }
    });
  }

  // Function to handle scroll events
  function handleScroll() {
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const scrollY = window.scrollY;

      // Check if the section is in the viewport
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

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll);

  // Call handleScroll on page load to set the initial active state
  handleScroll();
});

// Function to show custom alert
function showCustomAlert() {
  const customAlert = document.getElementById("custom-alert");
  const customAlertOverlay = document.getElementById("custom-alert-overlay");
  customAlert.style.display = "block";
  customAlertOverlay.style.display = "block"; // Show overlay
}

// Function to close custom alert
function closeCustomAlert() {
  const customAlert = document.getElementById("custom-alert");
  const customAlertOverlay = document.getElementById("custom-alert-overlay");
  customAlert.style.display = "none";
  customAlertOverlay.style.display = "none"; // Hide overlay
}

// Event listener for the phone icon
document
  .querySelector(".bx.bxs-phone")
  .addEventListener("click", function (event) {
    event.preventDefault();
    showCustomAlert();
  });
