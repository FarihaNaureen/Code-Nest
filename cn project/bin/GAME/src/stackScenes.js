// ==========================================
// stackScenes.js - High Quality RPG Environments
// ==========================================

function drawVignette(ctx, width, height, color1, color2) {
  const gradient = ctx.createRadialGradient(width/2, height/2, width*0.3, width/2, height/2, width*0.8);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// ── Level 2: Ancient Ruined Library ─────────────────────────────
export function drawLibraryScene(ctx, width, height, time, renderer) {
  // Background Wall & Vignette
  drawVignette(ctx, width, height, '#2b1d14', '#0f0a06');
  const platY = height * 0.65;
  
  // Stained Glass Window
  const cx = width * 0.3;
  const cy = height * 0.25;
  const pulse = Math.sin(time * 0.05) * 0.2 + 0.8;
  const glassGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
  glassGlow.addColorStop(0, `rgba(100, 200, 255, ${0.4 * pulse})`);
  glassGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glassGlow;
  ctx.fillRect(0, 0, width, height);
  
  // Window frame
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI, true); ctx.fill();
  ctx.fillRect(cx - 40, cy, 80, 50);
  ctx.fillStyle = 'rgba(100, 150, 255, 0.4)';
  ctx.beginPath(); ctx.arc(cx, cy, 35, 0, Math.PI, true); ctx.fill();
  ctx.fillRect(cx - 35, cy, 70, 45);
  ctx.strokeStyle = '#111'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx, cy - 35); ctx.lineTo(cx, cy + 45); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 35, cy + 10); ctx.lineTo(cx + 35, cy + 10); ctx.stroke();

  // Bookshelves in Background
  ctx.fillStyle = '#1f130b';
  ctx.fillRect(width * 0.6, height * 0.1, 120, platY - height * 0.1);
  for(let i=0; i<5; i++) {
    ctx.fillStyle = '#110a05';
    ctx.fillRect(width * 0.6, height * 0.1 + i*30, 120, 5);
    // Books
    for(let j=0; j<8; j++) {
      ctx.fillStyle = `hsl(${Math.random()*360}, 50%, 30%)`;
      ctx.fillRect(width * 0.62 + j*13, height * 0.1 + i*30 - 20, 10, 20);
    }
  }

  // Floor
  ctx.fillStyle = '#1c1005';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.strokeStyle = '#2b1d14';
  ctx.lineWidth = 2;
  for(let i=0; i<10; i++) {
    ctx.strokeRect(i * 50, platY + 10, 48, 20);
    ctx.strokeRect(i * 50 - 25, platY + 32, 48, 20);
  }

  // Floating magic dust
  ctx.fillStyle = 'rgba(150, 200, 255, 0.6)';
  for(let i=0; i<20; i++) {
    const px = (time * 0.02 + i * 40) % width;
    const py = (height * 0.8) - ((time * 0.01 + i * 20) % (height * 0.6));
    ctx.fillRect(px, py + Math.sin(time*0.05 + i)*5, 2, 2);
  }

  // Giant Magical Bookshelf (Stack Mechanism)
  const stackX = width * 0.50;
  ctx.fillStyle = '#3d2611';
  ctx.fillRect(stackX - 45, height * 0.15, 90, platY - height * 0.15);
  ctx.strokeStyle = '#1c1005'; ctx.lineWidth = 6;
  ctx.strokeRect(stackX - 45, height * 0.15, 90, platY - height * 0.15);
  
  // Glowing insertion zone
  const stackGlow = ctx.createRadialGradient(stackX, platY - 20, 0, stackX, platY - 20, 50);
  stackGlow.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
  stackGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = stackGlow;
  ctx.fillRect(stackX - 40, platY - 40, 80, 40);

  if (renderer && renderer.stackData) {
    for (let i = 0; i < renderer.stackData.length; i++) {
      const item = renderer.stackData[i];
      const sy = platY - (i + 1) * 35 - 5;
      
      // Draw Rune Stone carved tablet inside the shelf
      ctx.fillStyle = '#5c5c5c';
      ctx.fillRect(stackX - 25, sy, 50, 30);
      ctx.fillStyle = '#a0a0a0';
      ctx.fillRect(stackX - 22, sy + 3, 44, 24);
      
      // Magical glowing runes
      ctx.fillStyle = '#0ff';
      ctx.shadowColor = '#0ff'; ctx.shadowBlur = 10;
      ctx.font = "bold 16px 'Cinzel', monospace";
      ctx.textAlign = 'center';
      ctx.fillText(String(item).replace('_Rune', ''), stackX, sy + 22);
      ctx.shadowBlur = 0;
    }
  }

  // Book Vault Door
  const exitX = width * 0.85;
  const exitY = height * 0.35;
  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(exitX - 15, exitY - 15, 90, 160);
  ctx.fillStyle = renderer.isExitOpen ? '#6ab04c' : '#8b2a2a'; // Green/Red thick door
  ctx.fillRect(exitX, exitY, 60, 140);
  // Heavy gold frame and handle
  ctx.fillStyle = '#daa520';
  ctx.fillRect(exitX - 5, exitY - 5, 70, 10);
  ctx.fillRect(exitX - 5, exitY + 135, 70, 10);
  ctx.beginPath(); ctx.arc(exitX + 45, exitY + 70, 5, 0, Math.PI*2); ctx.fill();
}

