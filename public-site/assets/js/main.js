// Neko Academy — shared front-end behaviour (frontend-only, no backend)
// Runs as an immediately-invoked function rather than waiting for
// DOMContentLoaded: this script tag sits at the end of <body> on every page,
// so the DOM is already parsed by the time it runs. This matters because the
// window.* helpers defined below (watchSlowLoad, openReactionPicker, etc.)
// must exist BEFORE any <script type="module"> tag that follows runs —
// module scripts execute before DOMContentLoaded fires, so waiting for that
// event here would leave those helpers undefined when modules call them.
(() => {

  /* ---- Referral capture: whichever page a ?ref=CODE link lands on
     (a course page, the homepage, etc.), remember it so create-account.html
     can credit the referrer even if the visitor browses around first. ---- */
  (function () {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) localStorage.setItem('crypedugo_ref_code', ref);
  })();

  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
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

  /* ---- Approved reaction emoji set (community chat) ---- */
  window.APPROVED_REACTIONS = [
    '🙏','🤣','🤙','🙌','🫳','👊','💥','😊','👏','👋','🤲','🫴','👐','👌','🫡','🤔',
    '❤️‍🔥','🎂','😇','😩','🥲','🔥','❤️','✅','🥹','🥺','😂','🙃','🥳','🤩','😔','😌',
    '😏','😜','😝','😛','😠','😡','🤬','😓','😥','😨','😰','🤯','😲','😯','😦','🙁','😢','☹️'
  ];

  /* ---- Reaction picker: opens a small emoji grid anchored to a button, clamped to stay
     within the nearest scrolling chat container so it never spills outside the chat screen. ---- */
  window.openReactionPicker = function (anchorEl, onPick) {
    document.querySelectorAll('.reaction-picker').forEach(function (el) { el.remove(); });

    const picker = document.createElement('div');
    picker.className = 'reaction-picker';
    window.APPROVED_REACTIONS.forEach(function (emoji) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = emoji;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        picker.remove();
        onPick(emoji);
      });
      picker.appendChild(btn);
    });

    // Anchor inside the message row, and clamp against the nearest scrolling chat/list
    // container so the picker always stays within the chat screen, never outside it.
    const containerEl = anchorEl.closest('.comm-msg, .inbox-item') || anchorEl.parentElement;
    const scrollBounds = anchorEl.closest('.comm-feed, .inbox-list') || containerEl;
    containerEl.style.position = containerEl.style.position || 'relative';
    containerEl.appendChild(picker);

    requestAnimationFrame(function () {
      const anchorRect = anchorEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const boundsRect = scrollBounds.getBoundingClientRect();
      const pickerRect = picker.getBoundingClientRect();

      const desiredLeft = anchorRect.left - containerRect.left;
      const maxLeft = boundsRect.right - containerRect.left - pickerRect.width - 8;
      const minLeft = boundsRect.left - containerRect.left + 8;
      const left = Math.max(minLeft, Math.min(desiredLeft, maxLeft));

      const desiredTop = anchorEl.offsetTop + anchorEl.offsetHeight + 6;
      const wouldOverflowBottom = containerRect.top + desiredTop + pickerRect.height > boundsRect.bottom;
      const top = wouldOverflowBottom ? (anchorEl.offsetTop - pickerRect.height - 6) : desiredTop;

      picker.style.left = left + 'px';
      picker.style.top = Math.max(0, top) + 'px';
    });

    function closeOnOutsideClick(e) {
      if (!picker.contains(e.target) && e.target !== anchorEl) {
        picker.remove();
        document.removeEventListener('click', closeOnOutsideClick);
      }
    }
    setTimeout(function () { document.addEventListener('click', closeOnOutsideClick); }, 0);
  };

  /* ---- Trial countdown: renders "Xh Ym Zs" (or "Xd Yh") into an element, live-updating.
     Returns a stop() handle. Call again on the same element id is safe (auto-clears). ---- */
  window._trialTimers = window._trialTimers || {};
  window.startTrialCountdown = function (elId, endsAtIso) {
    if (window._trialTimers[elId]) clearInterval(window._trialTimers[elId]);
    const el = document.getElementById(elId);
    if (!el) return;
    function tick() {
      const diff = new Date(endsAtIso).getTime() - Date.now();
      if (diff <= 0) {
        el.textContent = 'expired';
        clearInterval(window._trialTimers[elId]);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.textContent = d > 0 ? `${d}d ${h}h ${m}m` : `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
    }
    tick();
    window._trialTimers[elId] = setInterval(tick, 1000);
  };

  /* ---- Trial welcome popup: shown once after signup. Reads/writes localStorage so it
     never re-appears after being dismissed. ---- */
  window.maybeShowTrialPopup = function (trialEndsAtIso) {
    if (localStorage.getItem('crypedugo_trial_popup_seen')) return;
    if (!trialEndsAtIso || new Date(trialEndsAtIso) <= new Date()) return;
    localStorage.setItem('crypedugo_trial_popup_seen', '1');

    const scrim = document.createElement('div');
    scrim.className = 'trial-modal-scrim';
    scrim.innerHTML = `
      <div class="trial-modal">
        <div class="icon">🎁</div>
        <h2>Your 3-day free trial has started!</h2>
        <p>Explore every course on Neko Academy free for the next 3 days. After your trial ends, you'll need to purchase a course to keep watching its lessons.</p>
        <div class="trial-countdown">
          <div class="unit"><b id="trialPopupD">3</b><span>Days</span></div>
          <div class="unit"><b id="trialPopupH">00</b><span>Hours</span></div>
          <div class="unit"><b id="trialPopupM">00</b><span>Mins</span></div>
          <div class="unit"><b id="trialPopupS">00</b><span>Secs</span></div>
        </div>
        <button type="button" class="btn btn-primary btn-block" id="trialPopupCloseBtn">Start exploring courses</button>
      </div>`;
    document.body.appendChild(scrim);
    requestAnimationFrame(() => scrim.classList.add('open'));

    function tick() {
      const diff = new Date(trialEndsAtIso).getTime() - Date.now();
      if (diff <= 0) return;
      document.getElementById('trialPopupD').textContent = Math.floor(diff / 86400000);
      document.getElementById('trialPopupH').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
      document.getElementById('trialPopupM').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      document.getElementById('trialPopupS').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    }
    tick();
    const timer = setInterval(tick, 1000);

    function close() {
      clearInterval(timer);
      scrim.classList.remove('open');
      setTimeout(() => scrim.remove(), 250);
    }
    document.getElementById('trialPopupCloseBtn').addEventListener('click', close);
    scrim.addEventListener('click', (e) => { if (e.target === scrim) close(); });
  };

  /* ---- Slow-load apology: call start() when a fetch begins; call stop() when it resolves.
     If it's still pending after `timeoutMs`, an apologetic banner is shown in `container`. ---- */
  window.watchSlowLoad = function (container, timeoutMs) {
    if (!container) return { stop: function () {} };
    let done = false;
    const timer = setTimeout(function () {
      if (done) return;
      const note = document.createElement('div');
      note.className = 'slow-load-note';
      note.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="42" stroke-dashoffset="12"/></svg>' +
        '<span>Sorry, this is taking longer than usual — we\'re still trying to reach the server.</span>' +
        '<button type="button" class="btn btn-sm btn-outline">Retry</button>';
      note.querySelector('button').addEventListener('click', function () { window.location.reload(); });
      container.prepend(note);
    }, timeoutMs || 8000);
    return {
      stop: function () {
        done = true;
        clearTimeout(timer);
        const note = container.querySelector && container.querySelector('.slow-load-note');
        if (note) note.remove();
      }
    };
  };

  /* ---- Hero stat counter: animates [data-count-to] elements from 0 once
     they scroll into view. Supports decimals (data-decimals) and a suffix
     (data-suffix, e.g. "+"). ---- */
  (function () {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseFloat(el.getAttribute('data-count-to'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        // Ease-out so it settles smoothly instead of stopping abruptly.
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach((el) => io.observe(el));
    } else {
      counters.forEach(animateCounter);
    }
  })();

  /* ---- Help tooltips: any element with data-help="explanation text" gets a
     small "?" affordance. Click toggles a popover clamped to stay on-screen;
     click anywhere outside (or the "?" again) closes it. ---- */
  (function () {
    document.querySelectorAll('[data-help]').forEach((target) => {
      const tip = document.createElement('span');
      tip.className = 'help-tip';
      tip.textContent = '?';
      tip.setAttribute('role', 'button');
      tip.setAttribute('aria-label', 'What does this do?');
      target.insertAdjacentElement('afterend', tip);

      tip.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const existing = document.querySelector('.help-tip-popover');
        if (existing) {
          const wasMine = existing.dataset.owner === target.getAttribute('data-help');
          existing.remove();
          if (wasMine) return;
        }

        const pop = document.createElement('div');
        pop.className = 'help-tip-popover';
        pop.dataset.owner = target.getAttribute('data-help');
        pop.textContent = target.getAttribute('data-help');
        document.body.appendChild(pop);

        const tipRect = tip.getBoundingClientRect();
        const popRect = pop.getBoundingClientRect();
        let left = tipRect.left - popRect.width / 2 + tipRect.width / 2;
        left = Math.max(10, Math.min(left, window.innerWidth - popRect.width - 10));
        let top = tipRect.bottom + 8;
        if (top + popRect.height > window.innerHeight - 10) {
          top = tipRect.top - popRect.height - 8;
        }
        pop.style.left = left + 'px';
        pop.style.top = top + 'px';

        function closeOnOutside(evt) {
          if (!pop.contains(evt.target) && evt.target !== tip) {
            pop.remove();
            document.removeEventListener('click', closeOnOutside);
          }
        }
        setTimeout(() => document.addEventListener('click', closeOnOutside), 0);
      });
    });
  })();

  /* ---- Free-trial promo popup: shown 30s after landing on the homepage,
     once per browser (localStorage-based — there is no reliable way to key
     this by IP from client-side JS). Links straight into signup, and
     remembers the intended course so login can route there afterward. ---- */
  (function () {
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return; // only the homepage has this hook
    if (localStorage.getItem('crypedugo_promo_seen')) return;

    setTimeout(async () => {
      if (document.querySelector('.promo-modal-scrim')) return;
      localStorage.setItem('crypedugo_promo_seen', '1');

      let course = { title: 'Introduction to Crypto', thumbnail_url: 'assets/img/course-blockchain-new.jpg', slug: 'introduction-to-crypto', subtitle: 'Your first steps into blockchain and crypto, explained clearly.' };
      try {
        const mod = await import('./supabase-client.js');
        const { data } = await mod.supabase
          .from('courses')
          .select('title, subtitle, thumbnail_url, slug')
          .eq('slug', 'introduction-to-crypto')
          .single();
        if (data) course = data;
      } catch (e) { /* fall back to the defaults above */ }

      const endsAt = Date.now() + 3 * 24 * 60 * 60 * 1000;

      const scrim = document.createElement('div');
      scrim.className = 'promo-modal-scrim';
      scrim.innerHTML = `
        <div class="promo-modal">
          <button type="button" class="promo-modal-close" aria-label="Close">✕</button>
          <img class="promo-modal-img" src="${course.thumbnail_url || 'assets/img/course-blockchain-new.jpg'}" alt="${course.title}">
          <div class="promo-modal-body">
            <span class="promo-modal-chip">🎁 Limited-time offer</span>
            <h3>${course.title}</h3>
            <p>${course.subtitle || ''} Free for 3 days once you sign up — no card required.</p>
            <div class="promo-countdown">
              <div class="unit"><b id="promoD">3</b><span>Days</span></div>
              <div class="unit"><b id="promoH">00</b><span>Hrs</span></div>
              <div class="unit"><b id="promoM">00</b><span>Min</span></div>
              <div class="unit"><b id="promoS">00</b><span>Sec</span></div>
            </div>
            <button type="button" class="btn btn-primary btn-block" id="promoStartBtn">Start 3 days free</button>
          </div>
        </div>`;
      document.body.appendChild(scrim);
      requestAnimationFrame(() => scrim.classList.add('open'));

      function tick() {
        const diff = endsAt - Date.now();
        if (diff <= 0) return;
        document.getElementById('promoD').textContent = Math.floor(diff / 86400000);
        document.getElementById('promoH').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        document.getElementById('promoM').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        document.getElementById('promoS').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      }
      tick();
      const timer = setInterval(tick, 1000);

      function close() {
        clearInterval(timer);
        scrim.classList.remove('open');
        setTimeout(() => scrim.remove(), 250);
      }
      scrim.querySelector('.promo-modal-close').addEventListener('click', close);
      scrim.addEventListener('click', (e) => { if (e.target === scrim) close(); });
      scrim.querySelector('#promoStartBtn').addEventListener('click', () => {
        localStorage.setItem('crypedugo_intended_course', course.slug);
        window.location.href = 'create-account.html';
      });
    }, 10000);
  })();

  /* ---- AI assistant: a small animated helper that only appears when it's
     actually useful — the user has gone quiet for a while (might be stuck),
     or right after a real mistake (a form error, a failed payment). It is
     never a permanent fixture on the page. Note: this offers canned
     guidance and support links rather than free-form conversation — there
     is no live AI backend wired into the static frontend. ---- */
  (function () {
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'ai-assistant-fab';
    fab.setAttribute('aria-label', 'Need help?');
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="16" height="12" rx="3"/><circle cx="9" cy="13" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.3" fill="currentColor" stroke="none"/><path d="M12 7V4"/><circle cx="12" cy="3" r="1" fill="currentColor" stroke="none"/></svg>';

    const panel = document.createElement('div');
    panel.className = 'ai-assistant-panel';
    panel.innerHTML =
      '<div class="ai-assistant-head">' +
        '<div class="ai-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="16" height="12" rx="3"/><circle cx="9" cy="13" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.3" fill="currentColor" stroke="none"/></svg></div>' +
        '<div><b>Neko Academy Assistant</b><span>Here if you need a hand</span></div>' +
        '<button type="button" class="ai-assistant-close" aria-label="Close">✕</button>' +
      '</div>' +
      '<div class="ai-assistant-body">' +
        '<p id="aiAssistantMessage">Are you lost? I can help you 👋</p>' +
        '<div class="ai-assistant-actions" id="aiAssistantActions">' +
          '<a href="contact.html">💬 Contact support</a>' +
          '<a href="courses.html">📚 Browse courses</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);
    if (document.querySelector('.bottom-nav')) {
      fab.classList.add('raised');
      panel.classList.add('raised');
    }

    let lastShown = 0;
    function showAssistant(message, actionsHtml) {
      const now = Date.now();
      if (now - lastShown < 4000) return; // guard against rapid double-fires
      lastShown = now;
      document.getElementById('aiAssistantMessage').textContent = message;
      document.getElementById('aiAssistantActions').innerHTML = actionsHtml ||
        '<a href="contact.html">💬 Contact support</a><a href="courses.html">📚 Browse courses</a>';
      fab.classList.add('show');
      panel.classList.add('open');
    }

    fab.addEventListener('click', () => panel.classList.toggle('open'));
    panel.querySelector('.ai-assistant-close').addEventListener('click', () => panel.classList.remove('open'));

    // Idle detection: any real interaction resets the clock. Go quiet for
    // too long and the assistant checks in — once per idle stretch, so
    // dismissing it doesn't trigger an immediate repeat.
    const IDLE_MS = 45000;
    let idleTimer = null;
    function armIdleTimer() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!panel.classList.contains('open')) {
          showAssistant('Are you lost? I can help you 👋');
        }
      }, IDLE_MS);
    }
    ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach((evt) => {
      document.addEventListener(evt, armIdleTimer, { passive: true });
    });
    armIdleTimer();

    // Public API: call this right after a real mistake (a failed payment,
    // a repeated wrong password, a form that won't submit) so the assistant
    // can offer help in the moment.
    //   window.notifyAssistant({ message: '...', actionsHtml: '<a href=...>...</a>' })
    window.notifyAssistant = function (opts) {
      opts = opts || {};
      showAssistant(opts.message || "Something's not working — want a hand?", opts.actionsHtml);
    };
  })();

  /* ---- Account nav badges (Messages / Notifications): only exist on
     account pages (the "More" sheet), and must reflect real unread counts —
     never a placeholder number. Hidden entirely when the count is 0. ---- */
  (function () {
    if (!document.querySelector('.more-sheet')) return; // marketing pages don't have these

    window.refreshAccountBadges = async function () {
      try {
        const mod = await import('./supabase-client.js');
        const { data: { session } } = await mod.supabase.auth.getSession();
        if (!session) return;
        const uid = session.user.id;

        const [{ count: notifCount }, thread] = await Promise.all([
          mod.supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', uid).eq('is_read', false),
          mod.supabase.from('dm_threads').select('id').eq('student_id', uid).maybeSingle(),
        ]);

        let msgCount = 0;
        if (thread.data) {
          const { count } = await mod.supabase.from('dm_messages').select('id', { count: 'exact', head: true }).eq('thread_id', thread.data.id).eq('is_read', false).neq('sender_id', uid);
          msgCount = count || 0;
        }

        setBadge('messages.html', msgCount);
        setBadge('notifications.html', notifCount || 0);
      } catch (e) { /* leave existing badges as-is if this fails */ }
    };

    function setBadge(href, count) {
      document.querySelectorAll(`a[href="${href}"] .badge b`).forEach(function (b) {
        if (count > 0) {
          b.textContent = count > 99 ? '99+' : String(count);
          b.style.display = '';
        } else {
          b.style.display = 'none';
        }
      });
    }

    window.refreshAccountBadges();
  })();

  /* ---- Real logout: every "Logout" link across the account pages pointed
     straight at index.html without ever ending the Supabase session, so
     users never actually signed out. Delegate on the whole document so this
     works no matter which page (or how many logout links) rendered it. ---- */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-logout-btn]');
    if (!btn) return;
    e.preventDefault();
    import('./supabase-client.js').then(function (mod) {
      return mod.supabase.auth.signOut();
    }).finally(function () {
      window.location.href = 'index.html';
    });
  });

})();
