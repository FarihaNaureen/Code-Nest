// ============================================================
// CODE NEST — Problem View Page
// 3-panel interface: Story | Game Scene | Code Editor
// ============================================================

import { gameState, getProblem, WORLDS, HEROES, getBackendLevelId } from './gameData.js';
import { executeCode, validateSolution, calculateRewards } from './codeRunner.js';
import { showToast, showLevelSelect } from './levelSelect.js';
import { GameSceneRenderer } from './pixelArt.js';
import { createHeroViewer } from './heroModelViewer.js';
import { initAudio, playDialogueBlip } from './audio.js';

// ── Voice Assistant Logic ────────────────────────────────────────
let guideMuted = localStorage.getItem('guideMuted') === 'true';
let currentUtterance = null;
let currentGuideMessage = '';
let currentSpeechPitch = 1.0;

export function toggleGuideMute() {
  guideMuted = !guideMuted;
  localStorage.setItem('guideMuted', guideMuted);
  if (guideMuted) {
    stopGuideVoice();
  } else if (currentGuideMessage) {
    speakGuide(currentGuideMessage, currentSpeechPitch);
  }
  return guideMuted;
}

export function stopGuideVoice() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

export function speakGuide(text, pitch = 1.0) {
  if (guideMuted || !window.speechSynthesis) return;
  stopGuideVoice();
  const ut = new SpeechSynthesisUtterance(text);
  ut.pitch = pitch;
  ut.rate = 1.05;
  currentUtterance = ut;
  window.speechSynthesis.speak(ut);
}

export function showGuideMessage(text, speechPitch, beepPitch, element) {
  if (!text) return;
  currentGuideMessage = text;
  currentSpeechPitch = speechPitch;
  typewriteText(element, text, beepPitch);
  speakGuide(text, speechPitch);
}

// ── Typewriter Logic ───────────────────────────────────────────
function typewriteText(element, text, heroPitch) {
  element.innerHTML = '';
  let htmlResult = '';
  let i = 0;
  
  if (element._typewriterTimeout) clearTimeout(element._typewriterTimeout);
  
  function typeChar() {
    if (i < text.length) {
      const char = text.charAt(i);
      
      if (char === '\\' && text.charAt(i+1) === 'n') {
        htmlResult += '<br>';
        i += 2;
      } else if (char === '\n') {
        htmlResult += '<br>';
        i++;
      } else {
        htmlResult += char;
        // Only beep if voice is muted or TTS unsupported
        if (/[a-zA-Z0-9]/.test(char) && (guideMuted || !window.speechSynthesis)) {
          initAudio();
          playDialogueBlip(heroPitch);
        }
        i++;
      }
      
      element.innerHTML = htmlResult;
      const delay = /[.,!?]/.test(char) ? 150 : 35; 
      element._typewriterTimeout = setTimeout(typeChar, delay);
    }
  }
  typeChar();
}

// ── Multi-Language Starter Code Generator ────────────────────
function getStarterCodeForLanguage(problem, language) {
  // Use explicit starter code if the problem defines it
  if (language === 'python' && problem.starterCodePython) return problem.starterCodePython;
  if (language === 'java' && problem.starterCodeJava) return problem.starterCodeJava;
  if (language === 'c' && problem.starterCodeC) return problem.starterCodeC;
  if (language === 'javascript') return problem.starterCode;

  // Auto-generate from JavaScript starter code
  const jsCode = problem.starterCode;

  if (language === 'python') {
    return convertJSToPythonStarter(jsCode);
  } else if (language === 'java') {
    return convertJSToJavaStarter(jsCode);
  } else if (language === 'c') {
    return convertJSToCStarter(jsCode);
  }
  return jsCode;
}