// ── Level 3: Dungeon Scale ──────────────────────────────────
export function drawDungeonScaleScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#1a1a2e', '#05050f');
  const platY = height * 0.65;

  // Stone Brick Wall Background
  ctx.strokeStyle = '#11111a';
  ctx.lineWidth = 3;
  for(let y=0; y<height; y+=30) {
    for(let x=0; x<width; x+=60) {
      let ox = (y/30)%2===0 ? 0 : 30;
      ctx.strokeRect(x - ox, y, 60, 30);
    }
  }

  // Wall Torches
  const torches = [{x: width*0.2, y: height*0.3}, {x: width*0.8, y: height*0.3}];
  torches.forEach(t => {
    ctx.fillStyle = '#444'; ctx.fillRect(t.x - 5, t.y, 10, 20);
    const flame = Math.sin(time*0.2 + t.x)*5;
    ctx.fillStyle = '#ff6b6b'; ctx.beginPath(); ctx.arc(t.x, t.y-10-flame/2, 10+flame, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#feca57'; ctx.beginPath(); ctx.arc(t.x, t.y-5-flame/2, 6+flame/2, 0, Math.PI*2); ctx.fill();
    const tglow = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 60);
    tglow.addColorStop(0, 'rgba(255, 100, 50, 0.4)'); tglow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = tglow; ctx.beginPath(); ctx.arc(t.x, t.y, 60, 0, Math.PI*2); ctx.fill();
  });

  // Hanging Iron Chains
  ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
  for(let i=0; i<10; i++) {
    ctx.beginPath(); ctx.ellipse(width*0.35, i*15, 6, 10, 0, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(width*0.65, i*15, 6, 10, 0, 0, Math.PI*2); ctx.stroke();
  }

  // Floor
  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#22223b';
  ctx.fillRect(0, platY, width, 5);

  // Giant Brass Scale (Stack Mechanism)
  const stackX = width * 0.50;
  ctx.fillStyle = '#4a4e69'; // Central iron pillar
  ctx.fillRect(stackX - 15, height * 0.2, 30, platY - height * 0.2);
  ctx.fillStyle = '#9a8c98'; // Iron details
  for(let i=0; i<5; i++) { ctx.fillRect(stackX - 20, height * 0.3 + i*30, 40, 10); }
  
  // Glowing Scale Plate (Insertion base)
  ctx.fillStyle = '#c9b037';
  ctx.fillRect(stackX - 40, platY - 15, 80, 10);

  if (renderer && renderer.stackData) {
    for (let i = 0; i < renderer.stackData.length; i++) {
      const item = renderer.stackData[i];
      const sy = platY - (i + 1) * 35 - 5;
      
      // Sun or Moon Tablet
      const isSun = item.includes('Sun');
      ctx.fillStyle = isSun ? '#e1b12c' : '#273c75';
      ctx.fillRect(stackX - 25, sy, 50, 30);
      ctx.fillStyle = isSun ? '#fbc531' : '#192a56';
      ctx.fillRect(stackX - 20, sy + 5, 40, 20);
      
      // Glowing emblem
      ctx.fillStyle = isSun ? '#fff' : '#00a8ff';
      ctx.beginPath(); ctx.arc(stackX, sy + 15, 8, 0, Math.PI*2); ctx.fill();
    }
  }

  // Dungeon Gate Exit
  const exitX = width * 0.85;
  const exitY = height * 0.35;
  ctx.fillStyle = '#22223b';
  ctx.fillRect(exitX - 15, exitY - 15, 90, 160);
  ctx.fillStyle = renderer.isExitOpen ? '#20bf6b' : '#111';
  ctx.fillRect(exitX, exitY, 60, 140);
  ctx.strokeStyle = '#4a4e69'; ctx.lineWidth = 4;
  for(let i=0; i<4; i++) {
    ctx.beginPath(); ctx.moveTo(exitX + 15*i, exitY); ctx.lineTo(exitX + 15*i, exitY + 140); ctx.stroke();
  }
}

