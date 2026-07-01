// src/heroModelViewer.js
// Simple Three.js helper to render an animated blocky humanoid as a placeholder 3D hero.
// Parameters:
//   container – DOM element (canvas or div) where the renderer will attach.
//   color – hexadecimal string (e.g., '#2c3e50') used for the character material.
//   size – size of the canvas (width/height). If omitted, uses container dimensions.
// Returns a cleanup function to stop the animation and dispose resources.

import * as THREE from 'three';

export function createHeroViewer(container, styleOrColor, size = 200, options = {}) {
  const mode = options.mode || 'portrait';
  // Ensure container is a canvas element; if it's a div, create a canvas inside.
  let canvas;
  if (container instanceof HTMLCanvasElement) {
    canvas = container;
  } else {
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    container.appendChild(canvas);
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  // Don't override CSS width/height
  renderer.setSize(canvas.width, canvas.height, false);
  const scene = new THREE.Scene();
  const aspect = canvas.width / canvas.height;
  const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
  camera.position.set(0, 1.2, 3.5);
  camera.lookAt(0, 0.8, 0);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
  scene.add(light);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(2, 5, 3);
  scene.add(dirLight);

  // ---- Build Minecraft-style composite humanoid parts ----
  let skinColor = '#f5c29d';
  let hairColor = '#2c3e50';
  let shirtColor = '#2980b9';
  let pantsColor = '#16a085';
  let shoeColor = '#2d3436';
  
  // Darken a hex color by a factor (0–1, lower = darker)
  function darkenColor(hex, factor = 0.7) {
    const c = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.floor(((c >> 16) & 0xff) * factor));
    const g = Math.max(0, Math.floor(((c >> 8) & 0xff) * factor));
    const b = Math.max(0, Math.floor((c & 0xff) * factor));
    return `rgb(${r},${g},${b})`;
  }
  function lightenColor(hex, factor = 1.3) {
    const c = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.floor(((c >> 16) & 0xff) * factor));
    const g = Math.min(255, Math.floor(((c >> 8) & 0xff) * factor));
    const b = Math.min(255, Math.floor((c & 0xff) * factor));
    return `rgb(${r},${g},${b})`;
  }

  function createFaceTexture(skinHex, hairHex, eyeHex) {
    const S = 16; // Minecraft-style low-res pixel art
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d');

    // Fill skin background
    ctx.fillStyle = skinHex;
    ctx.fillRect(0, 0, S, S);

    // Eyes — white sclera (small, Minecraft-style)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(3, 5, 3, 2);   // left eye sclera
    ctx.fillRect(10, 5, 3, 2);  // right eye sclera

    // Iris (per-hero colored, 2x2 blocks inside sclera)
    ctx.fillStyle = eyeHex || '#4a6741';
    ctx.fillRect(4, 5, 2, 2);   // left iris
    ctx.fillRect(10, 5, 2, 2);  // right iris

    // Pupil (1x1 black dot)
    ctx.fillStyle = '#000000';
    ctx.fillRect(5, 5, 1, 1);   // left pupil
    ctx.fillRect(11, 5, 1, 1);  // right pupil

    // Nose — very subtle, just a tiny shadow
    ctx.fillStyle = darkenColor(skinHex, 0.82);
    ctx.fillRect(7, 8, 2, 1);

    // Mouth — thin line
    ctx.fillStyle = darkenColor(skinHex, 0.6);
    ctx.fillRect(5, 10, 6, 1);
    // Slight lip color
    ctx.fillStyle = '#c4785a';
    ctx.fillRect(6, 10, 4, 1);

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  function createShirtTexture(shirtHex, design) {
    const S = 32;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d');

    // Base fill
    ctx.fillStyle = shirtHex;
    ctx.fillRect(0, 0, S, S);

    const dark = darkenColor(shirtHex, 0.7);
    const light = lightenColor(shirtHex, 1.2);

    if (design === 'suspenders') {
      // White shirt with red leather suspenders
      // Collar V-neck
      ctx.fillStyle = darkenColor(shirtHex, 0.85);
      ctx.fillRect(12, 0, 8, 1);
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(13 + i, i, 1, 1);
        ctx.fillRect(18 - i, i, 1, 1);
      }
      // Suspender straps
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(6, 0, 3, S);
      ctx.fillRect(23, 0, 3, S);
      // Suspender highlights
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(7, 0, 1, S);
      ctx.fillRect(24, 0, 1, S);
      // Suspender buckle/clasp
      ctx.fillStyle = '#bdc3c7';
      ctx.fillRect(6, 8, 3, 2);
      ctx.fillRect(23, 8, 3, 2);
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(7, 8, 1, 2);
      ctx.fillRect(24, 8, 1, 2);
      // Shirt buttons
      ctx.fillStyle = '#bdc3c7';
      ctx.fillRect(15, 6, 2, 2);
      ctx.fillRect(15, 12, 2, 2);
      ctx.fillRect(15, 18, 2, 2);
      ctx.fillRect(15, 24, 2, 2);
      // Button holes
      ctx.fillStyle = dark;
      ctx.fillRect(16, 7, 1, 1);
      ctx.fillRect(16, 13, 1, 1);
      ctx.fillRect(16, 19, 1, 1);
      ctx.fillRect(16, 25, 1, 1);

    } else if (design === 'hoodie') {
      // Green hoodie with zipper, pockets, and drawstrings
      // Collar / hood neckline
      ctx.fillStyle = dark;
      ctx.fillRect(10, 0, 12, 2);
      ctx.fillStyle = lightenColor(shirtHex, 1.1);
      ctx.fillRect(11, 0, 10, 1);
      // Center zipper
      ctx.fillStyle = '#555555';
      ctx.fillRect(15, 2, 2, 30);
      // Zipper teeth
      ctx.fillStyle = '#888888';
      for (let y = 3; y < 30; y += 2) {
        ctx.fillRect(15, y, 1, 1);
        ctx.fillRect(16, y + 1, 1, 1);
      }
      // Zipper pull
      ctx.fillStyle = '#aaaaaa';
      ctx.fillRect(14, 3, 1, 2);
      // Drawstrings
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12, 1, 1, 6);
      ctx.fillRect(19, 1, 1, 6);
      // Drawstring tips
      ctx.fillStyle = '#dddddd';
      ctx.fillRect(12, 6, 1, 2);
      ctx.fillRect(19, 6, 1, 2);
      // Kangaroo pocket
      ctx.fillStyle = dark;
      ctx.fillRect(5, 20, 22, 1);
      ctx.fillRect(5, 20, 1, 10);
      ctx.fillRect(26, 20, 1, 10);
      ctx.fillRect(5, 29, 22, 1);
      // Pocket interior shadow
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(6, 21, 20, 8);

    } else if (design === 'jacket') {
      // Red puffy jacket with yellow zipper and chest pockets
      // Puffiness texture (horizontal quilting lines)
      ctx.fillStyle = dark;
      for (let y = 5; y < S; y += 6) {
        ctx.fillRect(0, y, S, 1);
      }
      // Center zipper
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(15, 0, 2, S);
      // Zipper teeth
      ctx.fillStyle = '#d4ac0d';
      for (let y = 1; y < S; y += 2) {
        ctx.fillRect(14, y, 1, 1);
        ctx.fillRect(17, y, 1, 1);
      }
      // Collar stand
      ctx.fillStyle = darkenColor(shirtHex, 0.6);
      ctx.fillRect(9, 0, 14, 3);
      ctx.fillStyle = light;
      ctx.fillRect(10, 0, 12, 1);
      // Left chest pocket
      ctx.fillStyle = dark;
      ctx.fillRect(3, 6, 10, 1);
      ctx.fillRect(3, 6, 1, 8);
      ctx.fillRect(12, 6, 1, 8);
      ctx.fillRect(3, 13, 10, 1);
      // Pocket flap
      ctx.fillStyle = darkenColor(shirtHex, 0.55);
      ctx.fillRect(3, 6, 10, 2);
      // Right chest pocket
      ctx.fillStyle = dark;
      ctx.fillRect(19, 6, 10, 1);
      ctx.fillRect(19, 6, 1, 8);
      ctx.fillRect(28, 6, 1, 8);
      ctx.fillRect(19, 13, 10, 1);
      ctx.fillStyle = darkenColor(shirtHex, 0.55);
      ctx.fillRect(19, 6, 10, 2);

    } else if (design === 'robe') {
      // Mage robe with gold trim, arcane symbols
      // Center seam with gold piping
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(15, 0, 2, S);
      // Gold collar trim
      ctx.fillRect(8, 0, 16, 2);
      ctx.fillStyle = '#d4ac0d';
      ctx.fillRect(9, 0, 14, 1);
      // Gold bottom hem trim
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(0, S - 3, S, 3);
      ctx.fillStyle = '#d4ac0d';
      ctx.fillRect(0, S - 2, S, 1);
      // Gold waist sash
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(0, 14, S, 3);
      ctx.fillStyle = '#d4ac0d';
      ctx.fillRect(0, 15, S, 1);
      // Arcane diamond symbol on chest
      ctx.fillStyle = '#e67e22';
      const cx = 16, cy = 8;
      ctx.fillRect(cx - 1, cy - 3, 2, 1);
      ctx.fillRect(cx - 2, cy - 2, 4, 1);
      ctx.fillRect(cx - 3, cy - 1, 6, 1);
      ctx.fillRect(cx - 3, cy, 6, 1);
      ctx.fillRect(cx - 2, cy + 1, 4, 1);
      ctx.fillRect(cx - 1, cy + 2, 2, 1);
      // Sparkle dots
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(5, 5, 1, 1);
      ctx.fillRect(26, 7, 1, 1);
      ctx.fillRect(8, 22, 1, 1);
      ctx.fillRect(24, 24, 1, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  let designType = null;
  let eyeColor = '#4a6741';
  
  if (typeof styleOrColor === 'string') {
    shirtColor = styleOrColor; // fallback
  } else if (styleOrColor) {
    skinColor = styleOrColor.skin || skinColor;
    hairColor = styleOrColor.hair || hairColor;
    shirtColor = styleOrColor.shirt || shirtColor;
    pantsColor = styleOrColor.pants || pantsColor;
    shoeColor = styleOrColor.shoes || shoeColor;
    designType = styleOrColor.design || null;
    eyeColor = styleOrColor.eyes || eyeColor;
  }
  
  const skinMat = new THREE.MeshStandardMaterial({ color: skinColor });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor });
  const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor });
  const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor });
  const shoeMat = new THREE.MeshStandardMaterial({ color: shoeColor });
  
  const faceTex = createFaceTexture(skinColor, hairColor, eyeColor);
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex });
  
  const shirtTex = createShirtTexture(shirtColor, designType);
  const shirtFrontMat = new THREE.MeshStandardMaterial({ map: shirtTex });

  // We need to keep references to all geometry and materials for cleanup
  const geoms = [];
  const mats = [skinMat, hairMat, shirtMat, pantsMat, shoeMat, faceMat, shirtFrontMat];
  const texs = [faceTex, shirtTex];

  const createMesh = (geom, mat) => {
    geoms.push(geom);
    return new THREE.Mesh(geom, mat);
  };

  // Side of head texture (with ear)
  function createSideHeadTexture(skinHex) {
    const S = 32;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = skinHex;
    ctx.fillRect(0, 0, S, S);
    // Ear
    ctx.fillStyle = darkenColor(skinHex, 0.85);
    ctx.fillRect(13, 12, 6, 8);
    ctx.fillStyle = skinHex;
    ctx.fillRect(14, 13, 4, 6);
    // Inner ear
    ctx.fillStyle = darkenColor(skinHex, 0.75);
    ctx.fillRect(15, 14, 2, 4);
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  // Back of head texture (with hair detail)
  function createBackHeadTexture(hairHex, skinHex) {
    const S = 32;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    // Lower part is skin (neck area visible)
    ctx.fillStyle = skinHex;
    ctx.fillRect(0, 0, S, S);
    // Hair covers most of the back of head
    ctx.fillStyle = hairHex;
    ctx.fillRect(0, 0, S, 24);
    // Hair texture detail
    ctx.fillStyle = darkenColor(hairHex, 0.8);
    for (let y = 2; y < 22; y += 4) {
      ctx.fillRect(0, y, S, 1);
    }
    // Nape hairline
    ctx.fillStyle = darkenColor(hairHex, 0.6);
    ctx.fillRect(4, 22, 24, 2);
    ctx.fillRect(8, 24, 16, 1);
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  const sideHeadTex = createSideHeadTexture(skinColor);
  const sideHeadMat = new THREE.MeshStandardMaterial({ map: sideHeadTex });
  const backHeadTex = createBackHeadTexture(hairColor, skinColor);
  const backHeadMat = new THREE.MeshStandardMaterial({ map: backHeadTex });
  mats.push(sideHeadMat, backHeadMat);
  texs.push(sideHeadTex, backHeadTex);

  const group = new THREE.Group();

  // Head
  const headGroup = new THREE.Group();
  const headGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  // Materials: Right(+X), Left(-X), Top(+Y), Bottom(-Y), Front(+Z), Back(-Z)
  const headMats = [sideHeadMat, sideHeadMat, skinMat, skinMat, faceMat, backHeadMat];
  const headMesh = createMesh(headGeom, headMats);
  headGroup.add(headMesh);
  
  // Hair on top (thicker block)
  const hairGeom = new THREE.BoxGeometry(0.84, 0.3, 0.84);
  const hairMesh = createMesh(hairGeom, hairMat);
  hairMesh.position.y = 0.32;
  headGroup.add(hairMesh);

  // Hair fringe on forehead
  const fringeGeom = new THREE.BoxGeometry(0.84, 0.15, 0.1);
  const fringeMesh = createMesh(fringeGeom, hairMat);
  fringeMesh.position.set(0, 0.28, 0.4);
  headGroup.add(fringeMesh);
  
  headGroup.position.set(0, 1.9, 0);
  group.add(headGroup);

  // Body
  const bodyGeom = new THREE.BoxGeometry(1, 1.5, 0.5);
  const bodyMats = [shirtMat, shirtMat, shirtMat, shirtMat, shirtFrontMat, shirtFrontMat];
  const body = createMesh(bodyGeom, bodyMats);
  body.position.y = 0.75; // half height above ground
  group.add(body);

  // Helper to create arm
  const createArm = (xPos) => {
    const pivot = new THREE.Group();
    const sleeveGeom = new THREE.BoxGeometry(0.3, 0.5, 0.3);
    const sleeve = createMesh(sleeveGeom, shirtMat);
    sleeve.position.y = -0.25;
    pivot.add(sleeve);
    
    const lowerArmGeom = new THREE.BoxGeometry(0.28, 0.5, 0.28);
    const lowerArm = createMesh(lowerArmGeom, skinMat);
    lowerArm.position.y = -0.75;
    pivot.add(lowerArm);
    
    pivot.position.set(xPos, 1.3, 0);
    return { pivot };
  };

  const leftArm = createArm(-0.65);
  const rightArm = createArm(0.65);
  group.add(leftArm.pivot);
  group.add(rightArm.pivot);

  // Helper to create leg
  const createLeg = (xPos) => {
    const pivot = new THREE.Group();
    const pantsGeom = new THREE.BoxGeometry(0.35, 0.9, 0.35);
    const pants = createMesh(pantsGeom, pantsMat);
    pants.position.y = -0.45;
    pivot.add(pants);
    
    const shoeGeom = new THREE.BoxGeometry(0.36, 0.3, 0.36);
    const shoe = createMesh(shoeGeom, shoeMat);
    shoe.position.y = -1.05;
    pivot.add(shoe);
    
    pivot.position.set(xPos, 0, 0);
    return { pivot };
  };

  const leftLeg = createLeg(-0.2);
  const rightLeg = createLeg(0.2);
  group.add(leftLeg.pivot);
  group.add(rightLeg.pivot);

  scene.add(group);

  // Tool mesh placeholder attached to right arm
  let currentToolMesh = null;
  const toolGroup = new THREE.Group();
  toolGroup.position.set(0, -1.0, 0.2); // At the bottom of the hand, slightly forward
  // Rotate so it looks like it's being held
  toolGroup.rotation.x = Math.PI / 2;
  rightArm.pivot.add(toolGroup);

  const setEquippedTool = (toolName) => {
    if (currentToolMesh) {
      toolGroup.remove(currentToolMesh);
      currentToolMesh = null;
    }
    if (!toolName) return;

    if (toolName === 'scythe' || toolName === 'hoe' || toolName === 'sickle') {
      const group = new THREE.Group();
      const handleGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.4);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const handle = new THREE.Mesh(handleGeom, handleMat);
      handle.position.y = 0.2;
      group.add(handle);
      
      const bladeGeom = new THREE.BoxGeometry(0.05, 0.4, 0.6);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
      const blade = new THREE.Mesh(bladeGeom, bladeMat);
      blade.position.set(0, 0.8, -0.2);
      group.add(blade);
      
      currentToolMesh = group;
      toolGroup.add(currentToolMesh);
    } else if (toolName === 'hammer') {
      const group = new THREE.Group();
      const handleGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.0);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const handle = new THREE.Mesh(handleGeom, handleMat);
      handle.position.y = 0.3;
      group.add(handle);
      
      const headGeom = new THREE.BoxGeometry(0.4, 0.2, 0.2);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x777777 });
      const head = new THREE.Mesh(headGeom, headMat);
      head.position.set(0, 0.8, 0);
      group.add(head);
      
      currentToolMesh = group;
      toolGroup.add(currentToolMesh);
    } else if (toolName === 'sword') {
      const group = new THREE.Group();
      const handleGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.4);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const handle = new THREE.Mesh(handleGeom, handleMat);
      handle.position.y = 0.2;
      group.add(handle);
      
      const guardGeom = new THREE.BoxGeometry(0.3, 0.05, 0.1);
      const guardMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
      const guard = new THREE.Mesh(guardGeom, guardMat);
      guard.position.set(0, 0.4, 0);
      group.add(guard);
      
      const bladeGeom = new THREE.BoxGeometry(0.1, 0.8, 0.02);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
      const blade = new THREE.Mesh(bladeGeom, bladeMat);
      blade.position.set(0, 0.8, 0);
      group.add(blade);
      
      currentToolMesh = group;
      toolGroup.add(currentToolMesh);
    } else if (toolName === 'pickaxe') {
      const group = new THREE.Group();
      const handleGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.2);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const handle = new THREE.Mesh(handleGeom, handleMat);
      handle.position.y = 0.3;
      group.add(handle);
      
      const headGeom = new THREE.BoxGeometry(0.05, 0.1, 0.8);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x777777 });
      const head = new THREE.Mesh(headGeom, headMat);
      head.position.set(0, 0.8, 0);
      group.add(head);
      
      currentToolMesh = group;
      toolGroup.add(currentToolMesh);
    } else if (toolName === 'magic_device' || toolName === 'wand') {
      const group = new THREE.Group();
      const handleGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
      const handle = new THREE.Mesh(handleGeom, handleMat);
      handle.position.y = 0.2;
      group.add(handle);
      
      const tipGeom = new THREE.SphereGeometry(0.15);
      const tipMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff });
      const tip = new THREE.Mesh(tipGeom, tipMat);
      tip.position.set(0, 0.6, 0);
      group.add(tip);
      
      currentToolMesh = group;
      toolGroup.add(currentToolMesh);
    } else if (toolName === 'key' || toolName === 'scanner') {
      const geom = new THREE.BoxGeometry(0.15, 0.4, 0.15);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.y = 0.1;
      currentToolMesh = mesh;
      toolGroup.add(currentToolMesh);
    }
  };

  // Animation state
  let frameId;
  let time = 0;
  let isWalking = false;
  let facingRight = true;
  let activeTool = null;
  let actionAnim = null;
  let actionAnimProgress = 0;
  let codeStarted = false; // sticky: once code runs, stays true

  const animate = () => {
    time += 0.05;
    if (mode === 'portrait') {
      group.rotation.y += 0.005;
      const swing = Math.sin(time) * 0.5;
      leftArm.pivot.rotation.x = swing;
      rightArm.pivot.rotation.x = -swing;
      leftLeg.pivot.rotation.x = -swing;
      rightLeg.pivot.rotation.x = swing;
    } else if (mode === 'static_portrait') {
      // Lock rotation for UI guides, just show a slight angle
      group.rotation.y = Math.PI / 6;
      leftArm.pivot.rotation.x = 0;
      rightArm.pivot.rotation.x = 0;
      leftLeg.pivot.rotation.x = 0;
      rightLeg.pivot.rotation.x = 0;
      group.position.y = 0;
      group.rotation.x = 0;
    } else {
      // Gameplay mode
      const isActing = actionAnim && actionAnimProgress > 0 && actionAnimProgress < 1;

      // Once walking or action starts, lock into side view permanently
      if (isWalking || isActing) {
        codeStarted = true;
      }

      // Determine target Y rotation
      let targetRotY;
      if (!codeStarted) {
        targetRotY = 0; // face camera
      } else {
        targetRotY = facingRight ? Math.PI / 2 : -Math.PI / 2;
      }

      // Smooth rotation lerp (handles wrapping)
      const currentRotY = group.rotation.y;
      let diff = targetRotY - currentRotY;
      // Wrap to [-PI, PI]
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      group.rotation.y += diff * 0.15;

      // How far through the turn we are (1.0 = fully turned)
      const turnComplete = 1.0 - Math.abs(diff * 0.85) / (Math.PI / 2);

      if (!codeStarted) {
        // BEFORE CODE RUN: Front view + wave hand
        rightArm.pivot.position.z = 0;
        group.rotation.x = 0;
        leftArm.pivot.rotation.x = 0;
        leftLeg.pivot.rotation.x = 0;
        rightLeg.pivot.rotation.x = 0;
        // Right arm waves: raised up and swinging side to side
        rightArm.pivot.rotation.x = -Math.PI * 0.55;
        rightArm.pivot.rotation.z = Math.sin(time * 2.5) * 0.35 - 0.6;
      } else if (turnComplete < 0.8) {
        // TURNING: character is rotating, keep limbs still
        rightArm.pivot.position.z = 0;
        group.rotation.x = 0;
        rightArm.pivot.rotation.z = 0;
        leftArm.pivot.rotation.x = 0;
        rightArm.pivot.rotation.x = 0;
        leftLeg.pivot.rotation.x = 0;
        rightLeg.pivot.rotation.x = 0;
      } else {
        // TURNED: play walk / action animations
        if (isActing) {
          const p = actionAnimProgress;
          if (actionAnim === 'swing') {
            const angle = Math.sin(p * Math.PI) * Math.PI * 1.2;
            rightArm.pivot.rotation.x = -angle + Math.PI/4;
            leftArm.pivot.rotation.x = 0;
            leftLeg.pivot.rotation.x = 0;
            rightLeg.pivot.rotation.x = 0;
            group.rotation.x = Math.sin(p * Math.PI) * 0.2;
          } else if (actionAnim === 'scan') {
            rightArm.pivot.rotation.x = -Math.PI / 2;
            rightArm.pivot.rotation.z = Math.sin(p * Math.PI * 4) * 0.3;
            leftArm.pivot.rotation.x = 0;
            leftLeg.pivot.rotation.x = 0;
            rightLeg.pivot.rotation.x = 0;
            group.rotation.x = 0;
          } else if (actionAnim === 'poke') {
            rightArm.pivot.rotation.x = -Math.PI / 2;
            rightArm.pivot.position.z = Math.sin(p * Math.PI) * -0.4;
            leftArm.pivot.rotation.x = 0;
            leftLeg.pivot.rotation.x = 0;
            rightLeg.pivot.rotation.x = 0;
            group.rotation.x = 0;
          } else {
            rightArm.pivot.rotation.x = -Math.PI / 4;
            leftArm.pivot.rotation.x = 0;
            leftLeg.pivot.rotation.x = 0;
            rightLeg.pivot.rotation.x = 0;
            group.rotation.x = 0;
          }
        } else {
          // Reset action transforms
          rightArm.pivot.position.z = 0;
          group.rotation.x = 0;
          rightArm.pivot.rotation.z = 0;

          if (isWalking) {
            const swing = Math.sin(time * 3) * 0.8;
            leftArm.pivot.rotation.x = swing;
            rightArm.pivot.rotation.x = -swing;
            leftLeg.pivot.rotation.x = -swing;
            rightLeg.pivot.rotation.x = swing;
            
            // Add vertical bounce to simulate step-by-step walking
            // Body is highest when legs cross (swing is 0), which matches a realistic walk cycle
            const bounce = Math.abs(Math.cos(time * 3)) * 0.15;
            group.position.y = bounce;
          } else {
            // Standing idle in side view (between actions)
            leftArm.pivot.rotation.x = 0;
            rightArm.pivot.rotation.x = 0;
            leftLeg.pivot.rotation.x = 0;
            rightLeg.pivot.rotation.x = 0;
            group.position.y = 0;
          }
        }
      }
    }
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };
  animate();

  if (container) {
    container._viewer = {
      updateState: (walk, face, tool, anim, animProgress) => {
        isWalking = walk;
        facingRight = face;
        if (tool !== activeTool) {
          activeTool = tool;
          setEquippedTool(tool);
        }
        actionAnim = anim;
        actionAnimProgress = animProgress || 0;
      },
      resetIdle: () => {
        codeStarted = false; // go back to front-facing wave
      }
    };
  }

  // Cleanup function to stop animation and dispose objects.
  return () => {
    cancelAnimationFrame(frameId);
    if (container) delete container._viewer;
    // Dispose geometry and material of each mesh
    geoms.forEach(g => g.dispose());
    mats.forEach(m => m.dispose());
    texs.forEach(t => t.dispose());
    renderer.dispose();
  };
}

