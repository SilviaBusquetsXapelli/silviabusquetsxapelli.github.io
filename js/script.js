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

// v10 Learn: filters, progress and reusable activities
const LEARN_PROGRESS_KEY = 'silviaLearnCompleted';
function getCompletedLessons(){
  try { return JSON.parse(localStorage.getItem(LEARN_PROGRESS_KEY) || '[]'); }
  catch(e){ return []; }
}
function setCompletedLessons(items){
  try { localStorage.setItem(LEARN_PROGRESS_KEY, JSON.stringify([...new Set(items)])); }
  catch(e){}
}
function syncLearnProgress(){
  const completed = getCompletedLessons();
  const cards = [...document.querySelectorAll('[data-learn-card]')];
  cards.forEach(card => {
    const done = completed.includes(card.dataset.lessonId);
    card.classList.toggle('completed', done);
    const status = card.querySelector('.lesson-status');
    if(status) status.textContent = done ? 'Completed ✓' : 'Start →';
  });
  const count = document.querySelector('#progress-count');
  const total = document.querySelector('#progress-total');
  const bar = document.querySelector('#progress-bar');
  const coreTotal = cards.length || Number(total?.textContent || 0) || 0;
  const visibleCompleted = cards.length ? cards.filter(c => completed.includes(c.dataset.lessonId)).length : completed.length;
  if(count) count.textContent = String(visibleCompleted);
  if(total && cards.length) total.textContent = String(coreTotal);
  if(bar) bar.style.width = coreTotal ? `${Math.min(100,(visibleCompleted/coreTotal)*100)}%` : '0%';

  const lessonId = document.body?.dataset.lesson;
  const button = document.querySelector('.mark-complete');
  if(lessonId && button){
    const done = completed.includes(lessonId);
    button.classList.toggle('is-complete', done);
    button.textContent = done ? (button.dataset.completeLabel || 'Completed ✓') : 'Mark as completed';
  }
}
syncLearnProgress();

document.querySelector('.mark-complete')?.addEventListener('click', () => {
  const lessonId = document.body.dataset.lesson;
  if(!lessonId) return;
  const completed = getCompletedLessons();
  const index = completed.indexOf(lessonId);
  if(index >= 0) completed.splice(index,1); else completed.push(lessonId);
  setCompletedLessons(completed);
  syncLearnProgress();
});

// Share the current lesson using the device share sheet when available.
// On browsers without Web Share, copy the canonical lesson URL instead.
document.querySelector('.share-lesson')?.addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
  const title = document.querySelector('h1')?.textContent?.trim() || document.title;
  const shareData = {
    title,
    text: `Explore ${title} on Silvia Busquets Xapellí Learn`,
    url: canonical
  };

  if(navigator.share){
    try {
      await navigator.share(shareData);
      return;
    } catch(error){
      if(error?.name === 'AbortError') return;
    }
  }

  let copied = false;
  try {
    await navigator.clipboard.writeText(canonical);
    copied = true;
  } catch(error){
    const input = document.createElement('textarea');
    input.value = canonical;
    input.setAttribute('readonly','');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    copied = document.execCommand('copy');
    input.remove();
  }

  if(copied){
    const original = button.textContent;
    button.textContent = 'Link copied ✓';
    button.classList.add('share-confirmed');
    window.setTimeout(() => {
      button.textContent = original;
      button.classList.remove('share-confirmed');
    }, 1800);
  }
});

document.querySelector('.print-lesson')?.addEventListener('click', () => window.print());

// Learn search + category filters
const learnSearch = document.querySelector('#learn-search');
const learnFilters = [...document.querySelectorAll('[data-learn-filter]')];
const learnCards = [...document.querySelectorAll('[data-learn-card]')];
let learnActiveFilter = 'all';
function updateLearnLibrary(){
  if(!learnCards.length) return;
  const q = (learnSearch?.value || '').trim().toLowerCase();
  let visible = 0;
  learnCards.forEach(card => {
    const cats = (card.dataset.category || '').toLowerCase().split(/\s+/);
    const haystack = `${card.dataset.search || ''} ${card.textContent || ''}`.toLowerCase();
    const show = (learnActiveFilter === 'all' || cats.includes(learnActiveFilter)) && (!q || haystack.includes(q));
    card.hidden = !show;
    if(show) visible++;
  });
  const empty = document.querySelector('#learn-no-results');
  if(empty) empty.hidden = visible !== 0;
}
learnSearch?.addEventListener('input', updateLearnLibrary);
learnFilters.forEach(btn => btn.addEventListener('click', () => {
  learnActiveFilter = btn.dataset.learnFilter || 'all';
  learnFilters.forEach(b => {
    const on = b === btn;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  updateLearnLibrary();
}));

// Multiple-choice questions
document.querySelectorAll('.quiz-question').forEach(question => {
  const buttons = [...question.querySelectorAll('.quiz-options button')];
  const feedback = question.querySelector('.quiz-feedback');
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('correct','wrong'));
    const correct = button.dataset.correct === 'true';
    button.classList.add(correct ? 'correct' : 'wrong');
    if(!correct){ buttons.find(b => b.dataset.correct === 'true')?.classList.add('correct'); }
    if(feedback){
      feedback.textContent = correct ? 'Correct — keep the reasoning, not just the answer.' : 'Not quite. Compare the highlighted answer and explain why it fits.';
      feedback.classList.toggle('good', correct);
      feedback.classList.toggle('bad', !correct);
    }
  }));
});

