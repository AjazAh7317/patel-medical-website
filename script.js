// Edit this number to change the WhatsApp recipient (digits only, country code included).
const WHATSAPP_NUMBER = "916388609639";
const PHONE_PRIMARY = "+916388609639";
const PHONE_SECONDARY = "+919695647060";
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

// Starter medicine catalogue and home-delivery enquiry.
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
const deliveryMedicine = document.querySelector('#delivery-medicine');
let revealObserver = null;
Object.entries(medicineCategories).forEach(([category, medicines]) => {
  const categoryOption = document.createElement('option'); categoryOption.value = category; categoryOption.textContent = category; categoryFilter?.append(categoryOption);
  medicines.forEach(name => { const option = document.createElement('option'); option.value = name; option.textContent = name; deliveryMedicine?.append(option); });
});
function renderCatalog() {
  if (!catalog) return;
  const term = (catalogSearch?.value || '').trim().toLowerCase();
  const selectedCategory = categoryFilter?.value || 'all';
  catalog.innerHTML = '';
  let shown = 0;
  Object.entries(medicineCategories).forEach(([category, medicines]) => {
    if (selectedCategory !== 'all' && selectedCategory !== category) return;
    const filtered = medicines.filter(name => name.toLowerCase().includes(term));
    if (!filtered.length) return;
    const group = document.createElement('div'); group.className = 'catalog-group reveal';
    const heading = document.createElement('h4'); heading.textContent = category; group.append(heading);
    const list = document.createElement('div'); list.className = 'catalog-pills';
    filtered.forEach((name, index) => {
      const pill = document.createElement('button'); pill.type='button'; pill.className='medicine-pill'; pill.style.setProperty('--pill-index', index); pill.textContent=name;
      pill.addEventListener('click', () => { if (deliveryMedicine) deliveryMedicine.value=name; document.querySelector('#delivery')?.scrollIntoView({behavior:'smooth'}); });
      list.append(pill); shown++;
    });
    group.append(list); catalog.append(group);
  });
  if (!shown) catalog.innerHTML = '<p class="catalog-empty">No matching medicine found in this list.</p>';
  catalog.querySelectorAll('.reveal').forEach(el => revealObserver?.observe(el));
}
catalogSearch?.addEventListener('input', renderCatalog);
categoryFilter?.addEventListener('change', renderCatalog);
renderCatalog();
document.querySelector('#delivery-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const medicine = deliveryMedicine.value;
  const qty = document.querySelector('#delivery-qty').value.trim();
  const name = document.querySelector('#delivery-name').value.trim();
  const phone = document.querySelector('#delivery-phone').value.trim();
  const address = document.querySelector('#delivery-address').value.trim();
  const extra = document.querySelector('#delivery-extra').value.trim();
  let message = `Hello Patel Medical Store,\n\nI'd like to request medicine home delivery (please confirm availability).\nMedicine: ${medicine}\nQuantity/pack: ${qty}\nName: ${name}\nPhone: ${phone}\nDelivery address: ${address}`;
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
