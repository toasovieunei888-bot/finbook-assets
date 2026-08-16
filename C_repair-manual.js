/*! C_repair-manual.js  リペアマニュアル 会員ホーム組み込み版 v24
    置き場所: toasovieunei888-bot/finbook-assets 直下
    読み込み: Webflow の新規Embed 1個（webflow-embed-snippet.txt を参照）
    仕様:
      - #scr-repair の .subtabs に「📗 マニュアル」タブを自動追加
      - ペインは id="rp-manual" class="rp-pane" で #rp-tool の隣に生成
      - 他タブを押したときの閉じる処理は A_finbook-home.js が担当（触らんでよい）
      - CSSは全部 #rp-manual の中。.tool は .rmtool に改名済み（会員ホーム側と衝突するため）
      - 症例データは repair-daicho-v21-data.js（D / MATS / T / KNOW / ASK）を動的に読み込む
*/
(function(){
if(window.__RPMAN_LOADED__)return; window.__RPMAN_LOADED__=1;

var GH={user:"toasovieunei888-bot",repo:"finbook-assets",branch:"main",dir:"photos"};
var BASE="https://cdn.jsdelivr.net/gh/"+GH.user+"/"+GH.repo+"@"+GH.branch+"/";
var DATA_URL=BASE+"repair-daicho-v21-data.js";
var PIC_BASE=BASE+GH.dir+"/";

/* =============== CSS =============== */
var CSS=
"#rp-manual{"+
"--sky1:#A8DEF5;--sky3:#E8F7FA;--grass:#7CC576;--grassd:#54A05B;"+
"--cream:#FFF8EC;--cream2:#FDF0DA;--tan:#E3C89B;--tand:#C9A86A;"+
"--rink:#4A3A2A;--rink2:#7C6A56;--rink3:#A9977F;"+
"--ok:#2E9E55;--oks:#E4F6E9;--mid:#D9901F;--mids:#FDF1DA;"+
"--bad:#D2493A;--bads:#FCE8E5;--tec:#4E8FD1;--tecs:#E7F0FA;"+
"--danger:#C62828;--dangers:#FDECEA;"+
"color:var(--rink);font-size:15px;line-height:1.7;text-align:left}"+
"#rp-manual *{box-sizing:border-box}"+

"#rp-manual .rmlead{background:var(--cream);border:2px solid var(--tan);border-radius:12px;padding:10px 12px;font-size:12.5px;font-weight:700;color:var(--rink2);margin-bottom:10px}"+

"#rp-manual .rmtabs{display:flex;gap:6px;margin:0 0 10px}"+
"#rp-manual .rmtab{flex:1;text-align:center;padding:9px 4px;border-radius:12px;border:2px solid var(--tan);background:#fff;color:var(--rink2);font-weight:800;cursor:pointer;font-size:12.5px;font-family:inherit}"+
"#rp-manual .rmtab.on{background:var(--grass);border-color:var(--grassd);color:#fff}"+

"#rp-manual #rm-q{width:100%;padding:12px 14px;border:2px solid var(--tan);border-radius:12px;font-size:16px;font-family:inherit;background:#fff;color:var(--rink)}"+
"#rp-manual .rmwordbar{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 12px}"+
"#rp-manual .rmword{padding:5px 12px;border-radius:99px;border:2px solid var(--tan);background:#fff;font-size:12.5px;font-weight:700;color:var(--rink2);cursor:pointer;font-family:inherit}"+
"#rp-manual .rmword.on{background:var(--tand);border-color:var(--tand);color:#fff}"+

"#rp-manual .rmmats{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}"+
"#rp-manual .rmmat{background:#fff;border:2px solid var(--tan);border-radius:14px;padding:12px 6px 9px;text-align:center;cursor:pointer}"+
"#rp-manual .rmmat:active{background:var(--cream2)}"+
"#rp-manual .rmmat .rmic{font-size:28px;line-height:1}"+
"#rp-manual .rmmat b{display:block;font-size:13.5px;margin-top:4px}"+
"#rp-manual .rmmat .rmcnt{font-size:11px;color:var(--rink3)}"+
"#rp-manual .rmmat .rmmini{display:flex;gap:3px;justify-content:center;margin-top:5px}"+
"#rp-manual .rmmat .rmmini i{font-style:normal;font-size:9.5px;font-weight:800;padding:1px 5px;border-radius:99px}"+
"#rp-manual .mi-ok{background:var(--oks);color:var(--ok)}"+
"#rp-manual .mi-no{background:var(--bads);color:var(--bad)}"+

"#rp-manual .rmback{display:inline-block;margin-bottom:10px;font-size:13px;color:var(--rink2);cursor:pointer;font-weight:700}"+
"#rp-manual .rmh2{font-size:16px;font-weight:800;margin:4px 0 10px}"+
"#rp-manual .rmlegend{background:#fff;border:2px solid var(--tan);border-radius:12px;padding:9px 12px;margin-bottom:12px;font-size:12px;color:var(--rink2);display:flex;flex-wrap:wrap;gap:8px;align-items:center}"+
"#rp-manual .rmlegend b{font-size:12px}"+

"#rp-manual .rmsym{background:#fff;border:2px solid var(--tan);border-radius:12px;margin-bottom:8px;overflow:hidden}"+
"#rp-manual .rmsym.risk{border-color:#EFB4AC}"+
"#rp-manual .rmhead{display:flex;align-items:center;gap:7px;padding:11px 12px;cursor:pointer}"+
"#rp-manual .rmtxt{flex:1;min-width:0}"+
"#rp-manual .rmtxt b{display:block;font-size:15px;line-height:1.45}"+
"#rp-manual .rmpart{font-size:11px;color:var(--rink3)}"+
"#rp-manual .rmtagrow{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}"+
"#rp-manual .rmv{font-size:11px;font-weight:800;padding:3px 9px;border-radius:99px;white-space:nowrap}"+
"#rp-manual .rmv.ok{background:var(--oks);color:var(--ok)}"+
"#rp-manual .rmv.mid{background:var(--mids);color:var(--mid)}"+
"#rp-manual .rmv.no{background:var(--bads);color:var(--bad)}"+
"#rp-manual .rmv.tec{background:var(--tecs);color:var(--tec)}"+
"#rp-manual .rmrk{font-size:11px;font-weight:800;padding:3px 9px;border-radius:99px;background:var(--dangers);color:var(--danger);white-space:nowrap}"+
"#rp-manual .rmph2{font-size:11px;font-weight:800;padding:3px 8px;border-radius:99px;background:var(--cream2);color:var(--tand)}"+
"#rp-manual .rmarw{display:inline-block;transition:transform .15s;color:var(--rink3);font-size:13px}"+
"#rp-manual .rmbody{display:none;padding:0 12px 14px;border-top:1px dashed var(--tan)}"+
"#rp-manual .rmsym.open .rmbody{display:block}"+
"#rp-manual .rmsym.open .rmarw{transform:rotate(90deg)}"+

"#rp-manual .rmalert{background:var(--dangers);border:2px solid #EFB4AC;border-radius:10px;padding:9px 11px;margin:12px 0 0;font-size:12.5px;font-weight:700;color:var(--danger)}"+
"#rp-manual .rmfigbox{background:#fff;border:2px solid var(--tan);border-radius:12px;padding:8px;margin:12px 0 0}"+
"#rp-manual .rmfigbox svg{width:100%;height:auto;display:block;border-radius:8px;cursor:zoom-in}"+
"#rp-manual .rmfigcap{font-size:11.5px;color:var(--rink3);margin-top:5px;text-align:center;font-weight:700}"+
"#rp-manual .rmbranch{background:#FFF6E0;border:2px solid var(--mid);border-radius:10px;padding:9px 11px;margin:12px 0;font-size:13.5px;font-weight:700}"+
"#rp-manual .rmbranch small{display:block;font-weight:400;color:var(--rink2);margin-top:2px}"+
"#rp-manual .rmh4{margin:16px 0 6px;font-size:12px;color:var(--rink3);letter-spacing:.05em;font-weight:800}"+

"#rp-manual .rmol{margin:0;padding-left:0;list-style:none;counter-reset:s}"+
"#rp-manual .rmol li{counter-increment:s;position:relative;padding:8px 0 8px 32px;border-bottom:1px dotted #EADFC9;font-size:14px;cursor:pointer;line-height:1.65}"+
"#rp-manual .rmol li:before{content:counter(s);position:absolute;left:0;top:9px;width:22px;height:22px;border-radius:50%;background:var(--cream2);color:var(--tand);font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center}"+
"#rp-manual .rmol li.key{background:#FFFDF5;font-weight:700}"+
"#rp-manual .rmol li.warn{background:var(--dangers);border-left:4px solid var(--danger);padding-left:36px;border-radius:0 8px 8px 0}"+
"#rp-manual .rmol li.warn:before{left:6px;background:var(--danger);color:#fff}"+
"#rp-manual .rmol li.done{opacity:.42;text-decoration:line-through}"+
"#rp-manual .rmol li.done:before{background:var(--grass);color:#fff;content:'\\2713'}"+

"#rp-manual .rmng{background:var(--bads);border-radius:10px;padding:9px 11px}"+
"#rp-manual .rmng div{font-size:13.5px;padding:3px 0}"+
"#rp-manual .rmtools{display:flex;flex-wrap:wrap;gap:6px}"+
"#rp-manual .rmtool{display:flex;align-items:center;gap:6px;background:var(--cream);border:1.5px solid var(--tan);border-radius:10px;padding:4px 9px;font-size:12.5px;cursor:pointer;color:var(--rink)}"+
"#rp-manual .rmtool img{width:28px;height:28px;object-fit:cover;border-radius:5px}"+
"#rp-manual .rmtool.nolink{opacity:.55}"+
"#rp-manual .rmmemo{background:var(--sky3);border-left:4px solid var(--sky1);padding:8px 11px;border-radius:0 8px 8px 0;font-size:13px;color:var(--rink2)}"+
"#rp-manual .rmph{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}"+
"#rp-manual .rmph img{max-width:130px;border-radius:8px;border:2px solid var(--tan);cursor:zoom-in}"+

"#rp-manual .rmknow{background:#fff;border:2px solid var(--tan);border-radius:12px;padding:12px;margin-bottom:8px}"+
"#rp-manual .rmknow b{display:block;font-size:14.5px;margin-bottom:4px}"+
"#rp-manual .rmknow p{margin:0;font-size:13.5px;color:var(--rink2)}"+
"#rp-manual .rmnote{background:var(--cream);border:2px solid var(--tan);border-radius:12px;padding:10px 12px;font-size:12.5px;color:var(--rink2);margin-bottom:12px}"+

"#rp-manual .rmmask{position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;padding:18px;z-index:9999}"+
"#rp-manual .rmmask.on{display:flex}"+
"#rp-manual .rmmodal{background:#fff;border-radius:16px;max-width:360px;width:100%;padding:16px;text-align:center;max-height:88vh;overflow:auto}"+
"#rp-manual .rmmodal img{max-width:100%;border-radius:10px;margin-bottom:10px}"+
"#rp-manual .rmmodal b{display:block;font-size:15px;margin-bottom:8px}"+
"#rp-manual .rmzoom{max-width:96vw;max-height:92vh;border-radius:10px}"+
"#rp-manual .rmbtn{display:inline-block;background:var(--grass);color:#fff;border:none;border-radius:99px;padding:9px 18px;font-weight:800;font-size:13.5px;text-decoration:none;font-family:inherit;cursor:pointer}"+
"#rp-manual .rmbtn.g{background:#fff;color:var(--rink2);border:2px solid var(--tan);margin-left:6px}"+
"#rp-manual .rmloading{text-align:center;padding:28px 10px;font-size:13px;font-weight:700;color:var(--rink3)}";

/* =============== ペインの器 =============== */
var SHELL=
'<div class="rmlead">この素材の、この症状は、こう直す。まず素材を選んでください。</div>'+
'<div class="rmtabs">'+
 '<div class="rmtab on" data-rmtab="find">症状をさがす</div>'+
 '<div class="rmtab" data-rmtab="know">共通の知識</div>'+
 '<div class="rmtab" data-rmtab="ask">確認中の項目</div>'+
'</div>'+
'<div id="rm-pane-find">'+
 '<input id="rm-q" placeholder="見たままの言葉で検索　例）白い　ベタベタ　割れ">'+
 '<div class="rmwordbar" id="rm-wordbar"></div>'+
 '<div id="rm-view"><div class="rmloading">読み込み中…</div></div>'+
'</div>'+
'<div id="rm-pane-know" style="display:none"><div id="rm-knowList"></div></div>'+
'<div id="rm-pane-ask" style="display:none"><div id="rm-askList"></div></div>'+
'<div class="rmmask" id="rm-mask"><div class="rmmodal" id="rm-modal"></div></div>';

/* =============== 図解 =============== */
var FIG={
"yasuri":"<svg viewBox='0 0 660 320' xmlns='http://www.w3.org/2000/svg'>"+
"<rect width='660' height='320' fill='#FFF8EC' rx='10'/>"+
"<text x='20' y='28' font-size='15' font-weight='800' fill='#4A3A2A'>紙やすりの当て方</text>"+
"<rect x='20' y='48' width='300' height='250' fill='#fff' stroke='#EFB4AC' stroke-width='2' rx='10'/>"+
"<text x='36' y='74' font-size='14' font-weight='800' fill='#C62828'>✕ 垂直に立てる</text>"+
"<rect x='40' y='190' width='260' height='60' fill='#E3C89B' rx='4'/>"+
"<line x1='40' y1='205' x2='300' y2='205' stroke='#7C6A56' stroke-width='2' stroke-dasharray='7 6'/>"+
"<text x='40' y='170' font-size='11' fill='#7C6A56'>― ― ＝ ステッチ</text>"+
"<g transform='translate(168,120)'><rect x='-9' y='0' width='18' height='72' fill='#A9977F' stroke='#7C6A56' stroke-width='2'/>"+
"<text x='16' y='30' font-size='11' fill='#7C6A56'>紙やすり</text></g>"+
"<path d='M150 192 L168 205 L186 192' fill='none' stroke='#C62828' stroke-width='4'/>"+
"<path d='M158 214 q10 8 20 0' fill='none' stroke='#C62828' stroke-width='3'/>"+
"<text x='60' y='286' font-size='13' font-weight='800' fill='#C62828'>一発で傷が入る</text>"+
"<rect x='340' y='48' width='300' height='250' fill='#fff' stroke='#7CC576' stroke-width='2' rx='10'/>"+
"<text x='356' y='74' font-size='14' font-weight='800' fill='#2E9E55'>◯ 寝かせて平行に動かす</text>"+
"<rect x='360' y='190' width='260' height='60' fill='#E3C89B' rx='4'/>"+
"<line x1='360' y1='205' x2='620' y2='205' stroke='#7C6A56' stroke-width='2' stroke-dasharray='7 6'/>"+
"<g transform='translate(430,168) rotate(-12)'><rect x='0' y='0' width='110' height='16' fill='#A9977F' stroke='#7C6A56' stroke-width='2'/>"+
"<path d='M0 0 L18 0 L0 16 Z' fill='#7C6A56'/></g>"+
"<text x='366' y='158' font-size='11' fill='#7C6A56'>折って尖らせた角</text>"+
"<line x1='400' y1='230' x2='600' y2='230' stroke='#2E9E55' stroke-width='4'/>"+
"<path d='M600 230 l-14 -7 v14 z' fill='#2E9E55'/>"+
"<path d='M400 230 l14 -7 v14 z' fill='#2E9E55'/>"+
"<text x='430' y='288' font-size='13' font-weight='800' fill='#2E9E55'>ステッチと平行にスライド</text>"+
"</svg>",

"circle":"<svg viewBox='0 0 660 300' xmlns='http://www.w3.org/2000/svg'>"+
"<rect width='660' height='300' fill='#FFF8EC' rx='10'/>"+
"<text x='20' y='28' font-size='15' font-weight='800' fill='#4A3A2A'>動かし方　往復ではなく円</text>"+
"<rect x='20' y='48' width='300' height='230' fill='#fff' stroke='#EFB4AC' stroke-width='2' rx='10'/>"+
"<text x='36' y='74' font-size='14' font-weight='800' fill='#C62828'>✕ 前後に往復</text>"+
"<rect x='50' y='120' width='240' height='90' fill='#E3C89B' rx='6'/>"+
"<line x1='70' y1='150' x2='270' y2='150' stroke='#C62828' stroke-width='4'/>"+
"<path d='M270 150 l-14 -7 v14 z' fill='#C62828'/><path d='M70 150 l14 -7 v14 z' fill='#C62828'/>"+
"<path d='M90 185 q20 -14 40 0 M150 185 q20 -14 40 0 M210 185 q20 -14 40 0' fill='none' stroke='#8A6A50' stroke-width='3'/>"+
"<text x='60' y='240' font-size='12.5' fill='#C62828' font-weight='800'>粉が横に逃げて、割れが埋まらない</text>"+
"<rect x='340' y='48' width='300' height='230' fill='#fff' stroke='#7CC576' stroke-width='2' rx='10'/>"+
"<text x='356' y='74' font-size='14' font-weight='800' fill='#2E9E55'>◯ 円を描いて回す</text>"+
"<rect x='370' y='120' width='240' height='90' fill='#E3C89B' rx='6'/>"+
"<path d='M470 165 m0 -28 a28 28 0 1 1 -1 0' fill='none' stroke='#2E9E55' stroke-width='4'/>"+
"<path d='M470 137 l-9 -12 l16 3 z' fill='#2E9E55'/>"+
"<circle cx='540' cy='150' r='2.5' fill='#8A6A50'/><circle cx='552' cy='162' r='2.5' fill='#8A6A50'/>"+
"<circle cx='530' cy='168' r='2.5' fill='#8A6A50'/><circle cx='546' cy='180' r='2.5' fill='#8A6A50'/>"+
"<path d='M520 186 q22 -12 44 0' fill='none' stroke='#8A6A50' stroke-width='3'/>"+
"<text x='356' y='240' font-size='12.5' fill='#2E9E55' font-weight='800'>細かい粉が割れの中に入って埋まる</text>"+
"</svg>",

"order":"<svg viewBox='0 0 680 260' xmlns='http://www.w3.org/2000/svg'>"+
"<rect width='680' height='260' fill='#FFF8EC' rx='10'/>"+
"<text x='20' y='30' font-size='15' font-weight='800' fill='#4A3A2A'>作業の順番　補色は最後から2番目</text>"+
"<text x='20' y='52' font-size='12' fill='#7C6A56'>順番を飛ばすと、塗っても凹凸やざらつきがそのまま出ます</text>"+
"<g font-size='12.5' font-weight='800'>"+
"<rect x='16' y='80' width='118' height='84' rx='12' fill='#fff' stroke='#E3C89B' stroke-width='2'/>"+
"<text x='75' y='108' text-anchor='middle' fill='#C9A86A' font-size='18'>①</text>"+
"<text x='75' y='132' text-anchor='middle' fill='#4A3A2A'>形を戻す</text>"+
"<text x='75' y='150' text-anchor='middle' fill='#7C6A56' font-size='10.5'>詰め物で張る</text>"+
"<rect x='150' y='80' width='118' height='84' rx='12' fill='#fff' stroke='#E3C89B' stroke-width='2'/>"+
"<text x='209' y='108' text-anchor='middle' fill='#C9A86A' font-size='18'>②</text>"+
"<text x='209' y='132' text-anchor='middle' fill='#4A3A2A'>下地を整える</text>"+
"<text x='209' y='150' text-anchor='middle' fill='#7C6A56' font-size='10.5'>ささくれを寝かす</text>"+
"<rect x='284' y='80' width='118' height='84' rx='12' fill='#fff' stroke='#E3C89B' stroke-width='2'/>"+
"<text x='343' y='108' text-anchor='middle' fill='#C9A86A' font-size='18'>③</text>"+
"<text x='343' y='132' text-anchor='middle' fill='#4A3A2A'>凹凸を埋める</text>"+
"<text x='343' y='150' text-anchor='middle' fill='#7C6A56' font-size='10.5'>充填して平らに</text>"+
"<rect x='418' y='80' width='118' height='84' rx='12' fill='#E4F6E9' stroke='#7CC576' stroke-width='2.5'/>"+
"<text x='477' y='108' text-anchor='middle' fill='#2E9E55' font-size='18'>④</text>"+
"<text x='477' y='132' text-anchor='middle' fill='#2E9E55'>補色</text>"+
"<text x='477' y='150' text-anchor='middle' fill='#54A05B' font-size='10.5'>置いて手で伸ばす</text>"+
"<rect x='552' y='80' width='112' height='84' rx='12' fill='#fff' stroke='#E3C89B' stroke-width='2'/>"+
"<text x='608' y='108' text-anchor='middle' fill='#C9A86A' font-size='18'>⑤</text>"+
"<text x='608' y='132' text-anchor='middle' fill='#4A3A2A'>艶出し→金具</text>"+
"<text x='608' y='150' text-anchor='middle' fill='#7C6A56' font-size='10.5'>金具は一番最後</text>"+
"</g>"+
"<g stroke='#C9A86A' stroke-width='3' fill='none'>"+
"<path d='M136 122 h12'/><path d='M270 122 h12'/><path d='M404 122 h12'/><path d='M538 122 h12'/></g>"+
"<g fill='#C9A86A'><path d='M148 122 l-8 -5 v10 z'/><path d='M282 122 l-8 -5 v10 z'/><path d='M416 122 l-8 -5 v10 z'/><path d='M550 122 l-8 -5 v10 z'/></g>"+
"<rect x='16' y='186' width='648' height='56' rx='10' fill='#FCE8E5' stroke='#EFB4AC' stroke-width='2'/>"+
"<text x='32' y='210' font-size='12.5' font-weight='800' fill='#C62828'>①②③を飛ばして④に入るのが、一番多い失敗です。</text>"+
"<text x='32' y='230' font-size='12' fill='#C62828'>凹凸やざらつきは、上から塗っても消えません。</text>"+
"</svg>",

"koba":"<svg viewBox='0 0 660 300' xmlns='http://www.w3.org/2000/svg'>"+
"<rect width='660' height='300' fill='#FFF8EC' rx='10'/>"+
"<text x='20' y='28' font-size='15' font-weight='800' fill='#4A3A2A'>コバの断面　どこが割れて、どこに熱を当てるか</text>"+
"<rect x='60' y='70' width='420' height='36' fill='#C9A86A'/>"+
"<rect x='60' y='106' width='420' height='36' fill='#B39466'/>"+
"<text x='500' y='94' font-size='12' fill='#7C6A56'>革（表）</text>"+
"<text x='500' y='130' font-size='12' fill='#7C6A56'>革（裏）</text>"+
"<path d='M60 70 q-26 36 0 72' fill='#8A6A50'/>"+
"<text x='16' y='170' font-size='12' font-weight='800' fill='#8A6A50'>コバ＝</text>"+
"<text x='16' y='188' font-size='12' font-weight='800' fill='#8A6A50'>断面の塗料</text>"+
"<path d='M44 88 l10 6 l-10 6' fill='none' stroke='#C62828' stroke-width='3'/>"+
"<path d='M42 112 l10 6 l-10 6' fill='none' stroke='#C62828' stroke-width='3'/>"+
"<text x='96' y='60' font-size='12.5' font-weight='800' fill='#C62828'>← ここが割れる</text>"+
"<g transform='translate(120,180)'>"+
"<rect x='0' y='0' width='120' height='12' rx='4' fill='#D2493A'/>"+
"<rect x='120' y='2' width='40' height='8' rx='3' fill='#7C6A56'/>"+
"<path d='M160 6 l16 0' stroke='#7C6A56' stroke-width='3'/>"+
"<text x='0' y='34' font-size='12' fill='#7C6A56'>ハンダゴテ（または200℃のヘアアイロン）</text></g>"+
"<path d='M110 176 L70 120' stroke='#D9901F' stroke-width='3' stroke-dasharray='6 5'/>"+
"<path d='M70 120 l4 14 l10 -8 z' fill='#D9901F'/>"+
"<rect x='300' y='170' width='344' height='104' rx='10' fill='#fff' stroke='#E3C89B' stroke-width='2'/>"+
"<text x='318' y='196' font-size='13' font-weight='800' fill='#4A3A2A'>手順</text>"+
"<text x='318' y='218' font-size='12' fill='#7C6A56'>① 割れ目に軽く当てて、溶かして平らにする</text>"+
"<text x='318' y='238' font-size='12' fill='#7C6A56'>② 完全に冷ましてから、コバの色を塗る</text>"+
"<text x='318' y='258' font-size='12' fill='#C62828' font-weight='800'>1か所に当て続けない。溶けすぎます</text>"+
"</svg>",

"piping":"<svg viewBox='0 0 660 320' xmlns='http://www.w3.org/2000/svg'>"+
"<rect width='660' height='320' fill='#FFF8EC' rx='10'/>"+
"<text x='20' y='28' font-size='15' font-weight='800' fill='#4A3A2A'>パイピングの構造　中に芯が入っている</text>"+
"<rect x='20' y='50' width='300' height='240' rx='10' fill='#fff' stroke='#7CC576' stroke-width='2'/>"+
"<text x='36' y='76' font-size='14' font-weight='800' fill='#2E9E55'>◯ 正常な状態</text>"+
"<path d='M60 190 q110 -70 220 0' fill='none' stroke='#C9A86A' stroke-width='26' stroke-linecap='round'/>"+
"<path d='M60 190 q110 -70 220 0' fill='none' stroke='#A9977F' stroke-width='10' stroke-linecap='round'/>"+
"<text x='150' y='236' font-size='12' fill='#7C6A56'>革が芯を包んでいる</text>"+
"<line x1='170' y1='150' x2='170' y2='120' stroke='#7C6A56' stroke-width='2'/>"+
"<text x='120' y='114' font-size='12' font-weight='800' fill='#7C6A56'>芯（ワイヤー）</text>"+
"<rect x='340' y='50' width='300' height='240' rx='10' fill='#fff' stroke='#EFB4AC' stroke-width='2'/>"+
"<text x='356' y='76' font-size='14' font-weight='800' fill='#C62828'>✕ 潰れている・芯がない</text>"+
"<path d='M380 190 q60 -60 100 -30' fill='none' stroke='#C9A86A' stroke-width='26' stroke-linecap='round'/>"+
"<path d='M520 172 q40 -14 80 18' fill='none' stroke='#C9A86A' stroke-width='26' stroke-linecap='round'/>"+
"<path d='M380 190 q60 -60 100 -30' fill='none' stroke='#A9977F' stroke-width='10' stroke-linecap='round'/>"+
"<circle cx='500' cy='166' r='16' fill='none' stroke='#C62828' stroke-width='3'/>"+
"<text x='430' y='236' font-size='12.5' font-weight='800' fill='#C62828'>ここが欠けている</text>"+
"<text x='356' y='268' font-size='11.5' fill='#7C6A56'>芯がある→埋めるだけ</text>"+
"<text x='356' y='286' font-size='11.5' fill='#7C6A56'>芯がない→先に芯を足す</text>"+
"</svg>"
};

var FIGMAP={
 "t16":"yasuri","n34":"yasuri","n35":"yasuri","n6":"yasuri",
 "t10":"circle","n41":"circle","n25":"circle","n19":"circle",
 "t31":"order",
 "n1":"koba","n12":"koba",
 "n30":"piping","n44":"piping"
};

/* =============== 危険度の自動判定 =============== */
var RISKY=/削(る|り|っ|れ)|ヤスリ|紙やすり|電動|ルーター|熱湯|ハンダ|アイロン|温風|エタノール|漂白|染料|アセトン|爪の先|剥がす|剥がし|溶かす/;
var NEG=/(ない|ません|不要|せん)$/;
function riskySteps(c){
 var out={};
 (c.s||[]).forEach(function(t,i){
   var body=t.replace(/^★/,"").replace(/[。．]$/,"");
   if(RISKY.test(t) && !NEG.test(body)) out[i]=1;
 });
 return out;
}

/* =============== 見たままの言葉 =============== */
var WORDS=["黒ずみ","白い","色あせ","ベタベタ","割れ","剥がれ","穴","毛羽立ち","くすみ","シミ","型崩れ","におい"];
var WMAP={"白い":"白 色あせ 白化 白ボケ","黒ずみ":"黒ずみ 汚れ","ベタベタ":"ベタつき 加水分解 貼り付き",
 "割れ":"ひび割れ 亀裂 割れ","剥がれ":"剥がれ 剥げ 色落ち","穴":"穴 破れ 欠け 欠損",
 "毛羽立ち":"毛羽立ち ほつれ ささくれ 毛","くすみ":"くすみ サビ 曇り","シミ":"シミ 汚れ 跡",
 "型崩れ":"型崩れ 凹み 波打ち よれ","におい":"におい カビ 臭","色あせ":"色あせ 退色 色ムラ"};

/* =============== 状態 =============== */
var MEM={};
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){MEM[k]=v}}
function load(k,d){try{var s=localStorage.getItem(k);return s?JSON.parse(s):(MEM[k]!==undefined?MEM[k]:d)}catch(e){return MEM[k]!==undefined?MEM[k]:d}}
var DONE=load('rd_done',{});
var AUTO={};
var cur="",kw="",word="";
var PANE=null;

