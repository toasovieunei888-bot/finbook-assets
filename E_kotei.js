/*! E_kotei.js  固定費削減（会員ホーム組み込み版）v2
    置き場所: toasovieunei888-bot/finbook-assets 直下
    読み込み: 会員ホームEmbedの最下部（D_knowledge-videos.js より後）
    動画を入れる方法:
      下の ITEMS の v に Vimeo の ID か共有URLを入れる
        例) "1182236319"
        例) "https://vimeo.com/1182236319/ab12cd34ef"   ← 限定公開はハッシュ込みで貼る
      空（""）のままの項目は「動画準備中」で表示され、問い合わせボタンだけ使える
    サムネ: th に16:9の画像URLを入れると、カードの絵文字が画像に置き換わる
    問い合わせ先: url が空なら公式LINE。申込フォーム等を使う場合は url に入れる（その場合 kw のコピーは行わない）
    purge URL:
      https://purge.jsdelivr.net/gh/toasovieunei888-bot/finbook-assets@main/E_kotei.js
*/
(function () {
  'use strict';

  /* ====== 設定（ここだけ触ればOK） ====== */
  var LINE = 'https://lin.ee/vTbbZPM';
  var ITEMS = [
    {
      n: 'スマホ代', d: 'スマホ代を無料・格安にしたい方', e: '📱', c: ['#CFEDFB', '#9BD5F3'],
      lead: '今の料金と使い方を確認して、乗り換え先の候補と月々の目安をお伝えします。',
      cta: 'LINEでスマホ代を相談する', kw: 'スマホ代の相談', v: '', th: '', url: ''
    },
    {
      n: 'ネット回線', d: 'ネット回線を無料・格安にしたい方', e: '🌐', c: ['#D6E4FB', '#A9C4F3'],
      lead: '今の回線とスマホの組み合わせを見て、セット割も含めた目安をお伝えします。',
      cta: 'LINEでネット回線を相談する', kw: 'ネット回線の相談', v: '', th: '', url: ''
    },
    {
      n: 'ウォーターサーバー', d: '今のウォーターサーバーを乗り換えたい方', e: '💧', c: ['#D2F1F5', '#A8E0EA'],
      lead: '今の契約内容と解約金を確認したうえで、乗り換えた場合の目安をお伝えします。',
      cta: 'LINEでウォーターサーバーを相談する', kw: 'ウォーターサーバーの相談', v: '', th: '', url: ''
    },
    {
      n: 'プロパンガス', d: 'プロパンガスの会社を切り替えたい方', e: '🔥', c: ['#FFE3CF', '#FFBE94'],
      lead: '今のガス代の明細を見て、切り替えた場合の目安をお伝えします。賃貸の場合は、大家さん・管理会社への確認が先に必要です。',
      cta: 'LINEでプロパンガスを相談する', kw: 'プロパンガスの相談', v: '', th: '', url: ''
    },
    {
      n: '家計相談', d: '支払いと収入をまとめて見直したい方', e: '📒', c: ['#C6EBDB', '#95D8BC'],
      lead: '毎月の支払いと収入を一緒に整理して、見直せるところを洗い出します。',
      cta: 'LINEで家計相談を申し込む', kw: '家計相談', v: '', th: '', url: ''
    }
  ];

  /* ====== ここから下は触らない ====== */
  var app = document.getElementById('fbapp');
  if (!app) { console.warn('[KT] #fbapp が見つからない'); return; }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function parseVimeo(raw) {
    raw = String(raw || '').trim();
    if (!raw) return null;
    var id = (raw.match(/(?:video\/|vimeo\.com\/)(\d{5,})/) || raw.match(/^(\d{5,})/) || [])[1];
    if (!id) return null;
    var h = (raw.match(/[?&]h=([0-9a-zA-Z]+)/) || raw.match(/vimeo\.com\/\d+\/([0-9a-zA-Z]+)/) || raw.match(/^\d+[\/:]([0-9a-zA-Z]+)$/) || [])[1] || '';
    return { id: id, h: h };
  }

  /* ====== CSS ====== */
  var css = ''
    + '#fbapp .rp-hero.kt::after,#fbapp .rp-hero.kt .ic{background:linear-gradient(135deg,#CFEDFB,#9BD5F3)}'
    + '#fbapp .kt-item{width:100%;font-family:inherit;color:var(--ink);text-align:left;cursor:pointer}'
    + '#fbapp .kt-item .ic.pic{width:104px;height:auto;aspect-ratio:16/9;border-radius:12px;overflow:hidden;padding:0}'
    + '#fbapp .kt-item .ic.pic img{width:100%;height:100%;object-fit:cover;display:block}'
    + '#fbapp .kt-item .pill.nov{background:linear-gradient(135deg,#FFE07A,var(--gold));color:#7A5200;box-shadow:0 2px 0 var(--goldd)}'
    + '#fbapp .kt-sheet .sh-head span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '#fbapp .kt-frame{position:relative;width:100%;aspect-ratio:16/9;background:#22313B;border-radius:14px;overflow:hidden;border:2.5px solid #fff;box-shadow:0 4px 0 rgba(60,90,110,.22)}'
    + '#fbapp .kt-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}'
    + '#fbapp .kt-frame .ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#fff;font-size:13px;font-weight:800}'
    + '#fbapp .kt-frame .ph i{font-style:normal;font-size:34px}'
    + '#fbapp .kt-who{display:inline-block;margin-top:13px;font-size:11.5px;font-weight:800;background:#FFF3D9;border:2px solid var(--bd);border-radius:999px;padding:4px 11px}'
    + '#fbapp .kt-lead{font-size:13px;font-weight:700;line-height:1.7;margin-top:9px}'
    + '#fbapp .kt-cta{display:block;text-align:center;margin-top:14px;background:linear-gradient(135deg,#6FC868,var(--leaf));color:#fff;font-size:15px;font-weight:800;border-radius:999px;padding:14px 10px;box-shadow:0 4px 0 var(--leafd)}'
    + '#fbapp .kt-cta.pulse{animation:ktp 1.2s ease-in-out 3}'
    + '@keyframes ktp{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}'
    + '#fbapp .kt-end{display:none;text-align:center;font-size:12.5px;font-weight:800;color:#D9731A;margin-top:12px}'
    + '#fbapp .kt-end.on{display:block}'
    + '#fbapp .kt-hint{text-align:center;font-size:11px;font-weight:700;color:var(--ink2);margin-top:9px;line-height:1.6}'
    + '#fbapp .kt-pr{font-size:10.5px;font-weight:700;color:#5E7E93;line-height:1.6;margin-top:14px;text-align:center}'
    + '@media (prefers-reduced-motion:reduce){#fbapp .kt-cta.pulse{animation:none}}';
  var st = document.createElement('style');
  st.id = 'kt-style';
  st.textContent = css;
  document.head.appendChild(st);

  /* ====== 画面とシートを追加 ====== */
  var PR = '※紹介しているサービスは提携先のものです。<br>お申し込みがあった場合、運営に紹介料が支払われることがあります。';
  var holder = document.createElement('div');
  holder.innerHTML = ''
    + '<section class="screen" id="scr-kotei">'
    + '<div class="rp-head"><button class="rp-back" id="ktBack">‹ もどる</button><span class="t">固定費削減</span></div>'
    + '<div class="rp-hero kt"><div class="ic">🐷</div><h3>固定費削減</h3>'
    + '<p>毎月かならず出ていく支払いを見直す講座です。<br>気になるものをタップすると、説明動画が見られます。</p>'
    + '<div class="tags">' + ITEMS.map(function (it) { return '<span>' + esc(it.n) + '</span>'; }).join('') + '</div></div>'
    + '<div id="ktList"></div>'
    + '<div class="rp-note"><b>📌 相談の流れ</b><ol>'
    + '<li>気になる項目の動画を見る</li>'
    + '<li>ボタンを押すと合言葉がコピーされて、公式LINEが開く</li>'
    + '<li>合言葉を貼りつけて送信し、案内に沿って今の明細を送る</li>'
    + '<li>見直した場合の目安が届く。申し込むかはそのあと決めてOK</li>'
    + '</ol></div>'
    + '<div class="kt-pr">' + PR + '</div>'
    + '</section>'
    + '<div class="sheet kt-sheet" id="ktSheet"><div class="sh-card" id="ktCard">'
    + '<div class="sh-head"><span id="ktSTitle"></span><button class="sh-x" id="ktSClose">✕</button></div>'
    + '<div class="kt-frame" id="ktFrame"></div>'
    + '<span class="kt-who" id="ktWho"></span>'
    + '<div class="kt-lead" id="ktLead"></div>'
    + '<div class="kt-end" id="ktEnd">👇 見終わったら、ここから問い合わせできます</div>'
    + '<a class="kt-cta" id="ktCta" href="#" target="_blank" rel="noopener"></a>'
    + '<div class="kt-hint" id="ktHint"></div>'
    + '<div class="kt-pr">' + PR + '</div>'
    + '</div></div>';
  var anchor = $('scr-repair');
  var frag = document.createDocumentFragment();
  while (holder.firstChild) frag.appendChild(holder.firstChild);
  if (anchor && anchor.parentNode === app) app.insertBefore(frag, anchor.nextSibling);
  else app.appendChild(frag);

  /* ====== 一覧 ====== */
  $('ktList').innerHTML = ITEMS.map(function (it, i) {
    var hasV = !!parseVimeo(it.v);
    var ic = it.th
      ? '<span class="ic pic"><img src="' + esc(it.th) + '" alt="" loading="lazy"></span>'
      : '<span class="ic" style="background:linear-gradient(135deg,' + it.c[0] + ',' + it.c[1] + ')">' + it.e + '</span>';
    return '<button class="tool kt-item" data-kti="' + i + '">' + ic
      + '<span class="tx"><span class="nm">' + esc(it.n) + '</span><span class="ds">' + esc(it.d) + '</span>'
      + '<span class="pill' + (hasV ? '' : ' nov') + '">' + (hasV ? '▶ 動画を見る' : '📄 くわしく見る') + '</span></span></button>';
  }).join('');

  /* ====== 画面切替：まなぶタブを点灯させる ====== */
  function highlight() {
    var s = $('scr-kotei');
    if (!s || !s.classList.contains('on')) return;
    app.querySelectorAll('.nv').forEach(function (x) { x.classList.toggle('on', x.dataset.scr === 'learn'); });
  }
  var prevShow = window.showScr;
  window.showScr = function (k) {
    if (k !== 'kotei') closeSheet();
    if (typeof prevShow === 'function') prevShow(k);
    if (k === 'kotei') highlight();
  };
  window.addEventListener('popstate', function () { closeSheet(); setTimeout(highlight, 0); });
  $('ktBack').addEventListener('click', function () {
    if (history.state && history.state.fb && history.state.i > 0) history.back();
    else window.showScr('learn');
  });

  /* ====== 動画シート ====== */
  var player = null, seq = 0, apiQueue = null;
  function loadVimeoApi(cb) {
    if (window.Vimeo && window.Vimeo.Player) { cb(); return; }
    if (apiQueue) { apiQueue.push(cb); return; }
    apiQueue = [cb];
    var sc = document.createElement('script');
    sc.src = 'https://player.vimeo.com/api/player.js';
    sc.onload = function () { var q = apiQueue; apiQueue = null; q.forEach(function (f) { f(); }); };
    sc.onerror = function () { apiQueue = null; };
    document.head.appendChild(sc);
  }
  function stopVideo() {
    seq++;
    if (player) { try { player.destroy(); } catch (e) {} player = null; }
    var f = $('ktFrame'); if (f) f.innerHTML = '';
  }
  function closeSheet() {
    var sh = $('ktSheet');
    if (!sh || !sh.classList.contains('on')) return;
    sh.classList.remove('on');
    stopVideo();
  }
  function openSheet(i) {
    var it = ITEMS[i], p = parseVimeo(it.v);
    stopVideo();
    $('ktSTitle').textContent = it.e + ' ' + it.n;
    $('ktWho').textContent = it.d;
    $('ktLead').textContent = it.lead;
    $('ktEnd').classList.remove('on');
    var cta = $('ktCta');
    cta.classList.remove('pulse');
    cta.textContent = it.cta + ' ▶';
    if (it.url) {
      cta.href = it.url; cta.removeAttribute('data-kt-kw');
      $('ktHint').textContent = '';
    } else {
      cta.href = LINE; cta.setAttribute('data-kt-kw', it.kw);
      $('ktHint').textContent = 'ボタンを押すと合言葉「' + it.kw + '」がコピーされます。LINEに貼って送信してください';
    }
    var fr = $('ktFrame');
    if (p) {
      var q = 'autoplay=1&title=0&byline=0&portrait=0&dnt=1&playsinline=1' + (p.h ? '&h=' + encodeURIComponent(p.h) : '');
      fr.innerHTML = '<iframe src="https://player.vimeo.com/video/' + p.id + '?' + q + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="' + esc(it.n) + '"></iframe>';
      var my = seq;
      loadVimeoApi(function () {
        if (my !== seq) return;
        var ifr = fr.querySelector('iframe');
        if (!ifr) return;
        try {
          player = new window.Vimeo.Player(ifr);
          player.on('ended', function () {
            if (my !== seq) return;
            $('ktEnd').classList.add('on');
            cta.classList.add('pulse');
            $('ktEnd').scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        } catch (e) {}
      });
    } else {
      fr.innerHTML = '<div class="ph"><i>🎬</i>動画は準備中です</div>';
    }
    $('ktCard').scrollTop = 0;
    $('ktSheet').classList.add('on');
  }
  $('ktList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-kti]');
    if (b) openSheet(+b.getAttribute('data-kti'));
  });
  $('ktSClose').addEventListener('click', closeSheet);
  $('ktSheet').addEventListener('click', function (e) { if (e.target === this) closeSheet(); });

  /* ====== 合言葉コピー（遷移は止めない） ====== */
  function toast(msg) {
    var t = $('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._kt);
    t._kt = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }
  function copy(txt) {
    try { if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(txt); return true; } } catch (e) {}
    try {
      var a = document.createElement('textarea');
      a.value = txt; a.setAttribute('readonly', ''); a.style.position = 'fixed'; a.style.opacity = '0';
      document.body.appendChild(a); a.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(a);
      return ok;
    } catch (e) { return false; }
  }
  app.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-kt-kw]');
    if (!a) return;
    var kw = a.getAttribute('data-kt-kw');
    toast(copy(kw) ? '📋 コピーしました。LINEに貼って送信' : 'LINEで「' + kw + '」と送信');
    if (player) { try { player.pause(); } catch (e2) {} }
  });
})();
