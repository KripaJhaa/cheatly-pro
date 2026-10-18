(function () {
  const form = document.getElementById('interestForm');
  const status = document.getElementById('interestStatus');
  if (!form || !status) return;

  const apiBase = (window.CHEATLY_API_BASE_URL || 'https://api.cheatly.pro').replace(/\/$/, '');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    submit.disabled = true;
    status.className = 'form-status is-working';
    status.textContent = 'Saving your spot…';
    try {
      const response = await fetch(`${apiBase}/api/interest`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: data.get('email'), mobile: data.get('mobile') })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save your interest');
      status.className = 'form-status is-success';
      status.textContent = 'You’re on the list. We’ll email you when the installer is ready.';
      form.reset();
      if (window.gtag) window.gtag('event', 'join_early_access', { method: 'website_form' });
      if (window.mixpanel) window.mixpanel.track('join_early_access', { method: 'website_form' });
    } catch (error) {
      status.className = 'form-status is-error';
      status.textContent = error.message || 'Something went wrong. Please try again.';
    } finally {
      submit.disabled = false;
    }
  });
})();
