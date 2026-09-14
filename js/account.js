/* ==========================================================
   account.js — Supabase Auth + Lemon Squeezy checkout
   Ładowany na każdej stronie po config.js i supabase-js (UMD).
   ========================================================== */
(function () {
  const C = window.UNNPC || {};
  const configured = C.SUPABASE_URL && !C.SUPABASE_URL.startsWith('[');
  const sb = configured && window.supabase ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;
  window.UNNPC.sb = sb;

  const $ = (s, r = document) => r.querySelector(s);
  const base = location.pathname.includes('/en/') ? '/en/' : '/';
  const en = base === '/en/';
  const T = en
    ? { account: 'account.html', library: 'library.html', login: 'Sign in', lib: 'Library', noShop: 'The store is not connected yet (missing Lemon Squeezy config).' }
    : { account: 'konto.html', library: 'biblioteka.html', login: 'Zaloguj', lib: 'Biblioteka', noShop: 'Sklep jeszcze nie jest podłączony (brak konfiguracji Lemon Squeezy).' };
  window.UNNPC.T = T;

  /* ---------- nav: Zaloguj / Biblioteka ---------- */
  async function paintNav() {
    const slot = $('#navAccount');
    if (!slot) return;
    const { data } = sb ? await sb.auth.getSession() : { data: { session: null } };
    if (data.session) {
      slot.innerHTML = `<a href="${base}${T.library}">${T.lib}</a>`;
    } else {
      slot.innerHTML = `<a href="${base}${T.account}">${T.login}</a>`;
    }
  }

  /* ---------- checkout (Lemon Squeezy overlay) ---------- */
  function checkoutUrl(productId, email) {
    const v = (C.LS_VARIANTS || {})[productId];
    if (!v || v.startsWith('[') || !C.LS_STORE || C.LS_STORE.startsWith('[')) return null;
    const u = new URL(`https://${C.LS_STORE}.lemonsqueezy.com/checkout/buy/${v}`);
    u.searchParams.set('embed', '1');
    u.searchParams.set('media', '0');
    u.searchParams.set('logo', '0');
    if (email) u.searchParams.set('checkout[email]', email);
    u.searchParams.set('checkout[custom][product_id]', productId);
    return u.toString();
  }

  async function openCheckout(productId, email) {
    let mail = email;
    if (!mail && sb) { const { data } = await sb.auth.getSession(); mail = data.session?.user?.email; }
    const url = checkoutUrl(productId, mail);
    if (!url) { alert(T.noShop); return; }
    if (window.LemonSqueezy) { window.LemonSqueezy.Url.Open(url); } else { location.href = url; }
  }
  window.UNNPC.openCheckout = openCheckout;

  document.querySelectorAll('[data-checkout]').forEach((a) => {
    const pid = a.dataset.checkout || 'life-rpg';
    a.addEventListener('click', (e) => { e.preventDefault(); openCheckout(pid); });
  });

  /* ---------- lead form → darmowy produkt przez LS (zbiera e-mail + tworzy zakup) ---------- */
  const lead = $('form.lead');
  if (lead) {
    lead.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('input[type=email]', lead).value.trim();
      if (!email) return;
      openCheckout('investor-tracker', email);
    });
  }

  /* ---------- po udanym checkoucie LS → do biblioteki ---------- */
  if (window.LemonSqueezy && window.LemonSqueezy.Setup) {
    window.LemonSqueezy.Setup({
      eventHandler: (ev) => {
        if (ev.event === 'Checkout.Success') {
          const email = ev.data?.order?.data?.attributes?.user_email;
          setTimeout(() => { location.href = `${base}${T.account}?next=library${email ? '&email=' + encodeURIComponent(email) : ''}`; }, 1500);
        }
      },
    });
  }

  if (sb) {
    paintNav();
    sb.auth.onAuthStateChange(() => paintNav());
  } else {
    paintNav();
  }
})();