function loadAuto(){
 return fetch("https://data.jsdelivr.com/v1/packages/gh/"+GH.user+"/"+GH.repo+"@"+GH.branch)
 .then(function(r){return r.json()}).then(function(j){
  (function walk(ns){(ns||[]).forEach(function(n){
    if(n.type==="directory")return walk(n.files);
    var m=n.name.match(/^([nst]\d+[a-z]?)-(b|\d+)(?:-\d+)?\.(jpg|jpeg|png|webp)$/i);
    if(!m)return;
    var k=m[1]+"#"+(m[2]==="b"?"b":String(Number(m[2])-1));
    (AUTO[k]=AUTO[k]||[]).push(PIC_BASE+n.name);
  })})(j.files);
 }).catch(function(){});
}

/* =============== 描画 =============== */
var VC={"直る":"ok","軽減のみ":"mid","不可":"no","技法":"tec"};
var VICON={"直る":"◎ 直る","軽減のみ":"△ 軽くなる","不可":"× 直せない","技法":"／ やり方"};
function esc(s){return (s+"").replace(/&/g,"&amp;").replace(/</g,"&lt;")}
function pics(c,i){
 var k=c.id+"#"+i,l=(AUTO[k]||[]).slice();
 if(c.pic&&c.pic[i])c.pic[i].forEach(function(f){l.push(PIC_BASE+f)});
 return l;
}
function ph(c,i){
 var l=pics(c,i);
 if(!l.length)return "";
 return '<div class="rmph">'+l.map(function(u){return '<img src="'+esc(u)+'" data-zoom="'+esc(u)+'">'}).join('')+'</div>';
}
function nPhotos(c){
 var n=0; ["b","0","1","2","3","4","5","6","7","8","9"].forEach(function(k){n+=pics(c,k).length});
 return n;
}
function symHTML(c){
 var rs=riskySteps(c), risky=Object.keys(rs).length>0, np=nPhotos(c);
 var h='<div class="rmsym'+(risky?' risk':'')+'" data-id="'+c.id+'"><div class="rmhead">'+
  '<div class="rmtxt"><b>'+esc(c.sym)+'</b><span class="rmpart">'+esc(c.p)+'</span>'+
  '<div class="rmtagrow"><span class="rmv '+VC[c.v]+'">'+VICON[c.v]+'</span>'+
  (risky?'<span class="rmrk">⚠ 戻せない工程あり</span>':'')+
  (np?'<span class="rmph2">📷 '+np+'</span>':'')+
  '</div></div><span class="rmarw">▶</span></div><div class="rmbody">';
 if(risky)h+='<div class="rmalert">⚠ 削る・熱を当てる・薬剤を使う工程が含まれます。失敗すると元に戻せません。赤い行は特に慎重に。</div>';
 if(c.b)h+='<div class="rmbranch">▶ '+esc(c.b)+'<small>'+esc(c.bs||"")+'</small>'+ph(c,"b")+'</div>';
 if(FIGMAP[c.id]&&FIG[FIGMAP[c.id]])h+='<div class="rmfigbox" data-fig="'+FIGMAP[c.id]+'">'+FIG[FIGMAP[c.id]]+'<div class="rmfigcap">タップで拡大</div></div>';
 h+='<div class="rmh4">手順（タップで消し込み）</div><ol class="rmol">'+c.s.map(function(s,i){
   var cls=[]; if(s.indexOf("★")===0)cls.push("key"); if(rs[i])cls.push("warn");
   if(DONE[c.id+"#"+i])cls.push("done");
   return '<li class="'+cls.join(" ")+'" data-step="'+c.id+'#'+i+'">'+esc(s)+ph(c,i)+'</li>'}).join('')+'</ol>';
 if(c.ng&&c.ng.length)h+='<div class="rmh4">避けること</div><div class="rmng">'+c.ng.map(function(n){return '<div>✕ '+esc(n)+'</div>'}).join('')+'</div>';
 if(c.t&&c.t.length)h+='<div class="rmh4">使用する道具</div><div class="rmtools">'+c.t.map(function(n){
   var d=T[n]||{},pic=d.i?'<img src="'+d.i+'">':'';
   return '<span class="rmtool'+((d.u||d.i)?'':' nolink')+'" data-t="'+esc(n)+'">'+pic+esc(n)+'</span>'}).join('')+'</div>';
 if(c.me)h+='<div class="rmh4">補足</div><div class="rmmemo">'+esc(c.me)+'</div>';
 return h+'</div></div>';
}
var LEGEND='<div class="rmlegend"><b>見方：</b>'+
 '<span class="rmv ok">◎ 直る</span><span class="rmv mid">△ 軽くなる</span>'+
 '<span class="rmv no">× 直せない</span><span class="rmv tec">／ やり方</span>'+
 '<span class="rmrk">⚠ 戻せない工程あり</span>'+
 '<span style="font-size:11.5px">★の行＝外すと失敗します</span></div>';