// ── Level 4: Alchemist's Laboratory ─────────────────────────
export function drawLaboratoryScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#201624', '#0d0810');
  const platY = height * 0.65;

  // Giant Glowing Vat in Background
  const vatX = width * 0.3;
  ctx.fillStyle = '#2f3542';
  ctx.fillRect(vatX - 40, height * 0.2, 80, 150);
  const vatGlow = ctx.createLinearGradient(0, height * 0.2, 0, height * 0.2 + 150);
  vatGlow.addColorStop(0, '#10ac84'); vatGlow.addColorStop(1, '#013220');
  ctx.fillStyle = vatGlow;
  ctx.fillRect(vatX - 35, height * 0.25, 70, 140);
  
  // Vat bubbles
  ctx.fillStyle = '#1dd1a1';
  for(let i=0; i<10; i++) {
    const by = height * 0.25 + 140 - ((time * 0.05 + i * 20) % 140);
    ctx.beginPath(); ctx.arc(vatX - 25 + (i*5), by, 3 + (i%3), 0, Math.PI*2); ctx.fill();
  }
  
  // Green ambient light
  const aGlow = ctx.createRadialGradient(vatX, height*0.4, 0, vatX, height*0.4, 150);
  aGlow.addColorStop(0, 'rgba(29, 209, 161, 0.2)'); aGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aGlow; ctx.fillRect(0,0,width,height);

  // Lab Floor
  ctx.fillStyle = '#161019';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#303952';
  ctx.fillRect(0, platY, width, 4);

  // Massive Iron Cauldron (Stack Mechanism)
  const stackX = width * 0.50;
  // Cauldron Legs
  ctx.fillStyle = '#111';
  ctx.fillRect(stackX - 45, platY - 15, 10, 15);
  ctx.fillRect(stackX + 35, platY - 15, 10, 15);
  // Cauldron Base
  ctx.fillStyle = '#2f3542';
  ctx.beginPath(); ctx.arc(stackX, platY - 30, 50, 0, Math.PI); ctx.fill();
  ctx.fillRect(stackX - 50, platY - 50, 100, 20);
  ctx.fillStyle = '#1e272e';
  ctx.beginPath(); ctx.arc(stackX, platY - 50, 50, 0, Math.PI, true); ctx.fill();

  if (renderer && renderer.stackData) {
    for (let i = 0; i < renderer.stackData.length; i++) {
      const item = renderer.stackData[i];
      const sy = platY - 60 - (i * 35);
      
      let color = '#2ed573';
      let gColor = 'rgba(46, 213, 115, 0.4)';
      if (item.includes('Water')) { color = '#1e90ff'; gColor = 'rgba(30, 144, 255, 0.4)'; }
      if (item.includes('Poison')) { color = '#ff4757'; gColor = 'rgba(255, 71, 87, 0.4)'; }
      if (item.includes('Honey')) { color = '#ffa502'; gColor = 'rgba(255, 165, 2, 0.4)'; }
      
      // Floating Flask in Cauldron Steam
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath(); ctx.arc(stackX, sy, 15, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(stackX, sy + 3, 12, 0, Math.PI); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(stackX - 4, sy - 20, 8, 10);
      
      // Halo Glow
      const fGlow = ctx.createRadialGradient(stackX, sy, 0, stackX, sy, 30);
      fGlow.addColorStop(0, gColor); fGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fGlow; ctx.beginPath(); ctx.arc(stackX, sy, 30, 0, Math.PI*2); ctx.fill();
    }
  }

  // Vault Door (Heavy Lab Vault)
  const exitX = width * 0.85;
  const exitY = height * 0.35;
  ctx.fillStyle = '#57606f';
  ctx.fillRect(exitX - 15, exitY - 15, 90, 160);
  ctx.fillStyle = renderer.isExitOpen ? '#7bed9f' : '#2f3542';
  ctx.fillRect(exitX, exitY, 60, 140);
  ctx.fillStyle = '#1e272e';
  ctx.beginPath(); ctx.arc(exitX + 30, exitY + 70, 20, 0, Math.PI*2); ctx.fill();
}

