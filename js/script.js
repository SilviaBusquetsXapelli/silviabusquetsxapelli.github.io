const menu = document.querySelector('.menu');
const links = document.querySelector('.navlinks');
if(menu && links){
  menu.addEventListener('click', ()=>links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
}

const searchInput = document.querySelector('#explainer-search');
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const explainerItems = [...document.querySelectorAll('.explainer-item')];
const seriesSections = [...document.querySelectorAll('[data-series]')];
const noResults = document.querySelector('#no-results');
let activeFilter = 'all';

function updateExplainers(){
  if(!explainerItems.length) return;
  const query = (searchInput?.value || '').trim().toLowerCase();
  let totalVisible = 0;

  explainerItems.forEach(item => {
    const categories = (item.dataset.category || '').toLowerCase().split(/\s+/);
    const haystack = `${item.dataset.search || ''} ${item.textContent || ''}`.toLowerCase();
    const categoryMatch = activeFilter === 'all' || categories.includes(activeFilter);
    const searchMatch = !query || haystack.includes(query);
    const show = categoryMatch && searchMatch;
    item.hidden = !show;
    if(show) totalVisible += 1;
  });

  seriesSections.forEach(section => {
    const visibleInSeries = [...section.querySelectorAll('.explainer-item')].some(item => !item.hidden);
    section.hidden = !visibleInSeries;
  });

  if(noResults) noResults.hidden = totalVisible !== 0;
}

if(searchInput){
  searchInput.addEventListener('input', updateExplainers);
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    filterButtons.forEach(btn => {
      const active = btn === button;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    updateExplainers();
  });
});


// v5.9 inline PDF preview
document.querySelectorAll('.preview-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.resource-card');
    const preview = card?.nextElementSibling;
    if(!preview || !preview.classList.contains('pdf-preview')) return;
    const frame = preview.querySelector('iframe');
    if(frame && !frame.src) frame.src = button.dataset.pdf;
    preview.hidden = false;
    button.setAttribute('aria-expanded','true');
    preview.scrollIntoView({behavior:'smooth', block:'start'});
  });
});
document.querySelectorAll('.preview-close').forEach(button => {
  button.addEventListener('click', () => {
    const preview = button.closest('.pdf-preview');
    if(!preview) return;
    preview.hidden = true;
    const toggle = preview.previousElementSibling?.querySelector('.preview-toggle');
    if(toggle){ toggle.setAttribute('aria-expanded','false'); toggle.focus(); }
  });
});
