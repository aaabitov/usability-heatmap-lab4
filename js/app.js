const area = document.getElementById('testArea');
const canvas = document.getElementById('heatmapCanvas');
const ctx = canvas.getContext('2d');
const count = document.getElementById('clickCount');
const zones = document.getElementById('hotZones');
const last = document.getElementById('lastClick');
const btnToggle = document.getElementById('toggleHeatmap');
const btnDemo = document.getElementById('demoData');
const btnClear = document.getElementById('clearData');
const btnJson = document.getElementById('exportJson');
const btnCsv = document.getElementById('exportCsv');

let points = JSON.parse(localStorage.getItem('lab4-points') || '[]');
let visible = true;

function save() {
  localStorage.setItem('lab4-points', JSON.stringify(points));
}

function resize() {
  const r = area.getBoundingClientRect();
  canvas.width = r.width;
  canvas.height = r.height;
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!visible) return;
  for (const p of points) {
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 55);
    g.addColorStop(0, 'rgba(255,0,0,0.55)');
    g.addColorStop(0.5, 'rgba(255,180,0,0.35)');
    g.addColorStop(1, 'rgba(255,255,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 55, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateInfo() {
  count.textContent = points.length;
  const set = new Set(points.map(p => Math.floor(p.x / 120) + '-' + Math.floor(p.y / 120)));
  zones.textContent = set.size;
  const p = points[points.length - 1];
  last.textContent = p ? 'x: ' + p.x + ', y: ' + p.y + ', элемент: ' + p.tag : 'нет данных';
}

area.addEventListener('click', event => {
  const r = area.getBoundingClientRect();
  points.push({
    x: Math.round(event.clientX - r.left),
    y: Math.round(event.clientY - r.top),
    tag: event.target.tagName.toLowerCase(),
    time: new Date().toLocaleString('ru-RU')
  });
  save();
  updateInfo();
  draw();
});

btnToggle.addEventListener('click', () => {
  visible = !visible;
  draw();
});

btnDemo.addEventListener('click', () => {
  points = points.concat([
    { x: 100, y: 330, tag: 'button', time: 'demo' },
    { x: 120, y: 335, tag: 'button', time: 'demo' },
    { x: 305, y: 335, tag: 'button', time: 'demo' },
    { x: 160, y: 90, tag: 'a', time: 'demo' },
    { x: 420, y: 580, tag: 'article', time: 'demo' },
    { x: 180, y: 690, tag: 'input', time: 'demo' }
  ]);
  save();
  updateInfo();
  draw();
});

btnClear.addEventListener('click', () => {
  points = [];
  save();
  updateInfo();
  draw();
});

btnJson.addEventListener('click', () => {
  alert(JSON.stringify(points, null, 2));
});

btnCsv.addEventListener('click', () => {
  const rows = ['x,y,tag,time'].concat(points.map(p => `${p.x},${p.y},${p.tag},${p.time}`));
  alert(rows.join('\n'));
});

window.addEventListener('resize', resize);
resize();
updateInfo();
