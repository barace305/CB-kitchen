/* ============================================================
   CB KITCHEN — MEMBER PORTAL CORE JS (LOGIN ONLY)
   ============================================================ */

(function () {
  'use strict';

  // ─── STORAGE KEYS ───
  const STORAGE_KEYS = {
    session: 'cbk_member_session', // Active user details
    members: 'cbk_members',        // Database of all members
  };

  // ─── AUTO-REDIRECT IF ACTIVE SESSION EXISTS ───
  try {
    const activeSession = localStorage.getItem(STORAGE_KEYS.session);
    if (activeSession) {
      window.location.href = './dashboard/index.html';
    }
  } catch (e) {
    console.error('Session retrieval failed:', e);
  }

  // ─── DOM SELECTORS ───
  const $ = (s, c) => (c || document).querySelector(s);

  const dom = {
    loginForm: $('#login-form'),
    loginError: $('#login-error'),
    toast: $('#toast'),
    toastMessage: $('#toast-message'),
    
    // Inputs
    loginEmail: $('#login-email'),
    loginPassword: $('#login-password'),
  };

  // Getters/Setters
  function getDatabase(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════
  // AUTHENTICATION LOGIC
  // ═══════════════════════════════════════════════════════
  window.CBAuth = {
    handleLogin: function (e) {
      e.preventDefault();
      if (dom.loginError) dom.loginError.classList.remove('show');

      const email = dom.loginEmail.value.trim();
      const password = dom.loginPassword.value;

      if (!email || !password) {
        showAuthError('Please enter both username/email and password.');
        return;
      }

      // Check for temporary preview user TONE1234
      if (email.toUpperCase() === 'TONE1234') {
        if (password.toUpperCase() === 'TONE1234') {
          const previewUser = {
            name: 'Tone',
            email: 'tone1234@cbkitchen.io',
            company: 'Tone Sourcing & Development',
            status: 'Active',
            tier: 'Founding Member',
            joinDate: 'June 2026',
            renewalDate: 'June 2027'
          };
          
          const submitBtn = $('#login-btn');
          submitBtn.classList.add('loading');
          submitBtn.textContent = 'Verifying Sourcing Access...';

          setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Sign In';
            
            localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(previewUser));
            showToast('Preview Access Granted. Redirecting...');
            
            setTimeout(() => {
              window.location.href = './dashboard/index.html';
            }, 1000);
          }, 800);
          return;
        } else {
          showAuthError('Incorrect password for preview user.');
          return;
        }
      }

      // Check for Admin credentials
      if (email.toLowerCase() === 'admin' || email.toLowerCase() === 'admin@cbkitchen.io' || email.toLowerCase() === 'tone') {
        if (password === 'tone1234' || password === 'cbkitchen2026') {
          showToast('Access Granted. Redirecting to Admin Panel...');
          setTimeout(() => {
            window.location.href = '../admin/';
          }, 1200);
          return;
        }
      }

      // Check in members database
      const members = getDatabase(STORAGE_KEYS.members);
      const user = members.find(m => m.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        showAuthError('No member account found with this email.');
        return;
      }

      if (user.password !== password) {
        showAuthError('Incorrect password. Please try again.');
        return;
      }

      if (user.status === 'Cancelled') {
        showAuthError('Your membership has been deactivated. Please contact support.');
        return;
      }

      const submitBtn = $('#login-btn');
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Verifying Sourcing Access...';

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Sign In';
        
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
        showToast('Login successful! Redirecting...');
        
        setTimeout(() => {
          window.location.href = './dashboard/index.html';
        }, 1000);
      }, 800);
    }
  };

  function showAuthError(msg) {
    if (dom.loginError) {
      dom.loginError.textContent = msg;
      dom.loginError.classList.add('show');
    }
  }

  // ─── TOAST NOTIFICATION ───
  let toastTimer = null;
  function showToast(msg) {
    if (!dom.toast || !dom.toastMessage) return;
    if (toastTimer) clearTimeout(toastTimer);

    dom.toastMessage.innerHTML = msg;
    dom.toast.classList.add('show');

    toastTimer = setTimeout(() => {
      dom.toast.classList.remove('show');
      toastTimer = null;
    }, 4000);
  }

  // Event Listeners
  if (dom.loginForm) {
    dom.loginForm.addEventListener('submit', CBAuth.handleLogin);
  }

})();
