// js/login.js – Frontend demo for bike to go login/registration using localStorage

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Helper ----------
  const showMessage = (msg, isError = false) => {
    const msgEl = document.getElementById('loginMessage');
    if (!msgEl) return;
    msgEl.textContent = msg;
    msgEl.style.color = isError ? 'var(--color-error, #b91c1c)' : 'var(--color-success, #166534)';
    setTimeout(() => { msgEl.textContent = ''; }, 5000);
  };

  // ---------- Tab handling ----------
  const tabs = document.querySelectorAll('.tab');
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const switchTab = (target) => {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
    if (target === 'login') {
      loginTab.style.display = '';
      registerTab.style.display = 'none';
    } else {
      loginTab.style.display = 'none';
      registerTab.style.display = '';
    }
  };
  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // ---------- Registration ----------
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const password = document.getElementById('regPassword').value;
      const passwordRepeat = document.getElementById('regPasswordRepeat').value;

      if (password !== passwordRepeat) {
        showMessage('Passwörter stimmen nicht überein.', true);
        return;
      }

      const usersKey = 'bikeToGoUsers';
      const stored = localStorage.getItem(usersKey);
      const users = stored ? JSON.parse(stored) : [];

      if (users.some(u => u.email === email)) {
        showMessage('E‑Mail ist bereits registriert.', true);
        return;
      }

      users.push({ name, email, password });
      localStorage.setItem(usersKey, JSON.stringify(users));
      showMessage('Registrierung erfolgreich! Du kannst dich jetzt anmelden.');
      setTimeout(() => switchTab('login'), 1500);
    });
  }

  // ---------- Login ----------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const usersKey = 'bikeToGoUsers';
      const stored = localStorage.getItem(usersKey);
      const users = stored ? JSON.parse(stored) : [];
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify({ name: user.name, email: user.email }));
        showMessage('Login erfolgreich! Weiterleitung...');
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
      } else {
        showMessage('E‑Mail oder Passwort falsch.', true);
      }
    });
  }
});
