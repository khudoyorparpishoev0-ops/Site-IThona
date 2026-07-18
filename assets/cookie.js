/* IT-HONA — cookie banner (зависит от i18n.js) */
(function(){
  if(localStorage.getItem('ith_cookie')) return;

  const el = document.createElement('div');
  el.className = 'cookie';
  el.setAttribute('role','region');
  el.setAttribute('aria-label','Cookie');
  el.innerHTML = `
    <p><span data-i18n="cookie_text">Мы используем файлы cookie, чтобы сайт работал корректно и удобно. Продолжая пользоваться сайтом, вы соглашаетесь с этим.</span></p>
    <div class="cookie-actions">
      <button class="btn btn-primary cookie-ok" data-i18n="cookie_ok">Понятно</button>
    </div>`;
  document.body.appendChild(el);

  // перевести сразу под текущий язык
  if(window.applyLang && window.getLang) applyLang(getLang());

  setTimeout(()=> el.classList.add('show'), 800);

  el.querySelector('.cookie-ok').addEventListener('click', ()=>{
    localStorage.setItem('ith_cookie','1');
    el.classList.remove('show');
    setTimeout(()=> el.remove(), 400);
  });
})();
