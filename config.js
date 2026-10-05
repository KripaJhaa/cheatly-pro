// Replace these values with your real checkout and download URLs before publishing.
const PRODUCT_CONFIG = {
  // This release uses manual UPI approval and delivery through Discord/WeTransfer.
  checkoutUrl: "#access",
  downloadUrl: ""
};

// Replace this with your Google Analytics 4 Measurement ID, for example G-ABC1234567.
const GA4_MEASUREMENT_ID = "";

document.querySelectorAll("[data-buy]").forEach((link) => {
  link.href = PRODUCT_CONFIG.checkoutUrl;
});
