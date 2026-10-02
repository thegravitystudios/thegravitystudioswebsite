/**
 * The Gravity Studios - Universal Booking Engine Widget
 * Embeddable scheduling widget for multi-site agency integration.
 *
 * Usage 1: Auto Popup Button / Trigger
 * <button data-gravity-booking data-source="Agency #2 Name">Book Discovery Call</button>
 * <script src="https://thegravitystudios.com/booking-widget.js" async></script>
 *
 * Usage 2: Inline Frame Embedding
 * <div id="tgs-booking-container" data-gravity-embed data-source="Agency #2 Name"></div>
 * <script src="https://thegravitystudios.com/booking-widget.js" async></script>
 *
 * Usage 3: Programmatic JS Call
 * window.GravityBooking.openModal({ source: 'Agency #2 Name' });
 */

(function () {
  const MASTER_URL = "https://thegravitystudios.com";

  function getBaseUrl() {
    if (typeof window !== "undefined" && window.GRAVITY_BOOKING_HOST) {
      return window.GRAVITY_BOOKING_HOST;
    }
    // Fallback to current domain if running on main site during local dev
    if (typeof window !== "undefined" && window.location.hostname.includes("localhost")) {
      return window.location.origin;
    }
    return MASTER_URL;
  }

  function createModal(sourceName) {
    const existingModal = document.getElementById("tgs-booking-modal");
    if (existingModal) existingModal.remove();

    const baseUrl = getBaseUrl();
    const sourceParam = encodeURIComponent(sourceName || "External Agency Site");
    const targetUrl = `${baseUrl}/book?embed=true&source=${sourceParam}`;

    const overlay = document.createElement("div");
    overlay.id = "tgs-booking-modal";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(11, 11, 14, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s ease-in-out;
      padding: 16px;
      box-sizing: border-box;
    `;

    const container = document.createElement("div");
    container.style.cssText = `
      position: relative;
      width: 100%;
      max-width: 900px;
      height: 90vh;
      max-height: 800px;
      background: #0D0D12;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.25);
      transform: scale(0.95);
      transition: transform 0.25s ease-in-out;
    `;

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "&#x2715;";
    closeBtn.ariaLabel = "Close Booking Modal";
    closeBtn.style.cssText = `
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 10;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    `;
    closeBtn.onmouseenter = () => (closeBtn.style.background = "rgba(239, 68, 68, 0.8)");
    closeBtn.onmouseleave = () => (closeBtn.style.background = "rgba(255, 255, 255, 0.1)");
    closeBtn.onclick = closeModal;

    const iframe = document.createElement("iframe");
    iframe.src = targetUrl;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
    `;

    container.appendChild(closeBtn);
    container.appendChild(iframe);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      container.style.transform = "scale(1)";
    });

    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };

    function closeModal() {
      overlay.style.opacity = "0";
      container.style.transform = "scale(0.95)";
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 250);
    }
  }

  function initEmbeds() {
    const inlineEmbeds = document.querySelectorAll("[data-gravity-embed]");
    inlineEmbeds.forEach((el) => {
      if (el.getAttribute("data-tgs-initialized") === "true") return;
      el.setAttribute("data-tgs-initialized", "true");

      const source = el.getAttribute("data-source") || "External Embed";
      const baseUrl = getBaseUrl();
      const iframe = document.createElement("iframe");
      iframe.src = `${baseUrl}/book?embed=true&source=${encodeURIComponent(source)}`;
      iframe.style.cssText = `
        width: 100%;
        min-height: 700px;
        border: none;
        background: transparent;
        border-radius: 16px;
      `;
      el.appendChild(iframe);
    });

    const triggerButtons = document.querySelectorAll("[data-gravity-booking]");
    triggerButtons.forEach((btn) => {
      if (btn.getAttribute("data-tgs-initialized") === "true") return;
      btn.setAttribute("data-tgs-initialized", "true");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const source = btn.getAttribute("data-source") || "External Trigger Button";
        createModal(source);
      });
    });
  }

  // Expose global API
  window.GravityBooking = {
    openModal: function (opts) {
      const source = (opts && opts.source) || "Programmatic JS Call";
      createModal(source);
    },
    init: initEmbeds,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEmbeds);
  } else {
    initEmbeds();
  }
})();
