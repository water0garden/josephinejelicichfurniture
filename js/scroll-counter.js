function initScrollCounter() {
  const list = document.querySelector('ul.image-scroll-list');
  const counter = document.getElementById('scrollCounter');
  const currentEl = document.getElementById('scrollCurrent');
  const totalEl = document.getElementById('scrollTotal');

  if (!list || !counter || !currentEl || !totalEl) return;

  const items = list.querySelectorAll('li');
  const total = items.length;
  totalEl.textContent = total;

  function updateCounter() {
    const scrollLeft = list.scrollLeft;
    const itemWidth = list.clientWidth;
    let index = Math.round(scrollLeft / itemWidth) + 1;
    if (index < 1) index = 1;
    if (index > total) index = total;
    currentEl.textContent = index;
  }

  let ticking = false;
  list.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateCounter();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateCounter();
}