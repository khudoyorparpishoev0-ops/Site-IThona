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
    // тап по затемнённой области закрывает меню
    document.addEventListener('click', (e) => {
      if(nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)){
        nav.classList.remove('open');
      }
    });
  }

  // "Отправить ещё одну" — вернуть форму вместо панели успеха
  document.querySelectorAll('.form-again').forEach(b => {
    b.addEventListener('click', () => {
      const wrap = b.closest('.ed-form-wrap');
      if(!wrap) return;
      wrap.querySelector('.form-done').hidden = true;
      wrap.querySelector('form').hidden = false;
    });
  });

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
      const labelSending = (dict && dict.form_sending) || 'Отправляем…';
      const textError = (dict && dict.form_error) || 'Не удалось отправить заявку. Попробуйте ещё раз.';

      if(!btn || btn.disabled) return; // отправка уже идёт — второй раз не запускаем

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

      // строка ошибки — создаём один раз, держим прямо над кнопкой
      let errBox = form.querySelector('.form-err');
      if(!errBox){
        errBox = document.createElement('div');
        errBox.className = 'form-err';
        errBox.setAttribute('role', 'alert');
        btn.parentNode.insertBefore(errBox, btn);
      }
      errBox.hidden = true;

      // на время отправки кнопка заблокирована и показывает «Отправляем…»
      const setBusy = (busy) => {
        btn.disabled = busy;
        btn.textContent = busy ? labelSending : labelIdle;
      };

      // ошибка: форма остаётся открытой, лимит сбрасываем — чтобы можно было повторить сразу
      const fail = () => {
        localStorage.removeItem('ith_last_send');
        errBox.textContent = textError;
        errBox.hidden = false;
        setBusy(false);
      };

      const done = () => {
        // если рядом есть панель успеха (новый дизайн) — показываем её вместо формы
        const wrap = form.closest('.ed-form-wrap');
        const donePanel = wrap && wrap.querySelector('.form-done');
        form.reset();
        setBusy(false);
        if(donePanel){
          form.hidden = true;
          donePanel.hidden = false;
          return;
        }
        btn.textContent = labelSent;
        btn.style.background = '#0f7d3b';
        setTimeout(()=>{ btn.textContent = labelIdle; btn.style.background=''; }, 3500);
      };

      // текст заявки (для WhatsApp / резервного канала)
      const lines = ['IT-HONA — заявка с сайта', 'Имя: ' + name, 'Контакт: ' + contact];
      if(email)   lines.push('Email: ' + email);
      if(message) lines.push('Сообщение: ' + message);
      const text = lines.join('\n');

      if(CT.formEndpoint){
        // ждём подтверждения от сервера; «Заявка отправлена» — только при успехе
        setBusy(true);
        try{
          const res = await fetch(CT.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, contact, email, message, page: location.pathname })
          });
          let ok = res.ok;
          // если сервер ответил JSON — верим его вердикту (в т.ч. по доставке SMS)
          if(ok){
            try{
              const data = await res.clone().json();
              if(data && (data.ok === false || data.success === false || data.error)) ok = false;
            }catch(_){ /* ответ не JSON — ориентируемся на HTTP-статус */ }
          }
          if(ok) done(); else fail();
        }catch(_){
          fail(); // сеть недоступна или запрос не дошёл
        }
        return;
      }

      // endpoint не задан: единственный канал доставки — WhatsApp с автозаполнением
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
