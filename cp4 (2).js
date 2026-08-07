/* ============================================================
   FinBook クーポンウィジェット  cp4.js
   jsDelivr配信用 / Webflow CMS Collection List から読み込む
   ============================================================ */
(function(){
"use strict";

/* ===== 設定 ===== */
var CFG = {
  mount:   "cp4mount",            // ウィジェットを描画する空divのID
  srcSel:  ".cp4src",             // カードの供給元（Collection List Wrapper に付けるクラス）
  backUrl: "/finbook-standard-member",
  logUrl:  ""                     // 利用ログのPOST先。空なら送らない
};

var CSS = `
#cp4{--ink:#5A4632;--in2:#A5906F;--in3:#BCAE90;--line:#EFE4C9;--card:#FFFDF4;
  --leaf:#4FAE49;--leaf-d:#3D8C39;--gold:#F7C948;--gold-d:#DCA31F;--coral:#FF8A5C;--coral-d:#E06A3E;
  --sh:0 4px 0 rgba(120,90,40,.13);
  max-width:430px;margin:0 auto;font-family:'M PLUS Rounded 1c','Hiragino Maru Gothic ProN',sans-serif;
  background:linear-gradient(180deg,#A9E0F8 0,#DDF3FC 45%,#EAF7E4 100%);color:var(--ink);line-height:1.6;padding-bottom:26px;min-height:100vh}
#cp4 *{margin:0;padding:0;box-sizing:border-box}
.cp4src{display:none!important}
#cp4 .cback{display:inline-flex;align-items:center;gap:5px;color:var(--ink);font-size:12px;font-weight:800;text-decoration:none;
  background:var(--card);border:2px solid var(--line);border-radius:999px;padding:7px 15px;margin-bottom:12px;box-shadow:0 3px 0 rgba(90,110,50,.18)}
#cp4 .h{background:transparent;padding:10px 16px 4px}
#cp4 .h h1{font-size:19px;font-weight:800;text-shadow:0 1px 0 #fff}
#cp4 .h p{font-size:11px;color:#3E6B8C;font-weight:700;margin-top:3px}
#cp4 .srch{display:flex;align-items:center;gap:8px;background:var(--card);border:2px solid var(--line);border-radius:999px;padding:9px 14px;margin-top:9px;box-shadow:var(--sh)}
#cp4 .srch input{border:0;outline:0;flex:1;font-size:13px;font-family:inherit;background:transparent;color:var(--ink);font-weight:700}
#cp4 .srch .si{font-size:14px;color:var(--in3)}
#cp4 .chips{display:flex;gap:8px;overflow-x:auto;padding:9px 16px 4px;scrollbar-width:none}
#cp4 .chips::-webkit-scrollbar{display:none}
#cp4 .chip{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:4px;border:0;background:transparent;cursor:pointer;width:62px;
  font-size:9.5px;font-weight:800;color:var(--in2);line-height:1.2;text-align:center;font-family:inherit}
#cp4 .chip span{width:50px;height:50px;border-radius:17px;display:grid;place-items:center;font-size:22px;background:var(--card);border:2px solid var(--line);box-shadow:0 3px 0 rgba(120,90,40,.1)}
#cp4 .chip.on span{background:var(--cc);border-color:var(--cc);box-shadow:0 3px 0 rgba(60,45,20,.25)}
#cp4 .chip.on{color:var(--ink)}
#cp4 .ctrl{display:flex;gap:8px;padding:5px 16px 0;align-items:center}
#cp4 .sort{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;flex:1}
#cp4 .sort::-webkit-scrollbar{display:none}
#cp4 .sbtn{flex:0 0 auto;border:2px solid var(--line);background:var(--card);color:var(--in2);font-size:11px;font-weight:800;border-radius:999px;padding:7px 13px;cursor:pointer;font-family:inherit}
#cp4 .sbtn.on{background:linear-gradient(135deg,#6FC868,var(--leaf));color:#fff;border-color:var(--leaf-d);box-shadow:0 2px 0 var(--leaf-d)}
#cp4 .sbtn.tgl.on{background:linear-gradient(135deg,#8FD3F4,#5AAFE0);border-color:#3E8FC4;box-shadow:0 2px 0 #3E8FC4}
#cp4 .rad{display:flex;align-items:center;gap:7px;overflow-x:auto;scrollbar-width:none;padding:6px 16px 2px}
#cp4 .rad::-webkit-scrollbar{display:none}
#cp4 .rlb{flex:0 0 auto;font-size:10.5px;font-weight:800;color:var(--in3)}
#cp4 .rbtn{flex:0 0 auto;border:2px solid var(--line);background:var(--card);color:var(--in2);font-size:11px;font-weight:800;border-radius:999px;padding:7px 13px;cursor:pointer;font-family:inherit;transition:.15s}
#cp4 .rbtn.on{background:linear-gradient(135deg,#FFE07A,var(--gold));color:#7A5200;border-color:var(--gold-d);box-shadow:0 2px 0 var(--gold-d)}
#cp4 .rad.locked .rbtn{opacity:.45}
#cp4 .rad.locked .rbtn.on{background:var(--card);color:var(--in2);border-color:var(--line);box-shadow:none}
#cp4 .geo{margin:9px 16px 0;background:#FFF1E8;border:2px dashed var(--coral);border-radius:13px;padding:10px 12px;font-size:10.5px;font-weight:800;color:var(--coral-d);display:none;align-items:center;gap:8px}
#cp4 .geo button{margin-left:auto;border:0;background:linear-gradient(135deg,#FF9E74,var(--coral));color:#fff;font-weight:800;font-size:11px;border-radius:999px;padding:6px 13px;cursor:pointer;font-family:inherit;flex-shrink:0;box-shadow:0 2px 0 var(--coral-d)}
#cp4 .sech{display:flex;align-items:baseline;gap:8px;padding:10px 18px 2px}
#cp4 .sech b{font-size:14.5px;font-weight:800}
#cp4 .sech small{font-size:10px;color:var(--in3);font-weight:700}
#cp4 .list{padding:6px 16px 0}
#cp4 .c4card{background:var(--card);border:2px solid var(--line);border-radius:19px;overflow:hidden;margin-bottom:14px;box-shadow:var(--sh)}
#cp4 .c4img{position:relative;width:100%;height:168px;background:#E9E1CC;overflow:hidden}
#cp4 .c4gal{display:flex;width:100%;height:100%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}
#cp4 .c4gal::-webkit-scrollbar{display:none}
#cp4 .c4gal img{flex:0 0 100%;width:100%;height:100%;object-fit:cover;scroll-snap-align:start;display:block}
#cp4 .c4ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;text-align:center;padding:16px 18px;position:relative;overflow:hidden}
#cp4 .c4ph:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 22% 18%,rgba(255,255,255,.35),transparent 58%)}
#cp4 .c4ph i{font-size:30px;font-style:normal;position:relative;z-index:1;filter:drop-shadow(0 2px 3px rgba(60,45,20,.25))}
#cp4 .c4ph b{font-size:16px;font-weight:800;color:#fff;line-height:1.35;position:relative;z-index:1;text-shadow:0 2px 5px rgba(60,45,20,.35);word-break:break-word}
#cp4 .c4ph em{font-size:9.5px;font-style:normal;font-weight:800;color:rgba(255,255,255,.88);position:relative;z-index:1;letter-spacing:.5px}
#cp4 .c4dots{position:absolute;right:12px;bottom:12px;display:flex;gap:5px;align-items:center;background:rgba(60,45,20,.45);border-radius:999px;padding:5px 8px}
#cp4 .c4dots i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.55);transition:.2s}
#cp4 .c4dots i.on{background:#fff;width:14px;border-radius:999px}
#cp4 .c4dots.off{display:none}
#cp4 .c4badge{position:absolute;left:12px;bottom:12px;color:#fff;font-size:12.5px;font-weight:800;border-radius:999px;padding:6px 13px;box-shadow:0 3px 0 rgba(60,45,20,.3);border:2px solid #fff}
#cp4 .c4tags{position:absolute;left:12px;top:12px;display:flex;gap:6px;flex-wrap:wrap}
#cp4 .c4t{font-size:10px;font-weight:800;border-radius:999px;padding:4px 9px;color:#fff}
#cp4 .c4t.fav{background:rgba(60,45,20,.6)}
#cp4 .c4t.new{background:var(--coral)}
#cp4 .c4t.onl{background:#3E8FC4}
#cp4 .c4bd{padding:12px 14px 14px}
#cp4 .c4nm{font-size:15.5px;font-weight:800}
#cp4 .c4meta{font-size:10.5px;color:var(--in2);font-weight:700;margin-top:5px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
#cp4 .c4cat{background:#fff;border:1.5px solid;font-size:9.5px;font-weight:800;border-radius:999px;padding:2px 8px}
#cp4 .c4area.onl{color:#3E8FC4;font-weight:800}
#cp4 .c4dist{color:var(--leaf-d);font-weight:800}
#cp4 .c4cond{font-size:10px;color:var(--in2);font-weight:700;margin-top:8px;line-height:1.55;background:#F6F1E2;border-radius:10px;padding:8px 10px}
#cp4 .c4cond.off{display:none}
#cp4 .c4act{display:flex;gap:9px;margin-top:12px}
#cp4 .c4use{flex:1;border:0;color:#fff;font-size:13px;font-weight:800;border-radius:999px;padding:12px;cursor:pointer;font-family:inherit;box-shadow:0 3px 0 rgba(60,45,20,.22)}
#cp4 .c4use:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(60,45,20,.22)}
#cp4 .c4link{flex-shrink:0;display:flex;align-items:center;justify-content:center;text-decoration:none;border:2px solid var(--line);background:#fff;color:var(--ink);font-size:15px;border-radius:14px;width:48px}
#cp4 .c4link.off{display:none}
#cp4 .c4sub{display:block;text-align:center;font-size:11px;font-weight:800;color:var(--leaf-d);text-decoration:none;margin-top:9px;border:2px solid #BFE2B4;border-radius:999px;padding:9px;background:#F2FAEE}
#cp4 .c4sub.off{display:none}
#cp4 .more{display:block;width:calc(100% - 32px);margin:2px 16px 8px;border:2px solid var(--line);background:var(--card);color:var(--ink);
  font-size:13px;font-weight:800;border-radius:999px;padding:13px;cursor:pointer;font-family:inherit;box-shadow:var(--sh)}
#cp4 .more.off{display:none}
#cp4 .empty{text-align:center;color:var(--in3);font-size:12px;font-weight:700;padding:34px 0}
#cp4 .mod{position:fixed;inset:0;z-index:120;background:rgba(70,55,30,.6);display:none;align-items:center;justify-content:center;padding:20px}
#cp4 .mod.open{display:flex}
#cp4 .mc{width:100%;max-width:360px;max-height:92vh;overflow-y:auto;background:var(--card);border:2.5px solid var(--line);border-radius:22px;padding:24px 20px;text-align:center;position:relative;
  box-shadow:0 6px 0 rgba(120,90,40,.18),0 18px 44px rgba(60,45,20,.35);color:var(--ink)}
#cp4 .mx{position:absolute;top:12px;right:12px;border:0;background:#F0E8D2;width:32px;height:32px;border-radius:50%;font-size:14px;cursor:pointer;font-family:inherit;color:var(--ink);z-index:2}
#cp4 .mnm{font-size:15.5px;font-weight:800;padding:0 26px}
#cp4 .mdis{font-size:23px;font-weight:800;color:var(--coral-d);margin:10px 0}
#cp4 .mwarn{font-size:10.5px;font-weight:700;background:#FFF9E2;border:2px dashed var(--gold);border-radius:13px;padding:12px;margin:12px 0}
#cp4 .mwarn b{color:var(--gold-d)}
#cp4 .mcond{font-size:10.5px;color:var(--in2);font-weight:700;text-align:left;line-height:1.6}
#cp4 .mexp{font-size:10.5px;font-weight:800;color:var(--coral-d);margin-top:8px}
#cp4 .mid{font-size:11.5px;font-weight:800;background:#F0E8D2;border-radius:11px;padding:9px;margin-top:10px}
#cp4 .mcode{display:flex;align-items:center;gap:9px;background:#EAF3FA;border:2px solid #BFDCF0;border-radius:13px;padding:10px 12px;margin-top:11px}
#cp4 .mcode span{flex:1;font-size:15px;font-weight:800;letter-spacing:1.5px;text-align:left;color:#2C6A96;word-break:break-all}
#cp4 .mcode button{flex-shrink:0;border:0;background:linear-gradient(135deg,#8FD3F4,#5AAFE0);color:#fff;font-size:11px;font-weight:800;border-radius:999px;padding:8px 14px;cursor:pointer;font-family:inherit;box-shadow:0 2px 0 #3E8FC4}
#cp4 .mcta{display:block;width:100%;border:0;color:#fff;font-size:14.5px;font-weight:800;border-radius:999px;padding:14px;margin-top:12px;cursor:pointer;text-decoration:none;
  box-shadow:0 3px 0 rgba(60,45,20,.25);font-family:inherit;text-align:center}
#cp4 .mcta:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(60,45,20,.25)}
#cp4 .msub{display:flex;gap:8px;margin-top:9px}
#cp4 .msub:empty{display:none}
#cp4 .msub a{flex:1;display:flex;align-items:center;justify-content:center;gap:4px;text-decoration:none;border:2px solid var(--line);background:#fff;color:var(--ink);
  font-size:11px;font-weight:800;border-radius:13px;padding:10px 6px;font-family:inherit}
#cp4 .msub a.dim{opacity:.4;pointer-events:none}
#cp4 .mword{font-size:11px;font-weight:800;color:#7A5200;background:#FFF9E2;border:2px dashed var(--gold);border-radius:12px;padding:11px;margin-top:11px;line-height:1.6}
#cp4 .mhrs{font-size:10px;font-weight:700;color:var(--in3);margin-top:7px}
#cp4 .mshow{background:linear-gradient(135deg,#6FC868,var(--leaf));color:#fff;border-radius:999px;padding:13px;font-size:14px;font-weight:800;margin-top:12px;cursor:pointer;box-shadow:0 3px 0 var(--leaf-d)}
#cp4 .mshow:active{transform:translateY(2px);box-shadow:0 1px 0 var(--leaf-d)}
#cp4 .mshow.done{background:#D8D2C2;color:#8A8375;box-shadow:none;pointer-events:none}
#cp4 .mtime{font-size:10.5px;color:var(--in3);margin-top:10px;font-weight:700}
`;

var CAT = {
  food:   ["\uD83C\uDF7D 飲食",       "#F5A25A"],
  cafe:   ["\u2615 カフェ",           "#C9A06A"],
  beauty: ["\uD83D\uDC88 美容・サロン","#EE9EBE"],
  relax:  ["\uD83D\uDC86 リラク・整体","#B0A0E0"],
  fit:    ["\uD83D\uDCAA フィットネス","#8CCB84"],
  fun:    ["\uD83C\uDFA1 遊び・エンタメ","#F0C05A"],
  shop:   ["\uD83D\uDECD ショッピング","#8AB8E8"],
  life:   ["\uD83C\uDFE1 暮らし・生活","#8AC5CC"],
  travel: ["\u2708 旅行・宿泊",       "#7EC0E0"],
  learn:  ["\uD83D\uDCDA 習い事・学び","#E098C0"],
  pet:    ["\uD83D\uDC3E ペット",     "#DCA871"],
  other:  ["\u2728 その他",           "#B8A98E"]
};

var CHIPS = [
  ["all","🏠","すべて","#F5A25A"],["food","🍽","飲食","#F5A25A"],["cafe","☕","カフェ","#C9A06A"],
  ["beauty","💈","美容・サロン","#EE9EBE"],["relax","💆","リラク・整体","#B0A0E0"],["fit","💪","フィットネス","#8CCB84"],
  ["fun","🎡","遊び・エンタメ","#F0C05A"],["shop","🛍","ショッピング","#8AB8E8"],["life","🏡","暮らし・生活","#8AC5CC"],
  ["travel","✈","旅行・宿泊","#7EC0E0"],["learn","📚","習い事・学び","#E098C0"],["pet","🐾","ペット","#DCA871"],
  ["other","✨","その他","#B8A98E"]
];

function shell(){
  var chips = CHIPS.map(function(c){
    return '<button class="chip' + (c[0]==="all"?" on":"") + '" data-g="' + c[0] + '" type="button" style="--cc:' + c[3] + '"><span>' + c[1] + '</span>' + c[2] + '</button>';
  }).join("");
  return '' +
  '<div class="h">' +
    '<a href="' + CFG.backUrl + '" class="cback">← ホームに戻る</a>' +
    '<h1>🎟 クーポン</h1><p>会員だけのお得 ・ 提携店でつかえる</p>' +
    '<div class="srch"><span class="si">🔍</span><input id="cp4s" placeholder="店名・エリアで探す" type="text"></div>' +
  '</div>' +
  '<div class="chips">' + chips + '</div>' +
  '<div class="ctrl"><div class="sort">' +
    '<button class="sbtn on" data-s="new" type="button">✨ 新着順</button>' +
    '<button class="sbtn" data-s="near" type="button">📍 近い順</button>' +
    '<button class="sbtn tgl" id="cp4onl" type="button">🌐 オンラインのみ</button>' +
  '</div></div>' +
  '<div class="rad" id="cp4rad"><span class="rlb">📍 範囲</span>' +
    '<button class="rbtn on" data-r="0" type="button">すべて</button>' +
    '<button class="rbtn" data-r="1" type="button">1km</button>' +
    '<button class="rbtn" data-r="3" type="button">3km</button>' +
    '<button class="rbtn" data-r="5" type="button">5km</button>' +
    '<button class="rbtn" data-r="10" type="button">10km</button></div>' +
  '<div class="geo" id="cp4geo"><span>📍 距離でしぼるには位置情報が必要です</span><button id="cp4geob" type="button">許可する</button></div>' +
  '<div class="sech"><b>提携店クーポン</b><small id="cpSecS"></small></div>' +
  '<div class="list" id="cp4list"></div>' +
  '<button class="more off" id="cp4more" type="button">もっと見る</button>' +
  '<div class="empty" id="cp4empty" style="display:none"></div>' +
  '<div class="mod" id="cp4mod"><div class="mc">' +
    '<button class="mx" id="cp4x" type="button">✕</button>' +
    '<div class="mnm" id="cp4mnm"></div><div class="mdis" id="cp4mdis"></div>' +
    '<div class="mwarn" id="cp4mwarn"></div>' +
    '<div class="mcond" id="cp4mcond"></div><div class="mexp" id="cp4mexp"></div>' +
    '<div class="mid" id="cp4mid" style="display:none"></div>' +
    '<div class="mcode" id="cp4mcode" style="display:none"><span id="cp4mcodev"></span><button id="cp4mcodec" type="button">コピー</button></div>' +
    '<a class="mcta" id="cp4mcta" style="display:none" target="_blank" rel="noopener"></a>' +
    '<div class="msub" id="cp4msub"></div><div class="mhrs" id="cp4mhrs"></div>' +
    '<div class="mword" id="cp4mword" style="display:none"></div>' +
    '<div class="mshow" id="cp4mshow">✅ 使用する</div>' +
    '<div class="mtime" id="cp4mt">表示時刻 --:--</div>' +
  '</div></div>';
}

var PAGE = 20;   /* 1回に描画する件数。100件でも初期表示を軽く保つ */

function boot(){
  var mount = document.getElementById(CFG.mount);
  if(!mount || mount.getAttribute("data-cp4") === "1") return;
  mount.setAttribute("data-cp4", "1");

  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  if(!document.querySelector('link[href*="M+PLUS+Rounded"]')){
    var f = document.createElement("link");
    f.rel = "stylesheet";
    f.href = "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&display=swap";
    document.head.appendChild(f);
  }

  var root = document.createElement("div");
  root.id = "cp4"; root.innerHTML = shell();
  mount.appendChild(root);

  var list = root.querySelector("#cp4list"),
      sb   = root.querySelector("#cp4s"),
      emp  = root.querySelector("#cp4empty"),
      geo  = root.querySelector("#cp4geo"),
      secS = root.querySelector("#cpSecS"),
      radBox = root.querySelector("#cp4rad"),
      onlBtn = root.querySelector("#cp4onl"),
      moreB  = root.querySelector("#cp4more"),
      mod  = root.querySelector("#cp4mod");

  var chips = root.querySelectorAll(".chip"),
      sbtns = root.querySelectorAll(".sbtn[data-s]"),
      rbtns = root.querySelectorAll(".rbtn");

  var gf="all", sf="new", rf=0, me=null, autoNear=false, onl=false, shown=PAGE;
  var today = new Date(); today.setHours(0,0,0,0);

  function att(c,k){ return (c.getAttribute(k)||"").trim(); }
  function typeOf(c){ return att(c,"data-type")==="online" ? "online" : "shop"; }
  function isUrl(s){ return s.indexOf("http")===0; }
  function shade(hex,p){
    var n=parseInt(hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
    r=Math.max(0,Math.min(255,Math.round(r+255*p)));
    g=Math.max(0,Math.min(255,Math.round(g+255*p)));
    b=Math.max(0,Math.min(255,Math.round(b+255*p)));
    return "rgb("+r+","+g+","+b+")";
  }

  /* ▼ Collection List（複数可）からカードを回収。Skip複製で100件超に対応 */
  [].slice.call(document.querySelectorAll(CFG.srcSel)).forEach(function(s){
    [].slice.call(s.querySelectorAll(".c4card")).forEach(function(c){ list.appendChild(c); });
  });

  var cards = [].slice.call(list.querySelectorAll(".c4card"));

  cards = cards.filter(function(c){
    var exp = att(c,"data-exp");
    if(exp){
      var ed = new Date(exp.replace(/-/g,"/"));
      if(!isNaN(ed.getTime()) && ed < today){ c.parentNode.removeChild(c); return false; }
    }
    var type = typeOf(c),
        g = att(c,"data-g")||"other", m = CAT[g]||CAT.other,
        nmEl = c.querySelector(".c4nm"), nm = nmEl ? nmEl.textContent.trim() : "";

    var cat = c.querySelector(".c4cat");
    if(cat){ cat.textContent = m[0]; cat.style.color = m[1]; cat.style.borderColor = m[1]; }
    var bdg = c.querySelector(".c4badge"); if(bdg) bdg.style.background = m[1];
    var use = c.querySelector(".c4use");   if(use) use.style.background = m[1];

    var gal = c.querySelector(".c4gal"), dots = c.querySelector(".c4dots");
    if(gal){
      [].slice.call(gal.querySelectorAll("img")).forEach(function(im){
        if(!isUrl((im.getAttribute("src")||"").trim())) im.parentNode.removeChild(im);
      });
      var ims = gal.querySelectorAll("img");
      if(ims.length === 0){
        var ph = document.createElement("div");
        ph.className = "c4ph";
        ph.style.background = "linear-gradient(140deg,"+shade(m[1],.10)+" 0%,"+m[1]+" 52%,"+shade(m[1],-.16)+" 100%)";
        ph.innerHTML = '<i>'+m[0].split(" ")[0]+'</i><b></b><em>'+(type==="online"?"ONLINE":"PHOTO COMING SOON")+'</em>';
        ph.querySelector("b").textContent = nm;
        gal.parentNode.insertBefore(ph, gal);
        gal.style.display = "none";
        if(dots) dots.classList.add("off");
      }else if(dots){
        if(ims.length < 2){ dots.classList.add("off"); }
        else{
          var h=""; for(var k=0;k<ims.length;k++){ h += '<i'+(k===0?' class="on"':'')+'></i>'; }
          dots.innerHTML = h;
          gal.addEventListener("scroll", function(){
            var idx = Math.round(gal.scrollLeft/gal.clientWidth);
            [].slice.call(dots.children).forEach(function(d,j){ d.classList.toggle("on", j===idx); });
          }, {passive:true});
        }
      }
    }

    var ar = c.querySelector(".c4area");
    if(ar){
      if(type === "online"){ ar.textContent = "🌐 オンライン"; ar.classList.add("onl"); }
      else if(!att(c,"data-area")){ ar.style.display = "none"; }
    }

    var stt = att(c,"data-start"), isNew = 0;
    if(stt){
      var sd = new Date(stt.replace(/-/g,"/"));
      if(!isNaN(sd.getTime()) && (today-sd)/86400000 <= 30) isNew = 1;
    }
    c.setAttribute("data-new", isNew);

    var tags = c.querySelector(".c4tags");
    if(tags){
      var t = "";
      if(type === "online") t += '<span class="c4t onl">🌐 オンライン</span>';
      if(att(c,"data-fav") === "true") t += '<span class="c4t fav">🔥 人気</span>';
      if(isNew) t += '<span class="c4t new">NEW</span>';
      tags.innerHTML = t;
    }

    var lk = c.querySelector(".c4link");
    if(lk && !isUrl((lk.getAttribute("href")||"").trim())) lk.classList.add("off");
    var sub = c.querySelector(".c4sub");
    if(sub && !isUrl((sub.getAttribute("href")||"").trim())) sub.classList.add("off");
    var cond = c.querySelector(".c4cond");
    if(cond && !cond.textContent.trim()) cond.classList.add("off");

    return true;
  });

  /* オンラインが1件も無ければトグルを出さない */
  if(onlBtn && cards.filter(function(c){ return typeOf(c)==="online"; }).length === 0) onlBtn.style.display = "none";

  function hasGeo(c){ return att(c,"data-lat")!=="" && att(c,"data-lng")!==""; }
  function distOf(c){
    if(!me || !hasGeo(c)) return null;
    var la = parseFloat(att(c,"data-lat")), lo = parseFloat(att(c,"data-lng"));
    if(isNaN(la)||isNaN(lo)) return null;
    var R=6371, dLa=(la-me.lat)*Math.PI/180, dLo=(lo-me.lng)*Math.PI/180,
        a=Math.sin(dLa/2)*Math.sin(dLa/2)+Math.cos(me.lat*Math.PI/180)*Math.cos(la*Math.PI/180)*Math.sin(dLo/2)*Math.sin(dLo/2);
    return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function render(){
    var q = (sb.value||"").trim();
    var vis = cards.filter(function(c){
      var type = typeOf(c);
      if(onl && type !== "online") return false;
      if(!(gf==="all" || att(c,"data-g")===gf)) return false;
      if(rf && me && type !== "online"){
        var d = distOf(c);
        if(d == null || d > rf) return false;
      }
      if(q){
        var t = c.querySelector(".c4nm").textContent + c.querySelector(".c4meta").textContent;
        if(t.indexOf(q) < 0) return false;
      }
      return true;
    });

    vis.forEach(function(c){
      var d = distOf(c), el = c.querySelector(".c4dist");
      if(el) el.textContent = (d!=null) ? ("・ "+(d<1?Math.round(d*1000)+"m":d.toFixed(1)+"km")) : "";
    });

    if(sf==="near" && me){
      vis.sort(function(a,b){
        var oa = typeOf(a)==="online"?0:1, ob = typeOf(b)==="online"?0:1;
        if(oa !== ob) return oa - ob;   /* オンラインを常に上へ */
        var da = distOf(a), db = distOf(b);
        if(da==null && db==null) return 0;
        if(da==null) return 1;
        if(db==null) return -1;
        return da - db;
      });
    }else{
      vis.sort(function(a,b){
        var oa = typeOf(a)==="online"?0:1, ob = typeOf(b)==="online"?0:1;
        return (oa - ob)   /* オンラインを常に上へ */
            || ((parseFloat(b.getAttribute("data-new"))||0) - (parseFloat(a.getAttribute("data-new"))||0))
            || ((parseFloat(att(a,"data-i"))||0) - (parseFloat(att(b,"data-i"))||0));
      });
    }

    cards.forEach(function(c){ c.style.display = "none"; });
    vis.slice(0, shown).forEach(function(c){ c.style.display = "block"; list.appendChild(c); });

    if(moreB){
      var rest = vis.length - shown;
      moreB.classList.toggle("off", rest <= 0);
      if(rest > 0) moreB.textContent = "もっと見る（残り " + rest + " 件）";
    }

    emp.textContent = cards.length ? "条件に合うクーポンがありません" : "クーポンは現在準備中です";
    emp.style.display = vis.length ? "none" : "block";
    if(secS) secS.textContent = vis.length + "件";
    if(radBox){ radBox.classList.toggle("locked", !me); radBox.style.display = onl ? "none" : "flex"; }
    geo.style.display = (!onl && !me && (sf==="near" || rf)) ? "flex" : "none";
  }

  function reset(){ shown = PAGE; render(); }

  function getLoc(){
    if(!navigator.geolocation){ render(); return; }
    navigator.geolocation.getCurrentPosition(function(p){
      me = {lat:p.coords.latitude, lng:p.coords.longitude};
      if(!autoNear){
        autoNear = true; sf = "near";
        sbtns.forEach(function(x){ x.classList.toggle("on", x.getAttribute("data-s")==="near"); });
      }
      reset();
    }, function(){ render(); }, {enableHighAccuracy:false, timeout:8000, maximumAge:300000});
  }

  chips.forEach(function(ch){
    ch.addEventListener("click", function(){
      chips.forEach(function(x){ x.classList.remove("on"); });
      ch.classList.add("on"); gf = ch.getAttribute("data-g"); reset();
    });
  });
  sbtns.forEach(function(b){
    b.addEventListener("click", function(){
      sbtns.forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on"); sf = b.getAttribute("data-s");
      if(sf==="near" && !me){ getLoc(); return; }
      reset();
    });
  });
  if(onlBtn) onlBtn.addEventListener("click", function(){ onl = !onl; onlBtn.classList.toggle("on", onl); reset(); });
  rbtns.forEach(function(b){
    b.addEventListener("click", function(){
      if(!me){ getLoc(); return; }
      rbtns.forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on"); rf = parseFloat(b.getAttribute("data-r"))||0; reset();
    });
  });
  if(moreB) moreB.addEventListener("click", function(){ shown += PAGE; render(); });
  sb.addEventListener("input", reset);
  root.querySelector("#cp4geob").addEventListener("click", getLoc);

  function code4(s){
    var h = 0;
    for(var i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i)) >>> 0; }
    return ("000" + (h % 10000)).slice(-4);
  }

  var mem = {id:"anon", name:"会員"};
  function stampMember(shop, d){
    var el = root.querySelector("#cp4mid");
    if(!el) return;
    el.style.display = "block";
    var ymd = d.getFullYear()+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2);
    var ms = window.$memberstackDom;
    if(!ms){ el.textContent = ymd + " ・ No." + code4(shop+ymd); return; }
    ms.getCurrentMember().then(function(r){
      var m = (r && r.data) ? r.data : null, cf = (m && m.customFields) || {};
      mem.name = cf["first-name"] || cf.first_name || "会員";
      mem.id   = (m && m.id) || "anon";
      el.textContent = mem.name + " 様 ・ " + ymd + " ・ No." + code4(mem.id+shop+ymd);
    })["catch"](function(){ el.textContent = ymd + " ・ No." + code4(shop+ymd); });
  }

  function openNow(h){
    if(!h) return true;
    var m = h.match(/(\d{1,2}):(\d{2})\s*[-〜~]\s*(\d{1,2}):(\d{2})/);
    if(!m) return true;
    var now = new Date(), cur = now.getHours()*60 + now.getMinutes();
    var s = (+m[1])*60 + (+m[2]), e = (+m[3])*60 + (+m[4]);
    return (e > s) ? (cur >= s && cur < e) : (cur >= s || cur < e);
  }

  function mkSub(label, href, dim){
    var a = document.createElement("a");
    a.textContent = label; a.setAttribute("href", href);
    if(href.indexOf("http")===0){ a.setAttribute("target","_blank"); a.setAttribute("rel","noopener"); }
    if(dim) a.className = "dim";
    return a;
  }

  function buildCta(c){
    var cta=root.querySelector("#cp4mcta"), subs=root.querySelector("#cp4msub"),
        word=root.querySelector("#cp4mword"), hrsEl=root.querySelector("#cp4mhrs"),
        codeB=root.querySelector("#cp4mcode"), codeV=root.querySelector("#cp4mcodev"),
        warn=root.querySelector("#cp4mwarn");

    subs.innerHTML=""; cta.style.display="none"; word.style.display="none";
    codeB.style.display="none"; hrsEl.textContent="";

    var type=typeOf(c), g=att(c,"data-g")||"other", m=CAT[g]||CAT.other,
        nm=c.querySelector(".c4nm").textContent.trim(), area=att(c,"data-area"),
        tel=att(c,"data-tel"), rsv=att(c,"data-reserve"), line=att(c,"data-line"),
        ig=att(c,"data-ig"), code=att(c,"data-code"), hrs=att(c,"data-hours"),
        lk=c.querySelector(".c4link"),
        url=(lk && isUrl((lk.getAttribute("href")||"").trim())) ? lk.getAttribute("href").trim() : "";
    var open = openNow(hrs);

    warn.innerHTML = (type==="online")
      ? (code ? 'お申し込み画面で<b>クーポンコード</b>を入力してください。'
              : '下のボタンからお申し込みください。<b>会員限定</b>の特典です。')
      : 'この画面を<b>お店のスタッフに見せて</b>ください。会計時のご提示で適用されます。';

    if(type==="online" && code){ codeV.textContent = code; codeB.style.display = "flex"; }

    var label="", href="", isTel=false;
    if(type==="online"){
      if(rsv||url){ label="🛒 サイトで使う"; href=rsv||url; }
    }else if(g==="beauty" || g==="relax"){
      if(line){ label="💬 LINEで予約"; href=line; }
      else if(rsv){ label="📅 予約する"; href=rsv; }
      else if(url){ label="📅 予約する"; href=url; }
      else if(tel){ label="📞 電話で予約"; href="tel:"+tel; isTel=true; }
    }else if(g==="food" || g==="cafe"){
      if(tel){ label="📞 電話する"; href="tel:"+tel; isTel=true; }
      else if(rsv||url){ label="🔗 サイトを見る"; href=rsv||url; }
    }else{
      if(url||rsv){ label="🔗 サイトを見る"; href=url||rsv; }
      else if(tel){ label="📞 電話する"; href="tel:"+tel; isTel=true; }
    }

    if(href){
      cta.textContent = label; cta.setAttribute("href", href);
      if(href.indexOf("http")===0){ cta.setAttribute("target","_blank"); cta.setAttribute("rel","noopener"); }
      else cta.removeAttribute("target");
      cta.style.background = "linear-gradient(135deg,"+shade(m[1],.10)+","+shade(m[1],-.12)+")";
      cta.style.display = "block";
      cta.style.opacity = (isTel && !open) ? ".45" : "1";
      cta.style.pointerEvents = (isTel && !open) ? "none" : "auto";
    }

    if(type !== "online"){
      subs.appendChild(mkSub("🗺 地図",
        "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(nm + (area ? " "+area : "")), false));
    }
    if(tel && !isTel) subs.appendChild(mkSub("📞 電話", "tel:"+tel, !open));
    if(line && href !== line) subs.appendChild(mkSub("💬 LINE", line, false));
    if(ig) subs.appendChild(mkSub("📷 Insta", ig, false));

    if(hrs) hrsEl.textContent = "営業時間 " + hrs + (open ? "" : " ・ ただいま営業時間外");

    if(type !== "online"){
      word.textContent = "ご予約・ご来店時に「お金の図書館を見た」とお伝えください。";
      word.style.display = "block";
    }
  }

  var codeBtn = root.querySelector("#cp4mcodec");
  if(codeBtn){
    codeBtn.addEventListener("click", function(){
      var v = root.querySelector("#cp4mcodev").textContent;
      var done = function(){
        codeBtn.textContent = "コピー済";
        setTimeout(function(){ codeBtn.textContent = "コピー"; }, 1600);
      };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(v).then(done)["catch"](done);
      }else{
        var ta = document.createElement("textarea");
        ta.value = v; document.body.appendChild(ta); ta.select();
        try{ document.execCommand("copy"); }catch(e){}
        document.body.removeChild(ta); done();
      }
    });
  }

  /* ▼利用ログ。CFG.logUrl が空なら何もしない */
  function logUse(c){
    if(!CFG.logUrl) return;
    var body = {
      member_id: mem.id,
      member_name: mem.name,
      shop: c.querySelector(".c4nm").textContent.trim(),
      slug: att(c,"data-slug"),
      type: typeOf(c),
      at: new Date().toISOString()
    };
    try{
      if(navigator.sendBeacon){
        navigator.sendBeacon(CFG.logUrl, new Blob([JSON.stringify(body)], {type:"application/json"}));
      }else{
        fetch(CFG.logUrl, {method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify(body), keepalive:true})["catch"](function(){});
      }
    }catch(e){}
  }

  var current = null;
  var mshow = root.querySelector("#cp4mshow");
  if(mshow){
    mshow.addEventListener("click", function(){
      if(!current) return;
      mshow.classList.add("done");
      mshow.textContent = "✅ 使用済み";
      logUse(current);
    });
  }

  list.addEventListener("click", function(e){
    var btn = e.target.closest ? e.target.closest(".c4use") : null;
    if(!btn) return;
    var c = btn.closest(".c4card");
    if(!c) return;
    current = c;
    var nm = c.querySelector(".c4nm").textContent;

    root.querySelector("#cp4mnm").textContent = nm;
    var bt = c.querySelector(".c4badge b");
    root.querySelector("#cp4mdis").textContent = bt ? bt.textContent.trim() : "";
    var cond = c.querySelector(".c4cond");
    root.querySelector("#cp4mcond").textContent = (cond && !cond.classList.contains("off")) ? cond.textContent : "";
    var exp = att(c,"data-exp");
    root.querySelector("#cp4mexp").textContent = exp ? ("有効期限 " + exp.replace(/-/g,"/") + " まで") : "";
    var d = new Date();
    root.querySelector("#cp4mt").textContent =
      "表示時刻 " + ("0"+d.getHours()).slice(-2) + ":" + ("0"+d.getMinutes()).slice(-2);

    mshow.classList.remove("done"); mshow.textContent = "✅ 使用する";
    stampMember(nm, d);
    buildCta(c);
    mod.classList.add("open");
    var mc = mod.querySelector(".mc"); if(mc) mc.scrollTop = 0;
  });

  root.querySelector("#cp4x").addEventListener("click", function(){ mod.classList.remove("open"); });
  mod.addEventListener("click", function(e){ if(e.target === mod) mod.classList.remove("open"); });

  /* iframe内では「ホームに戻る」を親へ通知 */
  if(window.self !== window.top){
    var back = root.querySelector(".cback");
    if(back){
      back.setAttribute("href", "#");
      back.addEventListener("click", function(e){
        e.preventDefault();
        try{ parent.postMessage("fb-back", "*"); }catch(x){}
      });
    }
  }

  getLoc();
  render();
}

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

})();