function matchWord(c){
 if(!word)return true;
 var key=(WMAP[word]||word).split(" ");
 var hay=(c.sym+c.p+(c.syn||"")+c.s.join("")).toLowerCase();
 return key.some(function(k){return hay.indexOf(k.toLowerCase())>=0});
}
function render(){
 var v=PANE.querySelector('#rm-view');
 PANE.querySelector('#rm-wordbar').innerHTML=WORDS.map(function(w){
  return '<span class="rmword'+(word===w?' on':'')+'" data-w="'+w+'">'+w+'</span>'}).join('');
 if(kw||word){
  var f=D.filter(function(c){
    if(!matchWord(c))return false;
    if(!kw)return true;
    return (c.id+c.m+c.p+c.sym+(c.syn||"")+c.s.join("")).toLowerCase().indexOf(kw.toLowerCase())>=0});
  v.innerHTML=LEGEND+'<div class="rmh2">'+f.length+'件</div>'+
   (f.map(symHTML).join('')||'<div class="rmnote">該当する症状が見つかりませんでした。別の言い方でお試しください。</div>');
  return;
 }
 if(!cur){
  v.innerHTML='<div class="rmnote">素材を選ぶと、その素材で起きる症状が一覧で表示されます。⚠ の付いたものは、失敗すると元に戻せない工程を含みます。</div>'+
   '<div class="rmmats">'+MATS.map(function(m){
   var l=D.filter(function(c){return c.m===m.k});
   var ok=l.filter(function(c){return c.v==="直る"}).length;
   var no=l.filter(function(c){return c.v==="不可"}).length;
   return '<div class="rmmat" data-m="'+esc(m.k)+'"><div class="rmic">'+m.ic+'</div><b>'+esc(m.k)+'</b>'+
    '<span class="rmcnt">'+l.length+'件</span><div class="rmmini">'+
    (ok?'<i class="mi-ok">直る'+ok+'</i>':'')+(no?'<i class="mi-no">不可'+no+'</i>':'')+'</div></div>'
  }).join('')+'</div>';
  return;
 }
 var l=D.filter(function(c){return c.m===cur});
 v.innerHTML='<div class="rmback" id="rm-bk">← 素材を選び直す</div><div class="rmh2">'+esc(cur)+'　'+l.length+'件</div>'+LEGEND+
  (l.map(symHTML).join('')||'<div class="rmnote">この素材の症例は準備中です。</div>');
}

