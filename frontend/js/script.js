$(document).ready(function() {
  var app = $.spapp({
    defaultView: '#home',
    templateDir: './views/'
  });


  app.run();
});


$(document).on('click', '.nav-link', function() {
  $('.nav-link').removeClass('active');
  $(this).addClass('active');
});

window.addEventListener('scroll', function() {
  var navbar = document.getElementById('mainNav');
  if (window.scrollY > 100) {
    navbar.classList.add('navbar-scrolled');
  } else {
    navbar.classList.remove('navbar-scrolled');
  }
});