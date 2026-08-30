/**
 * bike to go - Main JavaScript
 * Handles navigation, mobile menu, live chat widget, and placeholder interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Mobile Menu Navigation
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.classList.remove('active');
          mainNav.classList.remove('open');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target) && mainNav.classList.contains('open')) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('open');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Header Scroll Effect
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Live Chat Widget (Bottom Left)
  // --------------------------------------------------------------------------
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatPopup = document.getElementById('chatPopup');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatChips = document.querySelectorAll('.chat-chip');
  const chatInput = document.querySelector('.chat-input-mock');
  const chatSendBtn = document.querySelector('.chat-send-btn');
  const chatBody = document.querySelector('.chat-popup-body');

  if (chatToggleBtn && chatPopup) {
    chatToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chatPopup.classList.toggle('open');
    });

    if (chatCloseBtn) {
      chatCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatPopup.classList.remove('open');
      });
    }

    // Close chat popup when clicking outside
    document.addEventListener('click', (e) => {
      if (chatPopup.classList.contains('open') && !chatPopup.contains(e.target) && !chatToggleBtn.contains(e.target)) {
        chatPopup.classList.remove('open');
      }
    });

    // Handle Quick Action Chips in Chat
    chatChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim();
        appendChatMessage(text, 'user');
        setTimeout(() => {
          appendChatMessage('Vielen Dank für dein Interesse! Ein bike to go Berater wird sich in Kürze bei dir melden.', 'bot');
        }, 600);
      });
    });

    // Handle Mock Message Input
    const handleSend = () => {
      if (chatInput && chatInput.value.trim() !== '') {
        const msg = chatInput.value.trim();
        appendChatMessage(msg, 'user');
        chatInput.value = '';
        setTimeout(() => {
          appendChatMessage('Danke für deine Nachricht! Unser Team steht dir werktags von 8-18 Uhr zur Verfügung.', 'bot');
        }, 800);
      }
    };

    if (chatSendBtn) {
      chatSendBtn.addEventListener('click', handleSend);
    }
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }
  }

  function appendChatMessage(text, sender) {
    if (!chatBody) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message';
    if (sender === 'user') {
      msgDiv.style.backgroundColor = '#dcfce7';
      msgDiv.style.alignSelf = 'flex-end';
      msgDiv.style.borderRadius = '12px 12px 2px 12px';
      msgDiv.style.border = '1px solid #bbf7d0';
      msgDiv.style.color = '#14532d';
    }
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // --------------------------------------------------------------------------
  // 4. Live Leasingrechner Logic
  // --------------------------------------------------------------------------
  const bikePriceInput = document.getElementById('bikePriceInput');
  const bikePriceRange = document.getElementById('bikePriceRange');
  const priceDisplayBadge = document.getElementById('priceDisplayBadge');
  const monthlyRateResult = document.getElementById('monthlyRateResult');
  const breakdownPrice = document.getElementById('breakdownPrice');
  const breakdownTerm = document.getElementById('breakdownTerm');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const termRadios = document.querySelectorAll('input[name="leasingTerm"]');
  const heroCalcBtn = document.getElementById('heroCalcBtn');
  const calcCard = document.getElementById('calcCard');

  const euroCurrencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const euroCompactFormatter = new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 0
  });

  function calculateLeasingRate() {
    if (!bikePriceInput || !monthlyRateResult) return;

    let price = parseFloat(bikePriceInput.value);
    if (isNaN(price) || price < 0) {
      price = 0;
    }

    // Get selected leasing term (12, 24, 36 months)
    let term = 36;
    const selectedRadio = document.querySelector('input[name="leasingTerm"]:checked');
    if (selectedRadio) {
      term = parseInt(selectedRadio.value, 10);
    }

    // Formula: Rate = (Fahrradpreis / Laufzeit) * 1.1 (10% Aufschlag für Versicherung & Service)
    const rawRate = term > 0 ? (price / term) * 1.1 : 0;

    // Update Result & Breakdown Displays
    monthlyRateResult.textContent = euroCurrencyFormatter.format(rawRate);
    if (priceDisplayBadge) {
      priceDisplayBadge.textContent = `${euroCompactFormatter.format(price)} €`;
    }
    if (breakdownPrice) {
      breakdownPrice.textContent = euroCurrencyFormatter.format(price);
    }
    if (breakdownTerm) {
      breakdownTerm.textContent = `${term} Monate`;
    }
  }

  function updatePresetActiveState(currentVal) {
    presetBtns.forEach(btn => {
      const btnVal = parseFloat(btn.getAttribute('data-value'));
      if (btnVal === currentVal) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  if (bikePriceInput && bikePriceRange) {
    // Sync Number Input -> Range Slider
    bikePriceInput.addEventListener('input', () => {
      const val = parseFloat(bikePriceInput.value) || 0;
      bikePriceRange.value = val;
      updatePresetActiveState(val);
      calculateLeasingRate();
    });

    // Sync Range Slider -> Number Input
    bikePriceRange.addEventListener('input', () => {
      const val = parseFloat(bikePriceRange.value) || 0;
      bikePriceInput.value = val;
      updatePresetActiveState(val);
      calculateLeasingRate();
    });

    // Preset Buttons Click Handler
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.getAttribute('data-value'));
        bikePriceInput.value = val;
        bikePriceRange.value = val;
        updatePresetActiveState(val);
        calculateLeasingRate();
      });
    });

    // Term Radio Buttons Change Handler
    termRadios.forEach(radio => {
      radio.addEventListener('change', calculateLeasingRate);
    });

    // Initial calculation on page load
    calculateLeasingRate();
  }

  // Smooth scroll & pulse animation when clicking hero calculator button
  if (heroCalcBtn && calcCard) {
    heroCalcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('leasingrechner');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        calcCard.classList.remove('highlight-pulse');
        // Trigger reflow to restart CSS animation
        void calcCard.offsetWidth;
        calcCard.classList.add('highlight-pulse');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Toast Notification for Placeholder Elements
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toastNotice');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Attach placeholder handlers
  document.querySelectorAll('[data-placeholder]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const featureName = el.getAttribute('data-placeholder') || 'Diese Funktion';
      showToast(`ℹ️ ${featureName} wird im nächsten Schritt freigeschaltet.`);
    });
  });
});

