// ============================================================
// CODE NEST — Pixel Art Rendering Engine
// Canvas-based pixel art for game scenes, islands, and sprites
// ============================================================

import { 
  drawLibraryScene, 
  drawDungeonScaleScene, 
  drawLaboratoryScene, 
  drawForestChasmScene, 
  drawCastleGateScene, 
  drawRitualTempleScene, 
  drawMineScene, 
  drawTreasureVaultScene, 
  drawSnowyPeakScene 
} from './stackScenes.js';
import {
  drawSunnyFarmScene,
  drawOrchardScene,
  drawQuarryScene,
  drawGardenScene,
  drawPortalChamberScene,
  drawTreasureHallScene,
  drawMirrorHallScene,
  drawRuneArchiveScene,
  drawRoyalLedgerScene,
  drawEnchantedCaveScene
} from './arrayScenes.js';
import { SPRITES, SPRITE_PALETTES, drawSpriteMatrix } from './spriteDictionary.js';
import { gameState, HEROES } from './gameData.js';

// ── Color Palettes ──────────────────────────────────────────
const PALETTES = {
  dungeon: {
    wallDark: '#0d1117',
    wallMid: '#1a2233',
    wallLight: '#263040',
    wallHighlight: '#37465c',
    floorDark: '#1e2d44',
    floorMid: '#253a54',
    floorLight: '#2f4a68',
    floorLine: '#3a5a7e',
    brickLine: '#0a0e18',
  },
  torch: {
    flame1: '#ff6b1a',
    flame2: '#ff9c33',
    flame3: '#ffcc44',
    flame4: '#ffee88',
    ember: '#ff4400',
    glow: 'rgba(255,150,50,0.15)',
  },
  character: {
    hair: '#8b5e3c',
    skin: '#f0c78a',
    eyeWhite: '#ffffff',
    eyePupil: '#2a3a5c',
    shirt: '#3d8aff',
    cape: '#2255aa',
    capeShadow: '#1a3d7a',
    pants: '#4a3b2c',
    boots: '#2c1a0c',
    outline: '#1a1a2e',
  },
  relic: {
    sapphire: '#4488ff',
    sapphireGlow: '#66aaff',
    gold: '#ffd700',
    goldGlow: '#ffee88',
    scroll: '#d4a574',
    scrollGlow: '#e8c898',
  },
  island: {
    arrays: { base: '#5a9e3e', mid: '#7bc25e', top: '#9ee080', outline: '#3a6e28', water: '#2b7ab8' },
    stacks: { base: '#b8860b', mid: '#daa520', top: '#ffd700', outline: '#8b6508', accent: '#ff8c00' },
    linked: { base: '#c89440', mid: '#e0b060', top: '#f0cc80', outline: '#8a6428', sand: '#f0e0b0' },
    locked: { base: '#8898a8', mid: '#a8b8c8', top: '#c8d8e8', outline: '#607080', cloud: '#e0e8f0' },
    trees: { base: '#1a6e3a', mid: '#2a8e4e', top: '#3aae68', outline: '#0a4e2a', bark: '#5c3d1e' },
  },
};

// ── Pixel Grid Drawing Helpers ──────────────────────────────
function drawPixel(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * size, y * size, size, size);
}

function drawPixelRow(ctx, startX, y, colors, size) {
  colors.forEach((color, i) => {
    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect((startX + i) * size, y * size, size, size);
    }
  });
}

// ── Soft Skeletal Renderer ──────────────────────────────────
function getHeroStyle(heroId) {
  let style = { skinColor: '#f5c29d', shirtColor: '#bdc3c7', pantsColor: '#7f8c8d', sleeveColor: '#bdc3c7', shoeColor: '#34495e', eyeColor: '#2c3e50', hairColor: '#34495e' };
  
  // User specifically requested dark skin, purple hair, dual scythes for the new character type reference
  // We'll apply this to 'anya' to match the uploaded reference image closely!
  if (heroId === 'anya') {
    style = { skinColor: '#8d5524', shirtColor: '#1e272e', pantsColor: '#2f3640', sleeveColor: '#1e272e', shoeColor: '#111111', eyeColor: '#e74c3c', hairColor: '#8e44ad', hat: 'crown', vest: '#c0392b' }; 
  } else if (heroId === 'leo') {
    style = { skinColor: '#f5c29d', shirtColor: '#306e43', pantsColor: '#1b75bb', sleeveColor: '#306e43', shoeColor: '#2a2b2d', eyeColor: '#5c4033', hairColor: '#5c4033', hat: 'hoodie' };
  } else if (heroId === 'alex') {
    style = { skinColor: '#f5c29d', shirtColor: '#d63031', pantsColor: '#2980b9', sleeveColor: '#d63031', shoeColor: '#2c3e50', eyeColor: '#42281d', hairColor: '#42281d', jacket: true };
  } else if (heroId === 'maya') {
    style = { skinColor: '#f5c29d', shirtColor: '#0984e3', pantsColor: '#2d3436', sleeveColor: '#0984e3', shoeColor: '#2c3e50', eyeColor: '#784212', hairColor: '#784212', hat: 'beanie' };
  }
  return style;
}

function drawLimb(ctx, skinColor, clothColor, shoeColor, scale, isLeg) {
  ctx.fillStyle = clothColor;
  ctx.beginPath(); 
  if (ctx.roundRect) ctx.roundRect(-2 * scale, 0, 4 * scale, 8 * scale, 2 * scale);
  else ctx.rect(-2 * scale, 0, 4 * scale, 8 * scale);
  ctx.fill();
  
  ctx.fillStyle = skinColor;
  ctx.beginPath(); 
  if (ctx.roundRect) ctx.roundRect(-1.5 * scale, 7 * scale, 3 * scale, 6 * scale, 1.5 * scale);
  else ctx.rect(-1.5 * scale, 7 * scale, 3 * scale, 6 * scale);
  ctx.fill();
  
  ctx.fillStyle = isLeg ? shoeColor : skinColor;
  ctx.beginPath();
  if (isLeg) {
    if (ctx.roundRect) ctx.roundRect(-2 * scale, 12 * scale, 5 * scale, 3 * scale, 1 * scale);
    else ctx.rect(-2 * scale, 12 * scale, 5 * scale, 3 * scale);
  } else {
    ctx.arc(0, 13 * scale, 2 * scale, 0, Math.PI * 2);
  }
  ctx.fill();
}

function drawScythe(ctx, scale) {
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(-1 * scale, 10 * scale, 2 * scale, 18 * scale); // Handle
  ctx.fillStyle = '#ecf0f1';
  ctx.beginPath(); 
  ctx.moveTo(-1 * scale, 10 * scale); 
  ctx.quadraticCurveTo(-14 * scale, 5 * scale, -12 * scale, 18 * scale); 
  ctx.lineTo(-7 * scale, 15 * scale); 
  ctx.quadraticCurveTo(-10 * scale, 10 * scale, 1 * scale, 10 * scale); 
  ctx.fill(); // Blade
}

function drawSoftCharacter(ctx, x, y, heroId, scale = 4, frame = 0, isWalking = false, facingRight = true) {
  ctx.save();
  const charScale = scale * 0.9;
  ctx.translate(x + 16 * scale, y + 26 * scale);
  
  if (!facingRight) ctx.scale(-1, 1);

  const walkCycle = isWalking ? (frame * 0.2) % (Math.PI * 2) : 0;
  const breath = Math.sin(frame * 0.05) * 1.0;
  const bounce = isWalking ? Math.abs(Math.sin(walkCycle)) * 2 : breath;
  
  const armSwing = isWalking ? Math.sin(walkCycle) * 0.8 : 0;
  const legSwing = isWalking ? Math.sin(walkCycle) * 0.9 : 0;

  const style = getHeroStyle(heroId);

  // Back Arm
  ctx.save(); ctx.translate(-2 * charScale, (-12 - bounce) * charScale); ctx.rotate(-armSwing);
  drawLimb(ctx, style.skinColor, style.sleeveColor, style.shoeColor, charScale, false);
  if (heroId === 'anya') drawScythe(ctx, charScale);
  ctx.restore();

  // Back Leg
  ctx.save(); ctx.translate(-2 * charScale, -6 * charScale); ctx.rotate(-legSwing);
  drawLimb(ctx, style.skinColor, style.pantsColor, style.shoeColor, charScale, true);
  ctx.restore();

  // Torso
  ctx.fillStyle = style.shirtColor;
  ctx.beginPath(); 
  if (ctx.roundRect) ctx.roundRect(-5 * charScale, (-14 - bounce) * charScale, 10 * charScale, 12 * charScale, 4 * charScale);
  else ctx.rect(-5 * charScale, (-14 - bounce) * charScale, 10 * charScale, 12 * charScale);
  ctx.fill();
  
  if (style.vest) {
    ctx.fillStyle = style.vest;
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-5 * charScale, (-14 - bounce) * charScale, 4 * charScale, 12 * charScale, 2 * charScale); ctx.fill();
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(1 * charScale, (-14 - bounce) * charScale, 4 * charScale, 12 * charScale, 2 * charScale); ctx.fill();
  } else if (style.jacket) {
    ctx.fillStyle = '#b71540';
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-6 * charScale, (-14 - bounce) * charScale, 4 * charScale, 13 * charScale, 2 * charScale); ctx.fill();
  }

  // Head
  ctx.save(); ctx.translate(0, (-17 - bounce) * charScale);
  ctx.fillStyle = style.skinColor;
  ctx.beginPath(); ctx.arc(0, 0, 7 * charScale, 0, Math.PI * 2); ctx.fill();
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.beginPath(); ctx.arc(2 * charScale, -1 * charScale, 2 * charScale, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = style.eyeColor;
  ctx.beginPath(); ctx.arc(3 * charScale, -1 * charScale, 1 * charScale, 0, Math.PI * 2); ctx.fill();
  
  // Hair/Hat
  if (style.hat === 'beanie') {
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath(); ctx.arc(0, -2 * charScale, 7 * charScale, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -9 * charScale, 2 * charScale, 0, Math.PI * 2); ctx.fill();
  } else if (style.hat === 'hoodie') {
    ctx.fillStyle = style.shirtColor;
    ctx.beginPath(); ctx.arc(0, -1 * charScale, 8 * charScale, Math.PI, 0); ctx.fill();
    ctx.fillStyle = style.hairColor;
    ctx.beginPath(); ctx.arc(4 * charScale, -5 * charScale, 2 * charScale, 0, Math.PI * 2); ctx.fill();
  } else if (style.hat === 'crown') { // For the new reference style
    ctx.fillStyle = style.hairColor;
    ctx.beginPath(); ctx.arc(0, -2 * charScale, 8 * charScale, Math.PI * 1.1, Math.PI * -0.1); ctx.fill();
    ctx.fillStyle = '#c0392b'; // crown base
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-6 * charScale, -8 * charScale, 12 * charScale, 3 * charScale, 1); ctx.fill();
    ctx.fillStyle = '#f5f6fa'; // horns/bones
    ctx.beginPath(); ctx.moveTo(-5 * charScale, -8 * charScale); ctx.lineTo(-7 * charScale, -12 * charScale); ctx.lineTo(-3 * charScale, -8 * charScale); ctx.fill();
    ctx.beginPath(); ctx.moveTo(5 * charScale, -8 * charScale); ctx.lineTo(7 * charScale, -12 * charScale); ctx.lineTo(3 * charScale, -8 * charScale); ctx.fill();
  } else {
    ctx.fillStyle = style.hairColor;
    ctx.beginPath(); ctx.arc(0, -3 * charScale, 7.5 * charScale, Math.PI * 1.1, Math.PI * -0.1); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -7 * charScale); ctx.quadraticCurveTo(6 * charScale, -7 * charScale, 4 * charScale, -2 * charScale); ctx.lineTo(0, -4 * charScale); ctx.fill();
  }
  ctx.restore();

  // Front Leg
  ctx.save(); ctx.translate(2 * charScale, -6 * charScale); ctx.rotate(legSwing);
  drawLimb(ctx, style.skinColor, style.pantsColor, style.shoeColor, charScale, true);
  ctx.restore();

  // Front Arm
  ctx.save(); ctx.translate(2 * charScale, (-12 - bounce) * charScale); ctx.rotate(armSwing);
  drawLimb(ctx, style.skinColor, style.sleeveColor, style.shoeColor, charScale, false);
  if (heroId === 'anya') drawScythe(ctx, charScale);
  ctx.restore();

  ctx.restore();
}

// ── Image Caching Helper ────────────────────────────────────
const imageCache = {};

function getImage(url) {
  if (imageCache[url]) return imageCache[url];
  const img = new Image();
  img.src = url;
  imageCache[url] = img;
  return img;
}
// Helper to get hero data
function getHeroById(id) {
  return HEROES.find(h => h.id === id);
}

// Render Minecraft-style skin
function drawMinecraftCharacter(ctx, x, y, heroId, pixelSize = 4, frame = 0, isWalking = false, facingRight = true) {
  const hero = getHeroById(heroId);
  if (!hero || !hero.skinUrl) return;
  const img = getImage(hero.skinUrl);
  // Destination size – aim for 32px width at base pixelSize=4 (i.e., 128px)
  const destSize = 32 * pixelSize;
  const offsetX = x + (destSize - img.width) / 2;
  const offsetY = y + (destSize - img.height) / 2;
  ctx.save();
  if (!facingRight) {
    ctx.translate(offsetX + destSize, offsetY);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, destSize, destSize);
  } else {
    ctx.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, destSize, destSize);
  }
  ctx.restore();
}

export function drawCharacter(ctx, x, y, type = 'farmer', pixelSize = 4, frame = 0, isWalking = false, facingRight = true) {
  const heroId = gameState.player.selectedHeroId;
  const hero = getHeroById(heroId);
  if (hero && hero.skinUrl) {
    // Use Minecraft skin rendering
    drawMinecraftCharacter(ctx, x, y, heroId, pixelSize, frame, isWalking, facingRight);
    return;
  }
  // Existing soft skeletal fallback
  let palette = SPRITE_PALETTES[type] || SPRITE_PALETTES.farmer;
  if (type === 'farmer' || type === 'alchemist' || type === 'explorer' || type === 'ranger') {
    return drawSoftCharacter(ctx, x, y, heroId, pixelSize, frame, isWalking, facingRight);
  }
  // Original pixel art rendering (unchanged)
  let matrix;
  let walkFrame = 0;
  if (isWalking) {
    walkFrame = Math.floor(frame / 8) % 2;
    const walkName = walkFrame === 0 ? 'Walk1' : 'Walk2';
    matrix = SPRITES['character' + walkName] || (walkFrame === 0 ? SPRITES.characterWalk1 : SPRITES.characterWalk2);
  } else {
    matrix = SPRITES['character'] || SPRITES.character;
    y = (frame % 32 < 16) ? y : y + 1;
  }
  const getLightingMatrix = () => {
    let suffix = isWalking ? (walkFrame === 0 ? 'Walk1' : 'Walk2') : '';
    if (SPRITES[type + suffix + 'Lighting']) return SPRITES[type + suffix + 'Lighting'];
    if (SPRITES['character' + suffix + 'Lighting']) return SPRITES['character' + suffix + 'Lighting'];
    return null;
  };
  const lightingMatrix = getLightingMatrix();
  ctx.save();
  if (!facingRight) {
    const spriteWidth = 32 * pixelSize;
    ctx.translate(x + spriteWidth, 0);
    ctx.scale(-1, 1);
    drawSpriteMatrix(ctx, 0, y, matrix, palette, pixelSize);
    if (lightingMatrix) drawSpriteMatrix(ctx, 0, y, lightingMatrix, palette, pixelSize);
  } else {
    drawSpriteMatrix(ctx, x, y, matrix, palette, pixelSize);
    if (lightingMatrix) {
        drawSpriteMatrix(ctx, x, y, lightingMatrix, palette, pixelSize);
    }
  }
  ctx.restore();
}

// ── Draw Torch ──────────────────────────────────────────────
export function drawTorch(ctx, x, y, pixelSize = 3, time = 0) {
  const p = pixelSize;
  const t = PALETTES.torch;

  // Bracket / mount
  ctx.fillStyle = '#4a3b2c';
  ctx.fillRect(x + p, y + 6 * p, 2 * p, 8 * p);
  ctx.fillStyle = '#3a2b1c';
  ctx.fillRect(x, y + 5 * p, 4 * p, 2 * p);

  // Flame animation
  const flicker = Math.sin(time * 0.008) * 0.5 + 0.5;
  const flicker2 = Math.sin(time * 0.012 + 2) * 0.5 + 0.5;

  // Glow
  const gradient = ctx.createRadialGradient(x + 2 * p, y + 3 * p, 0, x + 2 * p, y + 3 * p, 20 * p);
  gradient.addColorStop(0, `rgba(255,150,50,${0.15 + flicker * 0.1})`);
  gradient.addColorStop(1, 'rgba(255,150,50,0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x + 2 * p, y + 3 * p, 20 * p, 0, Math.PI * 2);
  ctx.fill();

  // Flame layers
  const flameHeight = 4 + Math.round(flicker * 2);
  ctx.fillStyle = t.flame1;
  ctx.fillRect(x, y + (5 - flameHeight) * p, 4 * p, flameHeight * p);
  ctx.fillStyle = t.flame2;
  ctx.fillRect(x + p * 0.5, y + (5 - flameHeight + 1) * p, 3 * p, (flameHeight - 1) * p);
  ctx.fillStyle = t.flame3;
  ctx.fillRect(x + p, y + (5 - flameHeight + 2) * p, 2 * p, (flameHeight - 2) * p);
  ctx.fillStyle = t.flame4;
  ctx.fillRect(x + p, y + (5 - flameHeight + 3) * p, p, Math.max(1, flameHeight - 3) * p);

  // Sparks
  if (flicker > 0.7) {
    ctx.fillStyle = t.flame4;
    const sparkY = y + (2 - flameHeight) * p - Math.random() * 8 * p;
    const sparkX = x + p + (Math.random() - 0.5) * 4 * p;
    ctx.fillRect(sparkX, sparkY, p * 0.5, p * 0.5);
  }
}

// ── Draw Stone Platform ─────────────────────────────────────
function drawStonePlatform(ctx, x, y, width, height) {
  // Main platform body
  ctx.fillStyle = '#3a4a5a';
  ctx.fillRect(x, y, width, height);
  // Top highlight
  ctx.fillStyle = '#5a6a7a';
  ctx.fillRect(x, y, width, 3);
  // Bottom shadow
  ctx.fillStyle = '#2a3a4a';
  ctx.fillRect(x, y + height - 3, width, 3);
  // Brick lines
  ctx.strokeStyle = '#2a3a4a';
  ctx.lineWidth = 1;
  const brickH = Math.max(8, height / 2);
  for (let by = y + 4; by < y + height - 3; by += brickH) {
    const offset = ((by - y) / brickH) % 2 === 0 ? 0 : width / 4;
    for (let bx = x + offset; bx < x + width; bx += width / 2) {
      ctx.strokeRect(bx, by, width / 2, brickH);
    }
  }
}

// ── Draw Pedestal ───────────────────────────────────────────
function drawPedestal(ctx, x, y, width, height) {
  // Base
  ctx.fillStyle = '#2a3a4a';
  ctx.fillRect(x - 4, y + height - 10, width + 8, 10);
  // Column
  ctx.fillStyle = '#3a4a5a';
  ctx.fillRect(x, y, width, height - 10);
  // Top cap
  ctx.fillStyle = '#5a6a7a';
  ctx.fillRect(x - 6, y - 4, width + 12, 8);
  // Highlight
  ctx.fillStyle = '#6a7a8a';
  ctx.fillRect(x - 6, y - 4, width + 12, 2);
  // Shadow on column
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(x + width - 4, y, 4, height - 10);
}

// ── Draw Crystal ────────────────────────────────────────────
function drawCrystal(ctx, x, y, scale, time) {
  const palette = SPRITE_PALETTES.crystal;
  const matrix = SPRITES.crystal;

  // Glow behind crystal
  const pulse = Math.sin(time * 0.005) * 0.3 + 0.5;
  const glow = ctx.createRadialGradient(x + 7 * scale, y + 5 * scale, 0, x + 7 * scale, y + 5 * scale, 15 * scale);
  glow.addColorStop(0, `rgba(68,136,255,${pulse * 0.4})`);
  glow.addColorStop(0.5, `rgba(68,136,255,${pulse * 0.15})`);
  glow.addColorStop(1, 'rgba(68,136,255,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 7 * scale, y + 5 * scale, 15 * scale, 0, Math.PI * 2);
  ctx.fill();

  drawSpriteMatrix(ctx, x, y, matrix, palette, scale);
}


// ── Environment Renderers ───────────────────────────────────

function drawFarmScene(ctx, width, height, time) {
  // Sky
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, width, height * 0.4);
  // Distant hills
  ctx.fillStyle = '#556B2F';
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.4, 150, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#6B8E23';
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.4, 200, Math.PI, 0);
  ctx.fill();
  // Ground
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, height * 0.4, width, height * 0.6);
  // Crops
  ctx.fillStyle = '#DAA520';
  for(let i = 0; i < width; i += 40) {
    ctx.fillRect(i, height * 0.45, 20, height * 0.55);
  }
}

