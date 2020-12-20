document.addEventListener('DOMContentLoaded', function () {
  init();
});

function init() {
  var navToggle = document.getElementById('nav-toggle');
  navToggle.addEventListener('click', function () {
    var header = document.getElementById('header');
    header.classList.toggle('open');
    if (header.classList.contains('open')) {
      var overlay = document.createElement('div');
      overlay.id = 'overlay';
      overlay.classList.add('overlay');
      document.body.append(overlay);
    } else {
      var overlay = document.getElementById('overlay');
      overlay.remove();
    }
  });

  // Slider logic
  var insightSlider = document.getElementById('insight-slider');
  slider(insightSlider);
  var eventSlider = document.getElementById('event-slider');
  slider(eventSlider);
}

function slider(sliderElem) {
  var viewport = sliderElem.querySelector('.slider-viewport');
  var cards = viewport.querySelectorAll('.slider-card');
  var selectors = sliderElem.querySelectorAll('.slider-selectors .slider-selector');
  selectors.forEach(function (node, index) {
    node.addEventListener('click', function () {
      var currentCard = index + 1;
      var d = index * -375;
      viewport.setAttribute('style', `left: ${d}px`);

      cards.forEach(function (card) {
        card.classList.remove('active');
      });
      selectors.forEach(function (selector) {
        selector.classList.remove('active');
      });

      cards[index].classList.add('active');
      selectors[index].classList.add('active');
    });
  });
}