function convertJSToPythonStarter(js) {
  let py = js;
  // Remove semicolons
  py = py.replace(/;$/gm, '');
  // const/let/var → remove
  py = py.replace(/\b(const|let|var)\s+/g, '');
  // console.log() → print()
  py = py.replace(/console\.log\(/g, 'print(');
  // // comments → # comments
  py = py.replace(/\/\/(.*)/g, '#$1');
  // true/false/null → True/False/None
  py = py.replace(/\btrue\b/g, 'True');
  py = py.replace(/\bfalse\b/g, 'False');
  py = py.replace(/\bnull\b/g, 'None');
  // .push() → .append() (for arrays)
  py = py.replace(/\.push\(/g, '.append(');
  // .length → len()
  py = py.replace(/(\w+)\.length/g, 'len($1)');
  // for (let i = 0; i < n; i++) → for i in range(n):
  py = py.replace(/for\s*\(\s*\w+\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*(\w+(?:\.\w+)*)\s*;\s*\1\+\+\s*\)\s*\{/g, 'for $1 in range($2):');
  // Remove { } braces at line ends/starts
  py = py.replace(/\s*\{$/gm, ':');
  py = py.replace(/^\s*\}\s*$/gm, '');
  // stack.push → stack.push (keep for game API)
  py = py.replace(/stack\.append\(/g, 'stack.push(');
  return py;
}

function convertJSToJavaStarter(js) {
  let java = js;
  java = java.replace(/(?:const|let|var)\s+(\w+)\s*=\s*(\[.*?\])/g, (m, name, arr) => {
    const items = arr.slice(1, -1);
    if (items.match(/^["\u2018]/)) return `String[] ${name} = {${items}}`;
    return `int[] ${name} = {${items}}`;
  });
  java = java.replace(/(?:const|let|var)\s+(\w+)\s*=\s*"([^"]*)"/g, 'String $1 = "$2"');
  java = java.replace(/(?:const|let|var)\s+(\w+)\s*=\s*(\d+)/g, 'int $1 = $2');
  java = java.replace(/(?:const|let|var)\s+(\w+)\s*=\s*""/g, 'String $1 = ""');
  java = java.replace(/(?:const|let|var)\s+(\w+)/g, 'var $1');
  java = java.replace(/console\.log\(([^)]+)\)/g, (match, args) => {
    let parts = args.split(/,\s*/);
    let joined = parts.join(' + " " + ');
    return `System.out.println(${joined})`;
  });
  java = java.replace(/for\s*\(\s*let\s+/g, 'for (int ');
  java = java.replace(/new\s+Array\((.*?)\)\.fill\((.*?)\)/g, 'new int[$1]');

  const indented = java.split('\n').map(l => '        ' + l).join('\n');
  return `import java.util.*;

class Main {
    public static void main(String[] args) {
${indented}
    }
}`;
}

function convertJSToCStarter(js) {
  let c = '#include <stdio.h>\n\nint main() {\n';
  let body = js;
  // const/let/var x = number → int x = number
  body = body.replace(/(?:const|let|var)\s+(\w+)\s*=\s*(\d+)/g, 'int $1 = $2');
  // const/let/var x = "str" → char *x = "str"
  body = body.replace(/(?:const|let|var)\s+(\w+)\s*=\s*"([^"]*)"/g, 'char *$1 = "$2"');
  // const/let/var x = [...] → int x[] = {...}
  body = body.replace(/(?:const|let|var)\s+(\w+)\s*=\s*\[([^\]]*)\]/g, (m, name, items) => {
    if (items.match(/"/)) return `char *${name}[] = {${items}}`;
    return `int ${name}[] = {${items}}`;
  });
  body = body.replace(/(?:const|let|var)\s+(\w+)\s*=\s*""/g, 'char *$1 = ""');
  body = body.replace(/(?:const|let|var)\s+(\w+)/g, 'int $1');
  // console.log("text", var) → printf("text %s\n", var) (simplified)
  body = body.replace(/console\.log\(([^)]*)\)\s*;/g, (m, args) => {
    return `printf("${args.replace(/"/g, '')}\\n");`;
  });
  // // comments → // comments (already valid in C)
  // Indent body
  const indented = body.split('\n').map(l => '    ' + l).join('\n');
  c += indented + '\n    return 0;\n}';
  return c;
}

let editor = null;
let currentProblem = null;
let currentHintsUsed = 0;
let currentLanguage = 'java';
let stackState = { items: [] };
let sceneRenderer = null;
let currentWorldId = null;
let currentLevelId = null;

// Validation States
let isCodeCorrect = false;
let isCharacterActionCompleted = false;
let isRelicCollected = false;
let levelProgress = 0;
let currentErrorCount = 0;
let levelCompleteShown = false;
let latestExecutionResult = null;

export function renderProblemView(container, worldId, levelId) {
  const problem = getProblem(worldId, parseInt(levelId));
  if (!problem) {
    container.innerHTML = '<div style="padding: 40px; text-align: center; color: white;">Problem not found! <a href="#/">Go Back</a></div>';
    return;
  }

  currentProblem = problem;
  currentHintsUsed = gameState.player.hintsUsed || 0; // Or track per level
  stackState = { items: [] }; // Reset stack visualizer
  currentWorldId = worldId;
  currentLevelId = levelId;
  
  isCodeCorrect = false;
  isCharacterActionCompleted = false;
  isRelicCollected = false;
  levelProgress = 0;
  currentErrorCount = 0;
  levelCompleteShown = false;
  latestExecutionResult = null;

  // Reset HP at start of level
  gameState.resetHp();

  // Clean up old avatar canvas if it exists
  const oldAvatarCanvas = container.querySelector('.hero-avatar-canvas');
  if (oldAvatarCanvas && oldAvatarCanvas._cleanup) {
    oldAvatarCanvas._cleanup();
  }

  // Stop previous renderer if exists
  if (sceneRenderer) {
    sceneRenderer.stop();
  }

  container.innerHTML = '';
  
  const page = document.createElement('div');
  page.className = 'problem-page fantasy-theme';

  // Get currently selected hero data
  const hero = HEROES.find(h => h.id === gameState.player.selectedHeroId) || HEROES[0];
  
  // Choose avatar display (image or default wizard)
  const avatarHtml = gameState.player.avatarDisplay 
    ? `<img src="${gameState.player.avatarDisplay}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);" />`
    : `<span style="font-size: 1.2rem;">🧙‍♂️</span>`;

  // --- Unified Site Navigation (matches main site hud-nav) ---
  const header = document.createElement('div');
  header.className = 'hud-nav';
  if (window.self !== window.top) {
      header.style.display = 'none';
  }
  header.innerHTML = `
    <a href="/" class="logo-container">
      <img src="/images/dsa_nest_logo.png" alt="Code Nest Logo" style="height: 40px; image-rendering: pixelated; margin-right: 10px;" onerror="this.style.display='none'">
      <span class="logo-text">Code Nest</span>
    </a>
    <ul class="nav-links">
      ${gameState.player.role === 'ADMIN' ? `
        <li><a href="/profile"><i class="fa fa-user"></i> Profile</a></li>
        <li><a href="/admin"><i class="fa fa-cog"></i> Admin Settings</a></li>
      ` : `
        <li><a href="/map"><i class="fa fa-map"></i> Worlds</a></li>
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
  `;

  // --- Background / Game Scene Layer ---
  const sceneLayer = document.createElement('div');
  sceneLayer.className = 'fantasy-scene-layer';
  sceneLayer.innerHTML = `
    <div class="game-scene" id="gameSceneCanvasContainer">
      <canvas id="gameSceneCanvas"></canvas>
      <div id="hero3DContainer" style="position: absolute; pointer-events: none; width: 120px; height: 120px; transform: translate(-50%, -100%); z-index: 10;"></div>
    </div>
    <div class="scene-objective">COLLECT ALL RELICS</div>
    
    <div class="guide-panel">
      <div class="guide-avatar" id="guideAvatarContainer"></div>
      <div class="guide-speech">
        <div class="guide-label">GUIDE:</div>
        <div class="guide-text" id="guideTextContainer"></div>
        <div class="guide-controls">
          <button class="guide-btn" id="btnReplayVoice">Replay</button>
          <button class="guide-btn" id="btnToggleMute">${guideMuted ? 'Unmute' : 'Mute'}</button>
        </div>
      </div>
    </div>
    
    <div class="level-progress-wrapper">
      <div class="potion-icon"></div>
      <div class="level-progress-bar">
        <div class="progress-label">Level Progress: <span id="sceneProgressText">0%</span></div>
        <div class="progress-track">
          <div class="progress-fill" style="width: 0%;" id="sceneProgress"></div>
        </div>
      </div>
      <div class="chest-icon"></div>
    </div>
  `;
  
  // --- Overlay Layout Container ---
  const layout = document.createElement('div');
  layout.className = `fantasy-overlay-layout ${problem.worldId === 'stacks-queues' ? 'theme-golden-castle' : ''}`;
  
  // --- Left Panel: Problem Scroll ---
  const scrollPanel = document.createElement('div');
  scrollPanel.className = 'fantasy-left-panel rune-border';
  const controlsList = problem.story.controls.map(c => `<li>${c}</li>`).join('');
  scrollPanel.innerHTML = `
    <div class="view-challenge-tab">
      <div class="scroll-icon">📜</div>
      <span>VIEW<br>CHALLENGE</span>
    </div>
    <div class="close-parchment-btn" id="btnCloseProblem"></div>
    <div class="parchment-content">
      <h2 class="problem-title">Problem: ${problem.title}</h2>
      
      <div class="problem-section">
        <div class="problem-section-title">Scenario:</div>
        <div class="problem-section-text">${problem.story.scenario}</div>
      </div>
      
      <div class="problem-section">
        <div class="problem-section-title">Objective:</div>
        <div class="problem-section-text">${problem.story.objective}</div>
      </div>
      
      <div class="problem-section">
        <div class="problem-section-title">Controls:</div>
        <ul class="problem-controls-list">
          ${controlsList}
        </ul>
      </div>
    </div>
  `;
  
  // --- Right Panel: The Alchemist IDE ---
  const editorPanel = document.createElement('div');
  editorPanel.className = 'fantasy-right-panel';
  const worldInfo = WORLDS.find(w => w.id === worldId);
  const editorTitle = worldInfo ? worldInfo.name : 'Code Editor';
  
  editorPanel.innerHTML = `
    <div class="editor-header">
      <button class="close-ide-btn" id="btnCloseIde" title="Close IDE"></button>
      <div class="editor-title">
        CODENEST IDE
      </div>
    </div>
      
      <div class="lang-tabs">
        <button class="lang-tab lang-tab--active" data-lang="java"><span class="lang-tab-icon">☕</span> Java</button>
        <button class="lang-tab" data-lang="python"><span class="lang-tab-icon">🐍</span> Python</button>
        <button class="lang-tab" data-lang="c"><span class="lang-tab-icon">⚙️</span> C</button>
      </div>
      
      <div class="code-editor-wrapper">
        <div id="monaco-container" style="width:100%; height:100%;"></div>
      </div>
      
      <div class="editor-actions">
        <button class="btn btn--run" id="btnRun">
          <span class="btn-icon">🧪</span> RUN
        </button>
        <button class="btn btn--reset" id="btnReset">
          <span class="btn-icon">↻</span> RESET
        </button>
        <button class="btn btn--submit" id="btnSubmit" disabled>
          <span class="btn-icon">📜</span> SUBMIT
        </button>
      </div>
      
      <div class="console-panel">
        <div class="console-header">OUTPUT / CONSOLE</div>
        <div id="consoleOutput">
          <div class="console-line console-prompt">> Welcome to the ${worldInfo ? worldInfo.name : 'Dungeon'}!</div>
          <div class="console-line console-line--info">> You can use: ${problem.story.controls.join(', ')}</div>
        </div>
      </div>
      
      <div class="stack-viz-panel" style="${problem.worldId === 'stacks-queues' ? 'display: none;' : ''}">
        <div class="stack-viz-header">
          <span>STACK VISUALIZATION</span>
          <span class="stack-top-label">TOP</span>
        </div>
        <div class="stack-viz-container">
          <div class="stack-viz-grid" id="stackViz">
            <div class="stack-empty-text">-- Empty --</div>
          </div>
        </div>
      </div>
      
      <div class="hint-panel">
        <div class="hint-header">
          <div class="hint-title">💡 HINT (1/${problem.hints.length}) <span class="hint-cost">(Cost: ${problem.hints[0].cost} Mana)</span></div>
        </div>
        <div class="hint-text" id="hintText">${problem.hints[0].text}</div>
        <div class="hint-nav">
          <button class="hint-nav-btn" id="prevHint" disabled>◀</button>
          <button class="hint-nav-btn" id="nextHint">▶</button>
        </div>
      </div>
  `;
  
  // --- Bottom Status Bar ---
  const statusBar = document.createElement('div');
  statusBar.className = 'fantasy-status-bar';
  statusBar.innerHTML = `
    <div class="status-item">
      <span class="status-item-icon">📖</span>
      <span class="status-item-label">CONCEPT LEARNED:</span>
      <span class="status-item-value">${problem.concepts.join(', ')}</span>
    </div>
    <div class="status-item" style="position: absolute; left: 50%; transform: translateX(-50%); z-index: 100;">
      <a href="#/" id="btnGameplayBackToMap" style="text-decoration: none; padding: 6px 16px; background: #2a221b; border: 2px solid #b58c54; color: #b58c54; border-radius: 6px; font-family: 'Cinzel', serif; font-size: 13px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 8px; transition: all 0.2s;" onmouseover="this.style.background='#3e2f24'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='#2a221b'; this.style.transform='scale(1)';">
        🗺️ Back to Map
      </a>
    </div>
    <div class="status-item" style="margin-left: auto;">
      <span class="status-item-icon">🧰</span>
      <span class="status-item-label">RELICS COLLECTED:</span>
      <span class="status-item-value" id="relicsCount">0 / ${problem.relics ? problem.relics.length : 0}</span>
    </div>
    <div class="status-item" style="margin-left: 30px;" title="Health Points">
      <span class="status-item-label" style="margin-right: 8px;">HP:</span>
      <span class="status-item-value" id="hpDisplay" style="display: flex; gap: 4px; font-size: 20px;"></span>
    </div>
  `;
  
  const openIdeBtn = document.createElement('div');
  openIdeBtn.className = 'open-ide-btn';
  openIdeBtn.id = 'btnOpenIde';
  openIdeBtn.innerHTML = '<div class="code-icon">💻</div>OPEN<br>IDE';

  layout.appendChild(scrollPanel);
  layout.appendChild(editorPanel);
  layout.appendChild(openIdeBtn);
  
  page.appendChild(header);
  page.appendChild(sceneLayer);
  page.appendChild(layout);
  page.appendChild(statusBar);
  
  container.appendChild(page);
  
  // --- Initialize Pixel Art Canvas ---
  const canvas = document.getElementById('gameSceneCanvas');
  // Make canvas resize to container
  const resizeCanvas = () => {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  };
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // initial size

  sceneRenderer = new GameSceneRenderer(canvas, worldId, problem.sceneType);
  sceneRenderer.setRelics(problem.relics);
  sceneRenderer.setHazards(problem.hazards || []);
  
  // --- Initialize 3D Character Overlay ---
  const hero3DContainer = sceneLayer.querySelector('#hero3DContainer');
  const selectedHero = HEROES.find(h => h.id === gameState.player.selectedHeroId) || HEROES[0];
  const heroStyle = selectedHero.avatarStyle || '#f5c29d'; // Fallback
  if (hero3DContainer) {
    createHeroViewer(hero3DContainer, heroStyle, 120, { mode: 'gameplay' });
  }
  
  // --- Wire Theme Toggle click ---
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

  // --- Initialize Guide Overlay ---
  const guideAvatarContainer = sceneLayer.querySelector('#guideAvatarContainer');
  if (guideAvatarContainer) {
    // Force static mode for the guide portrait
    createHeroViewer(guideAvatarContainer, heroStyle, 60, { mode: 'static_portrait' });
  }
  
  const guideTextContainer = sceneLayer.querySelector('#guideTextContainer');
  
  // Voice pitches
  let speechPitch = 1.0;
  let beepPitch = 600;
  if (selectedHero.stats.type === 'Mage') { speechPitch = 1.5; beepPitch = 800; }
  if (selectedHero.stats.type === 'Warrior') { speechPitch = 0.6; beepPitch = 300; }
  if (selectedHero.stats.type === 'Ranger') { speechPitch = 1.2; beepPitch = 500; }

  // Bind guide buttons
  const btnReplayVoice = sceneLayer.querySelector('#btnReplayVoice');
  const btnToggleMute = sceneLayer.querySelector('#btnToggleMute');
  if (btnReplayVoice) {
    btnReplayVoice.addEventListener('click', () => {
      if (currentGuideMessage) showGuideMessage(currentGuideMessage, speechPitch, beepPitch, guideTextContainer);
    });
  }
  if (btnToggleMute) {
    btnToggleMute.addEventListener('click', () => {
      const isMuted = toggleGuideMute();
      btnToggleMute.textContent = isMuted ? 'Unmute' : 'Mute';
    });
  }

  // Load intro text
  if (guideTextContainer) {
    const initialText = problem.guide ? problem.guide.intro : problem.guideText;
    showGuideMessage(initialText, speechPitch, beepPitch, guideTextContainer);
  }
  
  // Expose global helper for other functions (like handleSuccess, hint click)
  window._showGuideMsg = (type) => {
    if (!problem.guide) return;
    const text = problem.guide[type];
    if (text && guideTextContainer) {
      showGuideMessage(text, speechPitch, beepPitch, guideTextContainer);
    }
  };
  
  // Callback for 3D overlay
  sceneRenderer.onCharacterUpdate = (charX, charYNorm, isWalking, facingRight, tool, anim, animProgress, isEnteredDoor) => {
    if (hero3DContainer) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      hero3DContainer.style.left = `${charX * w}px`;
      hero3DContainer.style.top = `${charYNorm * h}px`;
      
      if (isEnteredDoor) {
        hero3DContainer.style.display = 'none';
      } else {
        hero3DContainer.style.display = 'block';
      }

      if (hero3DContainer._viewer) {
        hero3DContainer._viewer.updateState(isWalking, facingRight, tool, anim, animProgress);
      }
    }
  };

  sceneRenderer.start();

  // --- Initialize Monaco Editor ---
  currentLanguage = 'java';
  const initialStarterCode = getStarterCodeForLanguage(problem, 'java');
  initMonacoEditor(initialStarterCode);
  
  // --- Bind Events ---
  bindEvents(worldId, levelId);
  setupHintSystem(problem);

  // --- Listen to global theme changes ---
  document.addEventListener('themeChanged', (e) => {
    if (window.monaco && editor) {
      window.monaco.editor.setTheme(e.detail === 'light' ? 'codeNestThemeLight' : 'codeNestTheme');
    }
  });

  // --- Listen to damage and death events ---
  const damageListener = (e) => {
    const amount = e.detail || 1;
    gameState.takeDamage(amount);
    updateHpDisplay();
    
    // Flash screen red
    const sceneLayer = document.querySelector('.fantasy-scene-layer');
    if (sceneLayer) {
      sceneLayer.classList.add('damage-flash');
      setTimeout(() => sceneLayer.classList.remove('damage-flash'), 300);
    }
    
    if (window._showGuideMsg) {
      window._showGuideMsg('damage');
    }
  };
  
  const deathListener = () => {
    if (!levelCompleteShown) {
      showLevelFailed("You ran out of Health! Be careful around hazards.");
      if (window._showGuideMsg) {
        window._showGuideMsg('fail');
      }
    }
  };

  // Remove old listeners to prevent duplicates
  window.removeEventListener('playerDamage', window._damageListener);
  window.removeEventListener('playerDied', window._deathListener);
  
  window._damageListener = damageListener;
  window._deathListener = deathListener;

  window.addEventListener('playerDamage', damageListener);
  window.addEventListener('playerDied', deathListener);

  // Initial HP render
  updateHpDisplay();
}

export function updateHpDisplay() {
  const hpDisplay = document.getElementById('hpDisplay');
  if (!hpDisplay) return;
  const currentHp = gameState.player.currentHp;
  const maxHp = gameState.player.maxHp;
  let html = '';
  for (let i = 0; i < maxHp; i++) {
    html += i < currentHp ? '<span style="color: #e74c3c;">❤️</span>' : '<span style="color: #555; filter: grayscale(100%);">🖤</span>';
  }
  hpDisplay.innerHTML = html;
}

export function showLevelFailed(reason) {
  if (levelCompleteShown) return;
  levelCompleteShown = true;
  if (sceneRenderer) sceneRenderer.stop(); // stop gameplay
  
  const overlay = document.createElement('div');
  overlay.className = 'success-overlay'; // reuse overlay bg
  
  overlay.innerHTML = `
    <div class="wood-modal" style="border-top-color: #c0392b;">
      <div class="wood-chain wood-chain-left"></div>
      <div class="wood-chain wood-chain-right"></div>
      
      <div class="wood-board">
        <div class="wood-victory-banner" style="background: linear-gradient(180deg, #c0392b, #8b0000);">
          <h1 class="wood-victory-text">LEVEL FAILED</h1>
        </div>
        
        <div style="padding: 30px; text-align: center; color: #f5c29d; font-size: 20px;">
          ${reason}
        </div>
        
        <div class="wood-shelf">
          <div class="wood-shelf-ledge"></div>
        </div>
        
        <div class="wood-modal-footer">
          <button class="btn btn--secondary" id="btnFailBack">Back to Map</button>
          <button class="btn btn--secondary" id="btnFailHint">View Hint</button>
          <button class="btn btn--primary" id="btnFailRetry">Try Again</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  document.getElementById('btnFailRetry').addEventListener('click', () => {
    overlay.remove();
    // Restart level
    if (document.getElementById('btnReset')) {
      document.getElementById('btnReset').click();
    }
    renderProblemView(document.querySelector('.app-content'), currentWorldId, currentLevelId);
  });
  
  document.getElementById('btnFailHint').addEventListener('click', () => {
    overlay.remove();
    levelCompleteShown = false; // Allow continuing after hint
    const rightPanel = document.querySelector('.fantasy-right-panel');
    if (rightPanel) rightPanel.classList.remove('collapsed');
    // Scroll to hints
    const hintHeader = document.querySelector('.hint-header');
    if (hintHeader) hintHeader.scrollIntoView({ behavior: 'smooth' });
  });
  
  document.getElementById('btnFailBack').addEventListener('click', () => {
    overlay.remove();
    showLevelSelect(currentWorldId);
  });
}

function initMonacoEditor(starterCode) {
  // Check if Monaco is already loaded globally
  if (window.monaco) {
    createEditorInstance(starterCode);
  } else {
    // Load Monaco via require.js from CDN
    const loaderScript = document.createElement('script');
    loaderScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js';
    loaderScript.onload = () => {
      window.require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.40.0/min/vs' }});
      window.require(['vs/editor/editor.main'], function() {
        createEditorInstance(starterCode);
      });
    };
    document.head.appendChild(loaderScript);
  }
}

function createEditorInstance(starterCode) {
  const container = document.getElementById('monaco-container');
  if (!container) return;

  // Define custom theme to match our fantasy UI
  window.monaco.editor.defineTheme('codeNestTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { background: '1e2133' },
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
    ],
    colors: {
      'editor.background': '#1e2133',
      'editor.lineHighlightBackground': '#2a314d',
      'editorLineNumber.foreground': '#6272a4',
      'editorIndentGuide.background': '#2a314d',
    }
  });

  window.monaco.editor.defineTheme('codeNestThemeLight', {
    base: 'vs',
    inherit: true,
    rules: [
      { background: 'f5e6d3' },
      { token: '', foreground: '5c4033' },
      { token: 'comment', foreground: 'b89f81', fontStyle: 'italic' },
      { token: 'keyword', foreground: '8b5a2b', fontStyle: 'bold' },
      { token: 'string', foreground: 'a0522d' },
      { token: 'number', foreground: 'cd853f' },
      { token: 'type', foreground: '6b4423' },
      { token: 'identifier', foreground: '5c4033' },
      { token: 'operator', foreground: '8b5a2b' }
    ],
    colors: {
      'editor.background': '#f5e6d3',
      'editor.foreground': '#5c4033',
      'editor.lineHighlightBackground': '#e8d4b9',
      'editorLineNumber.foreground': '#a68a6d',
      'editorIndentGuide.background': '#e8d4b9',
      'scrollbarSlider.background': '#d2b48c',
      'scrollbarSlider.hoverBackground': '#b89f81',
      'scrollbarSlider.activeBackground': '#8b5a2b',
      'editorOverviewRuler.border': '#00000000',
      'editor.inactiveSelectionBackground': '#e8d4b9',
      'editor.selectionBackground': '#d2b48c',
    }
  });

  const globalTheme = document.documentElement.dataset.theme || 'dark';
  editor = window.monaco.editor.create(container, {
    value: starterCode,
    language: 'java', // Default to Java
    theme: globalTheme === 'light' ? 'codeNestThemeLight' : 'codeNestTheme',
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: "'Fira Code', monospace",
    lineHeight: 24,
    padding: { top: 16, bottom: 16 },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    roundedSelection: false,
    automaticLayout: true,
  });
}

function disableSubmitButton() {
  const btn = document.getElementById('btnSubmit');
  if (btn) btn.disabled = true;
  isCodeCorrect = false;
  isCharacterActionCompleted = false;
  isRelicCollected = false;
  levelProgress = 0;
}

function enableSubmitButton() {
  const btn = document.getElementById('btnSubmit');
  if (btn) btn.disabled = false;
}

function checkLevelCompletion() {
  console.log("Checking level completion...");
  console.log("isCodeCorrect:", isCodeCorrect, "levelProgress:", levelProgress, "currentHp:", gameState.player.currentHp);
  
  if (isCodeCorrect && levelProgress >= 100) {
    console.log("Conditions met! Triggering handleSuccess...");
    handleSuccess();
  } else {
    console.log("Conditions NOT met for victory.");
  }
}

function bindEvents(worldId, levelId) {
  const btnRun = document.getElementById('btnRun');
  const btnSubmit = document.getElementById('btnSubmit');
  const btnReset = document.getElementById('btnReset');
  const btnCloseProblem = document.getElementById('btnCloseProblem');
  
  const btnBackToLevels = document.getElementById('btnBackToLevels');
  
  if (btnRun) btnRun.addEventListener('click', () => handleRun());
  if (btnSubmit) btnSubmit.addEventListener('click', () => handleSubmit());
  if (btnBackToLevels) {
    btnBackToLevels.addEventListener('click', () => {
      showLevelSelect(worldId);
    });
  }
  
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (editor && currentProblem) {
        const starterCode = getStarterCodeForLanguage(currentProblem, currentLanguage);
        editor.setValue(starterCode);
        resetVisuals();
        disableSubmitButton();
        if (window._showGuideMsg) {
          window._showGuideMsg('reset');
        }
      }
    });
  }
  
  if (btnCloseProblem) {
    btnCloseProblem.addEventListener('click', () => {
      const leftPanel = document.querySelector('.fantasy-left-panel');
      if (leftPanel) leftPanel.classList.add('collapsed');
    });
  }
  
  const viewChallengeTab = document.querySelector('.view-challenge-tab');
  if (viewChallengeTab) {
    viewChallengeTab.addEventListener('click', () => {
      const leftPanel = document.querySelector('.fantasy-left-panel');
      if (leftPanel) leftPanel.classList.remove('collapsed');
    });
  }
  
  // IDE toggles
  const btnCloseIde = document.getElementById('btnCloseIde');
  const btnOpenIde = document.getElementById('btnOpenIde');
  const rightPanel = document.querySelector('.fantasy-right-panel');
  
  if (btnCloseIde && rightPanel && btnOpenIde) {
    btnCloseIde.addEventListener('click', () => {
      rightPanel.classList.add('collapsed');
      btnOpenIde.classList.add('visible');
      if (window._showGuideMsg) {
        window._showGuideMsg('closeIde');
      }
    });
  }
  
  if (btnOpenIde && rightPanel) {
    btnOpenIde.addEventListener('click', () => {
      rightPanel.classList.remove('collapsed');
      btnOpenIde.classList.remove('visible');
      if (window._showGuideMsg) {
        window._showGuideMsg('openIde');
      }
    });
  }

  // Handle Language Tabs
  const langTabs = document.querySelectorAll('.lang-tab');
  langTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const lang = e.currentTarget.getAttribute('data-lang');
      
      // Update active tab styling
      langTabs.forEach(t => t.classList.remove('lang-tab--active'));
      e.currentTarget.classList.add('lang-tab--active');
      
      // Update current language
      currentLanguage = lang;
      
      // Update Monaco editor language mode
      if (editor) {
        const monacoLang = lang === 'c' ? 'c' : lang === 'java' ? 'java' : lang === 'python' ? 'python' : 'javascript';
        window.monaco.editor.setModelLanguage(editor.getModel(), monacoLang);
        
        // Swap starter code for new language
        if (currentProblem) {
          const starterCode = getStarterCodeForLanguage(currentProblem, lang);
          editor.setValue(starterCode);
        }
      }
      
      disableSubmitButton();
      
      const langNames = { java: 'Java', python: 'Python', c: 'C' };
      showToast(`Switched to ${langNames[lang]}`, 'info');

      // Trigger guide message on language change
      const text = `Ah, switching to ${langNames[lang]}! A fine choice of language for solving this algorithm.`;
      const element = document.getElementById('guideTextContainer');
      if (element) {
        let heroPitch = 1.0;
        let beepPitch = 600;
        const selectedHero = HEROES.find(h => h.id === gameState.player.selectedHeroId) || HEROES[0];
        if (selectedHero) {
          if (selectedHero.stats.type === 'Mage') { heroPitch = 1.5; beepPitch = 800; }
          if (selectedHero.stats.type === 'Warrior') { heroPitch = 0.6; beepPitch = 300; }
          if (selectedHero.stats.type === 'Ranger') { heroPitch = 1.2; beepPitch = 500; }
        }
        showGuideMessage(text, heroPitch, beepPitch, element);
      }
    });
  });

  // Handle Theme Toggle
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const themeToggleIcon = document.getElementById('themeToggleIcon');
  if (btnThemeToggle && themeToggleIcon) {
    btnThemeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.dataset.theme === 'light';
      const newTheme = isLight ? 'dark' : 'light';
      document.documentElement.dataset.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      
      themeToggleIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
      
      // Dispatch custom event for Monaco editor to update
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
    });
  }
  
  // Bind Guide trigger for execution hooks
  window._showGuideMsg = (typeOrText) => {
    let text = typeOrText;
    if (currentProblem && currentProblem.guide && currentProblem.guide[typeOrText]) {
      text = currentProblem.guide[typeOrText];
    } else if (typeOrText === 'damage') {
      text = currentProblem?.guide?.damage || "Ouch! You took damage from a hazard. Check your logic and paths to avoid the traps!";
    } else if (typeOrText === 'fail') {
      text = currentProblem?.guide?.fail || "Oh no, you ran out of health and fell! Do not worry—reset the level, refine your algorithm, and try again.";
    } else if (typeOrText === 'reset') {
      text = "Resetting the editor. Let us start fresh and craft a perfect solution!";
    } else if (typeOrText === 'closeIde') {
      text = "IDE closed. You can focus on the path ahead, and open it back up when you are ready to code.";
    } else if (typeOrText === 'openIde') {
      text = "IDE opened. Let us refine the code and solve this puzzle!";
    } else if (typeOrText === 'runStart') {
      text = "Compiling and running your code... Let us see if our logic holds up in the arena!";
    } else if (typeOrText === 'runError') {
      text = "Ah, a compilation or runtime error! Check the console output below to pinpoint the issue.";
    } else if (typeOrText === 'runSuccess') {
      text = "Excellent! The code ran successfully and matched all tests. Let us submit the solution to proceed!";
    } else if (typeOrText === 'runFailTests') {
      text = "The code ran, but the tests failed. Look at the failed test details in the console or unlock a hint!";
    } else if (typeOrText === 'levelSuccess') {
      text = currentProblem?.guide?.success || "Outstanding job! You solved the puzzle and completed the level! Continue to the next challenge.";
    } else if (typeOrText === 'codeHint') {
      text = "Here is a hint to guide you on the right path.";
    }
    const element = document.getElementById('guideTextContainer');
    if (element && text) {
      // Find hero pitch if available
      let heroPitch = 1.0;
      let beepPitch = 600;
      const selectedHero = HEROES.find(h => h.id === gameState.player.selectedHeroId) || HEROES[0];
      if (selectedHero) {
        if (selectedHero.stats.type === 'Mage') { heroPitch = 1.5; beepPitch = 800; }
        if (selectedHero.stats.type === 'Warrior') { heroPitch = 0.6; beepPitch = 300; }
        if (selectedHero.stats.type === 'Ranger') { heroPitch = 1.2; beepPitch = 500; }
      }
      
      showGuideMessage(text, heroPitch, beepPitch, element);
    }
  };

  // Trigger level intro automatically
  setTimeout(() => {
    if (window._showGuideMsg) window._showGuideMsg('intro');
  }, 800);
}

