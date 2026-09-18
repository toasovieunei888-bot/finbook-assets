var DATA={items:[],masters:{},types:[],config:{},stats:{},status:[],places:[],reject:[],today:''};
var cur=null, photosB=[], photosA=[], curParts=[], curCases=[], fStatus='', actor='', pending=null;
var COLOR={'検討中':'#7d7565','購入済':'#8a8fa8','仕入済':'#2c7fa3','未割当':'#7b58a3','作業中':'#e0901c',
  '要検品':'#c0452b','出品中':'#0f6b53','査定中':'#1d7f86','返送待ち':'#a3663d',
  '売却済':'#3a4a42','保留':'#a3663d','取消':'#8d8779'};
var CTEXT={'作業中':'#2a1a05'};
var MAT=['ヌメ革','レザー','エナメル','金具','コバ','内装','エキゾチック','起毛','生地・ナイロン','プリント'];
var RANK=['S　新品同様','A　ほぼキレイ','B　使用感あり','C　傷や汚れ多め','D　かなり傷んでいる','E　ジャンク'];
var F=['ブランド','型','商品名','素材','状態ランク','症状','所在','登録日','状態変更日','査定先','査定額','仕入れ担当','仕入先','仕入日','仕入値','想定売値',
  'リペア担当','着手日','期限日','材料費','検品者','検品日','差戻回数','差戻理由',
  '売却先','売却日','売却額','手数料','送料','ステータス','備考'];

var BEFORE=['前','後ろ','横','逆の横','角','逆の角','取っ手','取っ手のアップ','中身','ロゴ','ファスナーの金具','シリアル'];
var PARTS=['持ち手','コバ','内装','金具','底・角','外装全体','ファスナー','ロゴ周り'];
/* 部位 → マニュアルの症例を引く条件 */
var PMAP={
  '持ち手':{re:/持ち手|肩紐|ハンドル|ショルダー/},
  'コバ':{m:'コバ',re:/フチ|パイピング|合わせ目/},
  '内装':{m:'内装',re:/内装|内袋|ポケット|カード段|小銭|内側|裏地/},
  '金具':{m:'金具',re:/ボタン|鋲|ホック|南京錠|プレート|引き手|紐通し/},
  '底・角':{re:/底面|角|擦れ/},
  '外装全体':{re:/全体|本体/},
  'ファスナー':{re:/ファスナー/},
  'ロゴ周り':{re:/ロゴ|イニシャル|刻印|箔押し/}
};
var VMARK={'直る':'◎ 直る','軽減のみ':'△ 軽くなる','不可':'× 直せない','技法':'／ やり方'};

var STAGE={'検討中':0,'購入済':0,'仕入済':1,'未割当':2,'作業中':3,'保留':3,'要検品':4,
  '出品中':5,'査定中':5,'返送待ち':5,'売却済':6,'取消':-1};
/* 画面に出す言い方。シートに入る値は元のまま */
var LABEL={'検討中':'仕入れ検討','購入済':'買った（届く前）','仕入済':'届いた','未割当':'リペア待ち','作業中':'リペア中',
  '要検品':'確認待ち','出品中':'販売中','査定中':'査定に出した','返送待ち':'返してもらう',
  '売却済':'売却済み','保留':'保留','取消':'取消'};
function lb(x){ return LABEL[x]||x; }
/* それぞれの段階が何を意味するか */
var HELP={
  '検討中':'買う前の下調べ。相場を記録して、いくらまで出せるかを見る段階',
  '購入済':'買ったばかり。まだ手元に届いていない。写真はまだ撮れない',
  '仕入済':'現物が届いた。写真を12枚撮る段階',
  '未割当':'写真と直す場所が入った。だれかが受けるのを待っている',
  '作業中':'リペアの作業中',
  '要検品':'仕上がりのチェック待ち',
  '出品中':'売りに出している',
  '査定中':'買取業者に送って、金額の返事を待っている',
  '返送待ち':'金額が安かったので返してもらう。戻ったら別のところで売る',
  '売却済':'売れた。利益が確定した',
  '保留':'いったん止めている',
  '取消':'一覧から外した'
};
var REQ=[
  {from:0,fields:['ブランド','型','仕入値']},
  {from:1,fields:['仕入先','仕入日']},
  {from:2,fields:['症状','リペア担当']},
  {from:5,fields:['想定売値','検品者']},
  {from:6,fields:['売却先','売却日','売却額']}
];

/* ★合言葉。変えたいときはここの文字を書き換える★ */
var PASSWORD='toasovie';

function checkPw(){
  var v=$('pw').value.trim();
  if(v!==PASSWORD){
    $('pwNg').style.display='block';
    $('pw').value=''; return;
  }
  try{ localStorage.setItem('pwOK','1'); }catch(e){}
  $('gate').style.display='none';
  start();
}
function openGate(){
  var ok=false;
  try{ ok = localStorage.getItem('pwOK')==='1'; }catch(e){}
  if(ok){ $('gate').style.display='none'; start(); }
  else{ $('gate').style.display='flex'; $('pw').focus(); }
}

var API_URL = (window.KANRI_URL||'');
/* サーバーを呼ぶ。GET → POST → 旧方式 の順に試す。
   途中経過を画面下に出すので、詰まった場所が分かる */
function note(t){}
function call(fn, args, ok, ng){
  args = args || [];
  ok = ok || function(){};
  ng = ng || function(e){ alert(String(e && e.message || e)); };
  var done=false;
  function good(r){ if(done)return; done=true; note(''); ok(r); }
  function bad(e){ if(done)return; done=true; ng(e); }

  var hasUrl = API_URL && API_URL.indexOf('http')===0;

  /* ① GET（?ping=1 が通ったのと同じ道） */
  function viaGet(){
    if(!hasUrl){ viaPost(); return; }
    note('通信中（1/3）');
    var cb='__cb'+Math.floor(Math.random()*1e9);
    var el=document.createElement('script');
    var t=setTimeout(function(){ cleanup(); viaPost(); }, 20000);
    function cleanup(){ clearTimeout(t); try{delete window[cb];}catch(x){} if(el.parentNode) el.parentNode.removeChild(el); }
    window[cb]=function(res){ cleanup(); if(res&&res.ok) good(res.data); else bad(new Error((res&&res.error)||'処理に失敗')); };
    el.src=API_URL+'?fn='+encodeURIComponent(fn)+'&cb='+cb+'&args='+encodeURIComponent(JSON.stringify(args));
    el.onerror=function(){ cleanup(); viaPost(); };
    document.head.appendChild(el);
  }

  /* ② POST */
  function viaPost(){
    if(!hasUrl || typeof fetch!=='function'){ viaRun(); return; }
    note('通信中（2/3）');
    fetch(API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({fn:fn,args:args})})
      .then(function(r){ return r.json(); })
      .then(function(j){ if(j&&j.ok) good(j.data); else bad(new Error((j&&j.error)||'処理に失敗')); })
      .catch(function(){ viaRun(); });
  }

  /* ③ 旧方式。20秒で諦める */
  function viaRun(){
    note('通信中（3/3）');
    if(typeof google==='undefined'||!google.script||!google.script.run){
      bad(new Error('サーバーに繋がらなかった。URLの設定を確認する'));
      return;
    }
    var t=setTimeout(function(){
      bad(new Error('サーバーからの返事が20秒返ってこなかった'));
    },20000);
    try{
      var r = google.script.run
        .withSuccessHandler(function(x){ clearTimeout(t); good(x); })
        .withFailureHandler(function(e){ clearTimeout(t); bad(e); });
      r[fn].apply(r, args);
    }catch(e){ clearTimeout(t); bad(e); }
  }

  viaGet();
}