function drawTempleScene(ctx, width, height, time, renderer) {
  // 1. Golden Ambient Background
  ctx.fillStyle = '#2b1a0a';
  ctx.fillRect(0, 0, width, height);

  // Distant giant castle pillars
  ctx.fillStyle = '#3d2611';
  for (let i = 0; i < 4; i++) {
    const px = width * 0.15 + i * 200;
    ctx.fillRect(px, height * 0.05, 60, height);
    // Pillar details
    ctx.fillStyle = '#4a3015';
    ctx.fillRect(px + 5, height * 0.05, 10, height);
    ctx.fillRect(px + 45, height * 0.05, 10, height);
    ctx.fillStyle = '#3d2611';
  }
  
  // Mid-ground giant stone blocks (Golden hue)
  const brickW = 60;
  const brickH = 30;
  for (let row = 0; row * brickH < height; row++) {
    const offsetX = row % 2 === 0 ? 0 : -brickW / 2;
    for (let col = -1; col * brickW < width + brickW; col++) {
      const bx = col * brickW + offsetX;
      const by = row * brickH;
      const noise = ((row * 7 + col * 13) % 4);
      const colors = ['#5c3a21', '#4e301b', '#684326', '#442815'];
      ctx.fillStyle = colors[noise];
      ctx.fillRect(bx + 2, by + 2, brickW - 4, brickH - 4);
      ctx.fillStyle = '#1c1005';
      ctx.fillRect(bx, by, brickW, 2);
      ctx.fillRect(bx, by, 2, brickH);
      
      // Carvings on some bricks
      if (noise === 0 && Math.random() < 0.1) {
        ctx.fillStyle = '#8b6508';
        ctx.fillRect(bx + 20, by + 10, 20, 10);
      }
    }
  }

  // Draw glowing golden runes on the wall
  ctx.font = "bold 20px 'Press Start 2P'";
  ctx.fillStyle = `rgba(255, 215, 0, ${Math.abs(Math.sin(time*0.03)) * 0.4 + 0.3})`;
  ctx.fillText("⍙", width * 0.25, height * 0.25);
  ctx.fillText("⎍", width * 0.75, height * 0.3);
  ctx.fillText("⍾", width * 0.55, height * 0.45);
  ctx.fillText("⚙", width * 0.15, height * 0.55);

  // Hanging Castle Banners
  for (let i = 0; i < 3; i++) {
    const bannerX = width * 0.2 + i * 0.3 * width;
    ctx.fillStyle = '#8b0000'; // Dark Red
    ctx.fillRect(bannerX, 0, 40, 120);
    // Gold trim
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(bannerX + 4, 0, 4, 116);
    ctx.fillRect(bannerX + 32, 0, 4, 116);
    ctx.fillRect(bannerX, 116, 40, 4);
    // Symbol
    ctx.beginPath();
    ctx.arc(bannerX + 20, 60, 8, 0, Math.PI * 2);
    ctx.fill();
    // Banner tail
    ctx.fillStyle = '#2b1a0a';
    ctx.beginPath();
    ctx.moveTo(bannerX, 120);
    ctx.lineTo(bannerX + 20, 100);
    ctx.lineTo(bannerX + 40, 120);
    ctx.fill();
  }

  // Giant Golden Vault Door (Right Exit)
  const exitX = width * 0.85;
  const exitY = height * 0.35;
  
  // Massive stone framing
  ctx.fillStyle = '#2b1a0a';
  ctx.fillRect(exitX - 25, exitY - 25, 130, 190);
  ctx.fillStyle = '#3d2611';
  ctx.fillRect(exitX - 15, exitY - 15, 110, 170);
  
  // Thick golden door
  ctx.fillStyle = '#daa520';
  ctx.fillRect(exitX, exitY, 80, 150);
  
  // Vault details and armor plates
  ctx.fillStyle = '#b8860b';
  for(let i=0; i<4; i++) {
    ctx.fillRect(exitX + 10, exitY + 15 + i*35, 60, 10);
    // Bolts
    ctx.fillStyle = '#4a3015';
    ctx.fillRect(exitX + 15, exitY + 18 + i*35, 4, 4);
    ctx.fillRect(exitX + 61, exitY + 18 + i*35, 4, 4);
    ctx.fillStyle = '#b8860b';
  }

  // Giant locking wheel
  ctx.strokeStyle = '#8b6508';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(exitX + 40, exitY + 75, 25, 0, Math.PI*2);
  ctx.stroke();
  
  // Wheel spokes
  ctx.save();
  ctx.translate(exitX + 40, exitY + 75);
  for(let i=0; i<6; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.fillRect(0, -4, 35, 8);
  }
  ctx.restore();
  
  // Center jewel lock
  ctx.fillStyle = '#ff4500';
  ctx.beginPath(); ctx.arc(exitX + 40, exitY + 75, 10, 0, Math.PI*2); ctx.fill();

  // Entry Gate (Left)
  const portalX = width * 0.10;
  const portalY = height * 0.45;
  ctx.fillStyle = '#1c1005';
  ctx.beginPath();
  ctx.arc(portalX, portalY, 40, Math.PI, 0);
  ctx.fillRect(portalX - 40, portalY, 80, 80);
  ctx.fill();
  
  // Golden gate bars
  ctx.fillStyle = '#ffd700';
  for(let i=-3; i<=3; i++) {
    ctx.fillRect(portalX + i*10 - 2, portalY - 20, 4, 100);
  }
  const pulse = Math.sin(time * 0.05) * 0.2 + 0.8;
  const portalGlow = ctx.createRadialGradient(portalX, portalY + 40, 0, portalX, portalY + 40, 40 * pulse);
  portalGlow.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
  portalGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = portalGlow;
  ctx.fillRect(portalX - 50, portalY - 10, 100, 100);

  // Fire Torches
  const torches = [
    { x: width * 0.25, y: height * 0.35 },
    { x: width * 0.75, y: height * 0.35 }
  ];
  torches.forEach(t => {
    // Sconce
    ctx.fillStyle = '#8b6508';
    ctx.fillRect(t.x - 5, t.y, 10, 15);
    ctx.fillRect(t.x - 2, t.y + 15, 4, 10);
    // Flame
    const flameH = 15 + Math.random() * 5;
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.moveTo(t.x - 8, t.y);
    ctx.lineTo(t.x, t.y - flameH - 5);
    ctx.lineTo(t.x + 8, t.y);
    ctx.fill();
    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.moveTo(t.x - 4, t.y);
    ctx.lineTo(t.x, t.y - flameH);
    ctx.lineTo(t.x + 4, t.y);
    ctx.fill();
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.moveTo(t.x - 2, t.y);
    ctx.lineTo(t.x, t.y - flameH/2);
    ctx.lineTo(t.x + 2, t.y);
    ctx.fill();
    // Glow
    ctx.fillStyle = `rgba(255, 140, 0, ${0.15 + Math.random() * 0.05})`;
    ctx.beginPath();
    ctx.arc(t.x, t.y - 10, 40, 0, Math.PI*2);
    ctx.fill();
  });

  // Main Walking Platform (Grand Staircase & Floor)
  const platY = height * 0.65;
  ctx.fillStyle = '#4a3015';
  ctx.fillRect(0, platY, width, 20);
  ctx.fillStyle = '#8b6508';
  ctx.fillRect(0, platY, width, 4);
  // Lower step
  ctx.fillStyle = '#3d2611';
  ctx.fillRect(0, platY + 20, width, height - platY - 20);

  // Treasure Piles (Gold coins)
  ctx.fillStyle = '#ffd700';
  ctx.beginPath(); ctx.arc(width * 0.2, platY + 25, 15, Math.PI, 0); ctx.fill();
  ctx.beginPath(); ctx.arc(width * 0.8, platY + 25, 20, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#ff8c00';
  ctx.fillRect(width * 0.18, platY + 15, 4, 4);
  ctx.fillRect(width * 0.82, platY + 10, 5, 5);

  // Interactive Stations
  // Peek Shrine (Magical Crystal Lens Platform)
  const peekX = width * 0.35;
  
  // Ornate base
  ctx.fillStyle = '#4a3015'; 
  ctx.beginPath();
  ctx.moveTo(peekX - 30, platY);
  ctx.lineTo(peekX - 20, platY - 30);
  ctx.lineTo(peekX + 20, platY - 30);
  ctx.lineTo(peekX + 30, platY);
  ctx.fill();
  
  // Golden rim
  ctx.fillStyle = '#daa520';
  ctx.fillRect(peekX - 25, platY - 35, 50, 5);
  ctx.fillStyle = '#b8860b';
  ctx.fillRect(peekX - 22, platY - 40, 44, 5);
  
  // Floating lens
  const crystalPulse = Math.sin(time * 0.08) * 2;
  const lensY = platY - 60 - crystalPulse;
  
  // Lens frame
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(peekX, lensY, 15, 0, Math.PI*2); ctx.stroke();
  
  // Lens glass
  const lensGlow = ctx.createRadialGradient(peekX, lensY, 0, peekX, lensY, 15);
  lensGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  lensGlow.addColorStop(1, 'rgba(100, 200, 255, 0.4)');
  ctx.fillStyle = lensGlow;
  ctx.beginPath(); ctx.arc(peekX, lensY, 12, 0, Math.PI*2); ctx.fill();

  // Scanning beam from lens
  ctx.fillStyle = `rgba(100, 200, 255, ${0.1 + Math.abs(Math.sin(time*0.05))*0.15})`;
  ctx.beginPath();
  ctx.moveTo(peekX, lensY - 12);
  ctx.lineTo(peekX - 20, lensY - 100);
  ctx.lineTo(peekX + 20, lensY - 100);
  ctx.fill();

  // Pop Machine (Ancient Mechanical Arm/Crane)
  const popX = width * 0.65;
  
  // Heavy stone and bronze base
  ctx.fillStyle = '#3d2611';
  ctx.fillRect(popX - 20, platY - 40, 40, 40);
  ctx.fillStyle = '#8b6508'; // Bronze bands
  ctx.fillRect(popX - 22, platY - 10, 44, 5);
  ctx.fillRect(popX - 22, platY - 30, 44, 5);

  // Rotating Gear (animated)
  ctx.save();
  ctx.translate(popX, platY - 20);
  ctx.rotate(time * 0.05);
  ctx.fillStyle = '#daa520';
  for(let i=0; i<8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(8, -2, 6, 4);
  }
  ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#4a3015';
  ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // Crane arm extending up and left toward stack
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(popX, platY - 40);
  ctx.lineTo(popX, platY - 80);
  ctx.lineTo(popX - 30, platY - 100);
  ctx.stroke();

  // Crane claw
  ctx.strokeStyle = '#8b6508';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(popX - 30, platY - 100);
  ctx.lineTo(popX - 40, platY - 90);
  ctx.moveTo(popX - 30, platY - 100);
  ctx.lineTo(popX - 20, platY - 90);
  ctx.stroke();

  // Central Stack Tower (Massive Golden Mechanism) & Push Shrine Base
  const stackX = width * 0.50;
  const stoneH = 30;
  const stoneW = 60;
  
  // Push Shrine (Golden Altar at the base of the Stack Tower)
  ctx.fillStyle = '#3d2611'; // Stone steps
  ctx.fillRect(stackX - 60, platY - 10, 120, 10);
  ctx.fillRect(stackX - 50, platY - 20, 100, 10);
  
  ctx.fillStyle = '#daa520'; // Golden altar block
  ctx.fillRect(stackX - 40, platY - 40, 80, 20);
  
  // Glowing insertion slot
  ctx.fillStyle = '#1c1005';
  ctx.fillRect(stackX - 25, platY - 40, 50, 8);
  const insertGlow = Math.sin(time * 0.1) * 0.5 + 0.5;
  ctx.fillStyle = `rgba(255, 100, 50, ${insertGlow * 0.8})`;
  ctx.fillRect(stackX - 20, platY - 38, 40, 4);

  // Tower background chamber
  ctx.fillStyle = 'rgba(20, 10, 5, 0.8)';
  ctx.fillRect(stackX - 35, height * 0.15, 70, platY - height * 0.15 - 40);
  
  // Mechanical structural framing
  ctx.strokeStyle = '#8b6508';
  ctx.lineWidth = 4;
  ctx.strokeRect(stackX - 38, height * 0.15, 76, platY - height * 0.15 - 40);
  
  // Tower Header (Mechanical Golden Crown)
  ctx.fillStyle = '#b8860b';
  ctx.beginPath();
  ctx.moveTo(stackX - 45, height * 0.15);
  ctx.lineTo(stackX - 20, height * 0.08);
  ctx.lineTo(stackX + 20, height * 0.08);
  ctx.lineTo(stackX + 45, height * 0.15);
  ctx.fill();
  
  // Glowing crown core
  ctx.fillStyle = '#ff4500';
  ctx.beginPath(); ctx.arc(stackX, height * 0.12, 10, 0, Math.PI*2); ctx.fill();
  
  // Draw relics physically locked into the tower
  if (renderer && renderer.stackData) {
    for (let i = 0; i < renderer.stackData.length; i++) {
      const item = renderer.stackData[i];
      const sy = platY - 40 - (i + 1) * stoneH - 5;
      
      // Determine relic colors based on name
      let mainColor = '#d4af37';
      let shadow = '#8b6508';
      let highlight = '#ffffff';
      
      if (item === 'Ruby') {
        mainColor = '#e61919'; shadow = '#800000'; highlight = '#ff6666';
      } else if (item === 'Emerald') {
        mainColor = '#19e65e'; shadow = '#006622'; highlight = '#66ff99';
      } else if (item === 'Sapphire') {
        mainColor = '#1966e6'; shadow = '#002280'; highlight = '#66a3ff';
      }

      // Render actual gem slice inside the machine
      ctx.fillStyle = shadow;
      ctx.fillRect(stackX - stoneW/2, sy, stoneW, stoneH - 2);
      ctx.fillStyle = mainColor;
      ctx.fillRect(stackX - stoneW/2 + 2, sy + 2, stoneW - 4, stoneH - 6);
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.moveTo(stackX - stoneW/2 + 2, sy + 2);
      ctx.lineTo(stackX + stoneW/2 - 2, sy + 2);
      ctx.lineTo(stackX, sy + 10);
      ctx.fill();
      
      // Mechanical golden clasps holding the relic
      ctx.fillStyle = '#daa520';
      ctx.fillRect(stackX - stoneW/2 - 5, sy + 10, 10, 10);
      ctx.fillRect(stackX + stoneW/2 - 5, sy + 10, 10, 10);
      
      const isTop = i === renderer.stackData.length - 1;
      if (isTop) {
        // Magical energy pulsing from top relic
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + Math.sin(time*0.1)*0.2})`;
        ctx.fillRect(stackX - stoneW/2, sy, stoneW, stoneH);
      }
    }
  }

  // Hanging Chains
  ctx.fillStyle = '#696969';
  for(let j=0; j<2; j++) {
    let cx = j===0 ? width * 0.3 : width * 0.7;
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.arc(cx, i*12, 4, 0, Math.PI*2);
      ctx.stroke();
    }
  }

  // Gold dust particles in the air
  ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
  for (let i = 0; i < 15; i++) {
    const px = (time * 0.02 + i * 40) % width;
    const py = (height * 0.8) - ((time * 0.015 + i * 20) % (height * 0.6));
    ctx.fillRect(px, py, 2, 2);
  }

  // Warm Amber Vignette effect
  const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.4, width / 2, height / 2, width * 0.9);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(43, 26, 10, 0.8)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawDesertScene(ctx, width, height, time) {
  // Sky
  ctx.fillStyle = '#FFDAB9';
  ctx.fillRect(0, 0, width, height * 0.3);
  // Sand dunes
  ctx.fillStyle = '#F4A460';
  ctx.beginPath();
  ctx.quadraticCurveTo(width / 2, height * 0.1, width, height * 0.4);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();
  ctx.fillStyle = '#D2B48C';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.4);
  ctx.quadraticCurveTo(width / 2, height * 0.2, width, height * 0.5);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();
}

function drawForestScene(ctx, width, height, time) {
  // Deep dark forest background
  ctx.fillStyle = '#0a1c12';
  ctx.fillRect(0, 0, width, height);
  // Trees
  ctx.fillStyle = '#1e3323';
  for(let i = 20; i < width; i += 120) {
    ctx.fillRect(i, 0, 40, height);
  }
  // Grass floor
  ctx.fillStyle = '#11291b';
  ctx.fillRect(0, height * 0.6, width, height * 0.4);
  // Glowing mushrooms/spores
  for(let i = 0; i < 20; i++) {
    const px = (i * 73 + time) % width;
    const py = height * 0.6 + ((i * 31) % (height * 0.4));
    ctx.fillStyle = '#00ffaa';
    ctx.fillRect(px, py, 4, 4);
    ctx.fillStyle = 'rgba(0, 255, 170, 0.3)';
    ctx.beginPath();
    ctx.arc(px + 2, py + 2, 8 + Math.sin(time*0.1 + i)*2, 0, Math.PI*2);
    ctx.fill();
  }
}

// ── Draw Exit Door ──────────────────────────────────────────
export function drawExitDoor(ctx, x, y, width, height, isOpen = false, time = 0) {
  // Door frame
  ctx.fillStyle = '#3a2b1c';
  ctx.fillRect(x - 4, y - 4, width + 8, height + 4);

  // Door arch
  ctx.fillStyle = '#4a3b2c';
  ctx.beginPath();
  ctx.moveTo(x, y + height);
  ctx.lineTo(x, y + height * 0.3);
  ctx.quadraticCurveTo(x + width / 2, y - height * 0.1, x + width, y + height * 0.3);
  ctx.lineTo(x + width, y + height);
  ctx.fill();

  // Door interior
  ctx.fillStyle = isOpen ? '#1a3060' : '#1a1008';
  ctx.beginPath();
  ctx.moveTo(x + 4, y + height);
  ctx.lineTo(x + 4, y + height * 0.35);
  ctx.quadraticCurveTo(x + width / 2, y + height * 0.05, x + width - 4, y + height * 0.35);
  ctx.lineTo(x + width - 4, y + height);
  ctx.fill();

  if (isOpen) {
    // Portal glow
    const glow = ctx.createRadialGradient(
      x + width / 2, y + height * 0.5, 0,
      x + width / 2, y + height * 0.5, width
    );
    const pulse = Math.sin(time * 0.005) * 0.3 + 0.5;
    glow.addColorStop(0, `rgba(55,199,127,${pulse})`);
    glow.addColorStop(0.5, `rgba(55,199,127,${pulse * 0.3})`);
    glow.addColorStop(1, 'rgba(55,199,127,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height * 0.5, width, 0, Math.PI * 2);
    ctx.fill();
  }

  // EXIT label
  ctx.fillStyle = isOpen ? '#37c77f' : '#8590b0';
  ctx.font = "bold 10px 'Press Start 2P', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('EXIT', x + width / 2, y - 10);
  ctx.textAlign = 'start';
}


// ── Draw Relic Item ─────────────────────────────────────────
export function drawRelic(ctx, x, y, type = 'apple', collected = false, time = 0, label = '', worldId = '', sceneType = '') {
  if (collected) ctx.globalAlpha = 0.15;
  
  const bobY = y + Math.sin(time * 0.1) * 4;

  if (type === 'Ruby' || type === 'Emerald' || type === 'Sapphire' || type === 'RUBY' || type === 'EMERALD' || type === 'TOPAZ') {
    // Draw realistic physical gemstone on an ancient pedestal base
    // The base
    ctx.fillStyle = '#3d2611';
    ctx.fillRect(x - 5, y + 25, 42, 10);
    ctx.fillStyle = '#8b6508';
    ctx.fillRect(x - 2, y + 22, 36, 3);
    
    ctx.save();
    ctx.translate(x + 16, bobY + 10);
    
    let glowColor, mainColor, highlight, shadow;
    if (type === 'Ruby' || type === 'RUBY') {
      glowColor = 'rgba(255, 30, 30, 0.4)';
      mainColor = '#e61919';
      highlight = '#ff6666';
      shadow = '#800000';
    } else if (type === 'Emerald' || type === 'EMERALD') {
      glowColor = 'rgba(30, 255, 100, 0.4)';
      mainColor = '#19e65e';
      highlight = '#66ff99';
      shadow = '#006622';
    } else if (type === 'TOPAZ') {
      glowColor = 'rgba(255, 215, 0, 0.4)';
      mainColor = '#ffaa00';
      highlight = '#ffdd66';
      shadow = '#996600';
    } else { // Sapphire
      glowColor = 'rgba(30, 100, 255, 0.4)';
      mainColor = '#1966e6';
      highlight = '#66a3ff';
      shadow = '#002280';
    }

    // Glow
    const pulse = Math.sin(time * 0.08) * 0.2 + 0.8;
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 40 * pulse);
    glow.addColorStop(0, glowColor);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI*2); ctx.fill();

    // Crystal Geometry (Octahedron style)
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(12, 0);
    ctx.lineTo(0, 15);
    ctx.lineTo(-12, 0);
    ctx.fill();

    // Left highlight facet
    ctx.fillStyle = highlight;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(-12, 0);
    ctx.lineTo(0, 0);
    ctx.fill();

    // Right shadow facet
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(12, 0);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.restore();

    // Particles
    ctx.fillStyle = highlight;
    for(let i=0; i<3; i++) {
      const px = x + 16 + Math.sin(time * 0.05 + i * 2) * 15;
      const py = bobY + 10 - ((time * 0.04 + i * 10) % 25);
      ctx.globalAlpha = 1 - ((time * 0.04 + i * 10) % 25)/25;
      ctx.fillRect(px, py, 2, 2);
    }
    ctx.globalAlpha = 1;

  } else if (type === 'WHEAT') {
    // Soil base
    ctx.fillStyle = '#5c3d1e';
    ctx.fillRect(x - 10, y + 22, 52, 13);
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x - 7, y + 20, 46, 2);

    // Stalks and Wheat heads
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ffd700';

    const bobScale = Math.sin(time * 0.1) * 2;

    // Center stalk
    ctx.beginPath();
    ctx.moveTo(x + 16, y + 22);
    ctx.quadraticCurveTo(x + 16 + bobScale, y + 10, x + 16 + bobScale, y - 5);
    ctx.stroke();

    // Left stalk
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 22);
    ctx.quadraticCurveTo(x + 4 + bobScale, y + 12, x + 3 + bobScale, y - 1);
    ctx.stroke();

    // Right stalk
    ctx.beginPath();
    ctx.moveTo(x + 26, y + 22);
    ctx.quadraticCurveTo(x + 28 + bobScale, y + 12, x + 29 + bobScale, y - 1);
    ctx.stroke();

    // Wheat heads (little grains)
    const drawHead = (hx, hy) => {
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(hx - 3, hy - 4, 6, 8);
      ctx.fillRect(hx - 5, hy - 2, 10, 4);
      // Whiskers
      ctx.strokeStyle = '#daa520';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, hy - 4);
      ctx.lineTo(hx - 3, hy - 12);
      ctx.moveTo(hx, hy - 4);
      ctx.lineTo(hx + 3, hy - 12);
      ctx.stroke();
    };

    drawHead(x + 16 + bobScale, y - 5);
    drawHead(x + 3 + bobScale, y - 1);
    drawHead(x + 29 + bobScale, y - 1);

  } else if (type === 'CARROT') {
    // Soil base
    ctx.fillStyle = '#5c3d1e';
    ctx.fillRect(x - 10, y + 22, 52, 13);
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x - 7, y + 20, 46, 2);

    // Green leafy top (animated)
    ctx.strokeStyle = '#228b22';
    ctx.lineWidth = 4;
    const wave = Math.sin(time * 0.1) * 3;
    
    ctx.beginPath();
    ctx.moveTo(x + 16, y + 15);
    ctx.quadraticCurveTo(x + 10 + wave, y + 2, x + 8 + wave, y - 5);
    ctx.moveTo(x + 16, y + 15);
    ctx.quadraticCurveTo(x + 16 + wave, y, x + 16 + wave, y - 8);
    ctx.moveTo(x + 16, y + 15);
    ctx.quadraticCurveTo(x + 22 + wave, y + 2, x + 24 + wave, y - 5);
    ctx.stroke();

    // Orange carrot body poking out of soil
    ctx.fillStyle = '#ff7f50';
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 14);
    ctx.quadraticCurveTo(x + 16, y + 12, x + 22, y + 14);
    ctx.lineTo(x + 18, y + 24);
    ctx.lineTo(x + 14, y + 24);
    ctx.closePath();
    ctx.fill();

    // Carrot highlight/details
    ctx.fillStyle = '#d2691e';
    ctx.fillRect(x + 12, y + 17, 8, 2);

  } else if (type === 'CORN') {
    // Soil base
    ctx.fillStyle = '#5c3d1e';
    ctx.fillRect(x - 10, y + 22, 52, 13);
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x - 7, y + 20, 46, 2);

    // Green stalks
    ctx.fillStyle = '#228b22';
    ctx.fillRect(x + 13, y - 8, 6, 30);

    // Yellow corn cob
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 11, y - 2, 10, 14);
    ctx.fillStyle = '#ffea00'; // cob highlight
    ctx.fillRect(x + 13, y - 2, 4, 14);

    // Green husks wrapping around cob
    ctx.strokeStyle = '#2e8b57';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 12);
    ctx.quadraticCurveTo(x + 8, y + 4, x + 11, y - 4);
    ctx.moveTo(x + 22, y + 12);
    ctx.quadraticCurveTo(x + 24, y + 4, x + 21, y - 4);
    ctx.stroke();

    // Top silk
    ctx.strokeStyle = '#8b6508';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 16, y - 2);
    ctx.lineTo(x + 14, y - 6);
    ctx.moveTo(x + 16, y - 2);
    ctx.lineTo(x + 18, y - 6);
    ctx.stroke();

  } else if (type === 'ROSE' || type === 'LILY' || type === 'TULIP') {
    // Soil base
    ctx.fillStyle = '#5c3d1e';
    ctx.fillRect(x - 10, y + 22, 52, 13);
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x - 7, y + 20, 46, 2);

    const sway = Math.sin(time * 0.08) * 3;
    const stemColor = '#2e8b57';
    
    // Stem
    ctx.strokeStyle = stemColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 16, y + 22);
    ctx.quadraticCurveTo(x + 16 + sway * 0.5, y + 12, x + 16 + sway, y + 2);
    ctx.stroke();

    // Small stem leaves
    ctx.fillStyle = stemColor;
    ctx.fillRect(x + 12 + sway * 0.7, y + 14, 4, 3);
    ctx.fillRect(x + 17 + sway * 0.7, y + 9, 4, 3);

    // Flower head
    ctx.save();
    ctx.translate(x + 16 + sway, y + 2);

    if (type === 'ROSE') {
      ctx.fillStyle = '#ff3333';
      ctx.beginPath(); ctx.arc(0, -5, 6, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(-4, -2, 5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(4, -2, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#b30000'; // dark rose center
      ctx.beginPath(); ctx.arc(0, -3, 3, 0, Math.PI*2); ctx.fill();
    } else if (type === 'LILY') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(-6, -2);
      ctx.lineTo(0, 2);
      ctx.lineTo(6, -2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffb6c1';
      ctx.beginPath(); ctx.arc(0, -3, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(-1, -4, 2, 2);
    } else { // TULIP
      ctx.fillStyle = '#9370db';
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.lineTo(-6, 0);
      ctx.quadraticCurveTo(0, 4, 6, 0);
      ctx.lineTo(6, -10);
      ctx.lineTo(3, -5);
      ctx.lineTo(0, -10);
      ctx.lineTo(-3, -5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#4b0082'; // shading
      ctx.fillRect(-3, -2, 6, 3);
    }
    ctx.restore();

  } else if (worldId === 'arrays-strings' && (type === '5' || type === '10' || type === '3')) {
    // Weight apples
    ctx.fillStyle = '#3d2611';
    ctx.fillRect(x - 5, y + 25, 42, 10);
    ctx.fillStyle = '#8b6508';
    ctx.fillRect(x - 2, y + 22, 36, 3);

    // Apple
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(x + 12, bobY + 14, 8, 0, Math.PI * 2);
    ctx.arc(x + 20, bobY + 14, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8b0000';
    ctx.fillRect(x + 14, bobY + 20, 4, 3);

    // Stem and leaf
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 16, bobY + 10);
    ctx.quadraticCurveTo(x + 14, bobY + 4, x + 12, bobY + 2);
    ctx.stroke();

    ctx.fillStyle = '#228b22';
    ctx.beginPath();
    ctx.ellipse(x + 19, bobY + 5, 4, 2, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 9px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(type, x + 16, bobY + 17);
    ctx.textAlign = 'start';

  } else if (worldId === 'arrays-strings' && (type === '15' || type === '42' || type === '7' || type === '25')) {
    // Quarry boulders
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 2, y + 22, 36, 6);

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(x + 4, bobY + 24);
    ctx.lineTo(x + 10, bobY + 10);
    ctx.lineTo(x + 22, bobY + 8);
    ctx.lineTo(x + 28, bobY + 24);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(x + 10, bobY + 10);
    ctx.lineTo(x + 22, bobY + 8);
    ctx.lineTo(x + 16, bobY + 16);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(x + 4, bobY + 24);
    ctx.lineTo(x + 16, bobY + 16);
    ctx.lineTo(x + 14, bobY + 24);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 12, bobY + 12);
    ctx.lineTo(x + 15, bobY + 18);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = "bold 9px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(type, x + 16, bobY + 20);
    ctx.textAlign = 'start';

  } else if (type === 'Gold' || type.includes('Gold') || type.includes('Chest')) {
    // Gold Chests
    ctx.fillStyle = '#3d2611';
    ctx.fillRect(x - 5, y + 25, 42, 10);
    ctx.fillStyle = '#8b6508';
    ctx.fillRect(x - 2, y + 22, 36, 3);

    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(x + 2, bobY + 10, 28, 16);
    
    ctx.fillStyle = '#daa520';
    ctx.fillRect(x + 2, bobY + 10, 4, 16);
    ctx.fillRect(x + 26, bobY + 10, 4, 16);
    ctx.fillRect(x + 2, bobY + 10, 28, 3);
    
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 13, bobY + 12, 6, 6);
    ctx.fillStyle = '#3d2611';
    ctx.fillRect(x + 15, bobY + 15, 2, 3);

    if (!collected) {
      ctx.fillStyle = '#ffd700';
      for(let i=0; i<2; i++) {
        const px = x + 16 + Math.sin(time * 0.1 + i * 3) * 12;
        const py = bobY + 8 - ((time * 0.05 + i * 8) % 18);
        ctx.fillRect(px, py, 2, 2);
      }
    }

  } else if (worldId === 'arrays-strings' && (type === 'LISTEN' || type === 'SILENT' || (['1', '2', '2_1', '2_2', '3'].includes(type) && label === ''))) {
    // Scrolls and Ledger Books
    ctx.fillStyle = '#3d2611';
    ctx.fillRect(x - 5, y + 25, 42, 10);
    ctx.fillStyle = '#8b6508';
    ctx.fillRect(x - 2, y + 22, 36, 3);

    const isBook = ['1', '2', '2_1', '2_2', '3'].includes(type);

    if (isBook) {
      ctx.fillStyle = '#8b0000';
      ctx.fillRect(x + 4, bobY + 6, 24, 20);
      
      ctx.fillStyle = '#f5f5dc';
      ctx.fillRect(x + 7, bobY + 7, 20, 18);
      
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(x + 10, bobY + 10, 10, 1.5);
      ctx.fillRect(x + 10, bobY + 14, 12, 1.5);
      ctx.fillRect(x + 10, bobY + 18, 8, 1.5);

      ctx.fillStyle = '#ffd700';
      ctx.fillRect(x + 4, bobY + 6, 3, 20);
    } else {
      ctx.fillStyle = '#f5deb3';
      ctx.fillRect(x + 2, bobY + 4, 28, 22);

      ctx.fillStyle = '#8b4513';
      ctx.fillRect(x, bobY + 2, 32, 2);
      ctx.fillRect(x, bobY + 26, 32, 2);

      ctx.strokeStyle = '#8b5a2b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 6, bobY + 8); ctx.lineTo(x + 26, bobY + 8);
      ctx.moveTo(x + 6, bobY + 13); ctx.lineTo(x + 24, bobY + 13);
      ctx.moveTo(x + 6, bobY + 18); ctx.lineTo(x + 26, bobY + 18);
      ctx.moveTo(x + 6, bobY + 23); ctx.lineTo(x + 20, bobY + 23);
      ctx.stroke();
    }

  } else if (worldId === 'arrays-strings' && type.length === 1 && (type === 'A' || type === 'B' || type === 'C')) {
    // Magical Amulets
    ctx.fillStyle = '#3d2611';
    ctx.fillRect(x - 5, y + 25, 42, 10);
    ctx.fillStyle = '#8b6508';
    ctx.fillRect(x - 2, y + 22, 36, 3);

    let color = '#7ed6df';
    if (type === 'B') color = '#ff7675';
    if (type === 'C') color = '#a29bfe';

    ctx.save();
    ctx.translate(x + 16, bobY + 12);

    const pulse = Math.sin(time * 0.1) * 0.2 + 0.8;
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 20 * pulse);
    glow.addColorStop(0, color);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI*2); ctx.fill();

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(8, 0);
    ctx.lineTo(0, 10);
    ctx.lineTo(-8, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 0);
    ctx.lineTo(0, 7);
    ctx.lineTo(-5, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 8px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(type, 0, 3);
    ctx.restore();
    ctx.textAlign = 'start';

  } else if (worldId === 'linked-lists') {
    // Sandstone Ruins Column Node
    ctx.fillStyle = '#8b6e43';
    ctx.fillRect(x - 5, y + 25, 42, 10);
    ctx.fillStyle = '#e0b060';
    ctx.fillRect(x - 2, y + 22, 36, 3);

    const stoneY = bobY - 5;
    const displayType = type.replace(/_\d+$/, '');

    if (displayType === '40') {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(x + 2, stoneY + 4, 28, 20);
      ctx.fillStyle = '#daa520';
      ctx.fillRect(x + 2, stoneY + 4, 28, 3);
      ctx.fillRect(x + 13, stoneY + 12, 6, 6);
      ctx.fillStyle = '#ffea00';
      ctx.beginPath(); ctx.arc(x + 16, stoneY + 2, 4, 0, Math.PI*2); ctx.fill();
    } else if (displayType === 'CURSED') {
      ctx.fillStyle = '#2d1e2f';
      ctx.fillRect(x + 2, stoneY + 2, 28, 26);
      
      ctx.strokeStyle = '#1a0d1a';
      ctx.strokeRect(x + 2, stoneY + 2, 28, 26);

      const pulse = Math.sin(time * 0.1) * 0.2 + 0.8;
      const glow = ctx.createRadialGradient(x + 16, stoneY + 15, 0, x + 16, stoneY + 15, 20 * pulse);
      glow.addColorStop(0, 'rgba(128, 0, 128, 0.5)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(x + 16, stoneY + 15, 20, 0, Math.PI*2); ctx.fill();

      ctx.fillStyle = '#ff3333';
      ctx.font = "bold 9px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.fillText('☠️', x + 16, stoneY + 20);
      ctx.textAlign = 'start';
    } else if (displayType === 'SAFE') {
      ctx.fillStyle = '#1e3f20';
      ctx.fillRect(x + 2, stoneY + 2, 28, 26);
      ctx.strokeStyle = '#0f2010';
      ctx.strokeRect(x + 2, stoneY + 2, 28, 26);

      const pulse = Math.sin(time * 0.08) * 0.15 + 0.85;
      const glow = ctx.createRadialGradient(x + 16, stoneY + 15, 0, x + 16, stoneY + 15, 18 * pulse);
      glow.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(x + 16, stoneY + 15, 18, 0, Math.PI*2); ctx.fill();

      ctx.fillStyle = '#4ade80';
      ctx.font = "bold 9px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.fillText('SAFE', x + 16, stoneY + 19);
      ctx.textAlign = 'start';
    } else {
      ctx.fillStyle = '#c89440';
      ctx.fillRect(x + 4, stoneY + 2, 24, 26);
      
      ctx.fillStyle = '#8a6428';
      ctx.fillRect(x + 4, stoneY + 10, 24, 2);
      ctx.fillRect(x + 14, stoneY + 2, 2, 8);
      ctx.fillRect(x + 10, stoneY + 12, 2, 16);

      if (!collected) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.fillRect(x + 1, stoneY + 1, 30, 28);
      }

      ctx.fillStyle = '#3d2611';
      ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.fillText(displayType, x + 16, stoneY + 19);
      ctx.textAlign = 'start';
    }

  } else if (worldId === 'trees-graphs') {
    const plantY = bobY - 5;
    const displayType = type.replace(/_\d+$/, '');

    if (sceneType === 'autumn_leaf_fall') {
      // Golden/Orange leaves
      ctx.fillStyle = '#E67E22';
      ctx.beginPath();
      ctx.ellipse(x + 16, plantY + 16, 12, 6, -Math.PI/4, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = '#D35400';
      ctx.beginPath(); ctx.moveTo(x+8, plantY+24); ctx.lineTo(x+24, plantY+8); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 8px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+22, plantY+6); ctx.textAlign = 'start';

    } else if (sceneType === 'enchanted_hedge_maze') {
      // Fairy Orbs
      const pulse = Math.sin(time*0.1) * 0.2 + 0.8;
      const glow = ctx.createRadialGradient(x+16, plantY+16, 0, x+16, plantY+16, 20*pulse);
      glow.addColorStop(0, 'rgba(241, 196, 15, 0.6)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x+16, plantY+16, 20, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#FFF59D'; ctx.beginPath(); ctx.arc(x+16, plantY+16, 8, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#D35400'; ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+16, plantY+20); ctx.textAlign = 'start';

    } else if (sceneType === 'overgrown_ruins_graph') {
      // Mossy Stone Idols
      ctx.fillStyle = '#5A6E63'; ctx.fillRect(x+4, plantY+4, 24, 24);
      ctx.fillStyle = '#1D8348'; ctx.fillRect(x+4, plantY+4, 10, 8); // Moss
      ctx.fillStyle = '#00FFFF'; ctx.fillRect(x+14, plantY+14, 4, 4); // Glowing eye
      ctx.fillStyle = '#ffffff'; ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+16, plantY-2); ctx.textAlign = 'start';

    } else if (sceneType === 'signal_tower_forest') {
      // Signal Beacons
      ctx.fillStyle = '#5D4037'; ctx.fillRect(x+6, plantY+20, 20, 6);
      const pulse = Math.sin(time*0.15)*0.2 + 0.8;
      ctx.fillStyle = `rgba(231, 76, 60, ${pulse})`;
      ctx.beginPath(); ctx.moveTo(x+16, plantY); ctx.lineTo(x+24, plantY+20); ctx.lineTo(x+8, plantY+20); ctx.fill();
      ctx.fillStyle = '#F1C40F'; ctx.beginPath(); ctx.moveTo(x+16, plantY+6); ctx.lineTo(x+20, plantY+20); ctx.lineTo(x+12, plantY+20); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+16, plantY-2); ctx.textAlign = 'start';

    } else if (sceneType === 'enchanted_forest') {
      // Glowing Saplings
      ctx.fillStyle = '#8B4513'; ctx.fillRect(x+14, plantY+16, 4, 12);
      ctx.fillStyle = '#2ECC71'; ctx.beginPath(); ctx.arc(x+16, plantY+10, 8, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+16, plantY+14); ctx.textAlign = 'start';

    } else if (sceneType === 'mirror_forest') {
      // Mirror Shards
      ctx.fillStyle = '#81D4FA'; ctx.beginPath(); ctx.moveTo(x+16, plantY); ctx.lineTo(x+24, plantY+16); ctx.lineTo(x+16, plantY+28); ctx.lineTo(x+8, plantY+16); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(x+16, plantY); ctx.lineTo(x+20, plantY+16); ctx.lineTo(x+16, plantY+28); ctx.fill();
      ctx.fillStyle = '#01579B'; ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+16, plantY+20); ctx.textAlign = 'start';

    } else if (sceneType === 'crystal_cave_path') {
      // Glowing Crystals
      ctx.fillStyle = '#E040FB'; ctx.beginPath(); ctx.moveTo(x+16, plantY+4); ctx.lineTo(x+24, plantY+24); ctx.lineTo(x+8, plantY+24); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+16, plantY-2); ctx.textAlign = 'start';

    } else if (sceneType === 'great_tree') {
      // Golden Acorns
      ctx.fillStyle = '#F5B041'; ctx.beginPath(); ctx.arc(x+16, plantY+18, 8, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#873600'; ctx.beginPath(); ctx.arc(x+16, plantY+12, 10, Math.PI, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+16, plantY-2); ctx.textAlign = 'start';

    } else if (sceneType === 'abyssal_chasm') {
      // Toxic Spores
      ctx.fillStyle = '#8E44AD'; ctx.beginPath(); ctx.arc(x+16, plantY+14, 10, Math.PI, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#2ECC71'; ctx.beginPath(); ctx.arc(x+12, plantY+10, 2, 0, Math.PI*2); ctx.arc(x+20, plantY+12, 2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+16, plantY-2); ctx.textAlign = 'start';

    } else if (sceneType === 'ancient_message_forest') {
      // Ancient Runestones
      ctx.fillStyle = '#34495E'; ctx.fillRect(x+6, plantY+4, 20, 24);
      ctx.fillStyle = '#F1C40F'; ctx.font = "bold 14px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+16, plantY+22); ctx.textAlign = 'start';

    } else {
      // Fallback Tree
      ctx.fillStyle = '#8B4513'; ctx.fillRect(x+13, plantY+16, 6, 12);
      ctx.fillStyle = '#228B22'; ctx.beginPath(); ctx.arc(x+16, plantY+10, 10, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = "bold 8px 'Press Start 2P', monospace";
      ctx.textAlign = 'center'; ctx.fillText(displayType, x+16, plantY+14); ctx.textAlign = 'start';
    }

  } else if (worldId === 'stacks-queues' && sceneType === 'chasm' && ['1', '2', '3'].includes(type.replace(/_\d+$/, ''))) {
    // Wood Planks
    ctx.fillStyle = '#3a4a5a';
    ctx.fillRect(x - 5, y + 25, 42, 10);

    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(x, bobY + 10, 32, 12);
    
    ctx.fillStyle = '#cd853f';
    ctx.beginPath();
    ctx.ellipse(x + 2, bobY + 16, 3, 6, 0, 0, Math.PI*2);
    ctx.ellipse(x + 30, bobY + 16, 3, 6, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = '#5c3a21';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 5, bobY + 13); ctx.lineTo(x + 27, bobY + 13);
    ctx.moveTo(x + 8, bobY + 18); ctx.lineTo(x + 25, bobY + 18);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 9px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(type.replace(/_\d+$/, ''), x + 16, bobY + 20);
    ctx.textAlign = 'start';

  } else if (worldId === 'stacks-queues' && sceneType === 'castle_gate' && ['R', 'A', 'C', 'E'].includes(type.replace(/_\d+$/, ''))) {
    // Shields
    ctx.fillStyle = '#3a4a5a';
    ctx.fillRect(x - 5, y + 25, 42, 10);

    ctx.fillStyle = '#747d8c';
    ctx.beginPath();
    ctx.moveTo(x + 6, bobY + 4);
    ctx.lineTo(x + 26, bobY + 4);
    ctx.lineTo(x + 26, bobY + 16);
    ctx.quadraticCurveTo(x + 26, bobY + 26, x + 16, bobY + 30);
    ctx.quadraticCurveTo(x + 6, bobY + 26, x + 6, bobY + 16);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 10px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(type.replace(/_\d+$/, ''), x + 16, bobY + 19);
    ctx.textAlign = 'start';

  } else if (worldId === 'stacks-queues' && sceneType === 'ritual_temple') {
    // Postfix expression tokens (Skulls vs Operator runes)
    ctx.fillStyle = '#3d2611';
    ctx.fillRect(x - 5, y + 25, 42, 10);

    const cleanType = type.replace(/_\d+$/, '');
    const isOperator = ['+', '*', '-', '/'].includes(cleanType);

    if (isOperator) {
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(x + 4, bobY + 6, 24, 20);
      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, bobY + 6, 24, 20);

      ctx.fillStyle = '#ff4757';
      ctx.font = "bold 14px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.fillText(cleanType, x + 16, bobY + 21);
      ctx.textAlign = 'start';
    } else {
      ctx.fillStyle = '#f5f6fa';
      ctx.beginPath();
      ctx.arc(x + 16, bobY + 12, 10, 0, Math.PI*2);
      ctx.fill();
      ctx.fillRect(x + 11, bobY + 16, 10, 8);

      ctx.fillStyle = '#2f3542';
      ctx.fillRect(x + 11, bobY + 10, 3, 3);
      ctx.fillRect(x + 18, bobY + 10, 3, 3);
      ctx.fillRect(x + 15, bobY + 14, 2, 2);

      ctx.fillStyle = '#ff4757';
      ctx.font = "bold 8px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.fillText(cleanType, x + 16, bobY + 8);
      ctx.textAlign = 'start';
    }

  } else if (worldId === 'stacks-queues' && sceneType === 'mine' && ['4', '1', '2', '5'].includes(type.replace(/_\d+$/, ''))) {
    // Next Greater Element stone golems
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(x - 5, y + 25, 42, 10);

    const val = parseInt(type.replace(/_\d+$/, ''));
    const scaleFactor = 8 + val * 3.5;

    ctx.fillStyle = '#747d8c';
    ctx.beginPath();
    ctx.arc(x + 16, bobY + 22 - scaleFactor/2, scaleFactor/2, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#54a0ff';
    ctx.fillRect(x + 13, bobY + 20 - scaleFactor/2, 2, 2);
    ctx.fillRect(x + 17, bobY + 20 - scaleFactor/2, 2, 2);

    ctx.strokeStyle = '#2f3542';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 16, bobY + 22 - scaleFactor);
    ctx.lineTo(x + 16, bobY + 18 - scaleFactor/2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 9px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(type.replace(/_\d+$/, ''), x + 16, bobY + 25);
    ctx.textAlign = 'start';

  } else if (worldId === 'stacks-queues' && sceneType === 'treasure_vault' && ['5', '2', '7', '1'].includes(type.replace(/_\d+$/, ''))) {
    // Min Stack chests
    ctx.fillStyle = '#b8860b';
    ctx.fillRect(x - 5, y + 25, 42, 10);

    const val = parseInt(type.replace(/_\d+$/, ''));
    const widthFactor = 16 + val * 2.5;

    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(x + 16 - widthFactor/2, bobY + 10, widthFactor, 16);
    
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 16 - widthFactor/2, bobY + 10, 3, 16);
    ctx.fillRect(x + 13 + widthFactor/2, bobY + 10, 3, 16);
    ctx.fillRect(x + 14, bobY + 14, 4, 6);

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 9px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(type.replace(/_\d+$/, ''), x + 16, bobY + 24);
    ctx.textAlign = 'start';

  } else if (worldId === 'stacks-queues' && sceneType === 'snowy_peak') {
    // Temperature Crystals
    ctx.fillStyle = '#a5b1c2';
    ctx.fillRect(x - 5, y + 25, 42, 10);
    ctx.fillStyle = '#d1d8e0';
    ctx.fillRect(x - 2, y + 22, 36, 3);

    const cleanType = type.replace(/_\d+$/, '');
    const temp = parseInt(cleanType);
    const isHot = temp >= 74;
    const crystalColor = isHot ? '#fc5c65' : '#45aaf2';
    const glowColor = isHot ? 'rgba(252, 92, 101, 0.4)' : 'rgba(69, 170, 242, 0.4)';

    ctx.save();
    ctx.translate(x + 16, bobY + 12);

    const pulse = Math.sin(time * 0.1) * 0.2 + 0.8;
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 20 * pulse);
    glow.addColorStop(0, glowColor);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = crystalColor;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(8, 0);
    ctx.lineTo(0, 12);
    ctx.lineTo(-8, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(-8, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 8px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(cleanType, x + 16, bobY + 23);
    ctx.textAlign = 'start';

  } else if (type.length === 1 || type.startsWith('bracket_') || ['(', ')', '{', '}', '[', ']'].includes(type) || type.match(/^[A-Z]$/)) {
    if (sceneType === 'mirror_hall') {
      // Floating magical orbs for Mirror Shield Palindrome
      const pulse = Math.sin(time * 0.05) * 0.2 + 0.8;
      const orbColor = 'rgba(129, 236, 236, 0.4)';
      const glow = ctx.createRadialGradient(x + 16, bobY + 16, 0, x + 16, bobY + 16, 25 * pulse);
      glow.addColorStop(0, orbColor);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(x + 16, bobY + 16, 25, 0, Math.PI*2); ctx.fill();
      
      // Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x + 16, bobY + 16, 8, 0, Math.PI*2); ctx.fill();
      
      ctx.fillStyle = '#0984e3';
      ctx.font = "bold 18px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.fillText(type, x + 16, bobY + 23);
      ctx.textAlign = 'start';
      return;
    }

    // Runestones (Default for single letters/brackets)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 5, y + 25, 42, 10);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 2, y + 22, 36, 3);
    
    const stoneY = bobY - 5;
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 2, stoneY + 2, 28, 26);
    
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 2, stoneY + 26, 28, 2);
    ctx.fillRect(x + 28, stoneY + 2, 2, 26);
    
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 2, stoneY + 2, 28, 2);
    ctx.fillRect(x + 2, stoneY + 2, 2, 26);

    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 6, stoneY + 8, 2, 2);
    ctx.fillRect(x + 20, stoneY + 18, 4, 2);
    ctx.fillRect(x + 22, stoneY + 12, 2, 4);

    let displayStr = type;
    if (type.startsWith('bracket_')) {
      const bracketMap = {
        'bracket_1': '(', 'bracket_2': '{', 'bracket_3': '[',
        'bracket_4': ']', 'bracket_5': '}', 'bracket_6': ')'
      };
      displayStr = bracketMap[type] || '(';
    }
    
    let glowColor = 'rgba(56, 189, 248, 0.4)';
    let textStyle = '#38bdf8';
    if (['(', '{', '['].includes(displayStr)) {
      glowColor = 'rgba(34, 197, 94, 0.4)';
      textStyle = '#4ade80';
    } else if ([')', '}', ']'].includes(displayStr)) {
      glowColor = 'rgba(239, 68, 68, 0.4)';
      textStyle = '#f87171';
    } else if (displayStr.match(/^[A-Z0-9]$/)) {
      glowColor = 'rgba(245, 158, 11, 0.4)';
      textStyle = '#fbbf24';
    }

    const pulse = Math.sin(time * 0.08) * 0.15 + 0.85;
    const glow = ctx.createRadialGradient(x + 16, stoneY + 15, 0, x + 16, stoneY + 15, 18 * pulse);
    glow.addColorStop(0, glowColor);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x + 16, stoneY + 15, 18, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = textStyle;
    ctx.shadowColor = textStyle;
    ctx.shadowBlur = 6;
    ctx.font = "bold 16px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(displayStr, x + 16, stoneY + 23);
    ctx.textAlign = 'start';
    ctx.shadowBlur = 0;

  } else if (type.includes('Flask') || type === 'Water' || type === 'Herb' || type === 'Poison' || type === 'Honey') {
    // Alchemy flasks
    let color = '#2ed573';
    if (type.includes('Water') || type === 'Water') color = '#1e90ff';
    if (type.includes('Poison') || type === 'Poison') color = '#ff4757';
    if (type.includes('Honey') || type === 'Honey') color = '#ffa502';
    
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.arc(x + 16, bobY + 20, 12, 0, Math.PI*2); ctx.fill();
    
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x + 16, bobY + 22, 10, 0, Math.PI); ctx.fill();
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(x + 12, bobY + 2, 8, 10);
    
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(x + 11, bobY, 10, 4);

  } else if (type.includes('Plank')) {
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(x, bobY + 10, 32, 12);
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(x, bobY + 14, 32, 2);

  } else if (type.includes('Iron_')) {
    ctx.fillStyle = '#747d8c';
    ctx.beginPath(); ctx.arc(x + 16, bobY + 16, 15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1e272e';
    ctx.font = "bold 14px monospace";
    ctx.textAlign = 'center';
    ctx.fillText(type.split('_')[1], x + 16, bobY + 21);
    ctx.textAlign = 'start';

  } else if (type.includes('Rune_')) {
    const num = type.split('_')[1];
    
    // Magical Aura
    const pulse = Math.sin(time * 0.05) * 0.2 + 0.8;
    const glow = ctx.createRadialGradient(x + 16, bobY + 16, 0, x + 16, bobY + 16, 25 * pulse);
    glow.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x + 16, bobY + 16, 25, 0, Math.PI*2); ctx.fill();
    
    // Rune Stone Body (Dark Slate)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(x + 16, bobY + 4);
    ctx.lineTo(x + 28, bobY + 12);
    ctx.lineTo(x + 24, bobY + 28);
    ctx.lineTo(x + 8, bobY + 28);
    ctx.lineTo(x + 4, bobY + 12);
    ctx.fill();
    
    // Highlights
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(x + 16, bobY + 4);
    ctx.lineTo(x + 8, bobY + 12);
    ctx.lineTo(x + 16, bobY + 16);
    ctx.fill();

    // Glowing Number
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.font = "bold 12px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(num, x + 16, bobY + 22);
    ctx.textAlign = 'start';
    ctx.shadowBlur = 0;

  } else if (type.includes('Skull')) {
    ctx.fillStyle = '#f5f6fa';
    ctx.fillRect(x + 6, bobY + 8, 20, 16);
    ctx.fillRect(x + 10, bobY + 24, 12, 6);
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(x + 10, bobY + 14, 4, 4);
    ctx.fillRect(x + 18, bobY + 14, 4, 4);

  } else if (type.includes('Boulder')) {
    // Massive etched boulders
    const weight = type.split('_')[1] || '';
    const sizeOffset = weight ? parseInt(weight) % 10 : 0;
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(x + 16, bobY + 32, 20 + sizeOffset, 8, 0, 0, Math.PI*2); ctx.fill();
    
    // Rock body
    ctx.fillStyle = '#636e72';
    ctx.beginPath();
    ctx.moveTo(x + 4 - sizeOffset, bobY + 30);
    ctx.lineTo(x + 16, bobY + 4 - sizeOffset*2);
    ctx.lineTo(x + 28 + sizeOffset, bobY + 24);
    ctx.lineTo(x + 20 + sizeOffset/2, bobY + 34);
    ctx.fill();
    
    // Highlights & Cracks
    ctx.fillStyle = '#b2bec3';
    ctx.beginPath();
    ctx.moveTo(x + 10, bobY + 26);
    ctx.lineTo(x + 16, bobY + 4 - sizeOffset*2);
    ctx.lineTo(x + 24, bobY + 20);
    ctx.fill();
    
    if (weight) {
      ctx.fillStyle = '#2d3436';
      ctx.font = "bold 12px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.fillText(weight, x + 16, bobY + 26);
      ctx.textAlign = 'start';
    }

  } else if (type.includes('Artifact_')) {
    // Levitating ancient reliquary crystal for Missing Number
    const num = type.split('_')[1];
    const pulse = Math.sin(time * 0.05) * 0.2 + 0.8;
    
    // Magical Aura
    const glow = ctx.createRadialGradient(x + 16, bobY + 16, 0, x + 16, bobY + 16, 30 * pulse);
    glow.addColorStop(0, 'rgba(155, 89, 182, 0.4)'); // Purple magic
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x + 16, bobY + 16, 30, 0, Math.PI*2); ctx.fill();
    
    // Crystal Shell
    ctx.fillStyle = 'rgba(241, 196, 15, 0.8)'; // Gold
    ctx.beginPath();
    ctx.moveTo(x + 16, bobY + 2);
    ctx.lineTo(x + 26, bobY + 16);
    ctx.lineTo(x + 16, bobY + 30);
    ctx.lineTo(x + 6, bobY + 16);
    ctx.fill();
    
    // Core Number
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 14px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(num, x + 16, bobY + 21);
    ctx.textAlign = 'start';

  } else if (type.includes('Crystal_')) {
    let cColor = type.includes('76') ? '#ff4757' : '#7ed6df';
    ctx.fillStyle = cColor;
    ctx.beginPath();
    ctx.moveTo(x + 16, bobY + 2);
    ctx.lineTo(x + 24, bobY + 16);
    ctx.lineTo(x + 16, bobY + 30);
    ctx.lineTo(x + 8, bobY + 16);
    ctx.fill();

  } else if (sceneType === 'rune_archive') {
    // Holographic Scrolls for Anagram Runes
    const pulse = Math.sin(time * 0.1) * 0.1 + 0.9;
    
    // Hologram Projector Base
    ctx.fillStyle = '#34495e';
    ctx.fillRect(x - 4, bobY + 30, 40, 6);
    ctx.fillStyle = '#1abc9c';
    ctx.fillRect(x + 10, bobY + 28, 12, 4);
    
    // Holographic Projection
    const holoGradient = ctx.createLinearGradient(x, bobY, x, bobY + 30);
    holoGradient.addColorStop(0, 'rgba(26, 188, 156, 0)');
    holoGradient.addColorStop(1, `rgba(26, 188, 156, ${0.5 * pulse})`);
    ctx.fillStyle = holoGradient;
    ctx.beginPath();
    ctx.moveTo(x - 10, bobY - 10);
    ctx.lineTo(x + 42, bobY - 10);
    ctx.lineTo(x + 22, bobY + 28);
    ctx.lineTo(x + 10, bobY + 28);
    ctx.fill();
    
    // Glowing Text
    ctx.fillStyle = `rgba(129, 236, 236, ${pulse})`;
    ctx.shadowColor = '#1abc9c';
    ctx.shadowBlur = 10;
    ctx.font = "bold 11px monospace";
    ctx.textAlign = 'center';
    ctx.fillText(type, x + 16, bobY + 10);
    ctx.textAlign = 'start';
    ctx.shadowBlur = 0;

  } else {
    const spriteKey = type.toLowerCase();
    if (SPRITES.relics[spriteKey]) {
      const palette = SPRITE_PALETTES[spriteKey] || SPRITE_PALETTES.apple;
      const matrix = SPRITES.relics[spriteKey];
      
      if (!collected) {
        const glowColor = type === 'potion' ? 'rgba(65,105,225,0.2)' : type === 'scroll' ? 'rgba(245,222,179,0.2)' : 'rgba(255,215,0,0.2)';
        const pulse = Math.sin(time * 0.06) * 0.1 + 0.15;
        const glow = ctx.createRadialGradient(x + 16, bobY + 16, 0, x + 16, bobY + 16, 30);
        glow.addColorStop(0, glowColor.replace('0.2', String(pulse)));
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x + 16, bobY + 16, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      
      drawSpriteMatrix(ctx, x - 8, bobY, matrix, palette, 2.5);
    } else {
      ctx.fillStyle = '#3d2611';
      ctx.fillRect(x - 5, y + 25, 42, 10);
      ctx.fillStyle = '#8b6508';
      ctx.fillRect(x - 2, y + 22, 36, 3);
      
      const tabletY = bobY - 5;
      
      ctx.fillStyle = '#8b6508';
      ctx.fillRect(x + 1, tabletY + 2, 30, 26);
      ctx.fillStyle = '#daa520';
      ctx.fillRect(x + 2, tabletY + 3, 28, 24);
      
      ctx.fillStyle = '#3d2611';
      ctx.font = "bold 10px 'Cinzel', monospace";
      ctx.textAlign = 'center';
      let displayStr = String(type).replace('_Tablet', '').replace('Rune_', '').replace('_Rune', '').replace(/_\d+$/, '');
      if (displayStr.length > 4) displayStr = displayStr.substring(0, 4) + '.';
      ctx.fillText(displayStr, x + 16, tabletY + 18);
      ctx.textAlign = 'start';

      if (!collected) {
        const pulse = Math.sin(time * 0.05) * 0.1 + 0.1;
        const glow = ctx.createRadialGradient(x + 16, tabletY + 15, 0, x + 16, tabletY + 15, 25);
        glow.addColorStop(0, `rgba(255, 215, 0, ${pulse})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(x + 16, tabletY + 15, 25, 0, Math.PI*2); ctx.fill();
      }
    }
  }
  
  ctx.globalAlpha = 1;

  // Label below pedestal (if provided and not hidden)
  if (label) {
    ctx.fillStyle = collected ? 'rgba(170,204,255,0.3)' : '#aaccff';
    ctx.font = "bold 9px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 12, y + 58);
    ctx.textAlign = 'start';
  }
}

