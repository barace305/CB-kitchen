/* ============================================================
   CB KITCHEN — MEMBER PORTAL CORE JS
   Shared localStorage context · Registration · Quoting · Real-time Sync
   ============================================================ */

(function () {
  'use strict';

  // ─── STORAGE KEYS ───
  const STORAGE_KEYS = {
    session: 'cbk_member_session', // Active user details
    members: 'cbk_members',        // Database of all members
    quotes: 'cbk_quotes',          // Database of all quote requests
    seeded: 'cbk_data_seeded'      // Seeding flag
  };

  // ─── STATE VARIABLES ───
  let currentUser = null;
  let selectedFiles = [];

  // ─── DOM SELECTORS ───
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => [...(c || document).querySelectorAll(s)];

  const dom = {
    loginGate: $('#login-gate'),
    dashboard: $('#member-dashboard'),
    loginForm: $('#login-form'),
    signupForm: $('#signup-form'),
    loginError: $('#login-error'),
    verificationBanner: $('#verification-banner'),
    logoutBtn: $('#logout-btn'),
    headerMemberName: $('#header-member-name'),
    quotesCountBadge: $('#quotes-count-badge'),
    
    // Inputs
    loginEmail: $('#login-email'),
    loginPassword: $('#login-password'),
    signupName: $('#signup-name'),
    signupCompany: $('#signup-company'),
    signupEmail: $('#signup-email'),
    signupPhone: $('#signup-phone'),
    signupCity: $('#signup-city'),
    signupState: $('#signup-state'),
    signupType: $('#signup-type'),
    signupPassword: $('#signup-password'),
    signupConfirm: $('#signup-confirm'),

    // Forms
    customSourcingForm: $('#custom-sourcing-form'),
    catalogQuoteForm: $('#catalog-quote-form'),
    
    // Modals
    catalogQuoteModal: $('#catalog-quote-modal'),
    modalDesignName: $('#modal-design-name'),
    modalDesignCategory: $('#modal-design-category'),
    modalFieldDesign: $('#modal-field-design'),
    modalFieldCategory: $('#modal-field-category'),
    modalFieldLocation: $('#modal-field-location'),
    modalFieldBudget: $('#modal-field-budget'),
    modalFieldTimeline: $('#modal-field-timeline'),
    modalFieldMaterials: $('#modal-field-materials'),
    modalFieldDimensions: $('#modal-field-dimensions'),
    modalFileInput: $('#modal-file-input'),
    modalFileZone: $('#modal-file-zone'),
    modalFilePreview: $('#modal-file-list-preview'),

    // Custom Sourcing Elements
    customFileZone: $('#custom-file-zone'),
    customFileInput: $('#custom-file-input'),
    customFilePreview: $('#file-list-preview'),
    customProjName: $('#custom-proj-name'),
    customProjType: $('#custom-proj-type'),
    customMeasurements: $('#custom-measurements'),
    customMaterials: $('#custom-materials'),
    customBudget: $('#custom-budget'),
    customTimeline: $('#custom-timeline'),
    customNotes: $('#custom-notes'),

    // Logs modal
    sourcingNotesModal: $('#sourcing-notes-modal'),
    logProjectId: $('#log-project-id'),
    logNotesDisplay: $('#log-notes-display'),

    // Toast
    toast: $('#toast'),
    toastMessage: $('#toast-message')
  };

  // ═══════════════════════════════════════════════════════
  // DATABASE SEEDING
  // ═══════════════════════════════════════════════════════
  function seedInitialData() {
    if (localStorage.getItem(STORAGE_KEYS.seeded)) return;

    // Seed default members (shared with Admin panel)
    const members = [
      {
        id: 'MEM-001',
        memberSince: '2025-11-01',
        firstName: 'Elena',
        lastName: 'Vasquez',
        company: 'Vasquez Interior Design',
        email: 'elena@vasquezinteriors.com',
        phone: '(212) 555-0198',
        city: 'New York',
        state: 'NY',
        tier: 'Professional',
        status: 'Active',
        password: 'member123',
        notes: 'Premium partner. Focuses on high-gloss kitchens.'
      },
      {
        id: 'MEM-002',
        memberSince: '2025-09-15',
        firstName: 'David',
        lastName: 'Chen',
        company: 'Pacific Edge Construction',
        email: 'david@pacificedge.co',
        phone: '(415) 555-0173',
        city: 'San Francisco',
        state: 'CA',
        tier: 'Enterprise',
        status: 'Active',
        password: 'member123',
        notes: 'GC doing high volume luxury condos.'
      },
      {
        id: 'MEM-003',
        memberSince: '2025-08-20',
        firstName: 'James',
        lastName: 'Whitmore',
        company: 'Whitmore Development Group',
        email: 'james@whitmoredev.com',
        phone: '(404) 555-0129',
        city: 'Atlanta',
        state: 'GA',
        tier: 'Enterprise',
        status: 'Active',
        password: 'member123',
        notes: 'Developer constructing 15+ custom estates per year.'
      },
      {
        id: 'MEM-004',
        memberSince: '2026-01-10',
        firstName: 'Nicole',
        lastName: 'Ferrara',
        company: 'Ferrara Design Co.',
        email: 'nicole@ferraradesign.com',
        phone: '(617) 555-0133',
        city: 'Boston',
        state: 'MA',
        tier: 'Professional',
        status: 'Suspended',
        password: 'member123',
        notes: 'Account suspended pending license renewal verification.'
      }
    ];

    // Seed default quotes (shared with Admin panel)
    const quotes = [
      {
        id: 'QTE-001',
        date: '2026-05-20',
        memberId: 'MEM-003',
        memberName: 'James Whitmore',
        companyName: 'Whitmore Development Group',
        email: 'james@whitmoredev.com',
        phone: '(404) 555-0129',
        projectType: 'Kitchen Remodel',
        designName: 'Warm Contemporary',
        preferredMaterials: 'Walnut cabinet finishes, Calacatta gold countertops',
        budget: '$75,000 - $100,000',
        timeline: '3-4 months',
        description: 'Complete luxury kitchen remodel for estate. Butler pantry addition required.',
        isCustom: false,
        files: ['kitchen_elevations.pdf'],
        status: 'New',
        adminNotes: 'Direct factory request submitted. Waiting on panel drafts.'
      },
      {
        id: 'QTE-002',
        date: '2026-05-18',
        memberId: 'MEM-001',
        memberName: 'Elena Vasquez',
        companyName: 'Vasquez Interior Design',
        email: 'elena@vasquezinteriors.com',
        phone: '(212) 555-0198',
        projectType: 'Bathroom Remodel',
        designName: 'Luxury Vanity Line',
        preferredMaterials: 'Double floating oak vanity, gold brackets',
        budget: '$40,000 - $60,000',
        timeline: '6-8 weeks',
        description: 'Master bathroom renovation. Heated floor layout and double vanities.',
        isCustom: false,
        files: [],
        status: 'Reviewed',
        adminNotes: 'Reviewed design scale. Quoting marble slabs.'
      }
    ];

    localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members));
    localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));
    localStorage.setItem(STORAGE_KEYS.seeded, 'true');
  }

  // ─── GETTERS / SETTERS ───
  function getDatabase(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  function setDatabase(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ═══════════════════════════════════════════════════════
  // AUTHENTICATION LOGIC (CBAuth)
  // ═══════════════════════════════════════════════════════
  window.CBAuth = {
    toggleTab: function (mode) {
      if (dom.loginError) dom.loginError.classList.remove('show');
      if (mode === 'login') {
        $('#auth-tab-login').classList.add('active');
        $('#auth-tab-signup').classList.remove('active');
        dom.loginForm.style.display = 'block';
        dom.signupForm.style.display = 'none';
      } else {
        $('#auth-tab-login').classList.remove('active');
        $('#auth-tab-signup').classList.add('active');
        dom.loginForm.style.display = 'none';
        dom.signupForm.style.display = 'block';
      }
    },

    handleLogin: function (e) {
      e.preventDefault();
      const email = dom.loginEmail.value.trim().toLowerCase();
      const password = dom.loginPassword.value;

      if (!email || !password) {
        showAuthError('Please enter both email and password.');
        return;
      }

      // Admin Redirection Safety Net
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPass = password.trim().toLowerCase();
      if (
        normalizedEmail === 'admin' ||
        normalizedEmail === 'admin@cbkitchen.io' ||
        normalizedEmail === 'tone'
      ) {
        if (normalizedPass === 'tone1234' || normalizedPass === 'cbkitchen2026') {
          showAuthError('Admin credentials detected. Redirecting to Admin Panel...');
          setTimeout(() => {
            window.location.href = '../admin/';
          }, 1200);
          return;
        }
      }

      const members = getDatabase(STORAGE_KEYS.members);
      const user = members.find(m => m.email.toLowerCase() === email);

      if (!user) {
        showAuthError('No contractor account found with this email.');
        return;
      }

      if (user.password !== password) {
        showAuthError('Invalid password. Please try again.');
        return;
      }

      if (user.status === 'Cancelled') {
        showAuthError('Your membership has been cancelled. Contact assistance.');
        return;
      }

      // Simulate authentication load
      const submitBtn = $('#login-btn');
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Verifying Account...';

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Access Sourcing';
        
        currentUser = user;
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
        enterDashboard(user);
      }, 800);
    },

    handleSignup: function (e) {
      e.preventDefault();
      const name = dom.signupName.value.trim();
      const company = dom.signupCompany.value.trim();
      const email = dom.signupEmail.value.trim().toLowerCase();
      const phone = dom.signupPhone.value.trim();
      const city = dom.signupCity.value.trim();
      const state = dom.signupState.value.trim();
      const type = dom.signupType.value;
      const password = dom.signupPassword.value;
      const confirm = dom.signupConfirm.value;

      // Basic Validation
      if (!name || !company || !email || !phone || !city || !state || !type || !password) {
        showAuthError('Please fill in all registration fields.');
        return;
      }

      if (password.length < 6) {
        showAuthError('Password must be at least 6 characters.');
        return;
      }

      if (password !== confirm) {
        showAuthError('Passwords do not match.');
        return;
      }

      const members = getDatabase(STORAGE_KEYS.members);
      if (members.some(m => m.email.toLowerCase() === email)) {
        showAuthError('An account with this email already exists.');
        return;
      }

      const submitBtn = $('#signup-btn');
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Submitting Profile...';

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Register Application';

        const nameParts = name.split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const newMember = {
          id: 'MEM-' + String(members.length + 1).padStart(3, '0'),
          memberSince: new Date().toISOString().split('T')[0],
          firstName: firstName,
          lastName: lastName,
          company: company,
          email: email,
          phone: phone,
          city: city,
          state: state,
          tier: 'Founding Member',
          status: 'Pending', // Default status is Pending
          password: password,
          notes: 'Registered via Sourcing Portal.'
        };

        members.push(newMember);
        setDatabase(STORAGE_KEYS.members, members);

        // Auto log in as Pending
        currentUser = newMember;
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(newMember));
        enterDashboard(newMember);
        
        showToast('Registration submitted! Account is pending review.');
      }, 1000);
    }
  };

  function showAuthError(msg) {
    if (dom.loginError) {
      dom.loginError.textContent = msg;
      dom.loginError.classList.add('show');
    }
  }

  function checkSession() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.session);
      if (stored) {
        const sessionUser = JSON.parse(stored);
        
        // Re-fetch user status from members database to support real-time admin updates
        const members = getDatabase(STORAGE_KEYS.members);
        const freshUser = members.find(m => m.id === sessionUser.id);
        
        if (freshUser) {
          currentUser = freshUser;
          enterDashboard(freshUser);
        } else {
          showLoginScreen();
        }
      } else {
        showLoginScreen();
      }
    } catch {
      showLoginScreen();
    }
  }

  function showLoginScreen() {
    dom.loginGate.style.display = 'flex';
    dom.dashboard.classList.remove('active');
    document.title = 'Member Login — CB Kitchen';
  }

  function enterDashboard(user) {
    dom.loginGate.style.display = 'none';
    dom.dashboard.classList.add('active');
    document.title = 'Member Sourcing Dashboard — CB Kitchen';
    
    // Header setup
    dom.headerMemberName.innerHTML = `Welcome, <span>${user.firstName}</span>`;
    
    // Update Pending notice banner status
    if (user.status === 'Pending') {
      dom.verificationBanner.style.display = 'block';
    } else {
      dom.verificationBanner.style.display = 'none';
    }
    
    CBDashboard.switchTab('catalog');
    CBDashboard.renderQuotes();
  }

  // ═══════════════════════════════════════════════════════
  // DASHBOARD TAB & FORMS LOGIC (CBDashboard)
  // ═══════════════════════════════════════════════════════
  window.CBDashboard = {
    switchTab: function (tabName) {
      $$('.tab-btn').forEach(btn => btn.classList.remove('active'));
      $$('.tab-section').forEach(sec => sec.classList.remove('active'));

      $(`#tab-btn-${tabName}`).classList.add('active');
      $(`#tab-${tabName}`).classList.add('active');

      if (tabName === 'quotes') {
        this.renderQuotes();
      } else if (tabName === 'notebook') {
        this.renderNotebook();
      }
    },

    renderNotebook: function () {
      const notesKey = 'cbk_notebook_' + currentUser.id;
      let notes = [];
      try {
        notes = JSON.parse(localStorage.getItem(notesKey)) || [];
      } catch {
        notes = [];
      }

      const grid = $('#notebook-notes-list');
      const emptyState = $('#notebook-empty-state');

      if (notes.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
      }

      emptyState.style.display = 'none';
      grid.innerHTML = notes.map(n => `
        <div class="notebook-note-card">
          <div class="notebook-note-header">
            <h5 class="notebook-note-title">${escapeHtml(n.title)}</h5>
            <button type="button" class="notebook-note-delete" onclick="CBDashboard.deleteNotebookNote('${n.id}')" title="Delete Note">&times;</button>
          </div>
          <p class="notebook-note-content">${escapeHtml(n.content)}</p>
          <div class="notebook-note-date">${n.date}</div>
        </div>
      `).join('');
    },

    saveNotebookNote: function (e) {
      e.preventDefault();
      const titleInput = $('#note-title');
      const contentInput = $('#note-content');
      
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();

      if (!title || !content) {
        showToast('Please enter both a title and content.');
        return;
      }

      const notesKey = 'cbk_notebook_' + currentUser.id;
      let notes = [];
      try {
        notes = JSON.parse(localStorage.getItem(notesKey)) || [];
      } catch {
        notes = [];
      }

      const newNote = {
        id: 'NOTE-' + Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      notes.unshift(newNote); // Put newest notes first
      localStorage.setItem(notesKey, JSON.stringify(notes));

      titleInput.value = '';
      contentInput.value = '';

      this.renderNotebook();
      showToast('Note saved to your notebook.');
    },

    deleteNotebookNote: function (id) {
      if (!confirm('Are you sure you want to delete this note?')) return;

      const notesKey = 'cbk_notebook_' + currentUser.id;
      let notes = [];
      try {
        notes = JSON.parse(localStorage.getItem(notesKey)) || [];
      } catch {
        notes = [];
      }

      notes = notes.filter(n => n.id !== id);
      localStorage.setItem(notesKey, JSON.stringify(notes));

      this.renderNotebook();
      showToast('Note deleted.');
    },

    // Quoting Modal
    openQuoteModal: function (designName, categoryName) {
      if (currentUser && currentUser.status === 'Pending') {
        showToast('Sourcing Restricted: Account verification in progress.');
        return;
      }

      dom.modalDesignName.textContent = designName;
      dom.modalDesignCategory.textContent = categoryName;
      dom.modalFieldDesign.value = designName;
      dom.modalFieldCategory.value = categoryName;

      // Pre-fill location
      dom.modalFieldLocation.value = `${currentUser.city || ''}, ${currentUser.state || ''}`;

      // Reset file list
      selectedFiles = [];
      dom.modalFilePreview.innerHTML = '';

      dom.catalogQuoteModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    },

    closeQuoteModal: function () {
      dom.catalogQuoteModal.style.display = 'none';
      document.body.style.overflow = '';
      dom.catalogQuoteForm.reset();
    },

    // Notes modal
    openNotesModal: function (id) {
      const quotes = getDatabase(STORAGE_KEYS.quotes);
      const quote = quotes.find(q => q.id === id);
      if (!quote) return;

      dom.logProjectId.textContent = quote.id;
      dom.logNotesDisplay.innerHTML = `
        <div class="log-entry">
          <span class="log-date">${quote.date}</span>
          <span class="log-status">${quote.status}</span>
          <p class="log-text">${escapeHtml(quote.adminNotes || 'Sourcing order created. Direct factory design line initialized.')}</p>
        </div>
      `;
      dom.sourcingNotesModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    },

    closeNotesModal: function () {
      dom.sourcingNotesModal.style.display = 'none';
      document.body.style.overflow = '';
    },

    submitCatalogQuote: function (e) {
      e.preventDefault();

      if (currentUser.status === 'Pending') {
        showToast('Submission Blocked: Account verification required.');
        return;
      }

      const designName = dom.modalFieldDesign.value;
      const projectType = dom.modalFieldCategory.value;
      const location = dom.modalFieldLocation.value.trim();
      const budget = dom.modalFieldBudget.value;
      const timeline = dom.modalFieldTimeline.value;
      const materials = dom.modalFieldMaterials.value.trim() || 'Standard style spec';
      const dimensions = dom.modalFieldDimensions.value.trim();

      if (!location || !budget || !timeline || !dimensions) {
        showToast('Please fill in all required sourcing details.');
        return;
      }

      const submitBtn = $('#modal-submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Request...';

      setTimeout(() => {
        const quotes = getDatabase(STORAGE_KEYS.quotes);
        const quoteId = 'QTE-' + String(quotes.length + 1).padStart(3, '0');

        const newQuote = {
          id: quoteId,
          date: new Date().toISOString().split('T')[0],
          memberId: currentUser.id,
          memberName: `${currentUser.firstName} ${currentUser.lastName}`,
          companyName: currentUser.company,
          email: currentUser.email,
          phone: currentUser.phone,
          projectType: projectType,
          designName: designName,
          preferredMaterials: materials,
          budget: budget,
          timeline: timeline,
          description: dimensions,
          isCustom: false,
          files: selectedFiles.map(f => f.name),
          status: 'New',
          adminNotes: 'New catalog design sourcing request received. Queue processing.'
        };

        quotes.push(newQuote);
        setDatabase(STORAGE_KEYS.quotes, quotes);

        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Sourcing Request';

        this.closeQuoteModal();
        showToast(`Request ${quoteId} submitted successfully!`);
        this.switchTab('quotes');
      }, 1200);
    },

    submitCustomSourcing: function (e) {
      e.preventDefault();

      if (currentUser.status === 'Pending') {
        showToast('Submission Blocked: Account verification required.');
        return;
      }

      const projName = dom.customProjName.value.trim();
      const projScope = dom.customProjType.value;
      const measurements = dom.customMeasurements.value.trim();
      const materials = dom.customMaterials.value.trim() || 'Custom material specifications';
      const budget = dom.customBudget.value;
      const timeline = dom.customTimeline.value;
      const notes = dom.customNotes.value.trim();

      if (!projName || !projScope || !measurements || !budget || !timeline) {
        showToast('Please complete all required fields.');
        return;
      }

      const submitBtn = $('#custom-submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publishing Custom Scope...';

      setTimeout(() => {
        const quotes = getDatabase(STORAGE_KEYS.quotes);
        const quoteId = 'QTE-' + String(quotes.length + 1).padStart(3, '0');

        const newQuote = {
          id: quoteId,
          date: new Date().toISOString().split('T')[0],
          memberId: currentUser.id,
          memberName: `${currentUser.firstName} ${currentUser.lastName}`,
          companyName: currentUser.company,
          email: currentUser.email,
          phone: currentUser.phone,
          projectType: projScope,
          designName: `Custom: ${projName}`,
          preferredMaterials: materials,
          budget: budget,
          timeline: timeline,
          description: `Dimensions: ${measurements}. Notes: ${notes}`,
          isCustom: true,
          files: selectedFiles.map(f => f.name),
          status: 'New',
          adminNotes: 'Custom design upload received. Sourcing engineering review started.'
        };

        quotes.push(newQuote);
        setDatabase(STORAGE_KEYS.quotes, quotes);

        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Sourcing Project';

        dom.customSourcingForm.reset();
        selectedFiles = [];
        dom.customFilePreview.innerHTML = '';
        
        showToast(`Custom project ${quoteId} published successfully!`);
        this.switchTab('quotes');
      }, 1500);
    },

    renderQuotes: function () {
      const quotes = getDatabase(STORAGE_KEYS.quotes);
      const myQuotes = quotes.filter(q => q.memberId === currentUser.id);
      
      const tbody = $('#member-quotes-list');
      const emptyState = $('#quotes-empty-state');
      
      // Update count badges
      if (myQuotes.length > 0) {
        dom.quotesCountBadge.textContent = myQuotes.length;
        dom.quotesCountBadge.style.display = 'inline-block';
        emptyState.style.display = 'none';
        tbody.parentElement.style.display = 'table';
      } else {
        dom.quotesCountBadge.style.display = 'none';
        emptyState.style.display = 'block';
        tbody.parentElement.style.display = 'none';
        return;
      }

      tbody.innerHTML = myQuotes.map(q => `
        <tr>
          <td><span class="quote-id-tag">${q.id}</span></td>
          <td>${q.date}</td>
          <td>
            <div class="proj-meta-cell">
              <strong>${escapeHtml(q.designName)}</strong>
              <span>${escapeHtml(q.preferredMaterials)}</span>
            </div>
          </td>
          <td><span class="type-tag ${q.isCustom ? 'custom' : 'catalog'}">${q.isCustom ? 'Custom' : 'Catalog'}</span></td>
          <td>${q.budget}</td>
          <td><span class="status-badge ${statusClass(q.status)}">${escapeHtml(q.status)}</span></td>
          <td>
            <button class="btn-view-notes" onclick="CBDashboard.openNotesModal('${q.id}')">View Notes</button>
          </td>
        </tr>
      `).join('');
    }
  };

  function statusClass(status) {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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

  // ─── FILE UPLOAD HANDLERS ───
  function initFileUploads() {
    // Custom sourcing file inputs
    if (dom.customFileZone && dom.customFileInput) {
      dom.customFileZone.addEventListener('click', () => dom.customFileInput.click());
      dom.customFileInput.addEventListener('change', (e) => handleFileSelect(e, dom.customFilePreview));
      
      setupDragDrop(dom.customFileZone, dom.customFilePreview);
    }

    // Catalog modal file inputs
    if (dom.modalFileZone && dom.modalFileInput) {
      dom.modalFileZone.addEventListener('click', () => dom.modalFileInput.click());
      dom.modalFileInput.addEventListener('change', (e) => handleFileSelect(e, dom.modalFilePreview));
      
      setupDragDrop(dom.modalFileZone, dom.modalFilePreview);
    }
  }

  function handleFileSelect(e, previewContainer) {
    const files = [...e.target.files];
    addFiles(files, previewContainer);
  }

  function setupDragDrop(zone, previewContainer) {
    ['dragenter', 'dragover'].forEach(name => {
      zone.addEventListener(name, (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(name => {
      zone.addEventListener(name, (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
      }, false);
    });

    zone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = [...dt.files];
      addFiles(files, previewContainer);
    }, false);
  }

  function addFiles(files, previewContainer) {
    files.forEach(file => {
      if (selectedFiles.some(f => f.name === file.name)) return;
      selectedFiles.push(file);

      const div = document.createElement('div');
      div.className = 'file-preview-item';
      div.innerHTML = `
        <span class="file-name">${escapeHtml(file.name)}</span>
        <button type="button" class="file-remove" onclick="event.stopPropagation(); removeFile('${escapeHtml(file.name)}', this)">&times;</button>
      `;
      previewContainer.appendChild(div);
    });
  }

  window.removeFile = function (fileName, btnEl) {
    selectedFiles = selectedFiles.filter(f => f.name !== fileName);
    btnEl.parentElement.remove();
  };

  // ─── EVENT BINDING ───
  function bindEvents() {
    if (dom.loginForm) dom.loginForm.addEventListener('submit', CBAuth.handleLogin);
    if (dom.signupForm) dom.signupForm.addEventListener('submit', CBAuth.handleSignup);
    if (dom.logoutBtn) {
      dom.logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.session);
        showLoginScreen();
      });
    }

    if (dom.catalogQuoteForm) dom.catalogQuoteForm.addEventListener('submit', (e) => CBDashboard.submitCatalogQuote(e));
    if (dom.customSourcingForm) dom.customSourcingForm.addEventListener('submit', (e) => CBDashboard.submitCustomSourcing(e));

    // Clear error on email/pass change
    [dom.loginEmail, dom.loginPassword, dom.signupEmail, dom.signupPassword].forEach(el => {
      if (el) el.addEventListener('input', () => dom.loginError.classList.remove('show'));
    });
  }

  // ─── INITIALIZATION ───
  function init() {
    seedInitialData();
    bindEvents();
    initFileUploads();
    checkSession();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
