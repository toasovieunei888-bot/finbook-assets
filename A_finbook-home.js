(function(){if(!document.querySelector('meta[name="viewport"]')){var m=document.createElement('meta');m.name='viewport';m.content='width=device-width,initial-scale=1,viewport-fit=cover';document.head.appendChild(m);}})();
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var OWL="https://cdn.prod.website-files.com/69bcd664c814f802dfc1f9bc/69d8deb5900a43804580bd24_%E5%AE%98%E5%BA%81%E3%80%80%E7%B4%94%E7%99%BD.jpg";
var MS=[[7,10],[14,30],[30,100],[90,500],[365,3000]];

function showScr(k){
  document.querySelectorAll('#fbapp .screen').forEach(function(s){s.classList.remove('on');});
  var s=document.getElementById('scr-'+k);if(s)s.classList.add('on');
  if(k==='coupon'){var f=document.getElementById('cpFrame');if(f&&!f.src)f.src=f.getAttribute('data-src')+'?v='+Date.now();}
  var nk=(k==='repair')?'learn':k;
  document.querySelectorAll('#fbapp .nv').forEach(function(x){x.classList.toggle('on',x.dataset.scr===nk);});
  window.scrollTo({top:0});
}
document.querySelectorAll('#fbapp .nv[data-scr]').forEach(function(b){b.addEventListener('click',function(){showScr(b.dataset.scr);});});
document.querySelectorAll('#fbapp .subtab[data-sub]').forEach(function(b){b.addEventListener('click',function(){
  document.querySelectorAll('#fbapp .subtab[data-sub]').forEach(function(x){x.classList.remove('on');});
  b.classList.add('on');
  document.getElementById('subA').style.display=b.dataset.sub==='a'?'grid':'none';
  document.getElementById('subB').style.display=b.dataset.sub==='b'?'grid':'none';
});});

/* 画面内ジャンプ（外部リンクを開かずタブ切替と同じ動き） */
document.querySelectorAll('#fbapp [data-goto]').forEach(function(b){b.addEventListener('click',function(e){
  e.preventDefault();showScr(b.dataset.goto);
});});

/* リペア画面のツール／動画タブ */
document.querySelectorAll('#fbapp .rp-tab').forEach(function(b){b.addEventListener('click',function(){
  document.querySelectorAll('#fbapp .rp-tab').forEach(function(x){x.classList.remove('on');});
  b.classList.add('on');
  document.querySelectorAll('#fbapp .rp-pane').forEach(function(p){p.classList.remove('on');});
  document.getElementById('rp-'+b.dataset.pane).classList.add('on');
  window.scrollTo({top:0});
});});

function fbPlayIntro(){
  var m=document.getElementById('introMini'),b=document.getElementById('introBox');
  if(!b)return;if(m)m.style.display='none';b.style.display='block';
  b.innerHTML='<div style="position:relative;width:100%;padding-top:56.25%;background:#000"><iframe src="https://player.vimeo.com/video/1191022961?autoplay=1&title=0&byline=0&portrait=0&badge=0&dnt=1" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>';
}
function sheet(id,o,c){
  var v=document.getElementById(id),ob=document.getElementById(o),cb=document.getElementById(c);
  if(ob)ob.addEventListener('click',function(){v.classList.add('on');});
  if(cb)cb.addEventListener('click',function(){v.classList.remove('on');});
  if(v)v.addEventListener('click',function(e){if(e.target===v)v.classList.remove('on');});
}
sheet('nwSheet','nwOpen','nwClose');
sheet('smSheet','smOpen','smClose');
sheet('pmSheet','pmOpen','pmClose');
sheet('pmSheet','pmOpen2','pmClose');

function fbRain(n){
  var L=document.getElementById('fxLayer');if(!L||RM)return;
  var f=['🪙','🪙','✨','🪙','🎉','⭐'];
  for(var i=0;i<(n||18);i++){var s=document.createElement('span');
    s.textContent=f[i%f.length];s.style.left=Math.random()*100+'%';
    s.style.fontSize=(15+Math.random()*15)+'px';s.style.animationDelay=(Math.random()*.5)+'s';
    s.style.animationDuration=(1.7+Math.random()*1.3)+'s';L.appendChild(s);}
  setTimeout(function(){L.innerHTML='';},3400);
}
function fbToast(m,ms){var t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('on');setTimeout(function(){t.classList.remove('on');},ms||2600);}

