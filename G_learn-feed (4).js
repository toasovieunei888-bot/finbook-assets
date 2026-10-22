/*! G_learn-feed.js  まなぶ ショート動画フィード（会員ホーム組み込み版）v3（画面いっぱい表示・終わりのおすすめ動画を出さない）
    置き場所: toasovieunei888-bot/finbook-assets 直下
    読み込み: 会員ホーム1個目のEmbedの最下部（D_knowledge-videos.js の行の下）
    仕組み:
      ・下のメニューで「まなぶ」を押すと、まず縦スワイプのショート動画が流れる
      ・上の「▶ ショート／📚 カテゴリー」で、今までのまなぶ画面（知識・実践）と切り替える
      ・ショートの上のカテゴリー（恋愛・暗号通貨など）で絞り込める
    動画の足し方:
      下の FEED に1行足す（上にあるほど先に流れる）
        c: カテゴリー名（同じ名前どうしでまとまる。新しい名前を書くとカテゴリーが自動で増える）
        t: タイトル   d: ひとこと説明（空でもOK）
        v: Vimeo の共有URL（限定公開は https://vimeo.com/数字/英数字 の形で末尾まで）
        r: 縦動画なら 'tate'、横動画なら空（''）
        h: 本編の動画（シリーズ記号-回）。例 'okane-01' ＝お金の歴史の1本目。空なら「本編を見る」は出ない
           シリーズ記号 → okane お金の歴史 / crypto 暗号通貨 / ai AIの誕生と進化 / jiko 自己啓発
                          sagi 詐欺予防 / kenko 健康がもたらす経済の変化 / zei 税
      GitHubでコミット → purge URL を開く → 会員ホームを再読み込み
    purge URL:
      https://purge.jsdelivr.net/gh/toasovieunei888-bot/finbook-assets@main/G_learn-feed.js
*/
(function () {
  'use strict';

  /* ====== ショート動画（ここだけ触ればOK） ====== */
  var FEED = [
    { c: 'お金の歴史', t: 'お金ってなに？', d: 'お金の歴史 第1話の切り抜き（1）', v: 'https://vimeo.com/1238245544', r: 'tate', h: 'okane-01' },
    { c: 'お金の歴史', t: 'お金ってなに？ その2', d: 'お金の歴史 第1話の切り抜き（2）', v: 'https://vimeo.com/1238254064', r: 'tate', h: 'okane-01' },
    { c: 'お金の歴史', t: 'お金ってなに？ その3', d: 'お金の歴史 第1話の切り抜き（3）', v: 'https://vimeo.com/1238254431', r: 'tate', h: 'okane-01' }
  ];

  /* カテゴリーごとのアイコンと色（無いカテゴリーは📘と水色になる） */
  var CAT = {
    'お金の歴史': ['🪙', '#FFECC0', '#FFDA85'],
    '恋愛':       ['💗', '#FAD5CF', '#F2A99F'],
    '暗号通貨':   ['₿',  '#FFE4BE', '#FFCC85'],
    'AI':         ['🤖', '#C7DFF7', '#9CC3EC'],
    '自己啓発':   ['🌱', '#C6EBDB', '#95D8BC'],
    '詐欺予防':   ['🛡', '#E5DAF6', '#CBB3EE'],
    '健康':       ['🍎', '#C6EBDB', '#95D8BC'],
    '税':         ['🧾', '#FFECC0', '#FFDA85'],
    '副業':       ['💼', '#C7DFF7', '#9CC3EC']
  };
  /* D_knowledge-videos.js のシリーズの並び（変えない） */
  var SERIES_KEYS = ['okane', 'crypto', 'ai', 'jiko', 'sagi', 'kenko', 'zei'];
  var AUTO_NEXT_MS = 2000; // 見終わってから次の動画へ進むまで
  var OWL = 'https://cdn.prod.website-files.com/69bcd664c814f802dfc1f9bc/69d8deb5900a43804580bd24_%E5%AE%98%E5%BA%81%E3%80%80%E7%B4%94%E7%99%BD.jpg';

  /* ====== ここから下は触らない ====== */
  var PREVIEW = !!window.LF_PREVIEW; // プレビュー用（動画の代わりにダミーを流す）
  if (window.LF_OWL !== undefined) OWL = window.LF_OWL;
  var app = document.getElementById('fbapp');
  var learn = document.getElementById('scr-learn');
  if (!app || !learn) { console.warn('[LF] #fbapp / #scr-learn が見つからない'); return; }
  if (document.getElementById('lfWrap')) return;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function parseVimeo(raw) {
    raw = String(raw || '').trim();
    if (!raw) return null;
    var id = (raw.match(/(?:video\/|vimeo\.com\/)(\d{5,})/) || raw.match(/^(\d{5,})/) || [])[1];
    if (!id) return null;
    var h = (raw.match(/[?&]h=([0-9a-zA-Z]+)/) || raw.match(/vimeo\.com\/\d+\/([0-9a-zA-Z]+)/) || [])[1] || '';
    return { id: id, h: h };
  }
  function catOf(c) { return CAT[c] || ['📘', '#D9EEF8', '#B5DDF0']; }
  var ITEMS = FEED.map(function (f, i) {
    var p = parseVimeo(f.v);
    return { i: i, key: p ? p.id : 'x' + i, c: f.c || 'そのほか', t: f.t || '', d: f.d || '', p: p, tate: f.r === 'tate', h: String(f.h || '').trim() };
  }).filter(function (x) { return x.p || PREVIEW; });

  /* いいね・保存（この端末だけに保存） */
  var store = { like: {}, save: {} };
  try { var sv = JSON.parse(localStorage.getItem('lf-store') || '{}'); store.like = sv.like || {}; store.save = sv.save || {}; } catch (e) {}
  function saveStore() { try { localStorage.setItem('lf-store', JSON.stringify(store)); } catch (e) {} }

  /* ====== CSS ====== */
  var css = ''
    + 'html.lf-lock,html.lf-lock body{overflow:hidden!important;overscroll-behavior:none}'
    + '#scr-learn.lf-on>*{display:none!important}'
    + '#fbapp:not(.lf-show)>.lf-wrap{display:none!important}'
    + '#scr-learn>.sec-t{display:none!important}'
    + '#fbapp .lf-mode{display:flex;gap:8px;margin:0 0 10px}'
    + '#fbapp .lf-mode button{flex:1;border:2px solid var(--bd);background:rgba(255,253,244,.7);border-radius:999px;padding:9px 8px;font-family:inherit;font-size:13.5px;font-weight:800;color:var(--ink2);cursor:pointer}'
    + '#fbapp .lf-mode button.on{background:var(--card);color:var(--ink);border-color:var(--gold);box-shadow:var(--sh)}'
    + '#fbapp .lf-wrap{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;bottom:86px;z-index:55;background:#1E2A33;overflow:hidden}'
    + '#fbapp .lf-top{position:absolute;left:0;right:0;top:0;z-index:20;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 18px;background:linear-gradient(180deg,rgba(20,30,38,.72) 0%,rgba(20,30,38,.35) 65%,rgba(20,30,38,0) 100%);pointer-events:none}'
    + '#fbapp .lf-top>*{pointer-events:auto}'
    + '#fbapp .lf-seg{display:flex;justify-content:center;gap:6px;margin-bottom:9px}'
    + '#fbapp .lf-seg button{border:0;background:transparent;font-family:inherit;font-size:15px;font-weight:800;color:rgba(255,255,255,.62);padding:4px 10px;cursor:pointer;position:relative}'
    + '#fbapp .lf-seg button.on{color:#fff}'
    + '#fbapp .lf-seg button.on::after{content:"";position:absolute;left:50%;bottom:-3px;transform:translateX(-50%);width:22px;height:3px;border-radius:3px;background:var(--gold)}'
    + '#fbapp .lf-chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:0 2px 2px}'
    + '#fbapp .lf-chips::-webkit-scrollbar{display:none}'
    + '#fbapp .lf-chip{flex-shrink:0;display:flex;align-items:center;gap:4px;border:1.5px solid rgba(255,255,255,.28);background:rgba(255,255,255,.14);border-radius:999px;padding:5px 12px 5px 8px;font-family:inherit;font-size:12px;font-weight:800;color:#fff;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}'
    + '#fbapp .lf-chip .e{font-size:13px;line-height:1}'
    + '#fbapp .lf-chip.on{border-color:#fff;background:linear-gradient(135deg,#6FC868,var(--leaf));box-shadow:0 2px 0 var(--leafd)}'
    + '#fbapp .lf-feed{position:absolute;inset:0;overflow-y:auto;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none;-webkit-overflow-scrolling:touch}'
    + '#fbapp .lf-feed::-webkit-scrollbar{display:none}'
    + '#fbapp .lf-sl{position:relative;height:var(--lfh,600px);scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden;background:#1E2A33}'
    + '#fbapp .lf-pl{position:absolute;inset:0;overflow:hidden}'
    + '#fbapp .lf-pl iframe{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border:0;display:block;pointer-events:none;width:100%;height:calc(var(--lfw,390px)*.5625)}'
    + '#fbapp .lf-pl.tate iframe{width:max(var(--lfw,390px),calc(var(--lfh,600px)*.5625));height:max(var(--lfh,600px),calc(var(--lfw,390px)*1.7778))}'
    + '#fbapp .lf-pl .cv{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:0 30px 120px}'
    + '#fbapp .lf-pl .cv .em{font-size:54px;line-height:1}'
    + '#fbapp .lf-pl .cv b{font-size:19px;font-weight:800;line-height:1.4;color:var(--ink)}'
    + '#fbapp .lf-pl .cv small{font-size:11px;font-weight:800;color:var(--ink2);background:rgba(255,253,244,.85);border-radius:999px;padding:3px 11px}'
    + '#fbapp .lf-shade{position:absolute;left:0;right:0;bottom:0;height:46%;z-index:2;pointer-events:none;background:linear-gradient(0deg,rgba(20,30,38,.82) 0%,rgba(20,30,38,.45) 45%,rgba(20,30,38,0) 100%)}'
    + '#fbapp .lf-tap{position:absolute;inset:0;z-index:3;background:transparent;cursor:pointer}'
    + '#fbapp .lf-ic{position:absolute;inset:0;z-index:4;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0;transition:opacity .2s}'
    + '#fbapp .lf-ic span{width:72px;height:72px;border-radius:50%;background:rgba(255,253,244,.9);display:flex;align-items:center;justify-content:center;font-size:30px;color:var(--leafd);box-shadow:0 4px 0 rgba(0,0,0,.2)}'
    + '#fbapp .lf-sl.paused .lf-ic{opacity:1}'
    + '#fbapp .lf-sl.fin .lf-pl iframe{visibility:hidden}'
    + '#fbapp .lf-sl.fin .lf-pl .cv{display:flex!important}'
    + '#fbapp .lf-sl.fin .lf-ic{opacity:1}'
    + '#fbapp .lf-sl.fin .lf-ic span{font-size:26px}'
    + '#fbapp .lf-mute{position:absolute;left:12px;top:calc(104px + env(safe-area-inset-top,0px));z-index:5;pointer-events:none;font-size:12px;font-weight:800;color:#fff;background:rgba(20,30,38,.6);border-radius:999px;padding:6px 12px;display:none}'
    + '#fbapp .lf-sl.muted .lf-mute{display:block}'
    + '#fbapp .lf-bar{position:absolute;left:0;right:0;bottom:0;height:4px;z-index:6;background:rgba(255,255,255,.22)}'
    + '#fbapp .lf-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#FFE07A,var(--gold))}'
    + '#fbapp .lf-info{position:absolute;left:14px;right:78px;bottom:22px;z-index:6;color:#fff;pointer-events:none}'
    + '#fbapp .lf-info>*{pointer-events:auto}'
    + '#fbapp .lf-info .ct{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:800;color:var(--ink);background:rgba(255,253,244,.92);border-radius:999px;padding:3px 10px}'
    + '#fbapp .lf-info h3{font-size:17px;font-weight:800;line-height:1.4;margin-top:7px;text-shadow:0 1px 6px rgba(0,0,0,.45)}'
    + '#fbapp .lf-info p{font-size:12.5px;font-weight:700;line-height:1.55;margin-top:3px;opacity:.9;text-shadow:0 1px 6px rgba(0,0,0,.45)}'
    + '#fbapp .lf-full{display:inline-flex;align-items:center;gap:6px;margin-top:11px;border:2px solid #fff;font-family:inherit;font-size:14px;font-weight:800;color:#fff;background:linear-gradient(135deg,#6FC868,var(--leaf));border-radius:999px;padding:10px 18px;box-shadow:0 4px 0 var(--leafd);cursor:pointer}'
    + '#fbapp .lf-act{position:absolute;right:10px;bottom:30px;z-index:6;display:flex;flex-direction:column;gap:16px;align-items:center}'
    + '#fbapp .lf-act button{border:0;background:transparent;display:flex;flex-direction:column;align-items:center;gap:3px;font-family:inherit;cursor:pointer;color:#fff;font-size:11px;font-weight:800;text-shadow:0 1px 4px rgba(0,0,0,.5)}'
    + '#fbapp .lf-act button .ic{width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.18);border:1.5px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}'
    + '#fbapp .lf-act button.on .ic{background:rgba(255,255,255,.92);border-color:#fff}'
    + '#fbapp .lf-swipe{position:absolute;left:50%;top:60%;transform:translateX(-50%);z-index:6;pointer-events:none;font-size:12px;font-weight:800;color:#fff;background:rgba(20,30,38,.55);border-radius:999px;padding:6px 14px;white-space:nowrap;animation:lfbob 1.6s ease-in-out infinite}'
    + '#fbapp .lf-next{position:absolute;left:50%;top:46%;transform:translateX(-50%);z-index:7;font-size:13px;font-weight:800;color:#7A5200;background:linear-gradient(135deg,#FFE07A,var(--gold));border:2px solid #fff;border-radius:999px;padding:7px 16px;box-shadow:0 3px 0 var(--goldd);opacity:0;transition:opacity .2s;pointer-events:none;white-space:nowrap}'
    + '#fbapp .lf-sl.ending .lf-next{opacity:1}'
    + '#fbapp .lf-end{display:flex;align-items:center;justify-content:center;padding:110px 18px 30px;background:linear-gradient(180deg,#9BDAF6 0,#DDF3FC 60%,#EAF7E4 100%)}'
    + '#fbapp .lf-endc{width:100%;background:var(--card);border:2.5px solid var(--gold);border-radius:22px;box-shadow:0 5px 0 var(--goldd);padding:22px 18px 18px;text-align:center}'
    + '#fbapp .lf-endc .ow{width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #fff;box-shadow:0 3px 0 var(--goldd);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;background:#FFF9E2;font-size:34px}'
    + '#fbapp .lf-endc b{display:block;font-size:16px;font-weight:800;line-height:1.45}'
    + '#fbapp .lf-endc p{font-size:12.5px;font-weight:700;color:var(--ink2);line-height:1.7;margin-top:5px}'
    + '#fbapp .lf-endc .bt{display:flex;flex-direction:column;gap:9px;margin-top:15px}'
    + '#fbapp .lf-endc .bt button{font-family:inherit;font-size:14px;font-weight:800;border-radius:999px;padding:12px;cursor:pointer;border:2px solid var(--bd);background:var(--card);color:var(--ink)}'
    + '#fbapp .lf-endc .bt .go{border:0;background:linear-gradient(135deg,#6FC868,var(--leaf));color:#fff;box-shadow:0 4px 0 var(--leafd)}'
    + '#fbapp .lf-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6px;height:100%;font-size:13px;font-weight:700;color:#fff;padding:0 24px}'
    + '#fbapp .lf-empty b{font-size:16px}'
    + '#fbapp .lf-hint{display:none}'
    + '@keyframes lfbob{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,-5px)}}'
    + '@media (prefers-reduced-motion:reduce){#fbapp .lf-swipe{animation:none}}';
  var st = document.createElement('style');
  st.id = 'lf-style';
  st.textContent = css;
  document.head.appendChild(st);

  /* ====== 画面に部品を足す ====== */
  var mode = document.createElement('div');
  mode.className = 'lf-mode';
  mode.innerHTML = '<button type="button" data-m="feed">▶ ショート</button><button type="button" data-m="list">📚 カテゴリー</button>';
  var wrap = document.createElement('div');
  wrap.className = 'lf-wrap';
  wrap.id = 'lfWrap';
  wrap.innerHTML = '<div class="lf-feed" id="lfFeed" tabindex="0" aria-label="ショート動画"></div>'
    + '<div class="lf-top"><div class="lf-seg"><button type="button" data-m="feed" class="on">ショート</button><button type="button" data-m="list">カテゴリー</button></div><div class="lf-chips" id="lfChips"></div></div>'
    + '<div class="lf-hint" id="lfHint"></div>';
  /* 全画面部分はヘッダーより上に出すため #fbapp の直下に置く */
  app.appendChild(wrap);
  learn.insertBefore(mode, learn.firstChild);

  var feed = $('lfFeed'), chips = $('lfChips'), hint = $('lfHint');
  var curMode = 'feed', curCat = 'すべて';
  var slides = [], active = -1, players = {}, unmuted = false, nextTimer = 0, previewRaf = 0, swiped = false;

  /* ====== Vimeo Player API ====== */
  var apiReady = null;
  function loadApi() {
    if (PREVIEW) return Promise.resolve(null);
    if (window.Vimeo && window.Vimeo.Player) return Promise.resolve(window.Vimeo);
    if (apiReady) return apiReady;
    apiReady = new Promise(function (res) {
      var s = document.createElement('script');
      s.src = 'https://player.vimeo.com/api/player.js';
      s.onload = function () { res(window.Vimeo || null); };
      s.onerror = function () { res(null); };
      document.head.appendChild(s);
    });
    return apiReady;
  }

  /* ====== 表示する動画の並び ====== */
  function catList() {
    var seen = {}, out = [];
    ITEMS.forEach(function (x) { if (!seen[x.c]) { seen[x.c] = 1; out.push(x.c); } });
    return out;
  }
  function currentItems() {
    if (curCat === 'すべて') return ITEMS.slice();
    if (curCat === '__save') return ITEMS.filter(function (x) { return store.save[x.key]; });
    return ITEMS.filter(function (x) { return x.c === curCat; });
  }

  function renderChips() {
    var names = ['すべて'].concat(catList());
    var hasSave = ITEMS.some(function (x) { return store.save[x.key]; });
    var h = names.map(function (n) {
      var e = n === 'すべて' ? ['✨', '#FFF9E2', '#FFF9E2'] : catOf(n);
      return '<button type="button" class="lf-chip' + (n === curCat ? ' on' : '') + '" data-c="' + esc(n) + '"><span class="e">' + e[0] + '</span>' + esc(n) + '</button>';
    }).join('');
    if (hasSave) h += '<button type="button" class="lf-chip' + (curCat === '__save' ? ' on' : '') + '" data-c="__save"><span class="e">⭐</span>保存した動画</button>';
    chips.innerHTML = h;
  }

  function slideHtml(x, first) {
    var e = catOf(x.c);
    return '<div class="lf-sl muted" data-k="' + esc(x.key) + '">'
      + '<div class="lf-pl' + (x.tate ? ' tate' : '') + '" style="background:linear-gradient(160deg,' + e[1] + ',' + e[2] + ')">'
      + '<div class="cv"><span class="em">' + e[0] + '</span><b>' + esc(x.t) + '</b><small>' + (PREVIEW ? 'サンプル動画（30秒）' : '読み込み中…') + '</small></div>'
      + '</div>'
      + '<div class="lf-shade"></div>'
      + '<div class="lf-tap" role="button" aria-label="再生・一時停止"></div>'
      + '<div class="lf-ic"><span>▶</span></div>'
      + '<span class="lf-mute">🔇 タップで音が出ます</span>'
      + '<div class="lf-info"><span class="ct">' + e[0] + ' ' + esc(x.c) + '</span><h3>' + esc(x.t) + '</h3>' + (x.d ? '<p>' + esc(x.d) + '</p>' : '')
      + (x.h ? '<button type="button" class="lf-full" data-act="full">🎬 本編を見る ▶</button>' : '') + '</div>'
      + '<div class="lf-act">'
      + '<button type="button" class="lk' + (store.like[x.key] ? ' on' : '') + '" aria-label="いいね"><span class="ic">' + (store.like[x.key] ? '❤️' : '🤍') + '</span>いいね</button>'
      + '<button type="button" class="sv' + (store.save[x.key] ? ' on' : '') + '" aria-label="保存"><span class="ic">⭐</span>保存</button>'
      + '</div>'
      + (first ? '<span class="lf-swipe">↑ 上にスワイプで次の動画</span>' : '')
      + '<span class="lf-next">次の動画へ ▶</span>'
      + '<div class="lf-bar"><i></i></div>'
      + '</div>';
  }

  function nextCatName() {
    var cs = catList();
    if (curCat === 'すべて' || curCat === '__save' || cs.length < 2) return '';
    return cs[(cs.indexOf(curCat) + 1) % cs.length];
  }
  function endHtml() {
    var nc = nextCatName();
    var label = curCat === 'すべて' ? 'ショートは全部見ました！' : curCat === '__save' ? '保存した動画は以上です' : '「' + esc(curCat) + '」は全部見ました！';
    return '<div class="lf-sl lf-end" data-end="1"><div class="lf-endc">'
      + (OWL ? '<img class="ow" src="' + OWL + '" alt="">' : '<span class="ow">🦉</span>')
      + '<b>' + label + '</b><p>新しい動画は追加されしだい、ここに流れます。<br>じっくり学ぶならカテゴリーから。</p>'
      + '<div class="bt">' + (nc ? '<button type="button" class="go" data-act="nextcat">「' + esc(nc) + '」も見る ▶</button>' : '<button type="button" class="go" data-act="top">最初から見る ↺</button>')
      + '<button type="button" data-act="list">📚 カテゴリーで探す</button></div></div></div>';
  }

  function renderFeed() {
    teardownAll();
    var items = currentItems();
    if (!items.length) {
      feed.innerHTML = '<div class="lf-empty"><b>ショート動画は準備中です</b>動画が入りしだい、ここに流れます。<br>今はカテゴリーから見られます。</div>';
      slides = [];
      return;
    }
    feed.innerHTML = items.map(function (x, i) { return slideHtml(x, i === 0); }).join('') + endHtml();
    slides = Array.prototype.slice.call(feed.querySelectorAll('.lf-sl'));
    slides.forEach(function (s, i) { s._item = items[i] || null; });
    feed.scrollTop = 0;
    active = -1;
    observe();
  }

  /* ====== 高さ合わせ ====== */
  function layout() {
    if (!learn.classList.contains('on') || curMode !== 'feed') return;
    var nav = app.querySelector('.nav');
    var navH = nav ? Math.round(nav.getBoundingClientRect().height) : 86;
    wrap.style.bottom = navH + 'px';
    var h = wrap.clientHeight, w = wrap.clientWidth;
    feed.style.setProperty('--lfh', h + 'px');
    feed.style.setProperty('--lfw', w + 'px');
  }

  /* ====== どの動画が画面に出ているか ====== */
  var io = null;
  function observe() {
    if (io) io.disconnect();
    if (!('IntersectionObserver' in window)) { setActive(0); return; }
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= 0.6) setActive(slides.indexOf(e.target));
      });
    }, { root: feed, threshold: [0.6] });
    slides.forEach(function (s) { io.observe(s); });
  }

  function setActive(i) {
    if (i < 0 || i === active) return;
    if (active >= 0 && i !== active) swiped = true;
    clearTimeout(nextTimer);
    var prev = slides[active];
    if (prev) { prev.classList.remove('ending', 'paused', 'fin'); prev._ended = false; var pic = prev.querySelector('.lf-ic span'); if (pic) pic.textContent = '▶'; pauseSlide(prev); }
    active = i;
    /* 今の1本と前後1本だけプレーヤーを持つ（重くしないため） */
    slides.forEach(function (s, j) { if (Math.abs(j - i) > 1) destroySlide(s); });
    var s = slides[i];
    if (!s || s.dataset.end) return;
    mountSlide(s, true);
    if (slides[i + 1] && !slides[i + 1].dataset.end) mountSlide(slides[i + 1], false);
  }

  /* ====== プレーヤー ====== */
  function mountSlide(s, play) {
    var x = s._item; if (!x) return;
    if (PREVIEW) { if (play) previewPlay(s); return; }
    if (s._ifr) { if (play) playSlide(s); return; }
    var pl = s.querySelector('.lf-pl');
    var src = 'https://player.vimeo.com/video/' + x.p.id + '?' + (x.p.h ? 'h=' + x.p.h + '&' : '')
      + 'autoplay=' + (play ? 1 : 0) + '&muted=1&playsinline=1&loop=0&title=0&byline=0&portrait=0&dnt=1&autopause=0';
    var f = document.createElement('iframe');
    f.src = src;
    f.allow = 'autoplay; fullscreen; picture-in-picture';
    f.setAttribute('allowfullscreen', '');
    f.title = x.t;
    pl.appendChild(f);
    s._ifr = f;
    loadApi().then(function (V) {
      if (!V || !s._ifr) return;
      var p = new V.Player(f);
      s._pl = p;
      p.on('timeupdate', function (d) {
        var b = s.querySelector('.lf-bar i'); if (b) b.style.width = Math.min(100, (d.percent || 0) * 100) + '%';
        /* 終わる直前で止める（Vimeoの「次の動画」画面を出さないため） */
        if (!s._ended && d.duration && d.seconds >= d.duration - 0.35) { s._ended = true; p.pause().catch(function () {}); onEnded(s); }
      });
      p.on('play', function () { s.classList.remove('paused'); var cv = s.querySelector('.cv'); if (cv) cv.style.display = 'none'; });
      p.on('pause', function () { if (slides[active] === s && !s._ended) s.classList.add('paused'); });
      p.on('ended', function () { if (!s._ended) { s._ended = true; onEnded(s); } else { s.classList.add('fin'); } });
      if (slides[active] === s) playSlide(s);
    });
  }
  function playSlide(s) {
    if (PREVIEW) { previewPlay(s); return; }
    var p = s._pl; if (!p) return;
    s._ended = false;
    p.setMuted(!unmuted).catch(function () {});
    s.classList.toggle('muted', !unmuted);
    p.play().catch(function () {
      /* 音ありの自動再生が止められた → ミュートでやり直す */
      p.setMuted(true).then(function () { s.classList.add('muted'); return p.play(); }).catch(function () { s.classList.add('paused'); });
    });
  }
  function pauseSlide(s) {
    if (PREVIEW) { cancelAnimationFrame(previewRaf); return; }
    if (s._pl) { s._pl.pause().catch(function () {}); s._pl.setCurrentTime(0).catch(function () {}); }
    var b = s.querySelector('.lf-bar i'); if (b) b.style.width = '0';
  }
  function destroySlide(s) {
    if (s._pl) { try { s._pl.destroy(); } catch (e) {} s._pl = null; }
    if (s._ifr) { if (s._ifr.parentNode) s._ifr.parentNode.removeChild(s._ifr); s._ifr = null; }
    var cv = s.querySelector('.cv'); if (cv) cv.style.display = '';
  }
  function teardownAll() {
    clearTimeout(nextTimer); cancelAnimationFrame(previewRaf);
    slides.forEach(destroySlide);
    active = -1;
  }

  function onEnded(s) {
    s.classList.add('fin');
    var ic = s.querySelector('.lf-ic span'); if (ic) ic.textContent = '↺';
    if (slides[active] !== s) return;
    s.classList.add('ending');
    clearTimeout(nextTimer);
    nextTimer = setTimeout(function () { goTo(active + 1); }, AUTO_NEXT_MS);
  }
  function goTo(i) {
    var t = slides[i]; if (!t) return;
    var y = feed.scrollTop + (t.getBoundingClientRect().top - feed.getBoundingClientRect().top);
    feed.scrollTo({ top: y, behavior: 'smooth' });
  }

  /* プレビュー用のダミー再生（30秒） */
  function previewPlay(s) {
    cancelAnimationFrame(previewRaf);
    var bar = s.querySelector('.lf-bar i'), dur = 30000, el = s._el || 0, last = performance.now();
    s._ended = false; s.classList.toggle('muted', !unmuted);
    (function tick(now) {
      var dt = now - last; last = now;
      if (slides[active] !== s) return;
      if (!s.classList.contains('paused') && learn.classList.contains('on') && curMode === 'feed') {
        el += dt; s._el = el;
        bar.style.width = Math.min(100, el / dur * 100) + '%';
        if (el >= dur) { s._el = 0; s._ended = true; onEnded(s); return; }
      }
      previewRaf = requestAnimationFrame(tick);
    })(last);
  }

  /* ====== タップ ====== */
  function onTap(s) {
    hideHint();
    if (s._ended) { clearTimeout(nextTimer); s.classList.remove('ending', 'fin'); s._ended = false; var ic0 = s.querySelector('.lf-ic span'); if (ic0) ic0.textContent = '▶'; if (PREVIEW) { s._el = 0; previewPlay(s); } else if (s._pl) { s._pl.setCurrentTime(0); playSlide(s); } return; }
    if (!unmuted) {
      unmuted = true;
      s.classList.remove('muted', 'paused');
      if (s._pl) {
        s._pl.setMuted(false).then(function () { return s._pl.setVolume(1); }).then(function () { return s._pl.play(); }).catch(function () {
          /* 端末がミュート解除を止めた場合 */
          unmuted = false; s.classList.add('muted');
        });
      }
      return;
    }
    var paused = s.classList.toggle('paused');
    if (PREVIEW) return;
    if (s._pl) { if (paused) s._pl.pause().catch(function () {}); else s._pl.play().catch(function () {}); }
  }

  var hintT = 0;
  function showHint() { hint.classList.add('on'); clearTimeout(hintT); hintT = setTimeout(hideHint, 3000); }
  function hideHint() { hint.classList.remove('on'); }

  /* ====== イベント ====== */
  feed.addEventListener('click', function (ev) {
    var s = ev.target.closest('.lf-sl'); if (!s) return;
    var b = ev.target.closest('button');
    if (b && b.dataset.act) {
      if (b.dataset.act === 'list') setMode('list');
      else if (b.dataset.act === 'top') goTo(0);
      else if (b.dataset.act === 'full') openFull(s._item);
      else if (b.dataset.act === 'nextcat') { curCat = nextCatName() || 'すべて'; renderChips(); renderFeed(); }
      return;
    }
    var x = s._item;
    if (b && x) {
      if (b.classList.contains('lk')) { store.like[x.key] = !store.like[x.key]; if (!store.like[x.key]) delete store.like[x.key]; b.classList.toggle('on', !!store.like[x.key]); b.querySelector('.ic').textContent = store.like[x.key] ? '❤️' : '🤍'; saveStore(); }
      if (b.classList.contains('sv')) { store.save[x.key] = !store.save[x.key]; if (!store.save[x.key]) delete store.save[x.key]; b.classList.toggle('on', !!store.save[x.key]); saveStore(); renderChips(); toast(store.save[x.key] ? '⭐ 保存しました' : '保存を外しました'); }
      return;
    }
    if (ev.target.closest('.lf-tap')) onTap(s);
  });
  feed.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); goTo(active + 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); goTo(active - 1); }
    if (e.key === ' ' && slides[active] && !slides[active].dataset.end) { e.preventDefault(); onTap(slides[active]); }
  });
  chips.addEventListener('click', function (ev) {
    var b = ev.target.closest('.lf-chip'); if (!b) return;
    curCat = b.dataset.c; renderChips(); renderFeed();
    b = chips.querySelector('.lf-chip.on'); if (b && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  });
  mode.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (b) setMode(b.dataset.m); });
  wrap.querySelector('.lf-seg').addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (b) setMode(b.dataset.m); });

  /* 本編（知識タブの動画）を開く。D_knowledge-videos.js の画面をそのまま使う
     流れ：カテゴリー表示に切り替え → シリーズ一覧 → その回の視聴画面
     （本編から戻るとシリーズ一覧 → まなぶのカテゴリーに戻る） */
  function openFull(x) {
    if (!x || !x.h) return;
    var m = x.h.match(/^([a-z]+)-?(\d+)$/);
    var si = m ? SERIES_KEYS.indexOf(m[1]) : -1, ei = m ? parseInt(m[2], 10) - 1 : -1;
    if (si < 0 || ei < 0) { toast('本編の指定が正しくありません（' + x.h + '）'); return; }
    if (slides[active]) { slides[active].classList.add('paused'); pauseSlide(slides[active]); }
    if (PREVIEW) { toast('🎬 本番では「' + x.t + '」の本編が開きます'); return; }
    var card = document.querySelector('#subB [data-kvs="' + si + '"]');
    if (!card) { toast('本編を開けませんでした'); return; }
    setMode('list');
    var tb = app.querySelector('.subtab[data-sub="b"]');
    if (tb && !tb.classList.contains('on')) tb.click();
    card.click();
    setTimeout(function () {
      var row = document.querySelector('#kvsList [data-kvi="' + ei + '"]');
      if (row && !row.disabled) row.click();
      else toast('この本編はまだ準備中です');
    }, 60);
  }

  function toast(msg) {
    var t = $('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._lf); t._lf = setTimeout(function () { t.classList.remove('on'); }, 2000);
  }

  /* ====== ショート／カテゴリー切替 ====== */
  function syncSeg() {
    [mode, wrap.querySelector('.lf-seg')].forEach(function (g) { g.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.dataset.m === curMode); }); });
  }
  function setMode(m) {
    curMode = m === 'list' ? 'list' : 'feed';
    syncSeg();
    learn.classList.toggle('lf-on', curMode === 'feed');
    hideHint();
    apply();
    window.scrollTo(0, 0);
  }
  function apply() {
    var shown = learn.classList.contains('on') && curMode === 'feed';
    document.documentElement.classList.toggle('lf-lock', shown);
    app.classList.toggle('lf-show', shown);
    if (!shown) { if (slides[active]) { slides[active].classList.add('paused'); pauseSlide(slides[active]); } teardownAll(); return; }
    window.scrollTo(0, 0);
    layout();
    if (active < 0 && slides.length) { observe(); setActive(0); }
  }

  /* 下のメニューの「まなぶ」から入ったときは、毎回ショートから始める
     （シリーズ一覧の「‹ まなぶ」で戻ったときは、カテゴリーのまま） */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('#fbapp .nv');
    if (b && b.dataset.scr === 'learn') { curMode = 'feed'; syncSeg(); learn.classList.add('lf-on'); }
  }, true);

  /* まなぶ画面が開いた／閉じたのを見張る */
  var wasOn = learn.classList.contains('on');
  new MutationObserver(function () {
    var on = learn.classList.contains('on');
    if (on === wasOn) return;
    wasOn = on;
    if (on && curMode === 'feed' && active < 0) { renderFeed(); }
    apply();
  }).observe(learn, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', layout);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && slides[active]) { slides[active].classList.add('paused'); if (PREVIEW) return; if (slides[active]._pl) slides[active]._pl.pause().catch(function () {}); }
  });

  /* ====== 起動 ====== */
  renderChips();
  renderFeed();
  setMode('feed');
  if (!PREVIEW) loadApi();
})();
