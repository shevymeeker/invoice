/**
 * Main Application
 * Coordinates all modules and handles view rendering
 */

class App {
  constructor() {
    this.branding = null;
    this.currentSignaturePad = null;
    this.isOnline = navigator.onLine;
    this.swRegistration = null;
    this.updateAvailable = false;
    this.isLocked = false;
    this.sessionUnlocked = false;
    this.sessionTimeout = null;
    this.SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes of inactivity
  }

  renderBackButton(target = '/dashboard', label = 'Back', tone = 'header') {
    const toneClass = tone === 'light' ? ' back-button--light' : '';
    return `<button class="back-button${toneClass}" onclick="app.safeBack('${target}')">← ${label}</button>`;
  }

  safeBack(target = '/dashboard') {
    // Prefer router-managed history, but always offer a deterministic exit
    if (window.Router) {
      window.Router.back(target);
    } else {
      window.location.hash = target;
    }
  }

  /**
   * Ensure the Website Quick Start template exists in IndexedDB
   */
  async ensureQuickStartTemplate() {
    const templates = await window.DB.getAllTemplates();
    let quickStart = templates.find(t => t.name === 'Website Quick Start');

    if (!quickStart) {
      // Pull the seed template from the sample set
      const sample = (window.SAMPLE_TEMPLATES || []).find(t => t.name === 'Website Quick Start');

      if (sample) {
        const id = await window.DB.saveTemplate(sample);
        quickStart = { ...sample, id };
      }
    }

    return quickStart;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Show loading state
      this.showLoader();

      // Initialize database
      await window.DB.init();
      console.log('[App] Database initialized');

      // Initialize PDF generator
      await window.PDFGenerator.init();
      console.log('[App] PDF Generator initialized');

      // Check if branding exists
      this.branding = await window.DB.getBranding();

      // Apply brand colors if they exist
      if (this.branding?.brandColors) {
        this.applyBrandColors(this.branding.brandColors);
      }

      // Register service worker
      if ('serviceWorker' in navigator) {
        try {
          this.swRegistration = await navigator.serviceWorker.register('/sw.js');
          console.log('[App] Service Worker registered:', this.swRegistration);

          // Check for updates on registration
          this.swRegistration.addEventListener('updatefound', () => {
            const newWorker = this.swRegistration.installing;
            console.log('[App] New service worker found, installing...');

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker installed, update available
                console.log('[App] Update available');
                this.updateAvailable = true;
                this.showUpdateNotification();
              }
            });
          });