// Matching activities
document.querySelectorAll('[data-matching]').forEach(activity => {
  activity.querySelector('.check-matching')?.addEventListener('click', () => {
    const selects = [...activity.querySelectorAll('select[data-answer]')];
    let score = 0;
    selects.forEach(select => {
      const correct = select.value === select.dataset.answer;
      if(correct) score++;
      select.style.borderColor = correct ? '#86a88f' : '#c7838b';
    });
    const feedback = activity.querySelector('.activity-feedback');
    if(feedback){
      const all = score === selects.length;
      feedback.textContent = all ? `All ${score} matches are correct.` : `${score} of ${selects.length} correct — review the roles and try again.`;
      feedback.classList.toggle('good', all);
      feedback.classList.toggle('bad', !all);
    }
  });
});

// Ordering activities
document.querySelectorAll('[data-order-activity]').forEach(activity => {
  const list = activity.querySelector('ul');
  activity.addEventListener('click', e => {
    const button = e.target.closest('.order-up,.order-down');
    if(!button || !list) return;
    const item = button.closest('li');
    if(button.classList.contains('order-up') && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
    if(button.classList.contains('order-down') && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
  });
  activity.querySelector('.check-order')?.addEventListener('click', () => {
    const current = [...list.querySelectorAll('li')].map(li => li.dataset.orderId).join(',');
    const correct = current === activity.dataset.correctOrder;
    const feedback = activity.querySelector('.activity-feedback');
    if(feedback){
      feedback.textContent = correct ? 'Correct — you have the core sequence.' : 'Not yet. Think: proposal → examination → agreement → adoption.';
      feedback.classList.toggle('good', correct);
      feedback.classList.toggle('bad', !correct);
    }
  });
});

// Scenario cards
document.querySelectorAll('.scenario-option').forEach(option => option.addEventListener('click', () => {
  const section = option.closest('.lesson-section');
  const feedback = section?.querySelector('.scenario-feedback');
  if(feedback) feedback.textContent = option.dataset.feedback || '';
}));

// Reveal answer frameworks
document.querySelectorAll('.reveal-answer').forEach(button => button.addEventListener('click', () => {
  const content = button.parentElement?.querySelector('.reveal-content');
  if(!content) return;
  const opening = content.hidden;
  content.hidden = !opening;
  button.textContent = opening ? 'Hide answer structure' : 'Reveal answer structure';
}));

// Inflation lab
document.querySelectorAll('[data-inflation-lab]').forEach(lab => {
  const start = lab.querySelector('[data-start]');
  const rate = lab.querySelector('[data-rate]');
  const years = lab.querySelector('[data-years]');
  const render = () => {
    const s = Number(start.value), r = Number(rate.value)/100, y = Number(years.value);
    lab.querySelector('[data-start-value]').textContent = s.toFixed(0);
    lab.querySelector('[data-rate-value]').textContent = Number(rate.value).toFixed(Number(rate.value)%1 ? 1 : 0);
    lab.querySelector('[data-years-value]').textContent = y.toFixed(0);
    lab.querySelector('[data-future-value]').textContent = (s*Math.pow(1+r,y)).toFixed(2);
  };
  [start,rate,years].forEach(input => input?.addEventListener('input',render));
  render();
});

// Fixed-rate bond price lab
document.querySelectorAll('[data-bond-lab]').forEach(lab => {
  const input = lab.querySelector('[data-yield]');
  const render = () => {
    const face = Number(lab.dataset.face || 100);
    const couponRate = Number(lab.dataset.coupon || 3)/100;
    const years = Number(lab.dataset.years || 5);
    const y = Number(input.value)/100;
    const coupon = face*couponRate;
    let price = 0;
    for(let t=1;t<=years;t++) price += coupon/Math.pow(1+y,t);
    price += face/Math.pow(1+y,years);
    lab.querySelector('[data-yield-value]').textContent = Number(input.value).toFixed(2).replace(/0$/,'').replace(/\.0$/,'');
    lab.querySelector('[data-bond-price]').textContent = price.toFixed(2);
  };
  input?.addEventListener('input',render);
  render();
});

// Books: filter by type, age, or Learning Hub relationship.
(() => {
  const cards=[...document.querySelectorAll('[data-book-tags]')];
  const buttons=[...document.querySelectorAll('.book-filter[data-filter]')];
  if(!cards.length || !buttons.length) return;
  const title=document.querySelector('#book-results-title');
  const count=document.querySelector('#book-count');
  const names={all:'All books',hub:'Learning Hub books',educational:'Learning & educational',colouring:'Colouring & creative',puzzles:'Puzzles & brain games',journals:'Journals & planning',kids:'Books for kids',teens:'Books for teens',adults:'Books for adults',seniors:'Books for seniors'};
  const apply=(filter, scroll=false)=>{
    let visible=0;
    cards.forEach(card=>{const show=filter==='all'||card.dataset.bookTags.split(/\s+/).includes(filter);card.classList.toggle('is-hidden',!show);if(show)visible++;});
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
    if(title) title.textContent=names[filter]||'Books';
    if(count) count.textContent=`${visible} ${visible===1?'title':'titles'}`;
    const u=new URL(location.href); if(filter==='all')u.searchParams.delete('filter');else u.searchParams.set('filter',filter); history.replaceState(null,'',u);
    if(scroll) document.querySelector('.book-results-head')?.scrollIntoView({behavior:'smooth',block:'start'});
  };
  buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.filter,true)));
  const requested=new URLSearchParams(location.search).get('filter');
  apply(names[requested]?requested:'all');
})();
