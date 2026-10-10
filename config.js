// Replace these values with your real checkout and download URLs before publishing.
const PRODUCT_CONFIG = {
  // This release uses manual UPI approval and delivery through Discord/WeTransfer.
  checkoutUrl: "#access",
  downloadUrl: ""
};

// Google Analytics 4 Measurement ID.
const GA4_MEASUREMENT_ID = "G-CZ3CTQKVYP";

document.querySelectorAll("[data-buy]").forEach((link) => {
  link.href = PRODUCT_CONFIG.checkoutUrl;
});
