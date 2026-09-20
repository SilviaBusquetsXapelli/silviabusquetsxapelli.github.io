const menu = document.querySelector('.menu');
const links = document.querySelector('.navlinks');
if(menu && links){
  menu.addEventListener('click', ()=>{
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
}

document.querySelectorAll('.dropdown-trigger').forEach(trigger=>{
  trigger.addEventListener('click', e=>{
    e.stopPropagation();
    const item=trigger.closest('.has-dropdown');
    const open=item.classList.toggle('open');
    trigger.setAttribute('aria-expanded',open?'true':'false');
  });
});
document.addEventListener('click',()=>document.querySelectorAll('.has-dropdown.open').forEach(item=>{item.classList.remove('open');item.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded','false')}));

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

// v7 header refinement
const siteHeader = document.querySelector('.site-header');
const syncHeader = () => siteHeader?.classList.toggle('scrolled', window.scrollY > 12);
syncHeader(); window.addEventListener('scroll', syncHeader, {passive:true});

// v8 restrained reveal motion
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const revealTargets = document.querySelectorAll('.work-card,.topic,.resource-card,.series-v8 article,.book-index>div,.about-copy,.profile-photo,.catalogue-empty');
  revealTargets.forEach(el=>el.classList.add('reveal'));
  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
  }),{threshold:.12,rootMargin:'0px 0px -30px 0px'});
  revealTargets.forEach(el=>observer.observe(el));
}


// v9 Insights filters
const insightFilters=[...document.querySelectorAll('.insight-filter')];
const insightRows=[...document.querySelectorAll('.insight-row')];
insightFilters.forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.insightFilter||'all';
  insightFilters.forEach(b=>{const on=b===button;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')});
  insightRows.forEach(row=>{const cats=(row.dataset.insightCategory||'').split(/\s+/);row.hidden=filter!=='all'&&!cats.includes(filter)});
}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links?.classList.contains('open')){links.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.focus()}});
