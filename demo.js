const canvas = document.getElementById('demoCanvas');
const ctx = canvas.getContext('2d');
const modeButton = document.getElementById('modeButton');
const visibilityButton = document.getElementById('visibilityButton');
let passThrough = false;
let overlayVisible = true;
let startedAt = performance.now();

function resizeCanvas() {
  const width = canvas.parentElement.clientWidth;
  const height = Math.max(330, Math.min(440, width * 0.66));
  const dpr = window.devicePixelRatio || 1;
  canvas.style.height = `${height}px`;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  canvas.logicalWidth = width;
  canvas.logicalHeight = height;
}

function roundedRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function draw(now) {
  const w = canvas.logicalWidth || canvas.clientWidth;
  const h = canvas.logicalHeight || 360;
  const time = (now - startedAt) / 1000;
  ctx.clearRect(0, 0, w, h);

  // The shared app underneath.
  ctx.fillStyle = '#e7ece5'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#d6dfd6'; ctx.fillRect(0, 0, w, 35);
  ['#ef7569','#e7be62','#7ac366'].forEach((color, i) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(18 + i * 16, 18, 4, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = '#9aa89f'; ctx.font = '10px DM Mono, monospace'; ctx.fillText('screen-share · project walkthrough', 82, 21);
  ctx.fillStyle = '#f5f8f3'; ctx.fillRect(17, 54, w * .55, h - 72);
  ctx.fillStyle = '#d6dfd6'; ctx.fillRect(w * .61, 54, w * .32, h - 72);
  ctx.fillStyle = '#a1b0a5'; ctx.font = '11px DM Mono, monospace'; ctx.fillText('app.tsx', 31, 78); ctx.fillText('explaining the idea…', w * .63, 78);
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = ['#86a9a0','#c5a869','#9aadb0','#b7c9b6'][i % 4];
    ctx.fillRect(32 + (i % 3) * 38, 101 + Math.floor(i / 3) * 22, 22 + (i % 4) * 13, 5);
  }
  for (let i = 0; i < 4; i++) { ctx.fillStyle = '#c5d0c5'; ctx.fillRect(w * .63, 102 + i * 25, w * .21 - i * 15, 6); }

  // The private terminal layer.
  if (overlayVisible) {
    const tw = Math.min(w * .72, 350), th = Math.min(h * .62, 220);
    const tx = (w - tw) / 2 + Math.sin(time * .6) * 2;
    const ty = h * .28 + Math.cos(time * .7) * 2;
    ctx.shadowColor = '#122b2440'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
    roundedRect(tx, ty, tw, th, 10, '#152723'); ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#2e443e'; ctx.fillRect(tx, ty, tw, 28);
    ['#ef7569','#e7be62','#7ac366'].forEach((color, i) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(tx + 14 + i * 13, ty + 14, 3, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#9bada5'; ctx.font = '9px DM Mono, monospace'; ctx.fillText('private terminal', tx + 62, ty + 17);
    ctx.font = '10px DM Mono, monospace'; ctx.fillStyle = '#9dcf83'; ctx.fillText('~/demo', tx + 16, ty + 53); ctx.fillStyle = '#77d3c1'; ctx.fillText('$', tx + 61, ty + 53);
    ctx.fillStyle = '#d4e2d4'; ctx.fillText('codex', tx + 76, ty + 53);
    ctx.fillStyle = '#80928b'; ctx.fillText('ready when you are.', tx + 16, ty + 78);
    ctx.fillStyle = '#9dcf83'; ctx.fillText('~/demo', tx + 16, ty + 111); ctx.fillStyle = '#77d3c1'; ctx.fillText('$', tx + 61, ty + 111);
    if (Math.floor(time * 2) % 2 === 0) { ctx.fillStyle = '#c1e681'; ctx.fillRect(tx + 76, ty + 100, 6, 14); }
    ctx.fillStyle = passThrough ? '#e6c46c' : '#8bcf94'; ctx.font = '9px DM Mono, monospace'; ctx.fillText(passThrough ? 'click-through on' : 'interactive', tx + tw - 94, ty + 17);
  }

  // Pointer demonstrates the current mode.
  const px = passThrough ? w * .77 : w * .55 + Math.sin(time) * 20;
  const py = passThrough ? h * .64 : h * .49 + Math.cos(time) * 16;
  ctx.save(); ctx.translate(px, py); ctx.rotate(-.25); ctx.fillStyle = passThrough ? '#bd8d3d' : '#34775e'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 21); ctx.lineTo(6, 16); ctx.lineTo(12, 28); ctx.lineTo(17, 25); ctx.lineTo(11, 14); ctx.lineTo(19, 13); ctx.closePath(); ctx.fill(); ctx.restore();
  requestAnimationFrame(draw);
}

function updateControls() {
  modeButton.classList.toggle('active', passThrough);
  modeButton.innerHTML = `<span>⌘M</span> ${passThrough ? 'Restore interaction' : 'Click-through'}`;
  visibilityButton.classList.toggle('active', !overlayVisible);
  visibilityButton.innerHTML = `<span>⌘N</span> ${overlayVisible ? 'Hide overlay' : 'Show overlay'}`;
}
modeButton.addEventListener('click', () => { passThrough = !passThrough; updateControls(); });
visibilityButton.addEventListener('click', () => { overlayVisible = !overlayVisible; updateControls(); });
window.addEventListener('keydown', (event) => {
  if (!event.metaKey) return;
  const key = event.key.toLowerCase();
  if (key === 'm') { event.preventDefault(); passThrough = !passThrough; updateControls(); }
  if (key === 'n') { event.preventDefault(); overlayVisible = !overlayVisible; updateControls(); }
});
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); updateControls(); requestAnimationFrame(draw);

const accessCanvas = document.getElementById('accessCanvas');
const accessCtx = accessCanvas.getContext('2d');
const processCaption = document.getElementById('processCaption');
const processSteps = ['Join the early-access list', 'We review your request', 'Installer sent by email'];
let accessStartedAt = performance.now();

function resizeAccessCanvas() {
  const width = accessCanvas.parentElement.clientWidth;
  const height = window.innerWidth <= 800 ? 205 : 180;
  const dpr = window.devicePixelRatio || 1;
  accessCanvas.width = width * dpr; accessCanvas.height = height * dpr;
  accessCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  accessCanvas.logicalWidth = width; accessCanvas.logicalHeight = height;
}

function drawAccessProcess(now) {
  const w = accessCanvas.logicalWidth || accessCanvas.clientWidth;
  const h = accessCanvas.logicalHeight || 180;
  const phase = ((now - accessStartedAt) / 1000) % 6;
  const active = Math.min(2, Math.floor(phase / 2));
  accessCtx.clearRect(0, 0, w, h);
  accessCtx.fillStyle = '#172622'; accessCtx.fillRect(0, 0, w, h);
  const left = Math.max(46, w * .1), right = Math.min(w - 46, w * .9), y = h * .48;
  accessCtx.strokeStyle = '#426454'; accessCtx.lineWidth = 2; accessCtx.beginPath(); accessCtx.moveTo(left, y); accessCtx.lineTo(right, y); accessCtx.stroke();
  const labels = ['JOIN LIST', 'REVIEW', 'EMAIL'];
  const icons = ['✉', '✓', '↗'];
  const progress = (phase % 2) / 2;
  for (let i = 0; i < 3; i++) {
    const x = left + (right - left) * (i / 2);
    const isDone = i < active, isActive = i === active;
    accessCtx.fillStyle = isDone || isActive ? '#6aa579' : '#355247';
    accessCtx.beginPath(); accessCtx.arc(x, y, isActive ? 21 : 17, 0, Math.PI * 2); accessCtx.fill();
    accessCtx.fillStyle = '#f7f6f0'; accessCtx.font = 'bold 15px Manrope, sans-serif'; accessCtx.textAlign = 'center'; accessCtx.textBaseline = 'middle'; accessCtx.fillText(icons[i], x, y + 1);
    accessCtx.fillStyle = '#c3d5c4'; accessCtx.font = '500 9px DM Mono, monospace'; accessCtx.textBaseline = 'alphabetic'; accessCtx.fillText(labels[i], x, y + 43);
  }
  const from = left + (right - left) * (active / 2), to = left + (right - left) * (Math.min(active + 1, 2) / 2);
  const dotX = active === 2 ? right : from + (to - from) * progress;
  accessCtx.fillStyle = '#c1e681'; accessCtx.beginPath(); accessCtx.arc(dotX, y - 33, 5, 0, Math.PI * 2); accessCtx.fill();
  processCaption.textContent = processSteps[active];
  requestAnimationFrame(drawAccessProcess);
}
window.addEventListener('resize', resizeAccessCanvas);
resizeAccessCanvas(); requestAnimationFrame(drawAccessProcess);

if (document.getElementById('storyCanvas')) {
const storyCanvas = document.getElementById('storyCanvas');
const storyCtx = storyCanvas.getContext('2d');
const storyPlay = document.getElementById('storyPlay');
const storyProgress = document.getElementById('storyProgress');
const storyTime = document.getElementById('storyTime');
const storyDots = document.getElementById('storyDots');
const storySlides = [
  {kicker:'CHEATLY', title:['Think in private.', 'Speak with confidence.'], body:'A real terminal layer for live screen sharing.', accent:'#c1e681'},
  {kicker:'WHAT IT IS', title:['Your tools,', 'right beside you.'], body:'A private PTY workspace for Codex, Claude, local LLMs, Git, scripts, and CLI tools.', accent:'#8ed0a0'},
  {kicker:'HOW IT WORKS', title:['Only you see', 'the terminal.'], body:'While your screen is shared, the audience sees the app you present and you see the private terminal in supported capture paths.', accent:'#83c8bc'},
  {kicker:'WHAT YOU CAN DO', title:['Ask. Test. Refine.', 'Keep moving.'], body:'Check commands, research ideas, rehearse explanations, and return to the conversation naturally.', accent:'#c1e681'}
];
let storyPlaying = true, storyStartedAt = performance.now(), storyPausedAt = 0, storyIndex = 0;
storySlides.forEach((_, i) => { const dot = document.createElement('button'); dot.type = 'button'; dot.setAttribute('aria-label', `Show slide ${i + 1}`); dot.addEventListener('click', () => { storyIndex = i; storyStartedAt = performance.now(); storyPausedAt = 0; storyPlaying = true; updateStoryControls(); }); storyDots.appendChild(dot); });

function resizeStoryCanvas() {
  const width = storyCanvas.parentElement.clientWidth;
  const height = width < 620 ? Math.max(330, Math.min(390, width * .95)) : Math.max(280, Math.min(390, width * .58));
  const dpr = window.devicePixelRatio || 1;
  storyCanvas.width = width * dpr; storyCanvas.height = height * dpr; storyCanvas.style.height = `${height}px`;
  storyCtx.setTransform(dpr, 0, 0, dpr, 0, 0); storyCanvas.logicalWidth = width; storyCanvas.logicalHeight = height;
}

function storyBox(x, y, width, height, radius, fill, stroke) { storyCtx.beginPath(); storyCtx.roundRect(x, y, width, height, radius); storyCtx.fillStyle = fill; storyCtx.fill(); if (stroke) { storyCtx.strokeStyle = stroke; storyCtx.stroke(); } }
function storyText(text, x, y, size, color, font = 'Manrope, sans-serif', weight = 400) { storyCtx.fillStyle = color; storyCtx.font = `${weight} ${size}px ${font}`; storyCtx.fillText(text, x, y); }
function storyTerminal(x, y, width, height, accent, time) {
  storyCtx.shadowColor = '#07130f80'; storyCtx.shadowBlur = 20; storyCtx.shadowOffsetY = 9; storyBox(x, y, width, height, 9, '#10201c'); storyCtx.shadowColor = 'transparent';
  storyCtx.fillStyle = '#284139'; storyCtx.fillRect(x, y, width, 25); ['#ef7569','#e7be62','#7ac366'].forEach((c, i) => { storyCtx.fillStyle = c; storyCtx.beginPath(); storyCtx.arc(x + 14 + i * 12, y + 12, 3, 0, Math.PI * 2); storyCtx.fill(); });
  storyText('private terminal', x + 57, y + 16, 8, '#9eb7a5', 'DM Mono, monospace', 500); storyText('~/workspace', x + 14, y + 48, 9, accent, 'DM Mono, monospace', 500); storyText('$', x + 78, y + 48, 9, '#77d3c1', 'DM Mono, monospace', 500); storyText('codex', x + 91, y + 48, 9, '#d4e2d4', 'DM Mono, monospace');
  storyText('thinking with you…', x + 14, y + 70, 8, '#80928b', 'DM Mono, monospace'); storyText('✓ ready', x + width - 51, y + 16, 8, accent, 'DM Mono, monospace');
  const cursor = Math.floor(time * 2) % 2 === 0; if (cursor) { storyCtx.fillStyle = accent; storyCtx.fillRect(x + 14, y + height - 21, 5, 10); }
}
function storyScreen(x, y, width, height) {
  storyBox(x, y, width, height, 8, '#f2f6ef', '#6e8c78'); storyCtx.fillStyle = '#d5e1d5'; storyCtx.fillRect(x, y, width, 24); ['#ef7569','#e7be62','#7ac366'].forEach((c, i) => { storyCtx.fillStyle = c; storyCtx.beginPath(); storyCtx.arc(x + 13 + i * 12, y + 12, 3, 0, Math.PI * 2); storyCtx.fill(); });
  storyText('project walkthrough', x + 58, y + 16, 8, '#667c6e', 'DM Mono, monospace'); storyText('app.tsx', x + 13, y + 50, 9, '#718579', 'DM Mono, monospace');
  for (let i = 0; i < 5; i++) { storyCtx.fillStyle = ['#83aaa0','#c8aa6c','#9aadb0'][i % 3]; storyCtx.fillRect(x + 14, y + 67 + i * 16, width * (.48 - i * .05), 5); }
  storyBox(x + width * .63, y + 46, width * .27, height - 62, 5, '#dce8dc'); storyText('shared view', x + width * .67, y + 66, 8, '#5d7966', 'DM Mono, monospace');
}
function drawStory(now) {
  const w = storyCanvas.logicalWidth || storyCanvas.clientWidth, h = storyCanvas.logicalHeight || 320;
  const slideLength = 5, elapsed = storyPlaying ? (now - storyStartedAt) / 1000 : storyPausedAt;
  if (storyPlaying && elapsed >= slideLength) { storyIndex = (storyIndex + 1) % storySlides.length; storyStartedAt = now; }
  const progress = Math.min(1, (storyPlaying ? (now - storyStartedAt) / 1000 : storyPausedAt) / slideLength), slide = storySlides[storyIndex], time = (now - storyStartedAt) / 1000;
  storyCtx.clearRect(0, 0, w, h); storyCtx.fillStyle = '#172622'; storyCtx.fillRect(0, 0, w, h); storyCtx.fillStyle = '#2c463b'; storyCtx.fillRect(0, 0, w, 40); storyText('cheatly · private workspace', 21, 24, 9, '#91ae99', 'DM Mono, monospace', 500); storyCtx.fillStyle = slide.accent; storyCtx.beginPath(); storyCtx.arc(w - 25, 20, 5, 0, Math.PI * 2); storyCtx.fill();
  const compact = w < 620, textX = compact ? 24 : 32, visualX = compact ? 24 : w * .53, visualW = compact ? w - 48 : w * .41;
  storyText(slide.kicker, textX, compact ? 70 : 85, 9, slide.accent, 'DM Mono, monospace', 500); storyText(slide.title[0], textX, compact ? 108 : 137, compact ? 25 : 30, '#f7f6f0', 'Manrope, sans-serif', 700); storyText(slide.title[1], textX, compact ? 140 : 173, compact ? 25 : 30, '#f7f6f0', 'Manrope, sans-serif', 700);
  storyCtx.font = '11px Manrope, sans-serif'; const words = slide.body.split(' '); let line = '', lineY = compact ? 171 : 207, maxLine = compact ? w - 48 : w * .42; words.forEach(word => { const test = line ? `${line} ${word}` : word; if (storyCtx.measureText(test).width > maxLine) { storyText(line, textX, lineY, 11, '#b8c9ba'); line = word; lineY += 17; } else line = test; }); storyText(line, textX, lineY, 11, '#b8c9ba');
  const vy = compact ? 218 : 70;
  if (storyIndex === 0) { storyScreen(visualX, vy + 22, visualW, compact ? 120 : 165); storyTerminal(visualX + visualW * .16, vy, visualW * .72, compact ? 106 : 135, slide.accent, time); storyBox(visualX + visualW * .55, vy - 4, visualW * .42, 22, 11, '#c1e681'); storyText('not in shared view', visualX + visualW * .6, vy + 11, 8, '#172622', 'DM Mono, monospace', 500); }
  if (storyIndex === 1) { storyTerminal(visualX, vy + 15, visualW * .9, compact ? 123 : 155, slide.accent, time); storyBox(visualX + 16, vy + (compact ? 75 : 95), visualW * .7, 25, 6, '#29483d'); storyText('ask an AI LLM → get unstuck', visualX + 28, vy + (compact ? 91 : 111), 8, '#c1e681', 'DM Mono, monospace', 500); }
  if (storyIndex === 2) { storyScreen(visualX, vy + 35, visualW * .86, compact ? 105 : 135); storyTerminal(visualX + visualW * .15, vy, visualW * .7, compact ? 96 : 120, slide.accent, time); storyText('shared screen', visualX + 8, vy + (compact ? 157 : 180), 8, '#7f9c87', 'DM Mono, monospace'); storyText('private layer', visualX + visualW * .58, vy + (compact ? 157 : 180), 8, slide.accent, 'DM Mono, monospace'); }
  if (storyIndex === 3) { ['ASK', 'TEST', 'PRESENT'].forEach((label, i) => { const chipX = visualX + (i % 2) * (visualW * .48), chipY = vy + Math.floor(i / 2) * 63; storyBox(chipX, chipY, visualW * .41, 42, 7, i === 2 ? '#6aa579' : '#29483d'); storyText(label, chipX + 13, chipY + 17, 8, i === 2 ? '#172622' : slide.accent, 'DM Mono, monospace', 500); storyText(i === 0 ? 'ask Codex' : i === 1 ? 'run the check' : 'keep talking', chipX + 13, chipY + 31, 8, i === 2 ? '#e5f0e3' : '#b8c9ba', 'Manrope, sans-serif'); }); }
  storyProgress.style.width = `${progress * 100}%`; storyTime.textContent = `${String(storyIndex + 1).padStart(2, '0')} / ${String(storySlides.length).padStart(2, '0')}`; updateStoryDots(); requestAnimationFrame(drawStory);
}
function updateStoryDots() { [...storyDots.children].forEach((dot, i) => dot.classList.toggle('active', i === storyIndex)); }
function updateStoryControls() { storyPlay.textContent = storyPlaying ? 'Ⅱ Pause' : '▶ Play'; updateStoryDots(); }
storyPlay.addEventListener('click', () => { if (storyPlaying) { storyPausedAt = (performance.now() - storyStartedAt) / 1000; storyPlaying = false; } else { storyStartedAt = performance.now() - storyPausedAt * 1000; storyPlaying = true; } updateStoryControls(); });
window.addEventListener('resize', resizeStoryCanvas); resizeStoryCanvas(); updateStoryControls(); requestAnimationFrame(drawStory);
}

const flapCanvas = document.getElementById('flapCanvas');
const flapCtx = flapCanvas.getContext('2d');
const flapSlider = document.getElementById('flapSlider');
const FLAP_DEFAULT_POSITION = 0.5;
let flapPosition = FLAP_DEFAULT_POSITION;

function resetFlapPosition() {
  flapPosition = FLAP_DEFAULT_POSITION;
  flapSlider.defaultValue = '50';
  flapSlider.value = '50';
}
let flapAutoPlaying = false;
let flapAutoFrame = 0;
function startFlapAuto() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  flapAutoPlaying = true;
  cancelAnimationFrame(flapAutoFrame);
  flapAutoFrame = requestAnimationFrame(animateFlap);
}
function stopFlapAuto() {
  flapAutoPlaying = false;
  cancelAnimationFrame(flapAutoFrame);
}
function animateFlap(time) {
  if (!flapAutoPlaying) return;
  flapPosition = FLAP_DEFAULT_POSITION + Math.sin(time / 1800) * 0.32;
  flapSlider.value = String(Math.round(flapPosition * 100));
  drawFlap();
  flapAutoFrame = requestAnimationFrame(animateFlap);
}

