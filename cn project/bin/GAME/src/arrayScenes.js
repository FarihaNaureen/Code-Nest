// ==========================================
// arrayScenes.js - High Quality RPG Environments for Arrays & Strings Map
// ==========================================

// Deterministic pseudo-random: same seed always gives same value (0-1).
// This prevents particles from flickering every frame.
function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function drawVignette(ctx, width, height, color1, color2) {
  const gradient = ctx.createRadialGradient(width/2, height/2, width*0.3, width/2, height/2, width*0.8);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// ── Level 1: Sunny Farm ─────────────────────────────
export function drawSunnyFarmScene(ctx, width, height, time, renderer) {
  // Bright blue sky (extend all the way to platY to avoid black gap)
  const platY = height * 0.65;
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, width, platY);
  
  // Animated Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < 4; i++) {
    const cx = (time * 0.2 + i * 200) % (width + 100) - 50;
    const cy = height * 0.15 + (i % 2) * 40;
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 25, cy - 10, 40, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 50, cy, 30, 0, Math.PI * 2); ctx.fill();
  }

  // Sun
  ctx.fillStyle = '#FFD700';
  ctx.beginPath(); ctx.arc(width * 0.85, height * 0.15, 40, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 0.3 + Math.sin(time * 0.05) * 0.1;
  ctx.beginPath(); ctx.arc(width * 0.85, height * 0.15, 60, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1.0;

  // Christmas Shape Trees (Pine Trees)
  const drawPineTree = (x, y, scale) => {
    ctx.fillStyle = '#4B3621'; // Trunk
    ctx.fillRect(x - 10 * scale, y, 20 * scale, 40 * scale);
    ctx.fillStyle = '#0f5132'; // Dark green leaves
    ctx.beginPath(); ctx.moveTo(x - 50 * scale, y + 10 * scale); ctx.lineTo(x, y - 60 * scale); ctx.lineTo(x + 50 * scale, y + 10 * scale); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 40 * scale, y - 30 * scale); ctx.lineTo(x, y - 90 * scale); ctx.lineTo(x + 40 * scale, y - 30 * scale); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 30 * scale, y - 70 * scale); ctx.lineTo(x, y - 120 * scale); ctx.lineTo(x + 30 * scale, y - 70 * scale); ctx.fill();
  };
  
  drawPineTree(width * 0.2, platY - 40, 1.2);
  drawPineTree(width * 0.35, platY - 40, 0.8);
  drawPineTree(width * 0.75, platY - 40, 1.5);
  drawPineTree(width * 0.9, platY - 40, 1.0);

  // Beautiful Flower Wall (Hedge)
  ctx.fillStyle = '#2d6a4f';
  ctx.fillRect(0, platY - 60, width, 60);
  ctx.fillStyle = '#1b4332';
  for(let i=0; i<width; i+=40) {
    ctx.beginPath(); ctx.arc(i + 20, platY - 60, 25, 0, Math.PI*2); ctx.fill();
  }
  // Flowers on the wall
  for(let i=0; i<width; i+=30) {
    const fx = i + (Math.sin(i*123) * 10);
    const fy = platY - 50 + (Math.cos(i*321) * 20);
    ctx.fillStyle = (i % 3 === 0) ? '#ffb703' : (i % 2 === 0) ? '#ff4d6d' : '#ffffff';
    ctx.beginPath();
    for(let j=0; j<5; j++) {
      ctx.arc(fx + Math.cos(j*Math.PI*2/5)*4, fy + Math.sin(j*Math.PI*2/5)*4, 4, 0, Math.PI*2);
    }
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(fx, fy, 2, 0, Math.PI*2); ctx.fill();
  }

  // Ground - Dirt
  renderer.platforms = [];
  renderer.charHomeYNorm = 0.65;
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, platY, width, height - platY);
  
  // Tilled Soil lines
  ctx.fillStyle = '#5C4033';
  for(let i=0; i<height-platY; i+=20) {
    ctx.fillRect(0, platY + i, width, 5);
  }

  // Wooden Fence in background
  ctx.fillStyle = '#8B5A2B';
  ctx.fillRect(0, platY - 40, width, 10);
  ctx.fillRect(0, platY - 20, width, 10);
  for(let i=0; i<=width; i+=80) {
    ctx.fillRect(i, platY - 60, 15, 60);
  }

  // Farm Exit Door
  const exitX = width * 0.85;
  const exitY = platY - 120;
  ctx.fillStyle = '#5C4033';
  ctx.fillRect(exitX - 10, exitY - 10, 80, 140);
  ctx.fillStyle = renderer.isExitOpen ? '#7CFC00' : '#3E2723'; 
  ctx.fillRect(exitX, exitY, 60, 130);
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(exitX + 15, exitY + 65, 5, 0, Math.PI*2); ctx.fill();
}