/* 人ごとの色。だれが仕入れたかを色で見分けるためだけに使う */
var TEAM=['#2c7fa3','#7b58a3','#c08423','#0f6b53','#bc4529','#1d7f86','#a3663d','#5b6bbf'];
function teamColor(name){
  if(!name) return '#c9c2b2';
  var h=0;
  for(var i=0;i<name.length;i++) h=(h*31+name.charCodeAt(i))%9973;
  return TEAM[h%TEAM.length];
}
function teamDot(name){
  return '<span style="display:inline-block;width:9px;height:9px;border-radius:50%;'
    +'background:'+teamColor(name)+';margin-right:6px;vertical-align:1px"></span>';
}

function $(id){return document.getElementById(id);}
function yen(n){return n||n===0?Number(n).toLocaleString('ja-JP'):'';}
function thumb(id){return 'https://drive.google.com/thumbnail?id='+id+'&sz=w400';}
function n0(v){return Number(v)||0;}
function dayDiff(a,b){
  if(!a||!b) return null;
  var p=String(a).split('-'), q=String(b).split('-');
  return Math.round((new Date(q[0],q[1]-1,q[2])-new Date(p[0],p[1]-1,p[2]))/86400000);
}
function stageOf(s){var v=STAGE[s];return v===undefined?0:v;}
/* 何日たったか */
function daysSince(d){
  if(!d) return null;
  var n=dayDiff(d, DATA.today);
  return (n===null||n<0)?null:n;
}
function ageText(n){ return n===null?'—':(n===0?'今日':n+'日'); }
/* この状態のまま何日たったか。長いと色が変わる */
function stayDays(it){ return daysSince(it.状態変更日||it.更新日||it.登録日); }
/* 3日で黄、5日で橙、7日で赤 */
function stayColor(n){
  if(n===null) return '';
  if(n>=7) return '#d42a1f';
  if(n>=5) return '#f07800';
  if(n>=3) return '#f2c200';
  return '';
}
/* 背景に色を敷くときの文字色 */
function stayInk(n){ return n>=7 ? '#fff' : (n>=5 ? '#2a1400' : '#3a2c00'); }
function stayText(it){
  var n=stayDays(it);
  if(n===null) return '—';
  var t=(n===0?'今日':n+'日');
  var c=stayColor(n);
  return c ? '<span style="background:'+c+';color:'+stayInk(n)
    +';font-weight:800;padding:3px 8px;border-radius:6px">'+t+(n>=7?' ⚠':'')+'</span>' : t;
}
function listOf(s){return String(s||'').split(',').filter(String);}
function findP(list,slot){for(var i=0;i<(list||[]).length;i++) if(list[i].s===slot) return list[i]; return null;}
function cntFilled(list,slots){var n=0;slots.forEach(function(s){if(findP(list,s))n++;});return n;}
function slotsFor(o){
  var t=typeOf(o.ブランド,o.型);
  return (t&&t.枠&&t.枠.length)?t.枠:BEFORE;
}
function typeOf(brand,name){
  for(var i=0;i<DATA.types.length;i++){
    var t=DATA.types[i];
    if(t.型名===name && (!brand||t.ブランド===brand)) return t;
  }
  return null;
}

/* 足りていないもの。ここが空のあいだはステータスを進められない */
function isEmpty(o,f){var v=o[f];return v===''||v===null||v===undefined;}
function gate(o){
  var st=stageOf(o.ステータス);
  if(st<0) return [];
  var r=[];
  REQ.forEach(function(q){
    if(st<q.from) return;
    q.fields.forEach(function(f){ if(isEmpty(o,f)) r.push(f+'を入れる'); });
  });
  if(st>=2){
    var ss=slotsFor(o), b=cntFilled(o.写真前,ss);
    if(b<ss.length) r.push('写真をあと'+(ss.length-b)+'枚');
    if(!listOf(o.リペア箇所).length) r.push('どこを直すかを選ぶ');
  }
  if(st>=4){
    var ss2=slotsFor(o), a=cntFilled(o.写真後,ss2);
    if(a<ss2.length) r.push('直したあとの写真をあと'+(ss2.length-a)+'枚');
  }
  return r;
}

function load(){
  call('getAll',[actor],
    function(d){ DATA=d; init(); },
    function(e){
      $('list').innerHTML='<div class="empty" style="color:#c0452b">'
        +'読み込めなかった<br><br><span style="font-size:12px">'+(e&&e.message?e.message:e)+'</span>'
        +'<br><br><button class="btn" onclick="load()">もう一度読む</button></div>';
    });
}