// ── Level 5: Forest Chasm ───────────────────────────────────
export function drawForestChasmScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#0d1f14', '#050a06');
  const platY = height * 0.65;

  // Giant Ancient Trees Background
  ctx.fillStyle = '#140c08';
  ctx.fillRect(width * 0.2, 0, 40, height);
  ctx.fillRect(width * 0.75, 0, 60, height);
  ctx.fillStyle = '#1f130b';
  ctx.fillRect(width * 0.25, 0, 10, height);
  ctx.fillRect(width * 0.75, 0, 15, height);

  // Glowing Mushrooms
  const mushX = [width*0.25, width*0.8];
  mushX.forEach(x => {
    const pulse = Math.sin(time * 0.05 + x) * 2;
    ctx.fillStyle = '#81ecec';
    ctx.beginPath(); ctx.arc(x, platY - 10, 6 + pulse/2, Math.PI, 0); ctx.fill();
    ctx.fillRect(x - 2, platY - 10, 4, 10);
    const mGlow = ctx.createRadialGradient(x, platY-10, 0, x, platY-10, 40);
    mGlow.addColorStop(0, 'rgba(129, 236, 236, 0.3)'); mGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = mGlow; ctx.beginPath(); ctx.arc(x, platY-10, 40, 0, Math.PI*2); ctx.fill();
  });

  // Deep Fog in Chasm
  const fGlow = ctx.createLinearGradient(0, platY, 0, height);
  fGlow.addColorStop(0, 'rgba(85, 239, 196, 0.1)'); fGlow.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
  ctx.fillStyle = fGlow;
  ctx.fillRect(0, platY, width, height - platY);
  
  // Floor (Clifftops)
  ctx.fillStyle = '#1e272e';
  ctx.fillRect(0, platY, width * 0.35, height - platY);
  ctx.fillRect(width * 0.65, platY, width * 0.35, height - platY);
  // Grass edges
  ctx.fillStyle = '#006266';
  ctx.fillRect(0, platY, width * 0.35, 10);
  ctx.fillRect(width * 0.65, platY, width * 0.35, 10);

  // Falling leaves
  ctx.fillStyle = 'rgba(0, 148, 50, 0.6)';
  for(let i=0; i<30; i++) {
    const px = (time * 0.03 + i * 30) % width;
    const py = (time * 0.04 + i * 20) % height;
    ctx.fillRect(px + Math.sin(time*0.02 + i)*10, py, 4, 3);
  }

  // Stone Pillar (Stack Mechanism) building a bridge!
  const stackX = width * 0.50;
  ctx.fillStyle = '#2f3542';
  ctx.fillRect(stackX - 35, height * 0.3, 70, height); // Foundation pillar in chasm
  ctx.fillStyle = '#57606f';
  ctx.fillRect(stackX - 30, height * 0.3, 60, height);

  if (renderer && renderer.stackData) {
    for (let i = 0; i < renderer.stackData.length; i++) {
      const item = renderer.stackData[i];
      const sy = platY - (i + 1) * 20; // Build bridge upwards
      
      // Heavy Wooden Plank
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(stackX - 55, sy, 110, 18);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(stackX - 50, sy + 2, 100, 14);
      // Ropes binding it
      ctx.fillStyle = '#bdc3c7';
      ctx.fillRect(stackX - 45, sy, 4, 18);
      ctx.fillRect(stackX + 41, sy, 4, 18);
    }
  }

  // Vine Exit Door
  const exitX = width * 0.85;
  const exitY = height * 0.35;
  ctx.fillStyle = '#1e272e';
  ctx.fillRect(exitX - 10, exitY - 10, 80, 150);
  ctx.fillStyle = renderer.isExitOpen ? '#badc58' : '#140c08'; // Glowing passage or thick vines
  ctx.fillRect(exitX, exitY, 60, 140);
  if(!renderer.isExitOpen) {
    ctx.strokeStyle = '#006266'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(exitX, exitY); ctx.lineTo(exitX+60, exitY+140); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(exitX+60, exitY); ctx.lineTo(exitX, exitY+140); ctx.stroke();
  }
}

