document.addEventListener("DOMContentLoaded", function () {
  const loader = document.querySelector('.spiral-loading-wrapper');
  const target = document.querySelector('.work-container');

  if (!loader || !target) return;

  const observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        loader.classList.add('fade-out');
        observer.disconnect();
        break;
      }
    }
  });

  observer.observe(target, { childList: true });
});