function init(){
  var s=DATA.stats;
  /* 仕入れ側とリペア側で見る場所を分ける */
  var BUY=['購入済','仕入済','出品中','査定中','返送待ち','売却済'];
  var REP=['未割当','作業中','要検品'];
  var need=isAdmin()?countNeed():DATA.items.filter(function(x){return gate(x).length>0;}).length;

  function mkTab(box, key, text, warn){
    var b=document.createElement('button');
    b.className='tab'+(warn?' warn':'')+(fStatus===key?' on':'');
    b.textContent=text;
    b.onclick=function(){ fStatus=(fStatus===key?'':key); init(); };
    box.appendChild(b);
  }
  function fillRow(id, list){
    var box=$(id); box.innerHTML='';
    list.forEach(function(x){
      var n = x==='未割当'? s.未割当 : (x==='要検品'? s.要検品 : 0);
      mkTab(box, x, lb(x)+(n?' '+n:''));
    });
  }

  fillRow('tabsBuy', BUY);
  fillRow('tabsRep', REP);

  var all=$('tabsAll'); all.innerHTML='';
  mkTab(all, '', 'すべて');
  mkTab(all, '__over', '期限すぎ '+s.期限超過, true);
  if(isAdmin()){
    mkTab(all, '__need', '入力もれ '+need, true);
    mkTab(all, '__who', 'みんなの様子');
  }

  /* リペアの人には仕入れ側を出さない */
  var job=DATA.job||'両方';
  var buyRow=$('tabsBuy').parentNode;
  buyRow.style.display = (isAdmin()||job==='仕入れ'||job==='両方') ? 'flex' : 'none';
  var repRow=$('tabsRep').parentNode;
  repRow.style.display = (isAdmin()||job==='リペア'||job==='両方') ? 'flex' : 'none';

  var names=(DATA.masters.担当||[]);
  var a=$('actor'), keepA=actor||localStorage.getItem('actor')||'';
  a.innerHTML='<option value="">未設定</option>';
  names.forEach(function(n){a.innerHTML+='<option>'+n+'</option>';});
  a.innerHTML+='<option value="__add">＋ 人を追加</option>';
  a.value=keepA; actor=keepA;
  if(!actor) askWho();

  var repairers=(DATA.masters.直す人&&DATA.masters.直す人.length)?DATA.masters.直す人:names;

  var w=$('fWho'), keep=w.value;
  w.innerHTML='<option value="">リペアの人で絞る</option>';
  repairers.forEach(function(n){w.innerHTML+='<option>'+n+'</option>';});
  w.innerHTML+='<option>未割当</option>'; w.value=keep;




  var sel=$('i_ステータス'), keepS=sel.value; sel.innerHTML='';
  DATA.status.filter(function(x){return x!=='検討中';})
    .forEach(function(x){sel.innerHTML+='<option value="'+x+'">'+lb(x)+'</option>';});
  if(keepS) sel.value=keepS;
  var ps=$('i_所在'), keepPs=ps.value; ps.innerHTML='<option value=""></option>';
  DATA.places.forEach(function(x){ps.innerHTML+='<option>'+x+'</option>';});
  ps.value=keepPs;

  var total=n0(s.通算利益), acc=(s.精度===null||s.精度===undefined)?null:s.精度;

  var st3=0, st5=0, st7=0;
  DATA.items.forEach(function(x){
    if(x.ステータス==='売却済'||x.ステータス==='取消') return;
    var n=stayDays(x);
    if(n===null) return;
    if(n>=7) st7++; else if(n>=5) st5++; else if(n>=3) st3++;
  });

  if(canMoney()){
    $('strip').innerHTML=
      box('今月の利益（'+s.今月件数+'点）',yen(s.今月利益)+'円',s.今月利益<0?'neg':'pos')+
      box('これまでの利益（'+n0(s.売却件数)+'点）',yen(total)+'円',total<0?'neg':'pos')+
      box('作業まち／確認まち',s.未割当+' / '+s.要検品+'件',(s.未割当||s.要検品)?'neg':'')+
      box('期限すぎ／あと1日',s.期限超過+' / '+s.期限間近+'件',s.期限超過?'neg':'');
  }else{
    var me=(s.担当別||{})[actor]||{作業中:0,要検品:0,今月完了:0,今月報酬:0};
    $('strip').innerHTML=
      box('いま持っている仕事',me.作業中+' / 上限'+(DATA.config.同時上限||3)+'件',me.作業中>=(DATA.config.同時上限||3)?'neg':'')+
      box('確認まち',me.要検品+'件','')+
      box('今月の完了',me.今月完了+'件','pos')+
      box('今月の報酬',yen(me.今月報酬)+'円','pos')+
      box('受けられる仕事',s.未割当+'件',s.未割当?'pos':'');
  }
  $('stall').innerHTML =
     '<div class="pill '+(st3?'y':'off')+'"><b>'+st3+'件</b><span>3日すぎ</span></div>'
    +'<div class="pill '+(st5?'o':'off')+'"><b>'+st5+'件</b><span>5日すぎ</span></div>'
    +'<div class="pill '+(st7?'r':'off')+'"><b>'+st7+'件</b><span>7日すぎ ⚠</span></div>';

  var jb=DATA.job||'';
  $('jobLabel').textContent = canMoney() ? '仕入れ' : 'リペア';
  stampNow();
  applyView();
  applyFold();
  render();
}
function setSel(id,arr,val,addLabel){
  var el=$(id); if(!el) return;
  var v=(val===undefined||val===null)?el.value:String(val);
  var list=(arr||[]).slice();
  if(v&&list.indexOf(v)<0) list.push(v);
  var h='<option value=""></option>';
  list.forEach(function(x){ h+='<option value="'+x+'">'+x+'</option>'; });
  if(addLabel) h+='<option value="__add">＋ '+addLabel+'</option>';
  el.innerHTML=h; el.value=v||'';
}
function typeNames(brand){
  return DATA.types.filter(function(t){return !brand||t.ブランド===brand;})
    .map(function(t){return t.型名;});
}
function fillSelects(o){
  o=o||{};
  var m=DATA.masters||{};
  setSel('i_ブランド', m.ブランド, o.ブランド||'', 'ブランドを追加');
  setSel('i_型', typeNames(o.ブランド||''), o.型||'', 'モデルを登録');
  setSel('i_素材', MAT, o.素材||'');
  setSel('i_状態ランク', RANK, o.状態ランク||'');
  setSel('i_症状', (DATA.masters.症状||[]), o.症状||'', '状態を追加');
  setSel('i_仕入先', m.仕入先, o.仕入先||'', '仕入先を追加');
  setSel('i_売却先', m.売却先, o.売却先||'', '売却先を追加');
  setSel('i_仕入れ担当', m.仕入れる人||m.担当, o.仕入れ担当||'', '仕入れる人を追加');
  setSel('i_リペア担当', m.直す人||m.担当, o.リペア担当||'', 'リペアの人を追加');
  setSel('i_検品者', m.担当, o.検品者||'', '人を追加');
}
function onMaster(kind,id){
  if($(id).value!=='__add') return;
  var what = (id==='i_仕入れ担当') ? '仕入れる人'
           : (id==='i_リペア担当') ? 'リペアの人'
           : (id==='i_検品者') ? '確認する人' : kind;
  var v=(prompt(what+'を追加する','')||'').trim();
  if(!v){ $(id).value=''; return; }
  var job='';
  if(kind==='担当'){
    job = (id==='i_仕入れ担当') ? '仕入れ' : (id==='i_リペア担当' ? 'リペア' : '両方');
  }
  $('load').textContent='追加中'; $('load').classList.add('on');
  call('addMaster',[kind,v,job],function(m){
    DATA.masters=m; $('load').classList.remove('on');
    var lst = (id==='i_仕入れ担当') ? m.仕入れる人
            : (id==='i_リペア担当') ? m.直す人 : m[kind];
    setSel(id, lst, v, what+'を追加');
  },function(e){ $('load').classList.remove('on'); $(id).value=''; alert(e.message); });
}
function box(l,v,c){return '<div class="stat '+c+'"><b class="num">'+v+'</b><span>'+l+'</span></div>';}
var folded = localStorage.getItem('folded')==='1';
function toggleFold(){
  folded = !folded;
  localStorage.setItem('folded', folded?'1':'0');
  applyFold();
}
var viewMode = localStorage.getItem('viewMode')||'card';
function toggleView(){
  viewMode = (viewMode==='card')?'table':'card';
  localStorage.setItem('viewMode', viewMode);
  applyView(); render();
}
function applyView(){
  var b=$('viewBtn'), ic=$('viewIcon');
  if(!b) return;
  b.classList.toggle('on', viewMode==='table');
  ic.innerHTML = (viewMode==='table')
    ? '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/>'
    : '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>';
}

function applyFold(){
  var p=$('panel'), i=$('foldInfo'), b=$('foldBtn'), ic=$('foldIcon');
  if(!p) return;
  p.style.display = folded?'none':'block';
  i.style.display = folded?'block':'none';
  b.classList.toggle('on', folded);
  b.setAttribute('aria-label', folded?'上の表示をひらく':'上の表示を閉じる');
  if(ic) ic.innerHTML = folded ? '<path d="M6 9l6 6 6-6"/>' : '<path d="M18 15l-6-6-6 6"/>';
  if(folded){
    var name = fStatus==='__over' ? '期限すぎ'
      : fStatus==='__need' ? '入力もれ'
      : fStatus==='__who' ? 'みんなの様子'
      : (fStatus ? lb(fStatus) : 'すべて');
    var who=$('fWho').value;
    var sub=[]; if(who) sub.push(who+'が担当');
    i.innerHTML = name + (sub.length?'<span>'+sub.join('・')+'</span>':'');
  }
}

function setActor(){
  if($('actor').value==='__add'){ addPerson('actor'); return; }
  actor=$('actor').value; localStorage.setItem('actor',actor); init();
}
function addPerson(target){
  var v=(prompt('あなたの名前を入れる','')||'').trim();
  if(!v){ if(target==='actor') $('actor').value=actor||''; return; }
  var a=(prompt('どちらの仕事をしますか？\n1 = 仕入れ\n2 = リペア\n3 = 両方','3')||'3').trim();
  var job = a==='1'?'仕入れ':(a==='2'?'リペア':'両方');
  $('load').textContent='追加中'; $('load').classList.add('on');
  call('addMaster',['担当',v,job],function(m){
    DATA.masters=m; $('load').classList.remove('on');
    actor=v; localStorage.setItem('actor',v);
    $('whoPick').classList.remove('on'); init();
  },function(e){ $('load').classList.remove('on'); alert(e.message); });
}
function askWho(){
  var names=(DATA.masters.担当||[]);
  $('whoBtns').innerHTML = names.map(function(n){
    return '<button type="button" onclick="chooseWho(\''+n+'\')">'+n+'</button>';
  }).join('') + '<button type="button" class="p" onclick="addPerson()">名前がないので追加する</button>';
  $('whoPick').classList.add('on');
}
function chooseWho(n){
  actor=n; localStorage.setItem('actor',n);
  $('whoPick').classList.remove('on'); init();
}
/* 仕入れ側（管理者ふくむ）かどうか。リペア専門の人だけが false */
function isAdmin(){ return canMoney(); }
function canMoney(){
  if(DATA.canMoney!==undefined) return !!DATA.canMoney;
  return (DATA.role||'管理者')==='管理者';
}
function canEdit(it){
  if(isAdmin()) return true;
  return !it || !it.リペア担当 || it.リペア担当===actor;
}
function tick(){ $('stamp').textContent='読込中'; load(); }
function stampNow(){
  var d=new Date();
  $('stamp').textContent=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+' 更新';
}
function countNeed(){
  if(isAdmin()&&DATA.stats&&DATA.stats.要入力!==undefined) return DATA.stats.要入力;
  return DATA.items.filter(function(x){return gate(x).length>0;}).length;
}

