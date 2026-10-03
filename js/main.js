import translations from './translations.js';

/**
 * Apply translations for the given language code.
 * Updates all elements with a data-i18n attribute.
 * Also updates aria-label, placeholder, and title attributes when
 * data-i18n-aria, data-i18n-placeholder or data-i18n-title are present.
 */
function applyTranslations(lang) {
  const dict = translations[lang] || {};
  // Update elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // Use innerHTML to preserve HTML tags in translation strings
      el.innerHTML = dict[key];
    }
  });
  // Update elements with data-i18n-aria
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key]) {
      el.setAttribute('aria-label', dict[key]);
    }
  });
  // Update elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });
  // Update elements with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key]) {
      el.setAttribute('title', dict[key]);
    }
  });
  // Update <title>
  const titleEl = document.querySelector('title[data-i18n]');
  if (titleEl && dict[titleEl.getAttribute('data-i18n')]) {
    document.title = dict[titleEl.getAttribute('data-i18n')];
  }
  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"][data-i18n]');
  if (metaDesc && dict[metaDesc.getAttribute('data-i18n')]) {
    metaDesc.setAttribute('content', dict[metaDesc.getAttribute('data-i18n')]);
  }
}


// Initialize language from localStorage or default to German
document.addEventListener('DOMContentLoaded', () => {
  const storedLang = localStorage.getItem('lang') || 'de';
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = storedLang;
    langSelect.addEventListener('change', (e) => {
      const newLang = e.target.value;
      localStorage.setItem('lang', newLang);
      applyTranslations(newLang);
    });
  }
  applyTranslations(storedLang);
  window.currentLang = storedLang;

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
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        // If it's a hash link, prevent default and smooth scroll
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        // Close mobile menu if open
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

  // Locale‑aware currency formatters
  function getEuroFormatter() {
    const lang = window.currentLang || 'de';
    if (lang === 'en') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    // es and de use Euro
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getEuroCompactFormatter() {
    const lang = window.currentLang || 'de';
    // compact numbers (no decimal) – keep locale for thousand separator
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'de-DE', { maximumFractionDigits: 0 });
  }



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
    monthlyRateResult.textContent = getEuroFormatter().format(rawRate);
    if (priceDisplayBadge) {
      priceDisplayBadge.textContent = `${getEuroCompactFormatter().format(price)} €`;
    }
    if (breakdownPrice) {
      breakdownPrice.textContent = getEuroFormatter().format(price);
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
  // 5. Contact Form Handling (kontakt.html)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccessBanner = document.getElementById('formSuccessBanner');
  const successUserName = document.getElementById('successUserName');

  if (contactForm && formSuccessBanner) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const name = nameInput ? nameInput.value.trim() : '';

      // Personalized greeting in success banner
      if (successUserName) {
        successUserName.textContent = name ? `, ${name}` : '';
      }

      // Show confirmation banner
      formSuccessBanner.classList.add('show');
      formSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Reset form fields
      contactForm.reset();

      // Show toast notification
      showToast('✅ Danke für deine Nachricht! Wir melden uns innerhalb von 24 Stunden.');
    });
  }

  // --------------------------------------------------------------------------
  // 6. Toast Notification for Placeholder Elements
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
    }, 3500);
  }

  // Attach placeholder handlers
  document.querySelectorAll('[data-placeholder]').forEach(el => {
  el.addEventListener('click', (e) => {
    const href = el.getAttribute('href');
    // Only prevent navigation for hash anchors (smooth scroll placeholders)
    if (href && href.startsWith('#')) {
      e.preventDefault();
    }
    const featureName = el.getAttribute('data-placeholder') || 'Diese Funktion';
    showToast(`ℹ️ ${featureName} wird im nächsten Schritt freigeschaltet.`);
  });
});

    // -------- Header login status --------
    const loginBtn = document.querySelector('.btn-login');
    const loggedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loginBtn) {
      if (loggedUser && loggedUser.name) {
        loginBtn.textContent = `Eingeloggt als ${loggedUser.name}`;
        loginBtn.removeAttribute('href');
        loginBtn.style.cursor = 'pointer';
        loginBtn.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('loggedInUser');
          location.reload();
        });
      }
    }

});