// ── Draw Pixel Art Island ───────────────────────────────────
export function drawIsland(canvas, type = 'arrays', progress = 0, time = 0) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const palette = PALETTES.island[type] || PALETTES.island.arrays;
  const p = 3; // pixel size

  // Water shimmer around island
  const waterAlpha = 0.3 + Math.sin(time * 0.003) * 0.1;
  ctx.fillStyle = `rgba(43,122,184,${waterAlpha})`;
  for (let i = 0; i < 6; i++) {
    const wx = w * 0.1 + Math.sin(time * 0.002 + i) * 8;
    const wy = h * 0.75 + i * 4;
    ctx.fillRect(wx + i * 20, wy, 16, 3);
  }

  if (type === 'locked') {
    // Cloud island
    ctx.fillStyle = palette.cloud;
    drawEllipse(ctx, w * 0.2, h * 0.4, w * 0.6, h * 0.3);
    ctx.fillStyle = palette.mid;
    drawEllipse(ctx, w * 0.3, h * 0.35, w * 0.4, h * 0.2);

    // Lock icon
    ctx.fillStyle = '#607080';
    ctx.fillRect(w * 0.42, h * 0.35, w * 0.16, h * 0.2);
    ctx.strokeStyle = '#607080';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.35, w * 0.08, Math.PI, 0);
    ctx.stroke();
    return;
  }

  // Island base shape
  ctx.fillStyle = palette.outline;
  drawIslandShape(ctx, w * 0.1, h * 0.55, w * 0.8, h * 0.25);
  ctx.fillStyle = palette.base;
  drawIslandShape(ctx, w * 0.12, h * 0.5, w * 0.76, h * 0.22);
  ctx.fillStyle = palette.mid;
  drawIslandShape(ctx, w * 0.15, h * 0.45, w * 0.7, h * 0.18);

  // Top layer with details
  ctx.fillStyle = palette.top;
  drawIslandShape(ctx, w * 0.18, h * 0.4, w * 0.64, h * 0.12);

  // Type-specific decorations
  switch (type) {
    case 'arrays':
      // Green trees
      drawTree(ctx, w * 0.25, h * 0.3, p);
      drawTree(ctx, w * 0.55, h * 0.28, p);
      drawTree(ctx, w * 0.7, h * 0.32, p);
      // Little houses
      drawHouse(ctx, w * 0.4, h * 0.35, p);
      // Grid lines (arrays reference)
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.strokeRect(w * 0.3 + i * 12, h * 0.42, 10, 8);
      }
      break;

    case 'stacks':
      // Golden Castle / Tower
      ctx.fillStyle = '#b8860b';
      ctx.fillRect(w * 0.4, h * 0.25, w * 0.2, h * 0.15); // main keep
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(w * 0.45, h * 0.15, w * 0.1, h * 0.1); // top tower
      
      // Castle battlements (teeth)
      ctx.fillStyle = '#daa520';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(w * 0.4 + i * w * 0.08, h * 0.22, w * 0.04, h * 0.03);
      }
      
      // Gate
      ctx.fillStyle = '#4a3b2c';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.4, w * 0.04, Math.PI, 0);
      ctx.fillRect(w * 0.46, h * 0.4, w * 0.08, h * 0.05);
      ctx.fill();
      
      // Glowing accent (Stack tower energy)
      ctx.fillStyle = '#ff8c00';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.1, 4 + Math.sin(time * 0.05) * 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'linked':
      // Sand dunes / ruins
      ctx.fillStyle = '#e0c890';
      drawEllipse(ctx, w * 0.2, h * 0.38, w * 0.2, h * 0.08);
      drawEllipse(ctx, w * 0.5, h * 0.36, w * 0.15, h * 0.06);
      // Column ruins
      ctx.fillStyle = '#c4a870';
      ctx.fillRect(w * 0.3, h * 0.25, 4 * p, 12 * p);
      ctx.fillRect(w * 0.6, h * 0.28, 4 * p, 10 * p);
      // Chain links
      ctx.strokeStyle = '#8b6914';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(w * 0.3 + 6, h * 0.32);
      ctx.lineTo(w * 0.6 + 6, h * 0.35);
      ctx.stroke();
      ctx.setLineDash([]);
      break;

    case 'trees':
      // Large enchanted trees
      drawTree(ctx, w * 0.2, h * 0.22, p + 1);
      drawTree(ctx, w * 0.45, h * 0.2, p + 2);
      drawTree(ctx, w * 0.7, h * 0.24, p + 1);
      // Vines
      ctx.strokeStyle = `rgba(58,174,104,${0.5 + Math.sin(time * 0.003) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.28, h * 0.28);
      ctx.quadraticCurveTo(w * 0.35, h * 0.35, w * 0.45, h * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.58, h * 0.26);
      ctx.quadraticCurveTo(w * 0.62, h * 0.32, w * 0.7, h * 0.3);
      ctx.stroke();
      // Owl eyes
      const owlBlink = Math.sin(time * 0.002) > 0.95 ? 0 : 1;
      if (owlBlink) {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(w * 0.48, h * 0.22, 2 * p, 2 * p);
        ctx.fillRect(w * 0.54, h * 0.22, 2 * p, 2 * p);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(w * 0.49, h * 0.23, p, p);
        ctx.fillRect(w * 0.55, h * 0.23, p, p);
      }
      break;
  }
}

// ── Helper Shapes ───────────────────────────────────────────
function drawEllipse(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawIslandShape(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x + w * 0.1, y + h);
  ctx.quadraticCurveTo(x, y + h * 0.3, x + w * 0.2, y);
  ctx.quadraticCurveTo(x + w * 0.5, y - h * 0.3, x + w * 0.8, y);
  ctx.quadraticCurveTo(x + w, y + h * 0.3, x + w * 0.9, y + h);
  ctx.closePath();
  ctx.fill();
}

function drawTree(ctx, x, y, p) {
  // Trunk
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(x + p, y + 4 * p, 2 * p, 4 * p);
  // Foliage
  ctx.fillStyle = '#2d8a3e';
  ctx.fillRect(x - p, y, 6 * p, 3 * p);
  ctx.fillRect(x, y - 2 * p, 4 * p, 2 * p);
  ctx.fillStyle = '#3ea854';
  ctx.fillRect(x, y + p, 4 * p, p);
}

function drawHouse(ctx, x, y, p) {
  // Wall
  ctx.fillStyle = '#e8c898';
  ctx.fillRect(x, y + 2 * p, 6 * p, 4 * p);
  // Roof
  ctx.fillStyle = '#c44';
  ctx.beginPath();
  ctx.moveTo(x - p, y + 2 * p);
  ctx.lineTo(x + 3 * p, y);
  ctx.lineTo(x + 7 * p, y + 2 * p);
  ctx.fill();
  // Door
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(x + 2 * p, y + 3 * p, 2 * p, 3 * p);
}

function drawCoral(ctx, x, y, p) {
  ctx.fillStyle = '#ff6b8a';
  ctx.fillRect(x, y, 2 * p, 5 * p);
  ctx.fillRect(x - p, y + p, p, 3 * p);
  ctx.fillRect(x + 2 * p, y + 2 * p, p, 2 * p);
  ctx.fillStyle = '#ff8da8';
  ctx.fillRect(x, y, p, 3 * p);
}


// ── Particle System ─────────────────────────────────────────
export class ParticleSystem {
  constructor(maxParticles = 50) {
    this.particles = [];
    this.maxParticles = maxParticles;
  }

  emit(x, y, config = {}) {
    if (this.particles.length >= this.maxParticles) return;
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * (config.speed || 2),
      vy: -(Math.random() * (config.speed || 2)),
      life: config.life || 60,
      maxLife: config.life || 60,
      size: config.size || 2,
      color: config.color || '#ffcc44',
      gravity: config.gravity || 0,
    });
  }

  update() {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;
      return p.life > 0;
    });
  }

  draw(ctx) {
    this.particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }
}


// ── Command Queue Types ─────────────────────────────────────
// Commands produced by the parser when user runs code:
//   { type: 'MOVE_TO', targetX: <pixel x>, label: 'SAPPHIRE' }
//   { type: 'PICKUP', item: 'SAPPHIRE' }
//   { type: 'MOVE_TO', targetX: <pixel x>, label: 'home' }
//   { type: 'POP_ITEM', item: 'SAPPHIRE' }
//   { type: 'WAIT', frames: 30 }

// ── LINKED LIST CUSTOM SCENES ─────────────────────────────────

function drawDesertRuinsScene(ctx, width, height, time) {
  // Twilight sunset sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  skyGrad.addColorStop(0, '#1a0b2e'); // Deep night purple
  skyGrad.addColorStop(0.4, '#8e44ad'); // Purple
  skyGrad.addColorStop(0.7, '#e74c3c'); // Red sunset
  skyGrad.addColorStop(1, '#f1c40f'); // Golden horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Early stars in the purple sky
  for (let i = 0; i < 40; i++) {
    const sx = Math.abs(Math.sin(i * 31)) * width;
    const sy = Math.abs(Math.cos(i * 17)) * height * 0.4;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
    ctx.fillRect(sx, sy, 1, 1);
  }

  // Giant setting sun
  const sunY = height * 0.6;
  const sunPulse = Math.sin(time * 0.02) * 10;
  
  // Sun bloom
  const sunBloom = ctx.createRadialGradient(width * 0.7, sunY, 0, width * 0.7, sunY, 150 + sunPulse);
  sunBloom.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  sunBloom.addColorStop(0.3, 'rgba(241, 196, 15, 0.5)');
  sunBloom.addColorStop(1, 'rgba(241, 196, 15, 0)');
  ctx.fillStyle = sunBloom;
  ctx.beginPath(); ctx.arc(width * 0.7, sunY, 150 + sunPulse, 0, Math.PI*2); ctx.fill();

  // Solid sun core
  ctx.fillStyle = '#fffae6';
  ctx.beginPath(); ctx.arc(width * 0.7, sunY, 60, 0, Math.PI*2); ctx.fill();

  // Distant Pyramids
  function drawPyramid(px, py, w, h) {
    // Left lit side
    ctx.fillStyle = '#b9770e';
    ctx.beginPath();
    ctx.moveTo(px, py - h);
    ctx.lineTo(px - w/2, py);
    ctx.lineTo(px, py);
    ctx.fill();
    // Right shadow side
    ctx.fillStyle = '#7e5109';
    ctx.beginPath();
    ctx.moveTo(px, py - h);
    ctx.lineTo(px + w/2, py);
    ctx.lineTo(px, py);
    ctx.fill();
  }
  drawPyramid(width * 0.3, height * 0.55, 200, 100);
  drawPyramid(width * 0.8, height * 0.58, 150, 80);
  drawPyramid(width * 0.45, height * 0.6, 120, 60);

  // Layered Dunes
  function drawDuneLayer(baseY, amp, freq, offset, color, timeFactor = 0) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, height); // start bottom left
    ctx.lineTo(0, baseY);
    for (let x = 0; x <= width; x += 10) {
      const y = baseY + Math.sin(x * freq + offset + time * timeFactor) * amp + Math.cos(x * freq * 0.5) * (amp * 0.5);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.fill();
    
    // Add pixel texture to dunes
    for (let i = 0; i < 50; i++) {
      const tx = Math.random() * width;
      const ty = baseY + Math.random() * (height - baseY);
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`;
      ctx.fillRect(tx, ty, 2, 2);
    }
  }

  drawDuneLayer(height * 0.6, 30, 0.003, 0, '#9c640c'); // Back
  drawDuneLayer(height * 0.68, 40, 0.004, 2, '#88560a'); // Mid
  drawDuneLayer(height * 0.75, 20, 0.005, 5, '#704708'); // Front foreground

  // Floating ambient sand dust
  for(let i=0; i<30; i++) {
    const dx = (time * 0.5 + i * 40) % width;
    const dy = height * 0.6 + Math.sin(time * 0.02 + i) * 100;
    ctx.fillStyle = `rgba(241, 196, 15, ${Math.random() * 0.3})`;
    ctx.fillRect(dx, dy, 2, 2);
  }
}