// ── Level 2: Orchard ─────────────────────────────
export function drawOrchardScene(ctx, width, height, time, renderer) {
  // Sunset sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
  skyGrad.addColorStop(0, '#FF7E5F');
  skyGrad.addColorStop(1, '#FEB47B');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height * 0.5);

  const platY = height * 0.85; // Lower ground level for platforming

  // Background Trees
  const drawTree = (tx, ty, scale) => {
    ctx.fillStyle = '#5C4033';
    ctx.fillRect(tx - 15*scale, ty - 100*scale, 30*scale, 100*scale);
    ctx.fillStyle = '#228B22';
    ctx.beginPath(); ctx.arc(tx, ty - 120*scale, 60*scale, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(tx - 40*scale, ty - 90*scale, 50*scale, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(tx + 40*scale, ty - 90*scale, 50*scale, 0, Math.PI*2); ctx.fill();
  };

  drawTree(width * 0.25, platY, 1.2);
  drawTree(width * 0.55, platY, 1.4);

  // Ground - Lush Grass
  ctx.fillStyle = '#32CD32';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#228B22';
  for(let i=0; i<width; i+=30) {
    ctx.fillRect(i, platY, 5, seededRandom(i) * 15 + 5);
  }

  // Wooden Cart Silhouette
  const cartX = width * 0.7;
  const cartY = platY - 40;
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(cartX, cartY, 80, 30);
  ctx.beginPath(); ctx.arc(cartX + 20, cartY + 30, 15, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cartX + 60, cartY + 30, 15, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#D2691E';
  ctx.beginPath(); ctx.arc(cartX + 20, cartY + 30, 10, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cartX + 60, cartY + 30, 10, 0, Math.PI*2); ctx.fill();

  // Platforms (Tree branches)
  const drawPlatform = (xNorm, yNorm, wNorm) => {
    const px = xNorm * width;
    const py = yNorm * height;
    const pw = wNorm * width;
    ctx.fillStyle = '#5C4033';
    ctx.fillRect(px, py, pw, 10);
    ctx.fillStyle = '#228B22';
    ctx.fillRect(px - 5, py - 5, pw + 10, 5); // Leafy top
  };

  renderer.platforms = [
    { x: 0.15, y: 0.65, w: 0.15, h: 0.05 },
    { x: 0.45, y: 0.55, w: 0.15, h: 0.05 },
  ];
  renderer.charHomeYNorm = 0.85;

  renderer.platforms.forEach(p => drawPlatform(p.x, p.y, p.w));

  // Orchard Gate (Exit)
  const exitX = width * 0.85;
  const exitY = platY - 120;
  ctx.fillStyle = '#8B5A2B';
  ctx.fillRect(exitX - 10, exitY - 10, 80, 140);
  ctx.fillStyle = renderer.isExitOpen ? '#98FB98' : '#A0522D'; 
  ctx.fillRect(exitX, exitY, 60, 130);
}

// ── Level 3: Quarry ─────────────────────────────
export function drawQuarryScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#708090', '#2F4F4F');
  const platY = height * 0.65;

  if (!renderer._platformsInitialized) {
    renderer.platforms = renderer.relics.map(r => ({
      x: (r.x / 100) - 0.05,
      y: (r.y / 100),
      w: 0.10,
      h: 0.05
    }));
    renderer._platformsInitialized = true;
  }
  renderer.charHomeYNorm = 0.65;

  // Rocky Mountain Background
  ctx.fillStyle = '#535c68';
  for(let i=0; i<5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, height * 0.5 + i*20);
    ctx.lineTo(width * 0.3, height * 0.2 + i*40);
    ctx.lineTo(width * 0.7, height * 0.3 + i*10);
    ctx.lineTo(width, height * 0.4 + i*30);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();
    ctx.fillStyle = i%2===0 ? '#636e72' : '#2d3436';
  }

  // Draw Stone Pillars for Platforms
  renderer.platforms.forEach((p, idx) => {
    const px = p.x * width;
    const py = p.y * height;
    const pw = p.w * width;
    
    // Pillar body
    ctx.fillStyle = '#7F8C8D';
    ctx.fillRect(px, py, pw, platY - py);
    
    // Shading/Details
    ctx.fillStyle = '#95A5A6';
    ctx.fillRect(px + 5, py, 10, platY - py); // Highlight
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(px + pw - 15, py, 15, platY - py); // Shadow
    
    // Platform top
    ctx.fillStyle = '#BDC3C7';
    ctx.fillRect(px - 5, py, pw + 10, 15);
    ctx.fillStyle = '#7F8C8D';
    ctx.fillRect(px - 5, py + 15, pw + 10, 5); // rim shadow
  });

  // Wooden Crane/Pulley System
  const craneX = width * 0.75;
  ctx.fillStyle = '#5C4033';
  ctx.fillRect(craneX, height * 0.1, 15, platY - height * 0.1);
  ctx.fillRect(craneX - 60, height * 0.1, 80, 10);
  ctx.strokeStyle = '#BDC3C7'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(craneX - 50, height * 0.1); ctx.lineTo(craneX - 50, platY - 50); ctx.stroke();
  ctx.fillStyle = '#7F8C8D';
  ctx.fillRect(craneX - 65, platY - 50, 30, 20); // Payload box

  // Chains swaying from the ceiling
  ctx.strokeStyle = '#34495e';
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    const cx = width * 0.2 + i * (width * 0.2);
    const sway = Math.sin(time * 0.02 + i) * 15;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    for (let y = 0; y < 150; y += 10) {
      const sx = cx + sway * (y / 150);
      ctx.lineTo(sx, y);
      ctx.strokeRect(sx - 2, y, 4, 8); // Chain links
    }
    ctx.stroke();
  }

  // Rising Steam/Smoke
  ctx.fillStyle = 'rgba(236, 240, 241, 0.2)';
  for(let i=0; i<40; i++) {
    const px = (time * 0.5 + i * 30 + Math.sin(time*0.01 + i)*20) % width;
    const py = platY - ((time * 0.4 + i * 20) % platY);
    const size = 5 + (i % 10) + Math.sin(time*0.05 + i)*5;
    ctx.beginPath(); ctx.arc(px, py, size, 0, Math.PI*2); ctx.fill();
  }

  // Quarry Floor with Magma Veins
  ctx.fillStyle = '#2d3436';
  ctx.fillRect(0, platY, width, height - platY);
  
  // Magma cracks
  ctx.strokeStyle = `rgba(255, 69, 0, ${0.6 + Math.sin(time*0.05)*0.4})`; // Pulsing orange
  ctx.lineWidth = 2;
  for(let i=0; i<15; i++) {
     const rx = seededRandom(i * 3 + 1) * width;
     const ry = platY + seededRandom(i * 3 + 2) * (height - platY);
     ctx.beginPath();
     ctx.moveTo(rx, ry);
     ctx.lineTo(rx + 20, ry + 10);
     ctx.lineTo(rx + 50, ry + 5);
     ctx.stroke();
  }
  
  ctx.fillStyle = '#636e72';
  for(let i=0; i<100; i++) {
     const rx = seededRandom(i * 3 + 1) * width;
     const ry = platY + seededRandom(i * 3 + 2) * (height - platY);
     const rw = seededRandom(i * 3 + 3) * 10 + 5;
     ctx.fillRect(rx, ry, rw, 4);
  }

  // Heavy Iron Exit Door
  const exitX = width * 0.85;
  const exitY = platY - 140;
  ctx.fillStyle = '#2F3542';
  ctx.beginPath(); ctx.arc(exitX + 30, exitY, 40, Math.PI, 0); ctx.fill();
  ctx.fillRect(exitX - 10, exitY, 80, 150);
  ctx.fillStyle = renderer.isExitOpen ? '#F1C40F' : '#111'; 
  ctx.fillRect(exitX, exitY, 60, 140);
  ctx.strokeStyle = '#747D8C'; ctx.lineWidth = 4;
  for(let i=0; i<4; i++) {
    ctx.beginPath(); ctx.moveTo(exitX + 15*i, exitY); ctx.lineTo(exitX + 15*i, exitY + 140); ctx.stroke();
  }
}

