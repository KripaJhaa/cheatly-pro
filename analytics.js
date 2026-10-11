(function () {
  const measurementId = window.GA4_MEASUREMENT_ID;
  const mixpanelToken = window.MIXPANEL_PROJECT_TOKEN;
  const hasGoogleAnalytics = measurementId && /^G-[A-Z0-9]+$/i.test(measurementId);
  const hasMixpanel = mixpanelToken && mixpanelToken.length > 10;
  if (!hasGoogleAnalytics && !hasMixpanel) return;

  window.dataLayer = window.dataLayer || [];
  if (hasGoogleAnalytics && !window.gtag) {
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', measurementId, { anonymize_ip: true });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  let mixpanelReady = false;
  if (hasMixpanel && !window.mixpanel) {
    const mixpanelScript = document.createElement('script');
    mixpanelScript.async = true;
    mixpanelScript.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
    mixpanelScript.onload = () => {
      if (!window.mixpanel) return;
      window.mixpanel.init(mixpanelToken, { track_pageview: false, persistence: 'localStorage' });
      mixpanelReady = true;
    };
    document.head.appendChild(mixpanelScript);
  } else if (hasMixpanel && window.mixpanel) {
    mixpanelReady = true;
  }

  function track(name, params = {}) {
    if (window.gtag) window.gtag('event', name, params);
    if (mixpanelReady && window.mixpanel) window.mixpanel.track(name, params);
    if (window.fbq && name === 'purchase_cta_click') window.fbq('track', 'InitiateCheckout', params);
  }

  document.querySelectorAll('[data-buy]').forEach((element) => {
    element.addEventListener('click', () => {
      const params = { offer_name: 'Cheatly lifetime access', price: 2000, value: 2000, currency: 'INR', cta_text: element.textContent.trim() };
      track('purchase_cta_click', params);
      track('select_offer', params);
    });
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