function setupHintSystem(problem) {
  let currentHintIdx = 0;
  const hints = problem.hints || [];
  
  const titleEl = document.querySelector('.hint-title');
  const costEl = document.querySelector('.hint-cost');
  const textEl = document.getElementById('hintText');
  const prevBtn = document.getElementById('prevHint');
  const nextBtn = document.getElementById('nextHint');
  
  function updateHintDisplay() {
    if (hints.length === 0) return;
    const hint = hints[currentHintIdx];
    
    titleEl.innerHTML = `💡 HINT (${currentHintIdx + 1}/${hints.length})`;
    
    if (currentHintIdx <= currentHintsUsed) {
      // Already unlocked
      costEl.innerHTML = 'Unlocked';
      costEl.style.color = 'var(--emerald)';
      textEl.innerHTML = hint.text;
      textEl.style.filter = 'none';
    } else {
      // Locked
      costEl.innerHTML = `Cost: ${hint.cost} Mana`;
      costEl.style.color = 'var(--sapphire)';
      textEl.innerHTML = 'Click to unlock this hint.';
      textEl.style.filter = 'blur(2px)';
      textEl.style.cursor = 'pointer';
      
      textEl.onclick = () => {
        const backendLevelId = getBackendLevelId(currentWorldId, currentProblem.id);
        fetch('/api/game/buy-hint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ levelId: backendLevelId, hintIndex: currentHintIdx, cost: hint.cost })
        }).then(res => {
          if (res.ok) return res.json();
          return res.text().then(text => { throw new Error(text); });
        }).then(data => {
          if (data && data.success) {
            currentHintsUsed = currentHintIdx;
            gameState.player.hintsUsed = currentHintsUsed;
            if (data.user) {
              gameState.mapBackendUserToState(data.user);
              gameState.saveToLocalStorageOnly();
            }
            updateHintDisplay();
            
            // Update header UI
            const manaEl = document.querySelector('.mana-val');
            if (manaEl) manaEl.textContent = gameState.player.mana.toLocaleString();
            showToast(`Hint unlocked for ${hint.cost} Mana!`, 'success');
            if (window._showGuideMsg) window._showGuideMsg('codeHint');
          }
        }).catch(err => {
          showToast(err.message || 'Failed to buy hint!', 'error');
        });
      };
    }
    
    if (hints.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'block';
      nextBtn.style.display = 'block';
      prevBtn.disabled = currentHintIdx === 0;
      nextBtn.disabled = currentHintIdx === hints.length - 1;
    }
  }
  
  prevBtn.addEventListener('click', () => {
    if (currentHintIdx > 0) {
      currentHintIdx--;
      textEl.onclick = null; // clear handler
      updateHintDisplay();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentHintIdx < hints.length - 1) {
      currentHintIdx++;
      textEl.onclick = null; // clear handler
      updateHintDisplay();
    }
  });
  
  updateHintDisplay();
}