// ── Level 4: Garden ─────────────────────────────
export function drawGardenScene(ctx, width, height, time, renderer) {
  // Rainbow Sky
  ctx.fillStyle = '#E0F7FA';
  ctx.fillRect(0, 0, width, height * 0.5);
  
  const colors = [
    [255,0,0], [255,127,0], [255,255,0], [0,255,0], 
    [0,0,255], [75,0,130], [148,0,211]
  ];
  for(let i=0; i<colors.length; i++) {
    const shimmer = 0.2 + Math.sin(time*0.05 + i)*0.05;
    ctx.strokeStyle = `rgba(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]}, ${shimmer})`;
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.65, 300 - i*15, Math.PI, 0);
    ctx.stroke();
  }

  const platY = height * 0.65;
  
  renderer.platforms = [];
  renderer.charHomeYNorm = 0.65;

  // Hedge Maze Background
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, platY - 60, width, 60);
  ctx.fillStyle = '#006400';
  for(let i=0; i<width; i+=40) {
    ctx.beginPath(); ctx.arc(i, platY - 60, 25, Math.PI, 0); ctx.fill();
  }

  // Sprinklers
  const sprinklers = [width * 0.2, width * 0.8];
  ctx.fillStyle = '#BDC3C7';
  sprinklers.forEach(sx => {
    ctx.fillRect(sx, platY - 10, 6, 10);
    // Water spray
    ctx.fillStyle = 'rgba(0, 191, 255, 0.4)';
    const angle = Math.sin(time * 0.1) * 0.5;
    ctx.beginPath();
    ctx.moveTo(sx + 3, platY - 10);
    ctx.lineTo(sx + 3 - 30 * Math.cos(angle), platY - 40 - 30 * Math.sin(angle));
    ctx.lineTo(sx + 3 + 30 * Math.cos(angle), platY - 40 - 30 * Math.sin(angle));
    ctx.fill();
    ctx.fillStyle = '#BDC3C7';
  });

  // Stone Pathway Floor
  ctx.fillStyle = '#7F8C8D';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.strokeStyle = '#95A5A6'; ctx.lineWidth = 3;
  for(let x=0; x<width; x+=50) {
      for(let y=platY; y<height; y+=30) {
          ctx.strokeRect(x + (y%60===0?25:0), y, 50, 30);
      }
  }

  // Greenhouse Exit
  const exitX = width * 0.85;
  const exitY = platY - 140;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Glass
  ctx.fillRect(exitX - 10, exitY - 10, 80, 150);
  ctx.strokeStyle = '#2ECC71'; ctx.lineWidth = 4; // Green frame
  ctx.strokeRect(exitX - 10, exitY - 10, 80, 150);
  ctx.fillStyle = renderer.isExitOpen ? '#FF69B4' : 'rgba(0,0,0,0.5)'; // Pink glow if open
  ctx.fillRect(exitX, exitY, 60, 140);
}