// ── Level 6: Castle Gate ────────────────────────────────────
export function drawCastleGateScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#2f3542', '#121418');
  const platY = height * 0.65;

  // Massive Stone Archways
  ctx.fillStyle = '#57606f';
  ctx.fillRect(width * 0.2, height * 0.1, 80, platY - height * 0.1);
  ctx.fillRect(width * 0.7, height * 0.1, 80, platY - height * 0.1);
  ctx.beginPath(); ctx.arc(width*0.5, height*0.2, width*0.4, Math.PI, 0); ctx.fill();

  // Royal Banners (Red)
  ctx.fillStyle = '#eb2f06';
  const flagWobble = Math.sin(time * 0.1) * 5;
  ctx.beginPath();
  ctx.moveTo(width * 0.25, height * 0.2);
  ctx.lineTo(width * 0.35, height * 0.2);
  ctx.lineTo(width * 0.35 + flagWobble, platY - 40);
  ctx.lineTo(width * 0.30, platY - 60);
  ctx.lineTo(width * 0.25 + flagWobble, platY - 40);
  ctx.fill();

  // Rain Storm (Animated)
  ctx.fillStyle = 'rgba(116, 185, 255, 0.3)';
  for(let i=0; i<60; i++) {
    const px = ((time * 0.3 + i * 20) % width);
    const py = (time * 0.8 + i * 30) % height;
    ctx.fillRect(px, py, 2, 10);
  }
  // Lightning flashes
  if (Math.random() > 0.98) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0,0,width,height);
  }

  // Floor
  ctx.fillStyle = '#1e272e';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#0f1418';
  ctx.fillRect(0, platY, width, 10);

  // Giant Gate Lock Mechanism (Stack Mechanism)
  const stackX = width * 0.50;
  ctx.fillStyle = '#1e272e';
  ctx.fillRect(stackX - 45, height * 0.1, 90, platY - height * 0.1);
  ctx.fillStyle = '#2f3542';
  ctx.fillRect(stackX - 35, height * 0.1, 70, platY - height * 0.1);

  if (renderer && renderer.stackData) {
    for (let i = 0; i < renderer.stackData.length; i++) {
      const item = renderer.stackData[i];
      const sy = platY - (i + 1) * 45 - 10;
      
      // Heavy Iron Crest
      ctx.fillStyle = '#1e272e';
      ctx.fillRect(stackX - 30, sy, 60, 40);
      ctx.fillStyle = '#747d8c';
      ctx.fillRect(stackX - 26, sy + 4, 52, 32);
      
      // Glowing text embedded
      ctx.fillStyle = '#ff7f50';
      ctx.shadowColor = '#ff7f50'; ctx.shadowBlur = 10;
      ctx.font = "bold 20px monospace";
      ctx.textAlign = 'center';
      const char = String(item).split('_')[1] || item;
      ctx.fillText(char, stackX, sy + 28);
      ctx.shadowBlur = 0;
    }
  }

  // Castle Gate Exit
  const exitX = width * 0.85;
  const exitY = height * 0.35;
  ctx.fillStyle = '#2f3542';
  ctx.fillRect(exitX - 10, exitY - 10, 80, 150);
  ctx.fillStyle = renderer.isExitOpen ? '#f6e58d' : '#111'; // Open passage or dark iron
  ctx.fillRect(exitX, exitY, 60, 140);
}