function drawDesertOasisScene(ctx, width, height, time) {
  // Clear bright sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  skyGrad.addColorStop(0, '#3498db');
  skyGrad.addColorStop(1, '#85c1e9');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Distant sand
  ctx.fillStyle = '#f39c12';
  ctx.fillRect(0, height * 0.5, width, height * 0.5);

  // The Oasis Water
  const waterGrad = ctx.createLinearGradient(0, height * 0.6, 0, height);
  waterGrad.addColorStop(0, '#1abc9c');
  waterGrad.addColorStop(1, '#16a085');
  ctx.fillStyle = waterGrad;
  
  ctx.beginPath();
  ctx.moveTo(width * 0.2, height * 0.6);
  ctx.quadraticCurveTo(width * 0.5, height * 0.55 + Math.sin(time * 0.02)*10, width * 0.8, height * 0.6);
  ctx.quadraticCurveTo(width * 0.9, height * 0.8, width * 0.7, height);
  ctx.lineTo(width * 0.3, height);
  ctx.quadraticCurveTo(width * 0.1, height * 0.8, width * 0.2, height * 0.6);
  ctx.fill();

  // Water ripples
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    const rx = width * 0.3 + i * 50 + Math.sin(time*0.05 + i)*10;
    const ry = height * 0.7 + i * 20;
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + 40, ry);
    ctx.stroke();
  }

  // Palm trees
  function drawPalm(px, py, scale) {
    ctx.fillStyle = '#6e2c00';
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px + 10 * scale, py - 60 * scale, px + 20 * scale, py - 100 * scale);
    ctx.lineTo(px + 10 * scale, py - 100 * scale);
    ctx.quadraticCurveTo(px, py - 60 * scale, px - 10 * scale, py);
    ctx.fill();
    // Leaves
    ctx.fillStyle = '#229954';
    for (let l = 0; l < 5; l++) {
      ctx.save();
      ctx.translate(px + 15 * scale, py - 95 * scale);
      ctx.rotate((l * Math.PI / 2.5) + Math.sin(time * 0.05) * 0.1);
      ctx.beginPath();
      ctx.ellipse(30 * scale, 0, 40 * scale, 10 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  drawPalm(width * 0.2, height * 0.65, 0.8);
  drawPalm(width * 0.85, height * 0.7, 1.2);
  drawPalm(width * 0.1, height * 0.8, 1.5);
}

function drawCursedRuinsScene(ctx, width, height, time) {
  // Ominous sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#190a23'); // deep purple/black
  skyGrad.addColorStop(1, '#4a0000'); // dark crimson
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Lightning flashes
  if (Math.random() < 0.05) {
    ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.3})`;
    ctx.fillRect(0, 0, width, height);
    
    // Draw bolt
    ctx.strokeStyle = '#ff3333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let lx = width * Math.random();
    let ly = 0;
    ctx.moveTo(lx, ly);
    while (ly < height * 0.6) {
      lx += (Math.random() - 0.5) * 60;
      ly += Math.random() * 40 + 20;
      ctx.lineTo(lx, ly);
    }
    ctx.stroke();
  }

  // Obsidian sand dunes
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.5);
  for (let x = 0; x <= width; x += 20) {
    ctx.lineTo(x, height * 0.65 + Math.sin(x * 0.01) * 50);
  }
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();

  // Floating cursed monoliths
  for (let i = 0; i < 5; i++) {
    const mx = width * 0.1 + i * 200;
    const my = height * 0.4 + Math.sin(time * 0.06 + i * 2) * 25;
    
    // Monolith body
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.moveTo(mx, my - 60);
    ctx.lineTo(mx + 30, my);
    ctx.lineTo(mx, my + 60);
    ctx.lineTo(mx - 30, my);
    ctx.fill();

    // Glowing red cursed runes
    ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(time*0.1 + i)*0.5})`;
    ctx.textAlign = 'center';
    ctx.font = '24px monospace';
    ctx.fillText('NULL', mx, my + 8);
  }
}