/* =============== クリック（ペイン内に限定） =============== */
function bindPane(){
 PANE.addEventListener('click',function(e){
  var t=e.target,c;
  if(t.id==='rm-cl'||t.id==='rm-mask'){PANE.querySelector('#rm-mask').classList.remove('on');return}
  if((c=t.closest('.rmfigbox'))){
   PANE.querySelector('#rm-modal').innerHTML='<div style="max-height:80vh;overflow:auto">'+FIG[c.dataset.fig]+'</div><button class="rmbtn g" id="rm-cl">閉じる</button>';
   PANE.querySelector('#rm-mask').classList.add('on');return}
  if(t.dataset&&t.dataset.zoom){
   PANE.querySelector('#rm-modal').innerHTML='<img class="rmzoom" src="'+esc(t.dataset.zoom)+'"><br><button class="rmbtn g" id="rm-cl">閉じる</button>';
   PANE.querySelector('#rm-mask').classList.add('on');return}
  if(t.id==='rm-bk'){cur="";render();window.scrollTo(0,0);return}
  if(t.dataset&&t.dataset.w!==undefined){word=(word===t.dataset.w?"":t.dataset.w);render();return}
  if((c=t.closest('.rmmat'))){cur=c.dataset.m;render();window.scrollTo(0,0);return}
  if((c=t.closest('li[data-step]'))){
   var k=c.dataset.step;
   if(DONE[k])delete DONE[k];else DONE[k]=1;
   save('rd_done',DONE);c.classList.toggle('done');return}
  if((c=t.closest('.rmtool'))){
   var n=c.dataset.t,d=T[n]||{};
   PANE.querySelector('#rm-modal').innerHTML=(d.i?'<img src="'+d.i+'">':'')+'<b>'+esc(n)+'</b>'+
    (d.m?'<div class="rmmemo" style="text-align:left;margin-bottom:10px">'+esc(d.m)+'</div>':'')+
    (d.u?'<a class="rmbtn" href="'+d.u+'" target="_blank" rel="noopener">商品ページ</a>':'<span class="rmmemo">商品リンクは準備中です。</span>')+
    '<button class="rmbtn g" id="rm-cl">閉じる</button>';
   PANE.querySelector('#rm-mask').classList.add('on');return}
  if(t.closest('.rmhead')){t.closest('.rmsym').classList.toggle('open');return}
  if(t.dataset&&t.dataset.rmtab){
   PANE.querySelectorAll('.rmtab').forEach(function(x){x.classList.remove('on')});t.classList.add('on');
   ['find','know','ask'].forEach(function(k){
     PANE.querySelector('#rm-pane-'+k).style.display=(k===t.dataset.rmtab?'':'none')})}
 });
 PANE.querySelector('#rm-q').addEventListener('input',function(e){kw=e.target.value;render()});
}

