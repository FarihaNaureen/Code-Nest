// ============================================================
// CODE NEST — World Map Page
// Fantasy-themed map with DSA topic islands
// ============================================================

import { gameState, WORLDS, PROBLEMS, PREVIEW_UNLOCK_ALL_LEVELS, HEROES } from './gameData.js';
import { showLevelSelect } from './levelSelect.js';
import { showHeroSelect } from './heroSelect.js';
import { drawIsland, drawMapBackground } from './pixelArt.js';
import { createHeroViewer } from './heroModelViewer.js';

let activePopover = null;
let animationId = null;
let islandCanvases = [];

export function renderWorldMap(container) {
  // Clear any existing animation loops
  if (animationId) cancelAnimationFrame(animationId);
  islandCanvases = [];

  container.innerHTML = '';

  // Compute dynamic SVG path coordinates based on world positions in gameData.js
  const w0_x = Math.round((WORLDS[0].position.x / 100) * 1200) + 90;
  const w0_y = Math.round((WORLDS[0].position.y / 100) * 600) + 70;
  
  const w1_x = Math.round((WORLDS[1].position.x / 100) * 1200) + 90;
  const w1_y = Math.round((WORLDS[1].position.y / 100) * 600) + 70;

  const w2_x = Math.round((WORLDS[2].position.x / 100) * 1200) + 90;
  const w2_y = Math.round((WORLDS[2].position.y / 100) * 600) + 70;

  const w3_x = Math.round((WORLDS[3].position.x / 100) * 1200) + 90;
  const w3_y = Math.round((WORLDS[3].position.y / 100) * 600) + 70;

  const path1_d = `M ${w0_x + 40} ${w0_y + 15} C ${w0_x + 110} ${w0_y - 5}, ${w1_x - 110} ${w1_y + 40}, ${w1_x - 30} ${w1_y + 20}`;
  const arrow1_pts = `${w1_x - 35},${w1_y + 15} ${w1_x - 25},${w1_y + 20} ${w1_x - 35},${w1_y + 25}`;

  const path2_d = `M ${w1_x + 45} ${w1_y + 20} C ${w1_x + 115} ${w1_y + 40}, ${w2_x - 110} ${w2_y + 40}, ${w2_x - 30} ${w2_y + 20}`;
  const arrow2_pts = `${w2_x - 35},${w2_y + 15} ${w2_x - 25},${w2_y + 20} ${w2_x - 35},${w2_y + 25}`;

  const path3_d = `M ${w2_x + 40} ${w2_y + 10} C ${w2_x + 90} ${w2_y - 20}, ${w3_x - 110} ${w3_y - 20}, ${w3_x - 30} ${w3_y}`;
  const arrow3_pts = `${w3_x - 35},${w3_y - 5} ${w3_x - 25},${w3_y} ${w3_x - 35},${w3_y + 5}`;

  // Choose avatar display (image or default wizard)
  const avatarHtml = gameState.player.avatarDisplay 
    ? `<img src="${gameState.player.avatarDisplay}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);" />`
    : `<span style="font-size: 1.2rem;">🧙‍♂️</span>`;

  // Build page
  const page = document.createElement('div');
  page.className = 'world-map-page';
  page.innerHTML = `
    <!-- Unified Site Navigation (matches main site hud-nav) -->
    <div class="hud-nav" style="${window.self !== window.top ? 'display: none !important;' : ''}">
      <a href="/" class="logo-container">
        <img src="/images/dsa_nest_logo.png" alt="Code Nest Logo" style="height: 40px; image-rendering: pixelated; margin-right: 10px;" onerror="this.style.display='none'">
        <span class="logo-text">Code Nest</span>
      </a>
      <ul class="nav-links">
        ${gameState.player.role === 'ADMIN' ? `
          <li><a href="/profile"><i class="fa fa-user"></i> Profile</a></li>
          <li><a href="/admin"><i class="fa fa-cog"></i> Admin Settings</a></li>
        ` : `
          <li class="active"><a href="/map"><i class="fa fa-map"></i> Worlds</a></li>
          <li><a href="/leaderboard"><i class="fa fa-trophy"></i> Leaderboard</a></li>
          <li><a href="/multiplayer"><i class="fa fa-users"></i> Forge (Co-op)</a></li>
          <li><a href="/achievements"><i class="fa fa-shield"></i> Achievements</a></li>
        `}
      </ul>
      <div style="display: flex; align-items: center; gap: 15px;">
        <!-- Theme Toggle Button -->
        <button id="theme-toggle" class="theme-toggle-btn" title="Toggle Theme" style="position: static !important; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1rem; padding: 0; color: inherit;">
            <span id="theme-icon">${document.documentElement.classList.contains('light-mode') ? '☀️' : '🌙'}</span>
        </button>
        
        <!-- Currency Counters -->
        <div class="currency-hud" style="display: flex; align-items: center; gap: 15px;">
            <!-- Profile Avatar -->
            <a href="/profile" class="profile-hud-btn" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: inherit;">
                ${avatarHtml}
                <span>${gameState.player.name}</span>
            </a>
            <a href="/auth/logout" class="btn-secondary" style="padding: 4px 10px; font-size: 0.8rem; text-decoration: none; color: inherit; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; display: inline-block;">Exit</a>
        </div>
      </div>
    </div>

    <!-- Map Frame -->
    <div class="world-map-frame" style="position: relative;">
      <canvas id="worldMapBgCanvas" class="world-map-bg-canvas"></canvas>
      <div class="map-texture-overlay"></div>
      <div class="world-map-title">Code Nest: DSA World Map Explorer</div>
      
      <!-- Floating Heroes Button (Pic 4 style) -->
      <a href="#/heroes" class="header-nav-btn" style="position: absolute; top: 20px; right: 20px; text-decoration: none; padding: 10px 20px; background: #1a1d2d; border-radius: 8px; color: white; font-weight: bold; border: 1px solid rgba(255,255,255,0.15); transition: background 0.2s, transform 0.2s; z-index: 20; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); font-family: var(--font-ui); font-size: 15px;" onmouseover="this.style.background='#23273d'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='#1a1d2d'; this.style.transform='translateY(0)';">⚔️ Heroes</a>
      
      <div class="world-map-container" id="mapContainer">
      <!-- SVG Paths -->
      <div class="map-paths">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
          <!-- Path: Arrays → Stacks -->
          <path class="map-path" d="${path1_d}" />
          <polygon class="map-path-arrow" points="${arrow1_pts}" />

          <!-- Path: Stacks → LinkedLists -->
          <path class="map-path" d="${path2_d}" />
          <polygon class="map-path-arrow" points="${arrow2_pts}" />

          <!-- Path: LinkedLists → Uncharted -->
          <path class="map-path" d="${path3_d}" />
          <polygon class="map-path-arrow" points="${arrow3_pts}" />
        </svg>
      </div>

      <!-- Compass Rose -->
      <div class="compass-rose">
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#8b7355" stroke-width="2" opacity="0.4"/>
          <circle cx="50" cy="50" r="35" stroke="#8b7355" stroke-width="1" opacity="0.3"/>
          <!-- N -->
          <polygon points="50,8 45,35 55,35" fill="#8b7355" opacity="0.6"/>
          <!-- S -->
          <polygon points="50,92 45,65 55,65" fill="#8b7355" opacity="0.3"/>
          <!-- E -->
          <polygon points="92,50 65,45 65,55" fill="#8b7355" opacity="0.3"/>
          <!-- W -->
          <polygon points="8,50 35,45 35,55" fill="#8b7355" opacity="0.3"/>
          <text x="50" y="22" text-anchor="middle" fill="#5c3d2e" font-size="10" font-weight="bold">N</text>
          <text x="50" y="88" text-anchor="middle" fill="#5c3d2e" font-size="10" font-weight="bold">S</text>
          <text x="85" y="54" text-anchor="middle" fill="#5c3d2e" font-size="10" font-weight="bold">E</text>
          <text x="15" y="54" text-anchor="middle" fill="#5c3d2e" font-size="10" font-weight="bold">W</text>
        </svg>
      </div>

      </div>
    </div>
    

  `;

  container.appendChild(page);

  // Wire Theme Toggle click
  const themeToggle = page.querySelector('#theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-mode');
      const newTheme = isLight ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('codenest_theme', newTheme);
      const icon = themeToggle.querySelector('#theme-icon');
      if (icon) {
        icon.textContent = isLight ? '☀️' : '🌙';
      }
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
    });
  }

  const mapContainer = page.querySelector('#mapContainer');

  // Render islands
  WORLDS.forEach((world, index) => {
    renderIsland(mapContainer, world, index);
  });

  // Start Animation Loop
  let time = 0;
  const bgCanvas = page.querySelector('#worldMapBgCanvas');
  const frame = page.querySelector('.world-map-frame');

  // Theme is now controlled globally via document.documentElement.dataset.theme

  function animate() {
    time++;
    
    // Background animation
    if (bgCanvas && frame) {
      const frameRect = frame.getBoundingClientRect();
      const newW = Math.floor(frameRect.width / 2);
      const newH = Math.floor(frameRect.height / 2);
      if (bgCanvas.width !== newW || bgCanvas.height !== newH) {
        bgCanvas.width = newW;
        bgCanvas.height = newH;
      }
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const bgStyle = currentTheme === 'light' ? 'day' : 'night';
      drawMapBackground(bgCanvas, time, bgStyle);
    }

    islandCanvases.forEach(item => {
      drawIsland(item.canvas, item.world.theme, item.progress, time);
    });
    animationId = requestAnimationFrame(animate);
  }
  animate();

  // Close popover on background click
  mapContainer.addEventListener('click', (e) => {
    if (!e.target.closest('.island') && !e.target.closest('.island-popover')) {
      closePopover();
    }
  });

  // Initialize Theme (sync with main site convention)
  const savedTheme = localStorage.getItem('codenest_theme') || localStorage.getItem('codenest-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'light') document.documentElement.classList.add('light-mode');
  else document.documentElement.classList.remove('light-mode');
}

