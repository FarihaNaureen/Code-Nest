// ============================================================
// CODE NEST — Game State & Data
// All worlds, problems, and persistent state management
// ============================================================

import { arrayProblems } from './problems/arrays.js';
import { stackProblems } from './problems/stacks.js';
import { linkedListProblems } from './problems/linkedLists.js';
import { treeProblems } from './problems/trees.js';

// --- TESTING FLAG ---
// Set to true to unlock all maps and levels for testing/previewing.
// This DOES NOT overwrite actual user progress or mark levels as completed.
// Set to false to restore strict original progression.
export const PREVIEW_UNLOCK_ALL_LEVELS = false;

// ── Game State Manager ──────────────────────────────────────
const STORAGE_KEY = 'codeNest_gameState';

const DEFAULT_STATE = {
  player: {
    name: 'Adventurer',
    selectedHeroId: 'anya',
    gold: 1250,
    mana: 45,
    gems: 8,
    xp: 350,
    level: 5,
    streak: 3,
    lastPlayed: null,
    hintsUsed: 0,
    maxHp: 5,
    currentHp: 5,
    role: 'USER',
  },
  progress: {
    'arrays-strings': {
      unlocked: true,
      levels: {
        1: { completed: false, stars: 0 },
        2: { completed: false, stars: 0 },
        3: { completed: false, stars: 0 },
        4: { completed: false, stars: 0 },
        5: { completed: false, stars: 0 },
        6: { completed: false, stars: 0 },
        7: { completed: false, stars: 0 },
        8: { completed: false, stars: 0 },
        9: { completed: false, stars: 0 },
        10: { completed: false, stars: 0 },
      }
    },
    'stacks-queues': {
      unlocked: true,
      levels: {
        1: { completed: false, stars: 0 },
        2: { completed: false, stars: 0 },
        3: { completed: false, stars: 0 },
        4: { completed: false, stars: 0 },
        5: { completed: false, stars: 0 },
        6: { completed: false, stars: 0 },
        7: { completed: false, stars: 0 },
        8: { completed: false, stars: 0 },
        9: { completed: false, stars: 0 },
        10: { completed: false, stars: 0 },
      }
    },
    'linked-lists': {
      unlocked: true,
      levels: {
        1: { completed: false, stars: 0 },
        2: { completed: false, stars: 0 },
        3: { completed: false, stars: 0 },
        4: { completed: false, stars: 0 },
        5: { completed: false, stars: 0 },
        6: { completed: false, stars: 0 },
        7: { completed: false, stars: 0 },
        8: { completed: false, stars: 0 },
        9: { completed: false, stars: 0 },
        10: { completed: false, stars: 0 },
      }
    },
    'trees-graphs': {
      unlocked: true,
      levels: {
        1: { completed: false, stars: 0 },
        2: { completed: false, stars: 0 },
        3: { completed: false, stars: 0 },
        4: { completed: false, stars: 0 },
        5: { completed: false, stars: 0 },
        6: { completed: false, stars: 0 },
        7: { completed: false, stars: 0 },
        8: { completed: false, stars: 0 },
        9: { completed: false, stars: 0 },
        10: { completed: false, stars: 0 },
      }
    },
  },
  achievements: ['first_steps'],
  settings: {
    mapTheme: 'night'
  }
};

class GameState {
  constructor() {
    this.state = this.load();
    this.listeners = [];
  }

