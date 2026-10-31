/* ========================================================
   FAITH GAMES CENTER - CORE ENGINE
   Dynamic Widget Discovery: No HTML changes required when
   adding, updating, or deleting games!
   ======================================================== */

// Global App Core
window.FaithGamesCore = {
  registry: {},
  activeGameId: null,

  // Modular API for widgets to self-register
  registerGame(id, config) {
    this.registry[id] = config;
    renderSidebarItem(id, config);
  },

  // Launch a game module edge-to-edge (100dvh, 100dvw)
  launch(id) {
    const game = this.registry[id];
    if (!game) {
      showModalDialog("Game Notice", "This game module has been removed or is undergoing updates.");
      return;
    }

    this.activeGameId = id;
    document.getElementById('activeGameHeaderTitle').textContent = game.title;
    document.getElementById('gameScoreBadge').textContent = '0 PTS';

    // Switch viewports
    document.getElementById('homeView').classList.remove('active-screen');
    document.getElementById('gameMountScreen').classList.add('active-screen');

    // Mount game into DOM
    const stage = document.getElementById('gameStageRoot');
    stage.innerHTML = '';
    if (typeof game.mount === 'function') {
      game.mount(stage, (score) => {
        document.getElementById('gameScoreBadge').textContent = `${score} PTS`;
      });
    }

    closeAllDrawers();
  },

  // Return to menu and safely destroy active game instance
  returnToMenu() {
    if (this.activeGameId && this.registry[this.activeGameId]) {
      const game = this.registry[this.activeGameId];
      if (typeof game.destroy === 'function') {
        game.destroy();
      }
    }
    this.activeGameId = null;
    const stage = document.getElementById('gameStageRoot');
    stage.innerHTML = '';

    document.getElementById('gameMountScreen').classList.remove('active-screen');
    document.getElementById('homeView').classList.add('active-screen');
  }
};

/* ========================================================
   DYNAMIC MODULAR WIDGET AUTO-LOADER
   Silently probes and loads any existing game widget files.
   Missing or deleted files are simply skipped without errors.
   ======================================================== */
const MODULAR_WIDGET_LIST = [
  "faith-runner.js",
  "prayer-quest.js",
  "bible-hero.js",
  "worship-warrior.js",
  "salvation-journey.js",
  "scripture-memory.js",
  "bible-trivia.js",
  "parable-puzzle.js",
  "commandment-quest.js",
  "prophet-timeline.js",
  "fruit-of the-spirit.js",
  "university-quiz.js"
];

function loadModularWidgets() {
  MODULAR_WIDGET_LIST.forEach((filename) => {
    const script = document.createElement("script");
    script.src = filename;
    script.async = true;
    script.onerror = () => {
      // Gracefully ignore missing/deleted widgets; the core continues running flawlessly.
      console.info(`Widget [${filename}] is absent. Skipped gracefully.`);
    };
    document.body.appendChild(script);
  });
}

/* ========================================================
   DESKTOP BLOCKER ENFORCEMENT
   ======================================================== */
function enforceAndroidTarget() {
  const blocker = document.getElementById('desktopBlocker');
  const ua = navigator.userAgent || "";
  const isAndroid = /android/i.test(ua);
  const isDesktopScreen = window.innerWidth > 600 || window.innerHeight > 1100;

  if (!isAndroid && isDesktopScreen) {
    blocker.classList.add('blocked');
  } else {
    blocker.classList.remove('blocked');
  }
}

/* ========================================================
   CENTER DIALOGS & TOASTS (No Native Alerts)
   ======================================================== */
function showModalDialog(title, text) {
  const modal = document.getElementById('centerModal');
  document.getElementById('centerModalTitle').textContent = title;
  document.getElementById('centerModalBody').textContent = text;
  modal.classList.add('active');
}

function hideModalDialog() {
  document.getElementById('centerModal').classList.remove('active');
}

function showToast(text, type = 'info') {
  const toast = document.getElementById('appToast');
  toast.textContent = text;
  toast.className = `md3-toast show ${type}`;
  setTimeout(() => {
    toast.className = 'md3-toast';
  }, 2600);
}

/* ========================================================
   DRAWER NAVIGATION CONTROLS
   ======================================================== */
const scrim = document.getElementById('drawerOverlay');
const leftDrawer = document.getElementById('leftSidebar');
const rightDrawer = document.getElementById('rightSidebar');

