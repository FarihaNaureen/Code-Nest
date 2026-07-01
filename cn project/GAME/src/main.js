// ============================================================
// CODE NEST — Main Entry & Router
// ============================================================

import './styles.css';
import { gameState } from './gameData.js';
import { renderWorldMap, destroyWorldMap } from './worldMap.js';
import { renderProblemView, destroyProblemView } from './problemView.js';

const appContainer = document.getElementById('app');

let currentRoute = null;

import { showHeroSelect } from './heroSelect.js';

// --- Simple Hash Router ---
function handleRoute() {
  const hash = window.location.hash || '#/';
  
  // Cleanup previous view
  if (currentRoute === 'worldMap') destroyWorldMap();
  if (currentRoute === 'problemView') destroyProblemView();
  
  if (hash === '#/') {
    // World Map Home
    currentRoute = 'worldMap';
    renderWorldMap(appContainer);
  } else if (hash.startsWith('#/problem/')) {
    // Problem View: #/problem/world-id/level-id
    const parts = hash.split('/');
    if (parts.length === 4) {
      currentRoute = 'problemView';
      const worldId = parts[2];
      const levelId = parts[3];
      renderProblemView(appContainer, worldId, levelId);
    } else {
      window.location.hash = '#/';
    }
  } else if (hash === '#/heroes') {
    currentRoute = 'heroes';
    showHeroSelect();
  } else {
    // Fallback
    window.location.hash = '#/';
  }
}

// --- Initialization ---
async function init() {
  // Listen for route changes
  window.addEventListener('hashchange', handleRoute);
  
  // Sync state with backend before initial route
  await gameState.syncWithBackend();
  
  // Initial route
  handleRoute();

  // Listen to storage event to sync theme from parent/other windows
  window.addEventListener('storage', (e) => {
    if (e.key === 'codenest_theme' || e.key === 'codenest-theme') {
      const newTheme = e.newValue || 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.dataset.theme = newTheme;
      if (newTheme === 'light') {
        document.documentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
      }
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
    }
  });
  
  // Expose gameState to window for debugging if needed
  window.gameState = gameState;
  
  console.log('Code Nest initialized! 🪺');
}

// Start app
init();