function overDays(it){
  if(!it.期限日) return null;
  if(it.ステータス!=='作業中'&&it.ステータス!=='要検品') return null;
  return dayDiff(DATA.today,it.期限日);
}

function render(){
  if(fStatus==='__who') return renderWho();
  var who=$('fWho').value;
  var list=DATA.items.filter(function(it){
    if(fStatus==='__over'){ var d=overDays(it); if(d===null||d>=0) return false; }
    else if(fStatus==='__need'){ if(!gate(it).length) return false; }
    else if(fStatus){ if(it.ステータス!==fStatus) return false; }
    else if(it.ステータス==='取消') return false;
    if(who && (it.リペア担当||'未割当')!==who) return false;
    return true;
  });
  if(!list.length){
    $('list').innerHTML='<div class="empty">ここに出る商品はまだありません。<br>'
      +'右下の「商品を登録」から追加できます。</div>';
    return;
  }
  $('list').innerHTML = (viewMode==='table') ? tableHtml(list) : list.map(card).join('');
}

/* 同じ型を過去に何件売ったか */
function soldCount(it){
  var key=String(it.型||it.商品名||'').replace(/\s/g,'');
  if(!key) return 0;
  var n=0;
  DATA.items.forEach(function(x){
    if(x.ステータス!=='売却済') return;
    if(x._row===it._row) return;
    var k=String(x.型||x.商品名||'').replace(/\s/g,'');
    if(!k) return;
    if(x.ブランド&&it.ブランド&&x.ブランド!==it.ブランド) return;
    if(k===key||k.indexOf(key)>=0||key.indexOf(k)>=0) n++;
  });
  return n;
}

/* スプレッドシートのように横に並べて見る */
function tableHtml(list){
  var adm=canMoney();
  var head='<tr><th class="c1">商品</th><th>仕入れた人</th><th>状態</th><th>ランク</th><th>この状態で</th><th>登録から</th><th>リペアの人</th><th>どこにある</th><th>期限</th>'
    +(adm?'<th>仕入れ値</th><th>予想売り値</th><th>予想利益</th><th>実際の売り値</th><th>実際の利益</th><th>実績</th>':'')
    +'<th>直す場所</th></tr>';
  var rows=list.map(function(it){
    var st=it.ステータス||'仕入済';
    var first=(it.写真後&&it.写真後[0])||(it.写真前&&it.写真前[0]);
    var img=first?'<img src="'+thumb(first.id)+'" loading="lazy">'
      :'<div style="width:40px;height:40px;border-radius:6px;background:#efeade"></div>';
    var d=overDays(it);
    var dl = d===null ? '—'
      : (d<0 ? '<span style="color:#bc4529;font-weight:700">'+(-d)+'日すぎ</span>'
             : (d<=1 ? '<span style="color:#a35f05;font-weight:700">あと'+d+'日</span>' : 'あと'+d+'日'));
    var money='';
    if(adm){
      var mk=n0(it.想定売値)-n0(it.仕入値)-n0(it.材料費);
      var mkTxt = it.想定売値
        ? '<span style="color:'+(mk<0?'#bc4529':'#0f6b53')+'">'+yen(mk)+'円</span>' : '—';
      var sold = (it.利益!==''&&it.利益!==null&&it.利益!==undefined);
      var rkTxt = sold
        ? '<span style="color:'+(n0(it.利益)<0?'#bc4529':'#0f6b53')+';font-weight:700">'+yen(it.利益)+'円</span>'
        : '—';
      money='<td class="num">'+(it.仕入値?yen(it.仕入値)+'円':'—')+'</td>'
        +'<td class="num">'+(it.想定売値?yen(it.想定売値)+'円':'—')+'</td>'
        +'<td class="num">'+mkTxt+'</td>'
        +'<td class="num">'+(it.売却額?yen(it.売却額)+'円':'—')+'</td>'
        +'<td class="num">'+rkTxt+'</td>';
      var sc=soldCount(it);
      money+='<td class="num">'+(sc?('<span style="color:#0f6b53;font-weight:700">'+sc+'件</span>'):'はじめて')+'</td>';
    }
    var parts=listOf(it.リペア箇所);
    return '<tr onclick="openSheet('+it._row+')">'
      +'<td class="c1"><div class="cell1">'+img
      +'<div><div class="nm">'+(it.型||it.商品名||'（モデル未設定）')+'</div>'
      +'<div class="id">'+(it.ブランド||'')+'　'+it.ID+'</div></div></div></td>'
      +'<td>'+(it.仕入れ担当
        ? '<span class="chip" style="background:'+teamColor(it.仕入れ担当)+'">'+it.仕入れ担当+'</span>'
        : '—')+'</td>'
      +'<td><span class="chip" style="background:'+(COLOR[st]||'#7d7565')
        +';color:'+(CTEXT[st]||'#fff')+'">'+lb(st)+'</span></td>'
      +'<td class="num">'+(it.状態ランク?String(it.状態ランク).split('　')[0]:'—')+'</td>'
      +'<td class="num">'+stayText(it)+'</td>'
      +'<td class="num">'+ageText(daysSince(it.登録日))+'</td>'
      +'<td>'+(it.リペア担当||'—')+'</td>'
      +'<td>'+(it.所在||'—')+'</td>'
      +'<td>'+dl+'</td>'
      +money
      +'<td>'+(parts.length?parts.join('・'):'—')+'</td>'
      +'</tr>';
  }).join('');
  return '<div class="tblwrap"><table class="tbl">'+head+rows+'</table></div>';
}

function renderWho(){
  var w=DATA.stats.担当別||{}, keys=Object.keys(w);
  if(!keys.length){ $('list').innerHTML='<div class="empty">まだだれも作業していません</div>'; return; }
  $('list').innerHTML=keys.map(function(k){
    var v=w[k];
    return '<div class="wcard"><h4>'+k+'</h4><div>'
      +'いま持っている：直してる '+v.作業中+'件／確認まち '+v.要検品+'件<br>'
      +'今月の完了：'+v.今月完了+'件　報酬 <b class="num">'+yen(v.今月報酬)+'</b>円<br>'
      +'差し戻しの累計：'+v.差戻+'回</div></div>';
  }).join('');
}