function appendToConsole(msg, type = 'info') {
  const consoleEl = document.getElementById('consoleOutput');
  const div = document.createElement('div');
  div.className = `console-line console-line--${type}`;
  div.textContent = '> ' + msg;
  consoleEl.appendChild(div);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function clearConsole() {
  const consoleEl = document.getElementById('consoleOutput');
  consoleEl.innerHTML = '';
}

function updateStackVisualizer(stackData) {
  if (sceneRenderer) {
    sceneRenderer.updateStack(stackData || []);
  }

  const viz = document.getElementById('stackViz');
  viz.innerHTML = '';
  
  if (!stackData || stackData.length === 0) {
    viz.innerHTML = '<div class="stack-empty-text">-- Empty --</div>';
    // Update TOP label
    const topLabel = document.querySelector('.stack-top-label');
    if (topLabel) topLabel.textContent = '--';
    return;
  }
  
  stackData.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'stack-item stack-item--animate';
    const isTop = index === stackData.length - 1;
    if (isTop) div.classList.add('stack-item--top');
    div.textContent = typeof item === 'object' ? JSON.stringify(item) : String(item);
    // Stagger animation delay
    div.style.animationDelay = `${index * 0.08}s`;
    viz.appendChild(div);
  });

  // Update TOP label with peek value
  const topLabel = document.querySelector('.stack-top-label');
  if (topLabel) {
    const topItem = stackData[stackData.length - 1];
    topLabel.textContent = `TOP: ${typeof topItem === 'object' ? JSON.stringify(topItem) : String(topItem)}`;
  }
}