// ── Level 5: Portal Chamber ─────────────────────────────
export function drawPortalChamberScene(ctx, width, height, time, renderer) {
  // Deep mystical cosmic background
  drawVignette(ctx, width, height, '#1a0b2e', '#05010f');
  
  // Ambient Starfield / Magical Dust
  ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
  for (let i = 0; i < 50; i++) {
    const px = seededRandom(i) * width;
    const py = (seededRandom(i + 100) * height + time * (0.2 + seededRandom(i)*0.5)) % height;
    const pSize = seededRandom(i + 200) * 3;
    ctx.beginPath(); ctx.arc(px, height - py, pSize, 0, Math.PI*2); ctx.fill();
  }

  const platY = height * 0.70;

  // 4 Specific Pedestals for the 4 runes (20%, 40%, 60%, 80%) with varying heights
  renderer.platforms = [
    { x: 0.15, y: 0.40, w: 0.1, h: 0.30 }, // High
    { x: 0.35, y: 0.60, w: 0.1, h: 0.10 }, // Low
    { x: 0.55, y: 0.40, w: 0.1, h: 0.30 }, // High
    { x: 0.75, y: 0.60, w: 0.1, h: 0.10 }, // Low
  ];
  renderer.charHomeYNorm = 0.70;

  // Draw the majestic pedestals
  renderer.platforms.forEach((plat, i) => {
    const px = plat.x * width;
    const py = plat.y * height;
    const pw = plat.w * width;
    const ph = plat.h * height;
    
    // Pedestal Base
    const gradient = ctx.createLinearGradient(px, py, px, py + ph);
    gradient.addColorStop(0, '#4a235a');
    gradient.addColorStop(1, '#11051f');
    ctx.fillStyle = gradient;
    ctx.fillRect(px, py, pw, ph);
    
    // Pedestal Top Glow
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.fillRect(px - 5, py, pw + 10, 10);
    
    // Pedestal Runes
    ctx.fillStyle = '#0ff';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.5 + Math.sin(time * 0.05 + i) * 0.3;
    const symbols = ['Δ', 'Φ', 'Ψ', 'Ω'];
    ctx.fillText(symbols[i], px + pw/2, py + ph/2 + 5);
    ctx.globalAlpha = 1.0;
  });

  // Giant Mystical Portal in Background
  const portalX = width * 0.5;
  const portalY = height * 0.35;
  
  // Rotating Portal Rings
  ctx.save();
  ctx.translate(portalX, portalY + 60);
  ctx.rotate(time * 0.02);
  ctx.strokeStyle = 'rgba(138, 43, 226, 0.8)'; ctx.lineWidth = 15;
  ctx.beginPath(); ctx.arc(0, 0, 140, 0, Math.PI*2); ctx.stroke();
  
  ctx.rotate(-time * 0.04);
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)'; ctx.lineWidth = 5;
  ctx.setLineDash([20, 15]);
  ctx.beginPath(); ctx.arc(0, 0, 160, 0, Math.PI*2); ctx.stroke();
  ctx.restore();
  
  // Archway Frame
  ctx.strokeStyle = '#2c1044'; ctx.lineWidth = 30;
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(portalX, portalY + 60, 140, Math.PI, 0); ctx.stroke();
  
  // Inner Archway Gold Trim
  ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(portalX, portalY + 60, 125, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(portalX, portalY + 60, 155, Math.PI, 0); ctx.stroke();
  
  // Portal Energy Event Horizon
  const pPulse = Math.sin(time * 0.1) * 15;
  const pGlow = ctx.createRadialGradient(portalX, portalY+60, 0, portalX, portalY+60, 120 + pPulse);
  pGlow.addColorStop(0, 'rgba(0, 255, 255, 0.9)');
  pGlow.addColorStop(0.3, 'rgba(138, 43, 226, 0.7)');
  pGlow.addColorStop(0.8, 'rgba(75, 0, 130, 0.4)');
  pGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = pGlow;
  ctx.beginPath(); ctx.arc(portalX, portalY + 60, 125, Math.PI, 0); ctx.fill();
  
  // Swirling Cosmic Vortex lines inside portal
  ctx.save();
  ctx.translate(portalX, portalY + 60);
  ctx.rotate(time * 0.05);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  for(let i=0; i<8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(50, 50, 100 + Math.sin(time*0.1)*20, 0);
    ctx.stroke();
  }
  ctx.restore();

  // Shooting Stars
  if (time % 200 < 20) {
    const starX = (time * 15) % (width + 500) - 200;
    const starY = height * 0.1 + (time * 5) % 100;
    const starGrad = ctx.createLinearGradient(starX, starY, starX - 100, starY - 50);
    starGrad.addColorStop(0, '#FFF');
    starGrad.addColorStop(1, 'rgba(0,255,255,0)');
    ctx.strokeStyle = starGrad;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(starX, starY); ctx.lineTo(starX - 100, starY - 50); ctx.stroke();
    ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(starX, starY, 3, 0, Math.PI*2); ctx.fill();
  }
  
  // Floating Target Number '10' over Portal
  ctx.fillStyle = '#0ff';
  ctx.shadowColor = '#0ff'; ctx.shadowBlur = 20;
  ctx.font = 'bold 36px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText("TARGET: 10", portalX, portalY - 110 + Math.sin(time*0.1)*8);
  ctx.shadowBlur = 0;

  // Elaborate Floor with Magic Transmutation Circle
  ctx.fillStyle = '#0d041a';
  ctx.fillRect(0, platY, width, height - platY);
  
  ctx.save();
  ctx.translate(portalX, platY + 60);
  ctx.scale(1, 0.3); // Perspective flattening
  ctx.rotate(time * 0.01);
  
  // Outer circle
  ctx.strokeStyle = '#0ff'; ctx.lineWidth = 4;
  ctx.globalAlpha = 0.4 + Math.sin(time * 0.05) * 0.2;
  ctx.beginPath(); ctx.arc(0, 0, 250, 0, Math.PI*2); ctx.stroke();
  
  // Inner star
  ctx.beginPath();
  for(let i=0; i<5; i++) {
    const angle = (Math.PI * 2 / 5) * i * 2;
    const tx = Math.cos(angle) * 250;
    const ty = Math.sin(angle) * 250;
    if (i === 0) ctx.moveTo(tx, ty);
    else ctx.lineTo(tx, ty);
  }
  ctx.closePath();
  ctx.stroke();
  
  // Inner rings
  ctx.beginPath(); ctx.arc(0, 0, 150, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI*2); ctx.stroke();
  
  ctx.restore();

  // Exit Door Integration (placed to the right)
  const exitX = width * 0.85;
  const exitY = platY - 140;
  
  // Floating Exit Door Frame
  ctx.fillStyle = '#111';
  ctx.fillRect(exitX - 10, exitY - 10, 80, 160);
  ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 4;
  ctx.strokeRect(exitX - 10, exitY - 10, 80, 160);
  
  // Door Interior
  if (renderer.isExitOpen) {
    const doorGlow = ctx.createLinearGradient(exitX, exitY, exitX, exitY + 140);
    doorGlow.addColorStop(0, '#0ff');
    doorGlow.addColorStop(1, '#fff');
    ctx.fillStyle = doorGlow;
    ctx.shadowColor = '#0ff'; ctx.shadowBlur = 20;
    ctx.fillRect(exitX, exitY, 60, 140);
    ctx.shadowBlur = 0;
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(exitX, exitY, 60, 140);
    // Large Padlock
    ctx.fillStyle = '#666';
    ctx.fillRect(exitX + 20, exitY + 60, 20, 20);
    ctx.beginPath(); ctx.arc(exitX + 30, exitY + 60, 10, Math.PI, 0); 
    ctx.strokeStyle = '#666'; ctx.lineWidth = 4; ctx.stroke();
  }
}

// ── Level 6: Treasure Hall ─────────────────────────────
export function drawTreasureHallScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#4a2511', '#1a0d06');
  const platY = height * 0.65;

  renderer.platforms = [
    { x: 0.1, y: 0.50, w: 0.15, h: 0.05 },
    { x: 0.35, y: 0.40, w: 0.15, h: 0.05 },
  ];
  renderer.charHomeYNorm = 0.65;

  // Ornate Pillars
  ctx.fillStyle = '#b8860b'; // Dark Gold
  for(let i=0; i<=width; i+=150) {
      ctx.fillRect(i, 0, 40, platY);
      ctx.fillStyle = '#daa520';
      ctx.fillRect(i + 5, 0, 10, platY);
      ctx.fillRect(i + 25, 0, 10, platY);
      ctx.fillStyle = '#b8860b';
      // Base/Capital
      ctx.fillRect(i - 10, 0, 60, 20);
      ctx.fillRect(i - 10, platY - 20, 60, 20);
  }

  // Removed glitchy red/blue particles

  // Floor (Polished Marble)
  ctx.fillStyle = '#2c1e0b';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#f1c40f'; // Gold inlay lines
  ctx.fillRect(0, platY + 5, width, 2);
  for(let x=0; x<width; x+=60) {
      ctx.fillRect(x, platY, 2, height - platY);
  }

  // Sliding Window Highlight Frame (Animated background effect)
  // We approximate the sliding window visualizing the algorithm
  const windowWidth = 3 * 150; // roughly 3 relics wide
  const windowX = (time * 1.5) % (width + windowWidth) - windowWidth;
  ctx.fillStyle = 'rgba(255, 215, 0, 0.15)'; // Gold highlight
  ctx.fillRect(windowX, platY - 80, windowWidth, 80);
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 4;
  ctx.strokeRect(windowX, platY - 80, windowWidth, 80);

  // Grand Gold Vault Door
  const exitX = width * 0.85;
  const exitY = platY - 140;
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(exitX - 10, exitY - 10, 80, 160);
  ctx.fillStyle = renderer.isExitOpen ? '#FFF' : '#FFD700'; // Brilliant white when open
  ctx.fillRect(exitX, exitY, 60, 150);
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(exitX + 10, exitY + 75, 8, 0, Math.PI*2); ctx.fill();
}

