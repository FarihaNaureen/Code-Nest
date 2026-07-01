import { gameState, HEROES } from './gameData.js';
import { createHeroViewer } from './heroModelViewer.js';
import { drawCharacter } from './pixelArt.js';

export function showHeroSelect() {
  const container = document.getElementById('app');
  container.innerHTML = '';
  
  let selectedHeroIndex = HEROES.findIndex(h => h.id === gameState.player.selectedHeroId);
  if (selectedHeroIndex === -1) selectedHeroIndex = 0;
  
  const page = document.createElement('div');
  page.className = 'hero-select-page';
  
  const style = document.createElement('style');
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');

    .hero-select-page {
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.85);
      display: flex; justify-content: center; align-items: center;
      color: white; font-family: 'Inter', sans-serif;
      box-sizing: border-box;
      position: absolute; top: 0; left: 0; z-index: 2000;
    }
    .hero-modal {
      width: 960px; max-width: 95vw; height: 600px;
      background-color: #3e220e;
      background-image: 
        repeating-linear-gradient(to bottom, transparent 0px, transparent 58px, #2a1506 58px, #2a1506 60px), 
        linear-gradient(90deg, #4d2b12, #3e220e, #4d2b12);
      border: 6px solid #1a0d04;
      border-radius: 8px;
      box-shadow: 0 15px 50px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.8);
      display: flex; flex-direction: column;
      position: relative;
    }
    .hero-header {
      height: 70px;
      display: flex; justify-content: center; align-items: center;
      border-bottom: 6px solid #1a0d04;
      position: relative;
      background: #2a1506;
      border-radius: 6px 6px 0 0;
    }
    .hero-header h1 {
      margin: 0; font-family: 'Cinzel', serif; font-size: 38px;
      color: #ffc107; text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 4px 8px rgba(0,0,0,0.8);
      letter-spacing: 2px; text-transform: uppercase;
    }
    .close-btn {
      position: absolute; right: 10px; top: 10px;
      background: #d32f2f; color: white; border: 3px solid #8b0000;
      width: 44px; height: 44px; font-size: 26px; cursor: pointer;
      border-radius: 6px; font-weight: bold;
      box-shadow: 0 4px 0 #8b0000;
      transition: transform 0.1s, box-shadow 0.1s;
      display: flex; justify-content: center; align-items: center;
    }
    .close-btn:active { transform: translateY(4px); box-shadow: 0 0 0 #8b0000; }
    
    .roster-container {
      display: flex; justify-content: flex-start; gap: 8px;
      padding: 16px; background: rgba(0,0,0,0.4);
      border-bottom: 6px solid #1a0d04;
      overflow-x: auto;
    }
    .hero-portrait-wrap {
      width: 80px; height: 80px; flex-shrink: 0;
      border: 4px ridge #78909c; border-radius: 4px;
      background: #111; cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.6);
      transition: transform 0.2s, border-color 0.2s;
    }
    .hero-portrait-wrap:hover { transform: scale(1.05); }
    .hero-portrait-wrap.active {
      border-color: #ffeb3b; transform: scale(1.1);
      box-shadow: 0 0 20px rgba(255, 235, 59, 0.4);
      z-index: 10; border-style: solid; border-width: 4px;
    }
    .hero-portrait { width: 100%; height: 100%; display: block; object-fit: contain; }
    .hero-preview-canvas { width: 100%; height: auto; max-height: 400px; display: block; object-fit: contain; }
    
    .hero-details-container {
      display: flex; flex: 1; padding: 30px; gap: 30px;
    }
    .hero-preview {
      flex: 0 0 40%; display: flex; justify-content: center; align-items: flex-start; padding-top: 20px;
    }
    .hero-info {
      flex: 1; display: flex; flex-direction: column; justify-content: flex-start;
    }
    .hero-name { 
      font-family: 'Cinzel', serif; font-size: 34px; font-weight: bold; margin-bottom: 15px; 
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8); text-transform: uppercase; letter-spacing: 1px;
    }
    .hero-desc { font-size: 16px; color: #f0f0f0; line-height: 1.5; margin-bottom: 25px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); }
    
    .stat-grid {
      display: grid; grid-template-columns: 100px 1fr; gap: 12px; align-items: center;
      font-size: 15px;
    }
    .stat-label { color: #bcaaa4; }
    .stat-val-text { color: #ffc107; font-weight: 500; }
    .stat-bar-container { background: #1a0d04; height: 12px; border-radius: 6px; overflow: hidden; border: 1px solid #000; width: 60%; }
    .stat-bar { height: 100%; border-radius: 6px; }
    
    .equip-btn {
      margin-top: auto; align-self: flex-start;
      padding: 12px 30px; font-family: 'Cinzel', serif; font-size: 18px; font-weight: bold;
      background: #4caf50; color: white; border: 3px solid #2e7d32; border-radius: 6px;
      cursor: pointer; text-transform: uppercase; transition: transform 0.1s, box-shadow 0.1s;
      box-shadow: 0 4px 0 #2e7d32; letter-spacing: 1px;
    }
    .equip-btn:active { transform: translateY(4px); box-shadow: 0 0 0 #2e7d32; }
    .equip-btn.equipped { background: #555; border-color: #333; box-shadow: 0 4px 0 #333; color: #aaa; cursor: default; }
    .equip-btn.equipped:active { transform: none; box-shadow: 0 4px 0 #333; }
  `;
  page.appendChild(style);
  
  const modal = document.createElement('div');
  modal.className = 'hero-modal';

  const header = document.createElement('div');
  header.className = 'hero-header';
  header.innerHTML = `
    <h1>Choose Your Hero</h1>
    <button class="close-btn" id="closeHeroBtn">×</button>
  `;
  modal.appendChild(header);
  
  const roster = document.createElement('div');
  roster.className = 'roster-container';
  modal.appendChild(roster);
  
  const details = document.createElement('div');
  details.className = 'hero-details-container';
  
  const previewBox = document.createElement('div');
  previewBox.className = 'hero-preview';
  const previewCanvas = document.createElement('canvas');
  previewCanvas.width = 300; previewCanvas.height = 300;
  previewCanvas.className = 'hero-preview-canvas';
  previewBox.appendChild(previewCanvas);
  
  const infoBox = document.createElement('div');
  infoBox.className = 'hero-info';
  
  details.appendChild(previewBox);
  details.appendChild(infoBox);
  modal.appendChild(details);
  page.appendChild(modal);
  container.appendChild(page);
  
  function updateUI() {
    const hero = HEROES[selectedHeroIndex];
    const isEquipped = gameState.player.selectedHeroId === hero.id;
    
    // Update Portraits
    roster.innerHTML = '';
    HEROES.forEach((h, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'hero-portrait-wrap' + (i === selectedHeroIndex ? ' active' : '');
      wrap.onclick = () => { selectedHeroIndex = i; updateUI(); };

      const canvas = document.createElement('canvas');
      canvas.width = 120; canvas.height = 120;
      canvas.className = 'hero-portrait';
      wrap.appendChild(canvas);
      // Render 3D preview with error handling
      try {
        const cleanup = createHeroViewer(canvas, h.avatarStyle, 120);
        wrap._cleanup = cleanup;
      } catch (e) {
        console.error('Failed to create hero viewer for', h.id, e);
      }
      roster.appendChild(wrap);
    });
    
    // Update Info
    infoBox.innerHTML = `
      <div class="hero-name">${hero.name}</div>
      <div class="hero-desc">${hero.description}</div>
      
      <div class="stat-grid">
        <div class="stat-label">Difficulty</div>
        <div class="stat-val-text">${hero.stats.difficulty}</div>
        
        <div class="stat-label">Type</div>
        <div class="stat-val-text">${hero.stats.type}</div>
        
        <div class="stat-label">Weapons</div>
        <div class="stat-val-text">${hero.stats.weapons}</div>
        
        <div class="stat-label">Damage</div>
        <div class="stat-bar-container"><div class="stat-bar" style="width: ${hero.stats.damage}%; background: #e53935;"></div></div>
        
        <div class="stat-label">Health</div>
        <div class="stat-bar-container"><div class="stat-bar" style="width: ${hero.stats.health}%; background: #43a047;"></div></div>
        
        <div class="stat-label">Speed</div>
        <div class="stat-bar-container"><div class="stat-bar" style="width: ${hero.stats.speed}%; background: #5e35b1;"></div></div>
      </div>
      
      <button class="equip-btn ${isEquipped ? 'equipped' : ''}" id="equipBtn">
        ${isEquipped ? 'Equipped' : 'Equip Hero'}
      </button>
    `;
    
    document.getElementById('equipBtn').onclick = () => {
      if (!isEquipped) {
        gameState.setSelectedHero(hero.id);
        updateUI();
      }
    };

    // Update 3D Preview
    if (previewCanvas._cleanup) previewCanvas._cleanup();
    try {
      previewCanvas._cleanup = createHeroViewer(previewCanvas, hero.avatarStyle, 300);
    } catch (e) {
      console.error('Failed to create main hero viewer', e);
    }
  }
  
  updateUI();
  
  document.getElementById('closeHeroBtn').onclick = () => {
    // Cleanup all hero portrait viewers
    const wraps = document.querySelectorAll('.hero-portrait-wrap');
    wraps.forEach(w => { if (w._cleanup) w._cleanup(); });
    // Cleanup preview canvas viewer
    if (previewCanvas._cleanup) previewCanvas._cleanup();
    window.location.hash = '#/';
  };
}