  load() {
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Ensure all worlds exist in saved state (migration)
          for (const worldId of Object.keys(DEFAULT_STATE.progress)) {
            if (!parsed.progress[worldId]) {
              parsed.progress[worldId] = JSON.parse(JSON.stringify(DEFAULT_STATE.progress[worldId]));
            }
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load game state:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  setMapTheme(theme) {
    if (!this.state.settings) {
      this.state.settings = { mapTheme: 'night' };
    }
    this.state.settings.mapTheme = theme;
    this.save();
  }

  save() {
    this.saveToLocalStorageOnly();
  }

  saveToLocalStorageOnly() {
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('Failed to save game state to local storage:', e);
    }
    this.listeners.forEach(fn => fn(this.state));
  }

  async syncWithBackend() {
    try {
      const res = await fetch('/api/game/progress');
      if (res.status === 401) {
        window.location.href = '/auth/login';
        return;
      }
      if (res.ok) {
        const user = await res.json();
        this.mapBackendUserToState(user);
        this.saveToLocalStorageOnly();
      }
    } catch (e) {
      console.warn('Failed to sync game state with backend:', e);
    }
  }

  mapBackendUserToState(user) {
    if (!user) return;
    this.state.player.name = user.fullName || user.username || 'Adventurer';
    this.state.player.role = user.role || 'USER';
    this.state.player.gold = typeof user.gold === 'number' ? user.gold : 1250;
    this.state.player.mana = typeof user.mana === 'number' ? user.mana : 45;
    this.state.player.gems = typeof user.gems === 'number' ? user.gems : 8;
    this.state.player.xp = typeof user.xp === 'number' ? user.xp : 350;
    this.state.player.streak = typeof user.streak === 'number' ? user.streak : 3;
    this.state.player.avatarDisplay = user.avatarDisplay || '/images/avatars/avatar_wizard.png';

    if (user.avatar && !user.avatar.startsWith('{') && user.avatar !== 'default_avatar.png') {
      const foundHero = HEROES.find(h => h.id === user.avatar);
      if (foundHero) {
        this.state.player.selectedHeroId = user.avatar;
      }
    }

    const worldMapping = {
      'world_1': 'arrays-strings',
      'world_2': 'linked-lists',
      'world_3': 'stacks-queues',
      'world_4': 'trees-graphs'
    };

    for (const [backendId, frontendId] of Object.entries(worldMapping)) {
      // All worlds are always unlocked — first level of each is playable
      this.state.progress[frontendId].unlocked = true;

      for (let lvl = 1; lvl <= 10; lvl++) {
        const levelId = `${backendId}_${lvl}`;
        const isCompleted = user.completedLevels ? user.completedLevels.includes(levelId) : false;
        const stars = user.levelStars && user.levelStars[levelId] ? user.levelStars[levelId] : 0;
        this.state.progress[frontendId].levels[lvl] = {
          completed: isCompleted,
          stars: stars
        };
      }
    }
  }

  onChange(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  get player() { return this.state.player; }
  get progress() { return this.state.progress; }

  getWorldProgress(worldId) {
    return this.state.progress[worldId] || { unlocked: false, levels: {} };
  }

  getLevelProgress(worldId, levelId) {
    const world = this.getWorldProgress(worldId);
    return world.levels[levelId] || { completed: false, stars: 0 };
  }

  getWorldCompletion(worldId) {
    const world = this.getWorldProgress(worldId);
    if (!world.unlocked) return 0;
    const levels = Object.values(world.levels);
    if (levels.length === 0) return 0;
    const completed = levels.filter(l => l.completed).length;
    return Math.round((completed / levels.length) * 100);
  }

  getCurrentLevel(worldId) {
    const world = this.getWorldProgress(worldId);
    if (!world.unlocked) return null;
    for (let i = 1; i <= 10; i++) {
      if (!world.levels[i] || !world.levels[i].completed) return i;
    }
    return 10; // All completed
  }

  setSelectedHero(heroId) {
    this.state.player.selectedHeroId = heroId;
    this.saveToLocalStorageOnly();
    fetch('/api/game/profile/avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatar: heroId })
    }).then(res => {
      if (res.ok) return res.json();
    }).then(user => {
      if (user) {
        this.mapBackendUserToState(user);
        this.saveToLocalStorageOnly();
      }
    }).catch(err => console.warn('Failed to save avatar to backend:', err));
  }

  completeLevel(worldId, levelId, stars) {
    if (!this.state.progress[worldId]) return;
    const existing = this.state.progress[worldId].levels[levelId];
    if (!existing || !existing.completed || stars > existing.stars) {
      this.state.progress[worldId].levels[levelId] = {
        completed: true,
        stars: Math.max(stars, existing?.stars || 0),
      };
    }
    const nextLevel = levelId + 1;
    if (nextLevel <= 10 && !this.state.progress[worldId].levels[nextLevel]) {
      this.state.progress[worldId].levels[nextLevel] = { completed: false, stars: 0 };
    }
    this.saveToLocalStorageOnly();

    const backendLevelId = getBackendLevelId(worldId, levelId);
    fetch('/api/game/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ levelId: backendLevelId, stars: stars })
    }).then(res => {
      if (res.ok) return res.json();
    }).then(data => {
      if (data && data.user) {
        this.mapBackendUserToState(data.user);
        this.saveToLocalStorageOnly();
      }
    }).catch(err => console.warn('Failed to save completion to backend:', err));
  }

  addGold(amount) {
    this.state.player.gold += amount;
    this.save();
  }

  addMana(amount) {
    this.state.player.mana += amount;
    this.save();
  }

