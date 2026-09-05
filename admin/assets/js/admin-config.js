window.PUBLIC_SITE_URL = 'https://40f44.netlify.app';
document.addEventListener('DOMContentLoaded', function () {
  var base = (window.PUBLIC_SITE_URL || '').replace(/\/$/, '');
  if (!base) return;
  document.querySelectorAll('[data-public-link]').forEach(function (a) {
    a.setAttribute('href', base + '/' + a.getAttribute('data-public-link'));
    a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
  });
});
