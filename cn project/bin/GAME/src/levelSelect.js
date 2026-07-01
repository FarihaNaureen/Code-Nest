// ============================================================
// CODE NEST — Level Select Modal (Parchment UI)
// 10-level fantasy card grid overlay
// ============================================================

import { gameState, WORLDS, PROBLEMS, PREVIEW_UNLOCK_ALL_LEVELS } from './gameData.js';

let modalElement = null;

export function showLevelSelect(worldId) {
  closeLevelSelect();

  const world = WORLDS.find(w => w.id === worldId);
  if (!world) return;

  const worldProgress = gameState.getWorldProgress(worldId);
  const problems = PROBLEMS[worldId] || [];
  const currentLevel = gameState.getCurrentLevel(worldId);

  const overlay = document.createElement('div');
  overlay.className = 'parchment-modal-overlay';
  overlay.id = 'levelSelectOverlay';

  // Build 10 level cards
  let cardsHtml = '';
  for (let i = 1; i <= 10; i++) {
    const levelProgress = worldProgress.levels[i] || { completed: false, stars: 0 };
    const isCompleted = levelProgress.completed;
    const isCurrent = i === currentLevel && !isCompleted;
    let isLocked = !isCompleted && i > currentLevel;
    let isPreview = false;
    
    if (isLocked && PREVIEW_UNLOCK_ALL_LEVELS) {
      isLocked = false;
      isPreview = true;
    }

    let stateClass = '';
    if (isCompleted) stateClass = 'parchment-card--completed';
    else if (isCurrent) stateClass = 'parchment-card--current';
    else if (isLocked) stateClass = 'parchment-card--locked';
    else if (isPreview) stateClass = 'parchment-card--preview';

    const stars = levelProgress.stars || 0;

    const starsHtml = Array(3).fill(0).map((_, si) =>
      `<span class="parchment-star ${si < stars ? 'parchment-star--filled' : 'parchment-star--empty'}">★</span>`
    ).join('');

    let badge = '';
    if (isCompleted) {
      badge = '<div class="parchment-card-badge"></div>';
    } else if (isPreview) {
      badge = '<div class="parchment-card-badge" style="background:#8b5cf6; color:white; font-size:9px; padding:2px 4px; border-radius:4px; top:-5px; right:-5px; box-shadow:0 0 5px rgba(0,0,0,0.5);">TEST</div>';
    }

    const startBtn = (isCurrent || isPreview)
      ? `<button class="parchment-card-start" data-level="${i}">START</button>`
      : '';

    cardsHtml += `
      <div class="parchment-card ${stateClass}" data-level="${i}">
        ${badge}
        <div class="parchment-card-number">${i}</div>
        <div class="parchment-card-stars">${starsHtml}</div>
        ${startBtn}
      </div>
    `;
  }

  overlay.innerHTML = `
    <div class="parchment-modal">
      <button class="parchment-modal-close" id="closeLevelSelect">✕</button>
      
      <div class="parchment-modal-header">
        <div class="parchment-modal-title">${world.name.toUpperCase()}: ${world.subtitle ? world.subtitle.toUpperCase() : 'THE ASCENSION LEVELS'}</div>
        <div class="parchment-modal-subtitle">10 ASCENSION LEVELS</div>
      </div>
      
      <div class="parchment-grid">
        ${cardsHtml}
      </div>
      
      <div class="parchment-modal-footer">
        Complete a level to unlock the next.
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  modalElement = overlay;

  // Event handlers
  overlay.querySelector('#closeLevelSelect').addEventListener('click', closeLevelSelect);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLevelSelect();
  });

  // Level card click
  overlay.querySelectorAll('.parchment-card').forEach(card => {
    card.addEventListener('click', () => {
      const levelId = parseInt(card.dataset.level);
      const isLocked = card.classList.contains('parchment-card--locked');
      if (isLocked) {
        showToast('🔒 Complete the previous level first!', 'warning');
        return;
      }
      closeLevelSelect();
      window.location.hash = `#/problem/${worldId}/${levelId}`;
    });
  });

  // Start button click
  overlay.querySelectorAll('.parchment-card-start').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const levelId = parseInt(btn.dataset.level);
      closeLevelSelect();
      window.location.hash = `#/problem/${worldId}/${levelId}`;
    });
  });

  // Keyboard close
  const keyHandler = (e) => {
    if (e.key === 'Escape') {
      closeLevelSelect();
      document.removeEventListener('keydown', keyHandler);
    }
  };
  document.addEventListener('keydown', keyHandler);
}

export function closeLevelSelect() {
  if (modalElement) {
    modalElement.remove();
    modalElement = null;
  }
}

// Simple toast notification
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || ''}</span> ${message}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export { showToast };

