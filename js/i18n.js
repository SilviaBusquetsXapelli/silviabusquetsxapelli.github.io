(function(){
  const MAIN=[['en','EN'],['es','ES'],['ca','CA'],['fr','FR']];
  const MORE=[['','🌐 More languages'],['de','Deutsch'],['it','Italiano'],['pt','Português'],['nl','Nederlands'],['pl','Polski'],['ja','日本語'],['ko','한국어'],['zh-CN','中文'],['sv','Svenska'],['da','Dansk'],['el','Ελληνικά']];
  function current(){const m=document.cookie.match(/(?:^|; )googtrans=\/en\/([^;]+)/);return m?decodeURIComponent(m[1]):'en'}
  function setLang(code){
    if(!code)return;
    const val=code==='en'?'/en/en':'/en/'+code;
    document.cookie='googtrans='+val+';path=/;SameSite=Lax';
    try{localStorage.setItem('sb_lang',code)}catch(e){}
    location.reload();
  }
  function build(){
    if(document.querySelector('.language-switcher'))return;
    const box=document.createElement('div'); box.className='language-switcher notranslate'; box.setAttribute('translate','no'); box.setAttribute('aria-label','Language selector');
    const cur=current();
    MAIN.forEach(([code,label])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.className='lang-btn'+(cur===code?' active':'');b.onclick=()=>setLang(code);box.appendChild(b)});
    const sel=document.createElement('select');sel.className='lang-more';sel.setAttribute('aria-label','More languages');
    MORE.forEach(([code,label])=>{const o=document.createElement('option');o.value=code;o.textContent=label;if(cur===code)o.selected=true;sel.appendChild(o)});sel.onchange=()=>setLang(sel.value);box.appendChild(sel);
    const nav=document.querySelector('.nav-wrap'); const menu=nav&&nav.querySelector('.menu');
    if(nav){ if(menu)nav.insertBefore(box,menu); else nav.appendChild(box); } else document.body.insertBefore(box,document.body.firstChild);
    const gt=document.createElement('div');gt.id='google_translate_element';gt.className='gt-hidden';document.body.appendChild(gt);
  }
  window.googleTranslateElementInit=function(){
    try{new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'ca,da,de,el,en,es,fr,it,ja,ko,nl,pl,pt,sv,zh-CN',autoDisplay:false},'google_translate_element')}catch(e){}
  };
  function load(){
    build();
    const s=document.createElement('script');s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';s.async=true;document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
})();