// ── Level 7: Ritual Temple ──────────────────────────────────
export function drawRitualTempleScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#1a0b12', '#050002');
  const platY = height * 0.65;

  // Obsidian Pillars
  ctx.fillStyle = '#11050a';
  ctx.fillRect(width * 0.2, height * 0.1, 50, platY - height * 0.1);
  ctx.fillRect(width * 0.75, height * 0.1, 50, platY - height * 0.1);

  // Lava Pits in background
  const lx1 = width * 0.3; const lx2 = width * 0.7;
  const lGlow = ctx.createRadialGradient(lx1, platY, 0, lx1, platY, 100);
  lGlow.addColorStop(0, 'rgba(232, 65, 24, 0.4)'); lGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = lGlow; ctx.beginPath(); ctx.arc(lx1, platY, 100, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#e84118'; ctx.beginPath(); ctx.arc(lx1, platY, 30, Math.PI, 0); ctx.fill();

  // Floating dark magic embers
  ctx.fillStyle = 'rgba(255, 71, 87, 0.8)';
  for(let i=0; i<40; i++) {
    const px = (time * 0.01 + i * 20) % width;
    const py = platY - ((time * 0.05 + i * 15) % platY);
    ctx.beginPath(); ctx.arc(px + Math.sin(time*0.03+i)*20, py, 1.5, 0, Math.PI*2); ctx.fill();
  }

  // Floor
  ctx.fillStyle = '#0a0306';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#c23616'; // Blood red carpet
  ctx.fillRect(width * 0.4, platY, width * 0.2, height - platY);

  // Obsidian Altar (Stack Mechanism)
  const stackX = width * 0.50;
  ctx.fillStyle = '#2b1a20';
  ctx.fillRect(stackX - 35, platY - 40, 70, 40);
  ctx.fillStyle = '#11050a';
  ctx.fillRect(stackX - 45, platY - 10, 90, 10);
  ctx.fillStyle = '#e84118'; // Altar magic circle
  ctx.beginPath(); ctx.arc(stackX, platY - 40, 30, Math.PI, 0); ctx.fill();

  if (renderer && renderer.stackData) {
    for (let i = 0; i < renderer.stackData.length; i++) {
      const item = renderer.stackData[i];
      const sy = platY - 50 - (i * 35);
      
      const isSkull = String(item).includes('Skull');
      
      // Floating glowing runes or skulls
      ctx.shadowColor = isSkull ? '#f5f6fa' : '#e84118';
      ctx.shadowBlur = 15;
      
      if (isSkull) {
        ctx.fillStyle = '#f5f6fa';
        ctx.fillRect(stackX - 15, sy - 15, 30, 24);
        ctx.fillStyle = '#111';
        ctx.fillRect(stackX - 8, sy - 5, 6, 6); ctx.fillRect(stackX + 2, sy - 5, 6, 6);
      } else {
        ctx.fillStyle = '#2b1a20';
        ctx.beginPath(); ctx.arc(stackX, sy - 5, 20, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#e84118';
        ctx.font = "bold 20px monospace";
        ctx.textAlign = 'center';
        ctx.fillText(String(item).replace('Rune_', ''), stackX, sy);
      }
      ctx.shadowBlur = 0;
    }
  }

  // Demonic Exit Door
  const exitX = width * 0.85;
  const exitY = height * 0.35;
  ctx.fillStyle = '#11050a';
  ctx.fillRect(exitX - 10, exitY - 10, 80, 150);
  ctx.fillStyle = renderer.isExitOpen ? '#e84118' : '#2f3640'; 
  ctx.fillRect(exitX, exitY, 60, 140);
}

// ── Level 8: Crystal Mine ───────────────────────────────────
export function drawMineScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#2d3436', '#121415');
  const platY = height * 0.65;

  // Wooden Support Beams
  ctx.fillStyle = '#5c3a21';
  ctx.fillRect(width * 0.15, height * 0.1, 15, platY - height * 0.1);
  ctx.fillRect(width * 0.85, height * 0.1, 15, platY - height * 0.1);
  ctx.fillRect(0, height * 0.15, width, 15);

  // Giant Cyan Crystals embedded in walls
  const cx = width * 0.25; const cy = height * 0.4;
  ctx.fillStyle = '#00cec9';
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx+20, cy-40); ctx.lineTo(cx+40, cy); ctx.fill();
  const cGlow = ctx.createRadialGradient(cx+20, cy-20, 0, cx+20, cy-20, 80);
  cGlow.addColorStop(0, 'rgba(0, 206, 201, 0.4)'); cGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = cGlow; ctx.beginPath(); ctx.arc(cx+20, cy-20, 80, 0, Math.PI*2); ctx.fill();

  // Sparkling Dust
  ctx.fillStyle = 'rgba(129, 236, 236, 0.8)';
  for(let i=0; i<30; i++) {
    const px = (time * 0.02 + i * 25) % width;
    const py = (height * 0.8) - ((time * 0.015 + i * 15) % height);
    ctx.beginPath(); ctx.arc(px, py, 1+Math.random(), 0, Math.PI*2); ctx.fill();
  }

  // Floor & Tracks
  ctx.fillStyle = '#181b1c';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#636e72'; // rails
  ctx.fillRect(0, platY + 15, width, 4);
  ctx.fillRect(0, platY + 35, width, 4);
  ctx.fillStyle = '#2d3436'; // ties
  for(let i=0; i<width; i+=40) { ctx.fillRect(i, platY + 10, 8, 35); }

  // Towering Stone Golem (Stack Mechanism)
  const stackX = width * 0.50;
  ctx.fillStyle = '#2d3436';
  ctx.fillRect(stackX - 40, height * 0.2, 80, platY - height * 0.2); // Golem Body
  ctx.fillStyle = '#636e72';
  ctx.fillRect(stackX - 35, height * 0.25, 70, platY - height * 0.25);
  // Golem Eyes
  ctx.fillStyle = '#00cec9';
  ctx.shadowColor = '#00cec9'; ctx.shadowBlur = 10;
  ctx.fillRect(stackX - 15, height * 0.3, 10, 5);
  ctx.fillRect(stackX + 5, height * 0.3, 10, 5);
  ctx.shadowBlur = 0;

  if (renderer && renderer.stackData) {
    for (let i = 0; i < renderer.stackData.length; i++) {
      const item = renderer.stackData[i];
      const sy = platY - (i + 1) * 35 - 5;
      
      // Glowing Boulders pushed into Golem
      ctx.fillStyle = '#b2bec3';
      ctx.beginPath(); ctx.arc(stackX, sy + 15, 16, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#00cec9';
      ctx.font = "bold 14px monospace";
      ctx.textAlign = 'center';
      ctx.fillText(String(item).split('_')[1] || item, stackX, sy + 20);
    }
  }

  // Mine Exit Tunnel
  const exitX = width * 0.85;
  const exitY = height * 0.35;
  ctx.fillStyle = '#181b1c';
  ctx.beginPath(); ctx.arc(exitX + 30, exitY + 40, 40, Math.PI, 0); ctx.fill();
  ctx.fillRect(exitX - 10, exitY + 40, 80, 110);
  ctx.fillStyle = renderer.isExitOpen ? '#00cec9' : '#111'; // Open cyan tunnel
  ctx.fillRect(exitX, exitY + 40, 60, 100);
}

