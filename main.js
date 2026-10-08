(() => {
  'use strict';

  const state = { lang: localStorage.getItem('etimarki-lang') || 'eo', filter: 'all', projectIndex: 0, imageIndex: 0 };
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const translations = {
    fr: {
      metaTitle: 'ETIMARKI PAMOJA HAKUNA MATATA | Association en RDC',
      nav: { about:'À propos', domains:'Domaines', projects:'Projets', partners:'Partenaires', news:'Actualités', support:'Soutenir', contact:'Contact', cta:'Collaborer' },
      hero: { kicker:'ASSOCIATION • RÉPUBLIQUE DÉMOCRATIQUE DU CONGO', titleA:'Un pour tous,', titleB:'tous pour un.', text:'ETIMARKI PAMOJA HAKUNA MATATA agit à travers des projets de solidarité, de formation, d’éducation et de développement communautaire, avec une présence documentée à Goma et dans d’autres régions de la RDC.', primary:'Découvrir les projets', secondary:'Nous soutenir', trustProjects:'ensembles d’activités documentés', trustFamilies:'familles aidées dans un projet documenté', card1Title:'Action réelle', card1Text:'Projets documentés sur le terrain', card2Text:'Solidarité • Formation • Communauté', scroll:'Découvrir' },
      about: { kicker:'QUI SOMMES-NOUS ?', title:'Une association qui choisit l’action.', p1:'ETIMARKI PAMOJA HAKUNA MATATA est une association congolaise engagée dans la solidarité, la formation, l’éducation et le développement communautaire.', p2:'Les projets fournis dans les ressources du site montrent des actions concrètes auprès des familles, des enfants, des jeunes, des personnes malades et des personnes âgées.', link:'Explorer les réalisations →' },
      domains: { kicker:'NOS DOMAINES', title:'Des actions concrètes, plusieurs leviers.', text:'La structure des activités réelles permet de présenter l’association autour de plusieurs domaines d’intervention.', humanitarian:{title:'Humanitaire & solidarité',text:'Soutien aux familles, visites solidaires et actions d’aide.'}, education:{title:'Formation & éducation',text:'Transmission de compétences en informatique, design et apprentissage.'}, agri:{title:'Agriculture & élevage',text:'Initiatives autour de l’agriculture, de l’élevage et du développement local.'}, sport:{title:'Jeunesse & sport',text:'Activités sportives et récréatives qui favorisent la cohésion.'}, digital:{title:'Compétences numériques',text:'Formation informatique et développement des capacités numériques.'}, design:{title:'Design & créativité',text:'Apprentissage de compétences graphiques et créatives.'} },
      projects: { kicker:'NOS PROJETS', title:'Chaque action raconte sa propre histoire.', text:'Chaque projet reste indépendant : ses images, sa description et ses informations sont regroupées dans une même fiche.' },
      impact: { kicker:'NOTRE IMPACT', title:'Montrer ce qui a réellement été fait.', text:'Les chiffres affichés ici sont volontairement limités aux éléments documentés dans les ressources reçues.', projects:'projets / activités documentés', families:'familles aidées dans un projet documenté', zone:'territoire d’action documenté', authentic:'ressources visuelles issues des fichiers fournis' },
      partners: { kicker:'PARTENARIATS', title:'Des identités partenaires à présenter avec clarté.', text:'Les logos ci-dessous proviennent directement des ressources fournies. Les fiches et liens peuvent être complétés dans l’administration.', status:'Partenaire à documenter' },
      news: { kicker:'ACTUALITÉS', title:'Publier, documenter, continuer.', text:'Les prochaines actualités peuvent être ajoutées depuis l’espace d’administration sans modifier la structure du site.', emptyTitle:'Aucune actualité publiée pour le moment.', emptyText:'Ajoutez vos prochains comptes rendus, événements, annonces et formations depuis l’administration.', admin:'Ouvrir l’administration' },
      support: { kicker:'NOUS SOUTENIR', title:'Faire avancer une action concrète.', text:'Partenariat, bénévolat, don, matériel ou compétences : chaque forme de soutien peut contribuer aux prochaines activités de l’association.', button:'Parler avec l’association' },
      contact: { kicker:'CONTACT', title:'Parlons d’une prochaine collaboration.', text:'Pour une question, une proposition de partenariat ou une demande d’information, utilisez les coordonnées officielles ci-dessous.' },
      form: { name:'Nom complet', email:'E-mail', subject:'Objet', message:'Message', send:'Envoyer le message', sent:'Votre application de messagerie va s’ouvrir. Merci !', error:'Veuillez compléter tous les champs.' },
      footer: { slogan:'« Un pour tous, tous pour un »', nav:'Navigation', contact:'Contact', admin:'Administration', rights:'Tous droits réservés.' },
      modal: { contact:'Contacter l’association', next:'Projet suivant', previous:'Projet précédent', close:'Fermer', place:'Lieu', images:'images', back:'Retour aux projets' },
      filters: { all:'Tous', humanitarian:'Humanitaire', training:'Formation', development:'Développement', social:'Social', youth:'Jeunesse', education:'Éducation' },
      accessibility: { openMenu:'Ouvrir le menu', closeMenu:'Fermer le menu', nextImage:'Image suivante', previousImage:'Image précédente' }
    },
    en: {
      metaTitle: 'ETIMARKI PAMOJA HAKUNA MATATA | Association in DRC',
      nav: { about:'About', domains:'Areas', projects:'Projects', partners:'Partners', news:'News', support:'Support us', contact:'Contact', cta:'Collaborate' },
      hero: { kicker:'ASSOCIATION • DEMOCRATIC REPUBLIC OF THE CONGO', titleA:'One for all,', titleB:'all for one.', text:'ETIMARKI PAMOJA HAKUNA MATATA works through solidarity, training, education and community development projects, with documented activities in Goma and other parts of the DRC.', primary:'Explore projects', secondary:'Support us', trustProjects:'documented activity sets', trustFamilies:'families supported in one documented project', card1Title:'Real action', card1Text:'Projects documented in the field', card2Text:'Solidarity • Training • Community', scroll:'Discover' },
      about: { kicker:'WHO WE ARE', title:'An association that chooses action.', p1:'ETIMARKI PAMOJA HAKUNA MATATA is a Congolese association committed to solidarity, training, education and community development.', p2:'The resources supplied with this site show concrete activities involving families, children, young people, sick people and older people.', link:'Explore the work →' },
      domains: { kicker:'OUR AREAS', title:'Concrete action, several levers.', text:'The real activities make it possible to present the association across several areas of intervention.', humanitarian:{title:'Humanitarian & solidarity',text:'Support for families, solidarity visits and assistance actions.'}, education:{title:'Training & education',text:'Skills development in computing, design and learning.'}, agri:{title:'Agriculture & livestock',text:'Initiatives around agriculture, livestock and local development.'}, sport:{title:'Youth & sport',text:'Sports and recreational activities that build cohesion.'}, digital:{title:'Digital skills',text:'Computer training and development of digital capabilities.'}, design:{title:'Design & creativity',text:'Learning creative and graphic design skills.'} },
      projects: { kicker:'OUR PROJECTS', title:'Every action tells its own story.', text:'Each project stays independent: its images, description and information are grouped into one case file.' },
      impact: { kicker:'OUR IMPACT', title:'Show what has actually been done.', text:'The figures shown here are deliberately limited to what is documented in the supplied resources.', projects:'documented projects / activities', families:'families supported in one documented project', zone:'documented area of action', authentic:'visual resources from the supplied files' },
      partners: { kicker:'PARTNERSHIPS', title:'Partner identities presented with clarity.', text:'The logos below come directly from the supplied resources. Profiles and links can be completed from the administration area.', status:'Partner profile to document' },
      news: { kicker:'NEWS', title:'Publish, document, continue.', text:'Future updates can be added from the administration area without changing the site structure.', emptyTitle:'No news has been published yet.', emptyText:'Add future reports, events, announcements and training sessions from the administration area.', admin:'Open administration' },
      support: { kicker:'SUPPORT US', title:'Help move a real action forward.', text:'Partnership, volunteering, donations, materials or skills: every form of support can contribute to the association’s next activities.', button:'Talk to the association' },
      contact: { kicker:'CONTACT', title:'Let’s discuss the next collaboration.', text:'For a question, partnership proposal or information request, use the official contact details below.' },
      form: { name:'Full name', email:'Email', subject:'Subject', message:'Message', send:'Send message', sent:'Your mail application will open. Thank you!', error:'Please complete every field.' },
      footer: { slogan:'“One for all, all for one”', nav:'Navigation', contact:'Contact', admin:'Administration', rights:'All rights reserved.' },
      modal: { contact:'Contact the association', next:'Next project', previous:'Previous project', close:'Close', place:'Location', images:'images', back:'Back to projects' },
      filters: { all:'All', humanitarian:'Humanitarian', training:'Training', development:'Development', social:'Social', youth:'Youth', education:'Education' },
      accessibility: { openMenu:'Open menu', closeMenu:'Close menu', nextImage:'Next image', previousImage:'Previous image' }
    },
    eo: {
      metaTitle: 'ETIMARKI PAMOJA HAKUNA MATATA | Asocio en DRK',
      nav: { about:'Pri ni', domains:'Agadkampoj', projects:'Projektoj', partners:'Partneroj', news:'Novaĵoj', support:'Subteni', contact:'Kontakti', cta:'Kunlabori' },
      hero: { kicker:'ASOCIO • DEMOKRATIA RESPUBLIKO KONGO', titleA:'Unu por ĉiuj,', titleB:'ĉiuj por unu.', text:'ETIMARKI PAMOJA HAKUNA MATATA laboras per projektoj pri solidareco, trejnado, edukado kaj komunuma disvolviĝo, kun dokumentitaj agadoj en Goma kaj aliaj partoj de la DRK.', primary:'Malkovri la projektojn', secondary:'Subteni nin', trustProjects:'dokumentitaj agadaroj', trustFamilies:'familioj subtenitaj en unu dokumentita projekto', card1Title:'Reala agado', card1Text:'Projektoj dokumentitaj sur la tereno', card2Text:'Solidareco • Trejnado • Komunumo', scroll:'Malkovri' },
      about: { kicker:'KIUJ NI ESTAS', title:'Asocio kiu elektas agadon.', p1:'ETIMARKI PAMOJA HAKUNA MATATA estas kongola asocio dediĉita al solidareco, trejnado, edukado kaj komunuma disvolviĝo.', p2:'La liveritaj rimedoj montras konkretajn agadojn kun familioj, infanoj, junuloj, malsanuloj kaj maljunuloj.', link:'Esplori la realigojn →' },
      domains: { kicker:'NIAJ AGADKAMPOJ', title:'Konkreta agado, pluraj vojoj.', text:'La realaj agadoj ebligas prezenti la asocion tra pluraj agadkampoj.', humanitarian:{title:'Humanitara kaj solidareca agado',text:'Subteno al familioj, solidarecaj vizitoj kaj helpagadoj.'}, education:{title:'Trejnado kaj edukado',text:'Disvolvo de kapabloj pri komputiloj, dezajno kaj lernado.'}, agri:{title:'Agrikulturo kaj bestbredado',text:'Iniciatoj pri agrikulturo, bestbredado kaj loka disvolviĝo.'}, sport:{title:'Junularo kaj sporto',text:'Sportaj kaj distraj aktivecoj kiuj fortigas kunteniĝon.'}, digital:{title:'Ciferecaj kapabloj',text:'Informatika trejnado kaj disvolvo de ciferecaj kapabloj.'}, design:{title:'Dezajno kaj kreemo',text:'Lernado de grafikaj kaj kreivaj kapabloj.'} },
      projects: { kicker:'NIAJ PROJEKTOJ', title:'Ĉiu agado rakontas sian propran historion.', text:'Ĉiu projekto restas sendependa: ĝiaj bildoj, priskribo kaj informoj estas kunigitaj en unu dosiero.' },
      impact: { kicker:'NIA EFIKO', title:'Montru kio vere estis farita.', text:'La montritaj nombroj estas limigitaj al la elementoj dokumentitaj en la ricevitaj rimedoj.', projects:'dokumentitaj projektoj / agadoj', families:'familioj helpitaj en unu dokumentita projekto', zone:'dokumentita agadteritorio', authentic:'vidaj rimedoj el la ricevitaj dosieroj' },
      partners: { kicker:'PARTNERECOJ', title:'Partneraj identecoj kun klareco.', text:'La subaj emblemoj venas rekte el la liveritaj rimedoj. Profiloj kaj ligoj povas esti kompletigitaj en la administrado.', status:'Partnero: informoj kompletigeblaj' },
      news: { kicker:'NOVAĴOJ', title:'Publiki, dokumenti, daŭrigi.', text:'Estontaj novaĵoj povas esti aldonitaj el la administrada areo sen ŝanĝi la strukturon de la retejo.', emptyTitle:'Neniu novaĵo estas publikigita nun.', emptyText:'Aldonu estontajn raportojn, eventojn, anoncojn kaj trejnadojn el la administrado.', admin:'Malfermi administradon' },
      support: { kicker:'SUBTENI NIN', title:'Antaŭenigi konkretan agadon.', text:'Partnereco, volontulado, donaco, materialoj aŭ kapabloj: ĉiu formo de subteno povas kontribui al la venontaj agadoj.', button:'Paroli kun la asocio' },
      contact: { kicker:'KONTAKTO', title:'Ni parolu pri la venonta kunlaboro.', text:'Por demando, partnereca propono aŭ informa peto, uzu la oficialajn kontaktinformojn sube.' },
      form: { name:'Plena nomo', email:'Retpoŝto', subject:'Temo', message:'Mesaĝo', send:'Sendi mesaĝon', sent:'Via retpoŝta aplikaĵo malfermiĝos. Dankon!', error:'Bonvolu plenigi ĉiujn kampojn.' },
      footer: { slogan:'“Unu por ĉiuj, ĉiuj por unu”', nav:'Navigado', contact:'Kontakto', admin:'Administrado', rights:'Ĉiuj rajtoj rezervitaj.' },
      modal: { contact:'Kontakti la asocion', next:'Sekva projekto', previous:'Antaŭa projekto', close:'Fermi', place:'Loko', images:'bildoj', back:'Reiri al projektoj' },
      filters: { all:'Ĉiuj', humanitarian:'Humanitara', training:'Trejnado', development:'Disvolviĝo', social:'Socia', youth:'Junularo', education:'Edukado' },
      accessibility: { openMenu:'Malfermi menuon', closeMenu:'Fermi menuon', nextImage:'Sekva bildo', previousImage:'Antaŭa bildo' }
    }
  };

  function getPath(obj, path) { return path.split('.').reduce((acc, key) => acc && acc[key], obj); }
  function t(key) { return getPath(translations[state.lang], key) ?? key; }
  function projectText(project, key) { return project[key]?.[state.lang] || project[key]?.fr || ''; }

  function updateMeta() {
    document.title = t('metaTitle');
    document.documentElement.lang = state.lang === 'eo' ? 'eo' : state.lang;
    document.querySelector('meta[name="description"]').setAttribute('content', t('hero.text'));
    document.getElementById('currentLanguage').textContent = state.lang.toUpperCase();
  }

  function applyTranslations() {
    $$('[data-i18n]').forEach(el => {
      const value = t(el.dataset.i18n);
      if (value) el.textContent = value;
    });
    $('#menuToggle').setAttribute('aria-label', t($('#mainNav').classList.contains('open') ? 'accessibility.closeMenu' : 'accessibility.openMenu'));
    updateMeta();
    renderFilters();
    renderProjects();
    if ($('#projectModal').classList.contains('open')) openProject(state.projectIndex, state.imageIndex, true);
  }

  function renderFilters() {
    const root = $('#projectFilters');
    const keys = ['all','humanitarian','training','development','social','youth','education'];
    root.innerHTML = keys.map(key => `<button class="filter-btn ${state.filter === key ? 'active' : ''}" type="button" data-filter="${key}">${t('filters.' + key)}</button>`).join('');
    $$('.filter-btn', root).forEach(btn => btn.addEventListener('click', () => { state.filter = btn.dataset.filter; renderFilters(); renderProjects(); }));
  }

  function renderProjects() {
    const grid = $('#projectGrid');
    const list = state.filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === state.filter);
    grid.innerHTML = list.map((p, idx) => {
      const absolute = PROJECTS.indexOf(p);
      const title = projectText(p,'title');
      const desc = projectText(p,'description');
      const place = projectText(p,'place');
      return `<article class="project-card reveal visible" tabindex="0" data-project="${absolute}">
        <div class="project-image-wrap"><img src="${p.images[0]}" alt="${escapeHtml(title)}" loading="lazy"><div class="project-gradient"></div><span class="project-count">${p.images.length} ${escapeHtml(t('modal.images'))}</span><button class="project-open" type="button" aria-label="${escapeHtml(title)}">↗</button></div>
        <div class="project-body"><div class="project-topline"><span class="tag">${escapeHtml(t('filters.' + p.category))}</span><span class="project-place">${escapeHtml(place)}</span></div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p><button class="project-link" type="button">${escapeHtml(t('about.link').replace('→',''))}<span>→</span></button></div>
      </article>`;
    }).join('');
    $$('.project-card', grid).forEach(card => {
      const open = () => openProject(Number(card.dataset.project), 0);
      card.addEventListener('click', e => { if (!e.target.closest('button')) open(); });
      card.querySelector('.project-open').addEventListener('click', e => { e.stopPropagation(); open(); });
      card.querySelector('.project-link').addEventListener('click', e => { e.stopPropagation(); open(); });
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }});
    });
    requestAnimationFrame(() => revealElements(grid));
  }

  function openProject(index, imageIndex = 0, soft = false) {
    state.projectIndex = index;
    state.imageIndex = imageIndex;
    const p = PROJECTS[index];
    const modal = $('#projectModal');
    $('#modalTitle').textContent = projectText(p,'title');
    $('#modalDescription').textContent = projectText(p,'description');
    $('#modalCategory').textContent = t('filters.' + p.category);
    $('#modalMeta').innerHTML = `<span><b>${escapeHtml(t('modal.place'))}</b>${escapeHtml(projectText(p,'place'))}</span><span><b>${p.images.length}</b>${escapeHtml(t('modal.images'))}</span>`;
    $('#modalContact').onclick = () => { window.location.hash = 'contact'; closeModal(); };
    $('#modalNextProject').onclick = () => openProject((index + 1) % PROJECTS.length, 0);
    renderModalImage();
    renderThumbs();
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
    if (!soft) $('#modalClose').focus({ preventScroll: true });
  }

  function renderModalImage() {
    const p = PROJECTS[state.projectIndex];
    const img = $('#modalImage');
    img.src = p.images[state.imageIndex];
    img.alt = projectText(p,'title');
    $('#modalCounter').textContent = `${state.imageIndex + 1} / ${p.images.length}`;
    $('#modalPrev').setAttribute('aria-label', t('accessibility.previousImage'));
    $('#modalNext').setAttribute('aria-label', t('accessibility.nextImage'));
  }

  function renderThumbs() {
    const p = PROJECTS[state.projectIndex];
    $('#modalThumbs').innerHTML = p.images.map((src, idx) => `<button type="button" class="thumb ${idx===state.imageIndex?'active':''}" data-image="${idx}"><img src="${src}" alt=""></button>`).join('');
    $$('.thumb', $('#modalThumbs')).forEach(btn => btn.addEventListener('click', () => { state.imageIndex = Number(btn.dataset.image); renderModalImage(); renderThumbs(); }));
  }

  function closeModal() { $('#projectModal').classList.remove('open'); $('#projectModal').setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }

  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }

  function revealElements(scope = document) {
    $$('.reveal:not(.visible)', scope).forEach(el => observer.observe(el));
  }

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  function setLanguage(lang) { if (!translations[lang]) return; state.lang = lang; localStorage.setItem('etimarki-lang', lang); document.getElementById('languageMenu').classList.remove('open'); $('#languageTrigger').setAttribute('aria-expanded','false'); applyTranslations(); }

  // Navigation
  $('#menuToggle').addEventListener('click', () => { const nav = $('#mainNav'); const open = nav.classList.toggle('open'); $('#menuToggle').setAttribute('aria-expanded', String(open)); $('#menuToggle').setAttribute('aria-label', t(open ? 'accessibility.closeMenu' : 'accessibility.openMenu')); });
  $$('#mainNav a').forEach(a => a.addEventListener('click', () => { $('#mainNav').classList.remove('open'); $('#menuToggle').setAttribute('aria-expanded','false'); }));

  // Language
  $('#languageTrigger').addEventListener('click', () => { const menu = $('#languageMenu'); const open = menu.classList.toggle('open'); $('#languageTrigger').setAttribute('aria-expanded', String(open)); });
  $$('#languageMenu [data-lang]').forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
  document.addEventListener('click', e => { if (!e.target.closest('.language-switcher')) { $('#languageMenu').classList.remove('open'); $('#languageTrigger').setAttribute('aria-expanded','false'); } });

  // Modal controls
  $('#modalClose').addEventListener('click', closeModal);
  $$('#projectModal [data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  $('#modalPrev').addEventListener('click', () => { state.imageIndex = (state.imageIndex - 1 + PROJECTS[state.projectIndex].images.length) % PROJECTS[state.projectIndex].images.length; renderModalImage(); renderThumbs(); });
  $('#modalNext').addEventListener('click', () => { state.imageIndex = (state.imageIndex + 1) % PROJECTS[state.projectIndex].images.length; renderModalImage(); renderThumbs(); });
  document.addEventListener('keydown', e => {
    if (!$('#projectModal').classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') $('#modalPrev').click();
    if (e.key === 'ArrowRight') $('#modalNext').click();
  });

  // Contact form
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject') || '').trim();
    const message = String(data.get('message') || '').trim();
    const note = $('#formNote');
    if (!name || !email || !subject || !message) { note.textContent = t('form.error'); note.className = 'form-note error'; return; }
    const body = `${name}\n${email}\n\n${message}`;
    window.location.href = `mailto:pamojahakunamatatardc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = t('form.sent'); note.className = 'form-note success'; e.currentTarget.reset();
  });

  // Scroll progress + back to top
  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    $('#pageProgress').style.width = `${height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0}%`;
    $('#backTop').classList.toggle('show', scrollTop > 650);
    document.querySelector('.site-header').classList.toggle('scrolled', scrollTop > 16);
  }
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  $('#backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Parallax, reduced-motion friendly
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    window.addEventListener('pointermove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      document.querySelectorAll('.ambient').forEach((el, idx) => { el.style.transform = `translate3d(${x*(idx+1)}px, ${y*(idx+1)}px,0)`; });
    }, { passive: true });
  }

  // Init
  renderFilters();
  renderProjects();
  applyTranslations();
  revealElements();
  updateScrollUI();
})();
