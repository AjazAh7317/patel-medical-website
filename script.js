// Edit this number to change the WhatsApp recipient (digits only, country code included).
const WHATSAPP_NUMBER = "919695647060";
const PHONE_PRIMARY = "+919695647060";
const wa = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


// Mobile navigation
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}));

// Medicine/product enquiry. File upload is not sent automatically through wa.me;
// WhatsApp will open and the visitor can attach their selected file manually.
document.querySelector("#medicine-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const medicine = document.querySelector("#medicine-name").value.trim();
  const quantity = document.querySelector("#medicine-qty").value.trim();
  const file = document.querySelector("#medicine-file").files?.[0];
  let message = `Hello Patel Medical Store,\n\nI'd like to enquire about:\nMedicine/product: ${medicine}`;
  if (quantity) message += `\nQuantity: ${quantity}`;
  if (file) message += `\nPrescription file selected: ${file.name}\n(I will attach this file in WhatsApp.)`;
  message += "\n\nPlease let me know availability and details. Thank you.";
  window.open(wa(message), "_blank", "noopener,noreferrer");
});

// Physiotherapy appointment enquiry
const dateInput = document.querySelector("#preferred-date");
if (dateInput) {
  const localToday = new Date();
  const offset = localToday.getTimezoneOffset();
  localToday.setMinutes(localToday.getMinutes() - offset);
  dateInput.min = localToday.toISOString().slice(0, 10);
}
document.querySelector("#appointment-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#patient-name").value.trim();
  const phone = document.querySelector("#patient-phone").value.trim();
  const date = document.querySelector("#preferred-date").value;
  const time = document.querySelector("#preferred-time").value;
  const problem = document.querySelector("#problem").value.trim();
  const extra = document.querySelector("#patient-message").value.trim();
  let message = `Hello Patel Physiotherapy Clinic,\n\nI'd like to request an appointment.\nPatient name: ${name}\nMobile: ${phone}`;
  if (date) message += `\nPreferred date: ${date}`;
  if (time) message += `\nPreferred time: ${time}`;
  if (problem) message += `\nConcern/service: ${problem}`;
  if (extra) message += `\nAdditional message: ${extra}`;
  message += "\n\nPlease confirm appointment availability. Thank you.";
  window.open(wa(message), "_blank", "noopener,noreferrer");
});