function drawMysticRuinsScene(ctx, width, height, time) {
  // Starry deep blue night
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#0a192f');
  skyGrad.addColorStop(1, '#112240');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Twinkling stars
  for (let i = 0; i < 100; i++) {
    const sx = Math.abs(Math.sin(i * 123)) * width;
    const sy = Math.abs(Math.cos(i * 321)) * height * 0.7;
    const twinkle = Math.sin(time * 0.05 + i);
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle > 0 ? 0.8 : 0.2})`;
    ctx.fillRect(sx, sy, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1);
  }

  // Giant glowing constellation shaped like a Linked List
  ctx.strokeStyle = `rgba(100, 200, 255, ${0.2 + Math.sin(time * 0.02) * 0.1})`;
  ctx.lineWidth = 2;
  const nodes = [
    {x: width*0.2, y: height*0.2},
    {x: width*0.4, y: height*0.15},
    {x: width*0.6, y: height*0.25},
    {x: width*0.8, y: height*0.15}
  ];
  
  ctx.beginPath();
  ctx.moveTo(nodes[0].x, nodes[0].y);
  for (let i = 1; i < nodes.length; i++) {
    ctx.lineTo(nodes[i].x, nodes[i].y);
  }
  ctx.stroke();

  nodes.forEach(n => {
    ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
    ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, Math.PI*2); ctx.fill();
  });

  // Bioluminescent sand
  ctx.fillStyle = '#0f2027';
  ctx.fillRect(0, height * 0.6, width, height * 0.4);
  
  for (let i = 0; i < 50; i++) {
    const bx = Math.abs(Math.sin(i * 456)) * width;
    const by = height * 0.6 + Math.abs(Math.cos(i * 654)) * height * 0.4;
    ctx.fillStyle = `rgba(0, 255, 255, ${0.1 + Math.sin(time*0.05 + i)*0.3})`;
    ctx.beginPath(); ctx.arc(bx, by, 3, 0, Math.PI*2); ctx.fill();
  }
}

function drawDeadlyLoopScene(ctx, width, height, time) {
  // Violent storm sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#5e3a1f');
  skyGrad.addColorStop(1, '#9e6236');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Massive Sand Whirlpool
  const cx = width * 0.5;
  const cy = height * 0.4;
  
  for (let r = 300; r > 20; r -= 30) {
    ctx.strokeStyle = `rgba(211, 84, 0, ${0.1 + r/1000})`;
    ctx.lineWidth = 15;
    ctx.beginPath();
    // Wobble effect
    const wobbleX = Math.sin(time * 0.05 + r) * 20;
    const wobbleY = Math.cos(time * 0.05 + r) * 10;
    ctx.ellipse(cx + wobbleX, cy + wobbleY, r, r * 0.4, time * 0.02, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Debris stuck in the infinite loop
  for (let i = 0; i < 12; i++) {
    const angle = time * 0.05 + (i * Math.PI * 2) / 12;
    const radius = 150 + Math.sin(i * 99) * 50;
    const dx = cx + Math.cos(angle) * radius;
    const dy = cy + Math.sin(angle) * radius * 0.4;

    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(time * 0.1 + i);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-15, -15, 30, 30);
    ctx.fillStyle = '#e74c3c';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('∞', 0, 6);
    ctx.restore();
  }

  // Foreground dark sand
  ctx.fillStyle = '#3e2723';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  ctx.quadraticCurveTo(width * 0.5, height * 0.6, width, height * 0.8);
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
}

function drawCountingRuinsScene(ctx, width, height, time) {
  // Deep sandstone cavern background
  const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.8);
  bgGrad.addColorStop(0, '#5e3a1f'); // light brown core
  bgGrad.addColorStop(1, '#1c1005'); // very dark brown edges
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Background cavern walls (stalactites)
  ctx.fillStyle = '#2b1a0a';
  for (let i = 0; i < 15; i++) {
    const rx = i * (width / 15);
    const rh = 100 + Math.sin(i * 42) * 50;
    ctx.beginPath();
    ctx.moveTo(rx - 20, 0);
    ctx.lineTo(rx + 20, 0);
    ctx.lineTo(rx, rh);
    ctx.fill();
  }

  // Giant glowing tally marks on the wall
  ctx.strokeStyle = `rgba(255, 215, 0, ${0.4 + Math.sin(time * 0.05) * 0.3})`;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const tallyStartY = height * 0.3;
  for (let group = 0; group < 5; group++) {
    const groupX = width * 0.2 + group * 120;
    // Draw 4 vertical strokes
    for (let stroke = 0; stroke < 4; stroke++) {
      ctx.beginPath();
      ctx.moveTo(groupX + stroke * 15, tallyStartY + Math.random() * 5);
      ctx.lineTo(groupX + stroke * 15 + Math.random() * 5, tallyStartY + 60);
      ctx.stroke();
    }
    // Draw the 5th diagonal slash
    ctx.beginPath();
    ctx.moveTo(groupX - 5, tallyStartY + 50);
    ctx.lineTo(groupX + 55, tallyStartY + 10);
    ctx.stroke();
  }

  // Golden sand waterfall in the background
  const fallX = width * 0.85;
  const fallGrad = ctx.createLinearGradient(0, 0, 0, height);
  fallGrad.addColorStop(0, 'rgba(241, 196, 15, 0)');
  fallGrad.addColorStop(0.5, 'rgba(241, 196, 15, 0.6)');
  fallGrad.addColorStop(1, 'rgba(241, 196, 15, 0)');
  ctx.fillStyle = fallGrad;
  
  ctx.beginPath();
  ctx.moveTo(fallX - 20, 0);
  ctx.lineTo(fallX + 20, 0);
  ctx.quadraticCurveTo(fallX + 30 + Math.sin(time*0.1)*10, height/2, fallX + 20, height);
  ctx.lineTo(fallX - 20, height);
  ctx.quadraticCurveTo(fallX - 30 + Math.cos(time*0.1)*10, height/2, fallX - 20, 0);
  ctx.fill();

  // Cavern floor
  ctx.fillStyle = '#3d2611';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);
  ctx.quadraticCurveTo(width * 0.5, height * 0.75, width, height * 0.65);
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
}

// ── Game Scene Renderer ─────────────────────────────────────
// ── TREES & GRAPHS CUSTOM SCENES ──────────────────────────────

function drawEnchantedForestScene(ctx, width, height, time) {
  // Deep magical green forest background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#062615');
  bgGrad.addColorStop(1, '#0e4a2d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Distant giant tree silhouettes
  ctx.fillStyle = '#03140a';
  for(let i=0; i<6; i++) {
    const tx = width * 0.1 + i * width * 0.2 + Math.sin(i*77)*50;
    ctx.fillRect(tx, 0, 40 + (i%3)*20, height);
    // Branches
    ctx.beginPath();
    ctx.moveTo(tx + 20, height*0.4);
    ctx.quadraticCurveTo(tx + 80, height*0.3, tx + 100, height*0.2);
    ctx.lineTo(tx + 20, height*0.25);
    ctx.fill();
  }

  // Soft falling magical leaves
  for(let i=0; i<40; i++) {
    const lx = (time * 0.5 + i * 45) % width;
    const ly = (time * 1.5 + i * 87) % height;
    ctx.fillStyle = `rgba(154, 255, 128, ${Math.random()*0.5 + 0.2})`;
    ctx.beginPath();
    ctx.ellipse(lx, ly, 4, 2, Math.sin(time*0.05 + i), 0, Math.PI*2);
    ctx.fill();
  }

  // Glowing fireflies
  for(let i=0; i<20; i++) {
    const fx = width * 0.5 + Math.sin(time * 0.02 + i*32) * width * 0.4;
    const fy = height * 0.6 + Math.cos(time * 0.03 + i*17) * 100;
    const pulse = Math.sin(time * 0.1 + i)*0.5 + 0.5;
    
    ctx.fillStyle = `rgba(255, 255, 100, ${pulse})`;
    ctx.beginPath(); ctx.arc(fx, fy, 2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = `rgba(255, 255, 100, ${pulse * 0.2})`;
    ctx.beginPath(); ctx.arc(fx, fy, 10, 0, Math.PI*2); ctx.fill();
  }

  // Forest Floor
  ctx.fillStyle = '#1e3816';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);
  ctx.quadraticCurveTo(width * 0.5, height * 0.6, width, height * 0.65);
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
  
  // Ferns on floor
  ctx.fillStyle = '#2d5a27';
  for(let i=0; i<10; i++) {
    const fnx = i * (width/10) + 20;
    ctx.beginPath();
    ctx.moveTo(fnx, height);
    ctx.quadraticCurveTo(fnx - 20, height*0.7, fnx + 10, height*0.65);
    ctx.quadraticCurveTo(fnx + 5, height*0.7, fnx + 20, height);
    ctx.fill();
  }
}

function drawAncientMessageScene(ctx, width, height, time) {
  // Twilight purple and gold sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#2c1938');
  skyGrad.addColorStop(1, '#5c3a21');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Distant faded monoliths
  ctx.fillStyle = 'rgba(40, 25, 45, 0.5)';
  for(let i=0; i<4; i++) {
    const mx = width * 0.2 + i * width*0.3;
    ctx.fillRect(mx - 20, height*0.3, 40, height);
  }

  // Soft mystical golden pollen
  for(let i=0; i<40; i++) {
    const lx = (time * 0.3 + i * 55) % width;
    const ly = height * 0.2 + (time * 0.5 + i * 33) % (height * 0.8);
    ctx.fillStyle = `rgba(255, 215, 0, ${Math.random()*0.4 + 0.1})`;
    ctx.beginPath();
    ctx.arc(lx, ly, 1 + Math.sin(time*0.05 + i), 0, Math.PI*2);
    ctx.fill();
  }

  // Giant ancient stone monoliths in the midground
  ctx.fillStyle = '#2d1b2e';
  ctx.strokeStyle = `rgba(255, 215, 0, ${0.4 + Math.sin(time*0.05)*0.2})`;
  ctx.lineWidth = 2;
  for(let i=0; i<3; i++) {
    const mx = width * 0.15 + i * width*0.35 + Math.sin(time*0.01 + i)*10;
    
    // Monolith Body
    ctx.beginPath();
    ctx.moveTo(mx - 30, height);
    ctx.lineTo(mx - 20, height*0.4);
    ctx.lineTo(mx, height*0.35);
    ctx.lineTo(mx + 20, height*0.4);
    ctx.lineTo(mx + 30, height);
    ctx.fill();

    // Glowing ancient runes on monolith
    ctx.beginPath();
    ctx.moveTo(mx, height*0.4);
    ctx.lineTo(mx, height*0.8);
    ctx.stroke();
    
    // Cross strokes
    for(let j=0; j<4; j++) {
      ctx.beginPath();
      ctx.moveTo(mx - 10, height*0.45 + j*30);
      ctx.lineTo(mx + 10, height*0.48 + j*30);
      ctx.stroke();
    }
  }

  // Forest/Path Floor
  ctx.fillStyle = '#1e1112';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);
  ctx.quadraticCurveTo(width * 0.5, height * 0.6, width, height * 0.65);
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();

  // Glowing runes etched into the floor
  ctx.strokeStyle = `rgba(255, 215, 0, ${0.2 + Math.sin(time*0.03)*0.1})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, height*0.75);
  ctx.quadraticCurveTo(width*0.5, height*0.7, width, height*0.8);
  ctx.stroke();
}