// ── Level 7: Mirror Hall ─────────────────────────────
export function drawMirrorHallScene(ctx, width, height, time, renderer) {
  // Aurora Borealis Background
  const auroraGrad = ctx.createLinearGradient(0, 0, width, height);
  auroraGrad.addColorStop(0, '#0a0b10');
  auroraGrad.addColorStop(0.3, `rgba(0, 255, 128, ${0.1 + Math.sin(time*0.02)*0.05})`);
  auroraGrad.addColorStop(0.7, `rgba(0, 128, 255, ${0.1 + Math.cos(time*0.015)*0.05})`);
  auroraGrad.addColorStop(1, '#535c68');
  ctx.fillStyle = auroraGrad;
  ctx.fillRect(0, 0, width, height);
  
  // Aurora Ribbon
  ctx.beginPath();
  for(let i=0; i<width; i+=20) {
    const y = height * 0.2 + Math.sin(time*0.01 + i*0.01)*50 + Math.cos(time*0.005 + i*0.02)*30;
    if(i===0) ctx.moveTo(i, y);
    else ctx.lineTo(i, y);
  }
  ctx.strokeStyle = `rgba(0, 255, 200, 0.3)`;
  ctx.lineWidth = 40;
  ctx.stroke();

  const platY = height * 0.65;

  if (!renderer._platformsInitialized) {
    renderer.platforms = renderer.relics.map(r => ({
      x: (r.x / 100) - 0.04,
      y: (r.y / 100),
      w: 0.08,
      h: 0.05
    }));
    renderer._platformsInitialized = true;
  }
  renderer.charHomeYNorm = 0.65;

  // Draw Frosted Glass Pedestals
  renderer.platforms.forEach((p, idx) => {
    const px = p.x * width;
    const py = p.y * height;
    const pw = p.w * width;
    
    // Glass Body
    const glassGrad = ctx.createLinearGradient(px, py, px, platY);
    glassGrad.addColorStop(0, 'rgba(223, 249, 251, 0.8)');
    glassGrad.addColorStop(1, 'rgba(149, 165, 166, 0.4)');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(px, py, pw, platY - py);
    
    // Edges/Highlights
    ctx.strokeStyle = '#ecf0f1'; ctx.lineWidth = 2;
    ctx.strokeRect(px, py, pw, platY - py);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(px + 5, py + 5, 5, platY - py - 10);
  });

  // Giant Central Mirror
  const mx = width * 0.5;
  const my = height * 0.35;
  
  // Glowing Frame Pulse
  const framePulse = Math.sin(time * 0.05) * 5 + 5;
  ctx.fillStyle = `rgba(189, 195, 199, ${0.5 + Math.sin(time*0.05)*0.2})`;
  ctx.beginPath(); ctx.ellipse(mx, my, 220 + framePulse, 120 + framePulse, 0, 0, Math.PI*2); ctx.fill();
  
  // Mirror Frame
  ctx.fillStyle = '#bdc3c7';
  ctx.beginPath(); ctx.ellipse(mx, my, 220, 120, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ecf0f1';
  ctx.beginPath(); ctx.ellipse(mx, my, 200, 100, 0, 0, Math.PI*2); ctx.fill();
  
  // Reflection Gradient
  const rGlow = ctx.createLinearGradient(mx-200, my-100, mx+200, my+100);
  rGlow.addColorStop(0, 'rgba(255,255,255,0.8)');
  rGlow.addColorStop(0.5, 'rgba(129, 236, 236, 0.3)');
  rGlow.addColorStop(1, 'rgba(255,255,255,0.1)');
  ctx.fillStyle = rGlow;
  ctx.beginPath(); ctx.ellipse(mx, my, 200, 100, 0, 0, Math.PI*2); ctx.fill();

  // Reflected Palindrome text in mirror
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.font = "bold 60px monospace";
  ctx.textAlign = 'center';
  // scale(-1, 1) to mirror text
  ctx.save();
  ctx.translate(mx, my + 20);
  ctx.scale(-1, 1);
  ctx.fillText("RADAR", 0, 0);
  ctx.restore();

  // Rotating, floating glass shards
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for(let i=0; i<15; i++) {
      const px = (time * 0.5 + i * 50) % width;
      const py = height * 0.2 + Math.sin(time*0.02 + i)*50;
      ctx.save();
      ctx.translate(px + 5, py + 5);
      ctx.rotate(time * 0.01 + i);
      ctx.beginPath();
      ctx.moveTo(-5, -5); ctx.lineTo(5, 0); ctx.lineTo(0, 10);
      ctx.fill();
      ctx.restore();
  }

  // Ice/Glass Floor with Specular Reflection
  ctx.fillStyle = '#95a5a6';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = 'rgba(223, 249, 251, 0.5)';
  ctx.fillRect(0, platY, width, Math.sin(time*0.05)*10 + 20);
  
  // Specular waves
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  for(let i=0; i<5; i++) {
    const sw = 100;
    const sx = (time * 2 + i * 300) % (width + sw) - sw;
    ctx.fillRect(sx, platY, sw, height - platY);
  }

  // Crystal Exit
  const exitX = width * 0.85;
  const exitY = platY - 140;
  ctx.fillStyle = '#7f8fa6';
  ctx.beginPath(); ctx.moveTo(exitX - 10, exitY + 150); ctx.lineTo(exitX + 30, exitY - 30); ctx.lineTo(exitX + 70, exitY + 150); ctx.fill();
  ctx.fillStyle = renderer.isExitOpen ? '#00a8ff' : '#353b48'; 
  ctx.beginPath(); ctx.moveTo(exitX, exitY + 150); ctx.lineTo(exitX + 30, exitY); ctx.lineTo(exitX + 60, exitY + 150); ctx.fill();
}

// ── Level 8: Rune Archive ─────────────────────────────
export function drawRuneArchiveScene(ctx, width, height, time, renderer) {
  // Sunlit Sky Background
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.65);
  skyGrad.addColorStop(0, '#87CEEB'); // Sky blue
  skyGrad.addColorStop(1, '#E0F7FA'); // Light cyan near horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);
  
  const platY = height * 0.65;

  // Sunbeams
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for(let i=0; i<5; i++) {
    const angle = (time * 0.01 + i * 0.5) % Math.PI;
    const beamGrad = ctx.createLinearGradient(width*0.5, 0, width*0.5 + Math.cos(angle)*width, Math.sin(angle)*height);
    beamGrad.addColorStop(0, 'rgba(255, 255, 200, 0.3)');
    beamGrad.addColorStop(1, 'rgba(255, 255, 200, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(width*0.5, -50);
    ctx.lineTo(width*0.5 + Math.cos(angle - 0.2)*width*1.5, Math.sin(angle - 0.2)*height*1.5);
    ctx.lineTo(width*0.5 + Math.cos(angle + 0.2)*width*1.5, Math.sin(angle + 0.2)*height*1.5);
    ctx.fill();
  }
  ctx.restore();

  if (!renderer._platformsInitialized) {
    renderer.platforms = renderer.relics.map(r => ({
      x: (r.x / 100) - 0.06,
      y: (r.y / 100),
      w: 0.12,
      h: 0.05
    }));
    renderer._platformsInitialized = true;
  }
  renderer.charHomeYNorm = 0.65;

  // Draw Ornate Floating Gold Rings (Pedestals)
  renderer.platforms.forEach((p, idx) => {
    const px = p.x * width;
    const py = p.y * height;
    const pw = p.w * width;
    
    // Floating oscillation
    const floatY = py + Math.sin(time * 0.05 + idx) * 5;
    
    // Glowing ring aura
    const auraGrad = ctx.createRadialGradient(px + pw/2, floatY + 5, 0, px + pw/2, floatY + 5, pw);
    auraGrad.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
    auraGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath(); ctx.ellipse(px + pw/2, floatY + 5, pw, 15, 0, 0, Math.PI*2); ctx.fill();

    // Outer Gold Ring
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(px + pw/2, floatY, pw/2, 10, 0, 0, Math.PI*2); ctx.stroke();
    
    // Inner glowing ring
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(px + pw/2, floatY, pw/2 - 4, 8, 0, 0, Math.PI*2); ctx.stroke();
  });

  // Floating Alphabets in Background
  const floatingChars = "LISTENSILENT".split('');
  ctx.font = "bold 32px monospace";
  for(let i=0; i<floatingChars.length; i++) {
    // Make them float around wildly but smoothly
    const rx = (time * 0.4 + i * (width / floatingChars.length) + Math.sin(time*0.02+i)*60) % width;
    const ry = height - ((time * 0.6 + i * 70) % height);
    
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(time * 0.02 + i);
    ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(time*0.05 + i)*0.4})`;
    ctx.fillText(floatingChars[i], 0, 0);
    ctx.restore();
  }

  // Giant Script Comparer Machine (Bright Academy Style)
  const mx = width * 0.5;
  ctx.fillStyle = '#ECF0F1'; // White metal
  ctx.beginPath(); ctx.moveTo(mx - 80, height * 0.2); ctx.lineTo(mx + 80, height * 0.2);
  ctx.lineTo(mx + 40, platY); ctx.lineTo(mx - 40, platY); ctx.fill();
  
  // Golden Screen
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(mx - 60, height * 0.25, 120, 40);
  ctx.fillStyle = '#2C3E50';
  ctx.textAlign = 'center';
  ctx.font = "bold 16px monospace";
  
  // ANIMATION: Alphabets Matching!
  // If the user has collected both relics (meaning the algorithm succeeded)
  if (renderer.collectedRelics && renderer.collectedRelics.size === 2) {
      ctx.fillText("MATCH FOUND!", mx, height * 0.25 + 25);
      
      // Draw massive floating alphabets above the machine that animate sorting and glowing
      const word1 = "LISTEN".split('');
      const word2 = "SILENT".split('');
      const sorted = "EILNST".split('');
      
      // Animate sorting process based on time
      const phase = (time % 300) / 300; // 0 to 1 cycle
      ctx.font = "bold 36px monospace";
      
      let display1 = word1;
      let display2 = word2;
      let glow = false;
      
      if (phase > 0.4 && phase < 0.8) {
          // Sorting phase
          display1 = sorted;
          display2 = sorted;
      } else if (phase >= 0.8) {
          // Matched phase! Glow bright green
          display1 = sorted;
          display2 = sorted;
          glow = true;
      }
      
      const charWidth = 25;
      const startX1 = mx - (display1.length * charWidth) / 2 + 10;
      const startX2 = mx - (display2.length * charWidth) / 2 + 10;
      
      for(let i=0; i<display1.length; i++) {
          ctx.fillStyle = glow ? '#2ECC71' : '#34495E';
          const y1 = height * 0.15 - (glow ? Math.sin(time*0.2 + i)*5 : 0);
          ctx.fillText(display1[i], startX1 + i*charWidth, y1);
          
          ctx.fillStyle = glow ? '#2ECC71' : '#7F8C8D';
          const y2 = height * 0.15 - 40 + (glow ? Math.sin(time*0.2 + i)*5 : 0);
          ctx.fillText(display2[i], startX2 + i*charWidth, y2);
      }
      
      if (glow) {
         ctx.fillStyle = 'rgba(46, 204, 113, 0.4)';
         ctx.beginPath(); ctx.ellipse(mx, height*0.15 - 20, 100, 40, 0, 0, Math.PI*2); ctx.fill();
      }
      
  } else {
      ctx.fillText("ANAGRAM MATCH", mx, height * 0.25 + 25);
  }
  
  // Magical connection beams from pedestals to machine
  if (renderer.platforms.length === 2) {
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(time*0.1)*0.2})`; // Pulsing gold
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(renderer.platforms[0].x * width + renderer.platforms[0].w * width/2, renderer.platforms[0].y * height);
    ctx.lineTo(mx - 40, height * 0.25 + 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(renderer.platforms[1].x * width + renderer.platforms[1].w * width/2, renderer.platforms[1].y * height);
    ctx.lineTo(mx + 40, height * 0.25 + 20);
    ctx.stroke();
  }

  // Polished Floor
  ctx.fillStyle = '#FDFEFE'; // Bright white floor
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#E5E8E8'; // Grid lines
  for(let x=0; x<width; x+=60) {
      for(let y=platY; y<height; y+=40) {
          ctx.strokeRect(x, y, 60, 40);
      }
  }

  // Grand Archway Exit
  const exitX = width * 0.85;
  const exitY = platY - 140;
  ctx.fillStyle = '#BDC3C7'; // Silver/Gray frame
  ctx.beginPath(); ctx.arc(exitX + 30, exitY, 40, Math.PI, 0); ctx.fill();
  ctx.fillRect(exitX - 10, exitY, 80, 150);
  ctx.fillStyle = renderer.isExitOpen ? '#F1C40F' : '#7F8C8D'; // Gold if open, dull gray if closed
  ctx.beginPath(); ctx.arc(exitX + 30, exitY + 10, 30, Math.PI, 0); ctx.fill();
  ctx.fillRect(exitX, exitY + 10, 60, 140);
}