function card(it){
  var first=(it.写真後&&it.写真後[0])||(it.写真前&&it.写真前[0]);
  var img=first?'<img class="thumb" src="'+thumb(first.id)+'" loading="lazy">'
    :'<div class="thumb none">写真を<br>とる</div>';
  var st=it.ステータス||'検討中';
  var tags='<span class="chip" style="background:'+(COLOR[st]||'#7d7565')+';color:'+(CTEXT[st]||'#fff')+'">'+lb(st)+'</span>';
  if(it.リペア担当) tags+='<span class="tag">'+it.リペア担当+'</span>';
  if(it.所在&&it.所在!=='自分の手元') tags+='<span class="tag">'+it.所在+'</span>';
  var ss=slotsFor(it), pb=cntFilled(it.写真前,ss);
  if(stageOf(st)>=1) tags+='<span class="tag'+(pb<ss.length?' red':'')+'">前'+pb+'/'+ss.length+'</span>';
  var stay=stayDays(it);
  if(stay!==null){
    var sc=stayColor(stay);
    var st2='この状態で'+(stay===0?'今日':stay+'日')+(stay>=7?' ⚠':'');
    tags+= sc
      ? '<span class="tag" style="background:'+sc+';color:'+stayInk(stay)+';font-weight:800">'+st2+'</span>'
      : '<span class="tag">'+st2+'</span>';
  }
  if(it.状態ランク) tags+='<span class="tag">'+String(it.状態ランク).split('　')[0]+'ランク</span>';
  var pt=listOf(it.リペア箇所);
  if(pt.length) tags+='<span class="tag">'+pt.join('・')+'</span>';
  if(n0(it.差戻回数)) tags+='<span class="tag red">差戻'+it.差戻回数+'</span>';
  var d=overDays(it), over=false;
  if(d!==null){
    if(d<0){ tags+='<span class="tag red">'+(-d)+'日超過</span>'; over=true; }
    else if(d<=1){ tags+='<span class="tag amb">残り'+d+'日</span>'; }
    else { tags+='<span class="tag">残り'+d+'日</span>'; }
  }
  var g=gate(it);
  if(g.length) tags+='<span class="tag red">不足'+g.length+'</span>';
  var m;
  if(!canMoney()){
    m=(listOf(it.リペア箇所).join('・')||'直す場所は未設定');
  }else if(it.利益!==''&&it.利益!==null&&it.利益!==undefined){
    var gap=n0(it.想定売値)>0?n0(it.売却額)-n0(it.想定売値):null;
    m=(n0(it.想定売値)>0?'想定 '+yen(it.想定売値)+' → ':'')
      +'<i>'+yen(it.売却額)+'</i>円'
      +(gap!==null?'（'+(gap>=0?'+':'')+yen(gap)+'）':'')
      +'　利益 <span class="'+(n0(it.利益)<0?'r':'g')+'">'+yen(it.利益)+'</span>円'
      +(n0(it.担当報酬)?'（報酬 '+yen(it.担当報酬)+'）':'');
  }else{
    var mk=n0(it.想定売値)-n0(it.仕入値)-n0(it.材料費);
    m='仕入 <i>'+yen(it.仕入値||0)+'</i>円'+(it.想定売値?'　見込み <span class="'+(mk<0?'r':'g')+'">'+yen(mk)+'</span>円':'');
  }
  var btn='';
  if(it.ステータス==='未割当') btn='<button class="claim" onclick="event.stopPropagation();claim('+it._row+')">この仕事を受ける</button>';
  if(it.ステータス==='要検品'&&actor&&actor!==it.リペア担当)
    btn='<button class="claim" onclick="event.stopPropagation();openSheet('+it._row+')">仕上がりを確認する</button>';
  return '<div class="item'+(over?' over':'')+'" style="border-left-color:'+(COLOR[st]||'#7d7565')+'" onclick="openSheet('+it._row+')">'+img+
    '<div class="body"><div class="brand">'+teamDot(it.仕入れ担当)+(it.ブランド||'ブランド未入力')+'　'+it.ID+'</div>'+
    '<div class="name">'+(it.型||it.商品名||'（モデル未設定）')+'</div>'+
    '<div class="meta">'+tags+'</div><div class="money">'+m+'</div>'+btn+'</div>'
    +'<div class="go">›</div></div>';
}

function claim(row){
  if(!actor){ alert('先に画面上部で「操作している人」を選ぶ'); return; }
  $('load').textContent='引き受け中'; $('load').classList.add('on');
  call('claimItem',[row,actor],function(){
    $('load').classList.remove('on'); load();
  },function(e){ $('load').classList.remove('on'); alert(e.message); });
}

/* ===== 詳細画面 ===== */
function openSheet(row){
  cur = row ? DATA.items.filter(function(i){return i._row===row;})[0] : null;
  $('sTitle').textContent = cur ? cur.ID : '商品を登録';
  $('delBtn').style.display = cur ? 'block' : 'none';
  F.forEach(function(k){
    var el=$('i_'+k); if(!el) return;
    el.value = cur ? (cur[k]===0?0:(cur[k]||'')) : '';
  });
  fillSelects(cur||{});
  if(!cur){
    $('i_ステータス').value='購入済';
    $('i_所在').value='発送中';
    $('i_登録日').value=DATA.today;
    $('i_仕入れ担当').value=actor||'';
  }
  photosB = cur&&cur.写真前 ? cur.写真前.slice() : [];
  photosA = cur&&cur.写真後 ? cur.写真後.slice() : [];
  curParts = cur ? listOf(cur.リペア箇所) : [];
  curCases = cur ? listOf(cur.使用症例) : [];
  onBrand(); drawParts(); showStage(); calc(); updateRec();
  $('moreBox').style.display = $('i_型').value ? 'none' : 'block';
  var show = cur && cur.ステータス==='要検品' && isAdmin();
  $('inspBox').style.display = show?'block':'none';
  $('saveBtn').style.display = canEdit(cur)?'':'none';
  $('delBtn').style.display = (cur&&isAdmin())?'block':'none';
  if(show) $('inspInfo').textContent='作業したのは '+(cur.リペア担当||'不明')
    +'。これまでの差し戻し '+(n0(cur.差戻回数))+'回。';
  $('histBox').style.display = cur ? 'block' : 'none';
  $('hist').innerHTML = cur ? '読み込み中' : '';
  if(cur) call('getHistory',[cur.ID],drawHist,function(){ $('hist').innerHTML=''; });
  $('sheet').classList.add('open'); window.scrollTo(0,0);
}
function closeSheet(){$('sheet').classList.remove('open');}
function onStatus(){ showStage(); updateWarn(); }

function onBrand(){
  var b=$('i_ブランド').value;
  if(b==='__add'){ onMasterBrand(); return; }
  setSel('i_型', typeNames(b), $('i_型').value, 'モデルを登録');
  updateTypeUI(); updateRec(); updateWarn();
}
function onMasterBrand(){
  var v=(prompt('ブランドを追加する','')||'').trim();
  if(!v){ $('i_ブランド').value=''; return; }
  $('load').textContent='追加中'; $('load').classList.add('on');
  call('addMaster',['ブランド',v],function(m){
    DATA.masters=m; $('load').classList.remove('on');
    setSel('i_ブランド', m.ブランド, v, 'ブランドを追加');
    onBrand();
  },function(e){ $('load').classList.remove('on'); $('i_ブランド').value=''; alert(e.message); });
}
function onType(){
  if($('i_型').value==='__add'){ newType(); return; }
  var t=typeOf($('i_ブランド').value,$('i_型').value);
  if(t){
    if(t.ブランド) $('i_ブランド').value=t.ブランド;
    $('i_商品名').value=t.型名;
    if(t.素材) $('i_素材').value=t.素材;
    if(t.目安&&!$('i_想定売値').value) $('i_想定売値').value=t.目安;
  }
  updateTypeUI(); drawSlots(); calc(); updateRec(); updateWarn();
}
function updateTypeUI(){
  var t=typeOf($('i_ブランド').value,$('i_型').value);
  $('typeInfo').textContent=t?('写真'+((t.枠&&t.枠.length)||BEFORE.length)+'枠'):'';
}
function toggleMore(){
  var b=$('moreBox');
  b.style.display = b.style.display==='none' ? 'block' : 'none';
}
function newType(){
  var brand=$('i_ブランド').value;
  if(brand==='__add'||!brand){
    alert('先にブランドを選んでください');
    $('i_型').value=''; return;
  }
  $('tmBrand').textContent=brand+' のモデルを追加します';
  $('tm_name').value='';
  $('tm_price').value='';
  setSel('tm_mat', MAT, $('i_素材').value||'');
  $('typeModal').classList.add('on');
  $('i_型').value='';
}
function closeType(){ $('typeModal').classList.remove('on'); }
function saveType(){
  var brand=$('i_ブランド').value;
  var name=$('tm_name').value.trim();
  if(!name){ alert('モデル名を入れてください'); return; }
  var mat=$('tm_mat').value;
  var price=$('tm_price').value;
  closeType();
  $('load').textContent='型を登録中'; $('load').classList.add('on');
  call('addType',[{ブランド:brand,型名:name,素材:mat,目安:price,枠:''}],function(types){
    DATA.types=types; $('load').classList.remove('on');
    setSel('i_型', typeNames(brand), name, 'モデルを登録');
    onType();
  },function(e){ $('load').classList.remove('on'); alert(e.message); });
}

