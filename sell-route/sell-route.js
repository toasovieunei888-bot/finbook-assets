/*!
 * 売り先ツール（sell-route.js）
 * Webflow の Embed から読み込んで使う。記録は Apps Script 経由で
 * スプレッドシート「リペア案件管理 v2」の「査定記録」シートに残る。
 *
 * Embed 側:
 *   <div id="sell-route"></div>
 *   <script>window.SELL_ROUTE_CONFIG = { api: "Apps Script のウェブアプリURL" };</script>
 *   <script src="https://cdn.jsdelivr.net/gh/toasovieunei888-bot/finbook-assets@main/sell-route/sell-route.js"></script>
 */
(function () {
  'use strict';
  var CFG = window.SELL_ROUTE_CONFIG || {};
  var API = CFG.api || '';
  var ROOT = document.querySelector(CFG.mount || '#sell-route');
  if (!ROOT) return;
  var LS = 'sell-route-v1';

  /* ---------- 固定の情報（店・LINE・出張） ---------- */
  var STORES = [
    { name: 'OKURA 福岡天神店', area: '今泉', type: 'B', rank: 1, tel: '092-739-6133', why: '福岡が本社。売り場あり。エルメスを買う客が多い' },
    { name: 'RAGTAG 福岡店', area: '大名', type: 'C', rank: 2, tel: '092-738-2555', why: '2Fがハイブランドの売り場。自店で売る値付け' },
    { name: 'シグマ 福岡天神店', area: '天神', type: 'C', rank: 3, tel: '0120-905-334', why: '他の買取店より高かったという口コミが複数。土曜休み' },
    { name: '大黒屋ブランド館 福岡店', area: '天神', type: 'B', rank: 4, tel: '092-738-3232', why: '1〜3Fが売り場。天神の大黒屋はここだけ回る' },
    { name: 'SeekeR 天神店', area: '大名', type: 'C', rank: 5, tel: '092-791-7188', why: 'ブランド古着の販売・買取。12時開店' },
    { name: 'UNION3 大名店', area: '大名', type: 'C', rank: 6, tel: '092-737-8997', why: '古着中心。駐車場の奥にある' },
    { name: 'セカンドストリート 福岡天神店', area: '大名', type: 'B', rank: 7, tel: '092-718-7766', why: '3号店と同じ品で店ごとの差を見る' },
    { name: 'セカンドストリート 福岡天神3号店', area: '大名', type: 'B', rank: 8, tel: '092-401-8061', why: 'RAGTAGの隣。天神店との比較用' },
    { name: 'おたからや 福岡天神本店', area: '今泉', type: 'A', rank: 9, tel: '0120-555-600', why: '自社オークションが中心。OKURAの隣' },
    { name: 'なんぼや 福岡天神店', area: '大名', type: 'A', rank: 10, tel: '0120-661-333', why: '仕入れ元のオークションに戻す形。2点だけ聞く' },
    { name: '買取大吉（知り合い）', area: '—', type: 'A', rank: 0, tel: '', why: '今の基準になる店' },
    { name: 'ブランドリバリュー 福岡天神店', area: '大名', type: 'B', rank: 0, tel: '0120-734-843', why: '査定済み' },
    { name: 'コメ兵 福岡天神', area: '大名', type: 'B', rank: 0, tel: '', why: '査定済み。今回は最安' }
  ];
  var TYPE = { A: '業者オークションへ', B: '店で売る／業者へ', C: '自分の店で売る' };
  var LINES = [
    { name: '古恵良質店', area: '北九州・小倉', how: 'LINE査定 → 宅配（送料無料）', line: 'https://line.me/R/ti/p/@717nrqrs', why: '店頭と7つのネット通販で自社販売' },
    { name: 'エコプラス', area: '北九州・小倉', how: 'LINE査定 → 宅配', line: 'https://line.me/ti/p/ROQJPUEfiY', tel: '093-531-3131', why: '店頭とネットで自社販売。Google★4.9' },
    { name: 'Hedy（RE:Hedy）', area: '天神・今泉', how: 'LINE査定 → 宅配キット（平日10〜18時）', line: 'https://page.line.me/292wuaxb', tel: '092-714-2128', why: 'ヴィンテージのヴィトンを国内外に販売。旧型向き' },
    { name: '質shopそとお', area: '博多区堅粕', how: '査定フォーム → 出張（福岡市近郊）', form: 'https://www.s-sotoo.com/buy/form.html', tel: '092-461-1178', why: '自社の買取shopで販売するブランド質屋' }
  ];
  var TRIPS = [
    ['質shopそとお', '福岡市近郊・完全予約', '092-461-1178'],
    ['OKURA', '福岡県OK・即日・その場で現金', '092-739-6133'],
    ['大黒屋', '出張対応', '092-738-3232'],
    ['ブランドリバリュー', '出張対応・現金払いは要相談', '0120-734-843'],
    ['古恵良質店', '北九州。福岡市まで来るか要確認', ''],
    ['エコプラス', '北九州。福岡市まで来るか要確認', '093-531-3131'],
    ['エステメ 天神', '全国・即日・その場で現金（時計中心）', '0120-268-184'],
    ['ジャンク品ジャパン', '福岡市内外・その場で現金', ''],
    ['コメ兵', '出張対応（今回は最安）', '']
  ];

  /* ---------- 状態 ---------- */
  var st = load();
  var data = { items: [], logs: [], at: '' };
  var view = st.view || 'record';
  var busy = false;

  function load() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(LS, JSON.stringify(st)); } catch (e) {} }

  /* ---------- 通信 ---------- */
  function apiGet(action) {
    var url = API + '?action=' + encodeURIComponent(action) + '&pass=' + encodeURIComponent(st.pass || '') + '&t=' + Date.now();
    return fetch(url).then(function (r) { return r.json(); });
  }
  function apiPost(body) {
    body.pass = st.pass || '';
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); });
  }

  /* ---------- 計算 ---------- */
  function yen(n) { return n == null ? '—' : (n < 0 ? '−' : '') + '¥' + Math.abs(n).toLocaleString('ja-JP'); }
  function sgn(n) { return n == null ? '—' : (n >= 0 ? '+' : '−') + '¥' + Math.abs(n).toLocaleString('ja-JP'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function parseYen(v) {
    var s = String(v == null ? '' : v).replace(/[,，¥円\s]/g, '').replace(/万$/, '');
    if (!s) return null; var n = parseFloat(s); if (isNaN(n)) return null;
    return n < 1000 ? Math.round(n * 10000) : Math.round(n);
  }
  function isSold(it) { return it.status === '売却済' || it.soldPrice != null; }
  function appsFor(it) {
    var list = data.logs.filter(function (l) { return l.itemId === it.id && l.amount; })
      .map(function (l) { return { store: l.store, amount: l.amount, at: l.at, by: l.by, sale: l.sale, log: l }; });
    if (it.sheetAppraisal && !list.some(function (a) { return a.amount === it.sheetAppraisal; })) {
      list.push({ store: it.sheetAppraiser || 'シート記載', amount: it.sheetAppraisal, at: '', by: '' });
    }
    // 同じ店は新しい記録だけ残す
    var seen = {}; list.sort(function (a, b) { return String(b.at).localeCompare(String(a.at)); });
    list = list.filter(function (a) { if (seen[a.store]) return false; seen[a.store] = 1; return true; });
    return list.sort(function (a, b) { return b.amount - a.amount; });
  }
  function calc(it) {
    var apps = appsFor(it);
    if (isSold(it)) return { apps: apps, best: null, diff: it.profit != null ? it.profit : (it.soldPrice - (it.cost || 0)), kind: '確定' };
    if (apps.length) return { apps: apps, best: apps[0], diff: apps[0].amount - (it.cost || 0), kind: '査定' };
    if (it.expected != null) return { apps: apps, best: null, diff: it.expected - (it.cost || 0), kind: '見込み' };
    return { apps: apps, best: null, diff: null, kind: '—' };
  }
  function byId(id) { for (var i = 0; i < data.items.length; i++) if (data.items[i].id === id) return data.items[i]; return null; }

  /* ---------- 画面 ---------- */
  injectCss();

  function render() {
    if (!API) { ROOT.innerHTML = '<div class="sr"><p class="sr-err">SELL_ROUTE_CONFIG.api（Apps ScriptのURL）が設定されていません。</p></div>'; return; }
    if (!st.pass || !st.name) return renderLogin();
    var tabs = [['record', '店頭で記録'], ['stock', '在庫・損益'], ['carry', '持っていく'], ['where', '売り先リスト']];
    ROOT.innerHTML = '<div class="sr">' +
      '<header class="sr-top"><div><div class="sr-kicker">売り先ツール</div><h2>' + esc(st.name) + ' さん</h2></div>' +
      '<button class="sr-mini" data-act="reload">' + (busy ? '読み込み中…' : '最新にする') + '</button></header>' +
      '<p class="sr-sub">シートの読み込み：' + (data.at ? esc(data.at) : 'まだ') + '</p>' +
      '<nav class="sr-tabs">' + tabs.map(function (t) { return '<button data-view="' + t[0] + '" class="' + (view === t[0] ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</nav>' +
      '<main id="sr-main"></main></div>';
    var main = ROOT.querySelector('#sr-main');
    if (view === 'record') main.innerHTML = viewRecord();
    if (view === 'stock') main.innerHTML = viewStock();
    if (view === 'carry') main.innerHTML = viewCarry();
    if (view === 'where') main.innerHTML = viewWhere();
  }

  function renderLogin() {
    ROOT.innerHTML = '<div class="sr"><header class="sr-top"><div><div class="sr-kicker">売り先ツール</div><h2>はじめに</h2></div></header>' +
      '<div class="sr-card"><label class="sr-l" for="sr-pass">合言葉</label><input class="sr-in" id="sr-pass" type="password" autocomplete="off">' +
      '<label class="sr-l" for="sr-name">名前（記録に残ります）</label><input class="sr-in" id="sr-name" value="' + esc(st.name || '') + '" placeholder="例 かなぽん">' +
      '<button class="sr-btn pri" data-act="login">はじめる</button><p class="sr-msg" id="sr-loginmsg"></p></div></div>';
  }

  function itemOptions(sel) {
    return data.items.filter(function (it) { return !isSold(it); }).map(function (it) {
      return '<option value="' + esc(it.id) + '"' + (it.id === sel ? ' selected' : '') + '>' + esc(it.name) + '（' + esc(it.id) + '・仕入' + yen(it.cost) + '）</option>';
    }).join('');
  }

  function viewRecord() {
    var store = st.store || '';
    var targets = (st.carry && st.carry.length ? st.carry : []).map(byId).filter(Boolean);
    var draft = st.draft || {};
    var rows = targets.map(function (it) {
      var c = calc(it), v = parseYen(draft[it.id]);
      var bestOther = c.apps.filter(function (a) { return a.store !== store; })[0];
      var hint = v == null ? (bestOther ? '今の最高 ' + yen(bestOther.amount) + '（' + esc(bestOther.store) + '）' : '査定はまだありません')
        : (bestOther && v <= bestOther.amount ? 'あと ' + (bestOther.amount - v).toLocaleString('ja-JP') + '円で最高値' : '<b class="sr-up">最高値を更新</b>');
      return '<div class="sr-row"><div class="sr-rowhead"><b>' + esc(it.name) + '</b><span class="sr-meta">' + esc(it.id) + '・仕入 ' + yen(it.cost) + '</span></div>' +
        '<input class="sr-in" inputmode="decimal" data-draft="' + esc(it.id) + '" value="' + esc(draft[it.id] || '') + '" placeholder="査定額（7.2 / 72000）">' +
        '<span class="sr-hint">' + hint + (v != null ? '　仕入値との差 ' + sgn(v - (it.cost || 0)) : '') + '</span></div>';
    }).join('');
    return '<section class="sr-card">' +
      '<label class="sr-l" for="sr-store">いまいる店</label><select class="sr-in" id="sr-store" data-field="store"><option value="">選んでください</option>' +
      STORES.map(function (s) { return '<option' + (s.name === store ? ' selected' : '') + '>' + esc(s.name) + '</option>'; }).join('') +
      '<option value="__other"' + (store && !STORES.some(function (s) { return s.name === store; }) ? ' selected' : '') + '>その他（入力）</option></select>' +
      (store && !STORES.some(function (s) { return s.name === store; }) || st.storeOther ? '<input class="sr-in" data-field="storeOther" value="' + esc(st.storeOther || (store === '__other' ? '' : store)) + '" placeholder="店名">' : '') +
      '<label class="sr-l">この店は買った品を店頭で売る？</label><div class="sr-seg">' +
      [['店頭', '店頭で売る'], ['本部・オク', '本部・オク'], ['未確認', 'まだ聞いてない']].map(function (o) { return '<button data-sale="' + o[0] + '" class="' + ((st.sale || '未確認') === o[0] ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>' +
      '<div class="sr-2"><div><label class="sr-l" for="sr-exp">有効期限</label><input class="sr-in" id="sr-exp" data-field="expiry" value="' + esc(st.expiry || '') + '" placeholder="例 1週間"></div>' +
      '<div><label class="sr-l" for="sr-why">減額の理由</label><input class="sr-in" id="sr-why" data-field="reason" value="' + esc(st.reason || '') + '" placeholder="例 角スレ"></div></div></section>' +
      '<section class="sr-card"><h3>持っていく品の査定額</h3>' +
      (targets.length ? rows : '<p class="sr-sub">「持っていく」タブで品を選ぶと、ここに並びます。</p>') +
      (targets.length ? '<button class="sr-btn pri" data-act="saveLog">この店の査定をシートに記録する</button>' : '') +
      '<p class="sr-msg" id="sr-savemsg">' + esc(st.lastMsg || '') + '</p></section>' +
      '<section class="sr-card sr-note"><b>ルール</b>　その場では売らない。全店回ってから最高値の店に売る。30分以上待つなら預けて次の店へ。</section>';
  }

  function viewStock() {
    var rows = data.items.map(function (it) { return { it: it, c: calc(it) }; });
    var sold = rows.filter(function (r) { return isSold(r.it); }), hold = rows.filter(function (r) { return !isSold(r.it); });
    var sum = function (arr, f) { return arr.reduce(function (a, r) { return a + (f(r) || 0); }, 0); };
    var appr = hold.filter(function (r) { return r.c.kind === '査定'; });
    var red = appr.filter(function (r) { return r.c.diff < 0; }).length;
    var f = st.filter || 'all';
    var list = rows.filter(function (r) {
      return f === 'all' || (f === 'sold' && isSold(r.it)) || (f === 'hold' && !isSold(r.it)) || (f === 'red' && !isSold(r.it) && r.c.diff != null && r.c.diff < 0);
    }).sort(function (a, b) { return (isSold(a.it) - isSold(b.it)) || ((a.c.diff || 0) - (b.c.diff || 0)); });
    return '<div class="sr-sum">' +
      cell('商品数', rows.length + '点', '売却済 ' + sold.length + '／残り ' + hold.length) +
      cell('仕入れ合計', yen(sum(rows, function (r) { return r.it.cost; })), 'うち残り ' + yen(sum(hold, function (r) { return r.it.cost; }))) +
      cell('売却済の確定利益', sgn(sum(sold, function (r) { return r.c.diff; })), sold.length + '点', true) +
      cell('査定が出ている' + appr.length + '点を今の査定額で全部売ったら', sgn(sum(appr, function (r) { return r.c.diff; })), '送料・報酬は引く前／赤字 ' + red + '点', true) +
      '</div><div class="sr-seg">' + [['all', 'すべて'], ['red', '赤字'], ['hold', '残り'], ['sold', '売却済']].map(function (o) { return '<button data-filter="' + o[0] + '" class="' + (f === o[0] ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>' +
      list.map(function (r) { return itemCard(r.it, r.c); }).join('');
  }
  function cell(l, v, s, color) {
    var cls = color ? (v.charAt(0) === '−' ? ' neg' : ' pos') : '';
    return '<div class="sr-cell"><span class="sr-meta">' + l + '</span><b class="sr-big' + cls + '">' + v + '</b><span class="sr-meta">' + s + '</span></div>';
  }
  function itemCard(it, c) {
    var inCarry = (st.carry || []).indexOf(it.id) >= 0;
    var third = isSold(it) ? ['売却額（' + esc(it.soldTo || '') + '）', yen(it.soldPrice)] : (c.best ? ['最高査定（' + esc(c.best.store) + '）', yen(c.best.amount)] : ['想定売値', yen(it.expected)]);
    return '<article class="sr-item ' + (c.diff == null ? '' : (c.diff < 0 ? 'loss' : 'gain')) + '">' +
      '<div class="sr-rowhead"><b>' + esc(it.name) + '</b><span class="sr-chip">' + esc(it.status || '') + '</span></div>' +
      '<span class="sr-meta">' + esc(it.id) + '・' + esc(it.brand) + '・仕入 ' + esc(it.source) + ' ' + esc(it.boughtAt) + '・担当 ' + esc(it.buyer) + '</span>' +
      '<div class="sr-3"><div><span class="sr-meta">仕入値</span><b>' + yen(it.cost) + '</b></div><div><span class="sr-meta">' + third[0] + '</span><b>' + third[1] + '</b></div>' +
      '<div><span class="sr-meta">差（' + c.kind + '）</span><b class="' + (c.diff == null ? '' : (c.diff < 0 ? 'neg' : 'pos')) + '">' + sgn(c.diff) + '</b></div></div>' +
      (c.apps.length && !isSold(it) ? '<div class="sr-apps">' + c.apps.map(function (a) {
        return '<span>' + esc(a.store) + ' <b>' + yen(a.amount) + '</b>' + (a.log && a.by === st.name ? ' <button class="sr-x" data-unlog="' + esc(a.log.at) + '|' + esc(it.id) + '|' + esc(a.store) + '">取消</button>' : '') + '</span>';
      }).join('') + '</div>' : '') +
      (!isSold(it) ? '<button class="sr-mini" data-carry="' + esc(it.id) + '">' + (inCarry ? '持っていくリストから外す' : '持っていくリストに入れる') + '</button>' : '') +
      '</article>';
  }

  function viewCarry() {
    var ids = st.carry || [];
    var items = ids.map(byId).filter(Boolean);
    var tc = 0, tb = 0, nb = 0;
    var rows = items.map(function (it) {
      var c = calc(it); tc += it.cost || 0; if (c.best) { tb += c.best.amount; nb++; }
      return '<div class="sr-row"><div class="sr-rowhead"><b>' + esc(it.name) + '</b><button class="sr-x" data-carry="' + esc(it.id) + '">外す</button></div>' +
        '<span class="sr-meta">' + esc(it.id) + '・仕入 ' + yen(it.cost) + '・' + (c.best ? '最高 ' + yen(c.best.amount) + '（' + esc(c.best.store) + '）' : '査定なし') + '・差 ' + sgn(c.diff) + '</span></div>';
    }).join('');
    return '<section class="sr-card"><h3>今から持っていく品（' + items.length + '点）</h3>' + (rows || '<p class="sr-sub">まだありません。下から選ぶか、「在庫・損益」から入れてください。</p>') +
      (items.length ? '<div class="sr-3"><div><span class="sr-meta">仕入れ合計</span><b>' + yen(tc) + '</b></div><div><span class="sr-meta">査定済み' + nb + '点の最高値合計</span><b>' + yen(tb) + '</b></div><div><span class="sr-meta">差</span><b class="' + (tb - tc < 0 ? 'neg' : 'pos') + '">' + (nb ? sgn(tb - tc) : '—') + '</b></div></div>' : '') +
      '</section><section class="sr-card"><h3>品を追加</h3><select class="sr-in" id="sr-additem"><option value="">選んでください</option>' + itemOptions('') + '</select>' +
      '<button class="sr-btn" data-act="addCarry">追加する</button>' + (items.length ? '<button class="sr-mini" data-act="clearCarry">リストを空にする</button>' : '') + '</section>';
  }

  function viewWhere() {
    var ranked = STORES.filter(function (s) { return s.rank; }).sort(function (a, b) { return a.rank - b.rank; });
    return '<section class="sr-card"><h3>店頭（高く買いそうな順）</h3>' + ranked.map(function (s) {
      return '<div class="sr-row"><div class="sr-rowhead"><b>' + s.rank + '. ' + esc(s.name) + '</b><span class="sr-chip t' + s.type + '">' + TYPE[s.type] + '</span></div><span class="sr-meta">' + esc(s.area) + '・' + esc(s.why) + (s.tel ? '・' + esc(s.tel) : '') + '</span></div>';
    }).join('') + '</section>' +
      '<section class="sr-card"><h3>LINEで写真査定（4社に同時に送る）</h3>' + LINES.map(function (l) {
        return '<div class="sr-row"><div class="sr-rowhead"><b>' + esc(l.name) + '</b><span class="sr-meta">' + esc(l.area) + '</span></div><span class="sr-meta">' + esc(l.how) + '・' + esc(l.why) + (l.tel ? '・' + esc(l.tel) : '') + '</span>' +
          (l.line ? '<a class="sr-btn line" href="' + l.line + '" target="_blank" rel="noopener">LINEで友だち追加</a>' : '<a class="sr-btn" href="' + l.form + '" target="_blank" rel="noopener">査定フォームを開く</a>') + '</div>';
      }).join('') + '<p class="sr-sub">返事の額は「店頭で記録」の店を「その他」にして、店名に会社名を入れて記録してください。</p></section>' +
      '<section class="sr-card"><h3>出張（5点以上まとめて売るときだけ）</h3>' + TRIPS.map(function (t, i) {
        return '<div class="sr-row"><b>' + (i + 1) + '. ' + esc(t[0]) + '</b><span class="sr-meta">' + esc(t[1]) + (t[2] ? '・' + esc(t[2]) : '') + '</span></div>';
      }).join('') + '<p class="sr-sub">電話で「古物商として仕入れた品がまとまっている」と伝える。2社目以降に前の会社の額を伝えて上乗せを聞く。どこも大吉を下回れば売らずに大吉へ。</p></section>';
  }

  /* ---------- 操作 ---------- */
  ROOT.addEventListener('click', function (e) {
    var t = e.target.closest('button, a'); if (!t) return;
    if (t.dataset.view) { view = t.dataset.view; st.view = view; save(); render(); return; }
    if (t.dataset.filter) { st.filter = t.dataset.filter; save(); render(); return; }
    if (t.dataset.sale) { st.sale = t.dataset.sale; save(); render(); return; }
    if (t.dataset.carry) { toggleCarry(t.dataset.carry); return; }
    if (t.dataset.unlog) { unlog(t.dataset.unlog); return; }
    var act = t.dataset.act;
    if (act === 'login') return login();
    if (act === 'reload') return refresh();
    if (act === 'saveLog') return saveLog();
    if (act === 'addCarry') { var v = ROOT.querySelector('#sr-additem').value; if (v) toggleCarry(v, true); return; }
    if (act === 'clearCarry') { st.carry = []; save(); render(); }
  });
  ROOT.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.field === 'store') { if (t.value === '__other') { st.store = ''; st.storeOther = st.storeOther || ' '; } else { st.store = t.value; st.storeOther = ''; } st.lastMsg = ''; save(); render(); }
  });
  ROOT.addEventListener('input', function (e) {
    var t = e.target;
    if (t.dataset.draft) { st.draft = st.draft || {}; st.draft[t.dataset.draft] = t.value; save(); var pos = t.selectionStart, id = t.dataset.draft; render(); var el = ROOT.querySelector('[data-draft="' + id + '"]'); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (_) {} } return; }
    if (t.dataset.field && t.dataset.field !== 'store') { st[t.dataset.field] = t.value; save(); }
  });

  function toggleCarry(id, onlyAdd) {
    st.carry = st.carry || [];
    var i = st.carry.indexOf(id);
    if (i >= 0 && !onlyAdd) st.carry.splice(i, 1); else if (i < 0) st.carry.push(id);
    save(); render();
  }
  function login() {
    var pass = ROOT.querySelector('#sr-pass').value.trim(), name = ROOT.querySelector('#sr-name').value.trim();
    var msg = ROOT.querySelector('#sr-loginmsg');
    if (!pass || !name) { msg.textContent = '合言葉と名前の両方を入れてください。'; return; }
    msg.textContent = '確認中…';
    st.pass = pass;
    apiGet('ping').then(function (r) {
      if (r.ok) { st.name = name; save(); render(); refresh(); }
      else { st.pass = ''; msg.textContent = '合言葉が違います。'; }
    }).catch(function () { st.pass = ''; msg.textContent = 'つながりませんでした。電波のよい所でもう一度押してください。'; });
  }
  function refresh() {
    busy = true; render();
    apiGet('stock').then(function (r) {
      busy = false;
      if (!r.ok) { if (r.error === 'pass') { st.pass = ''; save(); } st.lastMsg = 'シートを読めませんでした（' + (r.error || '') + '）'; render(); return; }
      data = { items: r.items || [], logs: r.logs || [], at: r.at || '' };
      render();
    }).catch(function () { busy = false; st.lastMsg = 'つながりませんでした。「最新にする」をもう一度押してください。'; render(); });
  }
  function saveLog() {
    var store = st.store || (st.storeOther || '').trim();
    if (!store) { st.lastMsg = '店を選んでください。'; render(); return; }
    var rows = (st.carry || []).map(byId).filter(Boolean).map(function (it) {
      var v = parseYen((st.draft || {})[it.id]);
      return v == null ? null : { itemId: it.id, itemName: it.name, store: store, kind: STORES.some(function (s) { return s.name === store; }) ? '店頭' : 'その他', amount: v, sale: st.sale || '未確認', expiry: st.expiry || '', reason: st.reason || '' };
    }).filter(Boolean);
    if (!rows.length) { st.lastMsg = '査定額が1つも入っていません。'; render(); return; }
    st.lastMsg = '記録しています…'; render();
    apiPost({ action: 'log', rows: rows, by: st.name }).then(function (r) {
      if (!r.ok) { st.lastMsg = '記録できませんでした（' + (r.error || '') + '）。入力はそのまま残っています。'; render(); return; }
      st.lastMsg = store + 'の査定を' + r.added + '件、シートに記録しました。'; st.draft = {}; st.reason = ''; st.expiry = ''; save(); refresh();
    }).catch(function () { st.lastMsg = 'つながりませんでした。入力は残っているので、もう一度押してください。'; render(); });
  }
  function unlog(key) {
    var p = key.split('|');
    apiPost({ action: 'unlog', at: p[0], itemId: p[1], store: p.slice(2).join('|') }).then(function () { refresh(); }).catch(function () {});
  }

  function injectCss() {
    if (document.getElementById('sr-css')) return;
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Zen+Kaku+Gothic+New:wght@400;700;900&display=swap';
    document.head.appendChild(l);
    var c = document.createElement('style'); c.id = 'sr-css';
    c.textContent = [
      '.sr{--bg:#F3F5FA;--sf:#fff;--ink:#16213E;--mu:#5E6782;--ln:#DCE1EC;--navy:#2C3F73;--shu:#E5432F;--gold:#F2B23A;--mint:#14876B;',
      'font-family:"Zen Kaku Gothic New","Hiragino Sans",system-ui,sans-serif;color:var(--ink);background:var(--bg);max-width:640px;margin:0 auto;padding:14px;display:grid;gap:12px;font-size:15px;line-height:1.6;box-sizing:border-box}',
      '.sr *{box-sizing:border-box}.sr h2,.sr h3{margin:0}.sr h2{font-family:"Dela Gothic One",sans-serif;font-weight:400;font-size:22px}.sr h3{font-size:15px}',
      '.sr-top{display:flex;justify-content:space-between;align-items:center;gap:10px;background:var(--navy);color:#F5F7FF;border-radius:18px;padding:16px}',
      '.sr-kicker{font-size:11px;letter-spacing:.12em;color:var(--gold);font-weight:700}',
      '.sr-sub{margin:0;font-size:12px;color:var(--mu)}.sr-meta{font-size:11px;color:var(--mu)}',
      '.sr-tabs{position:sticky;top:0;z-index:5;background:var(--bg);display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:6px 0}',
      '.sr-tabs button,.sr-seg button{font:inherit;font-size:12px;font-weight:700;border:2px solid var(--ln);background:var(--sf);color:var(--ink);border-radius:12px;padding:9px 4px;cursor:pointer}',
      '.sr-tabs button.on,.sr-seg button.on{background:var(--navy);border-color:var(--navy);color:#fff}',
      '.sr-seg{display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:6px}',
      '.sr-card{background:var(--sf);border:1px solid var(--ln);border-radius:16px;padding:14px;display:grid;gap:10px}',
      '.sr-note{background:#FFF2D6;border:0;font-size:13px}',
      '.sr-l{font-size:12px;font-weight:700;color:var(--mu)}',
      '.sr-in{font:inherit;font-size:16px;width:100%;padding:10px 12px;border:2px solid var(--ln);border-radius:12px;background:var(--bg);color:var(--ink)}',
      '.sr-in:focus{outline:none;border-color:var(--navy)}',
      '.sr-btn{font:inherit;font-weight:900;font-size:14px;border:2px solid var(--ln);background:var(--sf);color:var(--ink);border-radius:12px;padding:11px 14px;cursor:pointer;text-align:center;text-decoration:none;display:block}',
      '.sr-btn.pri{background:var(--shu);border-color:var(--shu);color:#fff}.sr-btn.line{background:#06C755;border-color:#06C755;color:#fff}',
      '.sr-mini{font:inherit;font-size:12px;font-weight:700;border:1px solid var(--ln);background:var(--sf);color:var(--ink);border-radius:10px;padding:6px 10px;cursor:pointer;justify-self:start}',
      '.sr-x{font:inherit;font-size:11px;border:1px solid var(--ln);background:var(--sf);color:var(--mu);border-radius:8px;padding:2px 8px;cursor:pointer}',
      '.sr-msg{margin:0;font-size:13px;font-weight:700;color:var(--navy)}.sr-err{color:var(--shu)}',
      '.sr-row{display:grid;gap:4px;background:var(--bg);border-radius:12px;padding:10px}',
      '.sr-rowhead{display:flex;justify-content:space-between;gap:8px;align-items:start}',
      '.sr-hint{font-size:12px;color:var(--mu)}.sr-up{color:var(--shu)}',
      '.sr-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.sr-2>div{display:grid;gap:4px;min-width:0}',
      '.sr-3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.sr-3>div{background:var(--bg);border-radius:10px;padding:6px 8px;display:grid;min-width:0}',
      '.sr-sum{display:grid;grid-template-columns:1fr 1fr;gap:8px}.sr-cell{background:var(--sf);border:1px solid var(--ln);border-radius:14px;padding:10px;display:grid;gap:2px;min-width:0}',
      '.sr-big{font-family:"Dela Gothic One",sans-serif;font-weight:400;font-size:18px}',
      '.pos{color:var(--mint)}.neg{color:var(--shu)}',
      '.sr-item{background:var(--sf);border:1px solid var(--ln);border-radius:14px;padding:12px;display:grid;gap:8px}',
      '.sr-item.loss{border-left:5px solid var(--shu)}.sr-item.gain{border-left:5px solid var(--mint)}',
      '.sr-chip{font-size:11px;font-weight:900;padding:2px 8px;border-radius:999px;background:#ECEFF5;white-space:nowrap}',
      '.sr-chip.tA{background:#ECEFF5;color:var(--mu)}.sr-chip.tB{background:#FFF2D6}.sr-chip.tC{background:#DDF3EC;color:var(--mint)}',
      '.sr-apps{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:12px}',
      '.sr-item b,.sr-3 b,.sr-big{font-variant-numeric:tabular-nums}'
    ].join('\n');
    document.head.appendChild(c);
  }

  render();
  if (st.pass && st.name) refresh();
})();
