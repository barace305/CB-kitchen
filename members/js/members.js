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

  const MEMBER_CREDENTIALS = {
    username: 'tone1234',
    password: 'tone1234'
  };

  // ─── AUTO-REDIRECT IF ACTIVE SESSION EXISTS ───
  try {
    const activeSession = localStorage.getItem(STORAGE_KEYS.session);
    if (activeSession) {
      window.location.href = '/members/dashboard';
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

      const username = dom.loginEmail.value.trim().toLowerCase();
      const password = dom.loginPassword.value.trim().toLowerCase();

      if (!username || !password) {
        showAuthError('Please enter both username/email and password.');
        return;
      }

      if (username === MEMBER_CREDENTIALS.username && password === MEMBER_CREDENTIALS.password) {
        const memberUser = {
          name: 'Tone',
          email: `${MEMBER_CREDENTIALS.username}@cbkitchen.io`,
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
          
          localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(memberUser));
          showToast('Login successful! Redirecting...');
          
          setTimeout(() => {
            window.location.href = '/members/dashboard';
          }, 1000);
        }, 800);
        return;
      }

      // Check in members database for custom-registered users
      const members = getDatabase(STORAGE_KEYS.members);
      const user = members.find(m => String(m.email || '').trim().toLowerCase() === username);

      if (!user) {
        showAuthError('No member account found with this username/email.');
        return;
      }

      if (String(user.password || '').trim().toLowerCase() !== password) {
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
          window.location.href = '/members/dashboard';
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
    dom.loginForm.addEventListener('submit', window.CBAuth.handleLogin);
  }

})();