function resizeFlapCanvas() {
  const width = flapCanvas.parentElement.clientWidth;
  const height = Math.max(245, Math.min(350, width * .5));
  const dpr = window.devicePixelRatio || 1;
  flapCanvas.width = width * dpr; flapCanvas.height = height * dpr; flapCanvas.style.height = `${height}px`;
  flapCtx.setTransform(dpr, 0, 0, dpr, 0, 0); flapCanvas.logicalWidth = width; flapCanvas.logicalHeight = height;
}
function flapBox(x, y, width, height, radius, fill, stroke) { flapCtx.beginPath(); flapCtx.roundRect(x, y, width, height, radius); flapCtx.fillStyle = fill; flapCtx.fill(); if (stroke) { flapCtx.strokeStyle = stroke; flapCtx.stroke(); } }
function drawFlap() {
  const w = flapCanvas.logicalWidth || flapCanvas.clientWidth, h = flapCanvas.logicalHeight || 280, split = w * flapPosition;
  const compact = w < 480;
  flapCtx.clearRect(0, 0, w, h); flapCtx.fillStyle = '#dfe9df'; flapCtx.fillRect(0, 0, w, h);
  // Shared view: the presentation everyone else sees.
  flapCtx.save(); flapCtx.beginPath(); flapCtx.rect(0, 0, w, h); flapCtx.clip();
  flapCtx.fillStyle = '#d4e0d4'; flapCtx.fillRect(0, 0, w, 34); flapCtx.fillStyle = '#6b8271'; flapCtx.font = '9px DM Mono, monospace'; flapCtx.fillText('SHARED SCREEN · LIVE CALL', 20, 21);
  flapBox(w * .07, 54, w * .86, h - 76, 8, '#f6f8f3', '#c7d5c7'); flapCtx.fillStyle = '#738878'; flapCtx.font = '10px DM Mono, monospace'; flapCtx.fillText('Design review · 3 people in the call', w * .11, 78);
  const people = [{x:.16, name:'you', color:'#83a99e'},{x:.39, name:'Alex', color:'#d2ae70'},{x:.62, name:'Maya', color:'#9baeb0'},{x:.78, name:'Sam', color:'#ba9cba'}];
  people.forEach(person => { const px = w * person.x; flapCtx.fillStyle = person.color; flapCtx.beginPath(); flapCtx.arc(px, h * .46, 26, 0, Math.PI * 2); flapCtx.fill(); flapCtx.fillStyle = '#f6f8f3'; flapCtx.beginPath(); flapCtx.arc(px, h * .43, 9, 0, Math.PI * 2); flapCtx.fill(); flapCtx.beginPath(); flapCtx.arc(px, h * .57, 16, Math.PI, 0); flapCtx.fill(); flapCtx.fillStyle = '#68816c'; flapCtx.font = '9px DM Mono, monospace'; flapCtx.textAlign = 'center'; flapCtx.fillText(person.name, px, h * .72); });
  flapCtx.textAlign = 'left'; flapCtx.fillStyle = '#7c9680'; flapCtx.font = '9px DM Mono, monospace'; flapCtx.fillText('You are presenting · microphone on', w * .11, h - 31); flapCtx.restore();
  // Private terminal view is clipped to the user's side of the flap.
  flapCtx.save(); flapCtx.beginPath(); flapCtx.rect(0, 0, split, h); flapCtx.clip(); flapCtx.fillStyle = '#172622'; flapCtx.fillRect(0, 0, split, h); flapCtx.fillStyle = '#2c463b'; flapCtx.fillRect(0, 0, split, 34); flapCtx.fillStyle = '#c1e681'; flapCtx.font = '9px DM Mono, monospace'; flapCtx.fillText('YOUR VIEW · PRIVATE', 20, 21);
  const tw = Math.max(130, Math.min(310, split - 24)), tx = Math.max(12, (split - tw) * .5), ty = 62; flapBox(tx, ty, tw, 142, 9, '#10201c'); flapCtx.fillStyle = '#284139'; flapCtx.fillRect(tx, ty, tw, 25); flapCtx.fillStyle = '#ef7569'; flapCtx.beginPath(); flapCtx.arc(tx + 14, ty + 12, 3, 0, Math.PI * 2); flapCtx.fill(); flapCtx.fillStyle = '#e7be62'; flapCtx.beginPath(); flapCtx.arc(tx + 26, ty + 12, 3, 0, Math.PI * 2); flapCtx.fill(); flapCtx.fillStyle = '#7ac366'; flapCtx.beginPath(); flapCtx.arc(tx + 38, ty + 12, 3, 0, Math.PI * 2); flapCtx.fill(); flapCtx.fillStyle = '#9dcf83'; flapCtx.font = `${compact ? 7 : 9}px DM Mono, monospace`; flapCtx.fillText(compact ? '~/work' : '~/workspace', tx + 15, ty + 48); flapCtx.fillStyle = '#77d3c1'; flapCtx.fillText('$', tx + (compact ? 55 : 84), ty + 48); flapCtx.fillStyle = '#d4e2d4'; flapCtx.fillText('codex', tx + (compact ? 66 : 97), ty + 48); flapCtx.fillStyle = '#c1e681'; flapCtx.fillText('LLM QUERY', tx + 15, ty + 75); flapCtx.fillStyle = '#b8c9ba'; flapCtx.fillText(compact ? 'System design…' : 'Design a scalable chat system', tx + 15, ty + 91); flapCtx.fillText(compact ? '1M users' : 'for 1M concurrent users.', tx + 15, ty + 105); flapCtx.fillStyle = '#83c8bc'; flapCtx.fillText(compact ? 'thinking…' : 'system design · thinking…', tx + 15, ty + 124); flapCtx.restore();
  // Flap handle and labels.
  flapCtx.fillStyle = '#c1e681'; flapCtx.fillRect(split - 2, 0, 4, h); flapCtx.fillStyle = '#c1e681'; flapCtx.beginPath(); flapCtx.arc(split, h * .5, 14, 0, Math.PI * 2); flapCtx.fill(); flapCtx.fillStyle = '#172622'; flapCtx.font = 'bold 13px Manrope, sans-serif'; flapCtx.textAlign = 'center'; flapCtx.fillText('↔', split, h * .5 + 5); flapCtx.textAlign = 'left';
}
function pointerClientX(event) { if (typeof event.clientX === 'number') return event.clientX; const touch = event.touches?.[0] || event.changedTouches?.[0]; return touch ? touch.clientX : null; }
function setFlapFromPointer(event) { const clientX = pointerClientX(event); if (clientX == null) return; const rect = flapCanvas.getBoundingClientRect(); flapPosition = Math.max(.18, Math.min(.82, (clientX - rect.left) / rect.width)); flapSlider.value = Math.round(flapPosition * 100); drawFlap(); }
let flapDragging = false;
function stopFlapDrag(event) { flapDragging = false; if (event?.pointerId != null && flapCanvas.hasPointerCapture?.(event.pointerId)) flapCanvas.releasePointerCapture(event.pointerId); }
flapCanvas.addEventListener('pointerdown', event => { event.preventDefault(); stopFlapAuto(); flapDragging = true; flapCanvas.setPointerCapture?.(event.pointerId); setFlapFromPointer(event); });
flapCanvas.addEventListener('pointermove', event => { if (flapDragging) setFlapFromPointer(event); });
flapCanvas.addEventListener('pointerup', stopFlapDrag);
flapCanvas.addEventListener('pointercancel', stopFlapDrag);
flapCanvas.addEventListener('lostpointercapture', () => { flapDragging = false; });
flapCanvas.addEventListener('touchstart', event => { event.preventDefault(); stopFlapAuto(); flapDragging = true; setFlapFromPointer(event); }, { passive: false });
flapCanvas.addEventListener('touchmove', event => { if (flapDragging) { event.preventDefault(); setFlapFromPointer(event); } }, { passive: false });
flapCanvas.addEventListener('touchend', stopFlapDrag, { passive: true });
flapCanvas.addEventListener('touchcancel', stopFlapDrag, { passive: true });
flapSlider.addEventListener('input', () => { stopFlapAuto(); flapPosition = Number(flapSlider.value) / 100; drawFlap(); });
window.addEventListener('resize', resizeFlapCanvas); resizeFlapCanvas(); resetFlapPosition(); drawFlap(); startFlapAuto();

