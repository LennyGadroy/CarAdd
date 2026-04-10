let currentFuel = 'diesel';
const FUELS = {
  diesel:{label:'Diesel',icoStroke:'#555',svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16M3 22h14M7 22V12h4v10"/><path d="M17 4h1a2 2 0 012 2v3.5a1.5 1.5 0 003 0V7l-2-3"/></svg>' },
  essence:{label:'Essence',svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16M3 22h14M7 22V12h4v10"/><path d="M17 4h1a2 2 0 012 2v3.5a1.5 1.5 0 003 0V7l-2-3"/></svg>' },
  hybride:{label:'Hybride',svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
  electrique:{label:'Électrique',svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
};

const DEFAULTS = ['Limiteur et régulateur','Ordinateur de bord','Kit mains libres Bluetooth','Caméra de recul'];

function init() {
  loadLogo();
  DEFAULTS.forEach(o => addOption(o));
  selectFuel('diesel');
  updateCard();
}

function selectFuel(f) {
  currentFuel = f;
  document.querySelectorAll('.fuel-pill').forEach(p => p.classList.toggle('active', p.dataset.fuel === f));
  document.getElementById('cFuelLabel').textContent = FUELS[f].label;
  document.getElementById('cFuelIco').innerHTML = FUELS[f].svg;
}

document.getElementById('logoInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = ev => { applyLogo(ev.target.result); saveLogo(ev.target.result); };
  r.readAsDataURL(file);
});

function applyLogo(src) {
  const img = document.getElementById('cLogoImg');
  img.src = src; img.style.display = 'block';
  document.getElementById('cLogoDefault').style.display = 'none';
  document.getElementById('logoPreviewImg').src = src;
  document.getElementById('logoPreview').classList.add('on');
}

function saveLogo(src) {
  try { localStorage.setItem('acs_logo', src); showSaved(); } catch(e) {}
}

function clearLogo() {
  document.getElementById('cLogoImg').style.display = 'none';
  document.getElementById('cLogoDefault').style.display = 'flex';
  document.getElementById('logoPreview').classList.remove('on');
  document.getElementById('logoInput').value = '';
  try { localStorage.removeItem('acs_logo'); } catch(e) {}
}

function loadLogo() {try { const s = localStorage.getItem('acs_logo'); if (s) applyLogo(s); } catch(e) {}}

function showSaved() {
  const b = document.getElementById('savedBadge');
  b.classList.add('on');
  setTimeout(() => b.classList.remove('on'), 3000);
}

function setupDrop(zoneId, cb) {
  const z = document.getElementById(zoneId);
  z.addEventListener('dragover', e => { e.preventDefault(); z.style.borderColor = '#ff0000'; });
  z.addEventListener('dragleave', () => { z.style.borderColor = ''; });
  z.addEventListener('drop', e => {
    e.preventDefault(); z.style.borderColor = '';
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) { const r = new FileReader(); r.onload = ev => cb(ev.target.result); r.readAsDataURL(f); }
  });
}
setupDrop('logoZone', src => { applyLogo(src); saveLogo(src); });
setupDrop('vehicleZone', src => {
  document.getElementById('thumbImg').src = src;
  document.getElementById('vehicleThumb').style.display = 'block';
  document.getElementById('cardImg').src = src;
  document.getElementById('cardImg').style.display = 'block';
  document.getElementById('cImgPlaceholder').style.display = 'none';
});

document.getElementById('vehicleInput').addEventListener('change', function(e) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    const src = ev.target.result;
    document.getElementById('thumbImg').src = src;
    document.getElementById('vehicleThumb').style.display = 'block';
    document.getElementById('cardImg').src = src;
    document.getElementById('cardImg').style.display = 'block';
    document.getElementById('cImgPlaceholder').style.display = 'none';
  };
  r.readAsDataURL(f);
});

function addOption(val = '') {
  const list = document.getElementById('optionsList');
  const count = list.querySelectorAll('.option-row').length;
  if (count >= 4) return;
  const row = document.createElement('div');
  row.className = 'option-row';
  row.innerHTML = `<input type="text" placeholder="Ex: GPS intégré" value="${val}" oninput="updateCard()">
    <button class="btn-del" onclick="this.parentElement.remove();updateCard()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
  list.appendChild(row);
  updateCard();
}

function setColor(id, val) { document.getElementById(id).value = val; updateCard(); }

function updateCard() {
  const g = id => document.getElementById(id);
  const v = id => g(id).value;

  g('cBrand').textContent    = v('brand');
  g('cYear').textContent     = v('year');
  g('cYear').style.color     = v('cYear');
  g('cPrice').textContent    = v('price');
  g('cPower').textContent    = v('power');
  g('cMileage').textContent  = v('mileage');
  g('cTx').innerHTML         = v('transmission').replace(/\n/g,'<br>');
  g('cTxWrap').style.background   = v('cStats');
  g('cBadgeInner').textContent    = v('badge');
  g('cBadgeInner').style.background = v('cBadge');
  g('cBadgeWrap').style.display   = g('showBadge').checked ? '' : 'none';
  g('cDealer').textContent   = v('dealer');
  g('cPhone').textContent    = v('phone');
  g('cAddress').textContent  = v('address');
  g('cFooter').style.background   = v('cFooter');

  const dark = g('darkCard').checked;
  g('card').style.background    = dark ? '#1a1a22' : '#fff';
  g('cHeader').style.background = dark ? '#0f0f13' : '#f2f2f2';
  g('cHeader').style.borderColor= dark ? '#333' : '#ddd';
  g('cOptsSection').style.background = dark ? '#1a1a22' : '#fff';
  g('cBrand').style.color       = dark ? '#fff' : '#111';
  document.querySelectorAll('.stat').forEach(s => {
    s.style.background = dark ? '#1a1a22' : '#f9f9f9';
    s.style.borderColor = dark ? '#333' : '#ddd';
    const sv = s.querySelector('.stat-val');
    if (sv) sv.style.color = dark ? '#fff' : '#111';
  });
  document.querySelectorAll('.opt-item').forEach(o => o.style.color = dark ? '#ddd' : '#333');

  const inputs = document.querySelectorAll('#optionsList .option-row input[type="text"]');
  const grid = g('cOptsGrid');
  grid.innerHTML = '';
  const c = v('cOptions');
  inputs.forEach(inp => {
    if (!inp.value.trim()) return;
    const item = document.createElement('div');
    item.className = 'opt-item';
    item.innerHTML = `<span class="opt-check" style="background:${c}"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>${inp.value}</span>`;
    grid.appendChild(item);
  });
  const addBtn = document.querySelector('.btn-add');if (addBtn) addBtn.style.display = inputs.length >= 4 ? 'none' : 'flex';}

async function downloadCard() {
  const btn = document.getElementById('dlBtn');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;animation:spin 1s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3"/><path d="M21 12a9 9 0 00-9-9"/></svg> Génération…`;
  btn.disabled = true;
  try {
    const canvas = await html2canvas(document.getElementById('card'), { scale:2, useCORS:true, allowTaint:true, backgroundColor:'#ffffff', logging:false });
    const a = document.createElement('a');
    a.download = 'annonce-vehicule.jpg';
    a.href = canvas.toDataURL('image/jpeg', 0.95);
    a.click();
  } catch(e) { alert('Erreur lors de la génération.'); console.error(e); }
  btn.disabled = false;
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="width:16px;height:16px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Télécharger en JPG`;
}

init();