// ── Level 9: Royal Ledger ─────────────────────────────
export function drawRoyalLedgerScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#3e2723', '#1b0000');
  const platY = height * 0.65;

  if (!renderer._platformsInitialized) {
    renderer.platforms = renderer.relics.map(r => ({
      x: (r.x / 100) - 0.05,
      y: (r.y / 100),
      w: 0.10,
      h: 0.05
    }));
    renderer._platformsInitialized = true;
  }
  renderer.charHomeYNorm = 0.65;

  // Draw Bookshelf Staircase Platforms
  renderer.platforms.forEach((p, idx) => {
    const px = p.x * width;
    const py = p.y * height;
    const pw = p.w * width;
    
    // Bookshelf body
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(px, py, pw, platY - py);
    ctx.fillStyle = '#2d1e11';
    ctx.fillRect(px + 5, py, pw - 10, platY - py);
    
    // Shelves
    ctx.fillStyle = '#4E342E';
    for (let shelfY = py + 20; shelfY < platY; shelfY += 25) {
      ctx.fillRect(px, shelfY, pw, 5);
      // Random books on shelf
      for (let bx = px + 5; bx < px + pw - 15; bx += 10 + seededRandom(bx)*5) {
        if (seededRandom(shelfY + bx) > 0.3) {
          ctx.fillStyle = `hsl(${seededRandom(bx)*360}, 50%, 40%)`;
          ctx.fillRect(bx, shelfY - 15, 8 + seededRandom(bx)*5, 15);
        }
      }
    }
    
    // Top of shelf (platform surface)
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(px - 5, py, pw + 10, 10);
  });

  // Massive Bookshelves
  ctx.fillStyle = '#2d1e11';
  ctx.fillRect(width * 0.1, height * 0.1, 150, platY - height * 0.1);
  ctx.fillRect(width * 0.7, height * 0.1, 150, platY - height * 0.1);
  
  ctx.fillStyle = '#1a0d05';
  for(let y=height*0.2; y<platY; y+=30) {
      ctx.fillRect(width * 0.1, y, 150, 5);
      ctx.fillRect(width * 0.7, y, 150, 5);
  }

  // Books (deterministic positions and colors)
  for(let i=0; i<50; i++) {
      const bx = width * 0.1 + seededRandom(i * 4 + 300) * 130;
      const by = height * 0.2 + Math.floor(seededRandom(i * 4 + 301) * 5) * 30 - 20;
      const hue = seededRandom(i * 4 + 302) * 360;
      const bw = 10 + seededRandom(i * 4 + 303) * 10;
      ctx.fillStyle = `hsl(${hue}, 50%, 30%)`;
      ctx.fillRect(bx, by, bw, 20);
  }

  // Shafts of light from above
  const lightPulse = 0.5 + Math.sin(time*0.05)*0.1;
  const shaftGrad1 = ctx.createLinearGradient(width*0.2, 0, width*0.4, platY);
  shaftGrad1.addColorStop(0, `rgba(255, 235, 180, ${lightPulse * 0.4})`);
  shaftGrad1.addColorStop(1, 'rgba(255, 235, 180, 0)');
  ctx.fillStyle = shaftGrad1;
  ctx.beginPath(); ctx.moveTo(width*0.1, 0); ctx.lineTo(width*0.3, 0); ctx.lineTo(width*0.5, platY); ctx.lineTo(width*0.3, platY); ctx.fill();

  const shaftGrad2 = ctx.createLinearGradient(width*0.8, 0, width*0.6, platY);
  shaftGrad2.addColorStop(0, `rgba(255, 235, 180, ${lightPulse * 0.3})`);
  shaftGrad2.addColorStop(1, 'rgba(255, 235, 180, 0)');
  ctx.fillStyle = shaftGrad2;
  ctx.beginPath(); ctx.moveTo(width*0.7, 0); ctx.lineTo(width*0.9, 0); ctx.lineTo(width*0.7, platY); ctx.lineTo(width*0.5, platY); ctx.fill();

  // Floating Dust Motes
  ctx.fillStyle = 'rgba(255, 240, 200, 0.6)';
  for(let i=0; i<30; i++) {
      const dx = (time * 0.2 + i * 40) % width;
      const dy = height * 0.1 + ((time * 0.1 + i * 20) % (platY - height*0.1));
      ctx.fillRect(dx + Math.sin(time*0.02 + i)*10, dy, 2, 2);
  }

  // The Set Filter Machine (Background)
  const mx = width * 0.5;
  
  // Flickering Machine Core
  const flicker = 0.7 + Math.random() * 0.3;
  ctx.fillStyle = `rgba(255, 82, 82, ${flicker})`;
  ctx.beginPath(); ctx.arc(mx, height*0.2, 30, 0, Math.PI*2); ctx.fill();

  ctx.fillStyle = '#b71c1c';
  ctx.beginPath(); ctx.moveTo(mx - 60, height * 0.2); ctx.lineTo(mx + 60, height * 0.2);
  ctx.lineTo(mx + 20, platY); ctx.lineTo(mx - 20, platY); ctx.fill(); // Funnel
  ctx.fillStyle = '#ff5252';
  ctx.fillRect(mx - 50, height * 0.2, 100, 10);
  
  // Falling papers in funnel (smooth time-based)
  ctx.fillStyle = '#fff';
  for(let i=0; i<5; i++) {
      const py = height * 0.2 + ((time + i*40)%150);
      const px = mx - 20 + Math.sin(py*0.05)*10;
      if(py < platY) ctx.fillRect(px, py, 10, 15);
  }

  // Red Carpet Floor
  ctx.fillStyle = '#212121';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#c62828'; // Carpet
  ctx.fillRect(width * 0.2, platY, width * 0.6, height - platY);
  ctx.fillStyle = '#ffc107'; // Gold trim
  ctx.fillRect(width * 0.2 - 5, platY, 5, height - platY);
  ctx.fillRect(width * 0.8, platY, 5, height - platY);

  // Heavy Wood Exit
  const exitX = width * 0.85;
  const exitY = platY - 140;
  ctx.fillStyle = '#3e2723';
  ctx.beginPath(); ctx.arc(exitX + 30, exitY, 40, Math.PI, 0); ctx.fill();
  ctx.fillRect(exitX - 10, exitY, 80, 150);
  ctx.fillStyle = renderer.isExitOpen ? '#ffeb3b' : '#111'; 
  ctx.fillRect(exitX, exitY, 60, 140);
}