/* =============== 起動 =============== */
function init(){
 if(typeof D==='undefined'){
  PANE.querySelector('#rm-view').innerHTML='<div class="rmnote">データを読み込めませんでした。通信環境を確認して、画面を再読み込みしてください。</div>';
  return;
 }
 PANE.querySelector('#rm-knowList').innerHTML=KNOW.map(function(k){
  return '<div class="rmknow"><b>'+esc(k.t)+'</b><p>'+esc(k.d)+'</p></div>'}).join('');
 PANE.querySelector('#rm-askList').innerHTML='<div class="rmnote">手順や取り扱い先を確認中の項目です。判明し次第、追加します。</div>'+
  ASK.map(function(a){return '<div class="rmknow"><p>'+esc(a)+'</p></div>'}).join('');
 bindPane();
 render();
 loadAuto().then(render);
}

function mount(tries){
 tries=tries||0;
 var row=document.querySelector('#fbapp #scr-repair .subtabs');
 var host=document.getElementById('rp-tool');
 if(!row||!host||!host.parentNode){
  if(tries<60)setTimeout(function(){mount(tries+1)},150);
  return;
 }
 if(document.getElementById('rp-manual'))return;

 /* タブを追加 */
 var tab=document.createElement('button');
 tab.className='subtab rp-tab';
 tab.setAttribute('data-pane','manual');
 tab.textContent='📗 マニュアル';
 row.appendChild(tab);

 /* ペインを追加 */
 PANE=document.createElement('div');
 PANE.className='rp-pane';
 PANE.id='rp-manual';
 PANE.innerHTML=SHELL;
 host.parentNode.appendChild(PANE);

 /* CSS */
 var st=document.createElement('style');
 st.id='rm-style';
 st.textContent=CSS;
 document.head.appendChild(st);

 /* 自分のタブの押下（他タブ側は A_finbook-home.js が閉じてくれる） */
 tab.addEventListener('click',function(){
  document.querySelectorAll('#fbapp .rp-tab').forEach(function(x){x.classList.remove('on')});
  tab.classList.add('on');
  document.querySelectorAll('#fbapp .rp-pane').forEach(function(p){p.classList.remove('on')});
  PANE.classList.add('on');
  window.scrollTo({top:0});
 });

 /* データ読み込み */
 if(typeof D!=='undefined'){init();return}
 var sc=document.createElement('script');
 sc.src=DATA_URL;
 sc.onload=init;
 sc.onerror=function(){
  PANE.querySelector('#rm-view').innerHTML='<div class="rmnote">データを読み込めませんでした。通信環境を確認して、画面を再読み込みしてください。</div>';
 };
 document.head.appendChild(sc);
}

if(document.readyState==='loading'){
 document.addEventListener('DOMContentLoaded',function(){mount(0)});
}else{
 mount(0);
}
})();