function drawStreak(sk){
  sk=sk||0;
  var wp=sk<=0?0:(((sk-1)%7)+1),nx=null,cn=0;
  for(var i=0;i<MS.length;i++){if(sk<MS[i][0]){nx=MS[i][0];cn=MS[i][1];break;}}
  document.getElementById('stkDays').textContent=sk;
  document.getElementById('stkNext').textContent=nx?('あと'+(nx-sk)+'日で '+cn+'コイン 🎁'):'全特典 達成 🏆';
  var row=document.getElementById('stampRow');row.innerHTML='';
  for(var n=1;n<=7;n++){var d=document.createElement('div');d.className='st';
    if(n<=wp){d.className='st done'+(n===wp?' today':'');d.innerHTML='<img src="'+OWL+'" alt="">';}
    else d.textContent=n;row.appendChild(d);}
  try{var td=new Date(Date.now()+324e5),key='fbstfx'+td.getUTCFullYear()+(td.getUTCMonth()+1)+td.getUTCDate();
    if(sk>0&&!sessionStorage.getItem(key)){sessionStorage.setItem(key,'1');
      var t=row.querySelector('.st.today');if(t&&!RM)setTimeout(function(){t.className+=' pressed';},420);
      for(var q=0;q<MS.length;q++){if(sk===MS[q][0]){(function(c){setTimeout(function(){fbRain(24);fbToast('🎉 '+sk+'日達成！ +'+c+'コイン');},700);})(MS[q][1]);break;}}}
  }catch(e){}
  var p=nx?Math.min(100,Math.round(sk/nx*100)):100;
  setTimeout(function(){document.getElementById('stkFill').style.width=p+'%';},250);
}
function drawMs(sk,claimed){
  var cl={},cr=''+(claimed||'');
  if(cr.indexOf(',')>=0){cr.split(',').forEach(function(x){var n=parseInt(x,10);if(n)cl[n]=1;});}
  else{var cm=parseInt(cr,10)||0;MS.forEach(function(p){if(p[0]<=cm)cl[p[0]]=1;});}
  var d=document.getElementById('smDays');if(d)d.textContent=sk;
  var sb=document.getElementById('smStamps');
  if(sb){
    var wp=sk<=0?0:(((sk-1)%7)+1);
    sb.innerHTML='';
    for(var n=1;n<=7;n++){
      var w=document.createElement('div');w.className='sm-st';
      var lab=(n===wp)?'今日':(n+'日');
      if(n<=wp){w.className='sm-st done'+(n===wp?' today':'');w.innerHTML='<span class="c"><img src="'+OWL+'" alt=""></span><span class="d">'+lab+'</span>';}
      else{w.innerHTML='<span class="c">'+n+'</span><span class="d">'+n+'日</span>';}
      sb.appendChild(w);
    }
    if(!RM){
      var done=sb.querySelectorAll('.sm-st.done');
      done.forEach(function(el,i){setTimeout(function(){el.classList.add('pop');},260+i*180);});
    }
  }
  var nx=null,nc=0;for(var i=0;i<MS.length;i++){if(sk<MS[i][0]){nx=MS[i][0];nc=MS[i][1];break;}}
  var ne=document.getElementById('smNext');
  if(ne)ne.textContent=nx?('あと'+(nx-sk)+'日で +'+nc+'コイン 🎁'):'全特典 達成 🏆';
  var box=document.getElementById('smRows');if(!box)return;var set=false;
  box.innerHTML=MS.map(function(p){
    var dn=cl[p[0]],isn=(!dn&&!set&&sk<p[0]);if(isn)set=true;
    return '<div class="sm-row'+(dn?' done':'')+(isn?' next':'')+'"><span class="b">'+(dn?'✓':p[0])+'</span><span class="l">'+p[0]+'日達成'+(p[0]>=30?' + 称号':'')+'</span><span class="c">'+(dn?'獲得済み':'+'+p[1]+' Coin')+'</span></div>';
  }).join('');
}
var RANKS=[['ビギナー',0,'📖',0],['ルーキー',30,'📗',10],['アマチュア',60,'📘',30],['レギュラー',90,'📙',50],['ベテラン',120,'📕',100],['エキスパート',150,'🏆',200],['マスター',180,'👑',300],['レジェンド',240,'⭐',500]];
function drawRank(cf){
  function gv(){for(var i=0;i<arguments.length;i++){if(cf[arguments[i]]!=null&&cf[arguments[i]]!=='')return cf[arguments[i]];}return '';}
  var cur=(''+(gv('current_rank','current-rank')||'ビギナー')).trim()||'ビギナー';
  var vp=parseInt(gv('video-points','video_points','Video Points')||0)||0;
  var wr=''+gv('video-watch-count','video_watch_count','Video Watch Count');
  var wc=wr?wr.split(',').filter(function(x){return x.trim();}).length:0;
  var rem=parseInt(gv('next_rank_remaining','next-rank-remaining')||0)||0;
  var ci=0;for(var i=0;i<RANKS.length;i++){if(RANKS[i][0]===cur){ci=i;break;}}
  document.getElementById('rkBadge').textContent=RANKS[ci][2]+' '+cur;
  document.getElementById('rkMeta').innerHTML='<b>'+vp+'pt</b>・'+wc+'/18本 視聴';
  var gm=document.getElementById('rkGoal'),rs=document.getElementById('rkRest'),pc=document.getElementById('rkPct'),fl=document.getElementById('rkFill');
  if(ci<RANKS.length-1){
    var nx=RANKS[ci+1],sp=nx[1]-RANKS[ci][1],dn=sp-rem;
    var p=sp>0?Math.max(0,Math.min(100,Math.round(dn/sp*100))):0;
    gm.innerHTML=nx[0]+'到達で <b>'+nx[3]+'コイン</b> 🪙';
    setTimeout(function(){fl.style.width=p+'%';},250);
    rs.textContent='あと'+rem+'pt';pc.textContent=p+'%';
  }else{gm.innerHTML='<b>最高ランク達成 🏆</b>';fl.style.width='100%';rs.textContent='コンプリート';pc.textContent='100%';}
}
function setupName(cf){
  var inp=document.getElementById('pmName'),sv=document.getElementById('pmSave'),nt=document.getElementById('pmNote');
  if(!inp)return;
  var lk=(''+(cf['name-locked']||'')).toLowerCase();
  if(lk==='true'||lk==='1'||cf['name-locked']===true){
    inp.setAttribute('readonly','readonly');inp.style.background='#F1EADB';inp.style.cursor='not-allowed';
    nt.textContent='※表示名は一度設定すると変更できません（アイコンはいつでも変更できます）';sv.style.display='none';
  }else{
    nt.textContent='※表示名は一度保存すると二度と変更できません。慎重に決めてください（アイコンは後からいつでも変更OK）';
    sv.addEventListener('click',function(){
      var v=(inp.value||'').trim();if(!v)return;
      if(window.$memberstackDom&&window.$memberstackDom.updateMember){
        window.$memberstackDom.updateMember({customFields:{'first-name':v,'name-locked':'true'}}).then(function(){
          fbRain(14);fbToast('✨ 表示名を設定しました');setTimeout(function(){location.reload();},1400);}).catch(function(){});
      }});
  }
}
function setCoins(n){var s=n.toLocaleString();
  document.getElementById('hdrCoin').textContent=s;
  document.getElementById('hdrCoinYen').textContent=s+'円分';
  document.getElementById('coinBig').textContent=s;
  document.getElementById('coinBigYen').textContent=s;}