          // Listen for service worker messages
          navigator.serviceWorker.addEventListener('message', this.handleSWMessage.bind(this));
        } catch (error) {
          console.error('[App] Service Worker registration failed:', error);
        }
      }

      // Set up network status listeners
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.showNotification('Back online', 'success');
        this.requestBackgroundSync();
        // Check for app updates when coming back online
        this.checkForUpdates();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.showNotification('You are offline - app will continue to work', 'info');
      });

      // Register routes
      this.registerRoutes();

      // Initialize router
      window.Router.init();

      // Hide loader
      this.hideLoader();

      // Log app start
      await window.DB.logEvent('app_start', { online: this.isOnline });

    } catch (error) {
      console.error('[App] Initialization failed:', error);
      this.showNotification('Failed to initialize app: ' + error.message, 'error');
    }
  }

  /**
   * Register all application routes
   */
  registerRoutes() {
    // Check if first-time setup is needed and passcode protection
    window.Router.setBeforeNavigate(async (path) => {
      // Clean up trades theme when navigating away from /trades
      if (path !== '/trades') {
        document.body.classList.remove('trades-theme');
      }

      // First-time setup check
      if (path !== '/setup' && !this.branding) {
        window.Router.navigate('/setup');
        return false;
      }

      // Passcode protection for sensitive routes
      const protectedRoutes = ['/responses', '/templates', '/settings', '/analytics', '/builder', '/documents'];
      const isProtected = protectedRoutes.some(route => path.startsWith(route));

      if (isProtected) {
        const hasPasscode = await window.DB.hasPasscode();
        if (hasPasscode && !this.sessionUnlocked) {
          await this.showLockScreen();
          return false;
        }
      }

      // Reset session timeout on navigation
      this.resetSessionTimeout();

      return true;
    });

    // Route definitions
    window.Router.register('/', () => this.renderDashboard());
    window.Router.register('/setup', () => this.renderSetup());
    window.Router.register('/dashboard', () => this.renderDashboard());
    window.Router.register('/templates', () => this.renderTemplates());
    window.Router.register('/builder', (params) => this.renderBuilder(params));
    window.Router.register('/quick-start', () => this.renderQuickStartWizard());
    window.Router.register('/fill', (params) => this.renderFillForm(params));
    window.Router.register('/responses', () => this.renderResponses());
    window.Router.register('/settings', () => this.renderSettings());
    window.Router.register('/analytics', () => this.renderAnalytics());
    window.Router.register('/documents', () => this.renderDocumentGenerator());
    window.Router.register('/trades', () => this.renderTrades());
  }

  /**
   * Show lock screen and wait for passcode
   */
  async showLockScreen() {
    return new Promise((resolve) => {
      const lockOverlay = document.createElement('div');
      lockOverlay.id = 'lock-screen';
      lockOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
      `;

      lockOverlay.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 3rem; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
          <h2 style="margin: 0 0 0.5rem 0; color: var(--text-primary);">App Locked</h2>
          <p style="color: var(--text-secondary); margin: 0 0 2rem 0;">Enter your passcode to continue</p>

          <div id="passcode-display" style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2rem;">
            <div class="pin-dot"></div>
            <div class="pin-dot"></div>
            <div class="pin-dot"></div>
            <div class="pin-dot"></div>
            <div class="pin-dot" style="opacity: 0.3;"></div>
            <div class="pin-dot" style="opacity: 0.3;"></div>
            <div class="pin-dot" style="opacity: 0.3;"></div>
            <div class="pin-dot" style="opacity: 0.3;"></div>
          </div>

          <input
            type="password"
            id="lock-passcode-input"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="8"
            autofocus
            style="width: 100%; padding: 1rem; font-size: 1.5rem; text-align: center; border: 2px solid var(--divider-color); border-radius: 8px; letter-spacing: 0.5em; font-weight: 600;"
            placeholder="••••"
          >

          <div id="lock-error" style="color: #d32f2f; margin-top: 1rem; min-height: 1.5rem; font-weight: 500;"></div>

          <button id="unlock-btn" class="btn btn-primary btn-block" style="margin-top: 1.5rem; font-size: 1.1rem; padding: 1rem;">
            Unlock
          </button>
        </div>

        <style>
          .pin-dot {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--primary-color);
            transition: all 0.2s ease;
          }
          .pin-dot.filled {
            opacity: 1 !important;
            transform: scale(1.2);
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        </style>
      `;

      document.body.appendChild(lockOverlay);

      const input = document.getElementById('lock-passcode-input');
      const errorDiv = document.getElementById('lock-error');
      const unlockBtn = document.getElementById('unlock-btn');
      const dots = lockOverlay.querySelectorAll('.pin-dot');

      // Update dots as user types
      input.addEventListener('input', () => {
        const length = input.value.length;
        dots.forEach((dot, index) => {
          if (index < length) {
            dot.classList.add('filled');
          } else {
            dot.classList.remove('filled');
          }
        });
        errorDiv.textContent = '';
      });

      const attemptUnlock = async () => {
        const passcode = input.value.trim();

        if (!passcode || passcode.length < 4) {
          errorDiv.textContent = 'Please enter your passcode';
          return;
        }

        const isValid = await window.DB.verifyPasscode(passcode);

        if (isValid) {
          this.sessionUnlocked = true;
          this.resetSessionTimeout();
          lockOverlay.style.animation = 'fadeOut 0.3s ease';
          setTimeout(() => {
            lockOverlay.remove();
            resolve(true);
          }, 300);
        } else {
          errorDiv.textContent = 'Incorrect passcode';
          input.value = '';
          input.focus();
          dots.forEach(dot => dot.classList.remove('filled'));
        }
      };

      unlockBtn.addEventListener('click', attemptUnlock);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          attemptUnlock();
        }
      });

      // Add fadeOut animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    });
  }

  /**
   * Lock the app session
   */
  lockSession() {
    this.sessionUnlocked = false;
    this.clearSessionTimeout();
    console.log('[App] Session locked');
    window.Router.navigate('/dashboard');
  }

  /**
   * Unlock the app session
   */
  unlockSession() {
    this.sessionUnlocked = true;
    this.resetSessionTimeout();
    console.log('[App] Session unlocked');
  }

  /**
   * Reset the session timeout
   */
  resetSessionTimeout() {
    this.clearSessionTimeout();

    if (this.sessionUnlocked) {
      this.sessionTimeout = setTimeout(() => {
        console.log('[App] Session timed out');
        this.lockSession();
      }, this.SESSION_TIMEOUT_MS);
    }
  }

  /**
   * Clear the session timeout
   */
  clearSessionTimeout() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  /**
   * Handle messages from service worker
   */
  handleSWMessage(event) {
    const { type, success, error } = event.data;

    if (type === 'SYNC_START') {
      this.showNotification('Syncing data...', 'info');
    } else if (type === 'SYNC_COMPLETE') {
      if (success) {
        this.showNotification('Data synced successfully', 'success');
      } else {
        this.showNotification('Sync failed: ' + error, 'error');
      }
    }
  }

  /**
   * Request background sync when online
   */
  async requestBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('backup-data');
        console.log('[App] Background sync requested');
      } catch (error) {
        console.error('[App] Background sync failed:', error);
      }
    }
  }

  /**
   * Check for app updates
   */
  async checkForUpdates() {
    try {
      // Get current registration if not stored
      let registration = this.swRegistration;
      if (!registration && 'serviceWorker' in navigator) {
        registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          this.swRegistration = registration;
        }
      }

      if (!registration) {
        console.log('[App] No service worker registration found');
        return false;
      }

      console.log('[App] Checking for updates...');
      await registration.update();
      console.log('[App] Update check complete');
      return true;
    } catch (error) {
      console.error('[App] Update check failed:', error);
      return false;
    }
  }

  /**
   * Show update notification to user
   */
  showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.id = 'update-banner';
    updateBanner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      text-align: center;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      animation: slideDown 0.3s ease-out;
    `;

    updateBanner.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <span style="font-weight: 600;">🎉 A new version of the app is available!</span>
        <button onclick="app.applyUpdate()" class="btn btn-sm" style="background: white; color: #667eea; border: none; font-weight: 600;">
          Update Now
        </button>
        <button onclick="document.getElementById('update-banner').remove()" class="btn btn-sm" style="background: rgba(255,255,255,0.2); color: white; border: none;">
          Later
        </button>
      </div>
    `;

    // Remove existing banner if present
    const existing = document.getElementById('update-banner');
    if (existing) {
      existing.remove();
    }

    document.body.appendChild(updateBanner);
  }

  /**
   * Apply available update
   */
  async applyUpdate() {
    if (!this.updateAvailable) {
      this.showNotification('No updates available', 'info');
      return;
    }

    // Tell the service worker to skip waiting
    if (this.swRegistration && this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    // Reload the page to activate the new service worker
    this.showNotification('Updating app...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  /**
   * Get current app version
   */
  async getAppVersion() {
    try {
      if (!navigator.serviceWorker.controller) {
        return 'Unknown';
      }

      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.version || 'Unknown');
        };

        navigator.serviceWorker.controller.postMessage(
          { type: 'GET_VERSION' },
          [messageChannel.port2]
        );

        // Timeout after 2 seconds
        setTimeout(() => resolve('Unknown'), 2000);
      });
    } catch (error) {
      console.error('[App] Failed to get version:', error);
      return 'Unknown';
    }
  }

  /**
   * Display app version in settings
   */
  async displayAppVersion() {
    const versionElement = document.getElementById('app-version');
    if (versionElement) {
      const version = await this.getAppVersion();
      versionElement.textContent = `v${version}`;
    }
  }

  /**
   * Manual update check triggered by user
   */
  async manualUpdateCheck() {
    if (!this.isOnline) {
      this.showNotification('You are offline. Please connect to the internet to check for updates.', 'info');
      return;
    }

    this.showNotification('Checking for updates...', 'info');

    const updateFound = await this.checkForUpdates();

    if (!updateFound) {
      this.showNotification('Failed to check for updates. Please try again later.', 'error');
      return;
    }

    // Wait a bit for the update check to complete
    setTimeout(() => {
      if (this.updateAvailable) {
        this.showNotification('Update found! Installing...', 'success');
      } else {
        this.showNotification('You are already on the latest version!', 'success');
      }
    }, 1500);
  }

  /**
   * Check if running on iOS
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  /**
   * Check if running as installed PWA
   */
  isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  /**
   * Render setup view (first-time branding setup)
   */
  async renderSetup() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container container-sm">
        <div style="margin-bottom: 1rem;">${this.renderBackButton('/dashboard', 'Back to Dashboard', 'light')}</div>
        ${!this.branding ? `
          <div class="privacy-manifesto">
            <h2>YOUR DATA. YOUR DEVICE. PERIOD.</h2>
            <ul>
              <li>No accounts</li>
              <li>No passwords</li>
              <li>No cloud uploads (unless YOU choose)</li>
              <li>No tracking</li>
              <li>No analytics to 3rd parties</li>
              <li>No newsletters</li>
              <li>Works 100% offline</li>
              <li>Data never leaves your device</li>
              <li>Export anytime, anywhere</li>
            </ul>
            <p>
              We don't want your data. We don't want your clients' data.
              We don't even have a server to store it on.
              <br><br>
              <strong>This is YOUR tool. Your data stays with YOU.</strong>
            </p>
          </div>
        ` : ''}

        <div class="card">
          <div class="card-header">
            <div>
              <h1 class="card-title">${this.branding ? 'Business Settings' : 'Welcome! Let\'s Set Up Your Business'}</h1>
              <p class="card-subtitle">This information will appear on all your forms</p>
            </div>
          </div>
          <div class="card-body">
            <form id="setupForm">
              <div class="form-group">
                <label for="companyName" class="required">Company Name</label>
                <input type="text" id="companyName" required value="${this.branding?.companyName || ''}">
              </div>

              <div class="form-group">
                <label for="companyLogo">Company Logo (optional)</label>
                <input type="file" id="companyLogo" accept="image/*" onchange="app.handleLogoUpload(event)">
                <div class="form-help">Upload your logo (PNG, JPG, SVG). We'll automatically resize it and extract colors for your theme.</div>
                ${this.branding?.logo ? `
                  <div class="logo-preview" style="margin-top: 1rem; padding: 1rem; background: var(--background); border-radius: var(--border-radius); text-align: center;">
                    <img src="${this.branding.logo}" alt="Company Logo" style="max-width: 200px; max-height: 100px; object-fit: contain;">
                    <button type="button" class="btn btn-sm btn-secondary mt-2" onclick="app.removeLogo()">Remove Logo</button>
                  </div>
                ` : ''}
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" value="${this.branding?.email || ''}">
              </div>

              <div class="form-group">
                <label for="phone" class="required">Phone</label>
                <input type="tel" id="phone" required value="${this.branding?.phone || ''}">
              </div>

              <div class="form-group">
                <label for="website">Website</label>
                <input type="text" id="website" placeholder="https://example.com" value="${this.branding?.website || ''}">
              </div>

              <div class="form-group">
                <label for="ein">EIN (Employer Identification Number)</label>
                <input type="text" id="ein" placeholder="12-3456789 (optional)" value="${this.branding?.ein || ''}">
              </div>

              <div class="form-group">
                <label for="address" class="required">Address</label>
                <textarea id="address" rows="3" required placeholder="City, State (or full address)">${this.branding?.address || ''}</textarea>
              </div>

              <div class="card mt-3" style="border: 2px solid var(--primary-color);">
                <div class="card-header">
                  <h3 class="card-title">🔒 Security Passcode ${this.branding ? '' : '(Recommended)'}</h3>
                  <p class="card-subtitle">Protect client data when sharing your device</p>
                </div>
                <div class="card-body">
                  <div class="alert alert-info mb-3">
                    <strong>📱 For Business Tablets:</strong> If you hand your device to clients to fill out forms,
                    a passcode prevents them from viewing other clients' responses, templates, or settings.
                  </div>

                  <div class="form-group">
                    <label for="passcode">Passcode (4-8 digits)</label>
                    <input
                      type="password"
                      id="passcode"
                      placeholder="${this.branding ? 'Leave blank to keep current passcode' : 'Optional but recommended'}"
                      pattern="[0-9]{4,8}"
                      maxlength="8"
                      inputmode="numeric"
                    >
                    <div class="form-help">Use a memorable 4-8 digit code. You'll need this to access responses and settings.</div>
                  </div>

                  <div class="form-group" id="passcode-confirm-group" style="display: none;">
                    <label for="passcodeConfirm">Confirm Passcode</label>
                    <input
                      type="password"
                      id="passcodeConfirm"
                      placeholder="Re-enter passcode"
                      pattern="[0-9]{4,8}"
                      maxlength="8"
                      inputmode="numeric"
                    >
                  </div>

                  ${this.branding ? `
                    <div class="form-help">
                      <strong>Note:</strong> To remove your passcode, leave both fields blank and save.
                    </div>
                  ` : ''}
                </div>
              </div>

              <div class="alert alert-success mt-3">
                <strong>✓ Fully Offline:</strong> All your data is stored locally on this device.
                No internet connection required after initial setup!
                ${!navigator.onLine ? '<br><strong>You are currently offline</strong> - everything still works!' : ''}
              </div>

              ${this.branding ? `
                <div class="card mt-3">
                  <div class="card-header">
                    <h3 class="card-title">🔄 App Updates</h3>
                    <p class="card-subtitle">Keep your app up to date</p>
                  </div>
                  <div class="card-body">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                      <div>
                        <strong>Current Version:</strong>
                        <span id="app-version" style="margin-left: 0.5rem; color: var(--text-secondary);">Loading...</span>
                      </div>
                    </div>

                    <div class="alert alert-info mb-3">
                      <strong>📱 Auto-Update:</strong> The app automatically checks for updates when you come online.
                      You'll see a banner at the top when an update is available.
                    </div>

                    <button class="btn btn-primary" onclick="app.manualUpdateCheck()">
                      Check for Updates Now
                    </button>

                    <div class="form-help mt-2">
                      Click to manually check for app updates and new features.
                    </div>
                  </div>
                </div>

                <div class="card mt-3">
                  <div class="card-header">
                    <h3 class="card-title">💾 Backup Options (Optional)</h3>
                    <p class="card-subtitle">Your data, your choice, your cloud</p>
                  </div>
                  <div class="card-body">

                    <div class="alert alert-success mb-3">
                      <strong>✨ Recommended: Save to Files</strong><br>
                      No setup required • Works immediately • Saves to iCloud on iOS
                    </div>

                    <div class="alert alert-info mb-3">
                      <strong>Passcodes are never included in backups.</strong><br>
                      You can restore on any device without needing a password first.
                    </div>

                    <div class="backup-option" style="border: 3px solid var(--accent-color); background: #f1f8f4;"
                         onclick="app.backupToFiles()">
                      <div class="backup-option-icon">☁️</div>
                      <div class="backup-option-title" style="font-size: 1.25rem; color: var(--accent-color);">
                        Save to Files
                      </div>
                      <div class="backup-option-status" style="color: var(--accent-dark); font-weight: 500;">
                        <strong>No setup needed!</strong><br>
                        iOS → iCloud Drive<br>
                        Desktop → Any location
                      </div>
                      <button class="btn btn-success mt-2" onclick="event.stopPropagation(); app.backupToFiles();">
                        Save Backup Now
                      </button>
                    </div>

                    <details class="mt-4" style="cursor: pointer;">
                      <summary style="font-weight: 600; padding: 1rem; background: var(--background); border-radius: var(--border-radius);">
                        <span style="font-size: 1.1rem;">⚙️ Advanced: Auto-Sync to Your Cloud</span>
                        <span style="float: right; color: var(--text-secondary); font-size: 0.875rem;">(Requires setup)</span>
                      </summary>

                      <div style="padding: 1.5rem; background: var(--background); border-radius: var(--border-radius); margin-top: 0.5rem;">
                        <p class="text-muted mb-3">
                          Connect to <strong>your personal</strong> Google Drive or Dropbox account.
                          Data goes directly to <strong>YOUR</strong> cloud - we never see it.
                        </p>

                        <div class="backup-options">
                          <div class="backup-option ${window.CloudBackup.isConnected('googleDrive') ? 'connected' : ''}"
                               onclick="app.toggleCloudProvider('googleDrive')">
                            <div class="backup-option-icon">📁</div>
                            <div class="backup-option-title">Google Drive</div>
                            <div class="backup-option-status">
                              ${window.CloudBackup.isConnected('googleDrive') ? '✓ Connected' : 'Setup Required'}
                            </div>
                            ${!window.CloudBackup.isConnected('googleDrive') ? `
                              <button class="btn btn-sm btn-outline mt-2"
                                      onclick="event.stopPropagation(); app.showOAuthGuide('googleDrive')">
                                Setup Instructions
                              </button>
                            ` : ''}
                          </div>

                          <div class="backup-option ${window.CloudBackup.isConnected('dropbox') ? 'connected' : ''}"
                               onclick="app.toggleCloudProvider('dropbox')">
                            <div class="backup-option-icon">📦</div>
                            <div class="backup-option-title">Dropbox</div>
                            <div class="backup-option-status">
                              ${window.CloudBackup.isConnected('dropbox') ? '✓ Connected' : 'Setup Required'}
                            </div>
                            ${!window.CloudBackup.isConnected('dropbox') ? `
                              <button class="btn btn-sm btn-outline mt-2"
                                      onclick="event.stopPropagation(); app.showOAuthGuide('dropbox')">
                                Setup Instructions
                              </button>
                            ` : ''}
                          </div>
                        </div>

                        <div class="alert alert-info mt-3">
                          <strong>Why Setup Required?</strong><br>
                          To protect your privacy, <strong>you</strong> create your own OAuth app (free!).
                          This ensures data goes directly to <strong>your</strong> cloud account, never through our servers.
                        </div>
                      </div>
                    </details>

                    <div class="alert alert-info mt-3" style="font-size: 0.875rem;">
                      <strong>🔒 Your Privacy Guarantee:</strong><br>
                      All backup methods are 100% optional. If you enable cloud sync,
                      data is sent directly to YOUR account using YOUR credentials.
                      We never see, store, or have access to your data.
                    </div>
                  </div>
                </div>
              ` : ''}

              <div class="card-footer">
                <button type="submit" class="btn btn-primary btn-lg btn-block">
                  ${this.branding ? 'Save Settings' : 'Complete Setup & Get Started'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Privacy Badge -->
      <div class="privacy-badge" title="Your data stays on your device. No tracking. No cloud uploads (unless you choose). Period.">
        Your Data, Your Device
      </div>
    `;

    // Load and display app version
    if (this.branding) {
      this.displayAppVersion();
    }

    // Handle form submission
    // Show/hide passcode confirmation field
    const passcodeInput = document.getElementById('passcode');
    const passcodeConfirmGroup = document.getElementById('passcode-confirm-group');
    const passcodeConfirm = document.getElementById('passcodeConfirm');

    passcodeInput.addEventListener('input', () => {
      if (passcodeInput.value.length > 0) {
        passcodeConfirmGroup.style.display = 'block';
        passcodeConfirm.required = true;
      } else {
        passcodeConfirmGroup.style.display = 'none';
        passcodeConfirm.required = false;
        passcodeConfirm.value = '';
      }
    });

    document.getElementById('setupForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate passcode if provided
      const passcode = passcodeInput.value.trim();
      const passcodeConfirmValue = passcodeConfirm.value.trim();

      if (passcode && passcode !== passcodeConfirmValue) {
        this.showNotification('Passcodes do not match', 'error');
        return;
      }

      if (passcode && (passcode.length < 4 || passcode.length > 8 || !/^\d+$/.test(passcode))) {
        this.showNotification('Passcode must be 4-8 digits', 'error');
        return;
      }

      const brandingData = {
        companyName: document.getElementById('companyName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        ein: document.getElementById('ein').value,
        address: document.getElementById('address').value,
        logo: this.branding?.logo || null, // Preserve existing logo if not changed
        brandColors: this.branding?.brandColors || null // Preserve existing colors
      };

      try {
        console.log('[App] Saving branding data:', brandingData);
        await window.DB.saveBranding(brandingData);

        // Handle passcode
        if (passcode) {
          await window.DB.setPasscode(passcode);
          console.log('[App] Passcode set');
        } else if (this.branding && !passcode) {
          // User is editing and left passcode blank - check if they want to remove it
          const hasPasscode = await window.DB.hasPasscode();
          if (hasPasscode) {
            // Passcode will remain unless explicitly removed
            console.log('[App] Keeping existing passcode');
          }
        }

        this.branding = await window.DB.getBranding();
        await window.PDFGenerator.init(); // Reinitialize with new branding

        this.showNotification('Settings saved successfully!', 'success');

        // Unlock session if passcode was set
        if (passcode) {
          this.unlockSession();
        }

        window.Router.navigate('/dashboard');

        await window.DB.logEvent('branding_setup', { isFirstTime: !this.branding, passcodeSet: !!passcode });
      } catch (error) {
        console.error('[App] Failed to save branding:', error);
        this.showNotification('Failed to save settings: ' + error.message, 'error');
      }
    });
  }

  /**
   * Render dashboard view
   */
  async renderDashboard() {
    const templates = await window.DB.getAllTemplates();
    const responses = await window.DB.getAllResponses();
    const hasPasscode = await window.DB.hasPasscode();

    const app = document.getElementById('app');
    app.innerHTML = `
      <header>
        <div class="container">
          <h1>${this.branding?.companyName || 'Form Builder'}</h1>
          <nav>
            ${hasPasscode && this.sessionUnlocked ? `<button onclick="app.lockSession()" style="color: #ff9800;">🔒 Lock</button>` : ''}
            <button onclick="window.Router.navigate('/settings')">Settings</button>
            <button onclick="window.Router.navigate('/analytics')">Analytics</button>
          </nav>
        </div>
      </header>

      <main>
        <div class="container">
          <h2>Dashboard</h2>
          <p class="text-muted">Manage your forms and client responses</p>

          <div class="dashboard-grid">
            <div class="dashboard-card" onclick="window.Router.navigate('/builder')">
              <div class="dashboard-card-icon">📝</div>
              <h3 class="dashboard-card-title">Create New Form</h3>
              <p class="dashboard-card-description">Build a custom onboarding form</p>
            </div>

            <div class="dashboard-card" onclick="window.Router.navigate('/templates')">
              <div class="dashboard-card-icon">📋</div>
              <h3 class="dashboard-card-title">My Templates</h3>
              <p class="dashboard-card-description">${templates.length} template${templates.length !== 1 ? 's' : ''}</p>
            </div>

            <div class="dashboard-card" onclick="window.Router.navigate('/responses')">
              <div class="dashboard-card-icon">📊</div>
              <h3 class="dashboard-card-title">View Responses</h3>
              <p class="dashboard-card-description">${responses.length} response${responses.length !== 1 ? 's' : ''}</p>
            </div>

            <div class="dashboard-card" onclick="window.Router.navigate('/trades')" style="border-left: 4px solid #FF6B00;">
              <div class="dashboard-card-icon">&#9874;</div>
              <h3 class="dashboard-card-title">Trades & Field</h3>
              <p class="dashboard-card-description">Industrial forms for job sites</p>
            </div>
          </div>

          ${this.isIOS() && !this.isPWA() ? `
            <div class="card mt-4" style="border: 2px solid var(--primary-color);">
              <div class="card-header">
                <div>
                  <h3 class="card-title">📲 Install on iPhone/iPad</h3>
                  <p class="card-subtitle">Get the best experience with offline access</p>
                </div>
              </div>
              <div class="card-body">
                <p>To install this app on your iOS device:</p>
                <ol style="padding-left: 1.5rem; margin: 1rem 0;">
                  <li>Tap the <strong>Share</strong> button <span style="font-size: 1.5rem;">⎙</span> at the bottom of Safari</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>Tap <strong>"Add"</strong> in the top right</li>
                  <li>The app icon will appear on your home screen!</li>
                </ol>
                <div class="alert alert-info">
                  <strong>Note:</strong> This only works in Safari browser. If you're using Chrome or Firefox on iOS,
                  please open this page in Safari first.
                </div>
                <p class="text-muted" style="font-size: 0.875rem; margin-top: 1rem;">
                  After installation, the app works completely offline and will feel like a native iOS app.
                </p>
              </div>
            </div>
          ` : ''}

          <div class="card mt-4">
            <div class="card-header">
              <div>
                <h3 class="card-title">Quick Start Guide</h3>
              </div>
            </div>
            <div class="card-body">
              <ol style="padding-left: 1.5rem;">
                <li><strong>Create a Form Template:</strong> Click "Create New Form" to build your custom client onboarding form</li>
                <li><strong>Fill Out Forms:</strong> Select a template and hand your device to clients to fill out digitally</li>
                <li><strong>Export as PDF:</strong> Generate blank PDFs for printing or filled PDFs with client responses</li>
                <li><strong>Manage Data:</strong> View all responses, export data, and sync when online</li>
              </ol>

              <div class="alert alert-success mt-3">
                <strong>✓ Fully Offline:</strong> This app works 100% offline after installation.
                All data is stored securely on your device.
                ${this.isOnline ? '' : ' <br><strong>You are currently offline</strong> - all features still work!'}
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Privacy Badge -->
      <div class="privacy-badge" title="Your data stays on your device. No tracking. No cloud uploads (unless you choose). Period.">
        Your Data, Your Device
      </div>
    `;
  }

  /**
   * Render templates list view
   */
  async renderTemplates() {
    const templates = await window.DB.getAllTemplates();
    const sampleTemplates = window.SAMPLE_TEMPLATES || [];
    const quickStartTemplate = sampleTemplates.find(t => t.name === 'Website Quick Start');
    const otherTemplates = sampleTemplates.filter(t => t.name !== 'Website Quick Start');

    const app = document.getElementById('app');
    app.innerHTML = `
      <header>
        <div class="container">
          <h1>${this.branding?.companyName || 'Form Builder'}</h1>
          <nav>
            ${this.renderBackButton('/dashboard', 'Back to Dashboard')}
            <button onclick="window.Router.navigate('/builder')">New Template</button>
          </nav>
        </div>
      </header>

      <main>
        <div class="container">
          <h2>My Form Templates</h2>
          <p class="text-muted">Create, edit, and manage your form templates</p>

          ${sampleTemplates.length > 0 ? `
            <div class="card" style="margin-bottom: 2rem;">
              <div class="card-header">
                <div>
                  <h3 class="card-title" style="display: flex; align-items: center; gap: 0.5rem;">
                    ✨ Starter Templates
                  </h3>
                  <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: var(--text-secondary);">
                    Get started quickly with pre-built professional templates
                  </p>
                </div>
              </div>
              <div class="card-body">
                <div class="template-gallery-grid">
                  ${quickStartTemplate ? `
                    <div class="template-card template-card--accent" onclick="app.showSampleTemplatePreview('${quickStartTemplate.name.replace(/'/g, "\\'")}')">
                      <div class="template-card__header">
                        <span class="template-card__icon">🚀</span>
                        <div>
                          <div class="template-card__title">Website Quick Start</div>
                          <p class="template-card__description" style="margin: 0;">6-step guided intake with logo upload and sharing</p>
                        </div>
                      </div>
                      <p class="template-card__description">A guided intake flow with consistent offline-friendly defaults and sharing controls.</p>
                      <div class="template-card__actions">
                        <button class="btn btn-secondary" onclick="event.stopPropagation(); window.Router.navigate('/quick-start')">Launch Quick Start</button>
                        <button class="btn btn-outline" onclick="event.stopPropagation(); app.importSampleTemplate('${quickStartTemplate.name.replace(/'/g, "\\'")}')">Save to My Templates</button>
                      </div>
                    </div>
                  ` : ''}

                  <div class="template-card">
                    <div class="template-card__header">
                      <span class="template-card__icon">🏢</span>
                      <div>
                        <div class="template-card__title">LLC Formation</div>
                        <p class="template-card__description" style="margin: 0;">Guided Articles of Organization, banking resolution, and DBA</p>
                      </div>
                    </div>
                    <p class="template-card__description">Generate LLC paperwork with a consistent branded cover and offline-ready print styling.</p>
                    <div class="template-card__actions">
                      <button class="btn btn-secondary" onclick="event.stopPropagation(); window.Router.navigate('/documents')">Open LLC Formation</button>
                    </div>
                  </div>

                  ${otherTemplates.map(template => `
                    <div class="template-card" onclick="app.showSampleTemplatePreview('${template.name.replace(/'/g, "\\'")}')">
                      <div class="template-card__header">
                        <span class="template-card__icon">${template.icon}</span>
                        <div class="template-card__title">${template.name}</div>
                      </div>
                      <p class="template-card__description">${template.description}</p>
                      <div class="template-card__actions">
                        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.importSampleTemplate('${template.name.replace(/'/g, "\\'")}')">Use This Template</button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          ${templates.length === 0 ? `
            <div class="card text-center">
              <div class="card-body">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📝</div>
                <h3>No custom templates yet</h3>
                <p class="text-muted">Import a starter template above or create your own from scratch</p>
                <button class="btn btn-primary mt-3" onclick="window.Router.navigate('/builder')">
                  Create Custom Template
                </button>
              </div>
            </div>
          ` : `
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">My Custom Templates</h3>
            <div class="card">
              <div class="card-body">
                ${templates.map(template => {
                  const questionCount = template.sections.reduce((sum, s) => sum + s.questions.length, 0);
                  return `
                    <div class="template-list-item">
                      <div class="template-info">
                        <h3>${template.name}</h3>
                        <div class="template-meta">
                          ${template.sections.length} sections • ${questionCount} questions •
                          Created ${new Date(template.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div class="template-actions">
                        <button class="btn btn-sm btn-primary" onclick="app.navigateToFill(${template.id})">
                          Fill Form
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="app.editTemplate(${template.id})">
                          Edit
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="app.duplicateTemplate(${template.id})">
                          Duplicate
                        </button>
                        <button class="btn btn-sm btn-success" onclick="app.exportBlankPDF(${template.id})">
                          Export PDF
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteTemplate(${template.id})">
                          Delete
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `}
        </div>
      </main>
    `;
  }

  /**
   * Dedicated experience for the Website Quick Start intake
   */
  async renderQuickStartWizard() {
    const template = await this.ensureQuickStartTemplate();

    if (!template) {
      this.showNotification('Quick Start template could not be loaded', 'error');
      window.Router.navigate('/templates');
      return;
    }

    const app = document.getElementById('app');
    app.innerHTML = `
      <style>
        .qs-hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 1.5rem; text-align: center; }
        .qs-card { background: white; border-radius: 18px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); padding: 2rem; margin-top: -4rem; position: relative; }
        .qs-progress { height: 8px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin-bottom: 1.5rem; }
        .qs-progress-fill { height: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); width: 0%; transition: width 0.25s ease; }
        .qs-question { display: none; }
        .qs-question.active { display: block; }
        .qs-label { display: block; color: #6b7280; font-weight: 600; margin-bottom: 0.5rem; letter-spacing: 0.02em; }
        .qs-input { width: 100%; padding: 1rem 1.1rem; border: 2px solid #e5e7eb; border-radius: 14px; font-size: 1.05rem; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .qs-input:focus, .qs-textarea:focus { border-color: #7c3aed; outline: none; box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.12); }
        .qs-textarea { width: 100%; padding: 1rem 1.1rem; border: 2px solid #e5e7eb; border-radius: 14px; font-size: 1.05rem; min-height: 150px; resize: vertical; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .qs-nav { display: flex; gap: 0.75rem; margin-top: 1.25rem; }
        .qs-btn-primary { flex: 1; background: linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%); color: white; padding: 1rem 1.25rem; border-radius: 14px; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 12px 30px rgba(79, 70, 229, 0.28); transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .qs-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 16px 36px rgba(79, 70, 229, 0.33); }
        .qs-btn-ghost { background: transparent; border: none; color: #4b5563; font-weight: 700; padding: 1rem 1.25rem; cursor: pointer; }
        .qs-file { width: 100%; padding: 1.2rem; border: 2px dashed #e5e7eb; border-radius: 14px; text-align: center; color: #4b5563; cursor: pointer; transition: border-color 0.2s ease, background 0.2s ease; }
        .qs-file:hover { border-color: #7c3aed; background: #f9f5ff; }
        .qs-success { text-align: center; padding: 3rem 1rem; }
        .qs-summary { text-align: left; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.25rem; }
        .qs-exit { background: white; color: #4b5563; border: 1px solid #e5e7eb; border-radius: 12px; padding: 0.65rem 1rem; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.06); transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .qs-exit:hover { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(0,0,0,0.1); }
      </style>

      <header>
        <div class="container" style="max-width: 1100px; margin: 0 auto; padding: 1rem 1.5rem; display: flex; justify-content: flex-end;">
          <button class="qs-exit" onclick="window.Router.navigate('/templates')">← Back to Forms</button>
        </div>
      </header>

      <div class="qs-hero">
        <div class="container" style="max-width: 900px; margin: 0 auto;">
          <h1 style="font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 0.5rem;">Let's Build Your Website</h1>
          <p style="opacity: 0.9; font-size: 1.05rem;">Six quick questions. Offline ready, saved locally.</p>
        </div>
      </div>

      <main style="max-width: 900px; margin: 0 auto; padding: 0 1.5rem 3rem;">
        <div class="qs-card">
          <div class="qs-progress"><div class="qs-progress-fill" id="qs-progress"></div></div>
          <form id="quickStartForm" class="space-y-6">
            <div class="qs-question active" data-step="1">
              <span class="qs-label">QUESTION 1 OF 6</span>
              <h2 style="font-size: 1.75rem; margin: 0.25rem 0 0.5rem; color: #111827;">What's your business called?</h2>
              <p style="color: #6b7280; margin-bottom: 1rem;">This will be the main headline on your site.</p>
              <input id="qs-business-name" class="qs-input" type="text" placeholder="e.g., Joe's Landscaping" required />
              <div class="qs-nav">
                <button type="button" class="qs-btn-primary" data-next="2">Continue →</button>
              </div>
            </div>

            <div class="qs-question" data-step="2">
              <span class="qs-label">QUESTION 2 OF 6</span>
              <h2 style="font-size: 1.75rem; margin: 0.25rem 0 0.5rem; color: #111827;">What does your business do?</h2>
              <p style="color: #6b7280; margin-bottom: 1rem;">Keep it simple - one sentence is perfect.</p>
              <textarea id="qs-description" class="qs-textarea" placeholder="We handle tough landscaping jobs..." required></textarea>
              <div class="qs-nav">
                <button type="button" class="qs-btn-ghost" data-prev="1">← Back</button>
                <button type="button" class="qs-btn-primary" data-next="3">Continue →</button>
              </div>
            </div>

            <div class="qs-question" data-step="3">
              <span class="qs-label">QUESTION 3 OF 6</span>
              <h2 style="font-size: 1.75rem; margin: 0.25rem 0 0.5rem; color: #111827;">What are your 3 main services?</h2>
              <p style="color: #6b7280; margin-bottom: 1rem;">Don't overthink it - just your top 3.</p>
              <input id="qs-service-1" class="qs-input" type="text" placeholder="Service 1" required />
              <input id="qs-service-2" class="qs-input" type="text" placeholder="Service 2" required style="margin-top: 0.75rem;" />
              <input id="qs-service-3" class="qs-input" type="text" placeholder="Service 3" required style="margin-top: 0.75rem;" />
              <div class="qs-nav">
                <button type="button" class="qs-btn-ghost" data-prev="2">← Back</button>
                <button type="button" class="qs-btn-primary" data-next="4">Continue →</button>
              </div>
            </div>

            <div class="qs-question" data-step="4">
              <span class="qs-label">QUESTION 4 OF 6</span>
              <h2 style="font-size: 1.75rem; margin: 0.25rem 0 0.5rem; color: #111827;">Best phone number to reach you?</h2>
              <p style="color: #6b7280; margin-bottom: 1rem;">This will be on your website for customer inquiries.</p>
              <input id="qs-phone" class="qs-input" type="text" placeholder="(555) 555-5555" required />
              <div class="qs-nav">
                <button type="button" class="qs-btn-ghost" data-prev="3">← Back</button>
                <button type="button" class="qs-btn-primary" data-next="5">Continue →</button>
              </div>
            </div>

            <div class="qs-question" data-step="5">
              <span class="qs-label">QUESTION 5 OF 6</span>
              <h2 style="font-size: 1.75rem; margin: 0.25rem 0 0.5rem; color: #111827;">Do you have a logo?</h2>
              <p style="color: #6b7280; margin-bottom: 1rem;">Upload it or leave blank and we'll use your business name.</p>
              <label class="qs-file" for="qs-logo">Click to upload logo (optional)</label>
              <input id="qs-logo" type="file" accept="image/*" style="display:none;" />
              <div id="qs-logo-preview" style="margin-top: 0.75rem; display: none;">
                <img id="qs-logo-img" alt="Logo preview" style="max-height: 140px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); display: block; margin: 0 auto;">
              </div>
              <div class="qs-nav">
                <button type="button" class="qs-btn-ghost" data-prev="4">← Back</button>
                <button type="button" class="qs-btn-primary" data-next="6">Continue (Skip Logo) →</button>
              </div>
            </div>

            <div class="qs-question" data-step="6">
              <span class="qs-label">QUESTION 6 OF 6</span>
              <h2 style="font-size: 1.75rem; margin: 0.25rem 0 0.5rem; color: #111827;">Anything else we should know?</h2>
              <p style="color: #6b7280; margin-bottom: 1rem;">Special requests, brand colors, inspiration sites, or deadline.</p>
              <textarea id="qs-notes" class="qs-textarea" placeholder="Optional"></textarea>
              <div class="qs-nav">
                <button type="button" class="qs-btn-ghost" data-prev="5">← Back</button>
                <button type="submit" class="qs-btn-primary">Submit & Build My Site 🚀</button>
              </div>
            </div>
          </form>

          <div id="qs-success" class="qs-success" style="display: none;">
            <div style="margin-bottom: 1.5rem;">
              <div style="width: 84px; height: 84px; margin: 0 auto 1rem; background: #ecfdf3; border-radius: 999px; display: grid; place-items: center;">
                <span style="font-size: 2rem;">✅</span>
              </div>
              <h2 style="margin: 0 0 0.5rem;">Perfect! We've got everything.</h2>
              <p style="color: #6b7280; margin: 0;">Ready to share or copy these answers.</p>
            </div>

            <div class="qs-nav" style="justify-content: center;">
              <button type="button" class="qs-btn-primary" id="qs-copy">Copy Answers</button>
              <button type="button" class="qs-btn-ghost" id="qs-email" style="color: #4f46e5;">Email Answers</button>
            </div>

            <div class="qs-summary" style="margin-top: 1.25rem;">
              <h3 style="margin: 0 0 0.75rem;">Your Answers</h3>
              <div id="qs-summary"></div>
            </div>
          </div>
        </div>
      </main>
    `;

    const form = document.getElementById('quickStartForm');
    const steps = Array.from(form.querySelectorAll('.qs-question'));
    const progressFill = document.getElementById('qs-progress');
    let currentStep = 1;
    let logoDataUrl = '';

    const updateProgress = () => {
      progressFill.style.width = `${(currentStep / steps.length) * 100}%`;
    };

    const showStep = (stepNumber) => {
      steps.forEach(step => step.classList.remove('active'));
      const target = steps.find(step => parseInt(step.dataset.step) === stepNumber);
      if (target) {
        target.classList.add('active');
        currentStep = stepNumber;
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    form.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = parseInt(btn.dataset.next);
        const group = btn.closest('.qs-question');
        if (group) {
          const requiredFields = Array.from(group.querySelectorAll('input[required], textarea[required]'));
          const invalid = requiredFields.some(input => !input.value.trim());
          if (invalid) {
            this.showNotification('Please complete the required field before continuing.', 'error');
            return;
          }
        }
        showStep(next);
      });
    });

    form.querySelectorAll('[data-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prev = parseInt(btn.dataset.prev);
        showStep(prev);
      });
    });

    const logoInput = document.getElementById('qs-logo');
    const logoPreview = document.getElementById('qs-logo-preview');
    const logoImg = document.getElementById('qs-logo-img');
    document.querySelector('label[for="qs-logo"]').addEventListener('click', () => logoInput.click());
    logoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        logoDataUrl = event.target.result;
        logoImg.src = logoDataUrl;
        logoPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });

    const formatSummary = (data) => `
      <p><strong>Business Name:</strong> ${data.businessName}</p>
      <p><strong>What you do:</strong> ${data.description}</p>
      <p><strong>Service 1:</strong> ${data.service1}</p>
      <p><strong>Service 2:</strong> ${data.service2}</p>
      <p><strong>Service 3:</strong> ${data.service3}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.logo ? '<p><strong>Logo:</strong> ✓ Uploaded</p>' : '<p><strong>Logo:</strong> Not provided</p>'}
      ${data.notes ? `<p><strong>Additional Info:</strong> ${data.notes}</p>` : ''}
    `;

    const formatPlainText = (data) => {
      return [
        'CLIENT INTAKE FORM - NEW WEBSITE REQUEST',
        '==========================================',
        `Business Name: ${data.businessName}`,
        '',
        'What They Do:',
        data.description,
        '',
        'Main Services:',
        `1. ${data.service1}`,
        `2. ${data.service2}`,
        `3. ${data.service3}`,
        '',
        `Phone: ${data.phone}`,
        data.logo ? 'Logo: ✓ Uploaded (see attachment)' : 'Logo: No logo provided',
        data.notes ? `\nAdditional Info:\n${data.notes}` : '',
        '==========================================',
        'Ready to generate copy and build the site!'
      ].join('\n');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        businessName: document.getElementById('qs-business-name').value.trim(),
        description: document.getElementById('qs-description').value.trim(),
        service1: document.getElementById('qs-service-1').value.trim(),
        service2: document.getElementById('qs-service-2').value.trim(),
        service3: document.getElementById('qs-service-3').value.trim(),
        phone: document.getElementById('qs-phone').value.trim(),
        logo: logoDataUrl,
        notes: document.getElementById('qs-notes').value.trim()
      };

      const missing = Object.entries({
        'Business name': payload.businessName,
        'Business description': payload.description,
        'Service 1': payload.service1,
        'Service 2': payload.service2,
        'Service 3': payload.service3,
        'Phone': payload.phone
      }).find(([, value]) => !value);

      if (missing) {
        this.showNotification(`Please add: ${missing[0]}`, 'error');
        return;
      }

      try {
        const response = {
          templateId: template.id,
          clientName: payload.businessName,
          answers: {
            'quick-start-business-name': payload.businessName,
            'quick-start-description': payload.description,
            'quick-start-service-1': payload.service1,
            'quick-start-service-2': payload.service2,
            'quick-start-service-3': payload.service3,
            'quick-start-phone': payload.phone,
            'quick-start-logo-url': payload.logo || 'Not provided',
            'quick-start-notes': payload.notes
          }
        };

        if (payload.logo) {
          response.answers['quick-start-logo'] = payload.logo;
        }

        await window.DB.saveResponse(response);
        await window.DB.logEvent('form_submitted', { templateId: template.id, clientName: payload.businessName });

        document.getElementById('qs-summary').innerHTML = formatSummary(payload);
        form.style.display = 'none';
        document.getElementById('qs-success').style.display = 'block';
        this.showNotification('Quick Start intake saved locally and ready to share.', 'success');

        // Offer PDF export immediately
        const doc = await window.PDFGenerator.generateFilledForm(template, response);
        const fileName = `${template.name} - ${payload.businessName || 'Response'}.pdf`;
        window.PDFGenerator.download(doc, fileName);
      } catch (error) {
        this.showNotification('Failed to save response: ' + error.message, 'error');
      }
    });

    document.getElementById('qs-copy').addEventListener('click', async () => {
      const payload = {
        businessName: document.getElementById('qs-business-name').value.trim(),
        description: document.getElementById('qs-description').value.trim(),
        service1: document.getElementById('qs-service-1').value.trim(),
        service2: document.getElementById('qs-service-2').value.trim(),
        service3: document.getElementById('qs-service-3').value.trim(),
        phone: document.getElementById('qs-phone').value.trim(),
        logo: logoDataUrl,
        notes: document.getElementById('qs-notes').value.trim()
      };
      await navigator.clipboard.writeText(formatPlainText(payload));
      this.showNotification('Answers copied to clipboard', 'success');
    });

    document.getElementById('qs-email').addEventListener('click', () => {
      const payload = {
        businessName: document.getElementById('qs-business-name').value.trim(),
        description: document.getElementById('qs-description').value.trim(),
        service1: document.getElementById('qs-service-1').value.trim(),
        service2: document.getElementById('qs-service-2').value.trim(),
        service3: document.getElementById('qs-service-3').value.trim(),
        phone: document.getElementById('qs-phone').value.trim(),
        logo: logoDataUrl,
        notes: document.getElementById('qs-notes').value.trim()
      };
      const subject = encodeURIComponent(`New Website Client: ${payload.businessName || 'Quick Start Intake'}`);
      const body = encodeURIComponent(formatPlainText(payload));
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });

    updateProgress();
  }

  /**
   * Render template chooser for new forms
   */
  async renderTemplateChooser() {
    const sampleTemplates = window.SAMPLE_TEMPLATES || [];

    const app = document.getElementById('app');
    app.innerHTML = `
      <header>
        <div class="container">
          <h1>${this.branding?.companyName || 'Form Builder'}</h1>
          <nav>
            ${this.renderBackButton('/templates', 'Back to Templates')}
          </nav>
        </div>
      </header>

      <main>
        <div class="container">
          <h2>Create New Form</h2>
          <p class="text-muted">Choose a starting point for your form</p>

          <!-- Blank Form Option -->
          <div class="card" style="margin-bottom: 2rem; cursor: pointer; transition: all 0.3s ease; border: 2px solid var(--primary-color);"
               onclick="window.Router.navigate('/builder', { blank: 'true' })"
               onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)';"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';">
            <div class="card-body" style="text-align: center; padding: 2rem;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">📝</div>
              <h3 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">Start from Blank</h3>
              <p style="margin: 0; color: var(--text-secondary);">Create a custom form from scratch</p>
            </div>
          </div>

          ${sampleTemplates.length > 0 ? `
            <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <div class="card-header" style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                <div>
                  <h3 class="card-title" style="color: white; display: flex; align-items: center; gap: 0.5rem;">
                    ✨ Start from Template
                  </h3>
                  <p style="margin: 0.5rem 0 0 0; opacity: 0.9; font-size: 0.875rem;">
                    Get started quickly with pre-built professional templates
                  </p>
                </div>
              </div>
              <div class="card-body">
                <div class="grid grid-3">
                  ${sampleTemplates.map(template => `
                    <div class="card" style="background: white; cursor: pointer; transition: all 0.3s ease; border: none;"
                         onclick="app.importSampleTemplate('${template.name.replace(/'/g, "\\'")}')"
                         onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)';"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';">
                      <div class="card-body" style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 0.75rem;">${template.icon}</div>
                        <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1rem;">${template.name}</h4>
                        <p style="margin: 0 0 1rem 0; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.4;">
                          ${template.description}
                        </p>
                        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); app.showSampleTemplatePreview('${template.name.replace(/'/g, "\\'")}')">
                          Preview
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </main>
    `;
  }

  /**
   * Start form from a sample template (directly to builder)
   */
  async startFromTemplate(templateName) {
    try {
      const sampleTemplate = window.SAMPLE_TEMPLATES.find(t => t.name === templateName);
      if (!sampleTemplate) {
        this.showNotification('Template not found', 'error');
        return;
      }

      this.showNotification('Loading template...', 'info');

      // Get user's branding to auto-fill company info
      const branding = await window.DB.getBranding();

      // Create a copy of the sample template sections
      let sections = JSON.parse(JSON.stringify(sampleTemplate.sections));

      // Add auto-branded company info to the first section if branding exists
      if (branding && sections.length > 0) {
        // Build company info header
        let companyHeader = `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        // Add logo mention if it exists
        if (branding.logo) {
          companyHeader += `[Company Logo]\n\n`;
        }

        companyHeader += `Provided by: ${branding.companyName || 'Our Company'}`;
        if (branding.phone) companyHeader += `\nPhone: ${branding.phone}`;
        if (branding.email) companyHeader += `\nEmail: ${branding.email}`;
        if (branding.website) companyHeader += `\nWebsite: ${branding.website}`;
        if (branding.address) companyHeader += `\nAddress: ${branding.address}`;
        if (branding.ein) companyHeader += `\nEIN: ${branding.ein}`;
        companyHeader += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        // Prepend to first section's description
        const firstSection = sections[0];
        if (firstSection.description) {
          firstSection.description = companyHeader + '\n' + firstSection.description;
        } else {
          firstSection.description = companyHeader;
        }

        // Store logo reference in section metadata (for PDF generation)
        if (branding.logo) {
          firstSection.brandLogo = branding.logo;
        }
      }

      // Load directly into FormBuilder (don't save to DB yet)
      window.FormBuilder.currentTemplate = {
        name: sampleTemplate.name,
        sections: sections
      };
      window.FormBuilder.editingTemplateId = null;

      // Navigate to builder with the loaded template
      window.Router.navigate('/builder', { blank: 'true' });

      await window.DB.logEvent('template_started', { templateName });
    } catch (error) {
      console.error('[App] Failed to start from template:', error);
      this.showNotification('Failed to load template: ' + error.message, 'error');
    }
  }

  /**
   * Render form builder view
   */
  async renderBuilder(params = {}) {
    const templateId = params.id;
    const skipChooser = params.blank === 'true';

    // If no template ID and user hasn't explicitly chosen blank, show template chooser
    if (!templateId && !skipChooser) {
      this.renderTemplateChooser();
      return;
    }

    if (templateId) {
      await window.FormBuilder.loadTemplate(parseInt(templateId));
    } else {
      window.FormBuilder.initNewTemplate();
    }

    const template = window.FormBuilder.getTemplate();

    const app = document.getElementById('app');
    app.innerHTML = `
      <header>
        <div class="container">
          <h1>Form Builder</h1>
          <nav>
            ${this.renderBackButton('/templates', 'Back to Templates')}
            <button class="btn-primary" onclick="app.previewTemplate()">Preview</button>
            <button class="btn-success" onclick="app.saveTemplate()">Save Template</button>
          </nav>
        </div>
      </header>

      <main>
        <div class="container container-sm">
          <div class="card">
            <div class="card-body">
              <div class="form-group">
                <label for="templateName" class="required">Form Name</label>
                <input type="text" id="templateName" value="${template.name}"
                  onchange="window.FormBuilder.currentTemplate.name = this.value"
                  placeholder="e.g., Client Intake Form">
              </div>
            </div>
          </div>

          <div id="sectionsContainer"></div>

          <button class="btn btn-outline btn-block" onclick="app.addSection()">
            + Add Section
          </button>
        </div>
      </main>
    `;

    this.renderSections();
  }

  /**
   * Render form sections in builder
   */
  renderSections() {
    const template = window.FormBuilder.getTemplate();
    const container = document.getElementById('sectionsContainer');

    container.innerHTML = template.sections.map((section, sectionIndex) => `
      <div class="builder-section" data-section-id="${section.id}">
        <div class="builder-section-header">
          <div style="flex: 1;">
            <input type="text" value="${section.title}"
              onchange="window.FormBuilder.updateSection('${section.id}', { title: this.value })"
              placeholder="Section Title"
              style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">
            <input type="text" value="${section.description}"
              onchange="window.FormBuilder.updateSection('${section.id}', { description: this.value })"
              placeholder="Section Description (optional)"
              class="text-muted">
          </div>
          <div class="builder-section-controls">
            ${sectionIndex > 0 ? `<button class="btn btn-sm" onclick="app.moveSection('${section.id}', 'up')">↑</button>` : ''}
            ${sectionIndex < template.sections.length - 1 ? `<button class="btn btn-sm" onclick="app.moveSection('${section.id}', 'down')">↓</button>` : ''}
            ${template.sections.length > 1 ? `<button class="btn btn-sm btn-danger" onclick="app.removeSection('${section.id}')">Delete</button>` : ''}
          </div>
        </div>

        <div id="questions-${section.id}">
          ${section.questions.map((question, qIndex) => this.renderQuestion(section.id, question, qIndex, section.questions.length)).join('')}
        </div>

        <div class="btn-group mt-2">
          <button class="btn btn-sm btn-outline" onclick="app.addQuestion('${section.id}', 'text')">+ Short Text</button>
          <button class="btn btn-sm btn-outline" onclick="app.addQuestion('${section.id}', 'textarea')">+ Long Text</button>
          <button class="btn btn-sm btn-outline" onclick="app.addQuestion('${section.id}', 'checkbox')">+ Checkboxes</button>
          <button class="btn btn-sm btn-outline" onclick="app.addQuestion('${section.id}', 'radio')">+ Multiple Choice</button>
          <button class="btn btn-sm btn-outline" onclick="app.addQuestion('${section.id}', 'signature')">+ Signature</button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Render a question in the builder
   */
  renderQuestion(sectionId, question, qIndex, totalQuestions) {
    const hasOptions = ['checkbox', 'radio', 'select'].includes(question.type);

    return `
      <div class="builder-question" data-question-id="${question.id}">
        <div class="builder-question-header">
          <div style="flex: 1;">
            <span class="builder-question-type">${window.FormBuilder.getQuestionTypeLabel(question.type)}</span>
          </div>
          <div class="builder-question-controls">
            ${qIndex > 0 ? `<button class="btn btn-sm" onclick="app.moveQuestion('${sectionId}', '${question.id}', 'up')">↑</button>` : ''}
            ${qIndex < totalQuestions - 1 ? `<button class="btn btn-sm" onclick="app.moveQuestion('${sectionId}', '${question.id}', 'down')">↓</button>` : ''}
            <button class="btn btn-sm btn-danger" onclick="app.removeQuestion('${sectionId}', '${question.id}')">×</button>
          </div>
        </div>

        <div class="form-group">
          <input type="text" value="${question.label}"
            onchange="window.FormBuilder.updateQuestion('${sectionId}', '${question.id}', { label: this.value })"
            placeholder="Question text">
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" ${question.required ? 'checked' : ''}
              onchange="window.FormBuilder.updateQuestion('${sectionId}', '${question.id}', { required: this.checked })">
            Required
          </label>
        </div>

        ${hasOptions ? `
          <div class="builder-options">
            <label>Options:</label>
            ${question.options.map((option, optIndex) => `
              <div class="builder-option">
                <input type="text" value="${option}"
                  onchange="window.FormBuilder.updateQuestionOption('${sectionId}', '${question.id}', ${optIndex}, this.value)">
                ${question.options.length > 2 ? `
                  <button class="btn btn-sm btn-danger"
                    onclick="app.removeQuestionOption('${sectionId}', '${question.id}', ${optIndex})">×</button>
                ` : ''}
              </div>
            `).join('')}
            <button class="btn btn-sm btn-outline mt-1"
              onclick="app.addQuestionOption('${sectionId}', '${question.id}')">+ Add Option</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Builder action methods
  addSection() {
    window.FormBuilder.addSection();
    this.renderSections();
  }

  removeSection(sectionId) {
    if (confirm('Delete this section?')) {
      window.FormBuilder.removeSection(sectionId);
      this.renderSections();
    }
  }

  moveSection(sectionId, direction) {
    window.FormBuilder.moveSection(sectionId, direction);
    this.renderSections();
  }

  addQuestion(sectionId, type) {
    window.FormBuilder.addQuestion(sectionId, type);
    this.renderSections();
  }

  removeQuestion(sectionId, questionId) {
    if (confirm('Delete this question?')) {
      window.FormBuilder.removeQuestion(sectionId, questionId);
      this.renderSections();
    }
  }

  moveQuestion(sectionId, questionId, direction) {
    window.FormBuilder.moveQuestion(sectionId, questionId, direction);
    this.renderSections();
  }

  addQuestionOption(sectionId, questionId) {
    window.FormBuilder.addQuestionOption(sectionId, questionId);
    this.renderSections();
  }

  removeQuestionOption(sectionId, questionId, optionIndex) {
    window.FormBuilder.removeQuestionOption(sectionId, questionId, optionIndex);
    this.renderSections();
  }

  async saveTemplate() {
    try {
      console.log('[App] Saving template...');

      // Check if database is initialized
      if (!window.DB || !window.DB.db) {
        throw new Error('Database not initialized. Please refresh the page and try again.');
      }

      // Validate before attempting to save
      const errors = window.FormBuilder.validateTemplate();
      if (errors.length > 0) {
        // Show user-friendly validation errors
        const errorMsg = 'Please fix the following issues:\n\n' + errors.map((e, i) => `${i + 1}. ${e}`).join('\n');
        alert(errorMsg);
        this.showNotification('Please fix validation errors', 'error');
        return;
      }

      // Attempt to save
      const id = await window.FormBuilder.saveTemplate();
      console.log('[App] Template saved with ID:', id);

      this.showNotification('Template saved successfully!', 'success');
      window.Router.navigate('/templates');

    } catch (error) {
      console.error('[App] Save template failed:', error);

      // Provide user-friendly error messages
      let errorMessage = error.message;

      if (error.name === 'QuotaExceededError') {
        errorMessage = 'Storage quota exceeded. Please free up space or delete old templates.';
      } else if (error.message.includes('database')) {
        errorMessage = 'Database error. Try refreshing the page.\n\nDetails: ' + error.message;
      } else if (!navigator.onLine) {
        errorMessage = 'You are offline, but save should still work. Error: ' + error.message;
      }

      // Show detailed error message
      alert('Save Failed\n\n' + errorMessage + '\n\nIf this persists, try:\n1. Refresh the page\n2. Clear browser cache\n3. Check browser console for details');

      this.showNotification('Save failed - check error dialog', 'error');
    }
  }

  previewTemplate() {
    const template = window.FormBuilder.getTemplate();

    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow: auto;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    `;

    modalContent.innerHTML = `
      <div style="padding: 2rem; border-bottom: 1px solid var(--divider-color); position: sticky; top: 0; background: white; z-index: 1;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="margin: 0; color: var(--primary-color);">Preview: ${template.name || 'Untitled Form'}</h2>
            <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary); font-size: 0.875rem;">
              This is how your form will look when clients fill it out
            </p>
          </div>
          <button class="btn btn-secondary" onclick="this.closest('[style*=\\'position: fixed\\']').remove()" style="font-size: 1.5rem; padding: 0.5rem 1rem;">×</button>
        </div>
      </div>
      <div style="padding: 2rem;">
        ${template.sections.length === 0 ? `
          <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
            <p>No sections added yet. Add sections and questions to see the preview.</p>
          </div>
        ` : `
          <div class="card" style="margin-bottom: 1.5rem;">
            <div class="card-body">
              <div class="form-group">
                <label for="preview-clientName">Client Name (Optional)</label>
                <input type="text" id="preview-clientName" placeholder="Enter client name" disabled>
                <div class="form-help">This helps you identify the response later</div>
              </div>
            </div>
          </div>

          ${template.sections.map(section => `
            <div class="response-section" style="background: white; border-radius: var(--border-radius); padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid var(--divider-color);">
              <h2 class="response-section-title" style="font-size: 1.5rem; margin-bottom: ${section.description ? '0.5rem' : '1rem'}; color: var(--text-primary);">
                ${section.title}
              </h2>
              ${section.description ? `<p class="response-section-description" style="color: var(--text-secondary); margin-bottom: 1.5rem;">${section.description}</p>` : ''}

              ${section.questions.length === 0 ? `
                <p style="color: var(--text-secondary); font-style: italic;">No questions in this section</p>
              ` : section.questions.map(question => this.renderPreviewQuestion(question)).join('')}
            </div>
          `).join('')}
        `}

        <div style="display: flex; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--divider-color);">
          <button class="btn btn-secondary" onclick="this.closest('[style*=\\'position: fixed\\']').remove()" style="flex: 1;">
            Close Preview
          </button>
          <button class="btn btn-primary" onclick="app.saveTemplate(); this.closest('[style*=\\'position: fixed\\']').remove();" style="flex: 1;">
            Save Template
          </button>
        </div>
      </div>
    `;

    modal.appendChild(modalContent);

    // Close modal when clicking outside
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    document.body.appendChild(modal);
  }

  /**
   * Render a question in preview mode
   */
  renderPreviewQuestion(question) {
    const requiredLabel = question.required ? '<span style="color: var(--error-color);">*</span>' : '';

    let inputHtml = '';

    switch (question.type) {
      case 'text':
        inputHtml = `<input type="text" placeholder="Enter your answer..." disabled style="width: 100%; padding: 0.75rem; border: 1px solid var(--divider-color); border-radius: var(--border-radius); font-size: 1rem;">`;
        break;

      case 'textarea':
        inputHtml = `<textarea rows="5" placeholder="Enter your answer..." disabled style="width: 100%; padding: 0.75rem; border: 1px solid var(--divider-color); border-radius: var(--border-radius); font-size: 1rem; font-family: inherit;"></textarea>`;
        break;

      case 'checkbox':
        inputHtml = (question.options || []).map(option => `
          <div style="margin-bottom: 0.5rem;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" disabled style="margin-right: 0.5rem;">
              ${option}
            </label>
          </div>
        `).join('');
        break;

      case 'radio':
        inputHtml = (question.options || []).map(option => `
          <div style="margin-bottom: 0.5rem;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="radio" disabled style="margin-right: 0.5rem;">
              ${option}
            </label>
          </div>
        `).join('');
        break;

      case 'select':
        inputHtml = `
          <select disabled style="width: 100%; padding: 0.75rem; border: 1px solid var(--divider-color); border-radius: var(--border-radius); font-size: 1rem;">
            <option>-- Select --</option>
            ${(question.options || []).map(option => `<option>${option}</option>`).join('')}
          </select>
        `;
        break;

      case 'signature':
        inputHtml = `
          <div style="border: 2px dashed var(--divider-color); border-radius: var(--border-radius); padding: 3rem 1rem; text-align: center; background: var(--background);">
            <div style="color: var(--text-secondary); font-size: 0.875rem;">✍️ Signature pad will appear here</div>
          </div>
        `;
        break;

      default:
        inputHtml = `<input type="text" placeholder="Enter your answer..." disabled style="width: 100%; padding: 0.75rem; border: 1px solid var(--divider-color); border-radius: var(--border-radius); font-size: 1rem;">`;
    }

    return `
      <div class="response-question form-group" style="margin-bottom: 1.5rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary);">
          ${question.label} ${requiredLabel}
        </label>
        ${inputHtml}
      </div>
    `;
  }

  // Template action methods
  editTemplate(templateId) {
    window.Router.navigate('/builder', { id: templateId });
  }

  navigateToFill(templateId) {
    window.Router.navigate('/fill', { id: templateId });
  }

  /**
   * Import a sample template with auto-branding
   */
  async importSampleTemplate(templateName) {
    try {
      const sampleTemplate = window.SAMPLE_TEMPLATES.find(t => t.name === templateName);
      if (!sampleTemplate) {
        this.showNotification('Sample template not found', 'error');
        return;
      }

      // Prompt user to name their template
      const customName = prompt(`Name your template:`, sampleTemplate.name);

      // User cancelled
      if (customName === null) {
        return;
      }

      // Validate name
      const trimmedName = customName.trim();
      if (!trimmedName) {
        this.showNotification('Template name cannot be empty', 'error');
        return;
      }

      // Get user's branding to auto-fill company info
      const branding = await window.DB.getBranding();

      // Create a copy of the sample template sections
      let sections = JSON.parse(JSON.stringify(sampleTemplate.sections));

      // Add auto-branded company info to the first section if branding exists
      if (branding && sections.length > 0) {
        // Build company info header
        let companyHeader = `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        // Add logo mention if it exists
        if (branding.logo) {
          companyHeader += `[Company Logo]\n\n`;
        }

        companyHeader += `Provided by: ${branding.companyName || 'Our Company'}`;
        if (branding.phone) companyHeader += `\nPhone: ${branding.phone}`;
        if (branding.email) companyHeader += `\nEmail: ${branding.email}`;
        if (branding.website) companyHeader += `\nWebsite: ${branding.website}`;
        if (branding.address) companyHeader += `\nAddress: ${branding.address}`;
        if (branding.ein) companyHeader += `\nEIN: ${branding.ein}`;
        companyHeader += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        // Prepend to first section's description
        const firstSection = sections[0];
        if (firstSection.description) {
          firstSection.description = companyHeader + '\n' + firstSection.description;
        } else {
          firstSection.description = companyHeader;
        }

        // Store logo reference in section metadata (for PDF generation)
        if (branding.logo) {
          firstSection.brandLogo = branding.logo;
        }
      }

      // Create the new template with custom name
      const newTemplate = {
        name: trimmedName,
        sections: sections
      };

      // Save to database
      const id = await window.DB.saveTemplate(newTemplate);

      this.showNotification(`"${trimmedName}" added to your templates! Opening editor...`, 'success');

      // Navigate to builder to edit the new template
      window.Router.navigate('/builder', { id: id });

      await window.DB.logEvent('sample_template_imported', { templateName, customName: trimmedName, autoBranded: !!branding });
    } catch (error) {
      console.error('[App] Failed to import sample template:', error);
      this.showNotification('Failed to import template: ' + error.message, 'error');
    }
  }

  /**
   * Show sample template preview
   */
  showSampleTemplatePreview(templateName) {
    const sampleTemplate = window.SAMPLE_TEMPLATES.find(t => t.name === templateName);
    if (!sampleTemplate) return;

    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow: auto;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    `;

    modalContent.innerHTML = `
      <div style="padding: 2rem; border-bottom: 1px solid var(--divider-color); position: sticky; top: 0; background: white; z-index: 1;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="font-size: 2rem;">${sampleTemplate.icon}</span>
              <h2 style="margin: 0; color: var(--primary-color);">${sampleTemplate.name}</h2>
            </div>
            <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">
              ${sampleTemplate.description}
            </p>
            <div style="display: inline-block; margin-top: 0.5rem; padding: 0.25rem 0.75rem; background: var(--primary-light); color: var(--primary-dark); border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
              ${sampleTemplate.category}
            </div>
          </div>
          <button class="btn btn-secondary" onclick="this.closest('[style*=\\'position: fixed\\']').remove()" style="font-size: 1.5rem; padding: 0.5rem 1rem;">×</button>
        </div>
      </div>
      <div style="padding: 2rem;">
        ${sampleTemplate.sections.map(section => `
          <div class="response-section" style="background: white; border-radius: var(--border-radius); padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid var(--divider-color);">
            <h2 class="response-section-title" style="font-size: 1.5rem; margin-bottom: ${section.description ? '0.5rem' : '1rem'}; color: var(--text-primary);">
              ${section.title}
            </h2>
            ${section.description ? `<p class="response-section-description" style="color: var(--text-secondary); margin-bottom: 1.5rem;">${section.description}</p>` : ''}

            ${section.questions.map(question => this.renderPreviewQuestion(question)).join('')}
          </div>
        `).join('')}

        <div style="display: flex; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--divider-color);">
          <button class="btn btn-secondary" onclick="this.closest('[style*=\\'position: fixed\\']').remove()" style="flex: 1;">
            Close
          </button>
          <button class="btn btn-primary" onclick="app.importSampleTemplate('${sampleTemplate.name.replace(/'/g, "\\'")}'); this.closest('[style*=\\'position: fixed\\']').remove();" style="flex: 1;">
            Use This Template
          </button>
        </div>
      </div>
    `;

    modal.appendChild(modalContent);

    // Close modal when clicking outside
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    document.body.appendChild(modal);
  }

  async duplicateTemplate(templateId) {
    try {
      const newId = await window.FormBuilder.duplicateTemplate(templateId);
      this.showNotification('Template duplicated successfully!', 'success');
      window.Router.navigate('/templates');
    } catch (error) {
      this.showNotification('Duplication failed: ' + error.message, 'error');
    }
  }

  async exportBlankPDF(templateId) {
    try {
      const template = await window.DB.getTemplate(templateId);
      const doc = await window.PDFGenerator.generateBlankForm(template);
      window.PDFGenerator.download(doc, `${template.name} - Blank.pdf`);
      this.showNotification('PDF exported successfully!', 'success');
      await window.DB.logEvent('pdf_export', { templateId, type: 'blank' });
    } catch (error) {
      this.showNotification('PDF export failed: ' + error.message, 'error');
    }
  }

  async deleteTemplate(templateId) {
    if (confirm('Delete this template? This cannot be undone.')) {
      try {
        await window.DB.deleteTemplate(templateId);
        this.showNotification('Template deleted', 'success');
        window.Router.navigate('/templates');
      } catch (error) {
        this.showNotification('Delete failed: ' + error.message, 'error');
      }
    }
  }

  /**
   * Render form filling view (for clients)
   */
  async renderFillForm(params = {}) {
    const templateId = parseInt(params.id);
    const template = await window.DB.getTemplate(templateId);

    if (!template) {
      this.showNotification('Template not found', 'error');
      window.Router.navigate('/templates');
      return;
    }

    const app = document.getElementById('app');
    const brandPanel = this.branding ? `
      <section class="brand-panel" aria-label="Branding header">
        ${this.branding.logo ? `<img src="${this.branding.logo}" alt="${this.branding.companyName || 'Company'} logo">` : ''}
        <div class="brand-panel__content">
          <div class="brand-panel__title">${this.branding.companyName || 'Your Company'}</div>
          <div class="brand-panel__subtitle">${template.name}</div>
          <div class="brand-panel__meta">
            ${this.branding.email ? `<span class="meta-chip">✉️ ${this.branding.email}</span>` : ''}
            ${this.branding.phone ? `<span class="meta-chip">☎️ ${this.branding.phone}</span>` : ''}
            ${this.branding.website ? `<span class="meta-chip">🌐 ${this.branding.website}</span>` : ''}
          </div>
        </div>
      </section>
    ` : '';

    app.innerHTML = `
      <header>
        <div class="container">
          <h1>${template.name}</h1>
          <nav>
            <button onclick="window.Router.navigate('/templates')">Cancel</button>
            <button class="btn-secondary" onclick="window.print()">Print</button>
            <button class="btn-success" onclick="app.submitResponse()">Submit</button>
          </nav>
        </div>
      </header>

      <main>
        <div class="container container-sm">
          ${brandPanel}

          <div class="card">
            <div class="card-body">
              <div class="form-group">
                <label for="clientName">Client Name (Optional)</label>
                <input type="text" id="clientName" placeholder="Enter client name">
                <div class="form-help">This helps you identify the response later</div>
              </div>
            </div>
          </div>

          <form id="responseForm" data-template-id="${templateId}">
            ${template.sections.map(section => `
              <div class="response-section">
                <h2 class="response-section-title">${section.title}</h2>
                ${section.description ? `<p class="response-section-description">${section.description}</p>` : ''}

                ${section.questions.map(question => this.renderFormQuestion(question)).join('')}
              </div>
            `).join('')}
          </form>
        </div>
      </main>
    `;

    // Initialize signature pads
    document.querySelectorAll('.signature-pad').forEach(canvas => {
      const questionId = canvas.dataset.questionId;
      const signatureManager = new window.SignatureManager(canvas);
      canvas.signatureManager = signatureManager;
    });
  }

  /**
   * Render a form question for client to fill
   */
  renderFormQuestion(question) {
    const requiredAttr = question.required ? 'required' : '';
    const requiredLabel = question.required ? '<span class="text-error">*</span>' : '';

    let inputHtml = '';

    switch (question.type) {
      case 'text':
        inputHtml = `<input type="text" id="q-${question.id}" ${requiredAttr}>`;
        break;

      case 'textarea':
        inputHtml = `<textarea id="q-${question.id}" rows="5" ${requiredAttr}></textarea>`;
        break;

      case 'checkbox':
        inputHtml = question.options.map((option, index) => `
          <div>
            <label>
              <input type="checkbox" name="q-${question.id}" value="${option}">
              ${option}
            </label>
          </div>
        `).join('');
        break;

      case 'radio':
        inputHtml = question.options.map((option, index) => `
          <div>
            <label>
              <input type="radio" name="q-${question.id}" value="${option}" ${requiredAttr}>
              ${option}
            </label>
          </div>
        `).join('');
        break;

      case 'select':
        inputHtml = `
          <select id="q-${question.id}" ${requiredAttr}>
            <option value="">-- Select --</option>
            ${question.options.map(option => `<option value="${option}">${option}</option>`).join('')}
          </select>
        `;
        break;

      case 'signature':
        inputHtml = `
          <div class="signature-pad-container">
            <canvas class="signature-pad" data-question-id="${question.id}"></canvas>
            <div class="signature-pad-footer">
              <span class="text-muted">Sign above</span>
              <button type="button" class="btn btn-sm btn-secondary"
                onclick="document.querySelector('[data-question-id=\\'${question.id}\\']').signatureManager.clear()">
                Clear
              </button>
            </div>
          </div>
        `;
        break;

      default:
        inputHtml = `<input type="text" id="q-${question.id}" ${requiredAttr}>`;
    }

    return `
      <div class="response-question form-group">
        <label ${question.type === 'checkbox' ? '' : `for="q-${question.id}"`}>
          ${question.label} ${requiredLabel}
        </label>
        ${inputHtml}
      </div>
    `;
  }

  /**
   * Submit client response
   */
  async submitResponse() {
    const form = document.getElementById('responseForm');
    const templateId = parseInt(form.dataset.templateId);
    const template = await window.DB.getTemplate(templateId);

    // Collect answers
    const answers = {};
    let hasErrors = false;

    for (const section of template.sections) {
      for (const question of section.questions) {
        const questionId = question.id;

        if (question.type === 'checkbox') {
          const checkboxes = document.querySelectorAll(`input[name="q-${questionId}"]:checked`);
          answers[questionId] = Array.from(checkboxes).map(cb => cb.value);

          if (question.required && answers[questionId].length === 0) {
            hasErrors = true;
            this.showNotification(`Please answer: ${question.label}`, 'error');
          }
        } else if (question.type === 'signature') {
          const canvas = document.querySelector(`[data-question-id="${questionId}"]`);
          if (canvas && canvas.signatureManager) {
            const dataURL = canvas.signatureManager.getDataURL();
            if (dataURL) {
              answers[questionId] = dataURL;
            } else if (question.required) {
              hasErrors = true;
              this.showNotification(`Please provide signature: ${question.label}`, 'error');
            }
          }
        } else {
          const element = document.getElementById(`q-${questionId}`);
          if (element) {
            answers[questionId] = element.value;

            if (question.required && !answers[questionId]) {
              hasErrors = true;
              this.showNotification(`Please answer: ${question.label}`, 'error');
            }
          }
        }
      }
    }

    if (hasErrors) {
      return;
    }

    // Save response
    try {
      const response = {
        templateId,
        clientName: document.getElementById('clientName').value,
        answers
      };

      await window.DB.saveResponse(response);
      await window.DB.logEvent('form_submitted', { templateId, clientName: response.clientName });

      this.showNotification('Response saved successfully!', 'success');

      // Ask if they want to export PDF
      if (confirm('Response saved! Export as PDF?')) {
        const doc = await window.PDFGenerator.generateFilledForm(template, response);
        const fileName = response.clientName ?
          `${template.name} - ${response.clientName}.pdf` :
          `${template.name} - Response.pdf`;
        window.PDFGenerator.download(doc, fileName);
      }

      window.Router.navigate('/responses');
    } catch (error) {
      this.showNotification('Failed to save response: ' + error.message, 'error');
    }
  }

  /**
   * Render responses list view
   */
  async renderResponses() {
    const responses = await window.DB.getAllResponses();
    const templates = await window.DB.getAllTemplates();

    const app = document.getElementById('app');
    app.innerHTML = `
      <header>
        <div class="container">
          <h1>Client Responses</h1>
          <nav>
            ${this.renderBackButton('/dashboard', 'Back to Dashboard')}
            ${responses.length > 0 ? `<button class="btn-success" onclick="app.exportAllData()">Export All Data</button>` : ''}
          </nav>
        </div>
      </header>

      <main>
        <div class="container">
          <h2>Client Responses</h2>
          <p class="text-muted">View and export submitted forms</p>

          ${responses.length === 0 ? `
            <div class="card text-center">
              <div class="card-body">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📊</div>
                <h3>No responses yet</h3>
                <p class="text-muted">Responses will appear here after clients fill out forms</p>
              </div>
            </div>
          ` : `
            <div class="card">
              <div class="card-body">
                ${responses.reverse().map(response => {
                  const template = templates.find(t => t.id === response.templateId);
                  const templateName = template ? template.name : 'Unknown Template';
                  return `
                    <div class="template-list-item">
                      <div class="template-info">
                        <h3>${response.clientName || 'Anonymous'}</h3>
                        <div class="template-meta">
                          ${templateName} • Submitted ${new Date(response.submittedAt).toLocaleString()}
                        </div>
                      </div>
                      <div class="template-actions">
                        <button class="btn btn-sm btn-primary" onclick="app.viewResponse(${response.id})">
                          View
                        </button>
                        <button class="btn btn-sm btn-success" onclick="app.exportResponsePDF(${response.id})">
                          Export PDF
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteResponse(${response.id})">
                          Delete
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `}
        </div>
      </main>
    `;
  }

  async viewResponse(responseId) {
    try {
      const response = await window.DB.getResponse(responseId);
      const template = await window.DB.getTemplate(response.templateId);

      if (!response || !template) {
        this.showNotification('Response or template not found', 'error');
        return;
      }

      const app = document.getElementById('app');
      app.innerHTML = `
        <header>
          <div class="container">
            <h1>View Response</h1>
            <nav>
              <button onclick="window.Router.navigate('/responses')">Back to Responses</button>
              <button class="btn-success" onclick="app.exportResponsePDF(${responseId})">Export PDF</button>
            </nav>
          </div>
        </header>

        <main>
          <div class="container container-sm">
            <div class="card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <div class="card-body">
                <h2 style="margin: 0 0 0.5rem 0; color: white;">${response.clientName || 'Anonymous Response'}</h2>
                <p style="margin: 0; opacity: 0.9;">
                  <strong>Form:</strong> ${template.name}<br>
                  <strong>Submitted:</strong> ${new Date(response.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>

            ${template.sections.map(section => {
              return `
                <div class="response-section" style="background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid var(--divider-color); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <h2 style="font-size: 1.5rem; margin-bottom: ${section.description ? '0.5rem' : '1rem'}; color: var(--text-primary); border-bottom: 2px solid var(--primary-color); padding-bottom: 0.5rem;">
                    ${section.title}
                  </h2>
                  ${section.description ? `<p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${section.description}</p>` : ''}

                  ${section.questions.map(question => {
                    const answer = response.answers[question.id];
                    return `
                      <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--background); border-radius: 6px;">
                        <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                          ${question.required ? '<span style="color: #d32f2f;">* </span>' : ''}${question.label}
                        </div>
                        <div style="color: var(--text-secondary); margin-left: 1rem;">
                          ${this.formatAnswer(question, answer)}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `;
            }).join('')}
          </div>
        </main>
      `;
    } catch (error) {
      console.error('[App] Error viewing response:', error);
      this.showNotification('Failed to load response: ' + error.message, 'error');
    }
  }

  /**
   * Format an answer based on question type
   */
  formatAnswer(question, answer) {
    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
      return '<em style="color: var(--text-muted);">No answer provided</em>';
    }

    switch (question.type) {
      case 'checkbox':
        if (Array.isArray(answer)) {
          return answer.map(a => `<div style="margin: 0.25rem 0;">✓ ${a}</div>`).join('');
        }
        return answer;

      case 'signature':
        if (answer.startsWith('data:image')) {
          return `<img src="${answer}" alt="Signature" style="max-width: 300px; border: 1px solid var(--divider-color); border-radius: 4px; background: white; padding: 0.5rem;">`;
        }
        return answer;

      case 'textarea':
        return `<div style="white-space: pre-wrap; line-height: 1.6;">${answer}</div>`;

      default:
        return answer;
    }
  }

  async exportResponsePDF(responseId) {
    try {
      const response = await window.DB.getResponse(responseId);
      const template = await window.DB.getTemplate(response.templateId);

      const doc = await window.PDFGenerator.generateFilledForm(template, response);
      const fileName = response.clientName ?
        `${template.name} - ${response.clientName}.pdf` :
        `${template.name} - Response ${responseId}.pdf`;

      window.PDFGenerator.download(doc, fileName);
      this.showNotification('PDF exported successfully!', 'success');
      await window.DB.logEvent('pdf_export', { responseId, type: 'filled' });
    } catch (error) {
      this.showNotification('PDF export failed: ' + error.message, 'error');
    }
  }

  async deleteResponse(responseId) {
    if (confirm('Delete this response? This cannot be undone.')) {
      try {
        await window.DB.deleteResponse(responseId);
        this.showNotification('Response deleted', 'success');
        window.Router.navigate('/responses');
      } catch (error) {
        this.showNotification('Delete failed: ' + error.message, 'error');
      }
    }
  }

  async exportAllData() {
    try {
      const data = await window.DB.exportAllData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `form-builder-backup-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      this.showNotification('Data exported successfully!', 'success');
      await window.DB.logEvent('data_export', { timestamp: new Date().toISOString() });
    } catch (error) {
      this.showNotification('Export failed: ' + error.message, 'error');
    }
  }

  /**
   * Show OAuth setup guide
   */
  showOAuthGuide(provider) {
    const guides = {
      googleDrive: {
        title: 'Google Drive Setup',
        steps: [
          'Go to <a href="https://console.cloud.google.com" target="_blank">console.cloud.google.com</a>',
          'Create a new project (or select existing)',
          'Enable "Google Drive API" from the API Library',
          'Go to "Credentials" → "Create Credentials" → "OAuth client ID"',
          'If prompted, configure OAuth consent screen (External type)',
          'Application type: Web application',
          'Add authorized redirect URI: <code>' + window.location.origin + '/' + '</code>',
          'Copy the Client ID (looks like: 123456-abc.apps.googleusercontent.com)'
        ],
        videoUrl: 'https://www.youtube.com/results?search_query=google+drive+api+oauth+setup'
      },
      dropbox: {
        title: 'Dropbox Setup',
        steps: [
          'Go to <a href="https://www.dropbox.com/developers/apps" target="_blank">dropbox.com/developers/apps</a>',
          'Click "Create app"',
          'Choose API: Scoped access',
          'Choose access type: Full Dropbox (or App folder for more security)',
          'Name your app (must be unique)',
          'Go to "Permissions" tab and enable: files.content.write and files.content.read',
          'Go to "Settings" tab',
          'Add Redirect URI: <code>' + window.location.origin + '/' + '</code>',
          'Copy the "App key" from Settings tab'
        ],
        videoUrl: 'https://www.youtube.com/results?search_query=dropbox+api+oauth+setup'
      }
    };

    const guide = guides[provider];
    if (!guide) return;

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7); z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; overflow: auto;
    `;

    modal.innerHTML = `
      <div style="
        background: white; border-radius: 12px; max-width: 700px;
        width: 100%; max-height: 90vh; overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <div style="padding: 2rem; border-bottom: 1px solid var(--divider-color);">
          <h2 style="margin: 0; color: var(--primary-color);">${guide.title}</h2>
          <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">
            One-time setup (takes ~5 minutes)
          </p>
        </div>
        <div style="padding: 2rem;">
          <div style="background: #fff3cd; border-left: 4px solid #ff9800; padding: 1rem; margin-bottom: 1.5rem;">
            <strong>Why this setup?</strong><br>
            Creating your own OAuth app ensures data goes directly to YOUR cloud account.
            We never have access to your data. This is FREE and takes just a few minutes!
          </div>

          <h3 style="margin-bottom: 1rem;">Step-by-Step Instructions:</h3>
          <ol style="padding-left: 1.5rem; line-height: 2;">
            ${guide.steps.map(step => `<li style="margin-bottom: 0.75rem;">${step}</li>`).join('')}
          </ol>

          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 1rem; margin: 1.5rem 0;">
            <strong>Need help?</strong> Search YouTube for step-by-step video tutorials:<br>
            <a href="${guide.videoUrl}" target="_blank" style="color: #2196f3; text-decoration: underline;">
              Watch video guide →
            </a>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button class="btn btn-secondary" onclick="this.closest('[style*=\\'position: fixed\\']').remove()" style="flex: 1;">
              Close
            </button>
            <button class="btn btn-primary" onclick="app.promptForOAuthCredentials('${provider}'); this.closest('[style*=\\'position: fixed\\']').remove();" style="flex: 1;">
              I Have My Credentials →
            </button>
          </div>
        </div>
      </div>
    `;

    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    document.body.appendChild(modal);
  }

  /**
   * Prompt for OAuth credentials
   */
  async promptForOAuthCredentials(provider) {
    const providerNames = {
      googleDrive: 'Google Drive',
      dropbox: 'Dropbox'
    };

    const credentialNames = {
      googleDrive: 'Client ID',
      dropbox: 'App Key'
    };

    const placeholders = {
      googleDrive: '123456789-abc123.apps.googleusercontent.com',
      dropbox: 'abc123xyz789'
    };

    const credential = prompt(
      `Enter your ${providerNames[provider]} ${credentialNames[provider]}:\n\n` +
      `Example: ${placeholders[provider]}\n\n` +
      `(This will be stored locally on your device)`
    );

    if (!credential || credential.trim() === '') {
      return;
    }

    // Save the credential
    if (provider === 'googleDrive') {
      window.CloudBackup.configureGoogleDrive(credential.trim());
    } else if (provider === 'dropbox') {
      window.CloudBackup.configureDropbox(credential.trim());
    }

    this.showNotification('Credentials saved! Now connecting...', 'success');

    // Now try to connect
    this.toggleCloudProvider(provider);
  }

  /**
   * Toggle cloud provider connection
   */
  async toggleCloudProvider(provider) {
    try {
      if (window.CloudBackup.isConnected(provider)) {
        // Disconnect
        if (confirm(`Disconnect from ${provider}?`)) {
          window.CloudBackup.disconnect(provider);
          this.showNotification(`Disconnected from ${provider}`, 'success');
          window.Router.navigate('/setup'); // Refresh
        }
      } else {
        // Check if configured
        const storageKeys = {
          googleDrive: 'gdrive_client_id',
          dropbox: 'dropbox_app_key'
        };

        const isConfigured = localStorage.getItem(storageKeys[provider]);

        if (!isConfigured) {
          // Not configured - prompt for credentials
          const providerNames = {
            googleDrive: 'Google Drive',
            dropbox: 'Dropbox'
          };

          const setup = confirm(
            `${providerNames[provider]} requires setup.\n\n` +
            `You need to create a free OAuth app to connect your ${providerNames[provider]} account.\n\n` +
            `Click OK to see setup instructions, or Cancel to skip.`
          );

          if (setup) {
            this.showOAuthGuide(provider);
          }
          return;
        }

        // Already configured - connect
        this.showNotification(`Connecting to ${provider}...`, 'info');

        if (provider === 'googleDrive') {
          await window.CloudBackup.connectGoogleDrive();
          this.showNotification('Connected to Google Drive!', 'success');
        } else if (provider === 'dropbox') {
          await window.CloudBackup.connectDropbox();
          this.showNotification('Connected to Dropbox!', 'success');
        }

        // Refresh to show connected state
        window.Router.navigate('/setup');
      }
    } catch (error) {
      this.showNotification(`Connection failed: ${error.message}`, 'error');

      // If error says "not configured", show guide
      if (error.message.includes('not configured')) {
        this.showOAuthGuide(provider);
      }
    }
  }

  /**
   * Backup to Files (iCloud on iOS, file picker on desktop)
   */
  async backupToFiles() {
    try {
      const data = await window.DB.exportAllData();
      await window.CloudBackup.backupToICloud(data);
      this.showNotification('Backup saved! On iOS, choose iCloud Drive in Files app.', 'success');
    } catch (error) {
      this.showNotification(`Backup failed: ${error.message}`, 'error');
    }
  }

  /**
   * Render settings view
   */
  async renderSettings() {
    window.Router.navigate('/setup');
  }

  /**
   * Render analytics view
   */
  async renderAnalytics() {
    const analytics = await window.DB.getAllAnalytics();
    const templates = await window.DB.getAllTemplates();
    const responses = await window.DB.getAllResponses();

    // Calculate stats
    const totalForms = templates.length;
    const totalResponses = responses.length;
    const formSubmissions = analytics.filter(e => e.eventType === 'form_submitted').length;
    const pdfExports = analytics.filter(e => e.eventType === 'pdf_export').length;

    const app = document.getElementById('app');
    app.innerHTML = `
      <header>
        <div class="container">
          <h1>Analytics</h1>
          <nav>
            ${this.renderBackButton('/dashboard', 'Back to Dashboard')}
          </nav>
        </div>
      </header>

      <main>
        <div class="container">
          <h2>Usage Analytics</h2>
          <p class="text-muted">Track your form builder usage</p>

          <div class="grid grid-2">
            <div class="card">
              <div class="card-body text-center">
                <div style="font-size: 3rem; color: var(--primary-color);">${totalForms}</div>
                <h3>Total Forms</h3>
              </div>
            </div>

            <div class="card">
              <div class="card-body text-center">
                <div style="font-size: 3rem; color: var(--accent-color);">${totalResponses}</div>
                <h3>Total Responses</h3>
              </div>
            </div>

            <div class="card">
              <div class="card-body text-center">
                <div style="font-size: 3rem; color: var(--primary-color);">${formSubmissions}</div>
                <h3>Form Submissions</h3>
              </div>
            </div>

            <div class="card">
              <div class="card-body text-center">
                <div style="font-size: 3rem; color: var(--accent-color);">${pdfExports}</div>
                <h3>PDF Exports</h3>
              </div>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-header">
              <h3 class="card-title">Recent Activity</h3>
            </div>
            <div class="card-body">
              ${analytics.length === 0 ? `
                <p class="text-muted text-center">No activity yet</p>
              ` : `
                <div style="max-height: 400px; overflow-y: auto;">
                  ${analytics.reverse().slice(0, 50).map(event => `
                    <div style="padding: 0.5rem; border-bottom: 1px solid var(--divider-color);">
                      <strong>${event.eventType.replace(/_/g, ' ')}</strong>
                      <span class="text-muted" style="float: right;">
                        ${new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>
        </div>
      </main>
    `;
  }

  /**
   * Render Document Generator
   */
  async renderDocumentGenerator() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <header>
        <div class="container">
          <h1>LLC Formation</h1>
          <nav>
            ${this.renderBackButton('/templates', 'Back to Templates')}
          </nav>
        </div>
      </header>

      <main>
        <div class="container">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">LLC Formation Kit</h2>
              <p class="text-muted">Articles of Organization, banking resolution, and DBA certificate</p>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label for="doc-type">Select Document Type</label>
                <select id="doc-type" class="form-control" onchange="app.handleDocTypeChange(this.value)">
                  <option value="articles">Articles of Organization (LLC)</option>
                  <option value="banking">Banking Resolution</option>
                  <option value="dba">Trade Name/DBA Certificate</option>
                </select>
              </div>

              <div id="document-fields" class="mt-3">
                <!-- Fields will be populated here -->
              </div>

              <div class="mt-3" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button onclick="app.toggleDocPreview()" class="btn btn-primary">
                  <span id="preview-btn-text">Show Preview</span>
                </button>
                <button onclick="app.printDocument()" class="btn btn-success">
                  Print / Save as PDF
                </button>
              </div>

              <div id="document-preview" style="display: none; margin-top: 2rem; border: 2px solid var(--divider-color); border-radius: 8px; padding: 1rem; background: white;">
                <h3 style="margin-bottom: 1rem;">Document Preview</h3>
                <div id="preview-content"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;

    // Initialize first document type after DOM is ready
    setTimeout(() => {
      this.handleDocTypeChange('articles');
    }, 0);
  }

  /**
   * Handle document type change
   */
  handleDocTypeChange(docType) {
    console.log('[App] Changing document type to:', docType);

    if (!window.DocumentGenerator) {
      console.error('[App] DocumentGenerator not loaded');
      this.showNotification('Document generator not loaded', 'error');
      return;
    }

    const fields = window.DocumentGenerator.fields[docType];
    const fieldsContainer = document.getElementById('document-fields');

    if (!fieldsContainer) {
      console.error('[App] Fields container not found');
      return;
    }

    if (!fields) {
      console.error('[App] No fields found for document type:', docType);
      return;
    }

    fieldsContainer.innerHTML = `
      <div class="grid grid-2">
        ${fields.map(field => `
          <div class="form-group">
            <label for="field-${field.key}">${field.label}</label>
            ${field.type === 'textarea' ? `
              <textarea
                id="field-${field.key}"
                class="form-control"
                rows="3"
                data-field-key="${field.key}"
              ></textarea>
            ` : field.type === 'select' ? `
              <select
                id="field-${field.key}"
                class="form-control"
                data-field-key="${field.key}"
              >
                <option value="">Select...</option>
                ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
              </select>
            ` : `
              <input
                type="text"
                id="field-${field.key}"
                class="form-control"
                data-field-key="${field.key}"
              />
            `}
          </div>
        `).join('')}
      </div>
    `;

    // Store current doc type
    window.DocumentGenerator.currentDoc = docType;
    window.DocumentGenerator.formData = {};
  }

  /**
   * Get current form data from fields
   */
  getDocumentFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('[data-field-key]');
    inputs.forEach(input => {
      const key = input.dataset.fieldKey;
      formData[key] = input.value || '';
    });
    return formData;
  }

  /**
   * Toggle document preview
   */
  toggleDocPreview() {
    console.log('[App] Toggling document preview');

    const preview = document.getElementById('document-preview');
    const btnText = document.getElementById('preview-btn-text');

    if (!preview || !btnText) {
      console.error('[App] Preview elements not found');
      return;
    }

    const isVisible = preview.style.display !== 'none';

    if (isVisible) {
      preview.style.display = 'none';
      btnText.textContent = 'Show Preview';
    } else {
      try {
        const formData = this.getDocumentFormData();
        const html = window.DocumentGenerator.fillTemplate(
          window.DocumentGenerator.currentDoc,
          formData
        );
        document.getElementById('preview-content').innerHTML = html;
        preview.style.display = 'block';
        btnText.textContent = 'Hide Preview';
      } catch (error) {
        console.error('[App] Error generating preview:', error);
        this.showNotification('Error generating preview: ' + error.message, 'error');
      }
    }
  }

  /**
   * Print document
   */
  printDocument() {
    console.log('[App] Printing document');

    try {
      const formData = this.getDocumentFormData();
      window.DocumentGenerator.printDocument(
        window.DocumentGenerator.currentDoc,
        formData
      );
    } catch (error) {
      console.error('[App] Error printing document:', error);
      this.showNotification('Error printing document: ' + error.message, 'error');
    }
  }

  /**
   * Show notification to user
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.maxWidth = '400px';
    notification.style.boxShadow = 'var(--shadow-lg)';
    notification.style.animation = 'slideIn 0.3s ease';

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  /**
   * Show loader
   */
  showLoader() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="loader"></div>';
  }

  /**
   * Hide loader
   */
  hideLoader() {
    // Loader will be replaced by content
  }

  /**
   * Handle logo upload with auto-resize and color extraction
   */
  async handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.showNotification('Please upload an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showNotification('Image is too large. Please use an image under 5MB', 'error');
      return;
    }

    try {
      this.showNotification('Processing logo...', 'info');

      // Read and resize the image
      const resizedImage = await this.resizeImage(file, 400, 200); // Max 400x200px

      // Extract colors from the image
      const colors = await this.extractColorsFromImage(resizedImage);

      // Update branding with logo and colors
      if (!this.branding) {
        this.branding = {};
      }
      this.branding.logo = resizedImage;
      this.branding.brandColors = colors;

      // Apply colors to theme
      this.applyBrandColors(colors);

      this.showNotification('Logo uploaded and colors extracted!', 'success');

      // Re-render to show preview
      window.Router.navigate('/setup');
    } catch (error) {
      console.error('[App] Logo upload failed:', error);
      this.showNotification('Failed to process logo: ' + error.message, 'error');
    }
  }

  /**
   * Resize image to fit within max dimensions
   */
  async resizeImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          // Create canvas and resize
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64
          const resizedDataUrl = canvas.toDataURL('image/png', 0.9);
          resolve(resizedDataUrl);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Extract dominant colors from image
   */
  async extractColorsFromImage(imageDataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        // Create canvas to analyze image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Use smaller size for color analysis (faster)
        const size = 100;
        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(img, 0, 0, size, size);

        // Get image data
        const imageData = ctx.getImageData(0, 0, size, size);
        const pixels = imageData.data;

        // Count color frequencies (simplified color buckets)
        const colorCounts = {};
        for (let i = 0; i < pixels.length; i += 4) {
          const r = Math.round(pixels[i] / 32) * 32; // Bucket colors
          const g = Math.round(pixels[i + 1] / 32) * 32;
          const b = Math.round(pixels[i + 2] / 32) * 32;
          const a = pixels[i + 3];

          // Skip transparent and very light/dark pixels
          if (a < 128 || (r > 224 && g > 224 && b > 224) || (r < 32 && g < 32 && b < 32)) {
            continue;
          }

          const key = `${r},${g},${b}`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }

        // Get most common colors
        const sortedColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return { r, g, b };
          });

        if (sortedColors.length === 0) {
          resolve({ primary: '#3f51b5', accent: '#4caf50' });
          return;
        }

        // Use most dominant color as primary
        const primary = sortedColors[0];
        const primaryHex = this.rgbToHex(primary.r, primary.g, primary.b);

        // Find a contrasting color for accent (or use second most dominant)
        let accent;
        if (sortedColors.length > 1) {
          const secondary = sortedColors[1];
          accent = this.rgbToHex(secondary.r, secondary.g, secondary.b);
        } else {
          // Generate complementary color
          accent = this.generateComplementaryColor(primary);
        }

        resolve({
          primary: primaryHex,
          accent: accent
        });
      };

      img.onerror = () => reject(new Error('Failed to analyze image'));
      img.src = imageDataUrl;
    });
  }

  /**
   * Convert RGB to hex color
   */
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Generate complementary color
   */
  generateComplementaryColor(rgb) {
    // Simple complementary color (opposite on color wheel)
    const h = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    h.h = (h.h + 180) % 360;
    const complementary = this.hslToRgb(h.h, h.s, h.l);
    return this.rgbToHex(complementary.r, complementary.g, complementary.b);
  }

  /**
   * Convert RGB to HSL
   */
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * Convert HSL to RGB
   */
  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * Apply brand colors to theme
   */
  applyBrandColors(colors) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--accent-color', colors.accent);

    // Generate darker variations
    const primaryRgb = this.hexToRgb(colors.primary);
    const accentRgb = this.hexToRgb(colors.accent);

    const primaryDark = this.rgbToHex(
      Math.max(0, primaryRgb.r - 40),
      Math.max(0, primaryRgb.g - 40),
      Math.max(0, primaryRgb.b - 40)
    );

    const accentDark = this.rgbToHex(
      Math.max(0, accentRgb.r - 40),
      Math.max(0, accentRgb.g - 40),
      Math.max(0, accentRgb.b - 40)
    );

    const primaryLight = this.rgbToHex(
      Math.min(255, primaryRgb.r + 100),
      Math.min(255, primaryRgb.g + 100),
      Math.min(255, primaryRgb.b + 100)
    );

    root.style.setProperty('--primary-dark', primaryDark);
    root.style.setProperty('--accent-dark', accentDark);
    root.style.setProperty('--primary-light', primaryLight);

    console.log('[App] Applied brand colors:', colors);
  }

  /**
   * Convert hex to RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 63, g: 81, b: 181 }; // Default to primary color
  }

  /**
   * Remove logo
   */
  async removeLogo() {
    if (!confirm('Remove company logo?')) return;

    if (this.branding) {
      this.branding.logo = null;
      this.branding.brandColors = null;
    }

    // Reset to default colors
    const root = document.documentElement;
    root.style.setProperty('--primary-color', '#3f51b5');
    root.style.setProperty('--primary-dark', '#303f9f');
    root.style.setProperty('--primary-light', '#c5cae9');
    root.style.setProperty('--accent-color', '#4caf50');
    root.style.setProperty('--accent-dark', '#388e3c');

    this.showNotification('Logo removed', 'success');
    window.Router.navigate('/setup');
  }

  /**
   * Render Trades & Field Services landing page
   * Industrial design with heavy-duty utilitarian aesthetic
   */
  async renderTrades() {
    // Get trades-specific templates
    const sampleTemplates = window.SAMPLE_TEMPLATES || [];
    const tradesTemplates = sampleTemplates.filter(t => t.industry === 'trades');

    const app = document.getElementById('app');

    // Add trades-theme class to body for industrial styling
    document.body.classList.add('trades-theme');

    app.innerHTML = `
      <!-- Industrial Header -->
      <header>
        <div class="container">
          <h1>
            <span class="logo-mark">&#9874;</span>
            TRADES & FIELD SERVICES
          </h1>
          <nav>
            ${this.renderBackButton('/dashboard', 'EXIT', 'header')}
            <button onclick="window.Router.navigate('/templates')">ALL TEMPLATES</button>
          </nav>
        </div>
      </header>

      <!-- Hero Section - Industrial Style -->
      <section class="trades-hero">
        <div class="container" style="position: relative; z-index: 1;">
          <div class="service-badge">
            <span class="service-badge-icon">&#128736;</span>
            FIELD-READY FORMS
          </div>
          <h1 style="margin-top: 1rem;">ZERO FRICTION DOCUMENTATION</h1>
          <p>Heavy-duty digital forms built for job sites, service trucks, and field crews. Works offline. Built to last.</p>
        </div>
      </section>

      <main>
        <div class="container">

          <!-- Quick Stats Panel -->
          <div class="toolbox-grid toolbox-grid-4" style="margin-bottom: 2rem;">
            <div class="compartment" style="text-align: center;">
              <div class="label-technical">Templates</div>
              <div style="font-size: 2.5rem; font-weight: 900; color: var(--safety-orange);">${tradesTemplates.length}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Field-Ready</div>
            </div>
            <div class="compartment" style="text-align: center;">
              <div class="label-technical">Status</div>
              <div class="status-badge status-active" style="margin: 0.75rem auto;">OPERATIONAL</div>
            </div>
            <div class="compartment" style="text-align: center;">
              <div class="label-technical">Network</div>
              <div class="status-badge ${this.isOnline ? 'status-active' : 'status-pending'}" style="margin: 0.75rem auto;">
                ${this.isOnline ? 'ONLINE' : 'OFFLINE MODE'}
              </div>
            </div>
            <div class="compartment" style="text-align: center;">
              <div class="label-technical">Access</div>
              <div style="font-size: 1rem; font-weight: 700; margin-top: 0.5rem;">GLOVE-FRIENDLY</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">52PX TOUCH TARGETS</div>
            </div>
          </div>

          <!-- Template Grid -->
          <div class="panel-technical" style="margin-bottom: 2rem;">
            <div class="panel-header">
              <span class="status-indicator"></span>
              FIELD SERVICE FORMS
            </div>
            <div style="padding: 1.5rem;">
              <div class="template-starter-grid stagger-reveal">
                ${tradesTemplates.map((template, index) => `
                  <div class="template-card ratchet-in" style="animation-delay: ${index * 50}ms;">
                    <div class="template-card__header">
                      <span class="template-card__icon">${template.icon}</span>
                      <div class="template-card__title">${template.name}</div>
                    </div>
                    <div class="template-card__body">
                      <span class="template-card__category">${template.category}</span>
                      <p class="template-card__description">${template.description}</p>
                    </div>
                    <div class="template-card__actions">
                      <button class="btn btn-primary btn-sm" onclick="app.importSampleTemplate('${template.name.replace(/'/g, "\\'")}'); document.body.classList.remove('trades-theme');">
                        DEPLOY FORM
                      </button>
                      <button class="btn btn-outline btn-sm" onclick="app.showSampleTemplatePreview('${template.name.replace(/'/g, "\\'")}')">
                        INSPECT
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Feature Panels -->
          <div class="toolbox-grid toolbox-grid-3" style="margin-bottom: 2rem;">
            <div class="compartment">
              <h3 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="color: var(--safety-green);">&#10003;</span>
                OFFLINE-FIRST
              </h3>
              <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5;">
                Works in basements, tunnels, and dead zones. Data syncs when connection returns.
              </p>
            </div>
            <div class="compartment">
              <h3 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="color: var(--safety-orange);">&#9998;</span>
                SIGNATURE CAPTURE
              </h3>
              <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5;">
                Get customer sign-off on-site. Legally binding digital signatures embedded in PDFs.
              </p>
            </div>
            <div class="compartment">
              <h3 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="color: var(--blueprint-line);">&#128196;</span>
                PDF EXPORT
              </h3>
              <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5;">
                Generate professional work orders and invoices. Email or print directly from the field.
              </p>
            </div>
          </div>

          <!-- Use Cases Panel -->
          <div class="panel-technical" style="margin-bottom: 2rem;">
            <div class="panel-header">
              <span class="status-indicator"></span>
              BUILT FOR
            </div>
            <div style="padding: 1.5rem;">
              <div class="toolbox-grid toolbox-grid-4">
                <div style="text-align: center; padding: 1rem;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">&#128295;</div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem;">HVAC</div>
                </div>
                <div style="text-align: center; padding: 1rem;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">&#9889;</div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem;">ELECTRICAL</div>
                </div>
                <div style="text-align: center; padding: 1rem;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">&#128167;</div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem;">PLUMBING</div>
                </div>
                <div style="text-align: center; padding: 1rem;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">&#127968;</div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem;">ROOFING</div>
                </div>
                <div style="text-align: center; padding: 1rem;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">&#128663;</div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem;">FLEET</div>
                </div>
                <div style="text-align: center; padding: 1rem;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">&#127795;</div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem;">LANDSCAPING</div>
                </div>
                <div style="text-align: center; padding: 1rem;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">&#128736;</div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem;">CONSTRUCTION</div>
                </div>
                <div style="text-align: center; padding: 1rem;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">&#128270;</div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem;">INSPECTIONS</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="compartment" style="text-align: center; padding: 2rem; border-top: 4px solid var(--safety-orange);">
            <h3 style="margin-bottom: 0.5rem;">READY TO DEPLOY?</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
              Select a template above or create a custom form for your specific needs.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary btn-lg" onclick="window.Router.navigate('/builder'); document.body.classList.remove('trades-theme');">
                BUILD CUSTOM FORM
              </button>
              <button class="btn btn-outline btn-lg" onclick="window.Router.navigate('/templates'); document.body.classList.remove('trades-theme');">
                VIEW ALL TEMPLATES
              </button>
            </div>
          </div>

        </div>
      </main>
    `;
  }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', async () => {
  app = new App();
  window.app = app; // Make available globally for onclick handlers
  await app.init();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