// Current year and back-to-top control
const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
const backTop = document.querySelector(".back-top");
window.addEventListener("scroll", () => backTop?.classList.toggle("visible", window.scrollY > 550), { passive: true });
backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Medicine directory + intuitive basket-based multi-item ordering.
const medicineCategories = {
  "Pain and fever medicines": ["Paracetamol","Ibuprofen","Diclofenac","Aceclofenac","Naproxen","Aspirin","Mefenamic Acid","Etoricoxib","Nimesulide","Tramadol"],
  "Antibiotics": ["Amoxicillin","Azithromycin","Ciprofloxacin","Cefixime","Cefuroxime","Cefpodoxime","Doxycycline","Metronidazole","Ofloxacin","Amoxicillin + Clavulanic Acid"],
  "Cold, cough and allergy medicines": ["Cetirizine","Levocetirizine","Fexofenadine","Loratadine","Chlorpheniramine","Montelukast","Ambroxol","Bromhexine","Dextromethorphan","Salbutamol"],
  "Gastric and acidity medicines": ["Pantoprazole","Omeprazole","Rabeprazole","Esomeprazole","Famotidine","Ranitidine","Domperidone","Ondansetron","Sucralfate","Simethicone"],
  "Diabetes medicines": ["Metformin","Glimepiride","Gliclazide","Sitagliptin","Vildagliptin","Teneligliptin","Empagliflozin","Dapagliflozin","Pioglitazone","Insulin Glargine"],
  "Blood pressure and heart medicines": ["Amlodipine","Telmisartan","Losartan","Olmesartan","Ramipril","Enalapril","Atenolol","Metoprolol","Bisoprolol","Hydrochlorothiazide"],
  "Vitamins and supplements": ["Vitamin C","Vitamin D3","Vitamin B12","Vitamin B Complex","Folic Acid","Calcium Carbonate","Ferrous Sulphate","Zinc Sulphate","Multivitamin","Magnesium"],
  "Skin medicines": ["Clotrimazole","Terbinafine","Fluconazole","Mupirocin","Fusidic Acid","Betamethasone","Hydrocortisone","Permethrin","Adapalene","Benzoyl Peroxide"],
  "Other common medicines": ["Albendazole","Mebendazole","Loperamide","Lactulose","Bisacodyl","Metoclopramide","Levothyroxine","Carbimazole","Atorvastatin","Rosuvastatin"],
  "Other commonly used medicines": ["Clopidogrel","Warfarin","Furosemide","Spironolactone","Prednisolone","Dexamethasone","Gabapentin","Pregabalin","Fluoxetine","Sertraline"]
};
const catalog = document.querySelector('#medicine-catalog');
const categoryFilter = document.querySelector('#catalog-category');
const catalogSearch = document.querySelector('#catalog-search');
const deliveryItems = document.querySelector('#delivery-items');
const cartCount = document.querySelector('#cart-count');
const cartEmpty = document.querySelector('#cart-empty');
const customMedicine = document.querySelector('#custom-medicine');
const quickAddButton = document.querySelector('#quick-add-button');
const cart = new Map();
let revealObserver = null;
if (categoryFilter) {
  categoryFilter.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = ''; placeholder.textContent = 'Choose a category first'; placeholder.disabled = true; placeholder.selected = true;
  categoryFilter.append(placeholder);
  Object.entries(medicineCategories).forEach(([category, medicines]) => {
    const option = document.createElement('option'); option.value = category; option.textContent = `${category} (${medicines.length})`; categoryFilter.append(option);
  });
}
if (catalogSearch) { catalogSearch.disabled = true; catalogSearch.placeholder = 'Select a category to enable search…'; }
function addToCart(name) {
  const normalized = name.trim(); if (!normalized) return;
  const existing = cart.get(normalized.toLowerCase());
  if (existing) existing.quantity += 1;
  else cart.set(normalized.toLowerCase(), {name: normalized, quantity: 1});
  renderCart();
  const addBtn = [...document.querySelectorAll('.catalog-add-btn')].find(btn => btn.dataset.medicine?.toLowerCase() === normalized.toLowerCase());
  if (addBtn) { addBtn.classList.add('just-added'); addBtn.textContent = 'Added ✓'; setTimeout(() => { if (addBtn.isConnected) {addBtn.classList.remove('just-added'); addBtn.textContent = 'Add +';}}, 900); }
}
function renderCart() {
  if (!deliveryItems) return;
  deliveryItems.querySelectorAll('.cart-item').forEach(el => el.remove());
  const list = [...cart.values()];
  if (cartEmpty) cartEmpty.style.display = list.length ? 'none' : 'flex';
  if (cartCount) cartCount.textContent = String(list.reduce((sum, item) => sum + item.quantity, 0));
  list.forEach(item => {
    const row = document.createElement('div'); row.className = 'cart-item';
    const details = document.createElement('div'); details.className = 'cart-item-details';
    const name = document.createElement('b'); name.textContent = item.name;
    const sub = document.createElement('small'); sub.textContent = 'Stock & prescription to be confirmed'; details.append(name, sub);
    const qtyWrap = document.createElement('div'); qtyWrap.className = 'cart-qty-control';
    const minus = document.createElement('button'); minus.type = 'button'; minus.className = 'qty-step'; minus.textContent = '−'; minus.setAttribute('aria-label', `Decrease ${item.name} quantity`);
    const qty = document.createElement('span'); qty.textContent = String(item.quantity); qty.className = 'qty-value';
    const plus = document.createElement('button'); plus.type = 'button'; plus.className = 'qty-step'; plus.textContent = '+'; plus.setAttribute('aria-label', `Increase ${item.name} quantity`);
    minus.addEventListener('click', () => { if(item.quantity <= 1) cart.delete(item.name.toLowerCase()); else item.quantity--; renderCart(); });
    plus.addEventListener('click', () => { item.quantity++; renderCart(); });
    qtyWrap.append(minus,qty,plus);
    const remove = document.createElement('button'); remove.type='button'; remove.className='cart-remove'; remove.textContent='Remove'; remove.addEventListener('click',()=>{cart.delete(item.name.toLowerCase());renderCart();});
    row.append(details,qtyWrap,remove); deliveryItems.append(row);
  });
}
function renderCatalog() {
  if (!catalog) return;
  const term = (catalogSearch?.value || '').trim().toLowerCase();
  const selectedCategory = categoryFilter?.value || '';
  catalog.innerHTML = '';
  if (!selectedCategory) {
    if (catalogSearch) { catalogSearch.disabled = true; catalogSearch.placeholder = 'Select a category to enable search…'; }
    const welcome = document.createElement('div'); welcome.className = 'catalog-category-prompt';
    welcome.innerHTML = '<div class="catalog-prompt-icon">✚</div><h4>Choose a medicine category</h4><p>Start by selecting a category above. We’ll show only the medicines you’re looking for, keeping the list simple and easy to browse.</p><div class="catalog-prompt-chips"><span>10 categories</span><span>Search within category</span><span>Add to basket</span></div>';
    catalog.append(welcome);
    return;
  }
  if (catalogSearch) { catalogSearch.disabled = false; catalogSearch.placeholder = `Search ${selectedCategory.toLowerCase()}…`; }
  const medicines = medicineCategories[selectedCategory] || [];
  const filtered = medicines.filter(name => name.toLowerCase().includes(term));
  if (!filtered.length) {
    catalog.innerHTML = '<p class="catalog-empty">No medicines match your search in this category. Try another name or clear your search.</p>';
    return;
  }
  const group = document.createElement('div'); group.className = 'catalog-group catalog-group-modern catalog-category-results';
  const heading = document.createElement('h4'); heading.textContent = `${selectedCategory} · ${filtered.length} ${filtered.length === 1 ? 'medicine' : 'medicines'}`; group.append(heading);
  const list = document.createElement('div'); list.className = 'catalog-medicine-list';
  filtered.forEach((name, index) => {
    const item = document.createElement('div'); item.className = 'catalog-medicine-card'; item.style.setProperty('--medicine-index', index);
    const medIcon = document.createElement('span'); medIcon.className = 'medicine-card-icon'; medIcon.textContent = '✚';
    const text = document.createElement('span'); text.className = 'catalog-medicine-name'; text.textContent = name;
    const add = document.createElement('button'); add.type='button'; add.className='catalog-add-btn'; add.dataset.medicine=name; add.textContent='Add +'; add.setAttribute('aria-label',`Add ${name} to basket`);
    add.addEventListener('click',()=>addToCart(name));
    item.append(medIcon,text,add); list.append(item);
  });
  group.append(list); catalog.append(group);
}
catalogSearch?.addEventListener('input', renderCatalog);
categoryFilter?.addEventListener('change', () => { if (catalogSearch) catalogSearch.value = ''; renderCatalog(); });
renderCatalog(); renderCart();
quickAddButton?.addEventListener('click', () => { const name=customMedicine?.value.trim(); if(!name) {customMedicine?.focus();return;} addToCart(name); customMedicine.value=''; });
customMedicine?.addEventListener('keydown', e => {if(e.key==='Enter'){e.preventDefault();quickAddButton?.click();}});
document.querySelector('#delivery-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const items = [...cart.values()];
  if (!items.length) { catalog?.scrollIntoView({behavior:'smooth',block:'center'}); return; }
  const name = document.querySelector('#delivery-name').value.trim();
  const phone = document.querySelector('#delivery-phone').value.trim();
  const address = document.querySelector('#delivery-address').value.trim();
  const extra = document.querySelector('#delivery-extra').value.trim();
  let message = `Hello Patel Medical Store,\n\nI'd like to request medicine home delivery (please confirm availability).\n\nMedicines:\n${items.map((item,i)=>`${i+1}. ${item.name} — Quantity: ${item.quantity}`).join('\n')}\n\nName: ${name}\nPhone: ${phone}\nDelivery address: ${address}`;
  if (extra) message += `\nNote: ${extra}`;
  message += `\n\nPlease confirm stock, prescription requirements, delivery availability and charges. This is a request only.`;
  window.open(wa(message), '_blank', 'noopener,noreferrer');
});