(function(){
  var D=[{icon:"🎬",text:"動画『物販の仕組み』を追加しました",date:"今日"},{icon:"🎉",text:"新しい仲間が入館しました",date:"今日"},{icon:"🪙",text:"コイン交換に新アイテムが登場しました",date:"昨日"}];
  var N=(window.FB_NEWS&&window.FB_NEWS.length)?window.FB_NEWS:D;
  document.getElementById('nwBadge').textContent=N.length;
  document.getElementById('nwList').innerHTML=N.map(function(n){
    return '<div class="nm-item"><span class="ic">'+n.icon+'</span><div><div class="tx">'+n.text+'</div><div class="dt">'+(n.date||'')+'</div></div></div>';}).join('');
})();
setCoins(0);drawStreak(1);drawMs(1,'');
function autoStamp(){
  try{var td=new Date(Date.now()+324e5),k='fbsmauto'+td.getUTCFullYear()+(td.getUTCMonth()+1)+td.getUTCDate();
    if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1');
    setTimeout(function(){var v=document.getElementById('smSheet');if(v){v.classList.add('on');drawMs(window._fbsk||0,window._fbcl||'');}},700);
  }catch(e){}
}

(function(){
  function sfx(id){var s=""+(id||""),h=5381,i;for(i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))>>>0;}return("000"+(h%10000)).slice(-4);}
  function boot(t){t=t||0;
    if(!window.$memberstackDom){if(t<25)setTimeout(function(){boot(t+1);},150);return;}
    window.$memberstackDom.getCurrentMember({useCache:false}).then(function(m){
      var d=(m&&m.data)||{},cf=d.customFields||{};
      var fn=(cf["first-name"]||"").trim(),nm=fn?(fn+"#"+sfx(d.id)):"";
      if(nm)document.querySelectorAll('#fbapp [data-ms-member="first-name"],#fbapp [data-ms-member="mile-name"]').forEach(function(e){e.textContent=nm;});
      setCoins(parseInt((""+(cf["coins"]||0)).replace(/[^0-9]/g,""))||0);
      var mi=parseInt(cf["miles"],10)||0;
      document.querySelectorAll('#fbapp [data-ms-member="miles"]').forEach(function(e){e.textContent=mi.toLocaleString();});
      var pi=d.profileImage||cf["profile-image"];
      if(pi)document.querySelectorAll('#fbapp [data-ms-member="profile-image"]').forEach(function(e){e.src=pi;});
      var inp=document.getElementById('pmName');if(inp&&fn)inp.value=fn;
      drawRank(cf);setupName(cf);
      var sk=parseInt(cf["streak-days"],10)||0;
      window._fbsk=sk;window._fbcl=cf["streak-milestones-claimed"];
      drawStreak(sk);drawMs(sk,cf["streak-milestones-claimed"]);autoStamp();
    }).catch(function(){});
  }
  boot();
})();