function showStage(){
  var st=stageOf($('i_ステータス').value);
  if(st<0) st=6;
  var els=document.querySelectorAll('[data-from]');
  for(var i=0;i<els.length;i++){
    els[i].style.display = st>=Number(els[i].getAttribute('data-from'))?'block':'none';
  }
  if(!canMoney()){
    ['grpMoney','grpBuy','grpSell','capBox','recBox'].forEach(function(id){
      var e=$(id); if(e) e.style.display='none';
    });
  }
  drawSlots(); updateWarn();
}

/* ===== リペア箇所とマニュアル ===== */
function drawParts(){
  $('parts').innerHTML=PARTS.map(function(p){
    return '<button type="button" class="pchip'+(curParts.indexOf(p)>=0?' on':'')+'" onclick="togglePart(\''+p+'\')">'+p+'</button>';
  }).join('');
  drawManual();
}
function togglePart(p){
  var i=curParts.indexOf(p);
  if(i<0) curParts.push(p); else curParts.splice(i,1);
  drawParts(); drawSlots(); updateWarn();
}

function casesFor(part){
  if(typeof D==='undefined'||!D) return [];
  var c=PMAP[part]; if(!c) return [];
  var mat=$('i_素材').value;
  var hit=D.filter(function(x){
    return (c.m&&x.m===c.m)||(c.re&&c.re.test(x.p));
  });
  hit.sort(function(a,b){
    var sa=(mat&&a.m===mat?0:(a.m==='共通'?1:2)), sb=(mat&&b.m===mat?0:(b.m==='共通'?1:2));
    return sa-sb;
  });
  return hit.slice(0,8);
}

function drawManual(){
  var w=$('manual');
  if(!curParts.length){ w.innerHTML=''; return; }
  if(typeof D==='undefined'||!D){
    w.innerHTML='<div class="man"><b>直し方</b><div class="hint">マニュアルのデータを読み込めなかった。通信を確認して開き直す。</div></div>';
    return;
  }
  w.innerHTML=curParts.map(function(p){
    var cs=casesFor(p);
    if(!cs.length) return '<div class="man"><b>'+p+'</b><div class="hint">該当する症例がまだない</div></div>';
    return '<div class="man"><b>'+p+'　直し方 '+cs.length+'件</b>'+cs.map(caseHtml).join('')+'</div>';
  }).join('');
}
function caseHtml(x){
  var used=curCases.indexOf(x.id)>=0;
  return '<div class="case'+(used?' used':'')+'" id="c_'+x.id+'">'
    +'<div class="ch" onclick="toggleCase(\''+x.id+'\')">'
    +'<span>'+x.sym+'<small>　'+x.p+'</small></span>'
    +'<small>'+(VMARK[x.v]||x.v)+'</small></div>'
    +'<div class="cb" id="b_'+x.id+'">'
    +(x.b?'<div class="tl">'+x.b+'　'+(x.bs||'')+'</div>':'')
    +'<ol>'+(x.s||[]).map(function(t){return '<li>'+t+'</li>';}).join('')+'</ol>'
    +((x.ng&&x.ng.length)?'<div class="ng">'+x.ng.join('／')+'</div>':'')
    +((x.t&&x.t.length)?'<div class="tl">道具：'+x.t.join('／')+'</div>':'')
    +(x.me?'<div class="tl">'+x.me+'</div>':'')
    +'<button type="button" onclick="useCase(\''+x.id+'\')">'+(used?'使ったのを取り消す':'この手順で直したことにする')+'</button>'
    +'</div></div>';
}
function toggleCase(id){ $('b_'+id).classList.toggle('open'); }
function useCase(id){
  var i=curCases.indexOf(id);
  if(i<0) curCases.push(id); else curCases.splice(i,1);
  drawManual();
  var b=$('b_'+id); if(b) b.classList.add('open');
}

/* ===== 写真 ===== */
function curSlotsB(){ return slotsFor({ブランド:$('i_ブランド').value,型:$('i_型').value}); }
function drawSlots(){
  var ss=curSlotsB();
  $('slotsB').innerHTML=ss.map(function(s){return slotHtml('B',s);}).join('');
  $('cntB').textContent=cntFilled(photosB,ss)+'/'+ss.length;
  $('slotsA').innerHTML=ss.map(function(s){return slotHtml('A',s);}).join('');
  $('cntA').textContent=cntFilled(photosA,ss)+'/'+ss.length;
  $('afterHint').style.display='none';
  $('shootA').style.display='block';
  updateShoot('B'); updateShoot('A');
}
function slotHtml(g,s){
  var p=findP(g==='B'?photosB:photosA,s);
  if(p) return '<div class="slot on"><img src="'+thumb(p.id)+'" onclick="shoot(\''+g+'\',\''+s+'\')">'
    +'<button type="button" class="x" onclick="event.stopPropagation();delP(\''+g+'\',\''+s+'\')">×</button>'
    +'<span>'+s+'</span></div>';
  return '<div class="slot" onclick="shoot(\''+g+'\',\''+s+'\')"><div class="box2">＋</div><span>'+s+'</span></div>';
}
function nextEmpty(g){
  var slots=curSlotsB(), list=g==='B'?photosB:photosA;
  for(var i=0;i<slots.length;i++) if(!findP(list,slots[i])) return slots[i];
  return null;
}
function updateShoot(g){
  var b=$('shoot'+g), n=nextEmpty(g);
  if(n){ b.disabled=false; b.textContent='次：'+n+' を撮る'; b.onclick=function(){shoot(g,n);}; }
  else { b.disabled=true; b.textContent=(g==='B'?'ビフォー':'アフター')+'は全部そろった'; b.onclick=null; }
}
function shoot(g,s){
  if(!cur){
    alert('先に一度保存する。\nブランドと型を入れて保存すると案件番号が付き、\nその番号のフォルダに写真が入るようになる。');
    return;
  }
  pending={g:g,s:s}; $('file').click();
}
function delP(g,s){
  var list=g==='B'?photosB:photosA;
  for(var i=0;i<list.length;i++) if(list[i].s===s){ list.splice(i,1); break; }
  drawSlots(); updateWarn();
}
/* 送る前に長辺1600pxまで縮める。容量が約12分の1になる */
function shrink(file, done){
  var MAX=1600, Q=0.82;
  var img=new Image();
  var url=URL.createObjectURL(file);
  img.onload=function(){
    URL.revokeObjectURL(url);
    var w=img.width, h=img.height;
    var sc=Math.min(1, MAX/Math.max(w,h));
    if(sc>=1 && file.size<600000){
      var fr=new FileReader();
      fr.onload=function(){ done(fr.result.split(',')[1], file.type); };
      fr.readAsDataURL(file);
      return;
    }
    var cv=document.createElement('canvas');
    cv.width=Math.round(w*sc); cv.height=Math.round(h*sc);
    cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
    var d=cv.toDataURL('image/jpeg', Q);
    done(d.split(',')[1], 'image/jpeg');
  };
  img.onerror=function(){
    URL.revokeObjectURL(url);
    var fr=new FileReader();
    fr.onload=function(){ done(fr.result.split(',')[1], file.type); };
    fr.readAsDataURL(file);
  };
  img.src=url;
}