function resetVisuals() {
  clearConsole();
  appendToConsole('Ready for execution.', 'info');
  updateStackVisualizer([]);
  
  // Reset scene state
  if (sceneRenderer) {
    sceneRenderer.isExitOpen = false;
    sceneRenderer.collectedRelics.clear();
    sceneRenderer.resetCharacter();
  }
  
  // Reset 3D character to front-facing wave idle
  const hero3DEl = document.getElementById('hero3DContainer');
  if (hero3DEl) {
    hero3DEl.style.display = 'block';
    if (hero3DEl._viewer && hero3DEl._viewer.resetIdle) {
      hero3DEl._viewer.resetIdle();
    }
  }
  
  document.getElementById('relicsCount').textContent = `0 / ${currentProblem?.relics?.length || 0}`;
  
  // Reset progress
  document.getElementById('sceneProgress').style.width = '0%';
  document.getElementById('sceneProgressText').textContent = '0%';
}

// ── Command Parser ─────────────────────────────────────────
// Parses stack operations from code execution result and builds
// a command queue for animated character movement.
function buildCommandQueue(operations, relics, canvasWidth) {
  const commands = [];
  const config = currentProblem.levelActionConfig;
  
  // Dynamic positions matching the Temple Redesign
  const peekShrineX = canvasWidth * 0.35;
  const towerX = canvasWidth * 0.50;
  const popMachineX = canvasWidth * 0.65;
  
  const usedRelicIndices = new Set();

  for (const op of operations) {
    if (op.type === 'push') {
      const itemName = op.item;
      const relicIndex = relics.findIndex((r, idx) => r.name === itemName && !usedRelicIndices.has(idx));
      
      if (relicIndex !== -1) {
        usedRelicIndices.add(relicIndex);
        const relic = relics[relicIndex];
        const targetX = (relic.x / 100) * canvasWidth;
        // Walk to relic
        commands.push({ type: 'MOVE_TO', targetX, label: itemName });
        commands.push({ type: 'WAIT', frames: 10 });
        commands.push({ type: 'PICKUP', item: itemName, itemId: relic.id || relic.name });
      }
      
      // Walk to Stack Tower
      commands.push({ type: 'MOVE_TO', targetX: towerX, label: 'stack_tower' });
      commands.push({ type: 'WAIT', frames: 5 });
      
      // Console log
      commands.push({ 
        type: 'EXECUTE_CALLBACK', 
        callback: () => appendToConsole(`push(${JSON.stringify(itemName)})`, 'info')
      });
      
      // Insert into physical stack
      commands.push({ type: 'INSERT_STACK', item: itemName });
      
    } else if (op.type === 'pop') {
      // Walk to Pop Machine
      commands.push({ type: 'MOVE_TO', targetX: popMachineX, label: 'pop_machine' });
      commands.push({ type: 'WAIT', frames: 5 });
      
      // Console log
      commands.push({ 
        type: 'EXECUTE_CALLBACK', 
        callback: () => appendToConsole(`pop() → ${JSON.stringify(op.item)}`, 'warning')
      });
      
      // Pop item
      commands.push({ type: 'POP_ITEM', item: op.item });
      commands.push({ type: 'WAIT', frames: 8 });
      
    } else if (op.type === 'peek') {
      // Walk to Peek Shrine
      commands.push({ type: 'MOVE_TO', targetX: peekShrineX, label: 'peek_shrine' });
      commands.push({ type: 'WAIT', frames: 5 });
      
      // Console log
      commands.push({ 
        type: 'EXECUTE_CALLBACK', 
        callback: () => appendToConsole(`peek() → ${JSON.stringify(op.item)}`, 'info')
      });
      
      // Peek animation
      commands.push({ type: 'PEEK_ITEM', item: op.item });
    }
  }

  return commands;
}

