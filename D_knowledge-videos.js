/*! D_knowledge-videos.js  知識シリーズ動画（会員ホーム組み込み版）v3（サムネ対応）
    置き場所: toasovieunei888-bot/finbook-assets 直下
    読み込み: 会員ホームEmbedの最下部（A_finbook-home.js より後）
    動画を公開する方法:
      下の SERIES の該当シリーズ v:[ ] の何番目かに、Vimeo の ID か共有URLを入れる
        例) "1182236319"
        例) "https://vimeo.com/1182236319/ab12cd34ef"   ← 限定公開の動画はこの形（末尾のハッシュ込み）で貼る
      空（""）のままの回は「準備中」で表示される
    サムネの入れ方:
      同じシリーズの th:[ ] の同じ番目に、Webflowにアップした画像のURLを入れる（16:9）
      th の1番目の画像が、知識タブのシリーズカードの表紙にもなる
      GitHubでコミット → purge URL を開く → 会員ホームを再読み込み
    purge URL:
      https://purge.jsdelivr.net/gh/toasovieunei888-bot/finbook-assets@main/D_knowledge-videos.js
*/
(function () {
  'use strict';

  /* ====== 設定 ====== */
  var BUTSUHAN_TOTAL = 18; // 物販シリーズの本数（ランクカードの「◯/◯本 視聴」の分母に足す）
  var WEBHOOK_URL = 'https://hook.us2.make.com/mslt2unqq9yvwd45oqhcx60val94mp3x'; // 物販の章ページと同じ（シナリオ5176741）
  var MAX_RATE = 1.5;
  var OWL = 'https://cdn.prod.website-files.com/69bcd664c814f802dfc1f9bc/69d8deb5900a43804580bd24_%E5%AE%98%E5%BA%81%E3%80%80%E7%B4%94%E7%99%BD.jpg';

  /* ====== シリーズと動画（ここだけ触ればOK） ====== */
  var SERIES = [
    {
      k: 'okane', n: 'お金の歴史', e: '🪙', c: ['#FFECC0', '#FFDA85'],
      d: '紙やデータがなぜお金として使えるのか。身近な疑問から順番に見ていきます。',
      t: ['お金ってなに？', '紙なのにお金？', 'お金は誰が作ってるの？', '銀行に預けたお金はどこにいく？', 'なぜ物の値段は上がるの？', '100万円の価値はずっと同じ？', '貯金してるのにお金が減る？', '電子マネーって本当に“お金”なの？', 'キャッシュレスで払ったお金はどこにいく？', '金利ってなに？', '投資するとお金が増えるのはなぜ？', 'お金持ちは何にお金を使ってる？'],
      th: [
        'https://cdn.prod.website-files.com/69bcd664c814f802dfc1f9bc/6aaa0eac01ac3c9c1ef9ab70_%E3%81%8A%E3%81%8B%E3%81%AD%E3%82%B5%E3%83%A0%E3%83%8D01.jpg',
        'https://cdn.prod.website-files.com/69bcd664c814f802dfc1f9bc/6aaa0eb8eb710bc05c247ba9_ChatGPT%20Image%202026%E5%B9%B49%E6%9C%8816%E6%97%A5%2011_14_43_0.png',
        'https://cdn.prod.website-files.com/69bcd664c814f802dfc1f9bc/6aaa0eb8da088f2e63919060_ChatGPT%20Image%202026%E5%B9%B49%E6%9C%8816%E6%97%A5%2011_14_10_0.png',
        '', '', '', '', '', '', '', '', ''
      ],
      v: [
        'https://vimeo.com/1225483754/81b49ed9a1',
        'https://vimeo.com/1225484649/53b9abbd6b',
        'https://vimeo.com/1225501981/2fe8a1f64b',
        '', '', '', '', '', '', '', '', ''
      ]
    },
    {
      k: 'crypto', n: '暗号通貨', e: '₿', c: ['#FFE4BE', '#FFCC85'],
      d: '暗号通貨の仕組みと、だまされないための見方を学びます。',
      t: ['暗号通貨ってなに？', 'ただのデータなのに、なんで価値があるの？', 'ビットコインは誰が作ったの？', '暗号通貨はどこに保存されてるの？', 'ブロックチェーンってなに？', 'なんで暗号通貨の値段は上がったり下がったりするの？', 'ビットコインはどうやって増えるの？', '暗号通貨で買い物ってできるの？', 'NFTって暗号通貨と何が違うの？', '暗号通貨は安全なの？', '暗号通貨で騙されないためには？', '暗号通貨はこれから“お金”になるの？'],
      th: ['', '', '', '', '', '', '', '', '', '', '', ''],
      v: ['', '', '', '', '', '', '', '', '', '', '', '']
    },
    {
      k: 'ai', n: 'AIの誕生と進化', e: '🤖', c: ['#E5DAF6', '#CBB3EE'],
      d: 'AIがどう生まれ、どうやって賢くなってきたのかをたどります。',
      t: ['AIってそもそもなに？', 'AIはいつ生まれたの？', '最初のAIは何ができたの？', 'AIはどうやって賢くなったの？', '機械学習ってなに？', 'ディープラーニングで何が変わったの？', 'AIはどうやって画像を見分けてるの？', 'ChatGPTはどうやって生まれたの？', '生成AIって今までのAIと何が違うの？', 'AIは人間の仕事を奪うの？', 'AIは人間より賢くなるの？', 'AIの進化はこれからどこまで進む？'],
      th: ['https://cdn.prod.website-files.com/69bcd664c814f802dfc1f9bc/6aac92d9eb03f66101edcff0_ChatGPT%20Image%202026%E5%B9%B49%E6%9C%8818%E6%97%A5%2010_24_32.png',
           '', '', '', '', '', '', '', '', '', '', ''],
      v: ['https://vimeo.com/1227603128?share=copy&fl=sv&fe=ci', 
          '', '', '', '', '', '', '', '', '', '', '']
    },
    {
      k: 'jiko', n: '自己啓発', e: '🌱', c: ['#C6EBDB', '#95D8BC'],
      d: '行動・習慣・自信など、自分を動かすための考え方をまとめています。',
      t: ['自分を変えるには何から始めればいい？', 'やる気がなくても行動できる人の違い', '目標を立てても続かないのはなぜ？', '習慣を変えると人生は変わる？', '失敗を怖がらない人は何を考えてる？', '自信ってどうやったら身につくの？', '他人と比べてしまうのはなぜ？', '時間がない人ほど見直すべきこと', '環境を変えると自分も変わる？', '人間関係で疲れないためには？', '成功する人は何を優先してる？', '自分らしい人生ってどうやって作るの？'],
      th: ['', '', '', '', '', '', '', '', '', '', '', ''],
      v: ['', '', '', '', '', '', '', '', '', '', '', '']
    },
    {
      k: 'sagi', n: '詐欺予防', e: '🛡', c: ['#FAD5CF', '#F2A99F'],
      d: 'お金の詐欺を見抜くポイントと、払ってしまった時の動き方です。',
      t: ['詐欺ってどうやって見抜けばいい？', '「今すぐ決めて」が危険な理由', 'うますぎる儲け話はどこを疑う？', '有名人や大企業の名前が出ても信用していい？', 'SNSの投資話はどう確認すればいい？', 'LINEに誘導されたら何を警戒する？', '「絶対儲かる」が存在しない理由', '詐欺師がよく使う“信用させる言葉”とは？', '契約する前に絶対見るべき3つのポイント', '断りづらい時はどうすればいい？', 'もしお金を払ってしまったら何をする？', '詐欺に遭わない人が必ずやっている習慣'],
      th: ['', '', '', '', '', '', '', '', '', '', '', ''],
      v: ['', '', '', '', '', '', '', '', '', '', '', '']
    },
    {
      k: 'kenko', n: '健康がもたらす経済の変化', e: '🍎', c: ['#C7DFF7', '#9CC3EC'],
      d: '健康が家計・会社・国のお金にどうつながっているかを見ていきます。',
      t: ['健康になるとお金はどう変わる？', '病気になると実際いくらお金がかかる？', '睡眠不足は収入にも影響する？', '運動する人は仕事の生産性が高い？', '食生活が悪いと将来の支出は増える？', 'メンタルの不調は経済にどんな影響を与える？', '健康な人が増えると会社はどう変わる？', '医療費が増えると国の経済はどうなる？', '高齢化と健康寿命はなぜ重要なの？', '予防にお金を使う方が得なの？', '健康への投資はどこまで回収できる？', '健康な社会は本当に豊かになるの？'],
      th: ['', '', '', '', '', '', '', '', '', '', '', ''],
      v: ['', '', '', '', '', '', '', '', '', '', '', '']
    },
    {
      k: 'zei', n: '学校じゃ聞けない【税】について', e: '🧾', c: ['#EDE6D6', '#D8CBAE'],
      d: '税金の種類と決まり方を、会社員と個人事業主の目線で整理します。',
      t: ['税金ってそもそも何のために払うの？', '私たちは年間どれくらい税金を払ってる？', '消費税って誰が払って、誰が納めてるの？', '所得税はどうやって金額が決まるの？', '住民税ってなんで後から請求されるの？', '会社員は給料から何を引かれているの？', '個人事業主になると税金はどう変わる？', '経費ってどこまで経費にできるの？', '節税と脱税って何が違うの？', 'ふるさと納税って本当に得なの？', '税金が高くなると経済はどう変わる？', '税金を知ってる人と知らない人で何が変わる？'],
      th: ['', '', '', '', '', '', '', '', '', '', '', ''],
      v: ['', '', '', '', '', '', '', '', '', '', '', '']
    }
  ];

  /* ====== ここから下は触らない ====== */
  var app = document.getElementById('fbapp');
  var subB = document.getElementById('subB');
  if (!app || !subB) { console.warn('[KV] #fbapp / #subB が見つからない'); return; }

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* Vimeo のIDか共有URLから {id, h} を取り出す */
  function parseVimeo(raw) {
    raw = String(raw || '').trim();
    if (!raw) return null;
    var id = (raw.match(/(?:video\/|vimeo\.com\/)(\d{5,})/) || raw.match(/^(\d{5,})/) || [])[1];
    if (!id) return null;
    var h = (raw.match(/[?&]h=([0-9a-zA-Z]+)/) || raw.match(/vimeo\.com\/\d+\/([0-9a-zA-Z]+)/) || raw.match(/^\d+[\/:]([0-9a-zA-Z]+)$/) || [])[1] || '';
    return { id: id, h: h };
  }
  function isOpen(s, i) { return !!parseVimeo(s.v[i]); }
  function openCount(s) { var n = 0; for (var i = 0; i < s.t.length; i++) if (isOpen(s, i)) n++; return n; }
  function openTotal() { var n = 0; SERIES.forEach(function (s) { n += openCount(s); }); return n; }

  /* ====== 視聴済みデータ（Memberstack） ====== */
  var watched = {};
  var memberCache = null;
  function getMember() {
    return new Promise(function (res) {
      var n = 0;
      (function w() {
        if (window.$memberstackDom) {
          window.$memberstackDom.getCurrentMember({ useCache: false })
            .then(function (r) { res((r && r.data) || null); })
            .catch(function () { res(null); });
        } else if (++n > 75) { res(null); }
        else { setTimeout(w, 200); }
      })();
    });
  }
  function readWatched(m) {
    var cf = (m && m.customFields) || {};
    var raw = cf['video-watch-count'] || cf['video_watch_count'] || cf['Video Watch Count'] || '';
    String(raw).split(',').forEach(function (x) { x = x.replace(/"/g, '').trim(); if (x) watched[x] = true; });
  }
  function isWatched(s, i) { var p = parseVimeo(s.v[i]); return !!(p && watched[p.id]); }
  function watchedCount(s) { var n = 0; for (var i = 0; i < s.t.length; i++) if (isWatched(s, i)) n++; return n; }
  function memberName(m) {
    var cf = (m && m.customFields) || {};
    var n = cf['first-name'] || cf['mile-name'] || cf['name'] || cf['nickname'];
    if (n) return n;
    if (m && m.auth && m.auth.email) return m.auth.email.split('@')[0];
    return 'あなた';
  }

  /* ====== CSS ====== */
  var css = ''
    + '#fbapp .kv-card{cursor:pointer}'
    + '#fbapp .kv-card .th{font-size:40px}'
    + '#fbapp .lg.kv-card .th.pic{height:auto;aspect-ratio:16/9;padding:0;background:#EDE3CB}'
    + '#fbapp .lg.kv-card .th.pic img{width:100%;height:100%;border-radius:0;border:0;box-shadow:none;object-fit:cover}'
    + '#fbapp .kv-row .thumb{position:relative;width:112px;aspect-ratio:16/9;flex-shrink:0;border-radius:10px;overflow:hidden;border:2px solid #fff;box-shadow:0 2px 0 rgba(120,90,40,.18);background:#EDE3CB}'
    + '#fbapp .kv-row .thumb img{width:100%;height:100%;object-fit:cover;display:block}'
    + '#fbapp .kv-row .thumb .no{position:absolute;left:4px;top:4px;width:22px;height:22px;font-size:10px;box-shadow:0 1px 2px rgba(0,0,0,.25)}'
    + '#fbapp .kv-row.lock .thumb{filter:grayscale(.6);opacity:.75}'
    + '#fbapp .kv-row .thumb .ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px}'
    + '#fbapp .kv-row .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}'
    + '#fbapp .kv-row .mk2{font-size:11.5px;font-weight:800;color:var(--leafd)}'
    + '#fbapp .kv-row.lock .mk2{color:#B8AA88}'
    + '#fbapp .kv-card .ds2{display:block;font-size:11px;font-weight:800;color:var(--leafd);margin-top:1px}'
    + '#fbapp .kv-hero{display:flex;align-items:center;gap:13px;background:var(--card);border:2px solid var(--bd);border-radius:20px;box-shadow:var(--sh);padding:14px 15px;margin-bottom:14px}'
    + '#fbapp .kv-hero .ic{width:58px;height:58px;border-radius:18px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:30px;border:2px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,.1)}'
    + '#fbapp .kv-hero .tx{min-width:0;flex:1}'
    + '#fbapp .kv-hero h3{font-size:16.5px;font-weight:800;line-height:1.3}'
    + '#fbapp .kv-hero p{font-size:12px;font-weight:700;color:var(--ink2);line-height:1.6;margin-top:4px}'
    + '#fbapp .kv-meter{display:flex;align-items:center;gap:10px;margin-top:9px}'
    + '#fbapp .kv-meter .lb{flex-shrink:0;font-size:11.5px;font-weight:800;color:var(--leafd)}'
    + '#fbapp .kv-meter .bar .fill{background:linear-gradient(90deg,#8AD383,var(--leaf))}'
    + '#fbapp .kv-list{background:var(--card);border:2px solid var(--bd);border-radius:20px;box-shadow:var(--sh);padding:2px 13px}'
    + '#fbapp .kv-row{display:flex;align-items:center;gap:11px;width:100%;border:0;background:transparent;font-family:inherit;color:var(--ink);text-align:left;padding:12px 1px;border-bottom:2px dashed var(--bd);cursor:pointer}'
    + '#fbapp .kv-row:last-child{border-bottom:0}'
    + '#fbapp .kv-row .no{width:30px;height:30px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;background:linear-gradient(135deg,#FFE07A,var(--gold));color:#7A5200}'
    + '#fbapp .kv-row .tt{flex:1;min-width:0;font-size:13.5px;font-weight:800;line-height:1.45}'
    + '#fbapp .kv-row .mk{flex-shrink:0;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;background:linear-gradient(135deg,#6FC868,var(--leaf));box-shadow:0 2px 0 var(--leafd)}'
    + '#fbapp .kv-row.done .no{background:linear-gradient(135deg,#8AD383,var(--leaf));color:#fff}'
    + '#fbapp .kv-row.done .mk{width:auto;height:auto;background:none;box-shadow:none;color:var(--leafd);font-size:11.5px}'
    + '#fbapp .kv-row.lock{cursor:default}'
    + '#fbapp .kv-row.lock .no{background:#F0E8D2;color:#C6B790}'
    + '#fbapp .kv-row.lock .tt{color:var(--ink2)}'
    + '#fbapp .kv-row.lock .mk{width:auto;height:auto;background:none;box-shadow:none;color:#B8AA88;font-size:11px}'
    + '#fbapp .kv-player{background:#22313B;border:2.5px solid #fff;border-radius:18px;overflow:hidden;box-shadow:0 5px 0 rgba(60,90,110,.25);margin-bottom:14px}'
    + '#fbapp .kv-frame{position:relative;width:100%;margin:0 auto;aspect-ratio:16/9}'
    + '#fbapp .kv-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}'
    + '#fbapp .kv-info{background:var(--card);border:2px solid var(--bd);border-radius:20px;box-shadow:var(--sh);padding:14px 15px;margin-bottom:14px}'
    + '#fbapp .kv-info .sr{font-size:11.5px;font-weight:800;color:var(--ink2)}'
    + '#fbapp .kv-info h3{font-size:16.5px;font-weight:800;line-height:1.4;margin-top:3px}'
    + '#fbapp .kv-state{display:inline-block;margin-top:9px;font-size:11.5px;font-weight:800;border-radius:999px;padding:4px 12px;background:#F0E8D2;color:var(--ink2)}'
    + '#fbapp .kv-state.done{background:linear-gradient(135deg,#8AD383,var(--leaf));color:#fff}'
    + '#fbapp .kv-rule{font-size:11.5px;font-weight:700;color:#8A6A2E;background:#FFF9E2;border:2px dashed var(--gold);border-radius:12px;padding:8px 11px;margin-top:11px;line-height:1.6}'
    + '#fbapp .kv-nav{display:flex;gap:10px}'
    + '#fbapp .kv-nav button{flex:1;font-family:inherit;font-size:13.5px;font-weight:800;border-radius:999px;padding:12px 8px;cursor:pointer;border:2px solid var(--bd);background:var(--card);color:var(--ink);box-shadow:var(--sh)}'
    + '#fbapp .kv-nav button.nx{border:0;background:linear-gradient(135deg,#6FC868,var(--leaf));color:#fff;box-shadow:0 4px 0 var(--leafd)}'
    + '#fbapp .kv-nav button.off{visibility:hidden}'
    + '#fbapp .kv-pop{position:fixed;inset:0;z-index:9990;background:rgba(70,55,30,.5);display:none;align-items:center;justify-content:center;padding:20px}'
    + '#fbapp .kv-pop.on{display:flex}'
    + '#fbapp .kv-pop-card{width:100%;max-width:340px;background:var(--card);border:2.5px solid var(--gold);border-radius:22px;box-shadow:0 5px 0 var(--goldd);padding:22px 18px 18px;text-align:center}'
    + '#fbapp .kv-pop-card img{width:66px;height:66px;border-radius:50%;object-fit:cover;border:3px solid #fff;box-shadow:0 3px 0 var(--goldd);display:block;margin:0 auto 10px}'
    + '#fbapp .kv-pop-card b{display:block;font-size:16px;font-weight:800;line-height:1.4}'
    + '#fbapp .kv-pop-card p{font-size:13px;font-weight:700;color:var(--ink2);line-height:1.7;margin-top:6px}'
    + '#fbapp .kv-pop-card p .big{font-size:26px;font-weight:800;color:#D9731A}'
    + '#fbapp .kv-pop-btns{display:flex;flex-direction:column;gap:9px;margin-top:16px}'
    + '#fbapp .kv-pop-btns button{font-family:inherit;font-size:14px;font-weight:800;border-radius:999px;padding:12px;cursor:pointer;border:2px solid var(--bd);background:var(--card);color:var(--ink)}'
    + '#fbapp .kv-pop-btns .go{border:0;background:linear-gradient(135deg,#6FC868,var(--leaf));color:#fff;box-shadow:0 4px 0 var(--leafd)}';
  var st = document.createElement('style');
  st.id = 'kv-style';
  st.textContent = css;
  document.head.appendChild(st);

  /* ====== 画面を追加 ====== */
  var holder = document.createElement('div');
  holder.innerHTML = ''
    + '<section class="screen" id="scr-kseries">'
    + '<div class="rp-head"><button class="rp-back" id="kvsBack">‹ まなぶ</button><span class="t" id="kvsHeadT"></span></div>'
    + '<div class="kv-hero"><span class="ic" id="kvsIc"></span><div class="tx"><h3 id="kvsName"></h3><p id="kvsLead"></p>'
    + '<div class="kv-meter"><span class="lb" id="kvsMeterT"></span><span class="bar"><span class="fill" id="kvsMeterF"></span></span></div></div></div>'
    + '<div class="kv-list" id="kvsList"></div>'
    + '</section>'
    + '<section class="screen" id="scr-kwatch">'
    + '<div class="rp-head"><button class="rp-back" id="kvwBack">‹ 一覧</button><span class="t" id="kvwHeadT"></span></div>'
    + '<div class="kv-player"><div class="kv-frame" id="kvwFrame"></div></div>'
    + '<div class="kv-info"><span class="sr" id="kvwSr"></span><h3 id="kvwTitle"></h3><span class="kv-state" id="kvwState"></span>'
    + '<div class="kv-rule">最後まで見ると 1pt もらえます。1.5倍速より速くしたり、先へ飛ばしたりすると対象外になります。</div></div>'
    + '<div class="kv-nav"><button id="kvwPrev">‹ 前の動画</button><button class="nx" id="kvwNext">次の動画 ›</button></div>'
    + '</section>'
    + '<div class="kv-pop" id="kvPop"><div class="kv-pop-card"><img src="' + OWL + '" alt=""><b id="kvPopT"></b><p id="kvPopM"></p>'
    + '<div class="kv-pop-btns"><button class="go" id="kvPopNext">次の動画へ ▶</button><button id="kvPopClose">閉じる</button></div></div></div>';
  var anchor = $('scr-repair') || $('scr-learn');
  var frag = document.createDocumentFragment();
  while (holder.firstChild) frag.appendChild(holder.firstChild);
  if (anchor && anchor.parentNode === app) app.insertBefore(frag, anchor.nextSibling);
  else app.appendChild(frag);

  /* ====== 画面切替（A_finbook-home.js の showScr を拡張） ======
     画面を切り替えるたびにブラウザ履歴に1件積む。
     → iPhoneのスワイプ／Androidの戻るボタンで「前に見ていた画面」に戻れる。
     ・行き先が1つ前の画面と同じなら history.back()（‹ まなぶ／‹ 一覧 などの戻るボタンも同じ扱い）
     ・動画の「前へ／次へ」は積まずに置き換え（スワイプで一覧に戻れるように）
  */
  var origShow = window.showScr;
  var H = { cur: 0, entries: [] };
  if ('scrollRestoration' in history) { try { history.scrollRestoration = 'manual'; } catch (e) {} }

  function stateFor(k) {
    return { fb: 1, k: k, s: (k === 'kseries' || k === 'kwatch') ? curS : -1, e: k === 'kwatch' ? curE : -1 };
  }
  function sameState(a, b) { return !!(a && b && a.k === b.k && a.s === b.s && a.e === b.e); }
  function saveScroll() {
    var cs = H.entries[H.cur];
    if (!cs) return;
    var on = app.querySelector('.subtab[data-sub].on');
    cs = Object.assign({}, cs, { y: window.scrollY || 0, sub: on ? on.getAttribute('data-sub') : '' });
    H.entries[H.cur] = cs;
    try { history.replaceState(cs, ''); } catch (e) {}
  }
  /* mode: 'push'（通常）/ 'replace'（前後の動画）/ 'pop'（ブラウザの戻る・進む）
     戻り値 false = history.back() に任せたので、描画は popstate 側で行う */
  function nav(k, mode) {
    mode = mode || 'push';
    if (mode !== 'pop') {
      var target = stateFor(k);
      if (sameState(H.entries[H.cur], target)) { render(k); return true; }
      if (mode === 'push' && H.cur > 0 && sameState(H.entries[H.cur - 1], target)) { saveScroll(); history.back(); return false; }
      saveScroll();
      if (mode === 'replace') {
        target.i = H.cur;
        H.entries[H.cur] = target;
        try { history.replaceState(target, ''); } catch (e) {}
      } else {
        target.i = H.cur + 1;
        H.cur = target.i;
        H.entries.length = H.cur;
        H.entries[H.cur] = target;
        try { history.pushState(target, ''); } catch (e) {}
      }
    }
    render(k);
    return true;
  }
  function render(k) {
    if (k !== 'kwatch') destroyPlayer();
    if (typeof origShow === 'function') { origShow(k); }
    else {
      app.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('on'); });
      var s = $('scr-' + k); if (s) s.classList.add('on');
      window.scrollTo({ top: 0 });
    }
    if (k === 'kseries' || k === 'kwatch') {
      app.querySelectorAll('.nv').forEach(function (x) { x.classList.toggle('on', x.dataset.scr === 'learn'); });
    }
  }
  window.showScr = function (k) { nav(k, 'push'); };

  function backToKnowledge() {
    var b = app.querySelector('.subtab[data-sub="b"]');
    if (b) b.click();
    nav('learn', 'push');
  }

  /* ブラウザの戻る・進む（スワイプ含む） */
  function restore(st) {
    if (!st || !st.fb) st = { fb: 1, k: 'home', s: -1, e: -1, i: 0 };
    H.cur = st.i || 0;
    H.entries[H.cur] = st;
    hidePop();
    if (st.k === 'kwatch' && SERIES[st.s] && isOpen(SERIES[st.s], st.e)) {
      curS = st.s; renderSeries(); openWatch(st.s, st.e, 'pop');
    } else if ((st.k === 'kseries' || st.k === 'kwatch') && SERIES[st.s]) {
      curS = st.s; renderSeries(); nav('kseries', 'pop');
    } else if ($('scr-' + st.k)) {
      if (st.k === 'learn' && st.sub) {
        var tb = app.querySelector('.subtab[data-sub="' + st.sub + '"]');
        if (tb && !tb.classList.contains('on')) tb.click();
      }
      nav(st.k, 'pop');
    } else {
      nav('home', 'pop');
    }
    if (st.y) setTimeout(function () { window.scrollTo(0, st.y); }, 30);
  }
  window.addEventListener('popstate', function (ev) { restore(ev.state); });

  /* ====== 知識タブのカード ====== */
  function renderCards() {
    subB.innerHTML = SERIES.map(function (s, si) {
      var oc = openCount(s), wc = watchedCount(s), soon = oc === 0;
      return '<a class="lg kv-card' + (soon ? ' soon' : '') + '" href="#" data-kvs="' + si + '">'
        + (soon ? '<span class="lockb">🔒 準備中</span>' : '')
        + (s.th && s.th[0]
          ? '<span class="th pic"><img src="' + esc(s.th[0]) + '" alt="" loading="lazy"></span>'
          : '<span class="th" style="background:linear-gradient(135deg,' + s.c[0] + ',' + s.c[1] + ')">' + s.e + '</span>')
        + '<span class="bd"><span class="nm">' + esc(s.n) + '</span>'
        + '<span class="ds">' + (soon ? '全' + s.t.length + '本・近日公開' : '📺 ' + oc + '/' + s.t.length + '本 公開中') + '</span>'
        + (wc > 0 ? '<span class="ds2">✓ ' + wc + '本 視聴済み</span>' : '')
        + '<span class="pill">' + (soon ? 'ラインナップ' : '▶ 見る') + '</span></span></a>';
    }).join('');
  }
  subB.addEventListener('click', function (e) {
    var c = e.target.closest('[data-kvs]');
    if (!c) return;
    e.preventDefault();
    openSeries(+c.getAttribute('data-kvs'));
  });

  /* ====== シリーズ一覧画面 ====== */
  var curS = 0;
  function renderSeries() {
    var s = SERIES[curS], oc = openCount(s), wc = watchedCount(s);
    $('kvsHeadT').textContent = s.n;
    $('kvsIc').textContent = s.e;
    $('kvsIc').style.background = 'linear-gradient(135deg,' + s.c[0] + ',' + s.c[1] + ')';
    $('kvsName').textContent = s.n;
    $('kvsLead').textContent = s.d;
    $('kvsMeterT').textContent = oc === 0 ? '全' + s.t.length + '本・準備中' : '視聴 ' + wc + '/' + oc + '本（公開中）';
    $('kvsMeterF').style.width = (oc ? Math.round(wc / oc * 100) : 0) + '%';
    $('kvsList').innerHTML = s.t.map(function (title, i) {
      var open = isOpen(s, i), done = open && isWatched(s, i);
      var cls = open ? (done ? ' done' : '') : ' lock';
      var mark2 = open ? (done ? '✓ 視聴済み' : '▶ 見る') : '🔒 準備中';
      var img = s.th && s.th[i]
        ? '<img src="' + esc(s.th[i]) + '" alt="" loading="lazy">'
        : '<span class="ph" style="background:linear-gradient(135deg,' + s.c[0] + ',' + s.c[1] + ')">' + s.e + '</span>';
      return '<button class="kv-row' + cls + '" data-kvi="' + i + '"' + (open ? '' : ' disabled') + '>'
        + '<span class="thumb">' + img + '<span class="no">' + pad(i + 1) + '</span></span>'
        + '<span class="tx"><span class="tt">' + esc(title) + '</span><span class="mk2">' + mark2 + '</span></span></button>';
    }).join('');
  }
  function openSeries(si) { curS = si; renderSeries(); nav('kseries', 'push'); }
  $('kvsList').addEventListener('click', function (e) {
    var r = e.target.closest('[data-kvi]');
    if (!r || r.disabled) return;
    openWatch(curS, +r.getAttribute('data-kvi'));
  });
  $('kvsBack').addEventListener('click', backToKnowledge);

  /* ====== 視聴画面 ====== */
  var curE = 0, player = null, seq = 0, apiQueue = null;
  function nextOpen(si, ei, dir) {
    var s = SERIES[si];
    for (var i = ei + dir; i >= 0 && i < s.t.length; i += dir) if (isOpen(s, i)) return i;
    return -1;
  }
  function renderWatchInfo() {
    var s = SERIES[curS], done = isWatched(s, curE);
    $('kvwHeadT').textContent = s.n;
    $('kvwSr').textContent = s.e + ' ' + s.n + '　第' + (curE + 1) + '回';
    $('kvwTitle').textContent = pad(curE + 1) + '. ' + s.t[curE];
    var stEl = $('kvwState');
    stEl.textContent = done ? '✓ 視聴済み（ポイント獲得済み）' : 'まだ見ていない動画';
    stEl.className = 'kv-state' + (done ? ' done' : '');
    $('kvwPrev').classList.toggle('off', nextOpen(curS, curE, -1) < 0);
    $('kvwNext').classList.toggle('off', nextOpen(curS, curE, 1) < 0);
  }
  function destroyPlayer() {
    seq++;
    if (player) { try { player.destroy(); } catch (e) {} player = null; }
    var f = $('kvwFrame');
    if (f) { f.innerHTML = ''; f.style.aspectRatio = ''; f.style.maxWidth = ''; }
  }
  function loadVimeoApi(cb) {
    if (window.Vimeo && window.Vimeo.Player) { cb(); return; }
    if (apiQueue) { apiQueue.push(cb); return; }
    apiQueue = [cb];
    var sc = document.createElement('script');
    sc.src = 'https://player.vimeo.com/api/player.js';
    sc.onload = function () { var q = apiQueue; apiQueue = null; q.forEach(function (f) { f(); }); };
    sc.onerror = function () { apiQueue = null; console.error('[KV] Vimeo Player API の読み込みに失敗'); };
    document.head.appendChild(sc);
  }
  function openWatch(si, ei, mode) {
    var s = SERIES[si], p = parseVimeo(s.v[ei]);
    if (!p) return;
    hidePop();
    curS = si; curE = ei;
    if (!nav('kwatch', mode || 'push')) return;
    destroyPlayer();
    renderWatchInfo();
    var q = 'title=0&byline=0&portrait=0&dnt=1&playsinline=1' + (p.h ? '&h=' + encodeURIComponent(p.h) : '');
    $('kvwFrame').innerHTML = '<iframe src="https://player.vimeo.com/video/' + p.id + '?' + q + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="' + esc(s.t[ei]) + '"></iframe>';
    var my = seq;
    loadVimeoApi(function () {
      if (my !== seq) return;
      var ifr = $('kvwFrame').querySelector('iframe');
      if (ifr) attachTracker(ifr, p.id, my);
    });
  }
  function fitAspect(w, h) {
    var f = $('kvwFrame');
    if (!f || !w || !h) return;
    f.style.aspectRatio = w + ' / ' + h;
    f.style.maxWidth = h > w ? 'calc(68dvh * ' + (w / h).toFixed(4) + ')' : '';
  }

  /* 物販の章ページと同じ判定: 25/50/75% 通過・1.5倍速まで・飛ばし禁止 */
  function attachTracker(iframe, vid, my) {
    var cp = { p25: false, p50: false, p75: false }, completed = false, bad = false, why = '';
    player = new window.Vimeo.Player(iframe);
    console.log('[KV] Initialized for video', vid);
    player.ready()
      .then(function () { return Promise.all([player.getVideoWidth(), player.getVideoHeight()]); })
      .then(function (wh) { if (my === seq) fitAspect(wh[0], wh[1]); })
      .catch(function (err) { console.warn('[KV] player not ready:', err); });

    player.on('playbackratechange', function (d) {
      if (d.playbackRate > MAX_RATE) { bad = true; why = d.playbackRate + '倍速で再生されました'; }
    });
    player.on('seeked', function (d) {
      var pct = d.percent * 100;
      if (pct >= 25 && !cp.p25) { bad = true; why = '途中を飛ばして再生されました'; }
      if (pct >= 50 && !cp.p50) { bad = true; why = '途中を飛ばして再生されました'; }
      if (pct >= 75 && !cp.p75) { bad = true; why = '途中を飛ばして再生されました'; }
    });
    player.on('timeupdate', function (d) {
      if (completed || bad) return;
      var pct = d.percent * 100;
      if (!cp.p25 && pct >= 25 && pct < 30) cp.p25 = true;
      if (!cp.p50 && pct >= 50 && pct < 55 && cp.p25) cp.p50 = true;
      if (!cp.p75 && pct >= 75 && pct < 80 && cp.p50) cp.p75 = true;
    });
    player.on('ended', function () {
      if (my !== seq || completed) return;
      completed = true;
      if (bad) { showPop('⚠️ ポイント対象外', why + '。<br>最初から見直すと対象になります。', false); return; }
      if (!cp.p25 || !cp.p50 || !cp.p75) { showPop('⚠️ ポイント対象外', '途中を飛ばして再生されました。<br>最初から見直すと対象になります。', false); return; }
      sendCompletion(vid);
    });
  }

  function sendCompletion(vid) {
    var name = 'あなた';
    getMember().then(function (m) {
      if (!m) { showPop('⚠️ ログインが必要です', 'ログインしてから見るとポイントが付きます。', false); return null; }
      memberCache = m;
      name = memberName(m);
      return fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: m.id, vimeo_id: vid })
      }).then(function (r) { return r.json(); });
    }).then(function (res) {
      if (!res) return;
      console.log('[KV] Response:', res);
      if (res.points_added === 1) {
        markWatched(vid);
        var np = +res.new_video_points || 0;
        showPop('🦉 ' + esc(name) + 'さん、視聴完了！', '+1ポイント獲得<br>動画ポイント <span class="big" id="kvCnt">' + Math.max(0, np - 1) + '</span> pt', true);
        countUp($('kvCnt'), Math.max(0, np - 1), np, 900);
      } else if (res.points_added === 0) {
        markWatched(vid);
        showPop('📚 ' + esc(name) + 'さん、視聴完了', 'この動画のポイントは獲得済みです。<br>動画ポイント ' + (+res.new_video_points || 0) + ' pt', true);
      } else {
        showPop('✅ 視聴完了', '', true);
      }
    }).catch(function (err) {
      console.error('[KV] Error:', err);
      showPop('⚠️ 通信エラー', 'ポイントを送れませんでした。<br>電波の良い場所で、もう一度最後まで見てください。', false);
    });
  }
  function markWatched(vid) {
    watched[vid] = true;
    renderCards();
    renderSeries();
    renderWatchInfo();
  }
  function countUp(el, from, to, dur) {
    if (!el || from === to) return;
    var t0 = performance.now();
    (function step(now) {
      var t = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(from + (to - from) * t);
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ====== ポップアップ ====== */
  function showPop(title, msg, allowNext) {
    $('kvPopT').innerHTML = title;
    $('kvPopM').innerHTML = msg;
    $('kvPopM').style.display = msg ? 'block' : 'none';
    var hasNext = allowNext && nextOpen(curS, curE, 1) >= 0;
    $('kvPopNext').style.display = hasNext ? 'block' : 'none';
    $('kvPop').classList.add('on');
  }
  function hidePop() { $('kvPop').classList.remove('on'); }
  $('kvPopClose').addEventListener('click', hidePop);
  $('kvPop').addEventListener('click', function (e) { if (e.target === this) hidePop(); });
  $('kvPopNext').addEventListener('click', function () {
    var n = nextOpen(curS, curE, 1);
    hidePop();
    if (n >= 0) openWatch(curS, n, 'replace');
  });

  $('kvwBack').addEventListener('click', function () { renderSeries(); nav('kseries', 'push'); });
  $('kvwPrev').addEventListener('click', function () { var n = nextOpen(curS, curE, -1); if (n >= 0) openWatch(curS, n, 'replace'); });
  $('kvwNext').addEventListener('click', function () { var n = nextOpen(curS, curE, 1); if (n >= 0) openWatch(curS, n, 'replace'); });

  /* ====== ランクカード「◯/18本 視聴」の分母を合計本数に直す ====== */
  function fixRankTotal() {
    var el = $('rkMeta');
    if (!el) return;
    var total = BUTSUHAN_TOTAL + openTotal();
    var h = el.innerHTML, nh = h.replace(/\/\d+本 視聴/, '/' + total + '本 視聴');
    if (nh !== h) el.innerHTML = nh;
  }
  if ($('rkMeta')) {
    fixRankTotal();
    new MutationObserver(fixRankTotal).observe($('rkMeta'), { childList: true, subtree: true, characterData: true });
  }

  /* ====== 起動 ====== */
  renderCards();
  getMember().then(function (m) {
    if (!m) return;
    memberCache = m;
    readWatched(m);
    renderCards();
    if ($('scr-kseries').classList.contains('on')) renderSeries();
    if ($('scr-kwatch').classList.contains('on')) renderWatchInfo();
  });

  /* 履歴の初期化と、直リンク／再読み込み時の画面復元
     ・会員ホームURL?kv=okane-01 → ホーム → 一覧 → 動画 の順に積む（スワイプで一覧に戻れる）
     ・再読み込み時は、直前に開いていた画面を復元する */
  (function () {
    var q = (new URLSearchParams(location.search).get('kv') || '').split('-');
    var si = -1;
    if (q[0]) SERIES.forEach(function (s, i) { if (s.k === q[0]) si = i; });
    var prev = history.state;
    var restoring = si < 0 && prev && prev.fb && prev.k !== 'home';
    if (restoring) {
      H.cur = prev.i || 0;
      H.entries[H.cur] = prev;
    } else {
      var h0 = { fb: 1, k: 'home', s: -1, e: -1, i: (si < 0 && prev && prev.fb && prev.i) || 0 };
      H.cur = h0.i;
      H.entries = [];
      H.entries[H.cur] = h0;
      try { history.replaceState(h0, ''); } catch (e) {}
    }
    setTimeout(function () {
      if (si >= 0) {
        if (H.cur !== 0) return; // 読み込み直後に別の画面へ移動済み
        var ei = parseInt(q[1], 10) - 1;
        openSeries(si);
        if (ei >= 0 && isOpen(SERIES[si], ei)) openWatch(si, ei, 'push');
      } else if (restoring && H.entries[H.cur] === prev) {
        restore(prev);
      }
    }, 300);
  })();
})();