(function(){
  var U="https://finbook-redirect.toasovie-unei888.workers.dev/ranking";
  var el=document.querySelector('#fbapp .mile-list');if(!el)return;
  function esc(s){return(""+(s==null?"":s)).replace(/[<>&"]/g,function(c){return{"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c];});}
  function sfx(id){var s=""+(id||""),h=5381,i;for(i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))>>>0;}return("000"+(h%10000)).slice(-4);}
  fetch(U,{cache:"no-store"}).then(function(r){return r.json();}).then(function(data){
    var ms=(data&&data.members)||[];
    var rk=ms.map(function(m){var cf=m.customFields||{};var b=(cf["first-name"]||cf["mile-name"]||"").trim()||"メンバー";
      return{nm:b+"#"+sfx(m.id),mi:Number(cf.miles||0),img:m.profileImage||cf["profile-image"]||null};})
      .filter(function(x){return x.mi>0;}).sort(function(a,b){return b.mi-a.mi;}).slice(0,5);
    if(!rk.length)return;
    el.innerHTML=rk.map(function(r,i){
      var no=i+1,cls=no<=3?' t'+no:'';
      var av=r.img?'<img src="'+esc(r.img)+'" alt="">':esc(r.nm.charAt(0));
      return '<div class="mrow'+cls+'"><span class="no">'+no+'</span><span class="av">'+av+'</span><span class="nm">'+esc(r.nm)+'</span><span class="amt">'+r.mi.toLocaleString()+'<small> マイル</small></span></div>';
    }).join('');
  }).catch(function(){});
})();