// ── Log-based Command Builder ──────────────────────────────
// For levels that validate via console.log (arrays, strings, etc.),
// scan the output logs to find which relics were referenced and
// build character walk-and-collect commands from that.
function buildCommandsFromLogs(logs, relics, canvasWidth) {
  const commands = [];
  const homeX = canvasWidth * 0.08;
  const collectedNames = new Set();
  const config = currentProblem.levelActionConfig;

  // Custom logic for Level 2 (Two Sum Portal)
  if (currentProblem.id === 2 && currentProblem.worldId === 'arrays-strings') {
    const indices = [];
    for (const log of logs) {
      const matches = log.match(/\d+/g);
      if (matches) {
        matches.forEach(num => {
          const val = parseInt(num);
          if (val >= 0 && val < relics.length) {
            indices.push(val);
          }
        });
      }
    }
    
    // Animate checking pairs if correct answer is found to simulate code execution
    if (indices.includes(0) && indices.includes(2)) {
       // i = 0, j = 1 (simulated fail)
       commands.push({ type: 'JUMP_TO', targetX: (relics[0].x / 100) * canvasWidth, targetY: relics[0].y, waitMs: 600, label: 'check_0' });
       commands.push({ type: 'WAIT', frames: 30 }); // Stand for a second
       
       commands.push({ type: 'JUMP_TO', targetX: (relics[1].x / 100) * canvasWidth, targetY: relics[1].y, waitMs: 600, label: 'check_1' });
       commands.push({ type: 'WAIT', frames: 30 }); // Stand for a second
       
       // i = 0, j = 2 (simulated success)
       commands.push({ type: 'JUMP_TO', targetX: (relics[0].x / 100) * canvasWidth, targetY: relics[0].y, waitMs: 600, label: 'check_0' });
       commands.push({ type: 'WAIT', frames: 30 }); // Stand for a second
       
       // Collect 0
       if (config) {
          commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX: (relics[0].x / 100) * canvasWidth, item: relics[0].name, itemId: relics[0].id || relics[0].name });
       } else {
          commands.push({ type: 'PICKUP', item: relics[0].name, itemId: relics[0].id || relics[0].name });
       }
       collectedNames.add(relics[0].name);

       commands.push({ type: 'JUMP_TO', targetX: (relics[2].x / 100) * canvasWidth, targetY: relics[2].y, waitMs: 600, label: 'check_2' });
       commands.push({ type: 'WAIT', frames: 30 }); // Stand for a second
       
       // Collect 2
       if (config) {
          commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX: (relics[2].x / 100) * canvasWidth, item: relics[2].name, itemId: relics[2].id || relics[2].name });
       } else {
          commands.push({ type: 'PICKUP', item: relics[2].name, itemId: relics[2].id || relics[2].name });
       }
       collectedNames.add(relics[2].name);
    }

    // Fallback for any other indices logged that weren't collected yet
    indices.forEach(idx => {
      const relic = relics[idx];
      if (relic && !collectedNames.has(relic.name)) {
        collectedNames.add(relic.name);
        const targetX = (relic.x / 100) * canvasWidth;
        commands.push({ type: 'JUMP_TO', targetX, targetY: relic.y, waitMs: 600, label: relic.name });
        commands.push({ type: 'WAIT', frames: 30 }); // Stand for a second
        if (config) {
          commands.push({
            type: 'USE_TOOL',
            tool: config.requiredTool,
            animation: config.actionAnimation,
            effect: config.successEffect,
            targetX,
            item: relic.name,
            itemId: relic.id || relic.name
          });
        } else {
          commands.push({ type: 'PICKUP', item: relic.name, itemId: relic.id || relic.name });
        }
      }
    });
    
    return commands;
  }

    // Custom logic for Level 3 (Sliding Window Chests)
    if (currentProblem.id === 3 && currentProblem.worldId === 'arrays-strings') {
      const hasMaxSum = logs.some(l => l.includes('15'));
      if (hasMaxSum) {
        const targetIndices = [1, 2, 3];
        targetIndices.forEach(idx => {
          const relic = relics[idx];
          if (!collectedNames.has(relic.name)) {
            collectedNames.add(relic.name);
            const targetX = (relic.x / 100) * canvasWidth;
            commands.push({ type: 'JUMP_TO', targetX, targetY: relic.y, waitMs: 600, label: relic.name });
            commands.push({ type: 'WAIT', frames: 30 });
            if (config) {
              commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX, item: relic.name, itemId: relic.id || relic.name });
            } else {
              commands.push({ type: 'PICKUP', item: relic.name, itemId: relic.id || relic.name });
            }
          }
        });
        return commands;
      }
    }

    // Custom logic for Level 4 (Mirror Shield Palindrome)
    if (currentProblem.id === 4 && currentProblem.worldId === 'arrays-strings') {
      const isPalindrome = logs.some(l => l.includes('YES'));
      if (isPalindrome) {
        const order = [0, 4, 1, 3, 2];
        order.forEach(idx => {
          commands.push({ type: 'JUMP_TO', targetX: (relics[idx].x / 100) * canvasWidth, waitMs: 600, label: relics[idx].name });
          commands.push({ type: 'WAIT', frames: 20 });
        });
        order.forEach(idx => {
          const relic = relics[idx];
          if (!collectedNames.has(relic.name)) {
             collectedNames.add(relic.name);
             commands.push({ type: 'JUMP_TO', targetX: (relic.x / 100) * canvasWidth, waitMs: 400 });
             commands.push({ type: 'WAIT', frames: 10 });
             if (config) commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX: (relic.x / 100) * canvasWidth, item: relic.name, itemId: relic.id || relic.name });
             else commands.push({ type: 'PICKUP', item: relic.name, itemId: relic.id || relic.name });
          }
        });
        return commands;
      }
    }

    // Custom logic for Level 5 (Anagram Runes)
    if (currentProblem.id === 5 && currentProblem.worldId === 'arrays-strings') {
      const isAnagram = logs.some(l => l.toUpperCase().includes('TRUE'));
      if (isAnagram) {
        // Inspect LISTEN
        commands.push({ type: 'JUMP_TO', targetX: (relics[0].x / 100) * canvasWidth, targetY: relics[0].y, waitMs: 600, label: 'check_0' });
        commands.push({ type: 'WAIT', frames: 40 });
        // Inspect SILENT
        commands.push({ type: 'JUMP_TO', targetX: (relics[1].x / 100) * canvasWidth, targetY: relics[1].y, waitMs: 600, label: 'check_1' });
        commands.push({ type: 'WAIT', frames: 40 });
        
        // Collect Both
        [0, 1].forEach(idx => {
          const relic = relics[idx];
          if (!collectedNames.has(relic.name)) {
             collectedNames.add(relic.name);
             commands.push({ type: 'JUMP_TO', targetX: (relic.x / 100) * canvasWidth, targetY: relic.y, waitMs: 400 });
             commands.push({ type: 'WAIT', frames: 10 });
             if (config) commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX: (relic.x / 100) * canvasWidth, targetY: relic.y, item: relic.name, itemId: relic.id || relic.name });
             else commands.push({ type: 'PICKUP', item: relic.name, itemId: relic.id || relic.name });
          }
        });
        return commands;
      }
    }

    // Custom logic for Level 6 (Purging Duplicates)
    if (currentProblem.id === 6 && currentProblem.worldId === 'arrays-strings') {
      const hasAll = logs.join(' ').includes('1') && logs.join(' ').includes('3');
      if (hasAll) {
        [0, 1, 2, 3].forEach(idx => {
           const relic = relics[idx];
           commands.push({ type: 'JUMP_TO', targetX: (relic.x / 100) * canvasWidth, waitMs: 500, label: 'check_' + idx });
           commands.push({ type: 'WAIT', frames: 20 });
           // Index 2 is the duplicate '2'
           if (idx !== 2) {
             collectedNames.add(relic.name);
             if (config) commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX: (relic.x / 100) * canvasWidth, item: relic.name, itemId: relic.id || relic.name });
             else commands.push({ type: 'PICKUP', item: relic.name, itemId: relic.id || relic.name });
           }
        });
        return commands;
      }
    }

    // Custom logic for Level 7 (Heaviest Stone)
    if (currentProblem.id === 7 && currentProblem.worldId === 'arrays-strings') {
      const foundMax = logs.some(l => l.includes('42'));
      if (foundMax) {
        [0, 1, 2, 1].forEach((idx, i) => {
           const relic = relics[idx];
           commands.push({ type: 'JUMP_TO', targetX: (relic.x / 100) * canvasWidth, waitMs: 600, label: 'check_' + idx });
           commands.push({ type: 'WAIT', frames: 30 });
           if (i === 3) {
             collectedNames.add(relic.name);
             if (config) commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX: (relic.x / 100) * canvasWidth, item: relic.name, itemId: relic.id || relic.name });
             else commands.push({ type: 'PICKUP', item: relic.name, itemId: relic.id || relic.name });
           }
        });
        return commands;
      }
    }

    // Custom logic for Level 8 (Reversing the Row)
    if (currentProblem.id === 8 && currentProblem.worldId === 'arrays-strings') {
      const isReversed = logs.join(' ').includes('TULIP');
      if (isReversed) {
        [2, 1, 0].forEach(idx => {
           const relic = relics[idx];
           commands.push({ type: 'JUMP_TO', targetX: (relic.x / 100) * canvasWidth, waitMs: 600 });
           commands.push({ type: 'WAIT', frames: 20 });
           collectedNames.add(relic.name);
           if (config) commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX: (relic.x / 100) * canvasWidth, item: relic.name, itemId: relic.id || relic.name });
           else commands.push({ type: 'PICKUP', item: relic.name, itemId: relic.id || relic.name });
        });
        return commands;
      }
    }

    // Custom logic for Level 9 (Missing Number)
    if (currentProblem.id === 9 && currentProblem.worldId === 'arrays-strings') {
      const foundMissing = logs.some(l => l.includes('3'));
      if (foundMissing) {
        [0, 1].forEach(idx => {
           const relic = relics[idx];
           commands.push({ type: 'JUMP_TO', targetX: (relic.x / 100) * canvasWidth, waitMs: 500 });
           commands.push({ type: 'WAIT', frames: 20 });
           collectedNames.add(relic.name);
           if (config) commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX: (relic.x / 100) * canvasWidth, item: relic.name, itemId: relic.id || relic.name });
           else commands.push({ type: 'PICKUP', item: relic.name, itemId: relic.id || relic.name });
        });
        // Jump to empty space to reveal missing artifact 3
        const emptyX = (80 / 100) * canvasWidth;
        commands.push({ type: 'JUMP_TO', targetX: emptyX, waitMs: 600 });
        commands.push({ type: 'WAIT', frames: 40 });
        if (config) commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX: emptyX, item: '3', itemId: '3' });
        return commands;
      }
    }

    // Custom logic for Level 10 (Longest Substring)
    if (currentProblem.id === 10 && currentProblem.worldId === 'arrays-strings') {
      const foundLength = logs.some(l => l.includes('3'));
      if (foundLength) {
        [0, 1, 2, 3].forEach((idx, i) => {
           const relic = relics[idx];
           commands.push({ type: 'JUMP_TO', targetX: (relic.x / 100) * canvasWidth, waitMs: 500 });
           commands.push({ type: 'WAIT', frames: i === 3 ? 60 : 20 });
           if (i < 3) {
             collectedNames.add(relic.name + '_' + i); // force unique collection
             if (config) commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX: (relic.x / 100) * canvasWidth, item: relic.name, itemId: relic.id || relic.name });
             else commands.push({ type: 'PICKUP', item: relic.name, itemId: relic.id || relic.name });
           }
        });
        return commands;
      }
    }

    // Find all matches with their positions in the log to preserve printing order
    const matches = [];
    logs.forEach((log, logIdx) => {
      relics.forEach(relic => {
        let startPos = 0;
        while (true) {
          const idx = log.indexOf(relic.name, startPos);
          if (idx === -1) break;
          matches.push({ relic, logIdx, charIdx: idx });
          startPos = idx + relic.name.length;
        }
      });
    });

    matches.sort((a, b) => {
      if (a.logIdx !== b.logIdx) return a.logIdx - b.logIdx;
      return a.charIdx - b.charIdx;
    });

    for (const match of matches) {
      const relic = match.relic;
      if (!collectedNames.has(relic.name)) {
        collectedNames.add(relic.name);
        const targetX = (relic.x / 100) * canvasWidth;
        commands.push({ type: 'JUMP_TO', targetX, targetY: relic.y, waitMs: 600, label: relic.name });
        commands.push({ type: 'WAIT', frames: 30 });
        if (config) {
          commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX, item: relic.name, itemId: relic.id || relic.name });
        } else {
          commands.push({ type: 'PICKUP', item: relic.name, itemId: relic.id || relic.name });
        }
      }
    }

    if (commands.length === 0 && relics.length > 0) {
      const firstRelic = relics[0];
      const targetX = (firstRelic.x / 100) * canvasWidth;
      commands.push({ type: 'JUMP_TO', targetX, targetY: firstRelic.y, waitMs: 600, label: firstRelic.name });
      commands.push({ type: 'WAIT', frames: 30 });
      if (config) {
        commands.push({ type: 'USE_TOOL', tool: config.requiredTool, animation: config.actionAnimation, effect: config.successEffect, targetX, item: firstRelic.name });
      } else {
        commands.push({ type: 'PICKUP', item: firstRelic.name });
      }
    }

    return commands;
  }

