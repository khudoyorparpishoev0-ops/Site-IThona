/* ============================================================
   IT-HONA — Плавающая панель «Связаться с менеджером»
   Зависит от i18n.js (CONTACTS, I18N, getLang)
   ============================================================ */
(function(){
  function statusKey(){
    const w = CONTACTS.workHours, now = new Date();
    const day = now.getDay(), h = now.getHours();
    const isWork = w.workDays.includes(day) && h>=w.startHour && h<w.endHour;
    if(isWork) return 'status_online';
    if(w.workDays.includes(day)) return 'status_day';
    return 'status_closed';
  }

  const svg = {
    chat:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z"/></svg>',
    wa:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z"/></svg>',
    tg:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3L2 11l6 2 2 6 3-4 5 4z"/></svg>',
    call:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    write:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
    callback:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 1.7l.6 3a2 2 0 0 1-.6 1.9L9.5 11a14 14 0 0 0 6 6l1.4-1.6a2 2 0 0 1 1.9-.6l3 .6a2 2 0 0 1 1.7 2V20a2 2 0 0 1-2 2A17 17 0 0 1 3 5z"/><path d="M15 3l6 6M21 3l-6 6"/></svg>',
    arrow:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',
    close:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>'
  };

  // ---- разметка ----
  const root = document.createElement('div');
  root.className = 'ith-widget';
  root.innerHTML = `
    <button class="ith-fab" aria-haspopup="dialog" aria-expanded="false" data-i18n-aria="widget_btn">
      ${svg.chat}<span class="ith-fab-txt" data-i18n="widget_btn">Связаться с менеджером</span>
    </button>
    <div class="ith-backdrop" hidden></div>
    <div class="ith-panel" role="dialog" aria-modal="true" aria-labelledby="ithTitle" hidden>
      <div class="ith-head">
        <div>
          <div class="ith-title" id="ithTitle" data-i18n="widget_title">Связаться с менеджером</div>
          <div class="ith-status"><span class="ith-dot"></span><span class="ith-status-txt" data-i18n="status_day"></span></div>
        </div>
        <button class="ith-close" data-i18n-aria="close" aria-label="Закрыть">${svg.close}</button>
      </div>
      <div class="ith-sub" data-i18n="widget_sub"></div>
      <div class="ith-body"></div>
    </div>`;
  document.body.appendChild(root);

  const fab = root.querySelector('.ith-fab');
  const panel = root.querySelector('.ith-panel');
  const backdrop = root.querySelector('.ith-backdrop');
  const body = root.querySelector('.ith-body');
  let lastFocus = null;

  function D(){ return I18N[getLang()] || I18N.ru; }

  // ---- экраны панели ----
  function optionRow(icon, key, onclick){
    const d = D();
    return `<button class="ith-opt" data-act="${key}">${icon}<span>${d[key]}</span>${svg.arrow.replace('d="M15 18l-6-6 6-6"','d="M9 18l6-6-6-6"')}</button>`;
  }

  function renderMenu(){
    const d = D();
    body.innerHTML = `
      <div class="ith-opts">
        ${optionRow(svg.wa,'opt_whatsapp')}
        ${optionRow(svg.tg,'opt_telegram')}
        ${optionRow(svg.call,'opt_call')}
      </div>`;
    body.querySelector('[data-act="opt_whatsapp"]').onclick = ()=> openWA();
    body.querySelector('[data-act="opt_telegram"]').onclick = ()=> openTG();
    body.querySelector('[data-act="opt_call"]').onclick = ()=> { location.href='tel:'+CONTACTS.phone; };
  }

  function backBtn(){ const d=D(); return `<button class="ith-back" type="button">${svg.arrow}<span>${d.back}</span></button>`; }

  function field(label, html){ return `<label class="ith-field"><span>${label}</span>${html}</label>`; }

  function renderForm(){
    const d = D();
    const services = d.services_list.map(s=>`<option>${s}</option>`).join('');
    body.innerHTML = `
      ${backBtn()}
      <form class="ith-form" novalidate>
        ${field(d.f_name+' *', `<input type="text" name="name" required>`)}
        ${field(d.f_company, `<input type="text" name="company">`)}
        ${field(d.f_phone+' *', `<input type="tel" name="phone" required placeholder="+992 __ ___ __ __">`)}
        ${field(d.f_email, `<input type="email" name="email">`)}
        ${field(d.f_service, `<select name="service"><option value="">${d.choose}</option>${services}</select>`)}
        ${field(d.f_message, `<textarea name="message" rows="3"></textarea>`)}
        ${field(d.f_method, `<select name="method"><option value="any">${d.method_any}</option><option value="wa">${d.method_wa}</option><option value="tg">${d.method_tg}</option><option value="call">${d.method_call}</option></select>`)}
        <input type="text" name="website" class="ith-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="ith-consent"><input type="checkbox" name="consent"> <span>${d.f_consent} *</span></label>
        <div class="ith-err" hidden></div>
        <button type="submit" class="ith-submit">${d.send_manager}</button>
      </form>`;
    body.querySelector('.ith-back').onclick = renderMenu;
    body.querySelector('.ith-form').onsubmit = (e)=> submitForm(e,'message');
  }

  function renderCallback(){
    const d = D();
    body.innerHTML = `
      ${backBtn()}
      <form class="ith-form" novalidate>
        ${field(d.f_name+' *', `<input type="text" name="name" required>`)}
        ${field(d.f_phone+' *', `<input type="tel" name="phone" required placeholder="+992 __ ___ __ __">`)}
        ${field(d.f_time, `<input type="text" name="time" placeholder="10:00–12:00">`)}
        ${field(d.f_topic, `<input type="text" name="topic">`)}
        <input type="text" name="website" class="ith-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="ith-consent"><input type="checkbox" name="consent"> <span>${d.f_consent} *</span></label>
        <div class="ith-err" hidden></div>
        <button type="submit" class="ith-submit">${d.send_callback}</button>
      </form>`;
    body.querySelector('.ith-back').onclick = renderMenu;
    body.querySelector('.ith-form').onsubmit = (e)=> submitForm(e,'callback');
  }

  // rate limit — не чаще 1 отправки в 20 секунд
  function rateOk(){
    const last = +localStorage.getItem('ith_last_send')||0;
    if(Date.now()-last < 20000) return false;
    localStorage.setItem('ith_last_send', Date.now());
    return true;
  }

  async function submitForm(e, kind){
    e.preventDefault();
    const d = D();
    const f = e.target;
    const err = f.querySelector('.ith-err');
    err.hidden = true;
    // honeypot
    if(f.website.value){ return; }
    // required
    const name = f.name.value.trim(), phone = f.phone.value.trim();
    if(!name || !phone){ err.textContent = d.required_err; err.hidden=false; return; }
    if(!f.consent.checked){ err.textContent = d.consent_err; err.hidden=false; return; }
    if(!rateOk()){ return; }

    // Структурированные данные заявки (для backend) + текст (для WhatsApp/Telegram)
    const payload = { kind: kind==='message' ? 'Заявка' : 'Обратный звонок', name, phone, page: location.pathname };
    let lines = [];
    if(kind==='message'){
      lines.push('IT-HONA — заявка');
      lines.push('Имя: '+name);
      if(f.company.value){ payload.company = f.company.value; lines.push('Компания: '+f.company.value); }
      lines.push('Телефон: '+phone);
      if(f.email.value){ payload.email = f.email.value; lines.push('Email: '+f.email.value); }
      if(f.service.value){ payload.service = f.service.value; lines.push('Услуга: '+f.service.value); }
      if(f.message.value){ payload.message = f.message.value; lines.push('Сообщение: '+f.message.value); }
      payload.method = f.method.options[f.method.selectedIndex].text;
      lines.push('Связь: '+payload.method);
    } else {
      lines.push('IT-HONA — обратный звонок');
      lines.push('Имя: '+name);
      lines.push('Телефон: '+phone);
      if(f.time.value){ payload.time = f.time.value; lines.push('Время: '+f.time.value); }
      if(f.topic.value){ payload.topic = f.topic.value; lines.push('Тема: '+f.topic.value); }
    }

    const success = () => {
      body.innerHTML = `<div class="ith-success">${svg.chat}<p>${d.form_sent}</p></div>`;
      setTimeout(()=>{ if(!panel.hidden) renderMenu(); }, 2500);
    };

    // 1) Если задан endpoint — отправляем на почту/backend без открытия мессенджера
    if(CONTACTS.formEndpoint){
      const btn = f.querySelector('.ith-submit'); if(btn) btn.disabled = true;
      try{
        const res = await fetch(CONTACTS.formEndpoint, {
          method:'POST',
          headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
          body: JSON.stringify(payload)
        });
        if(res.ok){ success(); return; }
      }catch(_){ /* endpoint недоступен — уходим в резервный канал */ }
      if(btn) btn.disabled = false;
    }

    // 2) Резерв (или основной путь без endpoint): WhatsApp/Telegram с автозаполнением
    const text = encodeURIComponent(lines.join('\n'));
    const method = kind==='message' ? f.method.value : 'any';
    if(method==='tg' && CONTACTS.telegram){ window.open(`https://t.me/${CONTACTS.telegram}?text=${text}`,'_blank'); }
    else { window.open(`https://wa.me/${CONTACTS.whatsapp}?text=${text}`,'_blank'); }
    success();
  }

  function openWA(){ window.open(`https://wa.me/${CONTACTS.whatsapp}`,'_blank'); }
  function openTG(){
    if(CONTACTS.telegram){ window.open(`https://t.me/${CONTACTS.telegram}`,'_blank'); }
    else { location.href='tel:'+CONTACTS.phone; }
  }

  // ---- открытие/закрытие ----
  function focusables(){ return panel.querySelectorAll('button,a,input,select,textarea,[tabindex]:not([tabindex="-1"])'); }
  function open(){
    lastFocus = document.activeElement;
    renderMenu();
    // статус
    panel.querySelector('.ith-status-txt').textContent = D()[statusKey()];
    panel.querySelector('.ith-dot').className = 'ith-dot '+(statusKey()==='status_online'?'on':'');
    backdrop.hidden=false; panel.hidden=false;
    requestAnimationFrame(()=>{ root.classList.add('open'); });
    fab.setAttribute('aria-expanded','true');
    const f = focusables(); if(f.length) f[0].focus();
    document.addEventListener('keydown', onKey);
  }
  function close(){
    root.classList.remove('open');
    fab.setAttribute('aria-expanded','false');
    document.removeEventListener('keydown', onKey);
    setTimeout(()=>{ panel.hidden=true; backdrop.hidden=true; }, 250);
    if(lastFocus) lastFocus.focus();
  }
  function onKey(e){
    if(e.key==='Escape'){ close(); return; }
    if(e.key==='Tab'){ // focus trap
      const f = Array.from(focusables()); if(!f.length) return;
      const first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  }

  fab.onclick = open;
  root.querySelector('.ith-close').onclick = close;
  backdrop.onclick = close;

  // свайп вниз для закрытия (мобильные)
  let sy=null;
  panel.addEventListener('touchstart', e=>{ sy=e.touches[0].clientY; }, {passive:true});
  panel.addEventListener('touchmove', e=>{
    if(sy===null) return;
    const dy = e.touches[0].clientY - sy;
    if(dy>0 && window.innerWidth<=680){ panel.style.transform=`translateY(${dy}px)`; }
  }, {passive:true});
  panel.addEventListener('touchend', e=>{
    if(sy===null) return;
    const dy = (e.changedTouches[0].clientY - sy);
    panel.style.transform='';
    if(dy>120 && window.innerWidth<=680) close();
    sy=null;
  });

  // лёгкая пульсация один раз при первом визите
  if(!localStorage.getItem('ith_seen')){
    root.classList.add('pulse');
    localStorage.setItem('ith_seen','1');
    setTimeout(()=> root.classList.remove('pulse'), 6000);
  }

  // при смене языка — обновить открытую панель и текст статуса/кнопки
  document.addEventListener('langchange', ()=>{
    const d = D();
    fab.querySelector('.ith-fab-txt').textContent = d.widget_btn;
    if(!panel.hidden){
      panel.querySelector('.ith-title').textContent = d.widget_title;
      panel.querySelector('.ith-sub').textContent = d.widget_sub;
      panel.querySelector('.ith-status-txt').textContent = d[statusKey()];
      renderMenu();
    }
  });
})();