function renderIsland(container, world, index) {
  const progress = gameState.getWorldCompletion(world.id);
  const worldProgress = gameState.getWorldProgress(world.id);
  let isLocked = !worldProgress.unlocked;
  if (PREVIEW_UNLOCK_ALL_LEVELS) isLocked = false;

  const island = document.createElement('div');
  island.className = `island ${isLocked ? 'island--locked' : ''}`;
  island.dataset.worldId = world.id;

  // Position islands dynamically using coordinate values from gameData.js
  island.style.left = `${world.position.x}%`;
  island.style.top = `${world.position.y}%`;

  // Add canvas for pixel art
  const canvasWrapper = document.createElement('div');
  canvasWrapper.className = 'island-visual';
  
  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 140;
  canvas.className = 'island-canvas';
  canvasWrapper.appendChild(canvas);
  
  // Track for animation
  islandCanvases.push({ canvas, world, progress });

  const label = document.createElement('div');
  label.className = 'island-label';
  
  if (isLocked) {
    label.innerHTML = `
      <div class="island-name">${world.name}</div>
    `;
  } else {
    label.innerHTML = `
      <div class="island-name">${world.name}</div>
      <div class="island-progress-bar">
        <div class="island-progress-fill" style="width: ${progress}%; background: linear-gradient(90deg, ${world.colors.primary}, ${world.colors.secondary})"></div>
        <div class="island-progress-text">${progress}% Complete</div>
      </div>
    `;

    // Click handler directly opens 10-level select modal
    island.addEventListener('click', (e) => {
      e.stopPropagation();
      showLevelSelect(world.id);
    });
  }

  island.appendChild(canvasWrapper);
  island.appendChild(label);
  container.appendChild(island);
}

function closePopover() {
  // Obsolete, left empty for compatibility if called elsewhere
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Ensure proper cleanup
export function destroyWorldMap() {
  if (animationId) cancelAnimationFrame(animationId);
  const avatarCanvas = document.querySelector('.hero-avatar-canvas');
  if (avatarCanvas && avatarCanvas._cleanup) {
    avatarCanvas._cleanup();
  }
}
