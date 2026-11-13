/* おかねの図書館 会員ホーム：かせぎかたマップ v2（診断ポップアップ＋ルート表示＋説明シート）
   置き場所：1個目のEmbedの <div id="kmap"></div> に描画する
   金額・時間・元手の数字は下の P の中だけ直せば全部に反映される */
(function(){
var root=document.getElementById('kmap');if(!root)return;
var app=document.getElementById('fbapp')||document.body;
var IMG='https://cdn.prod.website-files.com/69bcd664c814f802dfc1f9bc/';
var PLAN=888;
var MV_ID='1230120845'; /* 紹介ムービー（Vimeo）。差し替えるときはここ */

/* ▼ 数字・文言はここだけ直す */
var P={
 intro:{step:0,name:'紹介ムービー',face:'',emo:'🎬',bg:'#FFF3C7',catch:'おかねの図書館ってなに？',money:'約2分',sub:'全体の流れがわかる',time:'2分',cost:'0円',why:'まず全体の流れを知る（2分）'},
 poi:{step:1,name:'ポイ活',pw:'かんたん・元手0円',est:1,face:IMG+'6a70265dca6398021cf1f4f2_11.png',bg:'#FFF0C4',catch:'申し込むだけで、お金を受け取る',money:'毎月 1.5〜2万円',sub:'＋単発の案件で 約40万円',time:'スマホで1日30分〜',cost:'元手 0円',go:'poi',
  what:['モッピーに無料登録する（3分）','リストの上から「申し込む → スタンプを押す」をくり返す','毎月入る枠（モニター・FX口座）で、月1.5〜2万円をつくる'],
  first:'モッピーに無料登録する（3分）',why:'元手0円。最初の1件で月額888円を回収できる'},
 kotei:{step:2,name:'固定費削減',pw:'手続き1回だけ',est:1,face:IMG+'6a70262adc811fd00ef5f195_10003.png',bg:'#D9F1FB',catch:'スマホ代・ネット代を下げる',money:'毎月 3,000〜2万円 浮く',sub:'一度やれば、毎月ずっと効く',time:'問い合わせ 5分',cost:'元手 0円',go:'kotei',
  what:['下げたい支払いを選ぶ（スマホ・ネット・水・ガス）','LINEで問い合わせる','案内どおりに乗り換える'],
  first:'スマホ代の項目を開く',why:'一度の手続きで、毎月の支払いが下がる'},
 buppan:{step:3,name:'物販',pw:'スマホだけでかんたん',est:1,plan:[['¥888プラン','月 5,000〜1万円'],['¥2,999プラン','月 1〜10万円']],face:IMG+'6a1da965de04d84a9377b7db_03_%E9%9D%92%E3%82%BF%E3%83%8C%E3%82%AD.jpg',bg:'#D9EAFB',catch:'仕入れて売る、副収入の柱',money:'月 5,000〜10万円をめざす',sub:'全商品はコンプリート¥2,999〜',time:'週3〜5時間',cost:'元手 1万円〜',url:'https://finbook888moneyplan.webflow.io/soushuhen',
  what:['総集編の動画（全15分）で流れを知る','スマホケースなどの小物から出品する','売れた商品をくり返し仕入れる'],
  first:'総集編の動画を見る（15分）',why:'ポイ活で得たお金を元手に、毎月の柱をつくる'},
 repair:{step:4,name:'リペア',pw:'小さい資金から大きく稼ぐ',est:1,face:IMG+'6a70262a9b897dc237d18d55_15.png',bg:'#FFE0D9',catch:'ブランド品を安く仕入れて、直して、売る',money:'月 数万〜数十万円をめざす',sub:'コンプリート¥2,999〜',time:'週5時間〜',cost:'元手 少額からOK',go:'repair',
  what:['マスターブックで相場を見る','GOマークの品番だけ仕入れる','直して売る'],
  first:'マスターブックで相場を見る',why:'小さい資金から、月数万〜数十万円をめざす'},
 trade:{step:5,name:'トレード・投資',pw:'個別指導',face:IMG+'6a70266ad1ab382fc10978ef_4.png',bg:'#D5F0E1',catch:'館長が1対1で教えます',money:'パーフェクト¥5,999 限定',sub:'※元本割れなどリスクのある分野です',time:'日程は個別に決める',cost:'月額¥5,999のプラン',url:'https://finbook888moneyplan.webflow.io/upgradeplan',btn:'プランを見る ▶',
  what:['パーフェクトプラン（¥5,999）に入る','公式LINEで個別指導の日程を決める','1対1で、相場の見方から教わる'],
  first:'パーフェクトプランの中身を見る',why:'独学せず、個別に教わりながら進める'}
};
P.mile={step:0,name:'マイルランキング',face:'',emo:'✈️',bg:'#E4EFFA',catch:'毎月のランキングで、受け取りをふやす',why:'しくみの動画（約2分半）を見て、ランキングに参加する',first:'マイルのしくみ動画を見る（約2分半）',nav:'mile'};
var ORDER=['poi','kotei','buppan','repair','trade'];
var Q=[
 {q:'いま、いちばん近い気持ちは？',k:'need',o:[['genkin','💴','まず、すぐに現金がほしい'],['maitsuki','📅','毎月の副収入をつくりたい'],['shiharai','💸','毎月の支払いを減らしたい'],['skill','🛠','本格的に稼げる力をつけたい'],['mile','✈️','マイルランキングについて知りたい']]},
 {q:'ポイ活をやったことはある？',k:'poi',note:'ポイ活＝口座開設やカード発行などを申し込むだけで、お金やポイントがもらえるもの',o:[['none','🔰','やったことがない'],['little','🙂','少しだけある'],['moppy','✅','モッピーにもう登録している']]},
 {q:'ネット銀行・証券口座・クレジットカードは、どのくらい持っている？',k:'acct',note:'持っていない人ほど、使える単発の案件が多くなります',o:[['few','🌱','ほとんど持っていない'],['some','📂','いくつか持っている'],['many','🗂','かなり持っている']]},
 {q:'スマホ代は、毎月いくらくらい？',k:'phone',o:[['low','📱','3,000円未満'],['mid','📱','3,000〜8,000円'],['high','📱','8,000円以上'],['unk','❓','わからない']]},
 {q:'1週間で使える時間は？',k:'time',o:[['low','⏱','スキマ時間だけ'],['mid','⏰','1日30分くらい'],['high','🔥','週5時間以上']]},
 {q:'最初に使えるお金は？',k:'cash',o:[['zero','0️⃣','0円でやりたい'],['mid','💰','1万円くらい'],['high','💎','3万円以上']]}
];
var TYPE={mile:'マイルで貯めるタイプ',shiharai:'支払い見直しタイプ',genkin:'まず現金タイプ',maitsuki:'毎月の柱タイプ',skill:'本格派タイプ'};
var TINFO={
 genkin:{e:'💴',d:'まずはポイ活の単発案件で、<b>手元のお金</b>をつくるのが近道です。'},
 maitsuki:{e:'📅',d:'ポイ活の<b>毎月入る枠</b>で土台をつくって、物販で積み上げていきます。'},
 shiharai:{e:'💸',d:'ポイ活で受け取りながら、<b>毎月の支払い</b>も下げていきます。'},
 mile:{e:'✈️',d:'ポイ活で受け取りながら<b>マイル</b>を貯めて、毎月のランキング上位をめざします。'},
 skill:{e:'🛠',d:'ポイ活で元手をつくって、<b>物販・リペア</b>で大きく稼ぎにいきます。'}
};
var STAT_URL='https://finbook-shindan.toasovie-unei888.workers.dev'; /* 診断の集計Worker */
var MEM=null;function loadMem(){try{if(window.$memberstackDom)window.$memberstackDom.getCurrentMember().then(function(m){MEM=m&&m.data}).catch(function(){})}catch(e){}}
function firstOf(id,a){if(id==='poi'&&a){if(a.poi==='moppy'&&a.acct==='many')return'毎月入る枠（モニター・FX口座）から始める';if(a.poi==='moppy')return'実行リストの「今日〜数日で入る」から始める';if(a.acct==='many')return'モッピーに登録して、毎月入る枠から始める'}return P[id].first||P[id].why}

/* ▼ 保存 */
var K='km_v1';
var S=(function(){try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return{}}})();S.t=S.t||{};
function sv(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
function poiStarted(){try{return Object.keys(JSON.parse(localStorage.getItem('jk_done')||'{}')).length>0}catch(e){return false}}
function isDone(id){if(id==='intro')return!!S.intro;if(id==='poi'&&poiStarted())return true;return!!S.t[id]}
function nextOf(){if(!S.route)return null;for(var i=0;i<S.route.length;i++)if(!isDone(S.route[i]))return S.route[i];return null}

/* ▼ CSS */
var css='#fbapp .km{position:relative;border-radius:20px;border:2.5px solid #fff;box-shadow:0 5px 0 rgba(90,110,50,.22);background:linear-gradient(180deg,#B9E6F7 0,#D8F3E0 70px,var(--grass,#8ACB72) 71px,var(--grassd,#66B052) 100%);padding:14px 12px 14px;margin-bottom:16px}'
+'#fbapp .km-tt{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}'
+'#fbapp .km-tt b{background:#fff;border-radius:999px;padding:5px 14px;font-size:13px;font-weight:800;box-shadow:0 2px 0 rgba(90,110,50,.2)}'
+'#fbapp .km-tt span{font-size:11px;font-weight:800;color:#3E6B8C;background:rgba(255,255,255,.75);border-radius:999px;padding:4px 10px}'
+'#fbapp .km-q{display:flex;align-items:center;gap:10px;width:100%;border:2.5px solid #fff;border-radius:18px;padding:12px;margin-bottom:12px;background:linear-gradient(135deg,#FFE07A,var(--gold));box-shadow:0 4px 0 var(--goldd);font-family:inherit;color:#5A3B00;text-align:left;cursor:pointer;animation:kmq 1.6s ease-in-out infinite}'
+'@keyframes kmq{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}'
+'#fbapp .km-q .e{font-size:28px;flex-shrink:0}#fbapp .km-q .t{flex:1;min-width:0;line-height:1.35}#fbapp .km-q .t b{display:block;font-size:15px;font-weight:800}#fbapp .km-q .t small{display:block;font-size:11px;font-weight:700;opacity:.85}'
+'#fbapp .km-q .g{flex-shrink:0;background:#fff;color:var(--corald);font-size:12px;font-weight:800;border-radius:999px;padding:6px 11px}'
+'#fbapp .km-rt{background:var(--card);border-radius:18px;padding:12px;margin-bottom:12px;box-shadow:0 3px 0 rgba(70,90,40,.25)}'
+'#fbapp .km-rt .h{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:800;color:var(--ink2)}'
+'#fbapp .km-rt .h button{border:0;background:none;font-family:inherit;font-size:11px;font-weight:800;color:var(--ink2);text-decoration:underline;cursor:pointer}'
+'#fbapp .km-chips{display:flex;align-items:center;gap:4px;margin:8px 0 10px;overflow-x:auto;scrollbar-width:none}#fbapp .km-chips::-webkit-scrollbar{display:none}'
+'#fbapp .km-chip{flex-shrink:0;font-size:11.5px;font-weight:800;border-radius:999px;padding:4px 10px;background:#F0E8D2;color:var(--ink2)}'
+'#fbapp .km-chip.ok{background:#DFF2D8;color:var(--leafd)}#fbapp .km-chip.nx{background:linear-gradient(135deg,#FFE07A,var(--gold));color:#5A3B00;box-shadow:0 2px 0 var(--goldd)}'
+'#fbapp .km-ar{flex-shrink:0;color:var(--ink2);font-size:11px;font-weight:800}'
+'#fbapp .km-nx{display:block;width:100%;border:0;border-radius:999px;padding:13px;font-family:inherit;font-size:15px;font-weight:800;color:#fff;background:linear-gradient(135deg,#FF9E74,var(--coral));box-shadow:0 4px 0 var(--corald);cursor:pointer}'
+'#fbapp .km-nx small{display:block;font-size:11px;font-weight:700;opacity:.92}'
+'#fbapp .km-ng{margin-top:9px;font-size:12px;font-weight:800;color:var(--corald);background:#FFF1EA;border-radius:12px;padding:7px 10px;line-height:1.5}'
+'#fbapp .km-fin{text-align:center;font-size:13px;font-weight:800;color:var(--leafd);padding:4px 0}'
+'#fbapp .km-ls{position:relative;display:grid;gap:10px}'
+'#fbapp .km-c{position:relative;display:flex;align-items:center;gap:11px;width:100%;border:2.5px solid transparent;background:var(--card);border-radius:18px;padding:12px 11px;box-shadow:0 3px 0 rgba(70,90,40,.25);font-family:inherit;color:var(--ink);text-align:left;cursor:pointer}'
+'#fbapp .km-c .km-stp{position:absolute;top:-8px;left:12px;font-size:10px;font-weight:800;color:#fff;background:#B79A6B;border-radius:6px;padding:1px 7px}'
+'#fbapp .km-c .fc{width:50px;height:50px;border-radius:14px;flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:24px}'
+'#fbapp .km-c .fc img{width:100%;height:100%;object-fit:contain;padding:4px;background:#fff;display:block}'
+'#fbapp .km-c .bd{flex:1;min-width:0;display:block}'
+'#fbapp .km-c .nm{display:block;font-size:15.5px;font-weight:800;line-height:1.25}'
+'#fbapp .km-c .ct{display:block;font-size:11px;font-weight:700;color:var(--ink2);line-height:1.4}'
+'#fbapp .km-c .mn{display:inline-block;margin-top:4px;font-size:13px;font-weight:800;color:#C2571F;background:#FFF1E2;border-radius:8px;padding:1px 8px}'
+'#fbapp .km-c .mt{display:block;font-size:10.5px;font-weight:700;color:var(--ink2);margin-top:3px}'
+'#fbapp .km-c .go{flex-shrink:0;width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#6FC868,var(--leaf));box-shadow:0 2px 0 var(--leafd);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:800}'
+'#fbapp .km-c .rb{position:absolute;top:-10px;right:10px;font-size:10.5px;font-weight:800;border-radius:999px;padding:2px 9px;color:#fff;background:var(--coral);box-shadow:0 2px 0 var(--corald)}'
+'#fbapp .km-c .rb.ok{background:var(--leaf);box-shadow:0 2px 0 var(--leafd)}#fbapp .km-c .rb.rt{background:#3E86C9;box-shadow:0 2px 0 #2F6CA8}'
+'#fbapp .km-c.nx{border-color:var(--gold);box-shadow:0 4px 0 var(--goldd),0 0 0 4px rgba(247,201,72,.35);animation:kmc 1.6s ease-in-out infinite}'
+'@keyframes kmc{0%,100%{box-shadow:0 4px 0 var(--goldd),0 0 0 0 rgba(247,201,72,.6)}50%{box-shadow:0 4px 0 var(--goldd),0 0 0 9px rgba(247,201,72,0)}}'
+'#fbapp .km-c.dn{opacity:.88}#fbapp .km-c.lk{filter:grayscale(.8);opacity:.7;cursor:default}#fbapp .km-c.lk .go{background:#CBBFA5;box-shadow:0 2px 0 #AA9C7E}'
+'#fbapp .km-nt{margin-top:11px;font-size:10px;font-weight:700;color:#fff;text-align:center;line-height:1.6;text-shadow:0 1px 2px rgba(40,70,30,.4)}'
+'#fbapp .km-ov{position:fixed;inset:0;z-index:96;background:rgba(70,55,30,.6);display:none;align-items:center;justify-content:center;padding:18px}'
+'#fbapp .km-ov.on{display:flex}#fbapp .km-ov.bt{align-items:flex-end;padding:0}'
+'#fbapp .km-md{position:relative;width:100%;max-width:360px;max-height:88vh;overflow-y:auto;background:var(--card);border:2.5px solid var(--gold);border-radius:22px;padding:22px 18px 18px;box-shadow:0 6px 0 var(--goldd);animation:kmp .3s ease}'
+'#fbapp .km-ov.bt .km-md{max-width:430px;border-radius:22px 22px 0 0;border-width:2.5px 0 0;padding-bottom:calc(20px + env(safe-area-inset-bottom));animation:kmu .28s ease}'
+'@keyframes kmp{0%{transform:scale(.86);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes kmu{0%{transform:translateY(40px);opacity:0}100%{transform:none;opacity:1}}'
+'#fbapp .km-x{position:absolute;top:10px;right:10px;width:32px;height:32px;border:0;border-radius:50%;background:#F0E8D2;font-family:inherit;font-size:15px;color:var(--ink);cursor:pointer}'
+'#fbapp .km-dt{display:flex;justify-content:center;gap:6px;margin-bottom:12px}#fbapp .km-dt i{width:8px;height:8px;border-radius:50%;background:#E7DCC2}#fbapp .km-dt i.on{background:var(--goldd);width:20px;border-radius:99px}'
+'#fbapp .km-hi{text-align:center}#fbapp .km-hi .ow{width:84px;height:84px;margin:0 auto 6px;border-radius:50%;overflow:hidden;background:#fff;border:3px solid var(--gold)}#fbapp .km-hi .ow img{width:100%;height:100%;object-fit:contain;padding:6px}'
+'#fbapp .km-h2{font-size:18px;font-weight:800;line-height:1.45;text-align:center}'
+'#fbapp .km-p{font-size:12.5px;font-weight:700;color:var(--ink2);line-height:1.7;text-align:center;margin-top:6px}'
+'#fbapp .km-op{display:flex;align-items:center;gap:11px;width:100%;margin-top:9px;border:2px solid var(--bd);background:#fff;border-radius:15px;padding:12px;font-family:inherit;font-size:14.5px;font-weight:800;color:var(--ink);text-align:left;cursor:pointer;box-shadow:0 3px 0 #E3D5B4}'
+'#fbapp .km-op:active{transform:translateY(2px);box-shadow:0 1px 0 #E3D5B4}#fbapp .km-op .e{font-size:22px}'
+'#fbapp .km-b1{display:block;width:100%;margin-top:14px;border:2.5px solid #fff;border-radius:999px;padding:13px;font-family:inherit;font-size:15.5px;font-weight:800;color:#fff;background:linear-gradient(135deg,#6FC868,var(--leaf));box-shadow:0 4px 0 var(--leafd);cursor:pointer}'
+'#fbapp .km-b2{display:block;margin:10px auto 0;border:0;background:none;font-family:inherit;font-size:12.5px;font-weight:700;color:var(--ink2);text-decoration:underline;cursor:pointer;padding:4px 16px}'
+'#fbapp .km-ty{display:block;width:max-content;margin:0 auto 6px;font-size:11.5px;font-weight:800;color:#fff;background:var(--coral);border-radius:999px;padding:3px 12px}'
+'#fbapp .km-rl{margin-top:12px;display:grid;gap:8px}'
+'#fbapp .km-ri{display:flex;gap:10px;align-items:flex-start;background:#FFF9E2;border-radius:14px;padding:10px}'
+'#fbapp .km-ri .n{flex-shrink:0;width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#FFE07A,var(--gold));color:#5A3B00;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 0 var(--goldd)}'
+'#fbapp .km-ri b{display:block;font-size:14px;font-weight:800;line-height:1.35}#fbapp .km-ri small{display:block;font-size:11.5px;font-weight:700;color:var(--ink2);line-height:1.5}'
+'#fbapp .km-ri em{font-style:normal;font-size:11.5px;font-weight:800;color:#C2571F}'
+'#fbapp .km-dh{display:flex;align-items:center;gap:12px}#fbapp .km-dh .fc{width:60px;height:60px;border-radius:16px;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:28px}#fbapp .km-dh .fc img{width:100%;height:100%;object-fit:contain;padding:5px;background:#fff}'
+'#fbapp .km-dh b{display:block;font-size:19px;font-weight:800}#fbapp .km-dh small{display:block;font-size:12px;font-weight:700;color:var(--ink2)}'
+'#fbapp .km-mb{margin-top:12px;text-align:center;background:#FFF1E2;border-radius:16px;padding:10px}#fbapp .km-mb b{display:block;font-size:22px;font-weight:800;color:#C2571F}#fbapp .km-mb small{font-size:11.5px;font-weight:700;color:var(--ink2)}'
+'#fbapp .km-gd{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}#fbapp .km-gd span{background:#fff;border:2px solid var(--bd);border-radius:12px;padding:6px 8px;font-size:12px;font-weight:800;text-align:center}'
+'#fbapp .km-hw{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:6px;counter-reset:k}'
+'#fbapp .km-hw li{counter-increment:k;display:flex;gap:9px;align-items:flex-start;background:#F6FAF4;border-radius:12px;padding:8px 10px;font-size:13px;font-weight:700;line-height:1.55}'
+'#fbapp .km-hw li::before{content:counter(k);flex-shrink:0;width:20px;height:20px;border-radius:50%;background:var(--leaf);color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-top:1px}'
+'#fbapp .km-fa{margin-top:10px;font-size:12.5px;font-weight:800;color:var(--leafd);text-align:center}'
+'#fbapp .km-c .pw,#fbapp .km-dh .pw{display:inline-block;vertical-align:2px;margin-left:6px;font-style:normal;font-size:10.5px;font-weight:800;color:#fff;background:linear-gradient(135deg,#FF9E74,var(--coral));border-radius:999px;padding:2px 8px}'
+'#fbapp .km-c .es{display:block;margin-top:1px;font-size:9.5px;font-weight:700;color:var(--ink2)}#fbapp .km-ri .es{margin-left:5px;font-size:9.5px;font-weight:700;color:var(--ink2)}#fbapp .km-mb .es{display:block;font-size:10px;font-weight:700;color:var(--ink2);margin:2px 0}#fbapp .km-mb small{display:block}'
+'#fbapp .km-lead{text-align:center;font-size:12.5px;font-weight:700;color:var(--ink);background:#FFF6D6;border-radius:14px;padding:8px 10px;margin:4px 0 12px;line-height:1.6}#fbapp .km-lead b{color:#C2571F}'
+'#fbapp .km-yt{text-align:center;font-size:13px;font-weight:800;color:var(--ink2)}#fbapp .km-tc{margin-top:6px;text-align:center;background:linear-gradient(180deg,#FFFFFF,#FFF6D6);border:3px solid var(--gold);border-radius:20px;padding:14px 12px 12px;box-shadow:0 4px 0 var(--goldd);animation:kmp .45s cubic-bezier(.2,.9,.3,1.3)}#fbapp .km-te{font-size:46px;line-height:1}#fbapp .km-tn{font-size:23px;font-weight:800;color:#C2571F;margin-top:4px}#fbapp .km-td{font-size:12.5px;font-weight:700;color:var(--ink);line-height:1.65;margin-top:6px}#fbapp .km-td b{color:var(--leafd)}#fbapp .km-ts{margin-top:8px;font-size:11.5px;font-weight:800;color:var(--ink2);min-height:16px}#fbapp .km-ts b{color:var(--corald)}'
+'#fbapp .km-rh{margin-top:12px;font-size:12px;font-weight:800;color:var(--ink2)}#fbapp .km-chips2{flex-wrap:wrap;row-gap:6px;margin:6px 0 4px}'
+'#fbapp .km-b3{display:block;width:100%;margin-top:10px;border:2.5px solid #fff;border-radius:999px;padding:11px;font-family:inherit;font-size:14px;font-weight:800;color:#fff;background:linear-gradient(135deg,#6FAEE6,#3E86C9);box-shadow:0 4px 0 #2F6CA8;cursor:pointer}'
+'#fbapp .km-cont{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:9px;border:2px solid var(--gold);background:#FFF9E2;border-radius:999px;padding:10px 16px;font-family:inherit;font-size:13.5px;font-weight:800;color:var(--ink);cursor:pointer}#fbapp .km-cont span{color:var(--goldd);font-size:16px}'
+'#fbapp .km-redo{display:block;width:100%;margin-top:9px;border:2.5px solid #fff;border-radius:16px;padding:10px 12px;font-family:inherit;font-size:14px;font-weight:800;color:#fff;background:linear-gradient(135deg,#6FAEE6,#3E86C9);box-shadow:0 4px 0 #2F6CA8;cursor:pointer;line-height:1.35}#fbapp .km-redo small{display:block;font-size:10.5px;font-weight:700;opacity:.92}'
+'#fbapp .km-pl{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}#fbapp .km-pl span{font-size:10.5px;font-weight:800;color:var(--ink);background:#F0F6FC;border-radius:8px;padding:2px 7px}#fbapp .km-pl b{color:#2F6CA8;margin-right:4px}#fbapp .km-pl2{margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px}#fbapp .km-pl2 span{font-size:12.5px;text-align:center;padding:7px 6px;border:2px solid #D6E6F5}#fbapp .km-pl2 b{display:block;margin:0}'
+'#fbapp .km-mv{margin-top:10px}#fbapp .km-mvb{display:block;width:100%;border:2px dashed var(--gold);background:#FFF9E2;border-radius:14px;padding:9px;font-family:inherit;font-size:13px;font-weight:800;color:var(--ink);cursor:pointer}#fbapp .km-mvb small{display:block;font-size:10.5px;font-weight:700;color:var(--ink2)}'
+'#fbapp .km-hi .ow .em{display:flex;align-items:center;justify-content:center;height:100%;font-size:40px}#fbapp .km-qn{text-align:center;font-size:11px;font-weight:800;color:var(--ink2);margin-bottom:4px}'
+'#fbapp .km-est{margin-top:12px;text-align:center;background:linear-gradient(180deg,#FFF6D6,#FFE9B0);border:2px solid var(--gold);border-radius:16px;padding:10px}#fbapp .km-est b{display:block;font-size:26px;font-weight:800;color:#C2571F;line-height:1.3}#fbapp .km-est small{display:block;font-size:11.5px;font-weight:800;color:var(--ink)}#fbapp .km-est .es{font-size:10px;font-weight:700;color:var(--ink2);margin-top:2px}'
+'html,body{overflow-x:hidden;overflow-x:clip;max-width:100%}'+'#fbapp{max-width:100%;overflow-x:hidden;overflow-x:clip}'+'#fbapp .km,#fbapp .km *,#fbapp .km-ov,#fbapp .km-ov *{box-sizing:border-box}'+'#fbapp .km{width:auto;max-width:100%;margin-left:0;margin-right:0}'+'#fbapp .km-ls,#fbapp .km-c,#fbapp .km-q,#fbapp .km-rt,#fbapp .km-nx{max-width:100%;min-width:0}'+'#fbapp .km img{max-width:100%}'
+'#fbapp .km-c .nm,#fbapp .km-c .ct,#fbapp .km-c .mn,#fbapp .km-c .mt,#fbapp .km-q .t b,#fbapp .km-q .t small{overflow-wrap:anywhere;word-break:normal}'+'#fbapp .km-c .mn{max-width:100%}'+'@media (max-width:389px){#fbapp .km{padding:12px 9px}#fbapp .km-c{gap:8px;padding:11px 9px}#fbapp .km-c .fc{width:42px;height:42px;border-radius:12px}#fbapp .km-c .nm{font-size:14px}#fbapp .km-c .ct{font-size:10.5px}#fbapp .km-c .mn{font-size:12px;padding:1px 6px}#fbapp .km-c .mt{font-size:10px}#fbapp .km-c .go{width:26px;height:26px;font-size:11px}#fbapp .km-q{gap:8px;padding:10px}#fbapp .km-q .e{font-size:24px}#fbapp .km-q .t b{font-size:14px}#fbapp .km-q .g{font-size:11px;padding:5px 9px}#fbapp .km-nx{font-size:14px}}'+'@media (max-width:339px){#fbapp .km{padding:10px 7px}#fbapp .km-c{gap:7px;padding:10px 8px}#fbapp .km-c .fc{width:36px;height:36px}#fbapp .km-c .nm{font-size:13px}#fbapp .km-c .pw{font-size:9.5px;padding:1px 6px;margin-left:4px}#fbapp .km-c .mn{font-size:11px}#fbapp .km-c .go{width:24px;height:24px}#fbapp .km-tt b{font-size:12px;padding:4px 10px}#fbapp .km-tt span{font-size:10px;padding:3px 8px}#fbapp .km-q .t b{font-size:13px}#fbapp .km-md{padding:20px 14px 14px}#fbapp .km-h2{font-size:16px}#fbapp .km-op{font-size:13.5px;padding:10px}}'
+'@media (prefers-reduced-motion:reduce){#fbapp .km-q,#fbapp .km-c.nx,#fbapp .km-md{animation:none}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* ▼ 移動 */
function go(id){
 closeAll();
 if(id==='intro'){
  S.intro=1;sv();render();
  var m=document.getElementById('introMini');
  if(m){m.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(function(){if(window.fbPlayIntro)window.fbPlayIntro()},450)}
  return;
 }
 var p=P[id];if(!p||p.lock)return;
 S.t[id]=S.t[id]||Date.now();sv();render();
 if(p.nav){var nb=document.querySelector('#fbapp .nv[data-scr="'+p.nav+'"]');if(nb)nb.click();else if(window.showScr)window.showScr(p.nav);return}
 if(p.url){location.href=p.url;return}
 var el=document.querySelector('#subA [data-goto="'+p.go+'"]');
 if(el)el.click();else if(window.showScr)window.showScr(p.go);
}

/* ▼ 地図 */
function face(p){return p.face?'<img src="'+p.face+'" alt="">':p.emo}
function render(){
 var nx=nextOf(),h='<div class="km"><div class="km-tt"><b>🗺 かせぎかたマップ</b><span>'+(S.route?'あなたのルート':'上から順に進めばOK')+'</span></div>';
 if(!S.route){
  h+='<button class="km-q" data-a="quiz"><span class="e">🦉</span><span class="t"><b>あなたのタイプを調べる</b><small>6つの質問・1分で、始め方が決まります</small></span><span class="g">スタート ›</span></button>';
 }else{
  h+='<div class="km-rt"><div class="h"><span>📍 '+(TYPE[S.ans&&S.ans.need]||'あなたのルート')+'</span></div><div class="km-chips">';
  S.route.forEach(function(id,i){var c=isDone(id)?'ok':id===nx?'nx':'';h+=(i?'<span class="km-ar">›</span>':'')+'<span class="km-chip '+c+'">'+(isDone(id)?'▶':(i+1))+' '+P[id].name+'</span>'});
  h+='</div>';
  if(nx){
   var p=P[nx];
   h+='<button class="km-nx" data-a="'+(nx==='intro'||P[nx].nav?'go':'open')+'" data-id="'+nx+'">次はこれ：'+p.name+' ▶<small>'+firstOf(nx,S.ans)+'</small></button>';
   if(S.route&&!isDone('poi'))h+='<div class="km-ng" style="color:#C2571F;background:#FFF1E2">💴 ポイ活の目安：毎月1.5〜2万円＋単発で約40万円 <small style="font-size:10px;color:var(--ink2)">※目安</small></div>';
   if(S.start&&Date.now()-S.start>3*864e5&&S.route.indexOf('poi')>-1&&!isDone('poi'))h+='<div class="km-ng">⏰ ポイ活の最初の1件がまだです。モッピー登録の3分だけ、今やってみよう</div>';
  }else h+='<div class="km-fin">🎉 ルートはぜんぶスタートしました。下のカードから、いつでもつづきができます</div>';
  if(isDone('poi')&&nx!=='poi')h+='<button class="km-cont" data-a="go" data-id="poi">💴 ポイ活のつづきをする <span>›</span></button>';
  h+='<button class="km-redo" data-a="redo">📝 タイプ診断をやりなおす<small>6つの質問・1分／答えるとルートが新しくなります</small></button>';
  h+='</div>';
 }
 h+='<div class="km-ls">';
 ORDER.forEach(function(id){
  var p=P[id],d=isDone(id),inR=S.route&&S.route.indexOf(id)>-1,cl='km-c'+(id===nx?' nx':'')+(p.lock?' lk':''),rb='';
  if(d)rb='<span class="rb ok">▶ 進行中・つづきから</span>';
  else if(id==='poi'&&(!S.route||nx==='poi'||nx==='intro'))rb='<span class="rb">👆 最初の一歩はここ</span>';
  else if(inR)rb='<span class="rb rt">あなたのルート '+(S.route.indexOf(id)+1)+'</span>';
  h+='<button class="'+cl+'" data-a="open" data-id="'+id+'"'+(p.lock?' disabled':'')+'><span class="km-stp">STEP '+p.step+'</span>'+rb
   +'<span class="fc" style="background:'+p.bg+'">'+face(p)+'</span><span class="bd"><span class="nm">'+p.name+(p.pw?'<i class="pw">'+p.pw+'</i>':'')+'</span><span class="ct">'+p.catch+'</span>'
   +(p.money?'<span class="mn">'+(p.est?'💴 ':'👑 ')+p.money+'</span>'+(p.est?'<small class="es">※目安</small>':''):'')+(p.plan?'<span class="km-pl">'+p.plan.map(function(x){return'<span><b>'+x[0]+'</b>'+x[1]+'</span>'}).join('')+'</span>':'')+(p.time?'<span class="mt">⏱ '+p.time+'　💰 '+p.cost+'</span>':'')+'</span><span class="go">'+(p.lock?'🔒':'▶')+'</span></button>';
 });
 h+='</div><div class="km-nt">※金額は目安です。行動量・時期・案件の終了によって変わり、収入を保証するものではありません</div></div>';
 root.innerHTML=h;
}

/* ▼ ポップアップ共通 */
var ov=document.createElement('div');ov.className='km-ov';ov.innerHTML='<div class="km-md"><button class="km-x" data-a="x">✕</button><div class="km-in"></div></div>';app.appendChild(ov);
var inner=ov.querySelector('.km-in'),mode='',qi=0,ans={};
function closeAll(){ov.classList.remove('on','bt');inner.innerHTML=''}
function dismiss(){if(mode==='quiz'&&!S.route){S.dis=(S.dis||0)+1;S.disAt=Date.now();sv()}closeAll()}

/* ▼ 質問6つ → タイプ1つ → ポイ活へ */
function openWelcome(){
 mode='welcome';var nx=nextOf()||'poi',p=P[nx],ti=TINFO[S.type||(S.ans&&S.ans.need)]||{e:'🦉'},tn=TYPE[S.type||(S.ans&&S.ans.need)]||'';
 var s='<div class="km-lead">🎉 スタンプおつかれさま！</div>'
  +'<div class="km-yt">前回のあなたは…</div><div class="km-tc"><div class="km-te">'+ti.e+'</div><div class="km-tn">'+tn+'</div></div>'
  +'<div class="km-rh">あなたの進め方</div><div class="km-chips km-chips2">';
 S.route.forEach(function(id,i){var c=isDone(id)?'ok':id===nx?'nx':'';s+=(i?'<span class="km-ar">›</span>':'')+'<span class="km-chip '+c+'">'+(isDone(id)?'▶':(i+1))+' '+P[id].name+'</span>'});
 s+='</div><button class="km-b1" data-a="go" data-id="'+nx+'">つづきから：'+p.name+' ▶</button>'
  +(nx!=='poi'&&isDone('poi')?'<button class="km-cont" data-a="go" data-id="poi">💴 ポイ活のつづきをする <span>›</span></button>':'')
  +'<button class="km-b3" data-a="renew">📝 新しく答えなおす（1分）</button>'
  +'<button class="km-b2" data-a="x">閉じる</button>';
 inner.innerHTML=s;ov.classList.remove('bt');ov.classList.add('on');
}
function openQuiz(){mode='quiz';ans={};qi=0;loadMem();drawQ();ov.classList.remove('bt');ov.classList.add('on')}
function dots(n,len){var s='<div class="km-dt">';for(var i=0;i<len;i++)s+='<i class="'+(i===n?'on':'')+'"></i>';return s+'</div>'}
function drawQ(){
 if(qi<Q.length){
  var q=Q[qi],s=(qi===0?'<div class="km-lead">🎉 スタンプおつかれさま！<br><b>6つ答えるだけ</b>で、あなたのタイプと始め方がわかります（1分）</div>':'')+dots(qi,Q.length)+'<div class="km-qn">Q'+(qi+1)+' / '+Q.length+'</div><div class="km-h2">'+q.q+'</div>'+(q.note?'<div class="km-p">'+q.note+'</div>':'');
  q.o.forEach(function(o){s+='<button class="km-op" data-a="ans" data-v="'+o[0]+'"><span class="e">'+o[1]+'</span>'+o[2]+'</button>'});
  s+=qi>0?'<button class="km-b2" data-a="back">‹ ひとつ前にもどる</button>':'<button class="km-b2" data-a="x">あとで</button>';
  inner.innerHTML=s;return;
 }
 var r=build(ans),ti=TINFO[ans.need];
 var s='<div class="km-yt">あなたは…</div><div class="km-tc"><div class="km-te">'+ti.e+'</div><div class="km-tn">'+TYPE[ans.need]+'</div><div class="km-td">'+ti.d+'</div><div class="km-ts" id="kmStat">同じタイプの人を集計中…</div></div>'
  +'<div class="km-est"><small>ポイ活で受け取れる目安</small><b>毎月 1.5〜2万円</b><small>＋単発の案件で 約40万円</small><small class="es">※目安です。行動量や時期によって変わります</small></div>'
  +'<div class="km-rh">あなたの進め方</div><div class="km-chips km-chips2">';
 r.forEach(function(id,i){s+=(i?'<span class="km-ar">›</span>':'')+'<span class="km-chip'+(i===0?' nx':'')+'">'+(i+1)+' '+P[id].name+'</span>'});
 s+='</div><div class="km-fa">最初にやること：'+firstOf('poi',ans)+'</div>'
  +'<button class="km-b1" data-a="start">ポイ活を進める ▶</button>'
  +(ans.need==='mile'?'<button class="km-b3" data-a="gomile">✈️ マイルランキングのしくみを見る</button>':'')
  +'<div class="km-mv" id="kmMv"><button class="km-mvb" data-a="mv">🎬 おかねの図書館ってなに？（約2分）<small>見たい人だけでOK</small></button></div>'
  +'<button class="km-b2" data-a="save">あとで進める（結果を保存して閉じる）</button>';
 inner.innerHTML=s;
 sendStat(ans);
}
function sendStat(a){
 var el=function(){return document.getElementById('kmStat')};
 function show(res){var e=el();if(!e)return;if(!res||!res.total){e.textContent='';return}
  var n=(res.types&&res.types[a.need])||0,pc=Math.round(n/res.total*100);
  e.innerHTML='このタイプの人：<b>全体の'+pc+'%</b>（'+res.total+'人中'+n+'人）'}
 var send=function(){
  var body={member_id:MEM&&MEM.id||'',name:MEM&&MEM.customFields&&MEM.customFields['first-name']||'',type:a.need,answers:a};
  fetch(STAT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
   .then(function(r){return r.json()}).then(show).catch(function(){show(null)});
 };
 if(MEM)send();else setTimeout(send,600);
}
function build(a){
 var r=['poi'];
 if(a.need==='mile')r.push('mile');
 if(a.need==='shiharai'||a.phone==='high')r.push('kotei');
 if((a.need==='maitsuki'||a.need==='skill')&&a.time!=='low')r.push('buppan');
 if(a.need==='skill'&&a.time==='high')r.push('repair');
 if(a.need==='skill'&&a.cash==='high')r.push('trade');
 if(r.length===1)r.push(a.phone==='low'?'buppan':'kotei');
 return r;
}

/* ▼ 説明シート */
function openDetail(id){
 var p=P[id];if(!p||p.lock)return;
 if(p.nav){go(id);return}
 if(isDone(id)){go(id);return}
 mode='detail';
 inner.innerHTML='<div class="km-dh"><span class="fc" style="background:'+p.bg+'">'+face(p)+'</span><span><b>'+p.name+(p.pw?'<i class="pw">'+p.pw+'</i>':'')+'</b><small>'+p.catch+'</small></span></div>'
  +'<div class="km-mb"><b>'+p.money+'</b>'+(p.est?'<small class="es">※目安です。行動量や時期によって変わります</small>':'')+'<small>'+p.sub+'</small></div>'
  +(p.plan?'<div class="km-pl km-pl2">'+p.plan.map(function(x){return'<span><b>'+x[0]+'</b>'+x[1]+'</span>'}).join('')+'</div>':'')
  +'<div class="km-gd"><span>⏱ '+p.time+'</span><span>💰 '+p.cost+'</span></div>'
  +'<ol class="km-hw">'+p.what.map(function(w){return'<li>'+w+'</li>'}).join('')+'</ol>'
  +'<div class="km-fa">まずやること：'+firstOf(id,S.ans)+'</div>'
  +'<button class="km-b1" data-a="go" data-id="'+id+'">'+(p.btn||'はじめる ▶')+'</button>';
 ov.classList.add('on','bt');
}

/* ▼ クリック */
function onClick(e){
 var t=e.target.closest('[data-a]');if(!t)return;
 var a=t.getAttribute('data-a'),id=t.getAttribute('data-id');
 if(a==='quiz')openQuiz();
 else if(a==='redo'){openQuiz()}
 else if(a==='renew'){openQuiz()}
 else if(a==='open')openDetail(id);
 else if(a==='go')go(id);
 else if(a==='gomile'){S.route=build(ans);S.ans=ans;S.type=ans.need;S.start=Date.now();sv();go('mile')}
 else if(a==='x')dismiss();
 else if(a==='mv'){S.intro=1;sv();var b=document.getElementById('kmMv');if(b)b.innerHTML='<div style="position:relative;padding-top:56.25%;background:#000;border-radius:12px;overflow:hidden"><iframe src="https://player.vimeo.com/video/'+MV_ID+'?autoplay=1&title=0&byline=0&portrait=0&badge=0&dnt=1" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="紹介ムービー"></iframe></div>'}
 else if(a==='back'){qi--;drawQ()}
 else if(a==='ans'){ans[Q[qi].k]=t.getAttribute('data-v');qi++;drawQ()}
 else if(a==='start'||a==='save'){S.route=build(ans);S.ans=ans;S.type=ans.need;S.start=Date.now();sv();render();if(a==='start')go('poi');else closeAll()}
}
root.addEventListener('click',onClick);
ov.addEventListener('click',function(e){if(e.target===ov){dismiss();return}onClick(e)});
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#introMini')&&!S.intro){S.intro=1;sv();render()}},true);

render();

/* ▼ 自動で出すタイミング（今のホーム A_finbook-home.js に合わせた）
   ・ホームは会員情報の読み込み後、その日最初の1回だけログインスタンプのシートを出す（sessionStorage: fbsmauto+日付）
   ・この説明は、そのシートを本人が閉じてから1秒後に出す
   ・その日初回のリロード（2個目のEmbed）でシートが消えてしまった場合は、シートを出し直してから待つ
   ・スタンプが8秒たっても出なければ（未ログインなど）、そのまま出す
   ・会員ホームを開くたびに、スタンプのあとに出す。前回の結果がある人は「おかえり画面」（つづきから／答えなおす） */
(function(){
 var td=new Date(Date.now()+324e5),dk=''+td.getUTCFullYear()+(td.getUTCMonth()+1)+td.getUTCDate();
 var KEY='fbsmauto'+dk,CL='km_smclosed'+dk;
 function ss(k,v){try{if(v)sessionStorage.setItem(k,v);return sessionStorage.getItem(k)}catch(e){return null}}
 var sm=document.getElementById('smSheet');
 if(sm&&window.MutationObserver){var was=sm.classList.contains('on');new MutationObserver(function(){var on=sm.classList.contains('on');if(was&&!on)ss(CL,'1');was=on}).observe(sm,{attributes:true,attributeFilter:['class']})}
 var want=true; /* 開くたびに出す（スタンプのあと） */
 var t0=Date.now(),seen=0,reopened=0,calm=0;
 function busy(){
  if(document.querySelector('#fbapp .sheet.on,#fbapp .mvp-ov.show,#toast.on,#fbapp .km-ov.on'))return true;
  var fx=document.getElementById('fxLayer');if(fx&&fx.children.length)return true;
  var h=document.getElementById('scr-home');if(h&&!h.classList.contains('on'))return true;
  return false;
 }
 var tm=setInterval(function(){
  var now=Date.now();if(now-t0>90000){clearInterval(tm);return}
  var shown=ss(KEY),closed=ss(CL);
  if(shown&&!seen)seen=now;
  if(sm&&shown&&!closed){
   if(!sm.classList.contains('on')&&!reopened&&now-seen>2500&&window._fbsk!==undefined){reopened=1;var o=document.getElementById('smOpen');if(o)o.click()}
   calm=0;return;
  }
  if(!shown&&now-t0<8000)return;
  if(!want){clearInterval(tm);return}
  if(busy()){calm=0;return}
  calm+=400;if(calm>=1000){clearInterval(tm);S.shownDay=dk;sv();if(S.route)openWelcome();else openQuiz()}
 },400);
})();
})();
