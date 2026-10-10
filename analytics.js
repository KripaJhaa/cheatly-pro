(function () {
  const measurementId = window.GA4_MEASUREMENT_ID;
  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', measurementId, { anonymize_ip: true });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  function track(name, params = {}) {
    if (window.gtag) window.gtag('event', name, params);
  }

  document.querySelectorAll('[data-buy]').forEach((element) => {
    element.addEventListener('click', () => track('select_offer', { offer_name: 'Cheatly lifetime access', price: 2000, currency: 'INR' }));
  });
  document.querySelectorAll('a[href*="discord.com"], a[href*="discord.gg"]').forEach((element) => {
    element.addEventListener('click', () => track('discord_click', { link_text: element.textContent.trim() }));
  });
  document.querySelectorAll('.qr-frame img').forEach((element) => {
    element.addEventListener('click', () => track('qr_view', { destination: 'Discord DM' }));
  });
  document.querySelectorAll('.faq-list summary').forEach((element) => {
    element.addEventListener('click', () => track('faq_open', { question: element.textContent.trim() }));
  });
  document.querySelectorAll('.demo-controls button, .story-controls button, .story-dots button').forEach((element) => {
    element.addEventListener('click', () => track('interactive_demo', { control: element.textContent.trim() || element.getAttribute('aria-label') }));
  });
})();
