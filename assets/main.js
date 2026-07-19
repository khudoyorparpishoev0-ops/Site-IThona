// IT-HONA — interactions
(function(){
  const header = document.querySelector('.header');
  if(header){
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  // mobile menu
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if(burger && nav){
    burger.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>nav.classList.remove('open')));
  }

  // reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // animated counters
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animate = (el)=>{
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if(reduceMotion){ el.textContent = (target % 1 ? target.toFixed(1) : target) + suffix; return; }
    const dur = 1400; const start = performance.now();
    const step = (t)=>{
      const p = Math.min((t-start)/dur,1);
      const eased = 1-Math.pow(1-p,3);
      const val = target % 1 ? (target*eased).toFixed(1) : Math.round(target*eased);
      el.textContent = val + suffix;
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ animate(e.target); cio.unobserve(e.target);} });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

  // ---- Формы-заявки (главная и «Контакты») ----
  // Реальная отправка: POST на CONTACTS.formEndpoint (если задан),
  // иначе — открытие WhatsApp с автозаполнением (доставка гарантирована).
  const val = (f, n) => { const el = f.elements[n]; return el ? el.value.trim() : ''; };

  // защита от повторной отправки (общий лимит с виджетом): 1 раз в 20 сек
  function rateOk(){
    const last = +localStorage.getItem('ith_last_send') || 0;
    if(Date.now() - last < 20000) return false;
    localStorage.setItem('ith_last_send', Date.now());
    return true;
  }

  document.querySelectorAll('form.appeal').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dict = (window.I18N && window.getLang) ? (I18N[getLang()] || I18N.ru) : null;
      const btn = form.querySelector('button[type="submit"]');
      const labelIdle = (dict && dict.form_submit) || 'Отправить заявку';
      const labelSent = (dict && dict.form_sent) || 'Заявка отправлена ✓';

      // honeypot
      if(form.elements['website'] && form.elements['website'].value) return;

      // сбор полей (у форм разный набор — читаем всё, что есть)
      const name    = val(form, 'name');
      const contact = val(form, 'phone') || val(form, 'contact');
      const email   = val(form, 'email');
      const message = val(form, 'message');

      if(!name || !contact){
        form.reportValidity && form.reportValidity();
        return;
      }
      if(!rateOk()) return;

      const CT = window.CONTACTS || {};
      const done = () => {
        btn.textContent = labelSent;
        btn.style.background = '#0f7d3b';
        form.reset();
        setTimeout(()=>{ btn.textContent = labelIdle; btn.style.background=''; }, 3500);
      };

      // текст заявки (для WhatsApp / резервного канала)
      const lines = ['IT-HONA — заявка с сайта', 'Имя: ' + name, 'Контакт: ' + contact];
      if(email)   lines.push('Email: ' + email);
      if(message) lines.push('Сообщение: ' + message);
      const text = lines.join('\n');

      if(CT.formEndpoint){
        // отправка на backend/Formspree — заявка приходит на почту без открытия WhatsApp
        btn.disabled = true;
        try{
          const res = await fetch(CT.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, contact, email, message, page: location.pathname })
          });
          btn.disabled = false;
          if(res.ok){ done(); return; }
        }catch(_){ btn.disabled = false; }
        // если endpoint недоступен — не теряем заявку, уводим в WhatsApp
      }

      // резерв (или основной путь без endpoint): WhatsApp с автозаполнением
      if(CT.whatsapp){
        window.open('https://wa.me/' + CT.whatsapp + '?text=' + encodeURIComponent(text), '_blank');
      }
      done();
    });
  });
})();

// footer accordion (mobile) — toggle only under 680px
(function(){
  const cols = document.querySelectorAll('.footer .f-col');
  cols.forEach(col=>{
    const h = col.querySelector('h4');
    if(!h) return;
    // добавить значок-переключатель
    if(!h.querySelector('.f-toggle')){
      const t = document.createElement('span'); t.className='f-toggle'; t.textContent='+';
      h.appendChild(t);
    }
    h.addEventListener('click', ()=>{
      if(window.innerWidth>680) return; // только мобильные
      col.classList.toggle('open');
    });
  });
})();
