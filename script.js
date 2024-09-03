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
  