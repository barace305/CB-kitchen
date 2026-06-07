/* ============================================================
   CB KITCHEN — ADMIN PANEL LOGICAL ENGINE
   Unified Members · Status Progression · Notes Logs · CSV Export
   ============================================================ */

(function () {
  'use strict';

  // ─── CREDENTIALS CONFIGURATION ───
  // CRITICAL SECURITY NOTE: In a production environment, this hardcoded 
  // check should be replaced with an API call returning a JWT token 
  // or a secure HttpOnly cookie session check. Environment variables 
  // would be used on the backend.
  const ADMIN_CREDENTIALS = {
    usernames: ['admin', 'tone'],
    passwords: ['TONE1234', 'cbkitchen2026']
  };

  const STORAGE_KEYS = {
    session: 'cbk_admin_session',
    members: 'cbk_members',
    quotes: 'cbk_quotes',
    seeded: 'cbk_data_seeded'
  };

  // ─── DOM SELECTORS ───
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {};

  function cacheDom() {
    dom.loginScreen = $('#loginScreen');
    dom.loginForm = $('#loginForm');
    dom.loginUsername = $('#loginUsername');
    dom.loginPassword = $('#loginPassword');
    dom.loginError = $('#loginError');
    dom.dashboard = $('#adminDashboard');
    dom.sidebar = $('#sidebar');
    dom.sidebarOverlay = $('#sidebarOverlay');
    dom.hamburgerBtn = $('#hamburgerBtn');
    dom.logoutBtn = $('#logoutBtn');
    
    // Stats
    dom.statMembers = $('#statMembers');
    dom.statActive = $('#statActive');
    dom.statPending = $('#statPending');
    dom.statQuotes = $('#statQuotes');
    
    // Dashboard Tables
    dom.recentApplicationsTable = $('#recentApplicationsTable');
    dom.recentQuotesTable = $('#recentQuotesTable');
    
    // Members Section
    dom.membersTable = $('#membersTable');
    dom.memberSearch = $('#memberSearch');
    dom.memberStatusFilter = $('#memberStatusFilter');
    dom.memberEmptyState = $('#memberEmptyState');
    dom.exportMembersBtn = $('#exportMembersBtn');
    
    // Quotes Section
    dom.quotesTable = $('#quotesTable');
    dom.quoteSearch = $('#quoteSearch');
    dom.quoteStatusFilter = $('#quoteStatusFilter');
    dom.quoteEmptyState = $('#quoteEmptyState');
    dom.exportQuotesBtn = $('#exportQuotesBtn');
    
    // Custom Builds Section
    dom.customBuildsTable = $('#customBuildsTable');
    dom.customSearch = $('#customSearch');
    dom.customStatusFilter = $('#customStatusFilter');
    dom.customEmptyState = $('#customEmptyState');
    dom.exportCustomBtn = $('#exportCustomBtn');
    
    // Modal
    dom.detailModal = $('#detailModal');
    dom.modalTitle = $('#modalTitle');
    dom.modalBody = $('#modalBody');
    dom.modalFooter = $('#modalFooter');
    dom.modalCloseBtn = $('#modalCloseBtn');
    
    // Toast
    dom.toast = $('#toast');
  }

  // ═══════════════════════════════════════════════════════
  // SEED LOGIC (IF NOT SEEDED)
  // ═══════════════════════════════════════════════════════
  function seedInitialData() {
    if (localStorage.getItem(STORAGE_KEYS.seeded)) return;

    // Seed unified member list
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
      },
      {
        id: 'MEM-005',
        memberSince: '2026-06-01',
        firstName: 'Marcus',
        lastName: 'Reynolds',
        company: 'Reynolds Custom Builds',
        email: 'marcus@reynoldscb.com',
        phone: '(305) 555-0142',
        city: 'Miami',
        state: 'FL',
        tier: 'Founding Member',
        status: 'Pending',
        password: 'member123',
        notes: 'Wants sourcing access for direct factory kitchen lines.'
      },
      {
        id: 'MEM-006',
        memberSince: '2026-06-03',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        company: 'Mitchell & Co. Renovations',
        email: 'sarah@mitchellreno.com',
        phone: '(773) 555-0156',
        city: 'Chicago',
        state: 'IL',
        tier: 'Founding Member',
        status: 'Pending',
        password: 'member123',
        notes: 'Remodeler seeking bathroom vanities container sourcing.'
      }
    ];

    // Seed quotes/custom builds
    const quotes = [
      {
        id: 'QTE-001',
        date: '2026-05-20',
        memberId: 'MEM-003',
        memberName: 'James Whitmore',
        companyName: 'Whitmore Development Group',
        email: 'james@whitmoredev.com',
        phone: '(404) 555-0129',
        projectType: 'Kitchen Sourcing',
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
        projectType: 'Bathroom Sourcing',
        designName: 'Luxury Vanity Line',
        preferredMaterials: 'Double floating oak vanity, gold brackets',
        budget: '$40,000 - $60,000',
        timeline: '6-8 weeks',
        description: 'Master bathroom renovation. Heated floor layout and double vanities.',
        isCustom: false,
        files: [],
        status: 'Reviewing',
        adminNotes: 'Reviewed design scale. Quoting marble slabs.'
      },
      {
        id: 'QTE-003',
        date: '2026-06-02',
        memberId: 'MEM-002',
        memberName: 'David Chen',
        companyName: 'Pacific Edge Construction',
        email: 'david@pacificedge.co',
        phone: '(415) 555-0173',
        projectType: 'Full Custom Project',
        designName: 'Custom: Oakland Hills Villa',
        preferredMaterials: 'Exotic teak details, matte black cabinets, concrete slabs',
        budget: '$100,000+',
        timeline: '12+ weeks',
        description: 'Dimensions: 34ft width, 10ft height custom layout. Notes: Architectural elevations attached.',
        isCustom: true,
        files: ['villa_level_1.pdf', 'kitchen_layout_rendered.jpg'],
        status: 'New',
        adminNotes: 'Sourcing blueprints received. Initial layout matching started.'
      }
    ];

    localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members));
    localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));
    localStorage.setItem(STORAGE_KEYS.seeded, 'true');
  }

  // ─── DATA ACCESSORS ───
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
  // LOGIN / ROUTING
  // ═══════════════════════════════════════════════════════
  function isLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.session) === 'authenticated';
  }

  function handleLogin(e) {
    e.preventDefault();
    const user = dom.loginUsername.value.trim();
    const pass = dom.loginPassword.value.trim();

    const isUsernameOk = ADMIN_CREDENTIALS.usernames.includes(user.toLowerCase());
    const isPasswordOk = ADMIN_CREDENTIALS.passwords.some(p => pass.toLowerCase() === p.toLowerCase());

    if (isUsernameOk && isPasswordOk) {
      localStorage.setItem(STORAGE_KEYS.session, 'authenticated');
      showDashboardView();
    } else {
      dom.loginError.style.display = 'flex';
      dom.loginPassword.value = '';
      dom.loginPassword.focus();
    }
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.session);
    showLoginScreen();
  }

  function showLoginScreen() {
    dom.loginScreen.style.display = 'flex';
    dom.dashboard.style.display = 'none';
    dom.loginUsername.value = '';
    dom.loginPassword.value = '';
    dom.loginError.style.display = 'none';
  }

  function showDashboardView() {
    dom.loginScreen.style.display = 'none';
    dom.dashboard.style.display = 'flex';
    navigateTo('dashboard');
  }

  let currentPage = 'dashboard';
  function navigateTo(page) {
    currentPage = page;

    // Sidebar indicators
    $$('.nav-item[data-page]').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Toggle layouts
    $$('.page').forEach(el => el.classList.remove('active'));
    const target = $(`#page-${page}`);
    if (target) target.classList.add('active');

    // Close mobile sidebars
    dom.sidebar.classList.remove('open');
    dom.sidebarOverlay.classList.remove('active');
    dom.hamburgerBtn.classList.remove('active');

    // Load data
    switch (page) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'members':
        renderMembers();
        break;
      case 'quotes':
        renderQuotes();
        break;
      case 'custom-builds':
        renderCustomBuilds();
        break;
    }
  }

  // ═══════════════════════════════════════════════════════
  // VIEW RENDERERS
  // ═══════════════════════════════════════════════════════

  // ── Dashboard Overview ──
  function renderDashboard() {
    const members = getDatabase(STORAGE_KEYS.members);
    const quotes = getDatabase(STORAGE_KEYS.quotes);

    // Stats Computation
    animateCounter($('#statMembers'), members.length);
    animateCounter($('#statActive'), members.filter(m => m.status === 'Active').length);
    animateCounter($('#statPending'), members.filter(m => m.status === 'Pending').length);
    animateCounter($('#statQuotes'), quotes.length);

    // Recent member registrations (last 5 sorted by joined date)
    const recentMembers = [...members].sort((a,b) => new Date(b.memberSince) - new Date(a.memberSince)).slice(0, 5);
    dom.recentApplicationsTable.innerHTML = recentMembers.length
      ? recentMembers.map(m => `
          <tr>
            <td>${formatDate(m.memberSince)}</td>
            <td><strong>${escapeHtml(m.firstName)} ${escapeHtml(m.lastName)}</strong></td>
            <td>${escapeHtml(m.company)}</td>
            <td>${escapeHtml(m.city)}, ${escapeHtml(m.state)}</td>
            <td><span class="status-badge ${statusClass(m.status)}">${escapeHtml(m.status)}</span></td>
          </tr>
        `).join('')
      : '<tr><td colspan="5" class="table-empty-notice">No contractor registrations logged</td></tr>';

    // Recent sourcing orders (last 5 sorted by date)
    const recentQuotes = [...quotes].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    dom.recentQuotesTable.innerHTML = recentQuotes.length
      ? recentQuotes.map(q => `
          <tr>
            <td>${formatDate(q.date)}</td>
            <td><strong>${escapeHtml(q.companyName)}</strong></td>
            <td>${escapeHtml(q.designName)}</td>
            <td><span class="type-tag ${q.isCustom ? 'custom' : 'catalog'}">${q.isCustom ? 'Custom' : 'Catalog'}</span></td>
            <td><span class="status-badge ${statusClass(q.status)}">${escapeHtml(q.status)}</span></td>
          </tr>
        `).join('')
      : '<tr><td colspan="5" class="table-empty-notice">No sourcing requests logged</td></tr>';
  }

  // ── Members List ──
  function getFilteredMembers() {
    let list = getDatabase(STORAGE_KEYS.members);
    const search = (dom.memberSearch.value || '').toLowerCase().trim();
    const status = dom.memberStatusFilter.value;

    if (search) {
      list = list.filter(m => 
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(search) ||
        (m.company || '').toLowerCase().includes(search) ||
        (m.email || '').toLowerCase().includes(search)
      );
    }

    if (status !== 'all') {
      list = list.filter(m => m.status === status);
    }

    return list.sort((a,b) => new Date(b.memberSince) - new Date(a.memberSince));
  }

  function renderMembers() {
    const list = getFilteredMembers();

    if (list.length === 0) {
      dom.membersTable.innerHTML = '';
      dom.memberEmptyState.style.display = 'block';
      return;
    }

    dom.memberEmptyState.style.display = 'none';
    dom.membersTable.innerHTML = list.map(m => `
      <tr>
        <td>${formatDate(m.memberSince)}</td>
        <td><strong>${escapeHtml(m.firstName)} ${escapeHtml(m.lastName)}</strong></td>
        <td>${escapeHtml(m.company)}</td>
        <td>${escapeHtml(m.email)}</td>
        <td class="hide-mobile">${escapeHtml(m.phone)}</td>
        <td>${escapeHtml(m.city)}, ${escapeHtml(m.state)}</td>
        <td><span class="status-badge ${statusClass(m.status)}">${escapeHtml(m.status)}</span></td>
        <td>
          <button class="btn btn-sm btn-blue" onclick="CBAdmin.viewMember('${m.id}')">Manage</button>
        </td>
      </tr>
    `).join('');
  }

  // ── Quote Requests (Catalog template builds) ──
  function getFilteredQuotes() {
    let list = getDatabase(STORAGE_KEYS.quotes).filter(q => !q.isCustom);
    const search = (dom.quoteSearch.value || '').toLowerCase().trim();
    const status = dom.quoteStatusFilter.value;

    if (search) {
      list = list.filter(q =>
        (q.companyName || '').toLowerCase().includes(search) ||
        (q.designName || '').toLowerCase().includes(search) ||
        `${q.firstName} ${q.lastName}`.toLowerCase().includes(search)
      );
    }

    if (status !== 'all') {
      list = list.filter(q => q.status === status);
    }

    return list.sort((a,b) => new Date(b.date) - new Date(a.date));
  }

  function renderQuotes() {
    const list = getFilteredQuotes();

    if (list.length === 0) {
      dom.quotesTable.innerHTML = '';
      dom.quoteEmptyState.style.display = 'block';
      return;
    }

    dom.quoteEmptyState.style.display = 'none';
    dom.quotesTable.innerHTML = list.map(q => `
      <tr>
        <td>${formatDate(q.date)}</td>
        <td><strong>${escapeHtml(q.companyName)}</strong></td>
        <td>${escapeHtml(q.designName)}</td>
        <td>${escapeHtml(q.projectType)}</td>
        <td>${escapeHtml(q.budget)}</td>
        <td>${escapeHtml(q.timeline)}</td>
        <td><span class="status-badge ${statusClass(q.status)}">${escapeHtml(q.status)}</span></td>
        <td>
          <button class="btn btn-sm btn-blue" onclick="CBAdmin.viewQuote('${q.id}')">Verify</button>
        </td>
      </tr>
    `).join('');
  }

  // ── Custom Sourcing Builds ──
  function getFilteredCustom() {
    let list = getDatabase(STORAGE_KEYS.quotes).filter(q => q.isCustom);
    const search = (dom.customSearch.value || '').toLowerCase().trim();
    const status = dom.customStatusFilter.value;

    if (search) {
      list = list.filter(c =>
        (c.companyName || '').toLowerCase().includes(search) ||
        (c.designName || '').toLowerCase().includes(search) ||
        (c.projectType || '').toLowerCase().includes(search)
      );
    }

    if (status !== 'all') {
      list = list.filter(c => c.status === status);
    }

    return list.sort((a,b) => new Date(b.date) - new Date(a.date));
  }

  function renderCustomBuilds() {
    const list = getFilteredCustom();

    if (list.length === 0) {
      dom.customBuildsTable.innerHTML = '';
      dom.customEmptyState.style.display = 'block';
      return;
    }

    dom.customEmptyState.style.display = 'none';
    dom.customBuildsTable.innerHTML = list.map(c => {
      const filesCount = c.files ? c.files.length : 0;
      return `
        <tr>
          <td>${formatDate(c.date)}</td>
          <td><strong>${escapeHtml(c.companyName)}</strong></td>
          <td>${escapeHtml(c.designName.replace('Custom: ', ''))}</td>
          <td>${escapeHtml(c.projectType)}</td>
          <td>
            <span class="attachments-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              ${filesCount} File(s)
            </span>
          </td>
          <td>${escapeHtml(c.budget)}</td>
          <td><span class="status-badge ${statusClass(c.status)}">${escapeHtml(c.status)}</span></td>
          <td>
            <button class="btn btn-sm btn-blue" onclick="CBAdmin.viewQuote('${c.id}')">Details</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ═══════════════════════════════════════════════════════
  // ACTIONS / MODALS
  // ═══════════════════════════════════════════════════════

  // ── Member Detail Modal ──
  function viewMember(id) {
    const members = getDatabase(STORAGE_KEYS.members);
    const quotes = getDatabase(STORAGE_KEYS.quotes);
    
    const user = members.find(m => m.id === id);
    if (!user) return;

    // Fetch quotes submitted by this member
    const userQuotes = quotes.filter(q => q.memberId === user.id);

    dom.modalTitle.textContent = `Member Profile — ${user.firstName} ${user.lastName}`;
    
    // Build Quotes Table HTML
    const quotesHtml = userQuotes.length 
      ? `<table class="modal-sub-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Scope / Design</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${userQuotes.map(q => `
              <tr>
                <td><small>${q.id}</small></td>
                <td><small>${q.date}</small></td>
                <td><small>${escapeHtml(q.designName)}</small></td>
                <td><span class="status-badge ${statusClass(q.status)}" style="font-size:0.6rem; padding:2px 8px;">${q.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
         </table>`
      : '<p style="font-size:0.85rem; color:var(--text-muted);">No quote requests logged.</p>';

    dom.modalBody.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Member ID</span>
          <span class="detail-value">${user.id}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Joined Date</span>
          <span class="detail-value">${formatDate(user.memberSince)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Company Name</span>
          <span class="detail-value">${escapeHtml(user.company)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email Sourcing Address</span>
          <span class="detail-value">${escapeHtml(user.email)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Direct Phone</span>
          <span class="detail-value">${escapeHtml(user.phone)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Sourcing Location</span>
          <span class="detail-value">${escapeHtml(user.city || 'N/A')}, ${escapeHtml(user.state || 'N/A')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Company Sourcing Profile</span>
          <span class="detail-value">${escapeHtml(user.tier || 'Founding Contractor')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Verification Status</span>
          <select id="modal-member-status" class="modal-select">
            <option value="Pending" ${user.status === 'Pending' ? 'selected' : ''}>Pending Verification</option>
            <option value="Active" ${user.status === 'Active' ? 'selected' : ''}>Active Member</option>
            <option value="Expired" ${user.status === 'Expired' ? 'selected' : ''}>Expired Account</option>
            <option value="Cancelled" ${user.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
        
        <div class="detail-item full-width">
          <span class="detail-label">Procurement &amp; Direct Factory Notes</span>
          <textarea id="modal-member-notes" class="modal-textarea" rows="4" placeholder="Enter custom logs, developer license checks, credit status...">${escapeHtml(user.notes || '')}</textarea>
        </div>

        <div class="detail-item full-width" style="margin-top:16px;">
          <span class="detail-label" style="border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:8px; margin-bottom:12px;">Sourcing Requests History (${userQuotes.length})</span>
          ${quotesHtml}
        </div>
      </div>
    `;

    dom.modalFooter.innerHTML = `
      <button class="btn btn-outline" onclick="CBAdmin.closeModal()">Close</button>
      <button class="btn btn-gold" onclick="CBAdmin.saveMemberChanges('${user.id}')">Save Changes</button>
    `;

    openModal();
  }

  function saveMemberChanges(id) {
    const members = getDatabase(STORAGE_KEYS.members);
    const idx = members.findIndex(m => m.id === id);
    if (idx === -1) return;

    const newStatus = $('#modal-member-status').value;
    const newNotes = $('#modal-member-notes').value.trim();

    members[idx].status = newStatus;
    members[idx].notes = newNotes;
    
    setDatabase(STORAGE_KEYS.members, members);
    renderMembers();
    closeModal();
    showToast('Member profile and logs updated successfully.', 'success');
  }

  // ── Quote / Custom Build Detail Modal ──
  function viewQuote(id) {
    const quotes = getDatabase(STORAGE_KEYS.quotes);
    const q = quotes.find(x => x.id === id);
    if (!q) return;

    dom.modalTitle.textContent = `${q.isCustom ? 'Custom Build' : 'Catalog Quote'} — ${q.id}`;
    
    // Render file attachments links
    const filesHtml = q.files && q.files.length 
      ? `<div class="attachments-list">
          ${q.files.map(file => `
            <a href="#" class="attachment-file-link" onclick="event.preventDefault(); alert('Downloading Sourcing File: ${file}');">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              ${escapeHtml(file)}
            </a>
          `).join('')}
         </div>`
      : '<span style="color:var(--text-muted); font-size:0.85rem;">No sketch attachments.</span>';

    dom.modalBody.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Project ID</span>
          <span class="detail-value">${q.id}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Submission Date</span>
          <span class="detail-value">${formatDate(q.date)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Contractor Company</span>
          <span class="detail-value">${escapeHtml(q.companyName)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Contact Representative</span>
          <span class="detail-value">${escapeHtml(q.memberName || (q.firstName + ' ' + q.lastName))}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Design Line / Template</span>
          <span class="detail-value" style="color:var(--gold); font-weight:600;">${escapeHtml(q.designName)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Sourcing Category</span>
          <span class="detail-value">${escapeHtml(q.projectType)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Budget Range</span>
          <span class="detail-value">${escapeHtml(q.budget)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Lead Window</span>
          <span class="detail-value">${escapeHtml(q.timeline)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Procurement Status</span>
          <select id="modal-quote-status" class="modal-select">
            <option value="New" ${q.status === 'New' ? 'selected' : ''}>New Request</option>
            <option value="Reviewing" ${q.status === 'Reviewing' ? 'selected' : ''}>Reviewing Specs</option>
            <option value="Sent to manufacturer" ${q.status === 'Sent to manufacturer' ? 'selected' : ''}>Sent to Factory</option>
            <option value="Waiting for manufacturer" ${q.status === 'Waiting for manufacturer' ? 'selected' : ''}>Factory Estimating</option>
            <option value="Quote ready" ${q.status === 'Quote ready' ? 'selected' : ''}>Pricing Ready</option>
            <option value="Sent to client" ${q.status === 'Sent to client' ? 'selected' : ''}>Sent to Contractor</option>
            <option value="Accepted" ${q.status === 'Accepted' ? 'selected' : ''}>Accepted (Production)</option>
            <option value="Rejected" ${q.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            <option value="Completed" ${q.status === 'Completed' ? 'selected' : ''}>Order Sourced &amp; Delivered</option>
          </select>
        </div>
        
        <div class="detail-item full-width">
          <span class="detail-label">Preferred Sourcing Materials</span>
          <span class="detail-value">${escapeHtml(q.preferredMaterials || 'Standard Collection Specs')}</span>
        </div>

        <div class="detail-item full-width">
          <span class="detail-label">Dimensions / Sourcing Details</span>
          <div class="modal-text-panel">${escapeHtml(q.description)}</div>
        </div>

        <div class="detail-item full-width">
          <span class="detail-label">Elevations &amp; Sourcing Plans Attachments</span>
          ${filesHtml}
        </div>

        <div class="detail-item full-width">
          <span class="detail-label">Procurement Logs &amp; Manufacturer Updates</span>
          <textarea id="modal-quote-notes" class="modal-textarea" rows="4" placeholder="Enter correspondence updates, shipping tracker IDs, direct factory pricing breakdowns...">${escapeHtml(q.adminNotes || '')}</textarea>
        </div>
      </div>
    `;

    dom.modalFooter.innerHTML = `
      <button class="btn btn-outline" onclick="CBAdmin.closeModal()">Close</button>
      <button class="btn btn-gold" onclick="CBAdmin.saveQuoteChanges('${q.id}')">Save Changes</button>
    `;

    openModal();
  }

  function saveQuoteChanges(id) {
    const quotes = getDatabase(STORAGE_KEYS.quotes);
    const idx = quotes.findIndex(q => q.id === id);
    if (idx === -1) return;

    const newStatus = $('#modal-quote-status').value;
    const newNotes = $('#modal-quote-notes').value.trim();

    quotes[idx].status = newStatus;
    quotes[idx].adminNotes = newNotes;

    setDatabase(STORAGE_KEYS.quotes, quotes);
    
    // Refresh active section
    if (quotes[idx].isCustom) {
      renderCustomBuilds();
    } else {
      renderQuotes();
    }
    
    closeModal();
    showToast(`Sourcing order ${id} status updated successfully.`, 'success');
  }

  // ── Modals Display toggles ──
  function openModal() {
    dom.detailModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    dom.detailModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // ── Toast Notification ──
  let toastTimer = null;
  function showToast(message, type = 'info') {
    dom.toast.textContent = message;
    dom.toast.className = `toast ${type}`;
    dom.toast.style.display = 'block';

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      dom.toast.style.display = 'none';
    }, 3500);
  }

  // ═══════════════════════════════════════════════════════
  // CSV EXPORTS LOGIC
  // ═══════════════════════════════════════════════════════
  function escapeCsv(val) {
    if (val == null) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function downloadCsv(filename, headers, rows) {
    const csv = [
      headers.map(escapeCsv).join(','),
      ...rows.map(row => row.map(escapeCsv).join(','))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${rows.length} records successfully.`, 'success');
  }

  function exportMembers() {
    const list = getFilteredMembers();
    const headers = ['Joined Date', 'ID', 'First Name', 'Last Name', 'Company', 'Email', 'Phone', 'City', 'State', 'Profile Tier', 'Status', 'Sourcing Notes'];
    const rows = list.map(m => [
      m.memberSince, m.id, m.firstName, m.lastName, m.company, m.email, m.phone, m.city, m.state, m.tier, m.status, m.notes
    ]);
    downloadCsv('cbkitchen-members-sourcing.csv', headers, rows);
  }

  function exportQuotes() {
    const list = getFilteredQuotes();
    const headers = ['Date', 'Quote ID', 'Company', 'Contact Name', 'Design Spec', 'Scope Category', 'Budget Goal', 'Timeline Required', 'Sourcing Details', 'Materials Preferred', 'Status', 'Procurement Log'];
    const rows = list.map(q => [
      q.date, q.id, q.companyName, q.memberName, q.designName, q.projectType, q.budget, q.timeline, q.description, q.preferredMaterials, q.status, q.adminNotes
    ]);
    downloadCsv('cbkitchen-catalog-sourcing.csv', headers, rows);
  }

  function exportCustomBuilds() {
    const list = getFilteredCustom();
    const headers = ['Date', 'Custom ID', 'Company', 'Contact Name', 'Project Name', 'Sourcing Scope', 'Sketch Count', 'Budget Goal', 'Timeline Required', 'Scope Details', 'Materials Preferred', 'Status', 'Procurement Log'];
    const rows = list.map(c => [
      c.date, c.id, c.companyName, c.memberName, c.designName.replace('Custom: ', ''), c.projectType, c.files ? c.files.length : 0, c.budget, c.timeline, c.description, c.preferredMaterials, c.status, c.adminNotes
    ]);
    downloadCsv('cbkitchen-custom-sourcing.csv', headers, rows);
  }

  // ── Counter animation ──
  function animateCounter(el, target) {
    if (!el) return;
    const current = parseInt(el.textContent) || 0;
    if (current === target) { el.textContent = target; return; }
    const duration = 500;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(current + (target - current) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  function statusClass(status) {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  // ═══════════════════════════════════════════════════════
  // EVENT INITS
  // ═══════════════════════════════════════════════════════
  function initEvents() {
    dom.loginForm.addEventListener('submit', handleLogin);
    dom.logoutBtn.addEventListener('click', handleLogout);

    // Sidebar page routing
    $$('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(item.dataset.page);
      });
    });

    // Dashboard links
    $$('.card-link[data-goto]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.goto);
      });
    });

    // Mobile sidebar toggle
    dom.hamburgerBtn.addEventListener('click', () => {
      const isOpen = dom.sidebar.classList.toggle('open');
      dom.sidebarOverlay.classList.toggle('active', isOpen);
      dom.hamburgerBtn.classList.toggle('active', isOpen);
    });

    dom.sidebarOverlay.addEventListener('click', () => {
      dom.sidebar.classList.remove('open');
      dom.sidebarOverlay.classList.remove('active');
      dom.hamburgerBtn.classList.remove('active');
    });

    // Members search & filter
    dom.memberSearch.addEventListener('input', debounce(renderMembers, 200));
    dom.memberStatusFilter.addEventListener('change', renderMembers);

    // Quotes search & filter
    dom.quoteSearch.addEventListener('input', debounce(renderQuotes, 200));
    dom.quoteStatusFilter.addEventListener('change', renderQuotes);

    // Custom Sourcing search & filter
    dom.customSearch.addEventListener('input', debounce(renderCustomBuilds, 200));
    dom.customStatusFilter.addEventListener('change', renderCustomBuilds);

    // Exports
    dom.exportMembersBtn.addEventListener('click', exportMembers);
    dom.exportQuotesBtn.addEventListener('click', exportQuotes);
    dom.exportCustomBtn.addEventListener('click', exportCustomBuilds);

    // Modals Close handlers
    dom.modalCloseBtn.addEventListener('click', closeModal);
    dom.detailModal.addEventListener('click', (e) => {
      if (e.target === dom.detailModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.detailModal.style.display !== 'none') closeModal();
    });
  }

  // ═══════════════════════════════════════════════════════
  // BOOT ADMINPANEL
  // ═══════════════════════════════════════════════════════
  function init() {
    cacheDom();
    seedInitialData();
    initEvents();

    if (isLoggedIn()) {
      showDashboardView();
    } else {
      showLoginScreen();
    }
  }

  // Expose API for inline onclick event triggers in HTML
  window.CBAdmin = {
    viewMember,
    saveMemberChanges,
    viewQuote,
    saveQuoteChanges,
    closeModal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