// ── Animated Execution with Validation (▶ RUN button) ──────
function runAnimatedExecution(result, isLevelPassed, validationCommands = []) {
  if (!sceneRenderer) {
    // No scene renderer — just update visuals instantly
    if (result.stack) {
      updateStackVisualizer(result.stack.getItems());
    }
    updateRelicsFromLogs(result);
    isCharacterActionCompleted = true;
    if (isLevelPassed) checkLevelCompletion();
    return;
  }

  // Check for divergence (did they delete old code or change previous output?)
  let diverged = false;
  if (sceneRenderer.lastProcessedLogs) {
    const lastLogs = sceneRenderer.lastProcessedLogs;
    if (result.logs.length < lastLogs.length) diverged = true;
    else {
      for (let i = 0; i < lastLogs.length; i++) {
        if (result.logs[i] !== lastLogs[i]) {
          diverged = true;
          break;
        }
      }
    }
  }
  
  if (sceneRenderer.lastProcessedOps && !diverged) {
    const lastOps = sceneRenderer.lastProcessedOps;
    if (result.operations && result.operations.length < lastOps.length) diverged = true;
    else if (result.operations) {
      for (let i = 0; i < lastOps.length; i++) {
        if (result.operations[i].type !== lastOps[i].type || result.operations[i].item !== lastOps[i].item) {
          diverged = true;
          break;
        }
      }
    }
  }

  if (diverged) {
    resetVisuals();
  }

  const relics = currentProblem.relics || [];
  const canvasWidth = sceneRenderer.canvas.width;
  let commands = [];
  
  const opStartIndex = (sceneRenderer.lastProcessedOps && !diverged) ? sceneRenderer.lastProcessedOps.length : 0;
  const logStartIndex = (sceneRenderer.lastProcessedLogs && !diverged) ? sceneRenderer.lastProcessedLogs.length : 0;

  // Prefer stack-operation-based commands (for stack/queue levels)
  if (result.operations && result.operations.length > opStartIndex) {
    const newOps = result.operations.slice(opStartIndex);
    commands = buildCommandQueue(newOps, relics, canvasWidth);
  }

  // Fallback: build commands from console log output (for array/string levels)
  if (commands.length === 0 && result.logs && result.logs.length > logStartIndex) {
    const newLogs = result.logs.slice(logStartIndex);
    commands = buildCommandsFromLogs(newLogs, relics, canvasWidth);
  }
  
  sceneRenderer.lastProcessedLogs = [...result.logs];
  if (result.operations) sceneRenderer.lastProcessedOps = [...result.operations];

  // Append door entry commands if validation passed
  if (isLevelPassed) {
    // Automatically walk to the door and enter
    commands.push({ type: 'MOVE_TO', targetX: canvasWidth * 0.82, label: 'exit_door' });
    commands.push({ type: 'WAIT', frames: 10 });
    commands.push({ type: 'ENTER_DOOR' });
    latestExecutionResult = result;
  } else if (validationCommands && validationCommands.length > 0) {
    // Append failure commands (like hazards and damage)
    commands.push(...validationCommands);
  }

  if (commands.length === 0) {
    // Still nothing — just mark complete instantly
    updateRelicsFromLogs(result);
    isCharacterActionCompleted = true;
    if (isLevelPassed) {
      checkLevelCompletion();
      if (window._showGuideMsg) window._showGuideMsg('successMessage');
    } else {
      if (window._showGuideMsg) window._showGuideMsg('errorHint');
    }
    return;
  }

  appendToConsole('Executing commands...', 'info');

  sceneRenderer.onDoorEnter = () => {
    levelProgress = 100;
    document.getElementById('sceneProgress').style.width = `${levelProgress}%`;
    document.getElementById('sceneProgressText').textContent = `${levelProgress}%`;
    checkLevelCompletion();
  };

  // Enqueue commands and mark completion when done
  sceneRenderer.enqueueCommands(commands, () => {
    appendToConsole(`Execution completed in ${result.executionTime}ms`, 'success');
    updateRelicsFromLogs(result);
    isCharacterActionCompleted = true;
    
    if (isLevelPassed) {
      // Smooth progress update at the end
      levelProgress = 100;
      document.getElementById('sceneProgress').style.width = `${levelProgress}%`;
      document.getElementById('sceneProgressText').textContent = `${levelProgress}%`;
      checkLevelCompletion();
      
      if (window._showGuideMsg) window._showGuideMsg('successMessage');
    } else {
      // Re-trigger progress UI based on collected relics, NOT 100%
      document.getElementById('sceneProgress').style.width = `${levelProgress}%`;
      document.getElementById('sceneProgressText').textContent = `${levelProgress}%`;
      
      if (window._showGuideMsg) window._showGuideMsg('errorHint');
    }
  });
}

// ── Update relics and progress from logs (for non-stack levels) ──
function updateRelicsFromLogs(result) {
  if (!currentProblem.relics) {
    isRelicCollected = true;
    levelProgress = 100;
    return;
  }

  const logs = result.logs || [];
  const stackItems = result.stack ? result.stack.getItems() : [];
  let collected = 0;

  // Custom logic for Level 2 (Two Sum Portal)
  if (currentProblem.id === 2 && currentProblem.worldId === 'arrays-strings') {
    const indices = [];
    for (const log of logs) {
      const matches = log.match(/\d+/g);
      if (matches) {
        matches.forEach(num => {
          const val = parseInt(num);
          if (val >= 0 && val < currentProblem.relics.length) {
            indices.push(val);
          }
        });
      }
    }
    currentProblem.relics.forEach((relic, idx) => {
      if (indices.includes(idx)) {
        if (sceneRenderer) sceneRenderer.collectRelic(relic.id || relic.name);
        collected++;
      }
    });
  }
  // Custom logic for Level 3 (Sliding Window Chests)
  else if (currentProblem.id === 3 && currentProblem.worldId === 'arrays-strings') {
    const hasMaxSum = logs.some(l => l.includes('15'));
    if (hasMaxSum) {
      const targetIndices = [1, 2, 3];
      currentProblem.relics.forEach((relic, idx) => {
        if (targetIndices.includes(idx)) {
          if (sceneRenderer) sceneRenderer.collectRelic(relic.id || relic.name);
          collected++;
        }
      });
    }
  }
  // General logic
  else {
    currentProblem.relics.forEach(relic => {
      const inStack = stackItems.includes(relic.name);
      const inLogs = logs.some(l => l.includes(relic.name));

      if (inStack || inLogs) {
        if (sceneRenderer) sceneRenderer.collectRelic(relic.id || relic.name);
        collected++;
      }
    });
  }

  // If nothing matched but validation passed, count first relic
  if (collected === 0 && currentProblem.relics.length > 0) {
    if (sceneRenderer) sceneRenderer.collectRelic(currentProblem.relics[0].id || currentProblem.relics[0].name);
    collected = 1;
  }

  document.getElementById('relicsCount').textContent = `${collected} / ${currentProblem.relics?.length || 0}`;

  isRelicCollected = (collected > 0) || (currentProblem.relics.length === 0);
}