function openLeftDrawer() {
  closeAllDrawers();
  leftDrawer.classList.add('open');
  scrim.classList.add('active');
}

function openRightDrawer() {
  closeAllDrawers();
  rightDrawer.classList.add('open');
  scrim.classList.add('active');
}

function closeAllDrawers() {
  leftDrawer.classList.remove('open');
  rightDrawer.classList.remove('open');
  scrim.classList.remove('active');
}

function renderSidebarItem(id, config) {
  const navList = document.getElementById('gamesNavList');
  if (document.getElementById(`drawer-btn-${id}`)) return;

  const btn = document.createElement('button');
  btn.id = `drawer-btn-${id}`;
  btn.className = 'drawer-nav-item';
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" class="drawer-nav-icon">${config.iconSvg || '<path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>'}</svg>
    <span>${config.title}</span>
  `;
  btn.addEventListener('click', () => {
    FaithGamesCore.launch(id);
  });
  navList.appendChild(btn);
}

/* ========================================================
   FULLSCREEN PUBLIC MODAL CONTROLS
   ======================================================== */
function openPublicModal(modalId) {
  closeAllDrawers();
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

function closePublicModal(modal) {
  modal.classList.remove('open');
}

/* ========================================================
   CORE INITIALIZATION
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  enforceAndroidTarget();
  window.addEventListener('resize', enforceAndroidTarget);

  // Dynamically load the self-contained widgets
  loadModularWidgets();

  // Drawer Toggles
  document.getElementById('leftMenuBtn').addEventListener('click', openLeftDrawer);
  document.getElementById('rightMenuBtn').addEventListener('click', openRightDrawer);
  document.getElementById('closeLeftSidebar').addEventListener('click', closeAllDrawers);
  document.getElementById('closeRightSidebar').addEventListener('click', closeAllDrawers);
  scrim.addEventListener('click', closeAllDrawers);

  // Hero Buttons
  document.getElementById('openGamesHeroBtn').addEventListener('click', openLeftDrawer);
  document.getElementById('openInfoHeroBtn').addEventListener('click', openRightDrawer);

  // Game Return Arrow
  document.getElementById('gameReturnBackArrow').addEventListener('click', () => {
    FaithGamesCore.returnToMenu();
  });

  // Modal Ok Button
  document.getElementById('centerModalOkBtn').addEventListener('click', hideModalDialog);

  // Public Menu Openers
  document.querySelectorAll('.drawer-nav-item[data-modal]').forEach((item) => {
    item.addEventListener('click', () => {
      openPublicModal(item.getAttribute('data-modal'));
    });
  });

  // Return Back Arrows inside Fullscreen Modals
  document.querySelectorAll('.modal-dismiss-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.fullscreen-modal-view');
      if (modal) closePublicModal(modal);
    });
  });

  // Dark Mode Toggle
  const themeBtn = document.getElementById('menuDarkModeBtn');
  const themeText = document.getElementById('themeToggleText');
  themeBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    themeText.textContent = isDark ? 'Dark Mode: On' : 'Dark Mode: Off';
    showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled');
  });

  // Developer Bio Expansion
  const toggleBioBtn = document.getElementById('toggleDevBioBtn');
  const bioExtra = document.getElementById('devBioExtra');
  toggleBioBtn.addEventListener('click', () => {
    const isExpanded = bioExtra.classList.toggle('expanded');
    toggleBioBtn.textContent = isExpanded ? 'Show Less' : 'Show More';
  });

  // Team Bios Expansion
  document.querySelectorAll('.team-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.team-member-card');
      const expandedBio = card.querySelector('.bio-expanded');
      const isExpanded = expandedBio.classList.toggle('expanded');
      btn.textContent = isExpanded ? 'Show Less' : 'Show More';
    });
  });

  // Team Jump Up/Down Navigation
  document.querySelectorAll('.team-jump-nav').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCard = document.getElementById(btn.getAttribute('data-target'));
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Copy Support Details
  document.getElementById('copySupportBankBtn').addEventListener('click', () => {
    const details = "Union Bank | DVG Kingdom Ministries | Account No: 1000510055";
    navigator.clipboard.writeText(details).then(() => {
      showToast("Bank details copied to clipboard!", "success");
    }).catch(() => {
      showToast("Union Bank: 1000510055");
    });
  });
});

/* ========================================================
   SERVICE WORKER REGISTRATION
   ======================================================== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((err) => {
      console.warn('SW registration skipped:', err);
    });
  });
}