function drawGreatTreeScene(ctx, width, height, time) {
  // Bright blue sky transitioning to atmosphere
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#5DADE2');
  skyGrad.addColorStop(1, '#AED6F6');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Distant clouds
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for(let i=0; i<5; i++) {
    const cx = (time * 0.2 + i * 200) % (width + 200) - 100;
    const cy = height * 0.1 + (i%3)*50;
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI*2);
    ctx.arc(cx+30, cy-20, 50, 0, Math.PI*2);
    ctx.arc(cx+60, cy, 40, 0, Math.PI*2);
    ctx.fill();
  }

  // The Colossal Great Tree Trunk
  const trunkW = width * 0.4;
  const trunkX = width * 0.5 - trunkW/2;
  
  const barkGrad = ctx.createLinearGradient(trunkX, 0, trunkX + trunkW, 0);
  barkGrad.addColorStop(0, '#3E2723');
  barkGrad.addColorStop(0.2, '#5D4037');
  barkGrad.addColorStop(0.8, '#4E342E');
  barkGrad.addColorStop(1, '#212121');
  ctx.fillStyle = barkGrad;
  ctx.fillRect(trunkX, 0, trunkW, height);

  // Giant glowing runic sap lines
  ctx.strokeStyle = `rgba(46, 204, 113, ${0.5 + Math.sin(time*0.05)*0.3})`;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(trunkX + trunkW*0.3, height);
  ctx.quadraticCurveTo(trunkX + trunkW*0.4, height*0.5, trunkX + trunkW*0.2, 0);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(trunkX + trunkW*0.7, height);
  ctx.quadraticCurveTo(trunkX + trunkW*0.5, height*0.6, trunkX + trunkW*0.8, 0);
  ctx.stroke();

  // Floating platforms (leaves/bark)
  for(let i=0; i<3; i++) {
    const px = width * 0.1 + i*width*0.3;
    const py = height * 0.65 + Math.sin(time*0.04 + i)*10;
    
    ctx.fillStyle = '#27AE60';
    ctx.beginPath();
    ctx.ellipse(px, py, 60, 15, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#2ECC71';
    ctx.beginPath();
    ctx.ellipse(px, py-2, 55, 12, 0, 0, Math.PI*2);
    ctx.fill();
  }
}

function drawMirrorForestScene(ctx, width, height, time) {
  // Upper sky (Dark teal night)
  ctx.fillStyle = '#0B5345';
  ctx.fillRect(0, 0, width, height/2);
  
  // Upper Trees
  ctx.fillStyle = '#145A32';
  for(let i=0; i<8; i++) {
    const tx = i * width/8 + 20;
    ctx.beginPath();
    ctx.moveTo(tx, height/2);
    ctx.lineTo(tx - 30, height/2 - 150 + Math.sin(i*4)*30);
    ctx.lineTo(tx + 30, height/2 - 150 + Math.cos(i*4)*30);
    ctx.fill();
  }

  // The Mirror Lake (Lower half)
  const lakeGrad = ctx.createLinearGradient(0, height/2, 0, height);
  lakeGrad.addColorStop(0, '#117A65');
  lakeGrad.addColorStop(1, '#0B5345');
  ctx.fillStyle = lakeGrad;
  ctx.fillRect(0, height/2, width, height/2);

  // Mirrored Trees (Lower half, upside down)
  ctx.fillStyle = 'rgba(20, 90, 50, 0.6)';
  for(let i=0; i<8; i++) {
    const tx = i * width/8 + 20;
    ctx.beginPath();
    ctx.moveTo(tx, height/2);
    ctx.lineTo(tx - 30, height/2 + 150 - Math.sin(i*4)*30);
    ctx.lineTo(tx + 30, height/2 + 150 - Math.cos(i*4)*30);
    ctx.fill();
  }

  // Ripple effect on the mirror line
  ctx.strokeStyle = `rgba(163, 228, 215, ${0.3 + Math.sin(time*0.05)*0.2})`;
  ctx.lineWidth = 2;
  for(let r=0; r<4; r++) {
    ctx.beginPath();
    ctx.moveTo(0, height/2 + r*10);
    for(let x=0; x<=width; x+=20) {
      ctx.lineTo(x, height/2 + r*10 + Math.sin(x*0.05 + time*0.1 + r)*3);
    }
    ctx.stroke();
  }
  
  // The glass platform the player stands on
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, height*0.65, width, 5);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(0, height*0.65, width, 1);
}

function drawMagicPathScene(ctx, width, height, time) {
  // Midnight forest
  ctx.fillStyle = '#1A1A2E';
  ctx.fillRect(0, 0, width, height);

  // Dense dark trees
  ctx.fillStyle = '#0F0F1A';
  for(let i=0; i<15; i++) {
    const tx = i * width/15;
    ctx.fillRect(tx, 0, 20, height);
  }

  // Winding glowing path
  ctx.strokeStyle = '#2E004F';
  ctx.lineWidth = 150;
  ctx.beginPath();
  ctx.moveTo(0, height*0.8);
  ctx.quadraticCurveTo(width*0.5, height*0.5, width, height*0.8);
  ctx.stroke();
  
  // Glowing magical markers along the path
  for(let i=0; i<6; i++) {
    const mx = width * 0.1 + i * width*0.16;
    const my = height * 0.65 + Math.sin(mx*0.01)*50;
    
    // Mushroom glow
    const pulse = Math.sin(time*0.05 + i)*0.3 + 0.7;
    const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 40);
    glow.addColorStop(0, `rgba(155, 89, 182, ${pulse})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(mx, my, 40, 0, Math.PI*2); ctx.fill();
    
    // Mushroom cap
    ctx.fillStyle = '#8E44AD';
    ctx.beginPath(); ctx.arc(mx, my, 15, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#E0B0FF';
    ctx.beginPath(); ctx.arc(mx-5, my-5, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx+5, my-3, 2, 0, Math.PI*2); ctx.fill();
    // Stem
    ctx.fillStyle = '#D2B4DE';
    ctx.fillRect(mx-3, my, 6, 15);
  }

  // Floor
  ctx.fillStyle = '#160B22';
  ctx.beginPath();
  ctx.moveTo(0, height*0.65);
  ctx.lineTo(width, height*0.65);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();
}

function drawGraphMazeScene(ctx, width, height, time) {
  // Foggy grey sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#5D6D7E');
  skyGrad.addColorStop(1, '#2C3E50');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Distant labyrinth walls
  ctx.fillStyle = '#34495E';
  ctx.fillRect(width*0.1, height*0.3, width*0.2, height);
  ctx.fillRect(width*0.4, height*0.25, width*0.15, height);
  ctx.fillRect(width*0.7, height*0.35, width*0.2, height);
  
  // Midground walls
  ctx.fillStyle = '#273746';
  ctx.fillRect(0, height*0.4, width*0.15, height);
  ctx.fillRect(width*0.25, height*0.45, width*0.1, height);
  ctx.fillRect(width*0.6, height*0.4, width*0.25, height);
  ctx.fillRect(width*0.9, height*0.5, width*0.1, height);

  // Ivy/Vines on walls
  ctx.strokeStyle = '#1E8449';
  ctx.lineWidth = 4;
  for(let i=0; i<10; i++) {
    const vx = i * width*0.1 + 10;
    ctx.beginPath();
    ctx.moveTo(vx, height*0.2);
    ctx.quadraticCurveTo(vx + 20, height*0.4, vx - 10, height*0.6);
    ctx.stroke();
  }

  // Glowing graph connections between ruins
  ctx.strokeStyle = `rgba(52, 152, 219, ${0.4 + Math.sin(time*0.05)*0.2})`;
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 10]);
  ctx.lineDashOffset = -time * 0.5;
  ctx.beginPath();
  ctx.moveTo(width*0.2, height*0.5);
  ctx.lineTo(width*0.5, height*0.4);
  ctx.lineTo(width*0.8, height*0.6);
  ctx.stroke();
  ctx.setLineDash([]);

  // Maze Floor
  ctx.fillStyle = '#1C2833';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);
  ctx.lineTo(width, height * 0.65);
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
  
  // Grid pattern on floor
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 2;
  for(let i=0; i<width; i+=40) {
    ctx.beginPath(); ctx.moveTo(i, height*0.65); ctx.lineTo(i - 40, height); ctx.stroke();
  }
}

function drawSignalTowerForestScene(ctx, width, height, time) {
  // Sunset orange/red sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#E74C3C');
  skyGrad.addColorStop(1, '#F39C12');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Distant smoke signals
  ctx.fillStyle = 'rgba(236, 240, 241, 0.3)';
  for(let i=0; i<3; i++) {
    const sx = width * 0.2 + i * width * 0.3 + Math.sin(time*0.02 + i)*30;
    for(let j=0; j<5; j++) {
      ctx.beginPath();
      ctx.arc(sx + Math.sin(time*0.05 + j)*15, height*0.4 - j*40 - (time*0.5)%50, 20 + j*10, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // Giant Wooden Watchtower
  const tX = width * 0.3;
  const tW = width * 0.4;
  
  // Tower structure
  ctx.fillStyle = '#5D4037';
  ctx.fillRect(tX, 0, 20, height);
  ctx.fillRect(tX + tW - 20, 0, 20, height);
  
  // Crossbeams
  ctx.strokeStyle = '#4E342E';
  ctx.lineWidth = 15;
  for(let i=0; i<6; i++) {
    const y = i * height * 0.2;
    ctx.beginPath(); ctx.moveTo(tX, y); ctx.lineTo(tX + tW, y + height*0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tX + tW, y); ctx.lineTo(tX, y + height*0.2); ctx.stroke();
    
    // Wooden platforms for signals
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(tX - 20, y, tW + 40, 20);
    
    // Signal fire at each level
    const fireX = tX + tW/2;
    const fireY = y - 10;
    
    // Fire glow
    const pulse = Math.sin(time*0.1 + i)*0.2 + 0.8;
    const glow = ctx.createRadialGradient(fireX, fireY, 0, fireX, fireY, 50);
    glow.addColorStop(0, `rgba(255, 100, 0, ${pulse})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(fireX, fireY, 50, 0, Math.PI*2); ctx.fill();
    
    // Fire core
    ctx.fillStyle = '#F1C40F';
    ctx.beginPath(); ctx.moveTo(fireX-15, fireY); ctx.lineTo(fireX, fireY-30*pulse); ctx.lineTo(fireX+15, fireY); ctx.fill();
    ctx.fillStyle = '#E67E22';
    ctx.beginPath(); ctx.moveTo(fireX-10, fireY); ctx.lineTo(fireX, fireY-20*pulse); ctx.lineTo(fireX+10, fireY); ctx.fill();
  }

  // Floor
  ctx.fillStyle = '#212F3C';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);
  ctx.lineTo(width, height * 0.65);
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
}

function drawAutumnLeafFallScene(ctx, width, height, time) {
  // Golden yellow sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#F1C40F');
  skyGrad.addColorStop(1, '#D35400');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Autumn trees in background
  for(let i=0; i<8; i++) {
    const tx = i * width/8 + 20;
    
    // Trunk
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(tx-10, height*0.3, 20, height*0.35);
    
    // Leaves canopy
    const colors = ['#E67E22', '#C0392B', '#D35400'];
    ctx.fillStyle = colors[i%3];
    ctx.beginPath();
    ctx.arc(tx, height*0.3, 60 + Math.sin(i*7)*10, 0, Math.PI*2);
    ctx.arc(tx-30, height*0.35, 50, 0, Math.PI*2);
    ctx.arc(tx+30, height*0.35, 50, 0, Math.PI*2);
    ctx.fill();
  }

  // HUNDREDS of swirling falling leaves
  for(let i=0; i<150; i++) {
    const lx = (time * 2 + i * 45 + Math.sin(time*0.05 + i)*50) % width;
    const ly = (time * 3 + i * 87) % height;
    
    const colors = ['#E67E22', '#C0392B', '#F1C40F'];
    ctx.fillStyle = colors[i%3];
    
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate((time * 0.05 + i) % (Math.PI*2));
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // Orange forest floor
  ctx.fillStyle = '#BA4A00';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);
  ctx.quadraticCurveTo(width * 0.5, height * 0.6, width, height * 0.65);
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
}

function drawCrystalCavePathScene(ctx, width, height, time) {
  // Dark cave background
  ctx.fillStyle = '#0B0B1A';
  ctx.fillRect(0, 0, width, height);

  // Cave stalactites
  ctx.fillStyle = '#1A1A2E';
  for(let i=0; i<10; i++) {
    const x = i * width/10;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x+30, height*0.3 + Math.sin(i*4)*50); ctx.lineTo(x+60, 0); ctx.fill();
  }

  // Giant glowing crystals
  const colors = ['#00FFFF', '#FF00FF', '#00FF00', '#FFFF00'];
  for(let i=0; i<5; i++) {
    const cx = width * 0.1 + i * width*0.2;
    const cy = height * 0.6;
    const col = colors[i%4];
    
    // Glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
    glow.addColorStop(0, col + '80'); // 50% opacity
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI*2); ctx.fill();
    
    // Crystal body
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(cx, cy-80);
    ctx.lineTo(cx+30, cy);
    ctx.lineTo(cx, cy+40);
    ctx.lineTo(cx-30, cy);
    ctx.fill();
    
    // Crystal highlights
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.moveTo(cx, cy-80); ctx.lineTo(cx+10, cy); ctx.lineTo(cx, cy+40); ctx.fill();
  }

  // Glowing path
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + Math.sin(time*0.05)*0.1})`;
  ctx.lineWidth = 40;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, height*0.75);
  ctx.quadraticCurveTo(width*0.3, height*0.8, width*0.5, height*0.7);
  ctx.quadraticCurveTo(width*0.8, height*0.6, width, height*0.75);
  ctx.stroke();

  // Glassy floor
  ctx.fillStyle = 'rgba(20, 20, 40, 0.8)';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);
  ctx.lineTo(width, height * 0.65);
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
}

function drawOvergrownRuinsGraphScene(ctx, width, height, time) {
  // Dense jungle sky
  ctx.fillStyle = '#0E2F1D';
  ctx.fillRect(0, 0, width, height);

  // Layered dense jungle background
  ctx.fillStyle = '#144629';
  for(let i=0; i<15; i++) {
    const tx = i * width/15 + Math.sin(i*11)*20;
    ctx.fillRect(tx, height*0.1, 40, height);
    ctx.beginPath(); ctx.arc(tx+20, height*0.1, 60, 0, Math.PI*2); ctx.fill();
  }

  // Ancient Mossy Statues/Shrines (Graph Nodes)
  ctx.fillStyle = '#5A6E63';
  for(let i=0; i<4; i++) {
    const sx = width * 0.2 + i * width*0.25;
    const sy = height * 0.5 + (i%2 === 0 ? -30 : 30);
    
    // Statue base
    ctx.fillRect(sx-30, sy, 60, height);
    // Statue head/idol
    ctx.beginPath();
    ctx.moveTo(sx, sy-40);
    ctx.lineTo(sx+40, sy+10);
    ctx.lineTo(sx-40, sy+10);
    ctx.fill();
    
    // Glowing eye
    ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + Math.sin(time*0.05 + i)*0.5})`;
    ctx.beginPath(); ctx.arc(sx, sy-10, 5, 0, Math.PI*2); ctx.fill();
    
    // Hanging moss
    ctx.fillStyle = '#1D8348';
    ctx.fillRect(sx-25, sy, 10, 40);
    ctx.fillRect(sx+10, sy, 15, 60);
    
    // Reset fill
    ctx.fillStyle = '#5A6E63';
  }

  // Dirt path connecting the shrines
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(width*0.2, height*0.6);
  ctx.lineTo(width*0.45, height*0.5);
  ctx.lineTo(width*0.7, height*0.6);
  ctx.lineTo(width*0.95, height*0.5);
  ctx.stroke();

  // Jungle Floor
  ctx.fillStyle = '#183B25';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);
  ctx.lineTo(width, height * 0.65);
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
}