// ── RUN Handler ────────────────────────────────────────────
function handleRun() {
  if (!editor || !currentProblem) {
    if (!editor) showToast('Editor is still loading, please wait...', 'warning');
    return;
  }
  
  const code = editor.getValue();
  
  appendToConsole(`Compiling (${currentLanguage.toUpperCase()})...`, 'info');
  if (window._showGuideMsg) {
    window._showGuideMsg('runStart');
  }
  
  setTimeout(() => {
    try {
      const result = executeCode(code, { language: currentLanguage });
      
      // Output logs
      if (result.logs.length > 0) {
        result.logs.forEach(log => {
          if (log.startsWith('ERROR:')) appendToConsole(log.substring(6), 'error');
          else if (log.startsWith('WARN:')) appendToConsole(log.substring(5), 'warning');
          else if (log.startsWith('INFO:')) appendToConsole(log.substring(5), 'info');
          else appendToConsole(log, 'info');
        });
      }
      
      if (result.errors.length > 0 && !result.logs.some(l => l.startsWith('ERROR:'))) {
        result.errors.forEach(err => appendToConsole(err, 'error'));
      }
      
      if (!result.success) {
        appendToConsole('❌ Execution failed due to error.', 'error');
        showToast('Runtime error! Check console.', 'error');
        if (window._showGuideMsg) {
          window._showGuideMsg('runError');
        }
        return;
      }
      
      appendToConsole(`Execution completed in ${result.executionTime}ms`, 'info');
      
	  // Validate the solution
	  let validation = validateSolution(currentProblem, result);

	  isCodeCorrect = validation.passed;

	  // Log this attempt to the backend so admins can see submission history
	  try {
	    const backendLevelId = getBackendLevelId(currentWorldId, currentProblem.id);
	    console.log('📤 Sending submission to backend:', {
	      levelId: backendLevelId,
	      language: currentLanguage,
	      status: validation.passed ? 'PASSED' : 'FAILED'
	    });
	    
	    fetch('/api/game/log-submission', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify({
	        levelId: backendLevelId,
	        language: currentLanguage,
	        code: code,
	        status: validation.passed ? 'PASSED' : 'FAILED'
	      })
	    })
	    .then(resp => {
	      console.log('✅ Backend response status:', resp.status);
	      return resp.json();
	    })
	    .then(data => console.log('✅ Backend response:', data))
	    .catch(err => console.error('❌ Submission logging error:', err));
	  } catch (logErr) {
	    console.error('❌ Error preparing submission log:', logErr);
	  }

	  // Trigger in-game action from execution results
	  runAnimatedExecution(result, validation.passed, validation.commands);
      // Log this attempt to the backend so admins can see submission history
      try {
        const backendLevelId = getBackendLevelId(currentWorldId, currentProblem.id);
        console.log('📤 Sending submission to backend:', {
          levelId: backendLevelId,
          language: currentLanguage,
          status: validation.passed ? 'PASSED' : 'FAILED'
        });
        
        fetch('/api/game/log-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            levelId: backendLevelId,
            language: currentLanguage,
            code: code,
            status: validation.passed ? 'PASSED' : 'FAILED'
          })
        })
        .then(resp => {
          console.log('✅ Backend response status:', resp.status);
          return resp.json();
        })
        .then(data => console.log('✅ Backend response:', data))
        .catch(err => console.error('❌ Submission logging error:', err));
      } catch (logErr) {
        console.error('❌ Error preparing submission log:', logErr);
      }
      
      // Trigger in-game action from execution results
      runAnimatedExecution(result, validation.passed, validation.commands);

      if (!validation.passed) {
        currentErrorCount++;
        // Wrong output — show error
        appendToConsole('============================', 'error');
        appendToConsole('❌ Test Failed!', 'error');
        appendToConsole(validation.message, 'warning');
        showToast('Tests failed. Check console for hints.', 'error');
        
        // Still show stack state for debugging
        if (result.stack) {
          updateStackVisualizer(result.stack.getItems());
        }
        if (window._showGuideMsg) {
          window._showGuideMsg('runFailTests');
        }
      } else {
        if (window._showGuideMsg) {
          window._showGuideMsg('runSuccess');
        }
      }
    } catch (err) {
      currentErrorCount++;
      appendToConsole(`System Error: ${err.message}`, 'error');
      if (window._showGuideMsg) {
        window._showGuideMsg('runError');
      }
    }
  }, 300);
}

// ── SUBMIT Handler ─────────────────────────────────────────
function handleSubmit() {
  if (!isCodeCorrect || !isCharacterActionCompleted || !isRelicCollected || levelProgress !== 100) {
    showToast('Complete all level objectives first!', 'warning');
    return;
  }
  
  handleSuccess();
}

// ── Level Complete ─────────────────────────────────────────
function handleSuccess() {
  try {
    if (levelCompleteShown) return;
    levelCompleteShown = true;
    
    if (window._showGuideMsg) {
      window._showGuideMsg('levelSuccess');
    }

    const isReplay = gameState.getLevelProgress(currentProblem.worldId, currentProblem.id).completed;
    
    // Calculate Rewards using the new engine with actual execution time and operations
    const resultToUse = latestExecutionResult || { operations: sceneRenderer ? sceneRenderer.lastProcessedOps : [], executionTime: 0 };
    const rewards = calculateRewards(currentProblem, resultToUse, currentHintsUsed, currentErrorCount, isReplay);
  
  // Update Game State
  gameState.completeLevel(currentProblem.worldId, currentProblem.id, rewards.stars);
  if (rewards.gold > 0) gameState.addGold(rewards.gold);
  if (rewards.mana > 0) gameState.addMana(rewards.mana);
  if (rewards.gems > 0) gameState.addGems(rewards.gems);
  
  // Immediately update Header UI
  const goldEl = document.querySelector('.gold-val');
  if (goldEl) goldEl.textContent = gameState.player.gold.toLocaleString();
  const manaEl = document.querySelector('.mana-val');
  if (manaEl) manaEl.textContent = gameState.player.mana.toLocaleString();
  const gemsEl = document.querySelector('.gems-val');
  if (gemsEl) gemsEl.textContent = gameState.player.gems.toLocaleString();
  
  if (sceneRenderer) sceneRenderer.openExit();
  document.getElementById('sceneProgress').style.width = '100%';
  document.getElementById('sceneProgressText').textContent = '100%';
  appendToConsole('============================', 'success');
  appendToConsole('🏆 LEVEL COMPLETE!', 'success');
  
  // Show Success Overlay
  setTimeout(() => {
    console.log("handleSuccess: setTimeout fired, creating overlay...");
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.style.display = 'flex';
    
    // Group rewards by frame for the shelves
    const rewardFrames = [];
    if (rewards.gold > 0) rewardFrames.push({ type: 'Gold', amount: rewards.gold, icon: '🪙' });
    if (rewards.mana > 0) rewardFrames.push({ type: 'Mana', amount: rewards.mana, icon: '💎' });
    if (rewards.gems > 0) rewardFrames.push({ type: 'Gems', amount: rewards.gems, icon: '♦' });
    
    let framesHtml = rewardFrames.map((r, i) => `
      <div class="wood-reward-frame" style="opacity: 0; animation: reward-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${1 + (i * 0.2)}s;">
        <div class="wood-reward-icon">${r.icon}</div>
        <div class="wood-reward-ribbon">+${r.amount} ${r.type}</div>
      </div>
    `).join('');
    
    const starsHtml = Array(3).fill(0).map((_, i) => {
      const isEarned = i < rewards.stars;
      const delay = 0.5 + (i * 0.15);
      return `<div class="success-star ${isEarned ? 'star--filled' : 'star--empty'}" style="opacity: 0; animation: star-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${delay}s;">★</div>`;
    }).join('');

    overlay.innerHTML = `
      <div class="wood-modal">
        <!-- Chains -->
        <div class="wood-chain wood-chain-left"></div>
        <div class="wood-chain wood-chain-right"></div>
        
        <!-- Main Board -->
        <div class="wood-board">
          <!-- Close Button -->
          <button class="wood-close-btn" id="btnWoodClose">✖</button>
          
          <!-- Victory Banner -->
          <div class="wood-victory-banner">
            <h1 class="wood-victory-text">VICTORY</h1>
          </div>
          
          <!-- Top Shelf (Stars) -->
          <div class="wood-shelf">
            <div class="success-stars" style="margin-top: -10px;">
              ${starsHtml}
            </div>
            <div class="wood-shelf-ledge"></div>
          </div>
          
          <!-- Middle Shelf (Rewards) -->
          <div class="wood-shelf">
            <div class="wood-reward-container">
              ${framesHtml}
            </div>
            <div class="wood-shelf-ledge"></div>
            <div class="wood-shelf-text">YOU COMPLETED ${currentProblem.title.toUpperCase()}!</div>
          </div>
          
          <!-- Bottom Section (Breakdown / Actions) -->
          <div class="wood-footer">
            <div class="wood-footer-stats">
              <div class="wood-stat-box">
                <span class="wood-stat-icon">📈</span>
                <div class="wood-stat-info">
                  <div class="wood-stat-value">+${rewards.gold + rewards.mana}</div>
                  <div class="wood-stat-label">TOTAL SCORE</div>
                </div>
              </div>
              <div class="wood-stat-box">
                <span class="wood-stat-icon">♦</span>
                <div class="wood-stat-info">
                  <div class="wood-stat-value">+${rewards.gems}</div>
                  <div class="wood-stat-label">GEMS GAINED</div>
                </div>
              </div>
            </div>
            
            <div class="wood-actions">
              <button class="wood-btn wood-btn-gray" id="btnBackToMap">BACK TO MAP</button>
              <button class="wood-btn wood-btn-gray" id="btnReplayLevel" style="background-color: #d2b48c; color: #3e2723; border-color: #8b5a2b; box-shadow: 0 4px 0 #8b5a2b, inset 0 0 10px rgba(255,255,255,0.2);">REPLAY</button>
              <button class="wood-btn wood-btn-green" id="btnNextLevel">CONTINUE</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    console.log("handleSuccess: OVERLAY APPENDED TO DOM SUCCESSFULLY!");
    
    document.getElementById('btnBackToMap').addEventListener('click', () => {
      overlay.remove();
      window.location.hash = '#/';
    });
    document.getElementById('btnWoodClose').addEventListener('click', () => {
      overlay.remove();
    });
    document.getElementById('btnNextLevel').addEventListener('click', () => {
      overlay.remove();
      // Go to next level if exists
      window.location.hash = `#/problem/${currentProblem.worldId}/${currentProblem.id + 1}`;
    });
    document.getElementById('btnReplayLevel').addEventListener('click', () => {
      overlay.remove();
      levelCompleteShown = false;
      resetVisuals();
      disableSubmitButton();
    });
    
  }, 1000);
  } catch(error) {
    showToast("handleSuccess error: " + error.message, 'error');
  }
}

export function destroyProblemView() {
  if (sceneRenderer) {
    sceneRenderer.stop();
    sceneRenderer = null;
  }
}