function onPick(input){
  var f=input.files[0]; input.value='';
  if(!f||!pending) return;
  var p=pending;
  $('load').textContent='写真を送信中'; $('load').classList.add('on');
  shrink(f, function(data, mime){
    call('uploadPhoto',[{mime:mime,data:data,
      itemId:(cur?cur.ID:''), slot:p.s}],function(id){
      var list=p.g==='B'?photosB:photosA, ex=findP(list,p.s);
      if(ex) ex.id=id; else list.push({s:p.s,id:id});
      $('load').classList.remove('on'); drawSlots(); updateWarn();
    },function(e){
      $('load').classList.remove('on'); alert('写真を送れなかった：'+e.message);
    });
  });
}

/* ===== 計算と警告 ===== */
function formObj(){
  var o={};
  F.forEach(function(k){ var el=$('i_'+k); if(el) o[k]=el.value; });
  if(o.型 && !o.商品名) o.商品名=o.型;
  o.リペア箇所=curParts.join(','); o.使用症例=curCases.join(',');
  o.写真前=photosB; o.写真後=photosA;
  return o;
}
var NEXT={
  '購入済':{to:'仕入済', label:'商品が届いた'},
  '仕入済':{to:'未割当', label:'リペアに回す'},
  '未割当':{to:'作業中', label:'自分がリペアする', claim:true},
  '作業中':{to:'要検品', label:'リペアが終わった'},
  '要検品':{to:'出品中', label:'確認してOKを出す', admin:true},
  '出品中':{to:'売却済', label:'売れた'},
  '査定中':{to:'売却済', label:'この金額で売る'},
  '返送待ち':{to:'出品中', label:'手元に戻った'},
  '保留' :{to:'作業中', label:'リペアを再開する'}
};
/* いま何をすればいいか */
var TODO={
  '購入済':'買った記録だけ入れておく。商品が届いたらボタンを押す',
  '仕入済':'直す前の写真を12枚とって、どこを直すかを選び、リペアの人を決める',
  '未割当':'自分がやるなら受ける。受けると期限が付く',
  '作業中':'リペアして、直したあとの写真を12枚とる（直す前と同じ場所）',
  '要検品':'仕上がりを見て、OKを出すか、もう一度直してもらう',
  '出品中':'メルカリなどに出す。売れたら値段を入れる。業者に送るなら下のボタン',
  '査定中':'業者から金額が出たら入れる。安ければ返してもらう',
  '返送待ち':'商品が戻ってきたら押す。また売りに出せる',
  '保留':'再開するなら押す',
  '売却済':'完了。なにもしなくていい'
};
/* ほかの進め方。次へボタンの下に出す */
var ALT={
  '出品中':[{to:'査定中', label:'買取業者に送った'}],
  '査定中':[{to:'返送待ち', label:'金額が安いので返してもらう'}],
  '返送待ち':[{to:'出品中', label:'戻ってきた。別のところで売る'}]
};
var PREV={'仕入済':'購入済','未割当':'仕入済','査定中':'出品中','返送待ち':'査定中','作業中':'未割当','要検品':'作業中','出品中':'要検品','売却済':'出品中'};

function toggleStatus(){
  var b=$('stBox'); b.style.display = b.style.display==='none'?'block':'none';
}

function updateWarn(){
  var o=formObj(), st=o.ステータス||'検討中';
  $('nowSt').textContent=lb(st);
  var stayD=cur?daysSince(cur.状態変更日||cur.更新日||cur.登録日):null;
  var ageD=cur?daysSince(cur.登録日):null;
  $('nowHelp').innerHTML=(HELP[st]||'')
    +(cur?('<br>この状態になって '+ageText(stayD)+'　／　登録から '+ageText(ageD)):'');
  var pr=cur&&cur.利益!==''&&cur.利益!==null&&cur.利益!==undefined;
  $('profitNow').textContent = (pr&&canMoney()) ? ('この商品の利益 '+yen(cur.利益)+'円') : '';

  drawSteps(st);
  var tb=$('todoBox');
  if(cur && TODO[st]){
    tb.style.display='block';
    tb.innerHTML='<b>次の手順</b>'+TODO[st];
  }else{
    tb.style.display='none';
  }
  var nx=NEXT[st], b=$('nextBtn'), nl=$('needList');
  if(!cur){
    b.style.display='flex'; b.disabled=false;
    b.style.background='#0f6b53'; b.style.color='#fff';
    b.innerHTML='<span class="lbl">この商品を登録する</span>';
    nl.innerHTML='<div class="nd">買った記録をここで残します。'
      +'商品が届いたら、この画面から写真が撮れるようになります</div>';
    return;
  }
  if(!nx){ b.style.display='none'; nl.innerHTML='<div class="nd">この商品は完了しています</div>'; return; }
  if(nx.admin && !isAdmin()){
    b.style.display='none';
    nl.innerHTML='<div class="nd">確認まちです。OKが出るまで待ってください</div>';
    return;
  }
  var probe={}; Object.keys(o).forEach(function(k){probe[k]=o[k];});
  probe.ステータス=nx.to;
  var miss=gate(probe);
  b.style.display='flex';
  b.style.background=COLOR[nx.to]||'#0f6b53';
  b.style.color=CTEXT[nx.to]||'#fff';
  b.innerHTML='<span class="lbl">'+nx.label+'</span>'
    +'<span class="flow">'+lb(st)+' → '+lb(nx.to)+'</span>';
  b.disabled=miss.length>0;
  nl.innerHTML = miss.length
    ? '<div class="nd hd">あと'+miss.length+'つで次に進めます</div>'
      +miss.map(function(x){return '<div class="nd ng">・'+x+'</div>';}).join('')
    : '<div class="nd">押すと「'+lb(nx.to)+'」に進みます</div>';
  drawAlt(st);
}

/* 流れのどこにいるかを並べて出す */
var FLOW=['購入済','仕入済','未割当','作業中','要検品','出品中','売却済'];
function drawSteps(st){
  var box=$('steps'); if(!box) return;
  var order=FLOW.slice();
  if(order.indexOf(st)<0 && st) order.splice(order.length-1,0,st);
  var at=order.indexOf(st);
  box.innerHTML = order.map(function(x,i){
    var cls = (x===st) ? 'on' : (i<at ? 'done' : '');
    var style = (x===st) ? ' style="background:'+(COLOR[x]||'#7d7565')+';color:'+(CTEXT[x]||'#fff')+'"' : '';
    return (i?'<u>›</u>':'')+'<i class="'+cls+'"'+style+'>'+lb(x)+'</i>';
  }).join('');
}

function drawAlt(st){
  var box=$('altBtns'); if(!box) return;
  var list=(cur && ALT[st]) ? ALT[st] : [];
  box.innerHTML = list.map(function(a,i){
    return '<button type="button" class="altb" onclick="goAlt('+i+')">'
      +a.label+'　<span style="font-size:11px;color:var(--sub)">→ '+lb(a.to)+'</span></button>';
  }).join('');
}
function goAlt(i){
  var st=$('i_ステータス').value, a=(ALT[st]||[])[i];
  if(!a) return;
  $('i_ステータス').value=a.to;
  if(a.to==='査定中') $('i_所在').value='買取業者にある';
  if(a.to==='返送待ち') $('i_所在').value='発送中';
  if(a.to==='出品中' && st==='返送待ち') $('i_所在').value='自分の手元';
  showStage(); save();
}

function goNext(){
  var o=formObj(), st=o.ステータス||'検討中';
  if(!cur){ save(); return; }
  var nx=NEXT[st]; if(!nx) return;
  if(nx.claim){ claim(cur._row); return; }
  if(nx.admin){ pass(); return; }
  $('i_ステータス').value=nx.to;
  showStage(); save();
}
function goBack(){
  var st=$('i_ステータス').value, p=PREV[st];
  if(!p) return;
  if(!confirm('「'+lb(p)+'」に戻す。')) return;
  $('i_ステータス').value=p;
  showStage(); save();
}