// ── Level 9: Treasure Vault ─────────────────────────────────
export function drawTreasureVaultScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#3a240c', '#140c02');
  const platY = height * 0.65;

  // Rich Purple Curtains
  ctx.fillStyle = '#6c5ce7';
  ctx.fillRect(0, 0, width, height * 0.2);
  ctx.beginPath(); ctx.arc(width*0.2, height*0.2, 50, Math.PI, 0); ctx.fill();
  ctx.beginPath(); ctx.arc(width*0.8, height*0.2, 50, Math.PI, 0); ctx.fill();
  
  // Mountains of Gold Coins
  const drawGoldPile = (px, py, radius) => {
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath(); ctx.arc(px, py, radius, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#f39c12';
    for(let i=0; i<radius; i+=5) { ctx.fillRect(px - radius/2 + Math.random()*radius, py - Math.random()*radius, 3, 3); }
  };
  drawGoldPile(width*0.2, platY, 60);
  drawGoldPile(width*0.8, platY, 80);
  drawGoldPile(width*0.35, platY, 40);

  // Shimmering gold dust
  ctx.fillStyle = '#ffeaa7';
  for(let i=0; i<25; i++) {
    const px = (time * 0.01 + i * 35) % width;
    const py = (height * 0.9) - ((time * 0.02 + i * 20) % (height * 0.7));
    ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI*2); ctx.fill();
  }

  // Floor (Polished Marble)
  ctx.fillStyle = '#170f05';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#2c1e0b';
  for(let x=0; x<width; x+=40) { ctx.fillRect(x, platY, 20, height - platY); }

  // Intricate Golden Scale (Stack Mechanism)
  const stackX = width * 0.50;
  ctx.fillStyle = '#f1c40f'; // Main Pillar
  ctx.fillRect(stackX - 10, height * 0.2, 20, platY - height * 0.2);
  ctx.fillStyle = '#d35400';
  ctx.fillRect(stackX - 60, height * 0.3, 120, 8); // Balance beam

  if (renderer && renderer.stackData) {
    for (let i = 0; i < renderer.stackData.length; i++) {
      const item = renderer.stackData[i];
      const sy = platY - (i + 1) * 28 - 5;
      
      // Stacking Heavy Wooden Chests
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(stackX - 30, sy, 60, 24);
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(stackX - 30, sy + 4, 60, 4); // gold trim
      ctx.fillRect(stackX - 6, sy + 8, 12, 10); // lock
      
      ctx.fillStyle = '#111';
      ctx.font = "bold 12px monospace";
      ctx.textAlign = 'center';
      ctx.fillText(String(item).split('_')[1] || item, stackX, sy + 18);
    }
  }

  // Grand Golden Vault Door Exit
  const exitX = width * 0.85;
  const exitY = height * 0.35;
  ctx.fillStyle = '#d35400';
  ctx.fillRect(exitX - 15, exitY - 15, 90, 160);
  ctx.fillStyle = renderer.isExitOpen ? '#f1c40f' : '#8e44ad'; // Brilliant gold when open
  ctx.fillRect(exitX, exitY, 60, 140);
}

