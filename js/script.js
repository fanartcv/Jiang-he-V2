(() => {
  const $ = (s) => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const img = (n) => `assets/images/${n}.webp`;
  const pad = (n) => String(n + 1).padStart(2, '0');

  const traits = [
    ['Beautiful, effortlessly.', 'She never has to try. One quiet look from across the room, and everything around her seems to rearrange itself, politely, around her.', 'bride', 'top'],
    ['Adorable without knowing it.', 'She has no idea how she looks when she is flustered, and that is exactly why it is so lovely to watch.', 'blush', 'top'],
    ['A little stubborn.', 'Once she has decided, the whole world may argue. It is part of why you would never want her any other way.', 'hero', 'top'],
    ['Strong, yet gentle.', 'There is steel in her, and somehow it never makes her any less soft.', 'red', 'top'],
    ['Curious about the modern world.', 'Every ordinary thing, a window, a phone, a small snack, becomes a wonder when she looks at it.', 'window', 'top'],
    ['Sometimes unexpectedly mischievous.', 'A quiet little smile, and you know she is up to something. You would gladly let her.', 'smile', 'top']
  ];
  const plates = [
    ['bride', 'center', [250, 330], 'Even a thousand years could not change how lovely you are.', -2],
    ['red', 'top', [340, 440], 'You are someone\u2019s favorite story.', 1.5],
    ['kitchen', 'top', [230, 310], 'You make ordinary days feel like poetry.', -1],
    ['blush', 'top', [260, 320], 'Your smile makes the world feel warmer.', 2],
    ['walk', 'center', [270, 350], 'Time stops a little whenever you walk beside someone.', -1.5],
    ['smile', 'center', [220, 290], 'You are prettier than the morning sun.', 1]
  ];
  const letters = [
    ['Dear Jiang He,', 'You don\u2019t need to understand this strange modern world.\nJust keep being yourself.\nThat\u2019s already more than enough.', '\u2014 someone who is glad you came'],
    ['To the girl from long ago,', 'I hope someone tells you every day how brave you are.\nIf no one has yet, let this be the first time.', '\u2014 always'],
    ['On a quiet evening,', 'I was thinking about how you laugh.\nIt is the best thing I have heard in a thousand years.', '\u2014 yours']
  ];
  const compliments = [
    'You\u2019re prettier than the morning sun.', 'Your smile makes the world feel warmer.',
    'Even a thousand years couldn\u2019t change how lovely you are.', 'You are someone\u2019s favorite story.',
    'Time stops a little whenever you look up.', 'You make ordinary days feel like poetry.'
  ];
  const fade = (el, text) => { el.style.opacity = 0; setTimeout(() => { el.textContent = text; el.style.opacity = 1; }, reduce ? 0 : 350); };

  const bar = $('#progress');
  const onScroll = () => { const h = document.documentElement; bar.style.transform = `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})`; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  const menu = $('#menu'), mb = $('#menuBtn');
  mb.addEventListener('click', () => mb.setAttribute('aria-expanded', menu.classList.toggle('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) { menu.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });

  const tImg = $('#traitImg'), tTitle = $('#traitTitle'), tText = $('#traitText'), tabs = $('#tabs'), index = $('#index');
  const showTrait = (i) => {
    tabs.querySelectorAll('button').forEach((b, k) => b.setAttribute('aria-selected', k === i));
    [tTitle, tText, tImg].forEach((el) => (el.style.opacity = 0));
    setTimeout(() => {
      tTitle.textContent = traits[i][0]; tText.textContent = traits[i][1];
      tImg.src = img(traits[i][2]); tImg.style.objectPosition = traits[i][3];
      [tTitle, tText, tImg].forEach((el) => (el.style.opacity = 1));
    }, reduce ? 0 : 350);
  };
  traits.forEach((t, i) => {
    const li = document.createElement('li'), b = document.createElement('button');
    const n = document.createElement('i'); n.textContent = pad(i); b.append(n, t[0].replace(/\.$/, ''));
    b.addEventListener('click', () => { showTrait(i); $('#little').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
    li.appendChild(b); index.appendChild(li);
    const tb = document.createElement('button'); tb.textContent = pad(i); tb.setAttribute('role', 'tab');
    tb.setAttribute('aria-selected', i === 0); tb.addEventListener('click', () => showTrait(i)); tabs.appendChild(tb);
  });
  tImg.style.objectPosition = 'top';

  const strip = $('#strip'), lb = $('#lightbox');
  const setActive = (i) => {
    strip.querySelectorAll('.plate').forEach((p, k) => p.classList.toggle('on', k === i));
    $('#count').textContent = `${pad(i)} / ${pad(plates.length - 1)}`; $('#plateName').textContent = `Plate ${pad(i)}`;
  };
  plates.forEach((p, i) => {
    const b = document.createElement('button'); b.className = 'plate'; b.style.width = p[2][0] + 'px'; b.style.height = p[2][1] + 'px';
    b.setAttribute('aria-label', `Open plate ${pad(i)}`); b.style.setProperty('--r', p[4] + 'deg');
    const im = new Image(); im.src = img(p[0]); im.alt = ''; im.width = 720; im.height = 1280; im.loading = 'lazy'; im.decoding = 'async'; im.style.objectPosition = p[1];
    b.appendChild(im);
    b.addEventListener('mouseenter', () => setActive(i)); b.addEventListener('focus', () => setActive(i));
    b.addEventListener('click', () => {
      setActive(i); $('#lbImg').src = img(p[0]); $('#lbImg').alt = `Plate ${pad(i)}`; $('#lbLine').textContent = p[3];
      lb.showModal ? lb.showModal() : lb.setAttribute('open', '');
    });
    strip.appendChild(b);
  });
  setActive(0);
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });

  const board = $('#board');
  letters.forEach(([title, text, sign], i) => {
    const b = document.createElement('button'); b.className = 'letter'; b.setAttribute('aria-expanded', 'false');
    const h = document.createElement('h3'); h.textContent = title; const s = document.createElement('span'); s.className = 'seal'; s.textContent = 'J'; h.appendChild(s);
    const body = document.createElement('div'); body.className = 'body'; const p = document.createElement('p'); p.textContent = text;
    const sg = document.createElement('span'); sg.className = 'sign'; sg.textContent = sign; p.appendChild(document.createElement('br')); p.appendChild(sg);
    body.appendChild(p); const fl = document.createElement('span'); fl.className = 'flap'; b.append(fl, h, body);
    b.addEventListener('click', () => b.setAttribute('aria-expanded', b.classList.toggle('open')));
    board.appendChild(b);
    if (i === 0) { b.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
  });

  let last = -1;
  $('#sayBtn').addEventListener('click', () => {
    let i; do { i = Math.floor(Math.random() * compliments.length); } while (i === last);
    last = i; fade($('#sayOut'), compliments[i]);
  });
  $('#again').addEventListener('click', (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  // Falling peach petals (few, CSS-animated, off for reduced motion)
  if (!reduce) {
    const box = $('#petals'); const gap = matchMedia('(max-width: 767px)').matches ? 4500 : 2600;
    setInterval(() => {
      if (document.hidden || box.children.length > 9) return;
      const p = document.createElement('span'); p.className = 'petal';
      p.style.left = Math.random() * 100 + 'vw'; p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
      p.style.animationDuration = (13 + Math.random() * 9) + 's'; box.appendChild(p);
      setTimeout(() => p.remove(), 23000);
    }, gap);
  }
  // Optional ambient music: add assets/music/ambient.mp3
  const audio = $('#audio'), mu = $('#music'), lab = mu.querySelector('span');
  mu.addEventListener('click', () => {
    if (audio.paused) { audio.volume = .4; audio.play().then(() => { lab.textContent = 'on'; mu.setAttribute('aria-pressed', 'true'); }).catch(() => { lab.textContent = 'no file'; }); }
    else { audio.pause(); lab.textContent = 'off'; mu.setAttribute('aria-pressed', 'false'); }
  });
  document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('paused', document.hidden));
})();