// Browsers may restore range-input state after a reload or back/forward navigation.
// Re-apply the intentional 50/50 starting point after that restoration step.
window.addEventListener('pageshow', () => { resetFlapPosition(); drawFlap(); startFlapAuto(); });

// Returning home always restores the comparison to its clearest 50/50 starting point.
document.querySelector('.brand')?.addEventListener('click', () => { resetFlapPosition(); drawFlap(); startFlapAuto(); });

const blogCanvas = document.getElementById('blogCanvas');
if (blogCanvas) {
  const blogCtx = blogCanvas.getContext('2d');
  function roundBlogBox(x, y, width, height, radius, fill, stroke) {
    blogCtx.beginPath(); blogCtx.roundRect(x, y, width, height, radius); blogCtx.fillStyle = fill; blogCtx.fill();
    if (stroke) { blogCtx.strokeStyle = stroke; blogCtx.stroke(); }
  }
  function blogText(text, x, y, size, color, align = 'left', weight = 500) {
    blogCtx.fillStyle = color; blogCtx.font = `${weight} ${size}px ${size < 10 ? 'DM Mono' : 'Manrope'}, sans-serif`; blogCtx.textAlign = align; blogCtx.fillText(text, x, y);
  }
  function drawBlogCanvas() {
    const width = blogCanvas.parentElement.clientWidth;
    const height = Math.max(260, Math.min(390, width * .72));
    const dpr = window.devicePixelRatio || 1;
    blogCanvas.width = width * dpr; blogCanvas.height = height * dpr; blogCanvas.style.height = `${height}px`;
    blogCtx.setTransform(dpr, 0, 0, dpr, 0, 0); blogCtx.clearRect(0, 0, width, height);
    blogCtx.fillStyle = '#172622'; blogCtx.fillRect(0, 0, width, height);
    const compact = width < 430;
    blogText('ONE MAC · TWO VIEWS', 22, 27, 9, '#c1e681', 'left', 500);
    blogText('What you keep nearby', width * .27, 58, compact ? 10 : 12, '#f3f7ee', 'center', 700);
    blogText('What you choose to share', width * .73, 58, compact ? 10 : 12, '#f3f7ee', 'center', 700);
    const gap = compact ? 12 : 20, left = 18, top = 76, boxWidth = (width - left * 2 - gap) / 2, boxHeight = height - top - 28;
    roundBlogBox(left, top, boxWidth, boxHeight, 9, '#10201c', '#527260');
    roundBlogBox(left + boxWidth + gap, top, boxWidth, boxHeight, 9, '#f1f5ed', '#c3d5c4');
    const lx = left + 13, rx = left + boxWidth + gap + 13;
    blogText('PRIVATE WORKSPACE', lx, top + 24, 8, '#c1e681');
    blogText('SHARED SCREEN', rx, top + 24, 8, '#34775e');
    blogCtx.fillStyle = '#284139'; blogCtx.fillRect(lx, top + 39, boxWidth - 26, 22);
    blogCtx.fillStyle = '#ef7569'; blogCtx.beginPath(); blogCtx.arc(lx + 10, top + 50, 3, 0, Math.PI * 2); blogCtx.fill();
    blogCtx.fillStyle = '#e7be62'; blogCtx.beginPath(); blogCtx.arc(lx + 21, top + 50, 3, 0, Math.PI * 2); blogCtx.fill();
    blogText('$', lx, top + 86, 10, '#77d3c1'); blogText('codex', lx + 13, top + 86, 10, '#d4e2d4');
    blogText(compact ? 'approved AI help' : 'approved AI help + notes', lx, top + 111, 9, '#c1e681');
    blogText(compact ? 'your terminal' : 'your terminal commands', lx, top + 131, 9, '#b8c9ba');
    blogCtx.fillStyle = '#d5e2d2'; blogCtx.fillRect(rx, top + 42, boxWidth - 26, 53);
    blogCtx.fillStyle = '#aac0ad'; blogCtx.beginPath(); blogCtx.arc(rx + (boxWidth - 26) * .25, top + 68, 12, 0, Math.PI * 2); blogCtx.fill();
    blogCtx.fillStyle = '#d4ae78'; blogCtx.beginPath(); blogCtx.arc(rx + (boxWidth - 26) * .58, top + 68, 12, 0, Math.PI * 2); blogCtx.fill();
    blogCtx.fillStyle = '#a7b8c5'; blogCtx.beginPath(); blogCtx.arc(rx + (boxWidth - 26) * .82, top + 68, 12, 0, Math.PI * 2); blogCtx.fill();
    blogText(compact ? 'call · demo · presentation' : 'call · demo · presentation', rx, top + 126, 8, '#607b69');
    blogText('You decide what is shared', width / 2, height - 12, 9, '#c1e681', 'center');
  }
  window.addEventListener('resize', drawBlogCanvas); drawBlogCanvas();
}

const mobileNav = document.querySelector('.mobile-nav');
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mobileNavPanel = document.getElementById('mobileNavPanel');
function closeMobileNav() {
  if (!mobileNav || !mobileNavToggle || !mobileNavPanel) return;
  mobileNav.classList.remove('is-open');
  mobileNavToggle.setAttribute('aria-expanded', 'false');
  mobileNavPanel.setAttribute('aria-hidden', 'true');
}
mobileNavToggle?.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('is-open');
  mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
  mobileNavPanel.setAttribute('aria-hidden', String(!isOpen));
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileNav));
