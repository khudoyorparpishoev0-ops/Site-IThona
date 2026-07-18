/* ============================================================
   IT-HONA — i18n (RU / TJ / EN)
   Контакты: замените значения в CONTACTS на реальные.
   ============================================================ */

const CONTACTS = {
  whatsapp: "992889295555",              // без +, только цифры
  telegram: "",                          // username без @ (пусто = кнопка ведёт на звонок)
  phone: "+992889295555",                // для tel:
  phoneDisplay: "+992 88 929 5555",      // как показывать
  email: "info@ithona.tj",
  // Куда отправлять заявки с форм.
  //  • Пусто ("") — заявка открывается в WhatsApp с автозаполнением (работает сразу, без настройки).
  //  • Formspree: вставьте свой URL вида "https://formspree.io/f/xxxxxxx" — заявки будут
  //    приходить на почту БЕЗ открытия WhatsApp (регистрация на formspree.io, 1 минута).
  //  Любой endpoint, принимающий POST с JSON, тоже подойдёт.
  formEndpoint: "",
  // рабочие часы (по локальному времени пользователя, 24ч формат)
  workHours: { startHour: 9, endHour: 18, workDays: [1,2,3,4,5] } // Пн–Пт
};

const I18N = {
  ru: {
    _label: "Русский",
    _hreflang: "ru",
    nav: { home:"Главная", about:"О компании", services:"Услуги", solutions:"Решения",
           partners:"Партнёры", contacts:"Контакты" },
    cta_apply: "Оставить заявку",
    lang_title: "Язык",

    hero_eyebrow: "Системный IT-интегратор полного цикла",
    hero_title_1: "IT-HONA — ", hero_title_2: "системный IT-интегратор",
    hero_lead: "Проектируем, внедряем и сопровождаем комплексные инженерные и IT-системы для бизнеса и крупных объектов.",
    hero_slogan: "Интегрируем технологии. Создаём надёжную инфраструктуру.",
    hero_btn1: "Получить консультацию", hero_btn2: "Смотреть решения",
    stat_years:"лет на рынке", stat_projects:"реализованных проектов",
    stat_engineers:"инженеров в команде", stat_support:"техническая поддержка",

    services_eyebrow:"Услуги", services_h:"Полный цикл инженерных и IT-работ",
    services_p:"От проектирования до технического сопровождения — единая ответственность за инфраструктуру объекта.",
    more:"Подробнее",

    svc: {
      design_t:"Проектирование", design_d:"Разработка технических решений и рабочей документации под требования объекта и нормативы.",
      supply_t:"Поставка оборудования", supply_d:"Подбор и поставка сертифицированного оборудования от проверенных производителей.",
      mount_t:"Монтаж и наладка", mount_d:"Профессиональный монтаж, пусконаладочные работы и ввод систем в эксплуатацию.",
      sec_t:"Системы безопасности", sec_d:"Видеонаблюдение, контроль доступа, охранно-пожарные системы под ключ.",
      net_t:"Сетевая инфраструктура", net_d:"СКС, серверные, ЦОД, активное сетевое оборудование и телекоммуникации.",
      srv_t:"Сервис и сопровождение", srv_d:"Гарантийное и постгарантийное обслуживание, техподдержка 24/7, модернизация."
    },

    about_eyebrow:"О компании", about_h:"Инженерная надёжность для сложных объектов",
    about_p1:"IT-HONA — системный IT-интегратор полного цикла. Мы берём на себя весь путь от идеи до работающей инфраструктуры: проектирование, поставку, монтаж, настройку и техническое сопровождение.",
    about_p2:"Работаем с банками, государственными организациями, гостиницами, бизнес-центрами и крупными объектами, где важны надёжность, дисциплина и предсказуемый результат.",
    about_f1:"Единая ответственность за весь проект",
    about_f2:"Сертифицированное оборудование и специалисты",
    about_f3:"Соблюдение сроков и нормативных требований",

    stat_objects:"объектов на сопровождении",

    solutions_eyebrow:"Решения", solutions_h:"Отраслевые решения под задачи объекта",
    solutions_p:"Готовые комплексы инженерных и IT-систем для разных отраслей.",
    sol_banks_t:"Банки и финансы", sol_banks_d:"Безопасность, электронная очередь, СКУД, видеонаблюдение.",
    sol_hotels_t:"Гостиницы", sol_hotels_d:"Гостиничные системы, IPTV, сети, контроль доступа в номера.",
    sol_bc_t:"Бизнес-центры", sol_bc_d:"Слаботочные системы, диспетчеризация, инженерная инфраструктура.",
    solutions_all:"Все решения",

    cta_form_eyebrow:"Оставить заявку", cta_form_h:"Обсудим ваш проект",
    cta_form_p:"Опишите задачу — инженер IT-HONA свяжется с вами, проведёт консультацию и подготовит предложение.",
    form_name:"Имя", form_name_ph:"Ваше имя",
    form_contact:"Телефон или email", form_contact_ph:"+992 __ ___ __ __",
    form_msg:"Сообщение", form_msg_ph:"Кратко опишите задачу",
    form_submit:"Отправить заявку", form_sent:"Заявка отправлена ✓",
    work_time:"Пн–Пт, 9:00–18:00",

    footer_desc:"Системный IT-интегратор полного цикла. Проектируем, внедряем и сопровождаем инженерные и IT-системы.",
    footer_company:"Компания", footer_services:"Услуги", footer_contacts:"Контакты",
    footer_rights:"© 2026 IT-HONA. Все права защищены.",
    footer_sign:"IT-HONA — системный IT-интегратор полного цикла.",

    // Панель связи
    widget_btn:"Связаться с менеджером",
    widget_title:"Связаться с менеджером",
    widget_sub:"Выберите удобный способ связи или оставьте сообщение.",
    status_online:"Менеджер онлайн",
    status_day:"Ответим в течение рабочего дня",
    status_closed:"Сейчас офис закрыт",
    opt_whatsapp:"WhatsApp", opt_telegram:"Telegram", opt_call:"Позвонить",
    opt_write:"Написать сообщение", opt_callback:"Заказать обратный звонок",
    back:"Назад",
    f_name:"Имя", f_company:"Компания", f_phone:"Номер телефона",
    f_email:"Email — необязательно", f_service:"Интересующая услуга",
    f_message:"Сообщение", f_method:"Удобный способ связи", f_consent:"Согласие на обработку данных",
    f_time:"Удобное время звонка", f_topic:"Тема обращения",
    send_manager:"Отправить менеджеру", send_callback:"Заказать звонок",
    choose:"— выберите —",
    method_any:"Любой", method_wa:"WhatsApp", method_tg:"Telegram", method_call:"Звонок",
    consent_err:"Подтвердите согласие на обработку данных.",
    required_err:"Заполните обязательные поля.",
    services_list:["Видеонаблюдение","СКУД","СКС и локальная сеть","Wi-Fi","Серверные решения","IP-телефония","Телевидение","Аудиосистемы","Видеостены и LED-экраны","Электронная очередь","Умный дом","Проектирование","Сервисное обслуживание","Другое"],
    close:"Закрыть",
    quick_h:"Направления",
    q_cctv_t:"Видеонаблюдение", q_cctv_d:"IP-камеры, видеостены, центры мониторинга.",
    q_acs_t:"СКУД", q_acs_d:"Контроль доступа, турникеты, электронные очереди.",
    q_net_t:"Сетевые решения", q_net_d:"СКС, Wi-Fi, активное сетевое оборудование.",
    q_srv_t:"Серверные решения", q_srv_d:"Серверные, ЦОД, инженерная инфраструктура.",
    q_led_t:"LED и видеостены", q_led_d:"Экраны, видеостены, диспетчерские.",
    q_tel_t:"IP-телефония", q_tel_d:"Корпоративная связь и телефония.",
    q_audio_t:"Аудиосистемы", q_audio_d:"Оповещение, звук, конференц-залы.",
    q_ind_t:"Решения по отраслям", q_ind_d:"Комплексы под задачи вашего бизнеса.",
    cookie_text:"Мы используем файлы cookie, чтобы сайт работал корректно и удобно. Продолжая пользоваться сайтом, вы соглашаетесь с этим.",
    cookie_ok:"Понятно", cookie_more:"Подробнее",
    footer_addr:"г. Душанбе, Таджикистан",

    // Общие теги/города
    tag:{ cctv:"Видеонаблюдение", acs:"СКУД", queue:"Электронная очередь", alarm:"Сигнализация",
      net:"Сети", iptv:"IPTV", access:"Контроль доступа", wifi:"Wi-Fi", scs:"СКС", server:"Серверная",
      dispatch:"Диспетчеризация", secnet:"Защищённые сети", notify:"Оповещение", security:"Безопасность",
      infra:"Инженерная инфраструктура" },

    // Страница «Услуги»
    sp:{ h1:"Услуги полного цикла", eyebrow:"Что мы делаем", h2:"От проекта до сопровождения",
      p:"Единая ответственность за инженерную и IT-инфраструктуру вашего объекта.",
      c1_t:"Проектирование", c1_d:"Разработка технических решений и рабочей документации в соответствии с задачами объекта и действующими нормативами.",
      c2_t:"Поставка оборудования", c2_d:"Подбор и поставка сертифицированного оборудования от проверенных производителей под требования проекта.",
      c3_t:"Монтаж и наладка", c3_d:"Профессиональный монтаж, пусконаладочные работы и ввод инженерных систем в эксплуатацию.",
      c4_t:"Системы безопасности", c4_d:"Видеонаблюдение, охранно-пожарная сигнализация и комплексная защита объекта под ключ.",
      c5_t:"Видеонаблюдение", c5_d:"Проектирование и монтаж систем видеонаблюдения, видеостен и центров мониторинга.",
      c6_t:"Контроль доступа", c6_d:"СКУД, электронные очереди, турникеты и системы управления доступом на объекте.",
      c7_t:"Сетевая инфраструктура", c7_d:"СКС, серверные, ЦОД, активное сетевое оборудование и телекоммуникации.",
      c8_t:"Конференц-системы", c8_d:"Оборудование переговорных, конференц-залов и диспетчерских центров.",
      c9_t:"Сервис 24/7", c9_d:"Гарантийное и постгарантийное обслуживание, техподдержка и модернизация систем.",
      cta_h:"Нужна консультация по проекту?", cta_p:"Расскажите о задаче — инженер IT-HONA подготовит решение и предложение." },

    // Страница «О компании»
    ap:{ h1:"О компании IT-HONA", eyebrow:"Кто мы", h2:"Системный интегратор, отвечающий за результат",
      p1:"IT-HONA — инженерный и системный интегратор полного цикла. Мы проектируем, поставляем, монтируем, настраиваем и сопровождаем комплексные инженерные и IT-системы.",
      p2:"Наш подход — единая ответственность за весь проект. Заказчик работает с одной командой от первого чертежа до сдачи объекта и последующего обслуживания.",
      p3:"Мы реализуем проекты для банков, государственных организаций, гостиниц, бизнес-центров и других крупных объектов, где цена ошибки высока.",
      val_eyebrow:"Ценности", val_h:"Как мы работаем",
      v1_t:"Надёжность", v1_d:"Проверенное оборудование, дисциплина в монтаже и предсказуемый результат на каждом этапе.",
      v2_t:"Сроки", v2_d:"Планируем работы и соблюдаем графики — объект сдаётся в согласованное время.",
      v3_t:"Компетенция", v3_d:"Сертифицированные инженеры и опыт на сложных инфраструктурных объектах.",
      st_engineers:"Инженеров в команде", st_projects:"Реализованных проектов", st_years:"Лет на рынке", st_objects:"Объектов на сопровождении" },

    // Страница «Решения»
    solp:{ h1:"Отраслевые решения", h2:"Комплексы систем под задачи отрасли",
      p:"Готовые решения инженерных и IT-систем для разных типов объектов.",
      s1_t:"Банки и финансовые организации", s1_d:"Комплексная безопасность, электронная очередь, контроль доступа и видеонаблюдение для банковских объектов.",
      s2_t:"Гостиницы", s2_d:"Гостиничные IT-системы, сети, IPTV, контроль доступа в номера и инженерная инфраструктура.",
      s3_t:"Бизнес-центры", s3_d:"Слаботочные системы, диспетчеризация, серверные и инженерная инфраструктура здания.",
      s4_t:"Государственные учреждения", s4_d:"Защищённые сети, системы контроля доступа и видеонаблюдения для госорганизаций.",
      s5_t:"Торговые комплексы", s5_d:"Видеонаблюдение, оповещение, сети и инженерные системы для торговых объектов.",
      s6_t:"Медицинские учреждения", s6_d:"IT-инфраструктура, контроль доступа и системы безопасности для клиник и больниц." },

    // Страница «Партнёры»
    prp:{ h1:"Партнёры и производители", eyebrow:"Партнёры", h2:"Работаем с ведущими вендорами",
      p:"Поставляем сертифицированное оборудование от проверенных производителей.",
      cta_h:"Хотите стать партнёром?", cta_p:"Мы открыты к сотрудничеству с производителями и подрядчиками.", cta_btn:"Связаться с нами" },

    // Страница «Контакты»
    cp:{ h1:"Свяжитесь с нами", eyebrow:"Контакты", h2:"Обсудим ваш проект",
      p:"Опишите задачу — инженер IT-HONA свяжется с вами, проведёт консультацию и подготовит предложение.",
      l_phone:"Телефон", l_email:"Email", l_site:"Сайт", l_addr:"Адрес", l_hours:"Часы работы",
      f_name:"Имя", f_phone:"Телефон", f_email:"Email", f_msg:"Сообщение",
      ph_name:"Ваше имя", ph_email:"you@example.com", ph_msg:"Кратко опишите задачу" }
  },

  tj: {
    _label: "Тоҷикӣ",
    _hreflang: "tg",
    nav: { home:"Асосӣ", about:"Дар бораи ширкат", services:"Хизматрасониҳо", solutions:"Ҳалҳо",
           partners:"Шарикон", contacts:"Тамос" },
    cta_apply: "Дархост гузоштан",
    lang_title: "Забон",

    hero_eyebrow: "Интегратори системавии IT-и давраи пурра",
    hero_title_1: "IT-HONA — ", hero_title_2: "интегратори системавии IT",
    hero_lead: "Мо системаҳои муҳандисӣ ва IT-и мукаммалро барои тиҷорат ва иншооти калон тарҳрезӣ, ҷорӣ ва дастгирӣ мекунем.",
    hero_slogan: "Технологияҳоро муттаҳид мекунем. Инфрасохтори боэътимод месозем.",
    hero_btn1: "Машварат гирифтан", hero_btn2: "Дидани ҳалҳо",
    stat_years:"сол дар бозор", stat_projects:"лоиҳаҳои иҷрошуда",
    stat_engineers:"муҳандис дар даста", stat_support:"дастгирии техникӣ",

    services_eyebrow:"Хизматрасониҳо", services_h:"Давраи пурраи корҳои муҳандисӣ ва IT",
    services_p:"Аз тарҳрезӣ то дастгирии техникӣ — масъулияти ягона барои инфрасохтори иншоот.",
    more:"Муфассал",

    svc: {
      design_t:"Тарҳрезӣ", design_d:"Таҳияи ҳалҳои техникӣ ва ҳуҷҷатҳои корӣ мутобиқи талаботи иншоот ва меъёрҳо.",
      supply_t:"Таъмини таҷҳизот", supply_d:"Интихоб ва таъмини таҷҳизоти сертификатсияшуда аз истеҳсолкунандагони боэътимод.",
      mount_t:"Насб ва танзим", mount_d:"Насби касбӣ, корҳои ба кор андохтан ва ба истифода додани системаҳо.",
      sec_t:"Системаҳои амниятӣ", sec_d:"Видеокузатувӣ, назорати дастрасӣ, системаҳои муҳофизатӣ-сӯхторӣ пурра.",
      net_t:"Инфрасохтори шабакавӣ", net_d:"СКС, серверҳо, ЦОД, таҷҳизоти фаъоли шабакавӣ ва телекоммуникатсия.",
      srv_t:"Хизмат ва дастгирӣ", srv_d:"Хизматрасонии кафолатӣ ва баъдикафолатӣ, дастгирии 24/7, навсозӣ."
    },

    about_eyebrow:"Дар бораи ширкат", about_h:"Эътимоднокии муҳандисӣ барои иншооти мураккаб",
    about_p1:"IT-HONA — интегратори системавии IT-и давраи пурра аст. Мо тамоми роҳро аз ғоя то инфрасохтори кор мекардагӣ ба ӯҳда мегирем: тарҳрезӣ, таъмин, насб, танзим ва дастгирии техникӣ.",
    about_p2:"Мо бо бонкҳо, ташкилотҳои давлатӣ, меҳмонхонаҳо, марказҳои тиҷоратӣ ва иншооти калон кор мекунем, ки дар онҳо эътимоднокӣ, интизом ва натиҷаи пешбинишаванда муҳиманд.",
    about_f1:"Масъулияти ягона барои тамоми лоиҳа",
    about_f2:"Таҷҳизот ва мутахассисони сертификатсияшуда",
    about_f3:"Риояи мӯҳлатҳо ва талаботи меъёрӣ",

    stat_objects:"иншоот дар дастгирӣ",

    solutions_eyebrow:"Ҳалҳо", solutions_h:"Ҳалҳои соҳавӣ мутобиқи вазифаҳои иншоот",
    solutions_p:"Маҷмӯаҳои тайёри системаҳои муҳандисӣ ва IT барои соҳаҳои гуногун.",
    sol_banks_t:"Бонкҳо ва молия", sol_banks_d:"Амният, навбати электронӣ, СКУД, видеокузатувӣ.",
    sol_hotels_t:"Меҳмонхонаҳо", sol_hotels_d:"Системаҳои меҳмонхонавӣ, IPTV, шабакаҳо, назорати дастрасӣ.",
    sol_bc_t:"Марказҳои тиҷоратӣ", sol_bc_d:"Системаҳои сустҷараён, диспетчеризатсия, инфрасохтори муҳандисӣ.",
    solutions_all:"Ҳамаи ҳалҳо",

    cta_form_eyebrow:"Дархост гузоштан", cta_form_h:"Лоиҳаи шуморо муҳокима мекунем",
    cta_form_p:"Вазифаро тавсиф кунед — муҳандиси IT-HONA бо шумо тамос мегирад, машварат мегузаронад ва пешниҳод тайёр мекунад.",
    form_name:"Ном", form_name_ph:"Номи шумо",
    form_contact:"Телефон ё email", form_contact_ph:"+992 __ ___ __ __",
    form_msg:"Паём", form_msg_ph:"Вазифаро мухтасар тавсиф кунед",
    form_submit:"Дархост фиристодан", form_sent:"Дархост фиристода шуд ✓",
    work_time:"Душ–Ҷум, 9:00–18:00",

    footer_desc:"Интегратори системавии IT-и давраи пурра. Мо системаҳои муҳандисӣ ва IT-ро тарҳрезӣ, ҷорӣ ва дастгирӣ мекунем.",
    footer_company:"Ширкат", footer_services:"Хизматрасониҳо", footer_contacts:"Тамос",
    footer_rights:"© 2026 IT-HONA. Ҳамаи ҳуқуқҳо ҳифз шудаанд.",
    footer_sign:"IT-HONA — интегратори системавии IT-и давраи пурра.",

    widget_btn:"Тамос бо менеҷер",
    widget_title:"Тамос бо менеҷер",
    widget_sub:"Тарзи муносиби тамосро интихоб кунед ё паём гузоред.",
    status_online:"Менеҷер онлайн",
    status_day:"Дар давоми рӯзи корӣ ҷавоб медиҳем",
    status_closed:"Ҳоло офис баста аст",
    opt_whatsapp:"WhatsApp", opt_telegram:"Telegram", opt_call:"Занг задан",
    opt_write:"Паём навиштан", opt_callback:"Занги баргардонӣ фармудан",
    back:"Бозгашт",
    f_name:"Ном", f_company:"Ширкат", f_phone:"Рақами телефон",
    f_email:"Email — ихтиёрӣ", f_service:"Хизмати мавриди таваҷҷӯҳ",
    f_message:"Паём", f_method:"Тарзи муносиби тамос", f_consent:"Розигӣ ба коркарди маълумот",
    f_time:"Вақти муносиби занг", f_topic:"Мавзӯи муроҷиат",
    send_manager:"Ба менеҷер фиристодан", send_callback:"Занг фармудан",
    choose:"— интихоб кунед —",
    method_any:"Ҳар кадом", method_wa:"WhatsApp", method_tg:"Telegram", method_call:"Занг",
    consent_err:"Розигиро ба коркарди маълумот тасдиқ кунед.",
    required_err:"Майдонҳои ҳатмиро пур кунед.",
    services_list:["Видеокузатувӣ","СКУД","СКС ва шабакаи маҳаллӣ","Wi-Fi","Ҳалҳои серверӣ","IP-телефония","Телевизион","Системаҳои аудио","Видеодеворҳо ва экранҳои LED","Навбати электронӣ","Хонаи ақл","Тарҳрезӣ","Хизматрасонии сервисӣ","Дигар"],
    close:"Пӯшидан",
    quick_h:"Самтҳо",
    q_cctv_t:"Видеокузатувӣ", q_cctv_d:"IP-камераҳо, видеодеворҳо, марказҳои назорат.",
    q_acs_t:"СКУД", q_acs_d:"Назорати дастрасӣ, турникетҳо, навбати электронӣ.",
    q_net_t:"Ҳалҳои шабакавӣ", q_net_d:"СКС, Wi-Fi, таҷҳизоти фаъоли шабакавӣ.",
    q_srv_t:"Ҳалҳои серверӣ", q_srv_d:"Серверҳо, ЦОД, инфрасохтори муҳандисӣ.",
    q_led_t:"LED ва видеодеворҳо", q_led_d:"Экранҳо, видеодеворҳо, диспетчерӣ.",
    q_tel_t:"IP-телефония", q_tel_d:"Алоқа ва телефонияи корпоративӣ.",
    q_audio_t:"Системаҳои аудио", q_audio_d:"Огоҳкунӣ, овоз, толорҳои конфронс.",
    q_ind_t:"Ҳалҳо аз рӯи соҳаҳо", q_ind_d:"Маҷмӯаҳо барои вазифаҳои тиҷорати шумо.",
    cookie_text:"Мо файлҳои cookie-ро истифода мебарем, то сайт дуруст ва қулай кор кунад. Бо идомаи истифода шумо розӣ мешавед.",
    cookie_ok:"Фаҳмо", cookie_more:"Муфассал",
    footer_addr:"ш. Душанбе, Тоҷикистон",

    tag:{ cctv:"Видеокузатувӣ", acs:"СКУД", queue:"Навбати электронӣ", alarm:"Сигнализатсия",
      net:"Шабакаҳо", iptv:"IPTV", access:"Назорати дастрасӣ", wifi:"Wi-Fi", scs:"СКС", server:"Утоқи серверӣ",
      dispatch:"Диспетчеризатсия", secnet:"Шабакаҳои ҳифзшуда", notify:"Огоҳкунӣ", security:"Амният",
      infra:"Инфрасохтори муҳандисӣ" },

    sp:{ h1:"Хизматрасониҳои давраи пурра", eyebrow:"Мо чӣ кор мекунем", h2:"Аз лоиҳа то дастгирӣ",
      p:"Масъулияти ягона барои инфрасохтори муҳандисӣ ва IT-и иншооти шумо.",
      c1_t:"Тарҳрезӣ", c1_d:"Таҳияи ҳалҳои техникӣ ва ҳуҷҷатҳои корӣ мутобиқи вазифаҳои иншоот ва меъёрҳои амалкунанда.",
      c2_t:"Таъмини таҷҳизот", c2_d:"Интихоб ва таъмини таҷҳизоти сертификатсияшуда аз истеҳсолкунандагони боэътимод мутобиқи талаботи лоиҳа.",
      c3_t:"Насб ва танзим", c3_d:"Насби касбӣ, корҳои ба кор андохтан ва ба истифода додани системаҳои муҳандисӣ.",
      c4_t:"Системаҳои амниятӣ", c4_d:"Видеокузатувӣ, сигнализатсияи муҳофизатӣ-сӯхторӣ ва ҳифзи комплексии иншоот пурра.",
      c5_t:"Видеокузатувӣ", c5_d:"Тарҳрезӣ ва насби системаҳои видеокузатувӣ, видеодеворҳо ва марказҳои назорат.",
      c6_t:"Назорати дастрасӣ", c6_d:"СКУД, навбати электронӣ, турникетҳо ва системаҳои идораи дастрасӣ дар иншоот.",
      c7_t:"Инфрасохтори шабакавӣ", c7_d:"СКС, серверҳо, ЦОД, таҷҳизоти фаъоли шабакавӣ ва телекоммуникатсия.",
      c8_t:"Системаҳои конфронсӣ", c8_d:"Таҷҳизоти толорҳои гуфтушунид, конфронс ва марказҳои диспетчерӣ.",
      c9_t:"Хизмат 24/7", c9_d:"Хизматрасонии кафолатӣ ва баъдикафолатӣ, дастгирии техникӣ ва навсозии системаҳо.",
      cta_h:"Ба машварат оид ба лоиҳа ниёз доред?", cta_p:"Дар бораи вазифа нақл кунед — муҳандиси IT-HONA ҳал ва пешниҳод тайёр мекунад." },

    ap:{ h1:"Дар бораи ширкати IT-HONA", eyebrow:"Мо кистем", h2:"Интеграторе, ки барои натиҷа масъул аст",
      p1:"IT-HONA — интегратори муҳандисӣ ва системавии давраи пурра. Мо системаҳои мукаммали муҳандисӣ ва IT-ро тарҳрезӣ, таъмин, насб, танзим ва дастгирӣ мекунем.",
      p2:"Равиши мо — масъулияти ягона барои тамоми лоиҳа. Фармоишгар аз нақшаи аввал то супоридани иншоот ва хизматрасонии минбаъда бо як даста кор мекунад.",
      p3:"Мо лоиҳаҳоро барои бонкҳо, ташкилотҳои давлатӣ, меҳмонхонаҳо, марказҳои тиҷоратӣ ва дигар иншооти калон, ки дар онҳо арзиши хато баланд аст, амалӣ мекунем.",
      val_eyebrow:"Арзишҳо", val_h:"Мо чӣ гуна кор мекунем",
      v1_t:"Эътимоднокӣ", v1_d:"Таҷҳизоти санҷидашуда, интизом дар насб ва натиҷаи пешбинишаванда дар ҳар марҳила.",
      v2_t:"Мӯҳлатҳо", v2_d:"Корҳоро ба нақша мегирем ва ҷадвалҳоро риоя мекунем — иншоот дар вақти мувофиқа супорида мешавад.",
      v3_t:"Салоҳият", v3_d:"Муҳандисони сертификатсияшуда ва таҷриба дар иншооти мураккаби инфрасохторӣ.",
      st_engineers:"Муҳандис дар даста", st_projects:"Лоиҳаҳои иҷрошуда", st_years:"Сол дар бозор", st_objects:"Иншоот дар дастгирӣ" },

    solp:{ h1:"Ҳалҳои соҳавӣ", h2:"Маҷмӯаҳои системаҳо мутобиқи вазифаҳои соҳа",
      p:"Ҳалҳои тайёри системаҳои муҳандисӣ ва IT барои намудҳои гуногуни иншоот.",
      s1_t:"Бонкҳо ва ташкилотҳои молиявӣ", s1_d:"Амнияти комплексӣ, навбати электронӣ, назорати дастрасӣ ва видеокузатувӣ барои иншооти бонкӣ.",
      s2_t:"Меҳмонхонаҳо", s2_d:"Системаҳои IT-и меҳмонхонавӣ, шабакаҳо, IPTV, назорати дастрасӣ ба ҳуҷраҳо ва инфрасохтори муҳандисӣ.",
      s3_t:"Марказҳои тиҷоратӣ", s3_d:"Системаҳои сустҷараён, диспетчеризатсия, серверҳо ва инфрасохтори муҳандисии бино.",
      s4_t:"Муассисаҳои давлатӣ", s4_d:"Шабакаҳои ҳифзшуда, системаҳои назорати дастрасӣ ва видеокузатувӣ барои ташкилотҳои давлатӣ.",
      s5_t:"Марказҳои савдо", s5_d:"Видеокузатувӣ, огоҳкунӣ, шабакаҳо ва системаҳои муҳандисӣ барои иншооти савдо.",
      s6_t:"Муассисаҳои тиббӣ", s6_d:"Инфрасохтори IT, назорати дастрасӣ ва системаҳои амниятӣ барои клиникаҳо ва беморхонаҳо." },

    prp:{ h1:"Шарикон ва истеҳсолкунандагон", eyebrow:"Шарикон", h2:"Бо вендорҳои пешбар кор мекунем",
      p:"Таҷҳизоти сертификатсияшударо аз истеҳсолкунандагони боэътимод таъмин мекунем.",
      cta_h:"Мехоҳед шарик шавед?", cta_p:"Мо ба ҳамкорӣ бо истеҳсолкунандагон ва пудратчиён кушодаем.", cta_btn:"Бо мо тамос гиред" },

    cp:{ h1:"Бо мо тамос гиред", eyebrow:"Тамос", h2:"Лоиҳаи шуморо муҳокима мекунем",
      p:"Вазифаро тавсиф кунед — муҳандиси IT-HONA бо шумо тамос мегирад, машварат мегузаронад ва пешниҳод тайёр мекунад.",
      l_phone:"Телефон", l_email:"Email", l_site:"Сайт", l_addr:"Суроға", l_hours:"Соатҳои корӣ",
      f_name:"Ном", f_phone:"Телефон", f_email:"Email", f_msg:"Паём",
      ph_name:"Номи шумо", ph_email:"you@example.com", ph_msg:"Вазифаро мухтасар тавсиф кунед" }
  },

  en: {
    _label: "English",
    _hreflang: "en",
    nav: { home:"Home", about:"About", services:"Services", solutions:"Solutions",
           partners:"Partners", contacts:"Contacts" },
    cta_apply: "Request a quote",
    lang_title: "Language",

    hero_eyebrow: "Full-cycle system IT integrator",
    hero_title_1: "IT-HONA — ", hero_title_2: "system IT integrator",
    hero_lead: "We design, deploy and support complex engineering and IT systems for business and large facilities.",
    hero_slogan: "We integrate technology. We build reliable infrastructure.",
    hero_btn1: "Get a consultation", hero_btn2: "View solutions",
    stat_years:"years on the market", stat_projects:"completed projects",
    stat_engineers:"engineers on the team", stat_support:"technical support",

    services_eyebrow:"Services", services_h:"Full cycle of engineering and IT work",
    services_p:"From design to technical support — single responsibility for the facility's infrastructure.",
    more:"Learn more",

    svc: {
      design_t:"Design", design_d:"Development of technical solutions and working documentation to meet facility requirements and standards.",
      supply_t:"Equipment supply", supply_d:"Selection and supply of certified equipment from trusted manufacturers.",
      mount_t:"Installation & commissioning", mount_d:"Professional installation, commissioning and putting systems into operation.",
      sec_t:"Security systems", sec_d:"CCTV, access control, security and fire systems turnkey.",
      net_t:"Network infrastructure", net_d:"Structured cabling, server rooms, data centers, active network equipment and telecom.",
      srv_t:"Service & support", srv_d:"Warranty and post-warranty maintenance, 24/7 support, upgrades."
    },

    about_eyebrow:"About", about_h:"Engineering reliability for complex facilities",
    about_p1:"IT-HONA is a full-cycle system IT integrator. We take on the whole path from idea to working infrastructure: design, supply, installation, configuration and technical support.",
    about_p2:"We work with banks, government organizations, hotels, business centers and large facilities where reliability, discipline and predictable results matter.",
    about_f1:"Single responsibility for the entire project",
    about_f2:"Certified equipment and specialists",
    about_f3:"Meeting deadlines and regulatory requirements",

    stat_objects:"facilities under support",

    solutions_eyebrow:"Solutions", solutions_h:"Industry solutions for your facility",
    solutions_p:"Ready-made complexes of engineering and IT systems for various industries.",
    sol_banks_t:"Banks & finance", sol_banks_d:"Security, electronic queue, access control, CCTV.",
    sol_hotels_t:"Hotels", sol_hotels_d:"Hotel systems, IPTV, networks, room access control.",
    sol_bc_t:"Business centers", sol_bc_d:"Low-current systems, dispatching, engineering infrastructure.",
    solutions_all:"All solutions",

    cta_form_eyebrow:"Request a quote", cta_form_h:"Let's discuss your project",
    cta_form_p:"Describe your task — an IT-HONA engineer will contact you, provide a consultation and prepare a proposal.",
    form_name:"Name", form_name_ph:"Your name",
    form_contact:"Phone or email", form_contact_ph:"+992 __ ___ __ __",
    form_msg:"Message", form_msg_ph:"Briefly describe your task",
    form_submit:"Send request", form_sent:"Request sent ✓",
    work_time:"Mon–Fri, 9:00–18:00",

    footer_desc:"Full-cycle system IT integrator. We design, deploy and support engineering and IT systems.",
    footer_company:"Company", footer_services:"Services", footer_contacts:"Contacts",
    footer_rights:"© 2026 IT-HONA. All rights reserved.",
    footer_sign:"IT-HONA — full-cycle system IT integrator.",

    widget_btn:"Contact a manager",
    widget_title:"Contact a manager",
    widget_sub:"Choose a convenient contact method or leave a message.",
    status_online:"Manager online",
    status_day:"We'll reply within the business day",
    status_closed:"The office is currently closed",
    opt_whatsapp:"WhatsApp", opt_telegram:"Telegram", opt_call:"Call",
    opt_write:"Write a message", opt_callback:"Request a callback",
    back:"Back",
    f_name:"Name", f_company:"Company", f_phone:"Phone number",
    f_email:"Email — optional", f_service:"Service of interest",
    f_message:"Message", f_method:"Preferred contact method", f_consent:"Consent to data processing",
    f_time:"Preferred call time", f_topic:"Subject",
    send_manager:"Send to manager", send_callback:"Request call",
    choose:"— choose —",
    method_any:"Any", method_wa:"WhatsApp", method_tg:"Telegram", method_call:"Call",
    consent_err:"Please confirm consent to data processing.",
    required_err:"Please fill in the required fields.",
    services_list:["CCTV","Access control","Structured cabling & LAN","Wi-Fi","Server solutions","IP telephony","TV","Audio systems","Video walls & LED screens","Electronic queue","Smart home","Design","Service maintenance","Other"],
    close:"Close",
    quick_h:"Directions",
    q_cctv_t:"CCTV", q_cctv_d:"IP cameras, video walls, monitoring centers.",
    q_acs_t:"Access control", q_acs_d:"Access control, turnstiles, electronic queues.",
    q_net_t:"Network solutions", q_net_d:"Structured cabling, Wi-Fi, active network gear.",
    q_srv_t:"Server solutions", q_srv_d:"Server rooms, data centers, engineering infrastructure.",
    q_led_t:"LED & video walls", q_led_d:"Screens, video walls, control rooms.",
    q_tel_t:"IP telephony", q_tel_d:"Corporate communications and telephony.",
    q_audio_t:"Audio systems", q_audio_d:"Notification, sound, conference halls.",
    q_ind_t:"Industry solutions", q_ind_d:"Complexes tailored to your business.",
    cookie_text:"We use cookies to make the site work correctly and conveniently. By continuing to use the site, you agree to this.",
    cookie_ok:"Got it", cookie_more:"Learn more",
    footer_addr:"Dushanbe, Tajikistan",

    tag:{ cctv:"CCTV", acs:"Access control", queue:"Electronic queue", alarm:"Alarm",
      net:"Networks", iptv:"IPTV", access:"Access control", wifi:"Wi-Fi", scs:"Structured cabling", server:"Server room",
      dispatch:"Dispatching", secnet:"Secure networks", notify:"Notification", security:"Security",
      infra:"Engineering infrastructure" },

    sp:{ h1:"Full-cycle services", eyebrow:"What we do", h2:"From design to support",
      p:"Single responsibility for your facility's engineering and IT infrastructure.",
      c1_t:"Design", c1_d:"Development of technical solutions and working documentation in line with facility requirements and current standards.",
      c2_t:"Equipment supply", c2_d:"Selection and supply of certified equipment from trusted manufacturers to meet project requirements.",
      c3_t:"Installation & commissioning", c3_d:"Professional installation, commissioning and putting engineering systems into operation.",
      c4_t:"Security systems", c4_d:"CCTV, security and fire alarm and comprehensive turnkey facility protection.",
      c5_t:"CCTV", c5_d:"Design and installation of CCTV systems, video walls and monitoring centers.",
      c6_t:"Access control", c6_d:"Access control systems, electronic queues, turnstiles and access management on site.",
      c7_t:"Network infrastructure", c7_d:"Structured cabling, server rooms, data centers, active network equipment and telecom.",
      c8_t:"Conference systems", c8_d:"Equipment for meeting rooms, conference halls and control centers.",
      c9_t:"24/7 service", c9_d:"Warranty and post-warranty maintenance, technical support and system upgrades.",
      cta_h:"Need a consultation on your project?", cta_p:"Tell us about your task — an IT-HONA engineer will prepare a solution and proposal." },

    ap:{ h1:"About IT-HONA", eyebrow:"Who we are", h2:"A system integrator accountable for results",
      p1:"IT-HONA is a full-cycle engineering and system integrator. We design, supply, install, configure and support complex engineering and IT systems.",
      p2:"Our approach is single responsibility for the entire project. The client works with one team from the first drawing to handover and ongoing maintenance.",
      p3:"We deliver projects for banks, government organizations, hotels, business centers and other large facilities where the cost of error is high.",
      val_eyebrow:"Values", val_h:"How we work",
      v1_t:"Reliability", v1_d:"Proven equipment, discipline in installation and predictable results at every stage.",
      v2_t:"Deadlines", v2_d:"We plan the work and keep to schedules — the facility is delivered on the agreed date.",
      v3_t:"Competence", v3_d:"Certified engineers and experience on complex infrastructure facilities.",
      st_engineers:"Engineers on the team", st_projects:"Completed projects", st_years:"Years on the market", st_objects:"Facilities under support" },

    solp:{ h1:"Industry solutions", h2:"System complexes for your industry's needs",
      p:"Ready-made engineering and IT system solutions for various types of facilities.",
      s1_t:"Banks & financial organizations", s1_d:"Comprehensive security, electronic queue, access control and CCTV for banking facilities.",
      s2_t:"Hotels", s2_d:"Hotel IT systems, networks, IPTV, room access control and engineering infrastructure.",
      s3_t:"Business centers", s3_d:"Low-current systems, dispatching, server rooms and building engineering infrastructure.",
      s4_t:"Government institutions", s4_d:"Secure networks, access control and CCTV systems for government organizations.",
      s5_t:"Shopping complexes", s5_d:"CCTV, notification, networks and engineering systems for retail facilities.",
      s6_t:"Medical institutions", s6_d:"IT infrastructure, access control and security systems for clinics and hospitals." },

    prp:{ h1:"Partners & manufacturers", eyebrow:"Partners", h2:"We work with leading vendors",
      p:"We supply certified equipment from trusted manufacturers.",
      cta_h:"Want to become a partner?", cta_p:"We are open to cooperation with manufacturers and contractors.", cta_btn:"Get in touch" },

    cp:{ h1:"Get in touch", eyebrow:"Contacts", h2:"Let's discuss your project",
      p:"Describe your task — an IT-HONA engineer will contact you, provide a consultation and prepare a proposal.",
      l_phone:"Phone", l_email:"Email", l_site:"Website", l_addr:"Address", l_hours:"Working hours",
      f_name:"Name", f_phone:"Phone", f_email:"Email", f_msg:"Message",
      ph_name:"Your name", ph_email:"you@example.com", ph_msg:"Briefly describe your task" }
  }
};