  addGems(amount) {
    this.state.player.gems += amount;
    this.save();
  }

  spendMana(amount) {
    if (this.state.player.mana >= amount) {
      this.state.player.mana -= amount;
      this.save();
      return true;
    }
    return false;
  }

  takeDamage(amount) {
    this.state.player.currentHp = Math.max(0, this.state.player.currentHp - amount);
    this.save();
    return this.state.player.currentHp;
  }

  heal(amount) {
    this.state.player.currentHp = Math.min(this.state.player.maxHp, this.state.player.currentHp + amount);
    this.save();
    return this.state.player.currentHp;
  }

  resetHp() {
    this.state.player.currentHp = this.state.player.maxHp;
    this.save();
  }

  resetState() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }
}

// Singleton
export const gameState = new GameState();


// ── World Definitions ───────────────────────────────────────
export const WORLDS = [
  {
    id: 'arrays-strings',
    name: 'Arrays & Strings',
    subtitle: 'The Grid Kingdom',
    theme: 'arrays',
    description: 'Master the fundamentals of arrays and strings in the ancient Grid Kingdom.',
    lore: 'Long ago, the Grid Kingdom was built by the First Programmers who organized data into perfect rows. Now corrupted, only a true coder can restore order.',
    colors: { primary: '#2ecc71', secondary: '#27ae60' },
    position: { x: 12, y: 45 },
    decorations: ['🌾', '🏡', '🌲', '🗺️'],
  },
  {
    id: 'stacks-queues',
    name: 'Stacks & Queues',
    subtitle: 'The Cursed Vault',
    theme: 'stacks',
    description: 'Explore the mysterious Cursed Vault where LIFO and FIFO rule supreme.',
    lore: 'Deep beneath the ocean lies the Cursed Vault, where ancient relics are stacked in magical order.',
    colors: { primary: '#3498db', secondary: '#8b5cf6' },
    position: { x: 38, y: 35 },
    decorations: ['🌊', '🐚', '🪸', '🔮'],
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    subtitle: 'The Desert Chains',
    theme: 'linked',
    description: 'Traverse the Desert Chains where nodes are linked across ancient ruins.',
    lore: 'In the scorching Desert of Chains, each ruin points to the next. Break a link and the path is lost forever.',
    colors: { primary: '#f39c12', secondary: '#e67e22' },
    position: { x: 65, y: 45 },
    decorations: ['🏜️', '🏛️', '⛓️', '🐪'],
  },
  {
    id: 'trees-graphs',
    name: 'Trees & Graphs',
    subtitle: 'The Enchanted Forest',
    theme: 'trees',
    description: 'Navigate the Enchanted Forest where data grows on branching trees and tangled graphs.',
    lore: 'The ancient Forest of Branches hides secrets in its roots. Master traversal to find the path to enlightenment.',
    colors: { primary: '#10b981', secondary: '#059669' },
    position: { x: 85, y: 30 },
    decorations: ['🌳', '🌲', '🍃', '🦉'],
  },
];


// ── Problem Definitions (imported from separate files) ──────
export const PROBLEMS = {
  'arrays-strings': arrayProblems,
  'stacks-queues': stackProblems,
  'linked-lists': linkedListProblems,
  'trees-graphs': treeProblems,
};


// Map frontend worldId and levelId to backend levelId (e.g. world_1_1)
export function getBackendLevelId(worldId, levelId) {
  const mapping = {
    'arrays-strings': 'world_1',
    'linked-lists': 'world_2',
    'stacks-queues': 'world_3',
    'trees-graphs': 'world_4'
  };
  return `${mapping[worldId] || 'world_1'}_${levelId}`;
}

// Get world title for level select
export function getWorldTitle(worldId) {
  const world = WORLDS.find(w => w.id === worldId);
  if (!world) return 'Unknown World';
  return `${world.name}: ${world.subtitle}`;
}

// Get problem by world and level
export function getProblem(worldId, levelId) {
  const worldProblems = PROBLEMS[worldId];
  if (!worldProblems) return null;
  return worldProblems.find(p => p.id === levelId) || null;
}