var recCache={};
function updateRec(){
  var b=$('recBox');
  if(!canMoney()){ b.style.display='none'; capFrom(null); return; }
  var brand=$('i_ブランド').value, type=$('i_型').value, name=$('i_商品名').value;
  if(!brand&&!name){ b.style.display='none'; capFrom(null); return; }
  var key=brand+'|'+type+'|'+name;
  if(recCache[key]){ drawRec(recCache[key]); return; }
  call('findSimilar',[brand,type,name,cur?cur.ID:''],function(list){
    recCache[key]=list||[]; drawRec(recCache[key]);
  },function(){ $('recBox').style.display='none'; });
}
function drawRec(list){
  var b=$('recBox');
  if(!list.length){ b.style.display='none'; capFrom(null); return; }
  var vals=list.map(function(x){return n0(x.売却額);});
  var sum=0; vals.forEach(function(v){sum+=v;});
  var avg=Math.round(sum/vals.length);
  var lo=Math.min.apply(null,vals), hi=Math.max.apply(null,vals);
  b.style.display='block';
  b.innerHTML='この型はこれまで <b class="num">'+list.length+'</b> 件売れています　平均 <b class="num">'+yen(avg)+'</b>円'
    +'<ul>'+list.slice(0,3).map(function(x){
        return '<li>'+(x.売却日||'')+'　'+yen(x.売却額)+'円（仕入 '+yen(x.仕入値)+'／利益 '+yen(x.利益)+'）</li>';
      }).join('')+'</ul>'
    +'<div style="margin-top:5px;color:var(--sub);font-size:12px">最安 '+yen(lo)+'円／最高 '+yen(hi)+'円</div>'
    +'<button type="button" onclick="useAvg('+avg+')">この平均を入れる</button>';
  capFrom(avg);
}
function capFrom(avg){
  if(!canMoney()){ $('capBox').style.display='none'; return; }
  var base=n0($('i_想定売値').value)||avg||0, b=$('capBox');
  if(!base){ b.style.display='none'; return; }
  var rate=n0(DATA.config.目標利益率)||40;
  var cap=Math.round(base*(1-rate/100))-n0($('i_材料費').value);
  b.style.display='block';
  b.innerHTML='目標利益率 '+rate+'% なら、仕入上限は <b class="num">'+yen(cap)+'</b>円'
    +'円まで<div style="font-size:12px;margin-top:2px">直した人の取り分は、この利益から払います</div>';
}
function useAvg(v){ $('i_想定売値').value=v; calc(); updateWarn(); }

function calc(){
  var g=function(id){return n0($('i_'+id).value);};
  var mk=g('想定売値')-g('仕入値')-g('材料費');
  $('mikomi').textContent = $('i_想定売値').value ? yen(mk)+'円' : '—';
  $('mikomi').style.color = mk<0?'#b4472e':'#2f5d50';
  capFrom(null);
  if($('i_売却額').value){
    var before=g('売却額')-g('仕入値')-g('材料費')-g('手数料')-g('送料');
    var rw=$('i_リペア担当').value ? reward(before) : 0;
    $('hosyu').textContent=yen(rw)+'円';
    $('rieki').textContent=yen(before-rw)+'円';
    $('rieki').style.color = (before-rw)<0?'#b4472e':'#2f5d50';
  }else{
    $('hosyu').textContent='—';
    $('rieki').textContent='—'; $('rieki').style.color='#1d1d1a';
  }
}
function reward(before){
  var c=DATA.config;
  if(c.報酬方式==='固定') return Math.round(n0(c.報酬値));
  var r=Math.round(before*n0(c.報酬値)/100);
  return r>0?r:0;
}

/* ===== 検品 ===== */
function pass(){
  if(!cur) return;
  if(!confirm('合格にして出品中に進める。'+(cur.リペア担当||'')+'の作業として記録される。')) return;
  $('load').textContent='更新中'; $('load').classList.add('on');
  call('inspectPass',[cur._row,actor],function(){
    $('load').classList.remove('on'); closeSheet(); load();
  },function(e){ $('load').classList.remove('on'); alert(e.message); });
}
function reject(){
  if(!cur) return;
  var list=DATA.reject;
  var msg='差し戻す理由を番号で入れる\n'+list.map(function(r,i){return (i+1)+'. '+r;}).join('\n');
  var a=prompt(msg,'1');
  var i=parseInt(a,10);
  if(!i||i<1||i>list.length) return;
  var note=prompt('補足があれば（無ければ空のままOK）','')||'';
  $('load').textContent='更新中'; $('load').classList.add('on');
  call('inspectReject',[cur._row,actor,list[i-1],note],function(){
    $('load').classList.remove('on'); closeSheet(); load();
  },function(e){ $('load').classList.remove('on'); alert(e.message); });
}

/* ===== 履歴・保存 ===== */
function drawHist(rows){
  $('hist').innerHTML = rows.length
    ? rows.map(function(r){
        return '<div class="log"><span>'+r.日時+(r.操作者?'　'+r.操作者:'')+'</span>'+r.内容+'</div>';
      }).join('')
    : '<div class="log" style="color:#6f6858">まだ記録はありません</div>';
}
function addNote(){
  var t=$('noteText').value.trim();
  if(!t||!cur) return;
  $('noteText').value='';
  call('addNote',[cur.ID, cur.商品名, actor, t],function(){
    call('getHistory',[cur.ID],drawHist);
  });
}

function joinP(a){return (a||[]).map(function(p){return p.s+':'+p.id;}).join(',');}
function patchOf(o){
  if(!cur) return o;
  var p={_row:cur._row};
  Object.keys(o).forEach(function(k){
    var isP = (k==='写真前'||k==='写真後');
    var a = isP ? joinP(cur[k]) : (cur[k]===0?'0':String(cur[k]===undefined||cur[k]===null?'':cur[k]));
    var b = isP ? joinP(o[k])   : (o[k]===0?'0':String(o[k]===undefined||o[k]===null?'':o[k]));
    if(a!==b) p[k]=o[k];
  });
  return p;
}

function save(){
  var o=formObj();
  var g=gate(o);
  if(g.length){
    alert('「'+lb(o.ステータス)+'」にするには、あと'+g.length+'つ。\n\n・'+g.join('\n・'));
    return;
  }
  var payload = cur ? patchOf(o) : o;
  if(cur && Object.keys(payload).length===1){ closeSheet(); return; }
  $('load').textContent='保存中'; $('load').classList.add('on');
  call('saveItem',[payload,actor],function(){
    $('load').classList.remove('on'); closeSheet(); load();
  },function(e){ $('load').classList.remove('on'); alert('保存できなかった：'+e.message); });
}

function cancelIt(){
  if(!cur||!confirm(cur.ID+' を一覧から外す。データはシートに残る。')) return;
  $('load').textContent='更新中'; $('load').classList.add('on');
  call('cancelItem',[cur._row,actor],function(){
    $('load').classList.remove('on'); closeSheet(); load();
  });
}

/* リペアマニュアルの症例データは後から裏で読む。
   取れなくても本体は動く。jsDelivrが駄目ならGitHubから読み直す */
function loadManual(src, next){
  var el=document.createElement('script');
  el.src=src;
  el.onload=function(){ if($('sheet').classList.contains('open')) drawManual(); };
  el.onerror=function(){ if(next) loadManual(next); };
  document.head.appendChild(el);
}
setTimeout(function(){
  loadManual(
    'https://cdn.jsdelivr.net/gh/toasovieunei888-bot/finbook-assets@main/repair-daicho-v21-data.js',
    'https://raw.githubusercontent.com/toasovieunei888-bot/finbook-assets/main/repair-daicho-v21-data.js'
  );
}, 800);

$('form').addEventListener('input', updateWarn);
$('form').addEventListener('change', function(){ updateWarn(); updateRec(); drawManual(); });
$('fWho').onchange=render;
function start(){ load(); }
openGate();