function drawAbyssalChasmScene(ctx, width, height, time) {
  // Pitch black abyss
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#11001A');
  bgGrad.addColorStop(1, '#000000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Sharp vertical stalactites dropping down
  ctx.fillStyle = '#1A002A';
  for(let i=0; i<8; i++) {
    const x = i * width/8;
    ctx.beginPath(); 
    ctx.moveTo(x-20, 0); 
    ctx.lineTo(x+40, height*0.5 + Math.sin(i*5)*100); 
    ctx.lineTo(x+60, 0); 
    ctx.fill();
  }

  // Glowing toxic spores floating upwards
  for(let i=0; i<50; i++) {
    const sx = (time * 0.2 + i * 50) % width;
    const sy = height - ((time * 1.5 + i * 90) % height);
    
    ctx.fillStyle = `rgba(138, 43, 226, ${Math.random()*0.6 + 0.1})`;
    ctx.beginPath(); ctx.arc(sx, sy, Math.random()*3 + 1, 0, Math.PI*2); ctx.fill();
  }

  // Chasm ledges
  ctx.fillStyle = '#2A004A';
  ctx.fillRect(0, height*0.4, width*0.2, height);
  ctx.fillRect(width*0.8, height*0.3, width*0.2, height);
  
  // The bottomless pit
  ctx.fillStyle = '#05000A';
  ctx.fillRect(width*0.2, height*0.65, width*0.6, height);

  // Narrow perilous bridge
  ctx.strokeStyle = '#4A235A';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, height*0.65);
  ctx.lineTo(width, height*0.65);
  ctx.stroke();
}

function drawEnchantedHedgeMazeScene(ctx, width, height, time) {
  // Bright sunny sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#85C1E9');
  skyGrad.addColorStop(1, '#D4E6F1');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Thick topiary hedge walls
  const drawHedge = (x, y, w, h) => {
    // Base green
    ctx.fillStyle = '#1E8449';
    ctx.fillRect(x, y, w, h);
    
    // Leaf texture
    ctx.fillStyle = '#229954';
    for(let i=0; i<w; i+=15) {
      for(let j=0; j<h; j+=15) {
        ctx.beginPath(); ctx.arc(x+i+7, y+j+7, 10, 0, Math.PI*2); ctx.fill();
      }
    }
  };

  drawHedge(width*0.1, height*0.2, width*0.15, height);
  drawHedge(width*0.4, height*0.3, width*0.1, height);
  drawHedge(width*0.7, height*0.15, width*0.2, height);
  
  drawHedge(0, height*0.4, width*0.2, height);
  drawHedge(width*0.3, height*0.45, width*0.15, height);
  drawHedge(width*0.6, height*0.4, width*0.2, height);

  // Floating fairy dust showing shortest path
  ctx.strokeStyle = `rgba(241, 196, 15, ${0.4 + Math.sin(time*0.1)*0.2})`;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.setLineDash([15, 20]);
  ctx.lineDashOffset = -time;
  ctx.beginPath();
  ctx.moveTo(width*0.1, height*0.6);
  ctx.quadraticCurveTo(width*0.3, height*0.5, width*0.5, height*0.6);
  ctx.quadraticCurveTo(width*0.8, height*0.7, width*0.9, height*0.5);
  ctx.stroke();
  ctx.setLineDash([]);

  // Trimmed grass floor
  ctx.fillStyle = '#27AE60';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);
  ctx.lineTo(width, height * 0.65);
  ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
  
  // Grass blades
  ctx.strokeStyle = '#229954';
  ctx.lineWidth = 2;
  for(let i=0; i<width; i+=10) {
    ctx.beginPath();
    ctx.moveTo(i, height*0.65);
    ctx.lineTo(i + Math.sin(i*3)*5, height*0.65 + 10);
    ctx.stroke();
  }
}

export class GameSceneRenderer {
  constructor(canvas, worldId = 'arrays-strings', sceneType = 'temple') {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.worldId = worldId;
    this.sceneType = sceneType;
    this.time = 0;
    this.particles = new ParticleSystem(60);
    this.isExitOpen = false;
    this.collectedRelics = new Set();
    this.relics = [];
    this.animationId = null;
    
    // Character state
    this.charX = 0.08;        // Normalized position (0-1)
    this.charYNorm = 0.65;    // Normalized Y position
    this.charVy = 0;          // Velocity Y (pixels/frame)
    this.isGrounded = true;
    this.gravity = 0.4;
    this.jumpForce = -8;
    this.moveSpeed = 0.005;   // Normalized movement speed
    
    this.charTargetX = 0.08;
    this.charSpeed = 0.004;
    this.charIsWalking = false;
    this.charFacingRight = true;
    this.charHomeX = 0.08;
    this.charHomeYNorm = 0.65;
    
    // Keyboard controls
    this.keys = { left: false, right: false, up: false };
    this.keydownHandler = (e) => {
      if (e.key === 'ArrowLeft') this.keys.left = true;
      if (e.key === 'ArrowRight') this.keys.right = true;
      if (e.key === 'ArrowUp' || e.key === ' ') {
        this.keys.up = true;
        if (this.isGrounded) {
          this.charVy = this.jumpForce;
          this.isGrounded = false;
        }
      }
    };
    this.keyupHandler = (e) => {
      if (e.key === 'ArrowLeft') this.keys.left = false;
      if (e.key === 'ArrowRight') this.keys.right = false;
      if (e.key === 'ArrowUp' || e.key === ' ') this.keys.up = false;
    };
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
    
    // Dynamic Level Objects
    this.platforms = [];
    this.doors = [];
    this.hazards = [];
    this.enemies = [];
    this.invincibilityFrames = 0;
    
    // Command queue for animated execution
    this.commandQueue = [];
    this.currentCommand = null;
    this.commandCallbacks = [];
    this.isProcessingQueue = false;
    
    this.stackData = [];
    
    // Map world to theme and sprites
    if (worldId === 'arrays-strings') {
      this.charSprite = 'farmer';
      this.relicSprite = 'apple';
      if (sceneType === 'sunny_farm') this.drawBg = drawSunnyFarmScene;
      else if (sceneType === 'orchard') this.drawBg = drawOrchardScene;
      else if (sceneType === 'quarry') { this.drawBg = drawQuarryScene; this.charSprite = 'explorer'; }
      else if (sceneType === 'garden') { this.drawBg = drawGardenScene; this.charSprite = 'ranger'; }
      else if (sceneType === 'portal_chamber') { this.drawBg = drawPortalChamberScene; this.charSprite = 'explorer'; }
      else if (sceneType === 'treasure_hall') { this.drawBg = drawTreasureHallScene; this.charSprite = 'explorer'; }
      else if (sceneType === 'mirror_hall') { this.drawBg = drawMirrorHallScene; this.charSprite = 'explorer'; }
      else if (sceneType === 'rune_archive') { this.drawBg = drawRuneArchiveScene; this.charSprite = 'explorer'; }
      else if (sceneType === 'royal_ledger') { this.drawBg = drawRoyalLedgerScene; this.charSprite = 'explorer'; }
      else if (sceneType === 'enchanted_cave') { this.drawBg = drawEnchantedCaveScene; this.charSprite = 'explorer'; }
      else this.drawBg = drawSunnyFarmScene;
    } else if (worldId === 'stacks-queues') {
      this.charSprite = 'explorer';
      this.relicSprite = 'gold';
      // Map sceneType to specific drawing functions (we will define these next)
      if (sceneType === 'library') this.drawBg = drawLibraryScene;
      else if (sceneType === 'dungeon_scale') this.drawBg = drawDungeonScaleScene;
      else if (sceneType === 'laboratory') this.drawBg = drawLaboratoryScene;
      else if (sceneType === 'chasm') this.drawBg = drawForestChasmScene;
      else if (sceneType === 'castle_gate') this.drawBg = drawCastleGateScene;
      else if (sceneType === 'ritual_temple') this.drawBg = drawRitualTempleScene;
      else if (sceneType === 'mine') this.drawBg = drawMineScene;
      else if (sceneType === 'treasure_vault') this.drawBg = drawTreasureVaultScene;
      else if (sceneType === 'snowy_peak') this.drawBg = drawSnowyPeakScene;
      else this.drawBg = drawTempleScene;
    } else if (worldId === 'linked-lists') {
      this.charSprite = 'explorer';
      this.relicSprite = 'scroll';
      if (sceneType === 'desert_ruins') this.drawBg = drawDesertRuinsScene;
      else if (sceneType === 'ruin_counting') this.drawBg = drawCountingRuinsScene;
      else if (sceneType === 'desert_oasis') this.drawBg = drawDesertOasisScene;
      else if (sceneType === 'cursed_ruins') this.drawBg = drawCursedRuinsScene;
      else if (sceneType === 'mystic_ruins') this.drawBg = drawMysticRuinsScene;
      else if (sceneType === 'deadly_loop') this.drawBg = drawDeadlyLoopScene;
      else this.drawBg = drawDesertScene;
    } else if (worldId === 'trees-graphs') {
      this.charSprite = 'ranger';
      this.relicSprite = 'leaf';
      if (sceneType === 'enchanted_forest') this.drawBg = drawEnchantedForestScene;
      else if (sceneType === 'ancient_message_forest') this.drawBg = drawAncientMessageScene;
      else if (sceneType === 'signal_tower_forest') this.drawBg = drawSignalTowerForestScene;
      else if (sceneType === 'autumn_leaf_fall') this.drawBg = drawAutumnLeafFallScene;
      else if (sceneType === 'crystal_cave_path') this.drawBg = drawCrystalCavePathScene;
      else if (sceneType === 'overgrown_ruins_graph') this.drawBg = drawOvergrownRuinsGraphScene;
      else if (sceneType === 'abyssal_chasm') this.drawBg = drawAbyssalChasmScene;
      else if (sceneType === 'enchanted_hedge_maze') this.drawBg = drawEnchantedHedgeMazeScene;
      else if (sceneType === 'great_tree') this.drawBg = drawGreatTreeScene;
      else if (sceneType === 'mirror_forest') this.drawBg = drawMirrorForestScene;
      else if (sceneType === 'magic_path') this.drawBg = drawMagicPathScene;
      else if (sceneType === 'graph_maze') this.drawBg = drawGraphMazeScene;
      else this.drawBg = drawForestScene;
      this.relicSprite = 'leaf';
    } else {
      this.drawBg = drawFarmScene;
      this.charSprite = 'farmer';
      this.relicSprite = 'apple';
    }
    
    this.equippedTool = null;
    this.toolAnimation = null;
    this.toolAnimationProgress = 0;
  }

  updateStack(stackData) {
    this.stackData = [...stackData];
  }

  setRelics(relics) {
    this.relics = relics || [];
  }

  collectRelic(idOrName) {
    this.collectedRelics.add(idOrName);
    // Emit particles at relic location
    const relic = this.relics.find(r => (r.id || r.name) === idOrName);
    if (relic) {
      for (let i = 0; i < 15; i++) {
        this.particles.emit(
          (relic.x / 100) * this.canvas.width,
          this.canvas.height * 0.6,
          { color: '#ffee88', speed: 3, life: 40, size: 3 }
        );
      }
    }
  }

  openExit() {
    this.isExitOpen = true;
  }

  setHazards(hazards) {
    this.hazards = hazards || [];
  }

  takeDamage(amount) {
    if (this.invincibilityFrames > 0) return;
    this.invincibilityFrames = 60; // 1 second at 60fps
    
    // Knockback
    this.charVy = -5;
    this.charX -= this.charFacingRight ? 0.05 : -0.05;
    
    // Emit particles
    const targetX = this.charX * this.canvas.width;
    const targetY = this.charYNorm * this.canvas.height - 30;
    for (let i = 0; i < 20; i++) {
      this.particles.emit(targetX, targetY, { color: '#e74c3c', speed: 5, life: 30, size: 4 });
    }

    // Trigger event for UI
    window.dispatchEvent(new CustomEvent('playerDamage', { detail: amount }));
  }

  // ── Command Queue System ─────────────────────────────────
  enqueueCommands(commands, onComplete) {
    this.commandQueue.push(...commands);
    if (onComplete) {
      this.commandCallbacks.push({ index: this.commandQueue.length - 1, callback: onComplete });
    }
    if (!this.isProcessingQueue) {
      this.processNextCommand();
    }
  }

