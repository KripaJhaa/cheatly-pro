// Replace these values with your real checkout and download URLs before publishing.
const PRODUCT_CONFIG = {
  // Payment is collected through Razorpay; proof and delivery are handled through Discord/WeTransfer.
  checkoutUrl: "https://rzp.io/rzp/cheatlyPro",
  downloadUrl: ""
};

// Google Analytics 4 Measurement ID.
const GA4_MEASUREMENT_ID = "G-L28HCH51R9";

// Add your Mixpanel project token when you are ready to enable Mixpanel events.
const MIXPANEL_PROJECT_TOKEN = "";

document.querySelectorAll("[data-buy]").forEach((link) => {
  link.href = PRODUCT_CONFIG.checkoutUrl;
});
