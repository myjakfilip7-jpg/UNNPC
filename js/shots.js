/* ==========================================================
   shots.js — HTML "screenshots" of the Notion template.
   Placeholder until real PNG exports exist. To replace one:
   drop <img src="img/dashboard.png" alt=""> inside the
   <figure data-shot="..."> and this file will leave it alone.
   ========================================================== */
(function () {
  const side = (active) => `
    <aside class="nw__side">
      <b>Life RPG</b>
      ${['Pulpit', 'Karta postaci', 'Daily Loop', 'Sezony', 'Skarbiec', 'Skill Tree', 'Boss Log']
        .map((n) => `<span class="${n === active ? 'on' : ''}">${n}</span>`).join('')}
    </aside>`;

  const icon = (d) => `<div class="nw__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#37352f" stroke-width="1.6">${d}</svg></div>`;
  const I = {
    user: '<circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"></path>',
    loop: '<path d="M4 12a8 8 0 1 0 8-8"></path><path d="M4 4v5h5"></path>',
    flag: '<path d="M5 21V4h11l-1 4 1 4H5"></path>',
    vault: '<rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M8 7V4h8v3"></path>',
    tree: '<circle cx="12" cy="5" r="2"></circle><circle cx="6" cy="19" r="2"></circle><circle cx="18" cy="19" r="2"></circle><path d="M12 7v5M12 12l-6 5M12 12l6 5"></path>',
    boss: '<path d="M6 4h12l-1 16H7z"></path><path d="M9 4V2h6v2"></path>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path>',
  };

  const stat = (n, v, pct, acc) => `
    <div class="nw__stat"><div><span>${n}</span><span>${v}</span></div><div class="nw__bar ${acc ? 'acc' : ''}"><i style="width:${pct}%"></i></div></div>`;

  const row = (t, done, tag, cls) => `
    <div class="nw__row"><span class="chk ${done ? 'on' : ''}"></span><span class="${done ? 'done' : ''}">${t}</span><span class="tag ${cls || ''}">${tag}</span></div>`;

  const statsBlock = `
    <div class="nw__cols">
      ${stat('Ciało', 14, 56)}${stat('Umysł', 19, 76)}${stat('Finanse', 11, 44)}${stat('Relacje', 9, 36)}${stat('Rzemiosło', 16, 64)}${stat('Spokój', 12, 48)}
    </div>`;

  const shots = {
    dashboard: `${side('Pulpit')}<div class="nw__page">
      ${icon(I.user)}<div class="nw__title">Filip · Poziom 12</div>
      <div class="nw__kicker">2 340 / 3 000 XP do poziomu 13</div>
      <div class="nw__bar acc"><i style="width:78%"></i></div>
      <div class="nw__cols">
        <div><div class="nw__kicker" style="margin-bottom:6px">Questy dnia</div>
          ${row('Trening 45 min', true, '+40 XP')}${row('Przelew na inwestycje', false, '+60 XP', 'blue')}${row('30 stron książki', false, '+25 XP', 'gray')}
        </div>
        <div><div class="nw__kicker" style="margin-bottom:6px">Main Quest · Sezon 3</div>
          <div style="font-weight:600;margin-bottom:6px">Poduszka 20 000 zł</div>
          <div class="nw__bar"><i style="width:62%"></i></div>
          <div class="nw__kicker" style="margin-top:8px">12 400 zł · 41 dni do bossa</div>
        </div>
      </div></div>`,

    character: `${side('Karta postaci')}<div class="nw__page">
      ${icon(I.user)}<div class="nw__title">Karta postaci</div>
      <div class="nw__kicker">Poziom 12 · Ranga: Adept · 2 340 / 3 000 XP</div>
      <div class="nw__bar acc"><i style="width:78%"></i></div>
      ${statsBlock}
      <div class="nw__kicker">Historia awansów: 11 → 12 (3 wrz), 10 → 11 (2 sie)</div></div>`,

    daily: `${side('Daily Loop')}<div class="nw__page">
      ${icon(I.loop)}<div class="nw__title">Daily Loop · wtorek</div>
      <div class="nw__kicker">Seria: 17 dni · dziś zdobyte: 40 / 125 XP</div>
      ${row('Trening 45 min', true, '+40 XP')}${row('Przelew 500 zł na inwestycje', false, '+60 XP', 'blue')}${row('30 stron „Atomowych nawyków”', false, '+25 XP', 'gray')}
      <div class="nw__kicker">Nawyki</div>
      <div class="nw__grid">${Array.from({ length: 28 }, (_, i) => `<i class="${[3, 9, 15, 22].includes(i) ? '' : 'on'}"></i>`).join('')}</div></div>`,

    season: `${side('Sezony')}<div class="nw__page">
      ${icon(I.flag)}<div class="nw__title">Sezon 3 · dzień 49 / 90</div>
      <div class="nw__kicker">Main Quest</div>
      <div style="font-weight:600;font-size:15px">Poduszka finansowa 20 000 zł</div>
      <div class="nw__bar"><i style="width:62%"></i></div>
      <div class="nw__kicker">Side Questy</div>
      ${row('Przebiec 10 km bez przerwy', true, 'Ciało')}${row('Skończyć kurs Next.js', false, 'Rzemiosło', 'blue')}${row('12 wieczorów bez telefonu', false, 'Spokój', 'gray')}
      <div class="nw__kicker">Boss fight: 31 października · ocena sezonu</div></div>`,

    vault: `${side('Skarbiec')}<div class="nw__page">
      ${icon(I.vault)}<div class="nw__title">Skarbiec</div>
      <div class="nw__cols">
        <div><div class="nw__kicker">Portfel</div><div class="nw__big">18 220 zł</div><div class="nw__kicker">+4,2% w tym miesiącu</div></div>
        <div><div class="nw__kicker">Statystyka Finanse</div><div class="nw__big">11</div><div class="nw__bar acc" style="margin-top:6px"><i style="width:44%"></i></div></div>
      </div>
      <div class="nw__table">
        <span class="h">Aktywo</span><span class="h r">Udział</span><span class="h r">Wartość</span>
        <span>ETF S&amp;P 500</span><span class="r">51%</span><span class="r">9 240 zł</span>
        <span>ETF Świat</span><span class="r">22%</span><span class="r">4 110 zł</span>
        <span>Obligacje EDO</span><span class="r">16%</span><span class="r">3 000 zł</span>
        <span>BTC</span><span class="r">11%</span><span class="r">1 870 zł</span>
      </div></div>`,

    skills: `${side('Skill Tree')}<div class="nw__page">
      ${icon(I.tree)}<div class="nw__title">Skill Tree</div>
      <div class="nw__kicker">Gałąź: Rzemiosło · 3 / 7 odblokowane</div>
      <div class="nw__tree"><span class="nw__node on">HTML/CSS</span><span class="nw__node on">JavaScript</span><span class="nw__node on">React</span><span class="nw__node">Next.js</span><span class="nw__node lock">Backend</span><span class="nw__node lock">Własny SaaS</span></div>
      <div class="nw__kicker">Gałąź: Ciało · 2 / 5</div>
      <div class="nw__tree"><span class="nw__node on">5 km</span><span class="nw__node on">10 km</span><span class="nw__node">Półmaraton</span><span class="nw__node lock">Maraton</span></div>
      <div class="nw__kicker">Następne odblokowanie: Next.js · wymaga 300 XP Rzemiosło</div></div>`,

    boss: `${side('Boss Log')}<div class="nw__page">
      ${icon(I.boss)}<div class="nw__title">Boss Log</div>
      <div class="nw__kicker">Boss tygodnia</div>
      <div style="font-weight:600;font-size:15px">Scrollowanie po 22:00</div>
      <div class="nw__kicker">Wygrane dni: 5 / 7</div>
      <div class="nw__grid" style="grid-template-columns:repeat(7,28px)"><i class="on"></i><i class="on"></i><i></i><i class="on"></i><i class="on"></i><i></i><i class="on"></i></div>
      <div class="nw__kicker">Inni bossowie</div>
      ${row('Prokrastynacja rano', false, '3 / 7', 'red')}${row('Sen < 7h', false, '6 / 7')}${row('Jedzenie na mieście', true, '7 / 7')}</div>`,

    tracker: `${side('Skarbiec')}<div class="nw__page">
      ${icon(I.chart)}<div class="nw__title">Investor Tracker</div>
      <div class="nw__cols">
        <div><div class="nw__kicker">Razem</div><div class="nw__big">18 220 zł</div></div>
        <div><div class="nw__kicker">Wpłacone</div><div class="nw__big">16 400 zł</div></div>
      </div>
      <div class="nw__table">
        <span class="h">Konto / aktywo</span><span class="h r">Ilość</span><span class="h r">Wartość</span>
        <span>IKE · ETF S&amp;P 500</span><span class="r">21</span><span class="r">9 240 zł</span>
        <span>IKE · ETF Świat</span><span class="r">14</span><span class="r">4 110 zł</span>
        <span>Obligacje EDO</span><span class="r">30</span><span class="r">3 000 zł</span>
        <span>Giełda · BTC</span><span class="r">0,007</span><span class="r">1 870 zł</span>
      </div></div>`,
  };

  const themeShot = (cls, title) => `<div class="nw ${cls}">${side('Pulpit')}<div class="nw__page">
      ${icon(I.user)}<div class="nw__title">${title}</div>
      <div class="nw__kicker">Poziom 12 · 2 340 / 3 000 XP</div>
      <div class="nw__bar"><i style="width:78%"></i></div>
      ${row('Trening 45 min', true, '+40 XP')}${row('Przelew na inwestycje', false, '+60 XP', 'blue')}${row('30 stron książki', false, '+25 XP', 'gray')}
    </div></div>`;

  const themes = {
    'theme-terminal': themeShot('t-terminal', '> filip.lvl12'),
    'theme-cyber': themeShot('t-cyber', 'FILIP // LVL 12'),
    'theme-pixel': themeShot('t-pixel', 'FILIP ★ LV.12'),
    'theme-clean': themeShot('', 'Filip · Poziom 12'),
  };

  /* ---------- EN strings (applied when <html lang="en">) ---------- */
  const EN = [
    ['Pulpit', 'Dashboard'], ['Karta postaci', 'Character sheet'], ['Sezony', 'Seasons'], ['Skarbiec', 'Vault'],
    ['Filip · Poziom 12', 'Filip · Level 12'], ['2 340 / 3 000 XP do poziomu 13', '2,340 / 3,000 XP to level 13'],
    ['Questy dnia', 'Today’s quests'], ['Trening 45 min', 'Workout 45 min'], ['Przelew 500 zł na inwestycje', 'Move $150 to investments'],
    ['Przelew na inwestycje', 'Move money to investments'], ['30 stron „Atomowych nawyków”', '30 pages of “Atomic Habits”'], ['30 stron książki', '30 pages of a book'],
    ['Main Quest · Sezon 3', 'Main Quest · Season 3'], ['Poduszka finansowa 20 000 zł', 'Emergency fund $5,000'], ['Poduszka 20 000 zł', 'Emergency fund $5,000'],
    ['12 400 zł · 41 dni do bossa', '$3,100 · 41 days to the boss'],
    ['Poziom 12 · Ranga: Adept · 2 340 / 3 000 XP', 'Level 12 · Rank: Adept · 2,340 / 3,000 XP'], ['Poziom 12 · 2 340 / 3 000 XP', 'Level 12 · 2,340 / 3,000 XP'],
    ['Historia awansów: 11 → 12 (3 wrz), 10 → 11 (2 sie)', 'Level history: 11 → 12 (Sep 3), 10 → 11 (Aug 2)'],
    ['Daily Loop · wtorek', 'Daily Loop · Tuesday'], ['Seria: 17 dni · dziś zdobyte: 40 / 125 XP', 'Streak: 17 days · earned today: 40 / 125 XP'], ['Nawyki', 'Habits'],
    ['Sezon 3 · dzień 49 / 90', 'Season 3 · day 49 / 90'], ['Side Questy', 'Side Quests'], ['Przebiec 10 km bez przerwy', 'Run 10 km non-stop'],
    ['Skończyć kurs Next.js', 'Finish the Next.js course'], ['12 wieczorów bez telefonu', '12 phone-free evenings'], ['Boss fight: 31 października · ocena sezonu', 'Boss fight: Oct 31 · season review'],
    ['Portfel', 'Portfolio'], ['18 220 zł', '$4,560'], ['+4,2% w tym miesiącu', '+4.2% this month'], ['Statystyka Finanse', 'Money stat'],
    ['Aktywo', 'Asset'], ['Udział', 'Share'], ['Wartość', 'Value'], ['ETF S&amp;P 500', 'S&amp;P 500 ETF'], ['ETF Świat', 'World ETF'], ['Obligacje EDO', 'Gov bonds'],
    ['9 240 zł', '$2,310'], ['4 110 zł', '$1,030'], ['3 000 zł', '$750'], ['1 870 zł', '$470'],
    ['Gałąź: Rzemiosło · 3 / 7 odblokowane', 'Branch: Craft · 3 / 7 unlocked'], ['Własny SaaS', 'Own SaaS'], ['Gałąź: Ciało · 2 / 5', 'Branch: Body · 2 / 5'],
    ['Półmaraton', 'Half marathon'], ['Maraton', 'Marathon'], ['Następne odblokowanie: Next.js · wymaga 300 XP Rzemiosło', 'Next unlock: Next.js · needs 300 Craft XP'],
    ['Boss tygodnia', 'Boss of the week'], ['Scrollowanie po 22:00', 'Scrolling after 10 pm'], ['Wygrane dni: 5 / 7', 'Days won: 5 / 7'], ['Inni bossowie', 'Other bosses'],
    ['Prokrastynacja rano', 'Morning procrastination'], ['Sen &lt; 7h', 'Sleep &lt; 7h'], ['Sen < 7h', 'Sleep < 7h'], ['Jedzenie na mieście', 'Eating out'],
    ['Razem', 'Total'], ['Wpłacone', 'Invested'], ['16 400 zł', '$4,100'], ['Konto / aktywo', 'Account / asset'], ['Ilość', 'Qty'],
    ['IKE · ', 'IRA · '], ['Giełda · BTC', 'Exchange · BTC'], ['0,007', '0.007'],
    // stat names last — they appear inside longer strings above
    ['Ciało', 'Body'], ['Umysł', 'Mind'], ['Finanse', 'Money'], ['Relacje', 'People'], ['Rzemiosło', 'Craft'], ['Spokój', 'Calm'],
  ];
  const en = document.documentElement.lang === 'en';
  const tr = (html) => en ? EN.reduce((h, [a, b]) => h.split(a).join(b), html) : html;

  document.querySelectorAll('[data-shot]').forEach((el) => {
    if (el.querySelector('img')) return;
    const key = el.dataset.shot;
    if (themes[key]) el.innerHTML = tr(themes[key]);
    else if (shots[key]) el.innerHTML = tr(`<div class="nw">${shots[key]}</div>`);
  });
})();