  processNextCommand() {
    if (this.commandQueue.length === 0) {
      this.isProcessingQueue = false;
      this.currentCommand = null;
      this.charIsWalking = false;
      // Fire all remaining callbacks
      this.commandCallbacks.forEach(cb => cb.callback());
      this.commandCallbacks = [];
      return;
    }

    this.isProcessingQueue = true;
    this.currentCommand = this.commandQueue.shift();
    const cmd = this.currentCommand;

    switch (cmd.type) {
      case 'MOVE_TO': {
        const targetNorm = cmd.targetX / this.canvas.width;
        this.charTargetX = cmd.targetX / this.canvas.width;
        this.charFacingRight = this.charTargetX > this.charX;
        this.charIsWalking = true;
        break;
      }
      case 'JUMP_TO': {
        this.charFacingRight = (cmd.targetX / this.canvas.width) > this.charX;
        this.charIsWalking = false; // Stand still while turning
        
        // Pause briefly to show the "turn", then start walking
        setTimeout(() => {
          this.charIsWalking = true;
          this.isGrounded = false;
          this.isJumpingArc = true;
          
          const startX = this.charX;
          const startY = this.charYNorm;
          const endX = cmd.targetX / this.canvas.width;
          // cmd.targetY is percentage 0-100. Let's make endY slightly below targetY so character stands on platform.
          const endY = cmd.targetY !== undefined ? (cmd.targetY / 100) : startY;
          
          const duration = cmd.waitMs || 600;
          const startTime = performance.now();
          
          const animateArc = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(1, elapsed / duration);
            
            this.charX = startX + (endX - startX) * progress;
            // Straight line movement: y = start + (end-start)*p
            const jumpHeight = 0.0; // disabled jump arc
            this.charYNorm = startY + (endY - startY) * progress - Math.sin(progress * Math.PI) * jumpHeight;
            
            if (progress < 1) {
              requestAnimationFrame(animateArc);
            } else {
              this.charX = endX;
              this.charYNorm = endY;
              this.isGrounded = true;
              this.charVy = 0;
              this.isJumpingArc = false;
              this.charIsWalking = false;
              this.processNextCommand();
            }
          };
          requestAnimationFrame(animateArc);
        }, 300); // 300ms delay to emphasize the turn
        
        return;
      }
      case 'PICKUP': {
        this.collectRelic(cmd.itemId || cmd.item);
        // Small delay then continue
        setTimeout(() => this.processNextCommand(), 200);
        return;
      }
      case 'USE_TOOL': {
        this.equippedTool = cmd.tool;
        this.toolAnimation = cmd.animation;
        this.toolAnimationProgress = 0;
        this.charFacingRight = true; // assume facing target
        
        const duration = 500;
        const startTime = performance.now();
        
        const animateTool = (timestamp) => {
          const elapsed = timestamp - startTime;
          this.toolAnimationProgress = Math.min(1, elapsed / duration);
          
          if (this.toolAnimationProgress < 1) {
            requestAnimationFrame(animateTool);
          } else {
            this.equippedTool = null;
            this.toolAnimation = null;
            this.toolAnimationProgress = 0;
            
            // Spawn success effect
            if (cmd.effect === 'harvest_particles') {
              const targetX = cmd.targetX || (this.charX * this.canvas.width + 40);
              for (let i = 0; i < 15; i++) {
                this.particles.emit(targetX, this.canvas.height * 0.6, { color: '#8b4513', speed: 3, life: 40, size: 3 });
                this.particles.emit(targetX, this.canvas.height * 0.6, { color: '#228b22', speed: 2, life: 30, size: 2 });
              }
            } else if (cmd.effect === 'magic_sparkles') {
              const targetX = cmd.targetX || (this.charX * this.canvas.width + 40);
              for (let i = 0; i < 20; i++) {
                this.particles.emit(targetX, this.canvas.height * 0.5, { color: '#ff00ff', speed: 4, life: 50, size: 3 });
                this.particles.emit(targetX, this.canvas.height * 0.5, { color: '#00ffff', speed: 3, life: 40, size: 2 });
              }
            } else if (cmd.effect === 'slash') {
              const targetX = cmd.targetX || (this.charX * this.canvas.width + 40);
              for (let i = 0; i < 10; i++) {
                this.particles.emit(targetX, this.canvas.height * 0.5, { color: '#ff0000', speed: 5, life: 20, size: 4 });
                this.particles.emit(targetX, this.canvas.height * 0.5, { color: '#ffffff', speed: 6, life: 15, size: 2 });
              }
            }
            
            if (cmd.item) {
              this.collectRelic(cmd.itemId || cmd.item);
            }
            
            setTimeout(() => this.processNextCommand(), 200);
          }
        };
        requestAnimationFrame(animateTool);
        return;
      }
      case 'POP_ITEM': {
        this.charFacingRight = false; // face tower
        
        // Emulate pulling lever
        this.equippedTool = 'key'; // just a filler for hand
        this.toolAnimation = 'poke';
        this.toolAnimationProgress = 0;
        
        const duration = 400;
        const startTime = performance.now();
        
        const animateTool = (timestamp) => {
          const elapsed = timestamp - startTime;
          this.toolAnimationProgress = Math.min(1, elapsed / duration);
          
          if (this.toolAnimationProgress < 1) {
            requestAnimationFrame(animateTool);
          } else {
            this.equippedTool = null;
            this.toolAnimation = null;
            this.toolAnimationProgress = 0;
            
            // Actually pop from tower
            if (this.stackData && this.stackData.length > 0) {
              const popped = this.stackData.pop();
              // Emit particles at tower top
              const stackX = this.canvas.width * 0.50;
              const platY = this.canvas.height * 0.65;
              const stoneH = 30;
              const sy = platY - (this.stackData.length + 1) * stoneH - 5;
              for (let i = 0; i < 20; i++) {
                this.particles.emit(stackX, sy, { color: '#ff4d4d', speed: 4, life: 30, size: 3 });
                this.particles.emit(stackX, sy, { color: '#ffffff', speed: 2, life: 20, size: 2 });
              }
            }
            
            setTimeout(() => this.processNextCommand(), 200);
          }
        };
        requestAnimationFrame(animateTool);
        return;
      }
      case 'INSERT_STACK': {
        this.charFacingRight = false; // face tower (char is at right of tower usually, or let's assume they walked to the right)
        
        this.equippedTool = 'magic_device';
        this.toolAnimation = 'swing';
        this.toolAnimationProgress = 0;
        
        const duration = 400;
        const startTime = performance.now();
        
        const animateTool = (timestamp) => {
          const elapsed = timestamp - startTime;
          this.toolAnimationProgress = Math.min(1, elapsed / duration);
          
          if (this.toolAnimationProgress < 1) {
            requestAnimationFrame(animateTool);
          } else {
            this.equippedTool = null;
            this.toolAnimation = null;
            this.toolAnimationProgress = 0;
            
            // Insert into tower
            if (!this.stackData) this.stackData = [];
            this.stackData.push(cmd.item);
            
            // Emit particles at tower
            const stackX = this.canvas.width * 0.50;
            const platY = this.canvas.height * 0.65;
            const stoneH = 30;
            const sy = platY - (this.stackData.length) * stoneH - 5;
            
            for (let i = 0; i < 20; i++) {
              this.particles.emit(stackX, sy, { color: '#00f0ff', speed: 3, life: 40, size: 3 });
            }
            
            setTimeout(() => this.processNextCommand(), 200);
          }
        };
        requestAnimationFrame(animateTool);
        return;
      }
      case 'PEEK_ITEM': {
        this.charFacingRight = true; // face right towards tower
        
        this.equippedTool = 'scanner';
        this.toolAnimation = 'scan';
        this.toolAnimationProgress = 0;
        
        const duration = 800;
        const startTime = performance.now();
        
        const animateTool = (timestamp) => {
          const elapsed = timestamp - startTime;
          this.toolAnimationProgress = Math.min(1, elapsed / duration);
          
          if (this.toolAnimationProgress < 1) {
            requestAnimationFrame(animateTool);
          } else {
            this.equippedTool = null;
            this.toolAnimation = null;
            this.toolAnimationProgress = 0;
            
            setTimeout(() => this.processNextCommand(), 200);
          }
        };
        requestAnimationFrame(animateTool);
        return;
      }
      case 'EXECUTE_CALLBACK': {
        if (cmd.callback) cmd.callback();
        this.processNextCommand();
        return;
      }
      case 'ENTER_DOOR': {
        this.openExit();
        this.charHidden = true;
        this.isEnteredDoor = true; // Flag for 3D overlay
        
        // Emit teleport/entry particles
        const targetX = this.charX * this.canvas.width;
        const targetY = this.canvas.height * 0.5;
        for (let i = 0; i < 30; i++) {
          this.particles.emit(targetX, targetY, { color: '#ffffff', speed: 4, life: 40, size: 3 });
          this.particles.emit(targetX, targetY, { color: '#88bbff', speed: 3, life: 50, size: 2 });
        }
        
        // Wait briefly for particles to show before continuing
        setTimeout(() => {
          if (this.onDoorEnter) this.onDoorEnter();
          this.processNextCommand();
        }, 800);
        return;
      }
      case 'WAIT': {
        setTimeout(() => this.processNextCommand(), (cmd.frames || 20) * 16);
        return;
      }
      case 'SPAWN_HAZARD': {
        this.hazards.push({ type: cmd.hazardType || 'spikes', x: cmd.x || 50, y: cmd.y });
        this.processNextCommand();
        return;
      }
      case 'TAKE_DAMAGE': {
        this.takeDamage(cmd.amount || 1);
        setTimeout(() => this.processNextCommand(), 500); // pause briefly on damage
        return;
      }
      default:
        this.processNextCommand();
        return;
    }
  }

  updateCommandQueue() {
    const h = this.canvas.height;
    const w = this.canvas.width;

    // 1. Physics: Gravity & Collision
    if (!this.isJumpingArc) {
      this.charVy += this.gravity;
      this.charYNorm += this.charVy / h;

      this.isGrounded = false;
      let groundYNorm = this.charHomeYNorm; // Default ground (platformY)

      // Check custom platforms collision
      const charW = 64 / w; // Approximate width
      for (const plat of this.platforms) {
        // plat: { x, y, w, h } normalized 0-1
        if (this.charX + charW > plat.x && this.charX < plat.x + plat.w) {
          // Falling onto platform
          if (this.charYNorm - (this.charVy / h) <= plat.y && this.charYNorm >= plat.y) {
            groundYNorm = plat.y;
            break;
          }
        }
      }

      if (this.charYNorm >= groundYNorm) {
        this.charYNorm = groundYNorm;
        this.charVy = 0;
        this.isGrounded = true;
      }
    }

    // 2. Movement (Keyboard overrides Queue)
    let manualOverride = false;
    if (this.keys.left) {
      this.charX -= this.moveSpeed;
      this.charFacingRight = false;
      this.charIsWalking = true;
      manualOverride = true;
    } else if (this.keys.right) {
      this.charX += this.moveSpeed;
      this.charFacingRight = true;
      this.charIsWalking = true;
      manualOverride = true;
    }

    // Keep character inside screen bounds
    if (this.charX < 0) this.charX = 0;
    if (this.charX > 0.95) this.charX = 0.95;

    // Check door entry manually if door is open
    if (this.isExitOpen && !this.charHidden && this.keys.up) {
      const exitDoorX = 0.85; // Standard exit x
      if (Math.abs(this.charX - exitDoorX) < 0.1) {
        // Enqueue the ENTER_DOOR command so the game logic captures the completion
        this.enqueueCommands([{ type: 'ENTER_DOOR' }]);
        this.keys.up = false; // consume input
      }
    }

    // 3. Process Command Queue Movement (if no manual override)
    if (!manualOverride && this.currentCommand && this.currentCommand.type === 'MOVE_TO') {
      const targetNorm = this.currentCommand.targetX / w;
      const dist = Math.abs(targetNorm - this.charX);

      if (dist < this.charSpeed) {
        this.charX = targetNorm;
        this.charIsWalking = false;
        this.processNextCommand();
      } else {
        this.charX += (targetNorm > this.charX ? 1 : -1) * this.charSpeed;
        this.charIsWalking = true;
      }
    } else if (!manualOverride && (!this.currentCommand || this.currentCommand.type !== 'JUMP_TO')) {
      this.charIsWalking = false;
    }

    // 4. Handle invincibility
    if (this.invincibilityFrames > 0) {
      this.invincibilityFrames--;
    }

    // 5. Hazard Collisions
    if (this.invincibilityFrames === 0 && !this.charHidden) {
      const charPixelX = this.charX * w;
      const charY = this.charYNorm * h - 64; // Approximated top-left
      const charRect = { x: charPixelX, y: charY, w: 64, h: 64 };
      
      for (const hazard of this.hazards) {
        const hazPixelX = (hazard.x / 100) * w;
        let hazY = h * 0.65;
        if (this.worldId !== 'stacks-queues' && this.worldId !== 'arrays-strings') {
          hazY = h * 0.72;
        }
        if (hazard.y !== undefined) hazY = (hazard.y / 100) * h;
        
        const hazRect = { x: hazPixelX - 20, y: hazY - 40, w: 40, h: 40 };
        
        if (charRect.x < hazRect.x + hazRect.w &&
            charRect.x + charRect.w > hazRect.x &&
            charRect.y < hazRect.y + hazRect.h &&
            charRect.h + charRect.y > hazRect.y) {
          this.takeDamage(1);
          break;
        }
      }
    }
  }

  resetCharacter() {
    this.charX = this.charHomeX;
    this.charYNorm = this.charHomeYNorm || 0.65;
    this.charVy = 0;
    this.charTargetX = this.charHomeX;
    this.charIsWalking = false;
    this.charFacingRight = true;
    this.commandQueue = [];
    this.currentCommand = null;
    this.commandCallbacks = [];
    this.isProcessingQueue = false;
    this.equippedTool = null;
    this.toolAnimation = null;
    this.toolAnimationProgress = 0;
    this.charHidden = false;
    this.isEnteredDoor = false;
    this.lastProcessedLogs = [];
    this.lastProcessedOps = [];
  }

  start() {
    this.render();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    // Clean up keyboard listeners
    if (this.keydownHandler) window.removeEventListener('keydown', this.keydownHandler);
    if (this.keyupHandler) window.removeEventListener('keyup', this.keyupHandler);
  }

  render = () => {
    this.time++;
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Update command queue movement
    this.updateCommandQueue();

    // Background based on World
    this.drawBg(ctx, w, h, this.time, this);

    let platformY = h * 0.72;
    if (this.worldId === 'stacks-queues' || this.worldId === 'arrays-strings') {
      platformY = h * 0.65; // Matches the raised platform in the new scenes
    }

    // ── Stone platform for character (except worlds with custom scenes)
    if (this.worldId !== 'stacks-queues' && this.worldId !== 'arrays-strings' && this.worldId !== 'linked-lists' && this.worldId !== 'trees-graphs') {
      drawStonePlatform(ctx, w * 0.02, platformY, w * 0.96, 20);
    }

    // ── Pedestals and Relics
    this.relics.forEach(relic => {
      const rx = (relic.x / 100) * w;
      const pedestalW = 40;
      const pedestalH = 35;
      const pedestalX = rx - pedestalW / 2 + 12;
      const pedestalY = platformY - pedestalH;

      // Draw pedestal (skip for worlds with custom scene backgrounds)
      if (this.worldId !== 'stacks-queues' && this.worldId !== 'arrays-strings' && this.worldId !== 'linked-lists' && this.worldId !== 'trees-graphs') {
        drawPedestal(ctx, pedestalX, pedestalY, pedestalW, pedestalH);
      }

      // Draw relic on top of pedestal
      let relicY = pedestalY - 40;
      if (relic.y !== undefined) {
         relicY = (relic.y / 100) * h - 40; // Base it off the provided Y percentage
      }
      const collected = this.collectedRelics.has(relic.id || relic.name);
      
      const label = relic.name.replace(/_/g, ' ');
      const relicType = relic.id || relic.name;
      const displayLabel = this.worldId === 'stacks-queues' ? '' : label;
      drawRelic(ctx, rx, relicY, relicType, collected, this.time, displayLabel, this.worldId, this.sceneType);
    });

    // ── Exit door
    const doorX = w * 0.82;
    const doorY = platformY - 80;
    if (this.worldId !== 'stacks-queues' && this.worldId !== 'arrays-strings' && this.worldId !== 'linked-lists' && this.worldId !== 'trees-graphs') {
      drawExitDoor(ctx, doorX, doorY, 50, 80, this.isExitOpen, this.time);
      drawCrystal(ctx, doorX + 8, doorY - 40, 2.5, this.time);
    }

    // ── Hazards
    this.hazards.forEach(hazard => {
      const hx = (hazard.x / 100) * w;
      let hy = platformY;
      if (hazard.y !== undefined) hy = (hazard.y / 100) * h;
      
      // Animation cycle for popping out of the ground
      let cycle = (this.time * 2) % 200;
      let popFactor = 1;
      if (cycle < 30) popFactor = cycle / 30; // rising
      else if (cycle < 100) popFactor = 1; // stay up
      else if (cycle < 130) popFactor = 1 - ((cycle - 100) / 30); // going down
      else popFactor = 0; // stay down
      
      let offsetY = (1 - popFactor) * 40;
      
      ctx.save();
      // Clip to hide the portion of the hazard that is underground
      ctx.beginPath();
      ctx.rect(hx - 50, hy - 100, 100, 100);
      ctx.clip();
      
      let drawY = hy + offsetY;

      if (hazard.type === 'spikes') {
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(hx - 20, drawY);
        ctx.lineTo(hx - 10, drawY - 30);
        ctx.lineTo(hx, drawY);
        ctx.lineTo(hx + 10, drawY - 30);
        ctx.lineTo(hx + 20, drawY);
        ctx.fill();
      } else if (hazard.type === 'fire') {
        ctx.fillStyle = '#e74c3c';
        const flameH = 20 + Math.sin(this.time * 0.2) * 10;
        ctx.fillRect(hx - 15, drawY - flameH, 30, flameH);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(hx - 8, drawY - flameH * 0.6, 16, flameH * 0.6);
      } else if (hazard.type === 'enemy') {
        ctx.fillStyle = '#8e44ad';
        ctx.fillRect(hx - 20, drawY - 40, 40, 40);
        ctx.fillStyle = '#fff';
        ctx.fillRect(hx - 10, drawY - 30, 8, 8);
        ctx.fillRect(hx + 2, drawY - 30, 8, 8);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(hx - 6, drawY - 28, 4, 4);
        ctx.fillRect(hx + 6, drawY - 28, 4, 4);
      } else if (hazard.type === 'poison') {
        ctx.fillStyle = 'rgba(46, 204, 113, 0.8)';
        ctx.beginPath();
        ctx.ellipse(hx, drawY, 30, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // ── Character
    const charPixelX = this.charX * w;
    const charY = this.charYNorm * h - 64;
    
    // Update 3D overlay if callback exists
    if (this.onCharacterUpdate) {
      this.onCharacterUpdate(
        this.charX, 
        this.charYNorm, 
        this.charIsWalking, 
        this.charFacingRight,
        this.equippedTool,
        this.toolAnimation,
        this.toolAnimationProgress,
        this.isEnteredDoor
      );
      this.charHidden = true; // Hide 2D character when 3D is active
    }
    
    if (!this.charHidden) {
      if (this.invincibilityFrames % 10 < 5) {
        drawCharacter(ctx, charPixelX, charY, this.charSprite, 2, this.time, this.charIsWalking, this.charFacingRight);
      }

      // ── Equipped Tool
      if (this.equippedTool && SPRITES.tools && SPRITES.tools[this.equippedTool]) {
        const matrix = SPRITES.tools[this.equippedTool];
        const palette = SPRITE_PALETTES[this.equippedTool];
        const scale = 2;
        
        ctx.save();
        // Hand position for 32x32 sprite at scale 2
        let toolX = charPixelX + 48;
        let toolY = charY + 36;
        
        if (!this.charFacingRight) {
          toolX = charPixelX + 16;
          ctx.translate(toolX, toolY);
          ctx.scale(-1, 1);
          ctx.translate(-toolX, -toolY);
          toolX = charPixelX - 16;
        }
        
        ctx.translate(toolX, toolY);
        
        const p = this.toolAnimationProgress;
        if (this.toolAnimation === 'swing') {
          const angle = Math.sin(p * Math.PI * 2) * (Math.PI / 4);
          ctx.rotate(angle);
        } else if (this.toolAnimation === 'poke') {
          const thrust = Math.sin(p * Math.PI) * 15;
          ctx.translate(thrust, 0);
        } else if (this.toolAnimation === 'scan') {
          const bounce = Math.sin(p * Math.PI * 4) * 5;
          ctx.translate(0, bounce);
        }
        
        ctx.translate(-toolX, -toolY);
        drawSpriteMatrix(ctx, toolX, toolY, matrix, palette, scale);
        ctx.restore();
      }
    }

    // Particles
    this.particles.update();
    this.particles.draw(ctx);

    this.animationId = requestAnimationFrame(this.render);
  }
}

// ── World Map Background ────────────────────────────────────
function drawDayBackground(ctx, width, height, time) {
  // 1. Bright blue sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#56ccf2'); // bright blue
  skyGrad.addColorStop(0.5, '#78d5f5');
  skyGrad.addColorStop(1, '#a1e4f9'); // lighter horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Soft white clouds moving slowly
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < 8; i++) {
    const cx = (time * 0.05 * (i + 1) + i * 250) % (width + 400) - 200;
    const cy = height * 0.15 + (i * 25);
    // Draw simple pixel clouds
    ctx.fillRect(Math.floor(cx), Math.floor(cy), 80, 20);
    ctx.fillRect(Math.floor(cx + 20), Math.floor(cy - 10), 100, 30);
    ctx.fillRect(Math.floor(cx + 50), Math.floor(cy - 20), 40, 20);
  }

  // Warm sun glow at top right
  const sunGlow = ctx.createRadialGradient(width * 0.8, height * 0.2, 0, width * 0.8, height * 0.2, 200);
  sunGlow.addColorStop(0, 'rgba(255, 240, 150, 0.6)');
  sunGlow.addColorStop(1, 'rgba(255, 240, 150, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Distant green mountains
  // Back mountains
  ctx.fillStyle = '#6bbd8b';
  for (let x = 0; x < width; x += 4) {
    const mountainHeight = Math.sin(x * 0.005) * 30 + Math.sin(x * 0.015) * 15;
    const y = height * 0.65 + mountainHeight;
    const py = Math.floor(y / 4) * 4;
    ctx.fillRect(x, py, 4, height - py);
  }

  // Mid mountains
  ctx.fillStyle = '#4c9b6e';
  for (let x = 0; x < width; x += 6) {
    const mountainHeight = Math.cos(x * 0.007 + 2) * 40 + Math.sin(x * 0.02) * 20;
    const y = height * 0.75 + mountainHeight;
    const py = Math.floor(y / 6) * 6;
    ctx.fillRect(x, py, 6, height - py);
  }


}

function drawNightBackground(ctx, width, height, time) {
  // 1. Deep blue/purple gradient sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#0d1326'); // Deep night blue
  skyGrad.addColorStop(0.4, '#1b1b42'); // Deep purple
  skyGrad.addColorStop(1, '#2c224f'); // Lighter magical purple at the horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 1.5 Glowing Moon
  const moonX = width * 0.85;
  const moonY = height * 0.18;
  
  // Moon Glow
  const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 120);
  moonGlow.addColorStop(0, 'rgba(200, 220, 255, 0.3)');
  moonGlow.addColorStop(0.4, 'rgba(150, 180, 255, 0.1)');
  moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 120, 0, Math.PI * 2);
  ctx.fill();

  // Moon Body
  ctx.fillStyle = '#f0f4ff';
  ctx.beginPath();
  ctx.arc(moonX, moonY, 35, 0, Math.PI * 2);
  ctx.fill();
  
  // Moon Craters
  ctx.fillStyle = 'rgba(0, 0, 50, 0.08)';
  ctx.beginPath(); ctx.arc(moonX - 12, moonY - 8, 7, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 10, moonY + 6, 10, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX - 4, moonY + 14, 5, 0, Math.PI*2); ctx.fill();

  // 2. Twinkling stars
  for (let i = 0; i < 120; i++) {
    const x = Math.floor((Math.sin(i * 123.45) * 0.5 + 0.5) * width);
    const y = Math.floor((Math.cos(i * 321.12) * 0.5 + 0.5) * height * 0.8);
    // Twinkle effect
    const twinkle = Math.sin(time * 0.01 + i);
    const alpha = (twinkle > 0.5) ? 0.8 : (twinkle > 0) ? 0.4 : 0.1;
    ctx.globalAlpha = alpha;
    
    // Make some stars larger
    const size = (i % 15 === 0) ? 2 : 1;
    
    // Add slight color tint to some stars
    if (i % 7 === 0) ctx.fillStyle = '#ffddaa'; // warm
    else if (i % 11 === 0) ctx.fillStyle = '#aaddff'; // cool
    else ctx.fillStyle = '#ffffff';
    
    ctx.fillRect(x, y, size, size);
  }
  ctx.globalAlpha = 1.0;

  // 3. Distant mountain silhouettes
  // Back mountains
  ctx.fillStyle = '#171636';
  for (let x = 0; x < width; x += 4) {
    const mountainHeight = Math.sin(x * 0.005) * 40 + Math.sin(x * 0.015) * 20;
    const y = height * 0.6 + mountainHeight;
    const py = Math.floor(y / 4) * 4;
    ctx.fillRect(x, py, 4, height - py);
  }

  // Mid mountains
  ctx.fillStyle = '#100f24';
  for (let x = 0; x < width; x += 6) {
    const mountainHeight = Math.cos(x * 0.007 + 2) * 50 + Math.sin(x * 0.02) * 25;
    const y = height * 0.75 + mountainHeight;
    const py = Math.floor(y / 6) * 6;
    ctx.fillRect(x, py, 6, height - py);
  }

  // 4. Subtle magical fog
  const fogAlpha1 = 0.15 + Math.sin(time * 0.005) * 0.05;
  const fogAlpha2 = 0.1 + Math.cos(time * 0.007) * 0.05;

  ctx.fillStyle = `rgba(130, 150, 255, ${fogAlpha1})`;
  for (let x = 0; x < width; x += 8) {
    const wave = Math.sin(x * 0.005 + time * 0.005) * 15;
    const y = height * 0.85 + wave;
    const py = Math.floor(y / 4) * 4;
    ctx.fillRect(x, py, 8, height - py);
  }

  ctx.fillStyle = `rgba(200, 180, 255, ${fogAlpha2})`;
  for (let x = 0; x < width; x += 8) {
    const wave = Math.cos(x * 0.004 - time * 0.004) * 20;
    const y = height * 0.9 + wave;
    const py = Math.floor(y / 4) * 4;
    ctx.fillRect(x, py, 8, height - py);
  }

  // 5. Floating particles (magic dust / fireflies)
  for (let i = 0; i < 40; i++) {
    // Calculate flowing position based on time
    const baseY = (Math.cos(i * 13) * 0.5 + 0.5) * height;
    
    // Drift
    const driftX = (time * 0.2 + i * 100) % (width + 50) - 25;
    const driftY = Math.sin(time * 0.01 + i) * 15;
    
    const x = Math.floor(driftX / 2) * 2;
    const y = Math.floor((baseY + driftY) / 2) * 2;
    
    // Fade particles near top/bottom
    const normalizedY = y / height;
    let alpha = 1 - Math.abs(normalizedY - 0.7) * 2; // Peak alpha around y = 0.7
    if (alpha < 0) alpha = 0;
    
    // Pulsing alpha
    alpha *= (Math.sin(time * 0.05 + i) * 0.4 + 0.6);
    
    // Colors: cyan, pink, or pale yellow
    let color = '#88ffff';
    if (i % 3 === 0) color = '#ff88ff';
    if (i % 5 === 0) color = '#ffff88';
    
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 2, 2);
    
    // Slight glow
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillRect(x - 2, y - 2, 6, 6);
  }
  ctx.globalAlpha = 1.0;
}

let currentMapTheme = null;
let themeTransitionProgress = 1.0;
let previousMapTheme = null;

export function drawMapBackground(canvas, time, theme = 'night') {
  if (currentMapTheme === null) {
    currentMapTheme = theme;
  }
  if (theme !== currentMapTheme && themeTransitionProgress >= 1.0) {
    previousMapTheme = currentMapTheme;
    currentMapTheme = theme;
    themeTransitionProgress = 0;
  }

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  if (themeTransitionProgress < 1.0) {
    // Draw previous theme fully opaque
    if (previousMapTheme === 'day') drawDayBackground(ctx, width, height, time);
    else drawNightBackground(ctx, width, height, time);
    
    // Fade in new theme
    ctx.globalAlpha = themeTransitionProgress;
    if (currentMapTheme === 'day') drawDayBackground(ctx, width, height, time);
    else drawNightBackground(ctx, width, height, time);
    ctx.globalAlpha = 1.0;
    
    themeTransitionProgress += 0.02; // Transition over ~50 frames
  } else {
    // Draw current theme
    if (currentMapTheme === 'day') drawDayBackground(ctx, width, height, time);
    else drawNightBackground(ctx, width, height, time);
  }
}