// ── Level 10: Snowy Peak ────────────────────────────────────
export function drawSnowyPeakScene(ctx, width, height, time, renderer) {
  drawVignette(ctx, width, height, '#2c3e50', '#131e29');
  const platY = height * 0.65;

  // Aurora Borealis in Sky
  ctx.globalCompositeOperation = 'screen';
  for(let i=0; i<3; i++) {
    const wave = Math.sin(time * 0.02 + i) * 30;
    const aGlow = ctx.createLinearGradient(0, height*0.1, 0, height*0.4);
    aGlow.addColorStop(0, `rgba(29, 209, 161, ${0.3 - i*0.1})`);
    aGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aGlow;
    ctx.beginPath();
    ctx.moveTo(0, height*0.3 + wave); ctx.quadraticCurveTo(width/2, height*0.1 - wave, width, height*0.3 + wave);
    ctx.lineTo(width, 0); ctx.lineTo(0, 0); ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';

  // Snowy Mountains
  ctx.fillStyle = '#34495e';
  ctx.beginPath(); ctx.moveTo(0, platY); ctx.lineTo(width*0.3, height*0.2); ctx.lineTo(width*0.6, platY); ctx.fill();
  ctx.fillStyle = '#ecf0f1'; // Snow caps
  ctx.beginPath(); ctx.moveTo(width*0.3, height*0.2); ctx.lineTo(width*0.2, height*0.35); ctx.lineTo(width*0.4, height*0.35); ctx.fill();

  // Falling Snow
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for(let i=0; i<80; i++) {
    const px = (time * 0.05 + i * 15) % width;
    const py = (time * 0.1 + i * 25) % height;
    ctx.beginPath(); ctx.arc(px + Math.sin(time*0.02+i)*10, py, 1.5 + (i%2), 0, Math.PI*2); ctx.fill();
  }

  // Snowy Floor
  ctx.fillStyle = '#ecf0f1';
  ctx.fillRect(0, platY, width, height - platY);
  ctx.fillStyle = '#bdc3c7';
  ctx.fillRect(0, platY+10, width, height - platY);

  // Ancient Frosted Totem Pole (Stack Mechanism)
  const stackX = width * 0.50;
  ctx.fillStyle = '#535c68'; 
  ctx.fillRect(stackX - 25, height * 0.15, 50, platY - height * 0.15);
  ctx.fillStyle = '#95a5a6'; // ice layer
  ctx.fillRect(stackX - 22, height * 0.15, 10, platY - height * 0.15);

  if (renderer && renderer.stackData) {
    for (let i = 0; i < renderer.stackData.length; i++) {
      const item = renderer.stackData[i];
      const sy = platY - (i + 1) * 35 - 5;
      
      const isHot = String(item).includes('76');
      const cColor = isHot ? '#ff4757' : '#7ed6df';
      const glowCol = isHot ? 'rgba(255, 71, 87, 0.5)' : 'rgba(126, 214, 223, 0.5)';
      
      // Thermal Crystal in Totem
      ctx.fillStyle = cColor;
      ctx.shadowColor = cColor; ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(stackX, sy); ctx.lineTo(stackX+15, sy+15); ctx.lineTo(stackX, sy+30); ctx.lineTo(stackX-15, sy+15);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Ambient Crystal Glow
      const cGlow = ctx.createRadialGradient(stackX, sy+15, 0, stackX, sy+15, 40);
      cGlow.addColorStop(0, glowCol); cGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cGlow; ctx.beginPath(); ctx.arc(stackX, sy+15, 40, 0, Math.PI*2); ctx.fill();
    }
  }

  // Ice Cave Exit
  const exitX = width * 0.85;
  const exitY = height * 0.35;
  ctx.fillStyle = '#2c3e50';
  ctx.beginPath(); ctx.arc(exitX + 30, exitY + 40, 40, Math.PI, 0); ctx.fill();
  ctx.fillRect(exitX - 10, exitY + 40, 80, 110);
  ctx.fillStyle = renderer.isExitOpen ? '#7ed6df' : '#111'; // Open glowing ice tunnel
  ctx.fillRect(exitX, exitY + 40, 60, 100);
}
