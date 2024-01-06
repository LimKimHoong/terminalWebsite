let lightMode = true;

$(document).ready(function () {

  // handle the event of switching light-dark mode
  $("#light-dark-mode-switch").change(function () {
    $("body").toggleClass("dark-mode");
    $("nav").toggleClass("dark");
    $("section").toggleClass("dark-section");
    $("footer").toggleClass("dark-footer");
    lightMode = !lightMode;
  });
});