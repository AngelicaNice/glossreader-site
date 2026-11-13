// The playable book page on the home page. It sends nothing anywhere: clicking a
// word shows a translation from the table below, the chips switch highlighting
// by level, "+ В словарь" and "Знаю" mark every copy of the word, as in the app.
(function () {
  var reader = document.getElementById('reader');
  if (!reader) return;
  var page = reader.querySelector('.reader-page');
  var pop = reader.querySelector('.pop');
  var popWord = pop.querySelector('.pop-word');
  var popPos = pop.querySelector('.pop-pos');
  var popLevel = pop.querySelector('.pop-level');
  var popTr = pop.querySelector('.pop-tr');
  var popSyn = pop.querySelector('.pop-syn');
  var saveBtn = pop.querySelector('[data-act="save"]');
  var knownBtn = pop.querySelector('[data-act="known"]');
  var words = Array.prototype.slice.call(page.querySelectorAll('.w'));

  var LEVEL = { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', phrase: 'фраза', name: 'имя' };
  // Short glosses written for this demo in the style of the app's dictionary popup.
  var ENTRIES = {
    alice: { w: 'Alice', pos: 'имя', tr: 'Алиса' },
    beginning: { w: 'beginning', pos: 'от begin, гл.', tr: 'начинать(ся), приниматься; сущ. начало' },
    get: { w: 'get', pos: 'гл.', tr: 'получать; становиться (get tired — устать); добираться' },
    very: { w: 'very', pos: 'нареч.', tr: 'очень, весьма; прил. самый, тот самый' },
    tired: { w: 'tired', pos: 'прил.', tr: 'усталый, уставший' },
    sitting: { w: 'sitting', pos: 'от sit, гл.', tr: 'сидеть; сущ. заседание' },
    sister: { w: 'sister', pos: 'сущ.', tr: 'сестра' },
    bank: { w: 'bank', pos: 'сущ.', tr: 'берег; банк' },
    nothing: { w: 'nothing', pos: 'мест.', tr: 'ничего, ничто' },
    oncetwice: { w: 'once or twice', pos: 'фраза', tr: 'раз-другой, пару раз' },
    peeped: { w: 'peeped', pos: 'от peep, гл.', tr: 'пискнуть; пищать; заглядывать; подглядывать; сущ. писк', syn: 'Синонимы: cheep, peek, chirp, chirrup' },
    book: { w: 'book', pos: 'сущ.', tr: 'книга; гл. бронировать' },
    pictures: { w: 'pictures', pos: 'от picture, сущ.', tr: 'картинка, рисунок; картина' },
    conversations: { w: 'conversations', pos: 'от conversation, сущ.', tr: 'разговор, беседа' },
    use: { w: 'use', pos: 'сущ.', tr: 'польза, толк; употребление; гл. использовать' },
    thought: { w: 'thought', pos: 'от think, гл.', tr: 'подумал(а); сущ. мысль' },
    without: { w: 'without', pos: 'предлог', tr: 'без' },
    remarkable: { w: 'remarkable', pos: 'прил.', tr: 'замечательный, примечательный, удивительный' },
    outofway: { w: 'out of the way', pos: 'фраза', tr: 'необычный, странный; в стороне от дороги' },
    hear: { w: 'hear', pos: 'гл.', tr: 'слышать' },
    rabbit: { w: 'Rabbit', pos: 'сущ.', tr: 'кролик' },
    itself: { w: 'itself', pos: 'мест.', tr: 'себя, сам (сама, само)' },
    ohdear: { w: 'Oh dear', pos: 'фраза', tr: 'ох, батюшки; ах, боже мой' },
    late: { w: 'late', pos: 'прил.', tr: 'поздний; опоздавший; нареч. поздно' }
  };

  var current = null;

  function levelOf(el) {
    for (var k in LEVEL) if (el.classList.contains(k)) return k;
    return 'a1';
  }

  function place(el) {
    var top = el.offsetTop + el.offsetHeight + 8;
    var left = el.offsetLeft;
    var maxLeft = page.clientWidth - pop.offsetWidth - 10;
    pop.style.left = Math.max(10, Math.min(left, maxLeft)) + 'px';
    var below = top + pop.offsetHeight <= page.clientHeight - 6;
    pop.style.top = (below ? top : Math.max(6, el.offsetTop - pop.offsetHeight - 8)) + 'px';
  }

  function sameWord(el) {
    return words.filter(function (w) { return w.dataset.k === el.dataset.k; });
  }

  function open(el) {
    var e = ENTRIES[el.dataset.k];
    if (!e) return;
    current = el;
    popWord.textContent = e.w;
    popPos.textContent = e.pos;
    var lvl = levelOf(el);
    popLevel.textContent = LEVEL[lvl];
    popLevel.dataset.lvl = lvl;
    popTr.textContent = e.tr;
    popSyn.textContent = e.syn || '';
    popSyn.hidden = !e.syn;
    var saved = el.classList.contains('saved');
    saveBtn.setAttribute('aria-pressed', String(saved));
    saveBtn.textContent = saved ? 'В словаре' : '+ В словарь';
    pop.hidden = false;
    place(el);
  }

  function close(returnFocus) {
    if (pop.hidden) return;
    pop.hidden = true;
    if (returnFocus && current) current.focus();
    current = null;
  }

  words.forEach(function (w) {
    w.addEventListener('click', function (ev) {
      ev.stopPropagation();
      if (current === w && !pop.hidden) close(false);
      else open(w);
    });
    w.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        w.click();
      }
    });
  });

  saveBtn.addEventListener('click', function () {
    if (!current) return;
    var on = !current.classList.contains('saved');
    sameWord(current).forEach(function (w) {
      w.classList.toggle('saved', on);
      w.classList.remove('known');
    });
    saveBtn.setAttribute('aria-pressed', String(on));
    saveBtn.textContent = on ? 'В словаре' : '+ В словарь';
  });

  knownBtn.addEventListener('click', function () {
    if (!current) return;
    sameWord(current).forEach(function (w) {
      w.classList.add('known');
      w.classList.remove('saved');
    });
    close(true);
  });

  reader.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var on = chip.getAttribute('aria-pressed') !== 'true';
      chip.setAttribute('aria-pressed', String(on));
      var off = (reader.dataset.off || '').split(' ').filter(function (x) { return x && x !== chip.dataset.lvl; });
      if (!on) off.push(chip.dataset.lvl);
      reader.dataset.off = off.join(' ');
    });
  });

  document.addEventListener('click', function (ev) {
    if (!pop.hidden && !pop.contains(ev.target)) close(false);
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') close(true);
  });
  window.addEventListener('resize', function () {
    if (current && !pop.hidden) place(current);
  });

  // Show one translation from the start, so the page reads as what it is.
  // A web font that arrives late moves the words, so the popup is placed again then.
  var start = page.querySelector('[data-k="peeped"]');
  if (start) {
    open(start);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (current === start && !pop.hidden) place(start);
      });
    }
  }
})();