// Premium scroll reveal + scroll progress indicator
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setupMotion() {
  if (reduceMotion) return;
  document.body.classList.add('motion-ready');
  const revealTargets = [
    '.section-heading', '.service-feature', '.pharmacy-copy', '.enquiry-panel',
    '.physio-heading', '.physio-photo', '.physio-services', '.team-card',
    '.why-grid > div', '.appointment-copy', '.appointment-form-panel',
    '.location-info', '.map-card', '.faq-grid > div'
  ].flatMap(selector => [...document.querySelectorAll(selector)]);
  revealTargets.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${(index % 3) * 100}ms`);
  });
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));
}
setupMotion();
const progressBar = document.querySelector('.scroll-progress span');
let scrollTicking = false;
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
  if (progressBar && !reduceMotion) progressBar.style.transform = `scaleX(${percent})`;
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
updateProgress();

// Extra polish: gentle card tilt on desktop pointer movement and staggered micro-reveals.
if (!reduceMotion && window.matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.service-feature,.team-card,.catalog-panel,.delivery-form-panel,.map-card').forEach(card => {
    card.addEventListener('pointermove', e => { const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5; card.style.setProperty('--tilt-x',`${-y*2.2}deg`); card.style.setProperty('--tilt-y',`${x*2.2}deg`); card.classList.add('pointer-tilt'); });
    card.addEventListener('pointerleave',()=>{card.classList.remove('pointer-tilt'); card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');});
  });
}