// текущий язык
function getLang(){
  const saved = localStorage.getItem('ithona_lang');
  if(saved && I18N[saved]) return saved;
  const nav = (navigator.language||'ru').slice(0,2);
  if(nav==='tg'||nav==='tj') return 'tj';
  if(nav==='en') return 'en';
  return 'ru';
}
function setLang(l){ localStorage.setItem('ithona_lang', l); applyLang(l); }

// достаёт значение по "пути" вида "svc.design_t"
function t(dict, path){
  return path.split('.').reduce((o,k)=> (o&&o[k]!=null)?o[k]:null, dict);
}

function applyLang(l){
  const d = I18N[l] || I18N.ru;
  document.documentElement.lang = d._hreflang;

  // текстовые узлы
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const val = t(d, el.getAttribute('data-i18n'));
    if(val!=null) el.textContent = val;
  });
  // placeholder
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const val = t(d, el.getAttribute('data-i18n-ph'));
    if(val!=null) el.setAttribute('placeholder', val);
  });
  // aria-label
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>{
    const val = t(d, el.getAttribute('data-i18n-aria'));
    if(val!=null) el.setAttribute('aria-label', val);
  });

  // переключатель — активный язык
  document.querySelectorAll('.lang a').forEach(a=>{
    a.classList.toggle('on', a.dataset.lang===l);
  });
  document.querySelectorAll('.lang-mobile a').forEach(a=>{
    a.classList.toggle('on', a.dataset.lang===l);
  });

  // пересобрать динамические части виджета (списки услуг и т.п.)
  if(window.__rebuildWidget) window.__rebuildWidget(d);
  document.dispatchEvent(new CustomEvent('langchange',{detail:{lang:l, dict:d}}));
}
