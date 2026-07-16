/* ============================================================
   CB KITCHEN — PRIVATE SOURCING PORTAL DASHBOARD CONTROLLER JS
   ============================================================ */

(function () {
  'use strict';

  // ─── STORAGE KEYS ───
  const STORAGE_KEYS = {
    session: 'cbk_member_session', // Active user details
    quotes: 'cbk_quotes',          // All submitted quote requests
  };

  // ─── DOM SELECTORS ───
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => [...(c || document).querySelectorAll(s)];

  // ─── AUTHENTICATION SAFEGUARD ───
  let currentUser = null;
  try {
    const sessionData = localStorage.getItem(STORAGE_KEYS.session);
    if (!sessionData) {
      // Not authenticated, redirect to login page
      window.location.href = '../index.html';
      return;
    }
    currentUser = JSON.parse(sessionData);
  } catch (e) {
    console.error('Session authentication error:', e);
    window.location.href = '../index.html';
    return;
  }

  // ─── DESIGN PRODUCTS DATA ENGINE (SEEDED) ───
  const CATALOG_PRODUCTS = [
    {
      id: 'style-kitchen-1',
      category: 'kitchen',
      name: 'Warm Contemporary Kitchen',
      image: '../../assets/images/collection-luxury-kitchens.png',
      desc: 'Seamless slab cabinetry combining natural European oak veneers with architectural matte white lacquer surfaces. Features flush integrated hardware channels and a massive floating prep island.',
      price: '$12,500 - $18,000',
      specs: {
        carcass: '18mm Plywood core with grey melamine laminate',
        runners: 'Blumotion concealed runner systems with soft-close',
        warranty: '10-Year structural factory sourcing warranty'
      },
      isTrending: true
    },
    {
      id: 'style-kitchen-2',
      category: 'kitchen',
      name: 'Tropical Modern Collection',
      image: '../../assets/images/collection-future-home.png',
      desc: 'Deep brushed teak slab drawers accented by dark bronze profile trims. Engineered for indoor-outdoor architectural coherence with moisture-resistant joinery sealants.',
      price: '$15,000 - $22,000',
      specs: {
        carcass: 'Marine-grade anti-moisture composite plywood',
        runners: 'Salice silent self-closing drawer runners',
        warranty: '12-Year premium estate factory warranty'
      },
      isTrending: true
    },
    {
      id: 'style-kitchen-3',
      category: 'kitchen',
      name: 'Industrial Transitional',
      image: '../../assets/images/collection-custom-cabinets.png',
      desc: 'Elegant shaker profiles highlighted by fine black steel borders and ribbed glass accent doors. Blends traditional craftsmanship with raw modern architectural elements.',
      price: '$11,000 - $16,500',
      specs: {
        carcass: '18mm High-density MR-MDF core',
        runners: 'Hettich soft-close synchronized slides',
        warranty: '10-Year structural factory warranty'
      },
      isTrending: false
    },
    {
      id: 'style-bath-1',
      category: 'bath',
      name: 'Bel Air Floating Double Vanity',
      image: '../../assets/images/collection-bathroom-vanities.png',
      desc: 'Ultra-sleek wall-mounted design featuring mitered oak casework and integrated LED channels. Features twin oversized soft-close organization drawers.',
      price: '$3,800 - $5,500',
      specs: {
        carcass: '18mm Premium plywood with moisture-barrier coating',
        runners: 'Blum Tandembox hidden runners',
        warranty: '5-Year wet-space specialized warranty'
      },
      isTrending: true
    },
    {
      id: 'style-bath-2',
      category: 'bath',
      name: 'Executive Marble Integrated Vanity',
      image: '../../assets/images/collection-commercial.png',
      desc: 'Premium dark timber framing optimized to carry heavy stone slabs. Handcrafted flush drawer fronts are fully grain-matched for consecutive visual alignment.',
      price: '$4,500 - $6,800',
      specs: {
        carcass: 'Solid hardwood reinforcement rails with plywood panels',
        runners: 'Blumotion silent motion runners',
        warranty: '5-Year structural hardware warranty'
      },
      isTrending: true
    },
    {
      id: 'style-closet-1',
      category: 'closet',
      name: 'Celebrity Walk-In Closet Wardrobe',
      image: '../../assets/images/collection-walkin-closets.png',
      desc: 'Floor-to-ceiling modular wardrobe suite featuring brushed metal trims, integrated leather valet trays, soft-close velvet lined jewelry drawers, and warm architectural lighting.',
      price: '$18,000 - $29,000',
      specs: {
        carcass: '25mm Heavy-load shelves and side walls',
        runners: 'Blum motion synchronized undermount tracks',
        warranty: '10-Year luxury closet partition warranty'
      },
      isTrending: true
    }
  ];

  // ─── INITIALIZING STORAGE SEED DATA ───
  function initializeDatabase() {
    try {
      const existingQuotes = localStorage.getItem(STORAGE_KEYS.quotes);
      if (!existingQuotes) {
        const seedQuotes = [
          {
            id: 'REF-2026-001',
            userEmail: currentUser.email,
            projectName: 'Brentwood Estate Custom Kitchen',
            projectType: 'kitchen',
            designStyle: 'Warm Contemporary Kitchen',
            specs: 'Natural European Oak veneer, Plywood core box, Blumotion runners',
            size: 'Standard Kitchen (15-30 linear feet)',
            budget: '$10,000 - $25,000',
            timeline: 'Standard (8-12 weeks)',
            status: 'production',
            statusLabel: 'In Production',
            date: '2026-06-12',
            quoteAmount: '$16,800'
          },
          {
            id: 'REF-2026-002',
            userEmail: currentUser.email,
            projectName: 'Bel Air Master Suite Vanity',
            projectType: 'bath',
            designStyle: 'Bel Air Floating Double Vanity',
            specs: 'Matte Black Lacquer finish, Blum Tandembox runners',
            size: 'Compact Space',
            budget: 'Under $10,000',
            timeline: 'Immediate',
            status: 'quoted',
            statusLabel: 'Quote Ready',
            date: '2026-06-24',
            quoteAmount: '$4,150'
          },
          {
            id: 'REF-2026-003',
            userEmail: currentUser.email,
            projectName: 'Beverly Hills Walk-in Suite',
            projectType: 'closet',
            designStyle: 'Celebrity Walk-In Closet Wardrobe',
            specs: 'Natural European Oak, Velvet jewelry inserts, Integrated LED channels',
            size: 'Grand Room (30+ linear feet)',
            budget: '$25,000 - $50,000',
            timeline: 'Standard',
            status: 'reviewing',
            statusLabel: 'Under Review',
            date: '2026-07-05',
            quoteAmount: 'Pending Engineering Review'
          }
        ];
        localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(seedQuotes));
      }
    } catch (e) {
      console.error('Database seeding failed:', e);
    }
  }

  // ─── INITIAL RUN ───
  initializeDatabase();

  // ─── DYNAMIC USER DATA INJECTION ───
  function populateUserProfile() {
    if (currentUser) {
      $('#user-name-display').textContent = currentUser.name;
      $('#user-company-display').textContent = currentUser.company;
      $('#user-tier-display').textContent = currentUser.tier;
      
      const welcomeName = $('.user-highlight-name');
      if (welcomeName) welcomeName.textContent = currentUser.name;
    }
  }
  populateUserProfile();

  // ─── SPA TAB CONTROLLER ───
  const sidebarLinks = $$('.sidebar-link');
  const tabPanes = $$('.tab-pane');
  const mobileSidebar = $('#dashboard-sidebar');
  const hamburgerBtn = $('#mobile-nav-toggle');

  function switchTab(tabId) {
    // Set active sidebar link
    sidebarLinks.forEach(link => {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Display appropriate pane
    tabPanes.forEach(pane => {
      if (pane.id === `pane-${tabId}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Close mobile menus
    if (mobileSidebar) mobileSidebar.classList.remove('open');
    if (hamburgerBtn) hamburgerBtn.classList.remove('open');

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Action cards on dashboard redirecting to tabs
  $$('.action-card').forEach(card => {
    card.addEventListener('click', function () {
      const action = this.getAttribute('data-action');
      switchTab(action);
    });
  });

  // Navigation triggers in dropdowns
  $$('.nav-trigger').forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('data-target');
      switchTab(target);
      $('#profile-container-el')?.classList.remove('open');
    });
  });

  // ─── MOBILE DRAWER TOGGLE ───
  if (hamburgerBtn && mobileSidebar) {
    hamburgerBtn.addEventListener('click', function () {
      this.classList.toggle('open');
      mobileSidebar.classList.toggle('open');
    });
  }

  // ─── HEADER PROFILE DROPDOWN TOGGLE ───
  const profileToggleBtn = $('#profile-toggle-btn');
  const profileDropdown = $('#profile-dropdown-menu');

  if (profileToggleBtn && profileDropdown) {
    profileToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.parentElement.classList.toggle('open');
    });

    // Close dropdown on click outside
    document.addEventListener('click', function (e) {
      if (!profileToggleBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileToggleBtn.setAttribute('aria-expanded', 'false');
        profileToggleBtn.parentElement.classList.remove('open');
      }
    });
  }

  // Logout button action
  const logoutBtn = $('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem(STORAGE_KEYS.session);
      showToast('Logged out successfully.');
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1000);
    });
  }

  // ─── TOAST MESSENGER ENGINE ───
  let toastTimer = null;
  function showToast(msg) {
    const toast = $('#toast');
    const toastMessage = $('#toast-message');
    if (!toast || !toastMessage) return;
    
    if (toastTimer) clearTimeout(toastTimer);

    toastMessage.textContent = msg;
    toast.classList.add('show');

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toastTimer = null;
    }, 4000);
  }

  // ─── RENDER PROJECTS TRACKER & DASHBOARD SUMMARY ───
  function getQuotesFromStore() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.quotes);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function renderProjectsTracker() {
    const container = $('#projects-tracker-container');
    const overviewContainer = $('#overview-projects-container');
    
    if (!container) return;

    const quotes = getQuotesFromStore().filter(q => q.userEmail === currentUser.email);
    
    // Sort projects by date descending
    quotes.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update Dashboard overview stats numbers
    const activeCount = quotes.filter(q => ['submitted', 'reviewing', 'quoted', 'production'].includes(q.status)).length;
    const pendingCount = quotes.filter(q => ['submitted', 'reviewing'].includes(q.status)).length;
    const completedCount = quotes.filter(q => q.status === 'shipped').length;

    if ($('#stat-active-projects')) $('#stat-active-projects').textContent = activeCount;
    if ($('#stat-pending-quotes')) $('#stat-pending-quotes').textContent = pendingCount;
    if ($('#stat-completed-projects')) $('#stat-completed-projects').textContent = completedCount;

    // Render Tab 5: Sourcing Projects list
    if (quotes.length === 0) {
      container.innerHTML = `
        <div class="empty-state glass-panel" style="padding: 60px; text-align: center; color: var(--text-secondary);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 48px; height: 48px; stroke: var(--text-muted); margin-bottom: 16px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 500; color: var(--text-primary); margin-bottom: 8px;">No Sourcing Files Found</h3>
          <p style="font-size: 0.85rem; max-width: 400px; margin: 0 auto 20px;">You haven't submitted any architectural designs or drawings for factory pricing yet.</p>
          <button class="btn-primary" onclick="window.location.hash='custom-quote'" style="padding: 10px 24px; font-size: 0.72rem; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; border: none; background: var(--gold); color: #050505; border-radius: var(--radius-sm); cursor: pointer;">Submit Sourcing request</button>
        </div>
      `;
    } else {
      let gridHtml = '';
      quotes.forEach(project => {
        // Find which step index is active:
        // Steps: 1: Submitted, 2: Reviewing, 3: Quote Ready, 4: Production, 5: Shipped
        let activeStep = 1;
        if (project.status === 'reviewing') activeStep = 2;
        if (project.status === 'quoted') activeStep = 3;
        if (project.status === 'production') activeStep = 4;
        if (project.status === 'shipped') activeStep = 5;

        const fillWidth = ((activeStep - 1) / 4) * 100;

        gridHtml += `
          <div class="project-tracker-card glass-panel" data-status-filter="${project.status}">
            <div class="tracker-card-header">
              <div class="tracker-card-info">
                <h3>${project.projectName}</h3>
                <div class="tracker-card-meta">
                  <span>REF: ${project.id}</span>
                  <span>Date: ${project.date}</span>
                  <span>Timeline: ${project.timeline}</span>
                </div>
              </div>
              <span class="status-pill ${project.status}">${project.statusLabel}</span>
            </div>

            <!-- Timeline Graphics -->
            <div class="tracker-timeline-wrapper">
              <div class="timeline-track-line">
                <div class="timeline-track-fill" style="width: ${fillWidth}%"></div>
              </div>
              <div class="timeline-steps">
                <div class="timeline-step-item ${activeStep >= 1 ? (activeStep === 1 ? 'active' : 'completed') : ''}">
                  <div class="timeline-step-dot"></div>
                  <span class="timeline-step-label">Submitted</span>
                </div>
                <div class="timeline-step-item ${activeStep >= 2 ? (activeStep === 2 ? 'active' : 'completed') : ''}">
                  <div class="timeline-step-dot"></div>
                  <span class="timeline-step-label">Under Review</span>
                </div>
                <div class="timeline-step-item ${activeStep >= 3 ? (activeStep === 3 ? 'active' : 'completed') : ''}">
                  <div class="timeline-step-dot"></div>
                  <span class="timeline-step-label">Quote Ready</span>
                </div>
                <div class="timeline-step-item ${activeStep >= 4 ? (activeStep === 4 ? 'active' : 'completed') : ''}">
                  <div class="timeline-step-dot"></div>
                  <span class="timeline-step-label">In Production</span>
                </div>
                <div class="timeline-step-item ${activeStep >= 5 ? (activeStep === 5 ? 'active' : 'completed') : ''}">
                  <div class="timeline-step-dot"></div>
                  <span class="timeline-step-label">Shipped</span>
                </div>
              </div>
            </div>

            <div class="tracker-card-footer">
              <div class="tracker-tech-summary">
                <span><strong>Cabinet Finish:</strong> ${project.specs || 'As Specified'}</span>
                <span><strong>Wholesale Estimate:</strong> <span style="color: var(--gold-light); font-weight: 600;">${project.quoteAmount}</span></span>
              </div>
              <button class="btn-message-agent" data-project-ref="${project.id}">Inquire Agent</button>
            </div>
          </div>
        `;
      });
      container.innerHTML = gridHtml;
    }

    // Render Tab 1 Dashboard Summary list (show top 2 latest quotes)
    if (overviewContainer) {
      if (quotes.length === 0) {
        overviewContainer.innerHTML = `<p style="padding: 20px; font-size: 0.82rem; color: var(--text-secondary); text-align: center;">No active sourcing files. Go to "Custom Factory Quote" to upload drawings.</p>`;
      } else {
        const topTwo = quotes.slice(0, 2);
        let listHtml = '';
        topTwo.forEach(proj => {
          listHtml += `
            <div class="overview-project-row">
              <div class="p-row-left">
                <span class="p-row-title">${proj.projectName}</span>
                <span class="p-row-type">Ref: ${proj.id} | ${proj.designStyle || 'Custom Blueprint'}</span>
              </div>
              <span class="p-row-status status-pill ${proj.status}">${proj.statusLabel}</span>
            </div>
          `;
        });
        overviewContainer.innerHTML = listHtml;
      }
    }

    // Hook inquiries clicks in timeline footer
    $$('.btn-message-agent').forEach(btn => {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-project-ref');
        switchTab('resources');
        const subjectField = $('#agent-subject');
        if (subjectField) {
          subjectField.value = `Status Inquiry: Project Sourcing File ${ref}`;
          subjectField.focus();
        }
      });
    });
  }

  // ─── FILTER SOURCING PROJECT LIST ───
  const statusFilterBtns = $$('.status-filter-btn');
  statusFilterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      statusFilterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-status');
      const cards = $$('.project-tracker-card');
      
      cards.forEach(card => {
        const status = card.getAttribute('data-status-filter');
        if (filter === 'all') {
          card.style.display = 'block';
        } else if (filter === 'submitted' && ['submitted', 'reviewing'].includes(status)) {
          card.style.display = 'block';
        } else if (filter === 'quoted' && status === 'quoted') {
          card.style.display = 'block';
        } else if (filter === 'production' && status === 'production') {
          card.style.display = 'block';
        } else if (filter === 'completed' && status === 'shipped') {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ─── RENDER TRENDING AND CATALOG PRODUCTS ───
  function renderCatalogAndTrending() {
    const trendingContainer = $('#trending-designs-container');
    const catalogContainer = $('#catalog-products-container');

    // Render Trending (filter isTrending === true, limit 5)
    if (trendingContainer) {
      const trending = CATALOG_PRODUCTS.filter(p => p.isTrending).slice(0, 5);
      let trendingHtml = '';
      trending.forEach(prod => {
        trendingHtml += `
          <div class="catalog-card" data-category="${prod.category}">
            <div class="card-image-wrapper">
              <img src="${prod.image}" class="card-image" alt="${prod.name}" onerror="this.src='../../assets/images/hero-kitchen.png'">
              <div class="card-gradient-overlay"></div>
              <span class="card-price-tag">${prod.price}</span>
              <span class="card-category">${prod.category}</span>
            </div>
            <div class="card-details-panel">
              <div>
                <h3 class="card-title">${prod.name}</h3>
                <p class="card-desc">${prod.desc}</p>
                <div class="card-specs-summary">
                  <span class="spec-chip">${prod.specs.carcass.split(' with')[0]}</span>
                  <span class="spec-chip">Blum Soft-Close</span>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn-details" data-id="${prod.id}">Details</button>
                <button class="btn-quote" data-id="${prod.id}" data-name="${prod.name}">Inquire Quote</button>
              </div>
            </div>
          </div>
        `;
      });
      trendingContainer.innerHTML = trendingHtml;
    }

    // Render Full Catalog Tab
    if (catalogContainer) {
      let catalogHtml = '';
      CATALOG_PRODUCTS.forEach(prod => {
        catalogHtml += `
          <div class="catalog-card" data-category="${prod.category}">
            <div class="card-image-wrapper">
              <img src="${prod.image}" class="card-image" alt="${prod.name}" onerror="this.src='../../assets/images/hero-kitchen.png'">
              <div class="card-gradient-overlay"></div>
              <span class="card-price-tag">${prod.price}</span>
              <span class="card-category">${prod.category}</span>
            </div>
            <div class="card-details-panel">
              <div>
                <h3 class="card-title">${prod.name}</h3>
                <p class="card-desc">${prod.desc}</p>
                <div class="card-specs-summary">
                  <span class="spec-chip">${prod.specs.carcass.split(' with')[0]}</span>
                  <span class="spec-chip">Premium Runners</span>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn-details" data-id="${prod.id}">Details</button>
                <button class="btn-quote" data-id="${prod.id}" data-name="${prod.name}">Inquire Quote</button>
              </div>
            </div>
          </div>
        `;
      });
      catalogContainer.innerHTML = catalogHtml;
    }

    // Connect modal triggers
    connectProductActions();
  }

  // Catalog category filtering
  const filterBtns = $$('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      const cards = $$('#catalog-products-container .catalog-card');
      
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Render initial components
  renderProjectsTracker();
  renderCatalogAndTrending();

  // ─── MODAL DETAIL VIEW LOGIC ───
  const detailModal = $('#catalog-detail-modal');
  const closeDetailBtn = $('#catalog-detail-modal .modal-close');
  
  function connectProductActions() {
    // Detail modal openers
    $$('.btn-details').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        openProductDetails(id);
      });
    });

    // Quote modal openers
    $$('.btn-quote').forEach(btn => {
      btn.addEventListener('click', function () {
        const name = this.getAttribute('data-name');
        openQuoteWizard(name);
      });
    });
  }

  function openProductDetails(id) {
    const product = CATALOG_PRODUCTS.find(p => p.id === id);
    if (!product || !detailModal) return;

    $('#modal-product-image').src = product.image;
    $('#modal-product-tag').textContent = product.category.toUpperCase();
    $('#modal-product-title').textContent = product.name;
    $('#modal-product-desc').textContent = product.desc;
    $('#spec-carcass').textContent = product.specs.carcass;
    $('#spec-runners').textContent = product.specs.runners;
    $('#spec-warranty').textContent = product.specs.warranty;
    $('#spec-price').textContent = product.price;

    // Connect trigger button inside details
    const quoteTrigger = $('#modal-quote-trigger-btn');
    if (quoteTrigger) {
      quoteTrigger.onclick = function () {
        detailModal.classList.remove('open');
        openQuoteWizard(product.name);
      };
    }

    // Set default swatch active
    $$('.swatch-item').forEach(sw => sw.classList.remove('active'));
    $('.swatch-item.color-oak')?.classList.add('active');
    if ($('#active-swatch-name')) $('#active-swatch-name').textContent = 'Natural European Oak';

    detailModal.classList.add('open');
  }

  // Close Detail modal
  if (closeDetailBtn && detailModal) {
    closeDetailBtn.addEventListener('click', function () {
      detailModal.classList.remove('open');
    });
    detailModal.addEventListener('click', function (e) {
      if (e.target === detailModal) detailModal.classList.remove('open');
    });
  }

  // Swatch interactions inside detail modal
  $$('.swatch-item').forEach(sw => {
    sw.addEventListener('click', function () {
      $$('.swatch-item').forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      const swatchName = this.getAttribute('data-swatch');
      if ($('#active-swatch-name')) $('#active-swatch-name').textContent = swatchName;
    });
  });

  // ─── MULTI-STEP QUOTE WIZARD MODAL ───
  const quoteModal = $('#quote-wizard-modal');
  const closeQuoteBtn = $('#quote-wizard-modal .modal-close');
  const wizardForm = $('#wizard-quote-form');

  let activeWizPane = 1;

  function openQuoteWizard(designStyle) {
    if (!quoteModal) return;
    
    activeWizPane = 1;
    showWizPane(1);
    
    $('#wizard-design-reference').textContent = `Design Style Style: ${designStyle}`;
    
    // Auto-select finish matching design in wizard preferences
    const selectFinish = $('#wiz-finish');
    if (selectFinish) {
      if (designStyle.includes('Teak') || designStyle.includes('Tropical')) {
        selectFinish.value = 'Muted Walnut Veneer';
      } else if (designStyle.includes('Industrial') || designStyle.includes('Vanity')) {
        selectFinish.value = 'Brushed Champagne Brass';
      } else {
        selectFinish.value = 'Natural European Oak';
      }
    }

    // Clear notes & files
    if (wizardForm) wizardForm.reset();
    const previewContainer = $('#wiz-file-preview');
    if (previewContainer) previewContainer.innerHTML = '';

    quoteModal.classList.add('open');
  }

  function showWizPane(paneNum) {
    $$('.wizard-section').forEach(pane => {
      if (parseInt(pane.getAttribute('data-wiz-pane')) === paneNum) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    $$('.wiz-step').forEach((lbl, idx) => {
      if (idx + 1 === paneNum) {
        lbl.classList.add('active');
      } else {
        lbl.classList.remove('active');
      }
    });
  }

  // Connect wizard next/prev buttons
  $$('.btn-wiz-next').forEach(btn => {
    btn.addEventListener('click', function () {
      activeWizPane++;
      showWizPane(activeWizPane);
    });
  });

  $$('.btn-wiz-prev').forEach(btn => {
    btn.addEventListener('click', function () {
      activeWizPane--;
      showWizPane(activeWizPane);
    });
  });

  // Close Quote Wizard Modal
  if (closeQuoteBtn && quoteModal) {
    closeQuoteBtn.addEventListener('click', function () {
      quoteModal.classList.remove('open');
    });
    quoteModal.addEventListener('click', function (e) {
      if (e.target === quoteModal) quoteModal.classList.remove('open');
    });
  }

  // Wizard file drop upload triggers
  const wizDropZone = $('#wiz-drop-zone');
  const wizFileInput = $('#wiz-file-input');
  
  if (wizDropZone && wizFileInput) {
    wizDropZone.addEventListener('click', () => wizFileInput.click());
    wizFileInput.addEventListener('change', function () {
      handleWizardFileList(this.files);
    });

    wizDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      wizDropZone.classList.add('dragover');
    });

    wizDropZone.addEventListener('dragleave', () => {
      wizDropZone.classList.remove('dragover');
    });

    wizDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      wizDropZone.classList.remove('dragover');
      if (e.dataTransfer.files) {
        handleWizardFileList(e.dataTransfer.files);
      }
    });
  }

  function handleWizardFileList(files) {
    const container = $('#wiz-file-preview');
    if (!container || files.length === 0) return;

    let html = '';
    [...files].forEach((f, idx) => {
      html += `
        <div class="preview-file-item" id="wiz-file-idx-${idx}">
          <span class="file-item-name">${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)</span>
          <button type="button" class="file-item-remove" onclick="document.getElementById('wiz-file-idx-${idx}').remove()">Remove</button>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  // Wizard submit handler
  if (wizardForm) {
    wizardForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const designRef = $('#wizard-design-reference').textContent.replace('Design Style Style: ', '');
      const roomSize = $('#wiz-room-size').value;
      const layoutType = $('#wiz-layout-type').value;
      const timeline = $('#wiz-timeline').value;
      const finish = $('#wiz-finish').value;
      const internalDrawers = $('#wiz-drawers').value;
      const customNotes = $('#wiz-notes').value;
      
      // Build mock reference code
      const randRefNum = Math.floor(100 + Math.random() * 900);
      const newRefCode = `REF-2026-${randRefNum}`;
      
      // Determine project category based on name
      let projCat = 'kitchen';
      if (designRef.includes('Vanity') || designRef.includes('Bath')) projCat = 'bath';
      if (designRef.includes('Closet') || designRef.includes('Wardrobe')) projCat = 'closet';

      const newQuote = {
        id: newRefCode,
        userEmail: currentUser.email,
        projectName: `${designRef} Client Build`,
        projectType: projCat,
        designStyle: designRef,
        specs: `${finish} exterior, ${internalDrawers === 'wood-dovetail' ? 'Solid Timber Dovetail Drawers' : 'Metal Drawers'}`,
        size: `${roomSize.toUpperCase()} space (${layoutType.toUpperCase()} layout)`,
        budget: '$10,000 - $25,000',
        timeline: timeline === 'fast' ? 'Immediate' : 'Standard',
        status: 'submitted',
        statusLabel: 'Reviewing File',
        date: new Date().toISOString().split('T')[0],
        quoteAmount: 'Awaiting CAD verification'
      };

      const quotes = getQuotesFromStore();
      quotes.push(newQuote);
      localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));

      // Close Wizard
      quoteModal.classList.remove('open');
      
      showToast('Sourcing request submitted! Engineering team notified.');
      
      // Redraw list & switch to projects tracker tab
      renderProjectsTracker();
      switchTab('projects');
    });
  }

  // ─── TAB 4: CUSTOM FACTORY ESTIMATOR FORM WIZARD ───
  const customForm = $('#custom-quote-form');
  const customDropZone = $('#file-drop-zone');
  const customFileInput = $('#custom-file-input');

  let activeCustomStep = 1;

  function showCustomStep(stepNum) {
    $$('.form-step-pane').forEach(pane => {
      if (parseInt(pane.getAttribute('data-step-pane')) === stepNum) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    $$('.progress-step').forEach((el, idx) => {
      if (idx + 1 <= stepNum) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    const progressPercent = ((stepNum) / 3) * 100;
    if ($('#form-progress-bar')) {
      $('#form-progress-bar').style.width = `${progressPercent}%`;
    }
  }

  // Form step buttons (Forward/Backward)
  $$('.form-step-pane .btn-next').forEach(btn => {
    btn.addEventListener('click', function () {
      // Basic fields validation for step 1
      if (activeCustomStep === 1) {
        const name = $('#project-name').value.trim();
        const type = $('#project-type').value;
        const city = $('#project-city').value.trim();
        const timeline = $('#project-timeline').value;

        if (!name || !type || !city || !timeline) {
          showToast('Please fill out all project specifications.');
          return;
        }
      }
      activeCustomStep++;
      showCustomStep(activeCustomStep);
    });
  });

  $$('.form-step-pane .btn-prev').forEach(btn => {
    btn.addEventListener('click', function () {
      activeCustomStep--;
      showCustomStep(activeCustomStep);
    });
  });

  // Custom blueprint file drag & drop triggers
  if (customDropZone && customFileInput) {
    customDropZone.addEventListener('click', () => customFileInput.click());
    customFileInput.addEventListener('change', function () {
      handleCustomFileList(this.files);
    });

    customDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      customDropZone.classList.add('dragover');
    });

    customDropZone.addEventListener('dragleave', () => {
      customDropZone.classList.remove('dragover');
    });

    customDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      customDropZone.classList.remove('dragover');
      if (e.dataTransfer.files) {
        handleCustomFileList(e.dataTransfer.files);
      }
    });
  }

  function handleCustomFileList(files) {
    const container = $('#file-list-preview');
    if (!container || files.length === 0) return;

    let html = '';
    [...files].forEach((f, idx) => {
      html += `
        <div class="preview-file-item" id="custom-file-idx-${idx}">
          <span class="file-item-name">${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)</span>
          <button type="button" class="file-item-remove" onclick="document.getElementById('custom-file-idx-${idx}').remove()">Remove</button>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  // Custom estimator form submit handler
  if (customForm) {
    customForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const projectName = $('#project-name').value.trim();
      const projectType = $('#project-type').value;
      const projectCity = $('#project-city').value.trim();
      const projectTimeline = $('#project-timeline').value;
      const coreMaterial = $('#core-material').value;
      const hardwareType = $('#hardware-type').value;
      const finishPref = $('#finish-preference').value;
      const budgetRange = $('#budget-range').value;
      const notes = $('#project-notes').value;

      if (!projectName) {
        showToast('Please enter a project reference name.');
        return;
      }

      // Build mock reference code
      const randRefNum = Math.floor(100 + Math.random() * 900);
      const newRefCode = `REF-2026-${randRefNum}`;

      const newCustomProject = {
        id: newRefCode,
        userEmail: currentUser.email,
        projectName: projectName,
        projectType: projectType,
        designStyle: 'Custom Shop drawings Blueprint',
        specs: `${finishPref} Finish, ${coreMaterial === 'plywood-premium' ? 'Plywood Box' : 'Core MDF'}, ${hardwareType.includes('blum') ? 'Blum Motion' : 'Premium'}`,
        size: `Site: ${projectCity}`,
        budget: budgetRange === '10k-25k' ? '$10,000 - $25,000' : (budgetRange === '25k-50k' ? '$25,000 - $50,000' : '$50,000+'),
        timeline: projectTimeline === 'immediate' ? 'Immediate' : 'Standard',
        status: 'submitted',
        statusLabel: 'Reviewing Drawings',
        date: new Date().toISOString().split('T')[0],
        quoteAmount: 'Awaiting CAD structural analysis'
      };

      const quotes = getQuotesFromStore();
      quotes.push(newCustomProject);
      localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));

      // Reset form
      customForm.reset();
      activeCustomStep = 1;
      showCustomStep(1);
      const previewContainer = $('#file-list-preview');
      if (previewContainer) previewContainer.innerHTML = '';

      showToast('Custom architectural blueprints uploaded successfully!');
      
      // Update list & route to tracker
      renderProjectsTracker();
      switchTab('projects');
    });
  }

  // ─── TAB 6: SUPPORT INQUIRY FORM ───
  const agentForm = $('#agent-message-form');
  if (agentForm) {
    agentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const subject = $('#agent-subject').value.trim();
      const message = $('#agent-message').value.trim();

      if (!subject || !message) {
        showToast('Please enter a subject and message.');
        return;
      }

      showToast('Direct dispatch sent. An engineering agent will contact you shortly.');
      agentForm.reset();
    });
  }

  // ─── Accordion Toggle ───
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const parent = this.parentElement;
      const isOpen = parent.classList.contains('open');
      
      $$('.faq-item').forEach(item => item.classList.remove('open'));
      
      if (!isOpen) {
        parent.classList.add('open');
      }
    });
  });

  // ─── Simulated PDF Sourcing Guides download ───
  $$('.download-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const file = this.getAttribute('data-file');
      let name = 'Technical Specification';
      if (file === 'sizing-guide') name = 'Cabinetry Sizing & Metric Standards';
      if (file === 'measurement-sheet') name = 'Measurement Template Sheet';
      if (file === 'shipping-terms') name = 'Factory Sourcing Terms & Shipping';

      showToast(`Downloading: ${name} PDF...`);
    });
  });

})();