// ── Level 10: Enchanted Cave ─────────────────────────────
export function drawEnchantedCaveScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#192a56', '#090a0f');
  const platY = height * 0.65;

  if (!renderer._platformsInitialized) {
    renderer.platforms = renderer.relics.map(r => ({
      x: (r.x / 100) - 0.05,
      y: (r.y / 100),
      w: 0.10,
      h: 0.05
    }));
    renderer._platformsInitialized = true;
  }
  renderer.charHomeYNorm = 0.65;

  // Draw Crystal Stalagmites for Platforms
  renderer.platforms.forEach((p, idx) => {
    const px = p.x * width;
    const py = p.y * height;
    const pw = p.w * width;
    
    // Heartbeat pulse effect
    const heartbeat = Math.sin(time * 0.1 + idx) * 0.5 + 0.5; // 0 to 1
    const pulseAlpha = 0.5 + heartbeat * 0.5;
    
    // Base stalagmite body
    const cGrad = ctx.createLinearGradient(px, py, px + pw, platY);
    cGrad.addColorStop(0, `rgba(142, 68, 173, ${pulseAlpha})`); // Purple top
    cGrad.addColorStop(1, '#2c3e50'); // Dark base
    ctx.fillStyle = cGrad;
    
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + pw, py);
    ctx.lineTo(px + pw + 15, platY);
    ctx.lineTo(px - 15, platY);
    ctx.closePath();
    ctx.fill();
    
    // Crystal facets (highlights)
    ctx.fillStyle = `rgba(155, 89, 182, ${0.4 + heartbeat*0.4})`; // Pulsing highlight
    ctx.beginPath();
    ctx.moveTo(px + pw*0.2, py);
    ctx.lineTo(px + pw*0.5, py);
    ctx.lineTo(px + pw*0.5 + 5, platY);
    ctx.lineTo(px + pw*0.2 - 5, platY);
    ctx.fill();
    
    // Platform flat top
    ctx.fillStyle = '#9b59b6';
    ctx.fillRect(px - 2, py, pw + 4, 10);
    ctx.fillStyle = '#ecf0f1'; // Sparkle
    ctx.fillRect(px + pw*0.8, py + 2, 4, 4);
    
    // Ambient glow aura
    const auraGrad = ctx.createRadialGradient(px + pw/2, py, 0, px + pw/2, py, pw*1.5);
    auraGrad.addColorStop(0, `rgba(155, 89, 182, ${0.3 * heartbeat})`);
    auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath(); ctx.arc(px + pw/2, py, pw*1.5, 0, Math.PI*2); ctx.fill();
  });

  // Stalactites (deterministic shapes)
  ctx.fillStyle = '#273c75';
  for(let i=0; i<20; i++) {
      const sx = i * (width / 20) + seededRandom(i + 400) * 20;
      const tipLen = seededRandom(i + 401) * 100 + 50;
      ctx.beginPath();
      ctx.moveTo(sx, 0); ctx.lineTo(sx + 15, tipLen); ctx.lineTo(sx + 30, 0);
      ctx.fill();
  }

  // Magical Wall Symbols (Unique sequence abcabcbb)
  const symbols = "ABCABCBB";
  ctx.font = "bold 30px monospace";
  const startX = width * 0.2;
  for(let i=0; i<symbols.length; i++) {
      const char = symbols[i];
      const isUniqueWindow = i < 3; // roughly highlight 'ABC'
      ctx.fillStyle = isUniqueWindow ? `rgba(156, 136, 255, ${0.5 + Math.sin(time*0.1)*0.5})` : 'rgba(113, 128, 147, 0.5)';
      ctx.fillText(char, startX + i*50, height * 0.4);
  }

  // Glowing Pool (Floor)
  ctx.fillStyle = '#141e30';
  ctx.fillRect(0, platY, width, height - platY);
  const poolGrad = ctx.createLinearGradient(0, platY, 0, height);
  poolGrad.addColorStop(0, 'rgba(0, 168, 255, 0.4)');
  poolGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = poolGrad;
  ctx.fillRect(width * 0.2, platY + 20, width * 0.6, height - platY - 20);

  // Pool Ripples
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const rY = platY + 30 + i * 20;
    const rX = width * 0.5 + Math.sin(time * 0.05 + i) * 50;
    const rW = width * 0.3 + Math.sin(time * 0.02 + i) * 100;
    ctx.beginPath();
    ctx.ellipse(rX, rY, rW, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Bioluminescent Spores
  for(let i=0; i<30; i++) {
    const px = (time * 0.4 + i * 40 + Math.sin(time*0.02+i)*20) % width;
    const py = height - ((time * 0.5 + i * 30) % (height - height * 0.4));
    const alpha = 0.3 + Math.sin(time * 0.1 + i) * 0.5;
    ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
    ctx.beginPath(); ctx.arc(px, py, 2 + (i%2)*2, 0, Math.PI*2); ctx.fill();
  }

  // Bioluminescent mushrooms
  const mushX = [width*0.1, width*0.9];
  mushX.forEach(x => {
    ctx.fillStyle = '#00a8ff';
    ctx.beginPath(); ctx.arc(x, platY - 10, 10, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#353b48';
    ctx.fillRect(x - 3, platY - 10, 6, 15);
  });

  // Cave Tunnel Exit
  const exitX = width * 0.85;
  const exitY = platY - 140;
  ctx.fillStyle = '#273c75';
  ctx.beginPath(); ctx.arc(exitX + 30, exitY + 40, 40, Math.PI, 0); ctx.fill();
  ctx.fillRect(exitX - 10, exitY + 40, 80, 110);
  ctx.fillStyle = renderer.isExitOpen ? '#00a8ff' : '#111'; // Glowing cyan tunnel
  ctx.fillRect(exitX, exitY + 40, 60, 100);
}