export const HEROES = [
  {
    id: 'anya',
    name: 'Anya the Explorer',
    description: "A seasoned adventurer wearing a white shirt and red vest suspenders.",
    stats: { difficulty: 'Medium', type: 'Warrior', weapons: 'Sword & Shield', damage: 80, health: 95, speed: 50 },
    archetype: 'warrior',
    skinUrl: '/assets/warrior.png',
    outfits: ['/assets/warrior.png'],
    abilities: ['fastMining'],
    palette: { 'S': '#ffe0c2', 'H': '#2c3e50', 'W': '#ffffff', 'R': '#ff5252', 'B': '#34ace0', 'T': '#8b5a2b', 'E': '#ffffff', 'D': '#1e272e' },
    avatarStyle: { skin: '#ffe0c2', hair: '#2c3e50', shirt: '#ffffff', pants: '#34ace0', shoes: '#1e272e', design: 'suspenders', eyes: '#3d7a46' },
  },
  {
    id: 'leo',
    name: 'Leo the Trailblazer',
    description: "A curious young explorer wearing a bright green hoodie.",
    stats: { difficulty: 'Easy', type: 'Ranger', weapons: 'Scanner & Bow', damage: 70, health: 80, speed: 90 },
    archetype: 'ranger',
    skinUrl: '/assets/ranger.png',
    outfits: ['/assets/ranger.png'],
    abilities: ['doubleJump'],
    palette: { 'S': '#ffe0c2', 'H': '#5c4033', 'G': '#32ff7e', 'L': '#1b75bb', 'W': '#ffffff', 'P': '#2a2b2d', 'B': '#8b5a2b', 'T': '#1b75bb', 'E': '#ffffff', 'D': '#2a2b2d' },
    avatarStyle: { skin: '#ffe0c2', hair: '#5c4033', shirt: '#32ff7e', pants: '#8b5a2b', shoes: '#2a2b2d', design: 'hoodie', eyes: '#5c3317' },
  },
  {
    id: 'alex',
    name: 'Alex the Swift',
    description: "A confident rogue in a bright red puffy jacket.",
    stats: { difficulty: 'Hard', type: 'Rogue', weapons: 'Twin Daggers', damage: 95, health: 50, speed: 100 },
    archetype: 'rogue',
    skinUrl: '/assets/rogue.png',
    outfits: ['/assets/rogue.png'],
    abilities: [],
    palette: { 'S': '#ffe0c2', 'H': '#42281d', 'R': '#ff3838', 'W': '#dfe6e9', 'J': '#34ace0', 'Y': '#fff200', 'B': '#8b5a2b', 'E': '#ffffff', 'D': '#2c3e50' },
    avatarStyle: { skin: '#ffe0c2', hair: '#e67e22', shirt: '#ff3838', pants: '#2c3e50', shoes: '#42281d', design: 'jacket', eyes: '#8b6914' },
  },
  {
    id: 'maya',
    name: 'Maya Starborn',
    description: "A brilliant mage with a bright yellow beanie.",
    stats: { difficulty: 'Medium', type: 'Mage', weapons: 'Arcane Staff', damage: 100, health: 40, speed: 70 },
    archetype: 'mage',
    skinUrl: '/assets/mage.png',
    outfits: ['/assets/mage.png'],
    abilities: [],
    palette: { 'S': '#ffe0c2', 'H': '#784212', 'Y': '#fff200', 'B': '#17c0eb', 'O': '#ff9f1a', 'K': '#2d3436', 'T': '#ff9f1a', 'E': '#ffffff', 'D': '#2c3e50' },
    avatarStyle: { skin: '#ffe0c2', hair: '#fff200', shirt: '#17c0eb', pants: '#2c3e50', shoes: '#1e272e', design: 'robe', eyes: '#1a73b5' },
  },
  {
    id: 'kai',
    name: 'Kai the Zephyr',
    description: "A swift wind-walker in a bright cyan hoodie.",
    stats: { difficulty: 'Hard', type: 'Ranger', weapons: 'Gale Bow', damage: 85, health: 60, speed: 100 },
    archetype: 'ranger',
    skinUrl: '/assets/ranger.png',
    outfits: ['/assets/ranger.png'],
    abilities: ['doubleJump'],
    palette: { 'S': '#ffeaa7', 'H': '#2d3436', 'G': '#00d8d6', 'L': '#0984e3', 'W': '#ffffff', 'P': '#2d3436', 'B': '#2d3436', 'T': '#0984e3', 'E': '#ffffff', 'D': '#2d3436' },
    avatarStyle: { skin: '#ffeaa7', hair: '#2d3436', shirt: '#00d8d6', pants: '#2d3436', shoes: '#2d3436', design: 'hoodie', eyes: '#00d8d6' },
  },
  {
    id: 'lyra',
    name: 'Lyra Moonshadow',
    description: "An enigmatic spellcaster wearing a vivid purple robe.",
    stats: { difficulty: 'Hard', type: 'Mage', weapons: 'Lunar Staff', damage: 95, health: 45, speed: 75 },
    archetype: 'mage',
    skinUrl: '/assets/mage.png',
    outfits: ['/assets/mage.png'],
    abilities: [],
    palette: { 'S': '#ffdfc4', 'H': '#192a56', 'Y': '#9c88ff', 'B': '#cd84f1', 'O': '#9c88ff', 'K': '#192a56', 'T': '#c56cf0', 'E': '#ffffff', 'D': '#192a56' },
    avatarStyle: { skin: '#ffdfc4', hair: '#9c88ff', shirt: '#cd84f1', pants: '#192a56', shoes: '#192a56', design: 'robe', eyes: '#cd84f1' },
  },
  {
    id: 'jax',
    name: 'Jax Ironheart',
    description: "A sturdy brawler with striking yellow suspenders.",
    stats: { difficulty: 'Easy', type: 'Warrior', weapons: 'Heavy Hammer', damage: 90, health: 100, speed: 40 },
    archetype: 'warrior',
    skinUrl: '/assets/warrior.png',
    outfits: ['/assets/warrior.png'],
    abilities: ['fastMining'],
    palette: { 'S': '#ffdac1', 'H': '#d35400', 'W': '#f1f2f6', 'R': '#fffa65', 'B': '#747d8c', 'T': '#2f3542', 'E': '#ffffff', 'D': '#2f3542' },
    avatarStyle: { skin: '#ffdac1', hair: '#d35400', shirt: '#f1f2f6', pants: '#747d8c', shoes: '#2f3542', design: 'suspenders', eyes: '#c23616' },
  },
  {
    id: 'nova',
    name: 'Nova Sunstrike',
    description: "A flashy duelist in a neon pink jacket.",
    stats: { difficulty: 'Medium', type: 'Rogue', weapons: 'Energy Blades', damage: 90, health: 60, speed: 95 },
    archetype: 'rogue',
    skinUrl: '/assets/rogue.png',
    outfits: ['/assets/rogue.png'],
    abilities: [],
    palette: { 'S': '#ffb8b8', 'H': '#ffffff', 'R': '#ff9ff3', 'W': '#ffffff', 'J': '#f368e0', 'Y': '#00d2d3', 'B': '#222f3e', 'E': '#ffffff', 'D': '#222f3e' },
    avatarStyle: { skin: '#ffb8b8', hair: '#ffffff', shirt: '#ff9ff3', pants: '#222f3e', shoes: '#222f3e', design: 'jacket', eyes: '#f368e0' },
  },
  {
    id: 'finn',
    name: 'Finn Riverbrook',
    description: "An energetic gatherer with a bright lime green shirt.",
    stats: { difficulty: 'Easy', type: 'Warrior', weapons: 'Wooden Mallet', damage: 75, health: 90, speed: 60 },
    archetype: 'warrior',
    skinUrl: '/assets/warrior.png',
    outfits: ['/assets/warrior.png'],
    abilities: ['fastMining'],
    palette: { 'S': '#f8efd4', 'H': '#e1b12c', 'W': '#32ff7e', 'R': '#17c0eb', 'B': '#4b4b4b', 'T': '#2d3436', 'E': '#ffffff', 'D': '#2d3436' },
    avatarStyle: { skin: '#f8efd4', hair: '#e1b12c', shirt: '#32ff7e', pants: '#4b4b4b', shoes: '#2d3436', design: 'suspenders', eyes: '#44bd32' },
  },
  {
    id: 'aria',
    name: 'Aria Stormcaller',
    description: "A fierce elementalist in a glowing orange robe.",
    stats: { difficulty: 'Medium', type: 'Mage', weapons: 'Storm Wand', damage: 90, health: 55, speed: 80 },
    archetype: 'mage',
    skinUrl: '/assets/mage.png',
    outfits: ['/assets/mage.png'],
    abilities: [],
    palette: { 'S': '#ffeedb', 'H': '#ff3838', 'Y': '#ffaf40', 'B': '#ff9f1a', 'O': '#ff3838', 'K': '#3d3d3d', 'T': '#ff3838', 'E': '#ffffff', 'D': '#3d3d3d' },
    avatarStyle: { skin: '#ffeedb', hair: '#ff3838', shirt: '#ff9f1a', pants: '#3d3d3d', shoes: '#3d3d3d', design: 'robe', eyes: '#ff3838' },
  }
];
