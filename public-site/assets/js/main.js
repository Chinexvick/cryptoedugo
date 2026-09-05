// CrypEduGo — shared front-end behaviour (frontend-only, no backend)

document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    }));
  }

  /* ---- Reveal-on-scroll ----
     IMPORTANT: elements injected later by JS (course cards, tables, etc.) also
     carry .reveal and would otherwise stay at opacity:0 forever, because the
     observer below only ever saw the elements present at page load. A
     MutationObserver picks up anything added afterwards so dynamically
     rendered content is never left invisible. */
  let revealObserver = null;

  function observeReveal(el) {
    if (el.classList.contains('in')) return;
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('in');
  }

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  }

  document.querySelectorAll('.reveal').forEach(observeReveal);

  // Watch for .reveal elements added to the DOM after load.
  if ('MutationObserver' in window) {
    new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.classList && node.classList.contains('reveal')) observeReveal(node);
          if (node.querySelectorAll) node.querySelectorAll('.reveal').forEach(observeReveal);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  document.querySelectorAll('.curriculum-row').forEach(row => {
    row.addEventListener('click', () => row.classList.toggle('open'));
  });

  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrap').querySelector('input');
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  document.querySelectorAll('[data-admin-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-admin-tab');
      document.querySelectorAll('[data-admin-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
      const view = document.getElementById('view-' + target);
      if (view) view.classList.add('active');
      document.querySelectorAll('.admin-scrim, .admin-side').forEach(el => el.classList.remove('open'));
    });
  });

  const adminHam = document.querySelector('.admin-topbar .hamburger');
  const adminSide = document.querySelector('.admin-side');
  const adminScrim = document.querySelector('.admin-scrim');
  if (adminHam && adminSide) {
    adminHam.addEventListener('click', () => {
      adminSide.classList.add('open');
      if (adminScrim) adminScrim.classList.add('open');
    });
    if (adminScrim) adminScrim.addEventListener('click', () => {
      adminSide.classList.remove('open');
      adminScrim.classList.remove('open');
    });
  }

  document.querySelectorAll('.upload-drop').forEach(zone => {
    ['dragenter', 'dragover'].forEach(evt => zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(evt => zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.remove('drag'); }));
    zone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file) { const label = zone.querySelector('b'); if (label) label.textContent = file.name; }
    });
  });

  const chatMessages = document.querySelector('.chat-messages');
  const chatForm = document.querySelector('.chat-input');
  if (chatForm && chatMessages) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = chatForm.querySelector('input');
      if (!input.value.trim()) return;
      const msg = document.createElement('div');
      msg.className = 'msg mine';
      msg.innerHTML = `<div class="avatar">You</div><div><div class="bubble">${input.value.replace(/</g, '&lt;')}</div><div class="meta">Just now</div></div>`;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      input.value = '';
    });
  }

  const roomsToggle = document.querySelector('[data-toggle-rooms]');
  const roomsPanel = document.querySelector('.chat-rooms');
  if (roomsToggle && roomsPanel) roomsToggle.addEventListener('click', () => roomsPanel.classList.toggle('open'));

  document.querySelectorAll('.room-item').forEach(r => {
    r.addEventListener('click', () => {
      document.querySelectorAll('.room-item').forEach(o => o.classList.remove('active'));
      r.classList.add('active');
      if (roomsPanel) roomsPanel.classList.remove('open');
    });
  });

  document.querySelectorAll('[data-demo-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = 'Please wait…';
      setTimeout(() => {
        btn.textContent = original;
        if (form.getAttribute('data-redirect')) window.location.href = form.getAttribute('data-redirect');
      }, 900);
    });
  });

  document.querySelectorAll('.filter-pill, .select-pill').forEach(p => {
    p.addEventListener('click', () => {
      if (!p.classList.contains('select-pill')) {
        document.querySelectorAll('.filter-pill').forEach(o => o.classList.remove('active'));
        p.classList.add('active');
      }
    });
  });

  /* ---- Site-wide search overlay (built once, works on every page) ---- */
  (function () {
    const searchTriggers = document.querySelectorAll('.icon-btn[aria-label="Search"]');
    if (!searchTriggers.length) return;

    const scrim = document.createElement('div');
    scrim.className = 'search-overlay-scrim';
    scrim.id = 'searchOverlayScrim';

    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'searchOverlay';
    overlay.innerHTML = `
      <div class="search-overlay-inner">
        <div class="search-overlay-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.3" y1="15.3" x2="20" y2="20"/></svg>
          <input type="text" id="searchOverlayInput" placeholder="Search courses, e.g. &quot;Solidity&quot;, &quot;DeFi&quot;, &quot;NFT&quot;…" autocomplete="off">
          <button type="button" class="search-overlay-close" id="searchOverlayClose" aria-label="Close search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="search-overlay-suggest">
          <div class="label">Popular searches</div>
          <div class="search-overlay-tags">
            <a href="courses.html">Blockchain Fundamentals</a>
            <a href="courses.html">Solidity</a>
            <a href="courses.html">DeFi</a>
            <a href="courses.html">NFTs</a>
            <a href="courses.html">Smart Contract Security</a>
            <a href="bundles.html">Learning Paths</a>
          </div>
        </div>
      </div>`;

    document.body.appendChild(scrim);
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#searchOverlayInput');

    function openSearch(e) {
      if (e) e.preventDefault();
      overlay.classList.add('open');
      scrim.classList.add('open');
      setTimeout(() => input.focus(), 150);
    }
    function closeSearch() {
      overlay.classList.remove('open');
      scrim.classList.remove('open');
    }

    searchTriggers.forEach(btn => btn.addEventListener('click', openSearch));
    scrim.addEventListener('click', closeSearch);
    overlay.querySelector('#searchOverlayClose').addEventListener('click', closeSearch);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSearch();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = 'courses.html?q=' + encodeURIComponent(input.value.trim());
      }
    });
  })();

  /* ---- Toast notifications (used by wishlist + waitlist actions) ---- */
  const toastStack = document.createElement('div');
  toastStack.className = 'toast-stack';
  toastStack.id = 'toastStack';
  document.body.appendChild(toastStack);

  window.showToast = function (message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg><span></span>';
    toast.querySelector('span').textContent = message;
    toastStack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  };

  /* ---- Wishlist: toggle + persist across pages via localStorage ---- */
  (function () {
    function getWishlist() {
      try { return JSON.parse(localStorage.getItem('bva_wishlist') || '[]'); }
      catch (e) { return []; }
    }
    function setWishlist(list) {
      try { localStorage.setItem('bva_wishlist', JSON.stringify(list)); } catch (e) {}
    }
    function courseKeyFor(btn) {
      const card = btn.closest('.course-card');
      if (!card) return null;
      const titleEl = card.querySelector('.course-title');
      return titleEl ? titleEl.textContent.trim() : null;
    }

    const wishlist = getWishlist();
    document.querySelectorAll('.course-save').forEach(btn => {
      if (btn.hasAttribute('onclick')) return; // these are remove-from-cart / remove-from-wishlist buttons, not save toggles
      const key = courseKeyFor(btn);
      if (key && wishlist.includes(key)) btn.classList.add('saved');

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const k = courseKeyFor(btn);
        if (!k) return;
        let list = getWishlist();
        if (list.includes(k)) {
          list = list.filter(x => x !== k);
          btn.classList.remove('saved');
          if (window.showToast) window.showToast('Removed from wishlist');
        } else {
          list.push(k);
          btn.classList.add('saved');
          if (window.showToast) window.showToast('Saved to wishlist');
        }
        setWishlist(list);
      });
    });
  })();

  /* ---- Waitlist button (course detail page) ---- */
  document.querySelectorAll('[data-waitlist-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.showToast) window.showToast("You're on the waitlist — we'll email you");
    });
  });

  /* ---- Share button (course detail page) ---- */
  document.querySelectorAll('[data-share-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          if (window.showToast) window.showToast('Link copied to clipboard');
        }).catch(() => {
          if (window.showToast) window.showToast('Copy this page\'s URL to share');
        });
      } else if (window.showToast) {
        window.showToast('Copy this page\'s URL to share');
      }
    });
  });

  /* ---- Live search filtering on course grids ---- */
  (function () {
    const searchBox = document.querySelector('.search-pill input');
    const grid = document.querySelector('.course-grid');
    if (!searchBox || !grid) return;

    function applyFilter(term) {
      const t = term.trim().toLowerCase();
      grid.querySelectorAll('.course-card').forEach(card => {
        const title = (card.querySelector('.course-title') || {}).textContent || '';
        const tags = (card.querySelector('.course-desc') || {}).textContent || '';
        const match = !t || title.toLowerCase().includes(t) || tags.toLowerCase().includes(t);
        card.style.display = match ? '' : 'none';
      });
    }

    // Prefill from ?q= in URL
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      searchBox.value = q;
      applyFilter(q);
    }
    searchBox.addEventListener('input', () => applyFilter(searchBox.value));
  })();

  /* ---- Cart badge: reflect the REAL cart count, not a hardcoded number ---- */
  (function () {
    function updateCartBadge() {
      var count = 0;
      try {
        count = (JSON.parse(localStorage.getItem('crypedugo_cart') || '[]') || []).length;
      } catch (e) { count = 0; }
      document.querySelectorAll('[data-cart-badge]').forEach(function (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? '' : 'none';
      });
    }
    updateCartBadge();
    // Keep it in sync if the cart changes in another tab, or after add/remove here.
    window.addEventListener('storage', updateCartBadge);
    window.updateCartBadge = updateCartBadge;
  })();

});
