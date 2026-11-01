/*! F_poikatsu.js  ポイ活の画面（説明→今日やること→STEP）会員ホーム組み込み版／今のポイ活画面と置き換え
    置き場所: toasovieunei888-bot/finbook-assets 直下（同じ名前で上書き）
    purge: https://purge.jsdelivr.net/gh/toasovieunei888-bot/finbook-assets@main/F_poikatsu.js
*/
(function(){
var CSS="#pk2{\n  --bg:#EAF5FD; --card:#FFFFFF; --ink:#1B2733; --ink2:#4A5866; --line:#D3E3F0;\n  --sky:#1E6FB8; --skysoft:#E1EEF9; --skydeep:#15558E;\n  --grass:#1E7A46; --grasssoft:#E0F2E7; --grassdeep:#145531;\n  --moppy:#C2410C; --moppysoft:#FFEADB; --moppydeep:#8F2F08;\n  --warn:#9A5B00; --warnsoft:#FFF1DC;\n  --c1:#C94A0A; --c1s:#FFE8D6; --c2:#1E7A46; --c2s:#E0F2E7; --c3:#C2255C; --c3s:#FCE4EE; --c4:#1E6FB8; --c4s:#E1EEF9; --c5:#6741D9; --c5s:#EEE8FD;\n  --hero:#FFC94D; --heroink:#3A2400;\n  --accent:#C8641A; --wood:#8B5E3C; --wooddeep:#6B4429; --cream:#FFF6E5; --hill:#8FD07A; --hill2:#6BB85A; --skytop:#BFE3FA;\n  --fd:'M PLUS Rounded 1c',system-ui,sans-serif;\n  --fb:'Noto Sans JP','Hiragino Sans',system-ui,sans-serif;\n}#pk2 *{box-sizing:border-box}#pk2,#pk2{background:var(--bg)}#pk2{color:var(--ink);font-family:var(--fb);font-size:14px;line-height:1.55}#pk2 .wrap{max-width:640px;margin:0 auto;padding-block:14px 96px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:14px}#pk2 button{font-family:inherit}#pk2 .goal{background:var(--card);color:var(--ink);border:1.5px solid var(--line);border-radius:22px;padding:16px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;align-items:center}#pk2 .goal .k{font:800 13px var(--fd);grid-column:1/-1}#pk2 .goal .big{font:800 34px/1.15 var(--fd);color:var(--grass);font-variant-numeric:tabular-nums}#pk2 .goal .big small{font-size:16px}#pk2 .ring{width:64px;height:64px;grid-row:2/4;grid-column:2}#pk2 .ring circle{fill:none;stroke-width:7}#pk2 .ring .bgc{stroke:var(--bg)}#pk2 .ring .fgc{stroke:var(--c2);stroke-linecap:round;transition:stroke-dashoffset .3s}#pk2 .ring text{font:800 17px var(--fd);fill:var(--ink)}#pk2 .ring .rl{font:700 9px var(--fb);fill:var(--ink2)}#pk2 .goal .sub{font-size:13px;font-weight:700;color:var(--ink2)}#pk2 .steps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);padding-block:6px}#pk2 .st{border:2px solid var(--line);background:var(--card);border-radius:14px;padding:6px 2px;display:flex;flex-direction:column;align-items:center;gap:0;cursor:pointer;min-height:56px;color:var(--ink2)}#pk2 .st svg{width:22px;height:22px}#pk2 .st span{font:800 13px var(--fd);line-height:1.3;text-align:center}#pk2 .st small{font-size:10.5px;font-weight:700;font-variant-numeric:tabular-nums}#pk2 .st[aria-selected=\"true\"]{border-color:var(--sc);background:var(--sc);color:var(--card)}#pk2 .st[aria-selected=\"true\"] svg{color:var(--card)}#pk2 .st .sb{font:800 10.5px var(--fd);letter-spacing:.04em}#pk2 .st.clear:not([aria-selected=\"true\"]) small{color:var(--grass)}#pk2 .st:focus-visible,#pk2 .row-h:focus-visible,#pk2 .dot:focus-visible,#pk2 .btn:focus-visible,#pk2 .gchip:focus-visible{outline:3px solid var(--sky);outline-offset:2px}#pk2 .s1,#pk2 .s2,#pk2 .s3,#pk2 .s4,#pk2 .s5{--sc:var(--sky);--scs:var(--skysoft)}#pk2 .pane{display:flex;flex-direction:column;gap:12px}#pk2 .phead{display:flex;flex-direction:column;gap:6px;padding-top:4px}#pk2 .phead .sn{align-self:flex-start;font:800 12px var(--fd);background:var(--sky);color:var(--card);border-radius:999px;padding:2px 10px}#pk2 .phead h2{color:var(--ink)}#pk2 .phead .why{margin:0;color:var(--ink2)}#pk2 .pane h2{font:800 20px/1.35 var(--fd);margin:0;text-wrap:balance}#pk2 .why{margin:-4px 0 0;font-size:13.5px;color:var(--ink2)}#pk2 .calc{background:var(--grasssoft);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:2px;font-variant-numeric:tabular-nums}#pk2 .calc div{display:flex;justify-content:space-between;gap:10px;font-size:13px;font-weight:700}#pk2 .calc .sum{border-top:1.5px dashed var(--grass);padding-top:4px;margin-top:2px;font:800 16px var(--fd);color:var(--grass)}#pk2 .feat{background:var(--card);border:1.5px solid var(--line);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:8px}#pk2 .feat.mon{border-color:var(--warn)}#pk2 .ft{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}#pk2 .ft h3{font:800 18px/1.35 var(--fd);margin:0}#pk2 .of{font-size:11.5px;color:var(--ink2);font-weight:500}#pk2 .ft .amt{font:800 20px var(--fd);color:var(--grass);white-space:nowrap;font-variant-numeric:tabular-nums}#pk2 .steps3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}#pk2 .steps3 div{background:var(--bg);border-radius:10px;padding:6px;font-size:12px;font-weight:700;display:flex;flex-direction:column;gap:2px}#pk2 .steps3 b{font:800 11px var(--fd);color:var(--sc)}#pk2 .note{font-size:12.5px;color:var(--warn);background:var(--warnsoft);border-radius:10px;padding:6px 10px}#pk2 .fa{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}#pk2 .btn{display:flex;align-items:center;justify-content:center;gap:6px;font:800 15px var(--fd);border:none;border-radius:14px;padding:0 14px;min-height:50px;text-decoration:none;cursor:pointer;text-align:center}#pk2 .btn-go{background:var(--grass);color:var(--card);box-shadow:0 4px 0 var(--grassdeep)}#pk2 .btn-line{background:#06C755;color:#0B2B17;box-shadow:0 4px 0 #04983F}#pk2 .btn-moppy{background:var(--moppy);color:var(--card);box-shadow:0 4px 0 var(--moppydeep)}#pk2 .btn-done{background:var(--card);color:var(--ink2);border:2px solid var(--line);min-width:96px}#pk2 .btn-done[aria-pressed=\"true\"]{background:var(--grass);color:var(--card);border-color:var(--grass)}#pk2 .helper{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#pk2 .helper a{background:var(--moppysoft);border-radius:14px;padding:10px;text-decoration:none;color:var(--ink);display:flex;flex-direction:column;gap:2px;min-height:44px}#pk2 .helper a b{font:800 14px var(--fd);color:var(--moppydeep)}#pk2 .helper a span{font-size:12px;color:var(--ink2)}#pk2 .other{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px}#pk2 .other .ok{align-self:flex-start;font:800 11px var(--fd);color:var(--ink2);background:var(--bg);border-radius:6px;padding:2px 8px}#pk2 .other b{font:800 15px var(--fd)}#pk2 .other>span:not(.ok){font-size:13px;color:var(--ink2)}#pk2 .other .btn{min-height:46px;box-shadow:none}#pk2 .helper.one{grid-template-columns:minmax(0,1fr)}#pk2 .helper a.meet{background:var(--grasssoft)}#pk2 .helper a.meet b{color:var(--grass)}#pk2 .gchips{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}#pk2 .gchips::-webkit-scrollbar{display:none}#pk2 .gchip{flex:none;border:1.5px solid var(--line);background:var(--card);color:var(--ink2);border-radius:999px;padding:6px 12px;font:700 13px var(--fb);cursor:pointer;min-height:38px;white-space:nowrap}#pk2 .gchip[aria-pressed=\"true\"]{border-color:var(--sky);background:var(--skysoft);color:var(--sky)}#pk2 .gd{font-size:12.5px;color:var(--ink2);margin:0}#pk2 .rows{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden}#pk2 .row+.row{border-top:1px solid var(--line)}#pk2 .row-l{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center}#pk2 .dot{width:44px;height:52px;border:none;background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}#pk2 .dot i{width:24px;height:24px;border-radius:999px;border:2px solid var(--line);display:flex;align-items:center;justify-content:center}#pk2 .dot[aria-pressed=\"true\"] i{background:var(--grass);border-color:var(--grass)}#pk2 .dot svg{width:14px;height:14px;opacity:0}#pk2 .dot[aria-pressed=\"true\"] svg{opacity:1}#pk2 .row-h{border:none;background:none;text-align:left;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;padding:8px 12px 8px 0;cursor:pointer;color:var(--ink);min-height:52px;width:100%}#pk2 .rn{font-weight:700;font-size:15px;line-height:1.4}#pk2 .tg.free{background:var(--grasssoft);color:var(--grass)}#pk2 .tg.pay{background:var(--warnsoft);color:var(--warn)}#pk2 .rm .of{align-self:center}#pk2 .how{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}#pk2 .how li{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:8px;font:700 12.5px/1.4 var(--fb);display:flex;gap:6px;align-items:center}#pk2 .how b{flex:none;width:22px;height:22px;border-radius:999px;background:var(--sky);color:var(--card);font:800 12px var(--fd);display:flex;align-items:center;justify-content:center}#pk2 .rm{display:flex;gap:6px;margin-top:2px;flex-wrap:wrap}#pk2 .tg{font-size:11px;font-weight:700;border-radius:6px;padding:1px 6px;background:var(--bg);color:var(--ink2);white-space:nowrap}#pk2 .tg.e1{background:var(--grasssoft);color:var(--grass)}#pk2 .tg.e2{background:var(--skysoft);color:var(--sky)}#pk2 .tg.e3,#pk2 .tg.e4{background:var(--warnsoft);color:var(--warn)}#pk2 .ra{font:800 15px var(--fd);color:var(--grass);white-space:nowrap;text-align:right;font-variant-numeric:tabular-nums}#pk2 .chev{width:8px;height:8px;border-right:2.5px solid var(--ink2);border-bottom:2.5px solid var(--ink2);transform:rotate(45deg);margin-right:2px}#pk2 .row.open .chev{transform:rotate(-135deg)}#pk2 .row.done .rn,#pk2 .row.done .ra{opacity:.5}#pk2 .row-b{padding:0 12px 12px 44px;display:flex;flex-direction:column;gap:8px}#pk2 .kv{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12.5px;color:var(--ink2)}#pk2 .do{font-size:13.5px}#pk2 .row-b .btn{min-height:46px;font-size:14px}#pk2 .links{display:flex;flex-wrap:wrap;gap:6px}#pk2 .links a{font-size:12.5px;font-weight:700;color:var(--moppydeep);background:var(--moppysoft);border-radius:8px;padding:8px 10px;text-decoration:none}#pk2 .next{display:flex;justify-content:center}#pk2 .next .btn{width:100%;background:var(--scs);color:var(--sc);box-shadow:none;border:2px solid var(--sc)}#pk2 .foot{font-size:11.5px;color:var(--ink2);display:flex;flex-direction:column;gap:2px}#pk2 .dock{position:fixed;left:0;right:0;bottom:0;z-index:6;background:var(--card);border-top:1px solid var(--line);padding-top:8px;padding-bottom:calc(8px + env(safe-area-inset-bottom,0px));padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}#pk2 .dock div{max-width:640px;margin:0 auto}#pk2 .dock .btn{min-height:46px;box-shadow:none}@media (max-width:380px){#pk2 .st span{font-size:11.5px}#pk2 .goal .big{font-size:22px}}#pk2 .goal2{background:var(--card);border:1.5px solid var(--line);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:8px}#pk2 .gl{display:flex;align-items:baseline;gap:8px}#pk2 .gl span{font:800 12px var(--fd);color:var(--ink2)}#pk2 .gl b{font:800 22px var(--fd);color:var(--grass)}#pk2 .bar2{height:12px;border-radius:999px;background:var(--bg);overflow:hidden}#pk2 .bar2 i{display:block;height:100%;width:0;background:var(--grass);border-radius:999px;transition:width .4s}#pk2 .gm{font-size:13px;color:var(--ink2);font-weight:700;display:flex;flex-wrap:wrap;gap:4px 8px;font-variant-numeric:tabular-nums}#pk2 .gm b{color:var(--ink)}#pk2 .today{background:var(--sky);color:#fff;border-radius:22px;padding:16px;display:flex;flex-direction:column;gap:10px}#pk2 .today .tt{align-self:flex-start;font:800 12px var(--fd);background:#fff;color:var(--skydeep);border-radius:999px;padding:3px 12px}#pk2 .today h2{font:800 22px/1.35 var(--fd);margin:0;color:#fff}#pk2 .today .of{color:#D6EBFF}#pk2 .today .tam{font:800 28px var(--fd);font-variant-numeric:tabular-nums}#pk2 .tchips{display:flex;flex-wrap:wrap;gap:6px}#pk2 .tchips span{font-size:12.5px;font-weight:800;border-radius:8px;padding:3px 10px;background:rgba(255,255,255,.18);color:#fff}#pk2 .today .steps3 div{background:rgba(255,255,255,.14);color:#fff}#pk2 .today .steps3 b{color:#FFE08A}#pk2 .today .tn{font-size:12.5px;color:#E3F1FF}#pk2 .today .go{background:#fff;color:var(--skydeep);box-shadow:0 4px 0 rgba(0,0,0,.18);font-size:17px;min-height:56px}#pk2 .today .tb{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px}#pk2 .today .tb button{min-height:46px;border-radius:14px;font:800 14px var(--fd);cursor:pointer;border:2px solid rgba(255,255,255,.6);background:transparent;color:#fff}#pk2 .today .tb button.ok{background:var(--grass);border-color:var(--grass)}#pk2 .today.all{background:var(--grasssoft);color:var(--ink)}#pk2 .today.all h2{color:var(--grass)}#pk2 .jisseki{display:flex;flex-direction:column;gap:6px}#pk2 .jisseki b{font:800 15px var(--fd)}#pk2 .jph{border:2px dashed var(--line);border-radius:14px;padding:18px;text-align:center;font-size:12.5px;color:var(--ink2);background:var(--card)}#pk2 .allh{font:800 17px var(--fd);margin:6px 0 -4px}#pk2 .lock{background:var(--card);border:1.5px dashed var(--line);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:8px;text-align:center}#pk2 .lock b{font:800 15px var(--fd)}#pk2 .lock span{font-size:13px;color:var(--ink2)}#pk2 .lock button{align-self:center;border:1.5px solid var(--line);background:var(--card);color:var(--ink2);border-radius:12px;min-height:44px;padding:0 16px;font:700 13px var(--fb);cursor:pointer}#pk2 .toast{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:20;background:var(--grass);color:#fff;font:800 15px var(--fd);border-radius:999px;padding:10px 18px;box-shadow:0 6px 16px rgba(0,0,0,.18);white-space:nowrap}#pk2 .earn{background:var(--card);border:1.5px solid var(--line);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:8px}#pk2 .ek{font:800 15px var(--fd)}#pk2 .er{display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid var(--line);padding-bottom:8px}#pk2 .er span{display:flex;flex-direction:column}#pk2 .er b{font-size:14px}#pk2 .er small{font-size:11.5px;color:var(--ink2)}#pk2 .er strong{font:800 18px var(--fd);color:var(--grass);white-space:nowrap;font-variant-numeric:tabular-nums}#pk2 .et{display:flex;justify-content:space-between;align-items:baseline;gap:10px;background:var(--grasssoft);border-radius:12px;padding:10px 12px}#pk2 .et span{font:800 14px var(--fd);color:var(--grass)}#pk2 .et strong{font:800 26px var(--fd);color:var(--grass);font-variant-numeric:tabular-nums}#pk2 .en{font-size:11.5px;color:var(--ink2)}#pk2 .lv{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;font-weight:700;color:var(--ink2)}#pk2 .badge{font:800 12px var(--fd);background:var(--sky);color:var(--card);border-radius:999px;padding:3px 10px}#pk2 .hero2{background:var(--card);border:1.5px solid var(--line);border-radius:22px;padding:16px;display:flex;flex-direction:column;gap:8px}#pk2 .ht{display:flex;align-items:center;justify-content:space-between;gap:8px}#pk2 .pk{font:800 28px var(--fd);letter-spacing:.02em}#pk2 .hm{font:800 14px var(--fd);color:var(--ink2)}#pk2 .hm b{font-size:24px;color:var(--grass);margin-left:4px}#pk2 .lm{margin:0;font-size:13px;font-weight:700;color:var(--ink2)}#pk2 .uchi{border:none;background:var(--bg);border-radius:12px}#pk2 .uchi summary{min-height:40px;padding:8px 12px;font:800 13px var(--fd);color:var(--sky)}#pk2 .uchi .er{display:flex;justify-content:space-between;gap:8px;padding:6px 12px;font-size:13px;border-top:1px solid var(--line)}#pk2 .uchi .er strong{color:var(--grass);font-family:var(--fd);white-space:nowrap}#pk2 .uchi .er.tot{font-weight:800}#pk2 .uchi .er.tot strong{font-size:18px}#pk2 #pk-moneyM{display:inline-block}@keyframes pkpop{0%{transform:scale(.94);opacity:0}60%{transform:scale(1.02);opacity:1}100%{transform:scale(1)}}@keyframes pkup{0%{transform:translate(-50%,16px);opacity:0}100%{transform:translate(-50%,0);opacity:1}}@keyframes pkfadeUp{0%{transform:translateY(8px);opacity:0}100%{transform:none;opacity:1}}@keyframes pkbump{0%{transform:scale(1)}40%{transform:scale(1.18);color:var(--grass)}100%{transform:scale(1)}}#pk2 .today{animation:pkpop .38s ease-out}#pk2 .toast:not([hidden]){animation:pkup .3s ease-out}#pk2 .pane.in{animation:pkfadeUp .25s ease-out}#pk2 .bump{animation:pkbump .6s ease-out}#pk2 .dot[aria-pressed=\"true\"] i{animation:pkpop .3s ease-out}@media (prefers-reduced-motion:reduce){#pk2 .today,#pk2 .toast,#pk2 .pane.in,#pk2 .bump,#pk2 .dot i{animation:none!important}}#pk2 .cover{min-height:100vh;display:flex;align-items:center;justify-content:center;padding-block:24px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}#pk2 .cv{width:100%;max-width:440px;background:var(--card);border:1.5px solid var(--line);border-radius:26px;padding:24px 20px;display:flex;flex-direction:column;gap:14px;text-align:center;animation:pkpop .45s ease-out}#pk2 .ck{font:800 15px/1.5 var(--fd);color:var(--ink2)}#pk2 .c1{font:800 54px/1.05 var(--fd);color:var(--grass);font-variant-numeric:tabular-nums}#pk2 .c1 small{font-size:20px;margin:0 4px}#pk2 .cl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#pk2 .cl div{background:var(--bg);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:2px}#pk2 .cl span{font-size:12px;font-weight:700;color:var(--ink2)}#pk2 .cl b{font:800 20px var(--fd);color:var(--grass)}#pk2 .cy{background:var(--grasssoft);border-radius:16px;padding:12px;display:flex;justify-content:center;align-items:baseline;gap:10px}#pk2 .cy span{font:800 15px var(--fd);color:var(--grass)}#pk2 .cy b{font:800 32px var(--fd);color:var(--grass);font-variant-numeric:tabular-nums}#pk2 .cn{margin:0;font-size:12.5px;color:var(--ink2)}#pk2 .cover{cursor:pointer}#pk2 .cover.out .cv{animation:pkoutz .32s ease-in forwards}@keyframes pkoutz{to{transform:scale(1.06);opacity:0}}@keyframes pkblink{50%{opacity:.45}}#pk2 .cgo{display:flex;align-items:center;justify-content:center;border-radius:16px;background:var(--sky);color:#fff;font:800 18px var(--fd);min-height:58px;box-shadow:0 4px 0 var(--skydeep);animation:pkblink 1.6s ease-in-out infinite}#pk2 .cover:focus-visible{outline:3px solid var(--sky);outline-offset:-6px}#pk2 .mikomi{align-self:flex-start;border:none;background:none;color:var(--sky);font:800 13px var(--fd);padding:6px 0;min-height:36px;cursor:pointer;text-decoration:underline}#pk2 #pk-main.in{animation:pkfadeUp .35s ease-out}@media (max-width:380px){#pk2 .c1{font-size:44px}}@media (prefers-reduced-motion:reduce){#pk2 .cv,#pk2 #pk-main.in,#pk2 .cgo{animation:none!important}}#pk2 .skip{position:absolute;top:calc(12px + env(safe-area-inset-top,0px));right:max(16px,env(safe-area-inset-right,0px));border:none;background:none;color:var(--ink2);font:700 13px var(--fb);min-height:44px;padding:0 8px;cursor:pointer}#pk2 .cover{position:relative}#pk2 .ch{font:800 30px/1.35 var(--fd)}#pk2 .cc{display:flex;flex-wrap:wrap;justify-content:center;gap:6px}#pk2 .cc span{background:var(--grasssoft);color:var(--grass);font:800 13px var(--fd);border-radius:999px;padding:4px 12px}#pk2 .cli{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;text-align:left}#pk2 .cli li{display:flex;gap:10px;align-items:center;background:var(--bg);border-radius:14px;padding:12px;font:700 15px/1.45 var(--fb)}#pk2 .cli b{flex:none;width:28px;height:28px;border-radius:999px;background:var(--sky);color:#fff;font:800 14px var(--fd);display:flex;align-items:center;justify-content:center}#pk2 .dots{display:flex;justify-content:center;gap:6px}#pk2 .dots i{width:8px;height:8px;border-radius:999px;background:var(--line)}#pk2 .dots i.on{background:var(--sky);width:20px}#pk2 .pop2{animation:pkpop .38s ease-out}#pk2 .hm span{display:block;font-size:14px;color:var(--grass);margin-top:2px}#pk2 .guide{border:none;background:var(--bg);border-radius:12px}#pk2 .guide summary{min-height:44px;padding:10px 12px;font:800 13.5px var(--fd);color:var(--sky);cursor:pointer}#pk2 .guide ol{margin:0;padding:0 12px 12px 30px;display:flex;flex-direction:column;gap:6px;font-size:13.5px}#pk2 .guide.tg2{background:rgba(255,255,255,.14)}#pk2 .guide.tg2 summary{color:#fff}#pk2 .guide.tg2 ol{color:#fff}@media (prefers-reduced-motion:reduce){#pk2 .pop2{animation:none!important}}#pk2 .csub{font:800 20px var(--fd);color:var(--grass);margin-top:-6px}#pk2 .with{margin:0;font-size:13px;font-weight:800;color:var(--sky)}#pk2 .cv{gap:18px;padding:28px 22px}#pk2 .ck{font:800 14px var(--fd);color:var(--sky);letter-spacing:.04em}#pk2 .ch{font:800 28px/1.5 var(--fd);color:var(--ink)}#pk2 .cnum{display:flex;flex-direction:column;align-items:center;gap:2px;color:var(--ink)}#pk2 .cnum .pre{font:800 18px var(--fd);color:var(--ink2)}#pk2 .cnum .n{font:800 60px/1.1 var(--fd);font-variant-numeric:tabular-nums;letter-spacing:-.01em}#pk2 .cnum .n small{font-size:24px;margin-left:4px}#pk2 .csub{font:800 18px var(--fd);color:var(--ink);margin-top:-8px}#pk2 .cc span{background:var(--bg);color:var(--ink);font:700 13px var(--fb)}#pk2 .cn{font-size:15px;line-height:1.8;color:var(--ink2)}#pk2 .cli li{font:700 15px/1.55 var(--fb)}@keyframes pkpulse{50%{transform:scale(1.03)}}#pk2 .cgo{animation:pkpulse 1.8s ease-in-out infinite;background:var(--sky);color:#fff}#pk2 .hm b{color:var(--ink)}#pk2 .hm span{color:var(--ink2)}#pk2 .ft .amt,#pk2 .ra,#pk2 .ca{color:var(--ink)}@media (max-width:380px){#pk2 .cnum .n{font-size:50px}#pk2 .ch{font-size:24px}}#pk2 .cover{background:linear-gradient(180deg,var(--skytop) 0%,var(--bg) 55%);overflow:hidden;flex-direction:column;gap:14px}#pk2 .cover::after{content:\"\";position:absolute;left:-10%;right:-10%;bottom:-60px;height:180px;border-radius:50% 50% 0 0;background:var(--hill);z-index:0}#pk2 .cover::before{content:\"\";position:absolute;left:30%;right:-30%;bottom:-80px;height:160px;border-radius:50% 50% 0 0;background:var(--hill2);z-index:0}#pk2 .cover>*{position:relative;z-index:1}#pk2 .brand{display:flex;align-items:center;gap:6px;font:800 14px var(--fd);color:var(--wooddeep)}#pk2 .brand svg{width:22px;height:22px}#pk2 .cbrand{justify-content:center}#pk2 .pk.sign{background:var(--wood);color:var(--cream);border-radius:10px;padding:2px 14px 4px;font-size:24px;box-shadow:0 3px 0 var(--wooddeep);position:relative}#pk2 .stamps{display:flex;flex-direction:column;gap:6px;background:var(--cream);border:1.5px dashed var(--wood);border-radius:14px;padding:10px}#pk2 .stamps .sl{font:800 12px var(--fd);color:var(--wooddeep)}#pk2 .sg{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:4px}#pk2 .sg i{aspect-ratio:1;max-width:100%;border-radius:999px;border:1.5px dashed var(--wood);display:flex;align-items:center;justify-content:center;font:700 10px var(--fb);color:var(--wood);font-style:normal}#pk2 .sg i.on{background:var(--wood);border-style:solid;color:var(--cream)}#pk2 .sg i .sti{width:100%;height:100%;object-fit:cover;border-radius:999px;background:var(--cream)}#pk2 .sg i.on{animation:pkpop .3s ease-out}#pk2 .cnum .n.long{font-size:40px}#pk2{background:linear-gradient(180deg,var(--skytop) 0,var(--bg) 280px) no-repeat,var(--bg)}@media (max-width:380px){#pk2 .cnum .n.long{font-size:34px}}#pk2 .crows{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;text-align:left}#pk2 .crows li{display:flex;justify-content:space-between;align-items:center;gap:10px;background:var(--bg);border-radius:12px;padding:11px 12px}#pk2 .crows span{font:700 14.5px/1.45 var(--fb);color:var(--ink)}#pk2 .crows b{font:800 15px var(--fd);color:var(--ink);white-space:nowrap;font-variant-numeric:tabular-nums}#pk2 .cchrs{display:flex;justify-content:center;align-items:flex-end;gap:4px;margin:-6px 0 -4px;min-height:0}#pk2 .cchr{display:block;max-height:120px;max-width:46%;object-fit:contain}#pk2 .cchrs.big .cchr{max-height:170px;max-width:90%}#pk2 .phead{position:relative;padding-right:70px}#pk2 .pchr{position:absolute;right:0;top:0;width:64px;height:64px;object-fit:contain}#pk2 .today{position:relative}#pk2 .tchr{position:absolute;right:10px;top:-34px;width:78px;height:78px;object-fit:contain}#pk2 .ch,#pk2 .phead h2,#pk2 .today.all h2{color:var(--wooddeep)}#pk2 .cnum .n,#pk2 .csub,#pk2 .crows b,#pk2 .hm b,#pk2 .ft .amt,#pk2 .ra,#pk2 .ca,#pk2 .cnum .pre{color:var(--accent)}#pk2 .ck{color:var(--sky)}#pk2 .ft h3,#pk2 .rn{color:var(--ink)}#pk2 .cover>.skip{position:absolute;z-index:2}#pk2 .hm b{font-size:20px}#pk2 .fxf{display:flex;flex-direction:column;gap:8px;background:var(--bg);border-radius:14px;padding:12px;color:var(--ink)}#pk2 .fl{display:flex;align-items:center;gap:8px;font:800 14px var(--fd)}#pk2 .fl b{flex:none;width:24px;height:24px;border-radius:999px;background:var(--sky);color:#fff;font:800 12px var(--fd);display:flex;align-items:center;justify-content:center}#pk2 .fxname{font:500 16px var(--fb);border:1.5px solid var(--line);border-radius:12px;padding:10px 12px;min-height:46px;background:var(--card);color:var(--ink);width:100%}#pk2 .fxmsg{background:var(--card);border:1.5px dashed var(--line);border-radius:12px;padding:10px 12px;font-size:14px;line-height:1.7;-webkit-user-select:text;user-select:text}#pk2 .fxcopy{background:var(--card);color:var(--sky);border:2px solid var(--sky);min-height:46px}#pk2 .fxok{font-size:12.5px;font-weight:700;color:var(--grass);min-height:1em}#pk2 .today .fxf{background:#fff}#pk2 .feat .fa:has(> span:first-child){grid-template-columns:minmax(0,1fr)}#pk2 .feat .fa > span:first-child{display:none}#pk2 .cover>.skip{background:var(--card);color:var(--sky);border:2px solid var(--sky);border-radius:999px;font:800 14px var(--fd);min-height:42px;padding:0 16px;box-shadow:0 2px 6px rgba(0,0,0,.08)}#pk2 .skip2{border:none;background:none;color:var(--ink2);font:700 13.5px var(--fb);text-decoration:underline;min-height:44px;cursor:pointer;margin-top:-6px}#pk2{background:linear-gradient(180deg,var(--skytop) 0,var(--bg) 280px) no-repeat,var(--bg);color:var(--ink);font-family:var(--fb);font-size:14px;line-height:1.55;-webkit-text-size-adjust:100%}#pk2 .wrap{padding-block:14px 40px}#pk2 .cover{position:fixed;inset:0;z-index:9999;overflow:auto;min-height:100%}#pk2 .toast{bottom:calc(96px + env(safe-area-inset-bottom,0px))}#pk2 .steps{top:0}#pk2 .pk-line{min-height:48px;box-shadow:none}#pk2 [hidden]{display:none!important}#pk2 a{text-decoration:none}#pk2 button{font-family:inherit}#pk2 h2,#pk2 h3,#pk2 p,#pk2 ol,#pk2 ul{margin-top:0}";
var HTML="<section class=\"cover\" id=\"pk-cover\" role=\"button\" tabindex=\"0\" aria-label=\"タップして次へ\">\n  <div class=\"brand cbrand\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5z\" fill=\"var(--wood)\"/><path d=\"M12 6v13.5\" stroke=\"var(--cream)\" stroke-width=\"1.4\"/></svg><span>おかねの図書館</span></div>\n  <button type=\"button\" class=\"skip\" id=\"pk-skipBtn\">説明をとばす ›</button>\n  <div class=\"cv\" id=\"pk-slide\"></div>\n</section>\n<div class=\"wrap\" id=\"pk-main\">\n  <div class=\"brand\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5z\" fill=\"var(--wood)\"/><path d=\"M12 6v13.5\" stroke=\"var(--cream)\" stroke-width=\"1.4\"/></svg><span>おかねの図書館</span></div>\n  <div class=\"hero2\">\n    <div class=\"ht\"><span class=\"pk sign\">ポイ活</span><span class=\"badge\" id=\"pk-lvBadge\">スタート前</span></div>\n    <div class=\"hm\">見込み <b>毎月 15,000〜20,000円</b><span id=\"pk-hmTot\">＋ 全部やると合計 約410,000円</span></div>\n    <div class=\"bar2\" aria-hidden=\"true\"><i id=\"pk-bar2\"></i></div>\n    <div class=\"gm\">いま <b id=\"pk-moneyM\">毎月 0円</b><span id=\"pk-moneyO\"></span></div>\n    <p class=\"lm\" id=\"pk-lvMsg\"></p>\n    <div class=\"stamps\" id=\"pk-stamps\" aria-label=\"スタンプカード\"></div>\n    <p class=\"with\">わからなくても大丈夫。一緒に進められます</p>\n    <button type=\"button\" class=\"mikomi\" id=\"pk-openCover\">説明をもう一度見る</button>\n  </div>\n  <div id=\"pk-today\"></div>\n  <h2 class=\"allh\">ほかの案件</h2>\n  <div class=\"steps\" role=\"tablist\" aria-label=\"STEP\" id=\"pk-steps\"></div>\n  <div class=\"pane\" id=\"pk-pane\"></div>\n  <div class=\"jisseki\">\n    <b>みんなの実績</b>\n    <div class=\"jph\">ここに会員の入金画面（実績）を入れます</div>\n  </div>\n  <div class=\"other\">\n    <span class=\"ok\">その他</span>\n    <b>一度会える人は、サポートを受けられます</b>\n    <span>入力がめんどうな人や、やり方が分からない人は、一度会って、となりで一緒に申し込めます。どのSTEPの案件でも大丈夫です。</span>\n    <span>サポートは会える人だけです。当日はスマホと身分証を持ってきてください。</span>\n    <a class=\"btn btn-line\" href=\"https://lin.ee/N3bt3gB\" target=\"_blank\" rel=\"noopener\">会う日をLINEで決める</a>\n  </div>\n  <a class=\"btn btn-line pk-line\" href=\"https://lin.ee/N3bt3gB\" target=\"_blank\" rel=\"noopener\">わからないときはLINEで相談</a>\n  <div class=\"foot\"><span>金額は11月1日時点の目安です。持っている口座・カードの案件は対象外です。</span></div>\n</div>\n<div class=\"toast\" id=\"pk-toast\" hidden></div>";
var TILE_CSS="";
var tries=0;
function boot(){
  var app=document.getElementById("fbapp");
  if(!app){if(++tries<60)return setTimeout(boot,250);return}
  if(document.getElementById("pk2"))return;
  document.querySelectorAll(".pkr-tile2,#scr-pkrun").forEach(function(o){o.remove()});
  document.querySelectorAll("#pkrun").forEach(function(o){var w=o.closest(".w-embed")||o;w.style.display="none";o.remove()});
  if(!document.getElementById("pk2-font")){var l=document.createElement("link");l.id="pk2-font";l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap";document.head.appendChild(l)}
  var st=document.createElement("style");st.id="pk2-css";st.textContent=CSS+TILE_CSS;document.head.appendChild(st);
  var poi=document.getElementById("scr-poi"),key="poi",back="learn",sec;
  if(poi){
    /* 今のポイ活画面の中身を隠して、新しい画面に置き換える */
    Array.prototype.forEach.call(poi.children,function(c){c.style.display="none";c.setAttribute("data-pk-old","1")});
    sec=document.createElement("div");sec.id="pk2wrap";poi.appendChild(sec);
  }else{
    sec=document.createElement("section");sec.className="screen";sec.id="scr-poi";
    var ref=document.getElementById("scr-repair")||document.getElementById("scr-learn");
    if(ref&&ref.parentNode===app)app.insertBefore(sec,ref.nextSibling);else app.appendChild(sec);
  }
  sec.innerHTML='<div class="rp-head"><button type="button" class="rp-back" id="pk2Back">‹ もどる</button><span class="t">ポイ活</span></div><div id="pk2">'+HTML+'</div>';
  document.getElementById("pk2Back").addEventListener("click",function(){if(history.state&&history.state.fb&&history.state.i>0)history.back();else if(typeof window.showScr==="function")window.showScr(back)});
  run();
  var prev=window.showScr;
  if(typeof prev==="function")window.showScr=function(k){prev(k);if(k===key&&window.__pkCover)window.__pkCover(true)};
}
function run(){

const MP=id=>"https://pc.moppy.jp/ad/detail.php?site_id="+id;
const LN="https://s.lmes.jp/landing-qr/2008498110-EJqjJ5YN?uLand=a4c393";
const KANCHO="https://lin.ee/N3bt3gB";
const MOPPY_JOIN="https://pc.moppy.jp/entry/invite.php?invite=8tcKA175&openExternalBrowser=1";
const TS=c=>"https://tsunagu.mkgrp.biz/apply/"+c;
const EZ={1:"5分くらい",2:"10〜30分",3:"1時間くらい",4:"半日くらい・外出あり"};
const DATA={
moppy:[
 {t:"銀行の口座開設",d:"口座を作るだけでもらえる",items:[
  {n:"三菱UFJ銀行 口座開設",a:"20,000円",v:20000,m:"0円",w:"2か月",e:2,d:"アプリで口座開設のみ",c:"期間限定の額。今の金額をモッピーで確認",u:MP(158897)},
  {n:"楽天銀行 口座開設",a:"13,000円",v:13000,m:"0円",w:"30日前後",e:2,d:"口座開設→初回ログイン",c:"土日限定の額",u:MP(102667)},
  {n:"みずほ銀行 口座開設",a:"10,000円",v:10000,m:"0円",w:"45日",e:2,d:"WEBで口座開設のみ",c:"期間限定の額。今の金額をモッピーで確認",u:MP(160628)},
  {n:"SBI新生銀行",a:"1,500円",v:1500,m:"0円",w:"1か月",e:2,d:"口座開設のみ",u:MP(142543)}]},
 {t:"証券・投資",d:"口座を作って、100円〜少額を入れる",items:[
  {n:"三菱UFJ eスマート証券",a:"16,000円",v:16000,m:"100円",w:"90日",e:2,d:"口座開設→投資信託を100円買う",u:MP(147395)},
  {n:"セゾン投信",a:"11,000円",v:11000,m:"5,000円",w:"2か月",e:2,d:"口座開設→積立で合計5,000円",c:"5,000円は自分のお金として残る",u:MP(154509)},
  {n:"マネックス証券",a:"8,000円",v:8000,m:"100円",w:"1か月",e:2,d:"口座開設→投資信託を100円買う",u:MP(144526)},
  {n:"SBI証券＋NISA",a:"7,000円",v:7000,m:"0円",w:"90日",e:2,d:"口座開設",c:"NISAを他の会社で使っていない人だけ",u:MP(160483)},
  {n:"松井証券",a:"1,500円",v:1500,m:"0円",w:"30日前後",e:2,d:"口座開設のみ",u:MP(129569)},
  {n:"SBIネオトレード証券",a:"1,000円",v:1000,m:"0円",w:"1〜4週間",e:2,d:"口座開設のみ",u:MP(106110)},
  {n:"ALTERNAバンク",a:"3,000円",v:3000,m:"10,000円",w:"45日",e:3,d:"口座開設→10,000円投資",u:MP(161120)}]},
 {t:"クレジットカード",d:"どれも年会費無料。1か月に2枚まで。半年以内にローンを組む予定の人は飛ばす",items:[
  {n:"三菱UFJカード",a:"15,000円",v:15000,m:"0円",w:"30日",e:2,d:"申込→カードを受け取る",c:"期間限定の額。今の金額をモッピーで確認",u:MP(157374)},
  {n:"エポスカード",a:"12,000円",v:12000,m:"0円",w:"発行後60日",e:2,d:"発行するだけ。紹介番号は入れない",u:MP(102162)},
  {n:"楽天カード",a:"10,000円",v:10000,m:"0円",w:"1か月",e:2,d:"発行してカードを受け取る",u:MP(100822)},
  {n:"DMM JCBカード",a:"8,000円",v:8000,m:"0円",w:"1か月",e:2,d:"発行してカードを受け取る",u:MP(161599)},
  {n:"リクルートカード",a:"5,000円",v:5000,m:"0円",w:"発行後30日",e:2,d:"JCBブランドで発行",u:MP(123793)},
  {n:"SAISON CARD Digital",a:"5,000円",v:5000,m:"5,000円使う",w:"1か月",e:2,d:"発行→翌月末までに5,000円使う",u:MP(149494)},
  {n:"イオンカード",a:"4,000円",v:4000,m:"0円",w:"45日",e:2,d:"発行するだけ",u:MP(147240)},
  {n:"dカード",a:"2,400円",v:2400,m:"0円",w:"1か月",e:2,d:"発行するだけ",c:"カードの最後に申し込む",u:MP(154753)}]},
 {t:"入金して取引する",d:"少し入金して1回取引する",items:[
  {n:"TOSSY",a:"5,000円",v:5000,m:"少額",w:"1か月",e:3,d:"入金して1回取引",c:"DMM FXと同時は対象外",u:MP(160638)},
  {n:"OKJ",a:"4,000円",v:4000,m:"10,000円",w:"1か月",e:3,d:"口座開設→合計10,000円取引",u:MP(157314)}]},
 {t:"無料登録・お試し",d:"登録するだけ。お試しは期限内に解約するまでが作業",items:[
  {n:"ポケットリサーチ",a:"11,000円",v:11000,m:"0円",w:"2か月",e:3,d:"男性向けモニターに登録→電話の説明を聞く→モニター1件",c:"男性だけ",u:MP(156850)},
  {n:"U-NEXT 無料お試し",a:"2,000円",v:2000,m:"0円",w:"1か月",e:1,d:"登録→31日以内に解約",c:"31日以内に解約しないと料金がかかる",u:MP(119456)},
  {n:"Humalance",a:"2,000円",v:2000,m:"0円",w:"10日",e:2,d:"無料登録→経歴書を出す（15分）",u:MP(160952)},
  {n:"オリックスカーシェア",a:"1,500円",v:1500,m:"0円",w:"45日",e:1,d:"無料会員登録のみ",u:MP(162033)},
  {n:"DMM TV 無料お試し",a:"550円",v:550,m:"0円",w:"すぐ",e:1,d:"無料お試しに登録",c:"無料期間内に解約",u:MP(154516)},
  {n:"Amazon Prime Video",a:"500円",v:500,m:"0円",w:"90日",e:2,d:"登録→7日以内に動画を10分見る",c:"無料期間内に解約",u:MP(159287)},
  {n:"定額レンタル8 無料お試し",a:"400円",v:400,m:"0円",w:"すぐ",e:1,d:"30日無料お試しに登録",c:"30日以内に解約",u:MP(158314)},
  {n:"少額の無料登録5件",a:"合計約2,100円",v:2110,m:"0円",w:"1か月",e:1,d:"それぞれ無料登録・口コミ・アンケートに答える",links:[["京急プレミアポイント 500円",MP(161941)],["リスログ 500円",MP(161719)],["Ipsos iSay 420円",MP(161511)],["Club toto 390円",MP(147960)],["ポイントインカム 300円",MP(160492)]]}]}
],
other:[
 {t:"LINEで案内する案件",d:"LINEで「やりたい」と送ると、やり方を案内します",items:[
  {n:"FX口座（XM・HFM）",a:"LINEで案内",v:0,m:"入金・取引",w:"LINEで案内",e:3,d:"LINEをつないで口座を作り、取引する",u:KANCHO,r:"kc"}]},
 {t:"口座開設（招待コード・専用フォーム）",d:"口座を作るだけ。招待コードはあとから入れられないので注意",items:[
  {n:"FX口座 8社開設",a:"8社で40,000円",v:40000,m:"0円",w:"翌月10日",e:2,d:"案内どおりに国内・海外のFX口座を開くだけ。1社5,000円",c:"20〜65歳。XM・HFMはこの8社に入れない",u:TS("WPESw5j3z9"),r:"ts"},
  {n:"bitFlyer",a:"1,500円",v:1500,m:"0円",w:"24時間以内",e:1,d:"アプリで口座開設。招待コードを入れる",c:"招待コードはあとから入れられない",u:"https://bitflyer.com/invitation?id=jdnsm1at&lang=ja-JP",r:"of"},
  {n:"第一生命NEOBANK",a:"1,500円",v:1500,m:"0円",w:"翌日",e:1,d:"アプリで口座開設。紹介コードを入れる",u:"https://www.netbk.co.jp/contents/cmp/20240628_002620/index.html",r:"of"},
  {n:"Coincheck",a:"1,500円",v:1500,m:"0円",w:"数日",e:1,d:"招待リンクで口座開設",u:"https://coincheck.com/ja/",r:"of"},
  {n:"BitTrade",a:"1,000円",v:1000,m:"0円",w:"翌日",e:1,d:"招待コードで口座開設",u:"https://www.bittrade.co.jp/",r:"of"},
  {n:"SBI VCトレード",a:"1,000円",v:1000,m:"0円",w:"翌月末",e:1,d:"紹介コードで口座開設",u:"https://www.sbivc.co.jp/",r:"of"},
  {n:"ZOLOME",a:"5,000円分",v:5000,m:"0円",w:"本登録のあと",e:1,d:"招待コードで本登録（投資はしない）",c:"もらえるのは投資に使えるポイント",u:"https://zolome.co.jp/",r:"of"},
  {n:"Habitto",a:"1,500円",v:1500,m:"1,000円（引き出せる）",w:"約10営業日",e:2,d:"口座開設→1,000円入金",u:"https://www.habitto.com/",r:"of"},
  {n:"楽天ウォレット",a:"500円",v:500,m:"楽天ポイント",w:"2か月後",e:2,d:"口座開設→楽天ポイントで暗号資産を1回買う",c:"現金はいらない",u:"https://www.rakuten-wallet.co.jp/",r:"of"}]},
 {t:"在宅でできるモニター",d:"家で登録・受け取りをするだけ",items:[
  {n:"資料請求（案件8）",a:"3,500円",v:3500,m:"0円",w:"LINEで確認",e:1,d:"公式LINEから申し込み→資料を受け取る（5分）",u:LN,r:"line"},
  {n:"サービス登録（案件20）",a:"1,700円",v:1700,m:"0円",w:"LINEで確認",e:1,d:"サービスに登録→画面のスクショを送る（1〜5分）",c:"SMSを受け取れる電話番号が要る",u:LN,r:"line"},
  {n:"TikTok Lite",a:"2,750円",v:2750,m:"0円",w:"すぐ",e:1,d:"招待リンクから登録→24時間以内に「報酬を受け取る」を押す",u:"https://lite.tiktok.com/t/ZS9Dbr5s2RtRY-8EOOt/",r:"of"},
  {n:"商品受け取りモニター",a:"1商品1,000円（月10,000〜15,000円）",v:10000,m:"0円",w:"翌月15日",e:2,d:"届いた美容商品を受け取る（使わない）→まとめて発送",c:"最後に定期購入を解約するまでが作業",u:TS("5hfxcjhz4k"),r:"ts"},
  {n:"Olive（三井住友銀行）",a:"2,400円",v:2400,m:"0円",w:"LINEで確認",e:2,d:"公式LINEから申し込み→身分証で口座開設（10分）",c:"三井住友銀行の口座を作ったことがない人だけ",u:LN,r:"line"},
  {n:"グリーンワークホース 資料請求",a:"1,400円",v:1400,m:"0円",w:"翌々月10日",e:2,d:"申し込み→資料が届いたら写真を送る",c:"年収500万円以上の会社員・公務員など",u:LN,r:"line"},
  {n:"野村不動産 資料請求",a:"1,400円",v:1400,m:"0円",w:"翌々月10日",e:2,d:"資料請求→資料が届いたら写真を送る",c:"中古マンションの購入を考えている人向け",u:LN,r:"line"}]},
 {t:"人と話すモニター",d:"面談・電話・お店に行ってもらえる",items:[
  {n:"保険面談モニター",a:"最大35,000円",v:35000,m:"0円",w:"翌々月15日",e:3,d:"FPと面談（対面7,000円・オンライン5,000円、最大5社）→アンケート→設計書の写真を送る",c:"21〜59歳。学生と、通院・治療中の人は対象外。同じ保険会社は1回だけ",u:TS("gOxNNkcbIY"),r:"ts"},
  {n:"覆面調査",a:"1件2,000〜3,000円",v:3000,m:"0円",w:"最短即日",e:3,d:"お店やオンラインで調査して報告（1時間前後）",c:"45歳未満。福岡はお店の案件が多い",u:TS("pt3o5OpPJP"),r:"ts"},
  {n:"JCBカード S",a:"3,500円",v:3500,m:"少額の決済",w:"LINEで確認",e:3,d:"担当者と話しながら申し込み→審査→少額の決済（60分）",c:"年会費無料",u:LN,r:"line"},
  {n:"転職サイトの電話登録",a:"2,800円",v:2800,m:"0円",w:"LINEで確認",e:3,d:"担当者と電話しながら転職サイトに登録（40分）",c:"静かな場所で電話できる人",u:LN,r:"line"},
  {n:"カードローン モニター（5社）",a:"1社10,500円",v:10500,m:"借りて1か月後に返す",w:"LINEで確認",e:4,d:"担当者と話しながら申し込み→借入→1か月たってから全額返済",c:"借入と返済の記録が信用情報に残る。安定した収入が要る",u:LN,r:"line"},
  {n:"男性クリニックの無料カウンセリング",a:"3,500円",v:3500,m:"0円",w:"LINEで確認",e:4,d:"来院予約→カウンセリングを受ける（契約・施術なし）",c:"男性だけ。全国23院",u:LN,r:"line"},
  {n:"docomo 乗り換え",a:"LINEで確認",v:0,m:"6か月分の月額料金",w:"LINEで確認",e:4,d:"福岡・熊本の指定のお店でdocomoに乗り換える",c:"183日（約6か月）は解約できず、その間の月額料金がかかる",u:LN,r:"line"},
  {n:"高級時計 抽選・購入調査",a:"来店30,000円〜",v:0,m:"購入資金は運営が用意",w:"約1週間",e:4,d:"抽選に参加→当選したら来店調査か購入モニター",c:"当選した人だけ",u:TS("CXlcfxROvP"),r:"ts"}]},
 {t:"入金して取引する",d:"入金→取引→出金ですぐに終わる",items:[
  {n:"アストロ",a:"約5,000〜10,000円",v:5000,m:"10,000円（戻る）",w:"すぐ",e:2,d:"口座開設・本人確認→10,000円入金→取引→出金",c:"もらえる特典は取引用",u:"https://trading.astro.space",r:"of"},
  {n:"CoinTrade",a:"4,000円",v:4000,m:"20,000円",w:"翌月20日ごろ",e:3,d:"紹介URLで口座開設→7日以内に20,000円以上買う→売って出金",c:"手数料で数百〜1,000円減るが、それでもプラス",u:"https://coin-trade.cc/",r:"of"},
  {n:"bitbank",a:"1,000円",v:1000,m:"10,000円",w:"後日",e:3,d:"口座開設→10,000円入金",c:"入金した10,000円は自分のお金として残る",u:"https://bitbank.cc/",r:"of"}]},
 {t:"出かける",d:"住宅展示場に行ってもらえる。同じハウスメーカーには1回だけ",items:[
  {n:"タマホーム フェア",a:"PayPay 20,000円",v:20000,m:"0円",w:"見学の翌日以降",e:4,d:"公式サイトから来場予約→見学（1〜2時間）",c:"11月23日まで。予約なしだと5,000円に下がる",u:"https://customer.tamahome.jp/reservation_hp/",r:"of"},
  {n:"持ち家計画",a:"1社5,000円",v:5000,m:"0円",w:"約3か月後",e:4,d:"持ち家計画から展示場を予約→30分以上見学",c:"タマホームと別の会社を選ぶ",u:"https://mochiie.com/input",r:"of"}]}
]};


const F={
 uketori:{p:"届いた商品を、送り返すだけ",n:"商品受け取りモニター",a:"毎月10,000〜15,000円",s:["家に化粧品などが届く（使わない）","箱にまとめて送り返す","1個につき1,000円もらえる"],c:"届くのは毎月10〜15個。送るお金も商品のお金もいりません。最後に、商品の定期便を止める手続きをします",u:TS("5hfxcjhz4k"),b:"申し込む",cls:"btn-go",g:["「申し込む」を押すと、専用のフォームが開きます","名前・フリガナ・メールアドレスを入れて「案内を受け取る」を押します","案内が届くので、そのとおりに進めます","家に化粧品などの商品が届きます（使わずにそのまま）","届いた商品を1つの箱にまとめて、指定の住所に送ります（送料はかかりません）","最後に、商品の定期便を止める手続きをします（やり方も案内があります）","1個につき1,000円が振り込まれます"]},
 xm:{p:"説明を聞いて、そのとおりに進める",n:"FXのアプリ（XM・HFM）",a:"毎月5,000円",s:["名前を入れて、メッセージをコピー","LINEを追加して、メッセージを送る","説明を聞いて、そのとおりに進める"],c:"最初にお金を入れて、売り買いする必要があります。くわしいことは説明の日に教えます",u:"#",b:"",cls:"btn-line",fx:1,g:["下の欄に名前を入れる","「メッセージをコピーする」を押す","「LINEを追加する」を押して、友だちに追加する","トーク画面にメッセージを貼り付けて送る","説明を聞く日を決めて、説明どおりに進める","取引を始めると、毎月5,000円が入ります"]},
 fx8:{p:"FXのアプリに8つ登録するだけ",n:"FX口座 8社開設",a:"40,000円",s:["フォームに名前などを書く","案内どおりに8つ登録する","登録できたら報告する"],c:"お金を入れる必要はありません。1つ登録するごとに5,000円。20〜65歳の人",u:TS("WPESw5j3z9"),b:"申し込む",cls:"btn-go",g:["「申し込む」を押すと、専用のフォームが開きます","名前などを入れて送ると、LINEで案内が届きます","案内どおりに、FXの口座を1つずつ作ります（お金は入れません）","8つ作れたら、LINEで報告します","1つにつき5,000円、合計40,000円が入ります"]},
 astro:{p:"10,000円入れて、すぐ引き出す",n:"アストロ",a:"約5,000〜10,000円",s:["アプリに登録する","10,000円入れて、1回売り買いする","10,000円を引き出す"],c:"入れた10,000円は戻ってきます",u:"https://trading.astro.space",b:"申し込む",cls:"btn-go",g:["「申し込む」を押して、アストロのアプリに登録します","身分証で本人確認をします","10,000円を入れます","1回だけ売り買いをします","入れた10,000円を引き出します。もらえる分はそのあと残ります"]},
 hoken:{p:"保険の人の話を聞くだけ",n:"保険面談モニター",a:"最大35,000円",s:["フォームから申し込む","保険の人と1時間話す","アンケートに答える"],c:"保険に入らなくてOK。会って話すと1社7,000円、ネットなら5,000円。5社まで。21〜59歳の人（学生・通院中の人は不可）",u:TS("gOxNNkcbIY"),b:"申し込む",cls:"btn-go",mon:1,g:["「申し込む」を押すと、専用のフォームが開きます","名前などを入れて送ると、LINEで案内が届きます","保険の人と会う日（またはネットで話す日）を決めます","1時間くらい、保険やお金の話を聞きます（入らなくてOK）","終わったらアンケートに答えて、もらった資料の写真を送ります","1社ごとにお金が入ります。最大5社まで"]}
};
const SKIP=new Set([...Object.values(F).map(f=>f.n),"FX口座（XM・HFM）"]);
const MONG=new Set(["在宅でできるモニター","人と話すモニター"]);
Object.values(DATA).forEach(gs=>gs.forEach(g=>{g.items=g.items.filter(it=>!SKIP.has(it.n));g.items.sort((a,b)=>a.e-b.e||b.v-a.v)}));
(function(){
  const home=DATA.other.find(g=>g.t==="在宅でできるモニター"),acc=DATA.other.find(g=>g.t.startsWith("口座開設"));
  if(home&&acc){const i=home.items.findIndex(x=>x.n==="TikTok Lite");if(i>=0){acc.items.push(home.items.splice(i,1)[0]);acc.items.sort((a,b)=>a.e-b.e||b.v-a.v)}acc.t="登録・口座開設";acc.d="登録や口座開設だけで終わる。招待コードはあとから入れられない";}
})();
const gOf=t=>DATA.other.find(g=>g.t.startsWith(t));
const HOUSE={t:"持ち家がある人",d:"自分か親族の家・土地がある人だけ。電話やZoomで話すだけで、家を売る必要はない",items:[
  {n:"不動産査定（7社）",a:"約23,800円",v:23800,m:"0円",w:"LINEで確認",e:2,d:"公式LINEから申し込み→不動産会社と電話で10分（机上査定のみ）。7社それぞれでもらえる（1社1,400〜4,200円）",c:"自分か親族の持ち家・土地がある人だけ。会社ごとに対象の地域が決まっている",u:LN,r:"line"},
  {n:"土地活用の相談",a:"10,500円",v:10500,m:"0円",w:"LINEで確認",e:3,d:"公式LINEから申し込み→不動産会社とZoomで60分",c:"自分か親族の土地・持ち家がある人（16都道府県）",u:LN,r:"line"}]};
const MON=[{...gOf("在宅でできるモニター"),t:"家でできる"},{...gOf("人と話すモニター"),t:"人と話す"},{...HOUSE,t:"家・土地がある人"},{...gOf("出かける"),t:"見に行く"}].filter(g=>g.items&&g.items.length);
const OTH=[{...gOf("登録・口座開設"),t:"登録するだけ"},{...gOf("入金して取引する"),t:"少し入れて売り買い"},{...gOf("LINEで案内"),t:"LINEで案内"}].filter(g=>g.items&&g.items.length);
const GN={"銀行の口座開設":"銀行の口座","証券・投資":"株・投資のアプリ","クレジットカード":"クレジットカード","入金して取引する":"少し売り買い","無料登録・お試し":"無料で試す"};
const MOP=DATA.moppy.map(g=>({...g,t:GN[g.t]||g.t}));
const CARDS=["三菱UFJカード","エポスカード","楽天カード","DMM JCBカード","リクルートカード","イオンカード","dカード"];
const PLAIN={
 "三菱UFJ銀行 口座開設":"三菱UFJ銀行の口座をスマホで作る","楽天銀行 口座開設":"楽天銀行の口座をスマホで作る","みずほ銀行 口座開設":"みずほ銀行の口座をスマホで作る","SBI新生銀行":"SBI新生銀行の口座をスマホで作る",
 "三菱UFJ eスマート証券":"株のアプリに登録して、100円だけ買う","セゾン投信":"積み立てのアプリで5,000円積み立てる","マネックス証券":"株のアプリに登録して、100円だけ買う","SBI証券＋NISA":"株のアプリに登録して、NISAを始める","松井証券":"株のアプリに登録するだけ","SBIネオトレード証券":"株のアプリに登録するだけ","ALTERNAバンク":"投資のアプリに10,000円入れる",
 "SAISON CARD Digital":"カードを作って、5,000円使う",
 "TOSSY":"投資のアプリで1回売り買いする","OKJ":"仮想通貨のアプリで10,000円分売り買いする",
 "ポケットリサーチ":"男性向けのアンケートに登録して、電話で説明を聞く","U-NEXT 無料お試し":"動画アプリを無料で試して、31日以内にやめる","Humalance":"仕事探しのサイトに登録して、経歴を書く","オリックスカーシェア":"カーシェアに無料で登録するだけ","DMM TV 無料お試し":"動画アプリを無料で試して、期間内にやめる","Amazon Prime Video":"動画を10分見て、期間内にやめる","定額レンタル8 無料お試し":"レンタルを無料で試して、30日以内にやめる","少額の無料登録5件":"5つのサイトに無料で登録する",
 "bitFlyer":"仮想通貨のアプリに、招待コードで登録","Coincheck":"仮想通貨のアプリに、招待リンクで登録","BitTrade":"仮想通貨のアプリに、招待コードで登録","SBI VCトレード":"仮想通貨のアプリに、紹介コードで登録","第一生命NEOBANK":"ネット銀行の口座をアプリで作る","ZOLOME":"投資のアプリに登録するだけ","Habitto":"お金のアプリに登録して、1,000円入れる","楽天ウォレット":"楽天ポイントで仮想通貨を1回買う","TikTok Lite":"TikTokの軽いアプリを入れて登録する",
 "CoinTrade":"仮想通貨を20,000円分買って、すぐ売る","bitbank":"仮想通貨のアプリに10,000円入れる",
 "資料請求（案件8）":"パンフレットを家に取り寄せる（5分）","サービス登録（案件20）":"サービスに登録して、画面の写真を送る","Olive（三井住友銀行）":"三井住友銀行の口座をスマホで作る","グリーンワークホース 資料請求":"資料を家に取り寄せて、写真を送る","野村不動産 資料請求":"資料を家に取り寄せて、写真を送る",
 "JCBカード S":"担当の人と話しながら、カードを作る","転職サイトの電話登録":"電話で話しながら、転職サイトに登録する","カードローン モニター（5社）":"お金を借りて、1か月後に全部返す","男性クリニックの無料カウンセリング":"クリニックで無料の相談を受ける（男性）","docomo 乗り換え":"お店でdocomoに乗りかえる","高級時計 抽選・購入調査":"時計の抽選に申し込んで、当たったらお店へ","覆面調査":"お客さんとしてお店に行き、感想を報告する",
 "不動産査定（7社）":"家の値段を電話で調べてもらう（売らなくてOK）","土地活用の相談":"土地の使い道をZoomで相談する",
 "タマホーム フェア":"住宅展示場を1〜2時間見学する","持ち家計画":"住宅展示場を30分見学する"};
const plain=it=>PLAIN[it.n]||(CARDS.includes(it.n)?"クレジットカードを作る（年会費0円）":it.n);

const ICON={
 s1:'<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
 s2:'<circle cx="12" cy="12" r="8"/><path d="M12 7v10M9.5 9.5h4a1.8 1.8 0 010 3.5h-3a1.8 1.8 0 000 3.5h4"/>',
 s3:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>',
 s4:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
 s5:'<path d="M4 5h16v10H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'};
const STEPS=[
 {k:"s1",b:"1",l:"毎月\nもらう",h:"毎月もらえるのは、この2つ",w:"この2つだけで、毎月15,000〜20,000円",feat:["uketori","xm"],calc:[["商品を送り返す（1,000円×10〜15個）","10,000〜15,000円"],["FXのアプリ（説明を受けて始める）","5,000円"],["1か月の合計","15,000〜20,000円"]]},
 {k:"s2",b:"2",l:"1回\nもらう",h:"1回やるだけで、約50,000円",w:"登録だけと、10,000円入れてすぐ戻すもの",feat:["fx8","astro"]},
 {k:"s3",b:"3",l:"カード\n口座",h:"カードや銀行の口座を作るだけ",w:"作るだけでもらえる。最初にモッピー（無料）に登録",groups:MOP,moppy:1},
 {k:"s4",b:"4",l:"アプリ\n登録",h:"アプリに登録するだけ",w:"招待コードで登録するだけ",groups:OTH},
 {k:"s5",b:"5",l:"話を\n聞く",h:"話を聞いたり、見に行ったりする",w:"時間はかかるけど、1回の金額が大きい",feat:["hoken"],groups:MON}
];

const KEY="poikatsu-ichiran-done-v1",SK="poikatsu-ichiran-step",GK="poikatsu-ichiran-g";
let D={};try{D=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){D={}}
let CUR="s1";try{CUR=localStorage.getItem(SK)||"s1"}catch(e){}
if(!STEPS.find(s=>s.k===CUR))CUR="s1";
let GSEL={};try{GSEL=JSON.parse(localStorage.getItem(GK)||"{}")||{}}catch(e){GSEL={}}
let OPEN=null;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const yen=n=>n.toLocaleString("ja-JP");
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(D));localStorage.setItem(SK,CUR);localStorage.setItem(GK,JSON.stringify(GSEL))}catch(e){}};
const CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';

function ids(s){const a=[];(s.feat||[]).forEach(f=>a.push("f-"+F[f].n));(s.groups||[]).forEach(g=>g.items.forEach(it=>a.push(s.k+"-"+it.n)));return a}
const FV={uketori:{m:10000},xm:{m:5000},fx8:{o:40000},astro:{o:5000},hoken:{o:35000}};
const TM={uketori:"申し込み5分",xm:"メッセージを送るだけ",fx8:"フォーム入力5分",astro:"30分くらい",hoken:"1社1時間"};
const ORDER=(()=>{const a=["uketori","xm","fx8","astro","hoken"].map(k=>({k,id:"f-"+F[k].n}));
  const rest=[];STEPS.forEach(s=>(s.groups||[]).forEach(g=>g.items.forEach(it=>rest.push({it,s,id:s.k+"-"+it.n}))));
  rest.sort((x,y)=>x.it.e-y.it.e||y.it.v-x.it.v);return a.concat(rest)})();
const VAL=id=>{const f=Object.keys(F).find(k=>"f-"+F[k].n===id);if(f)return FV[f];const o=ORDER.find(x=>x.id===id);return o&&o.it?{o:o.it.v}:{}};
let SKIPT={};try{SKIPT=JSON.parse(localStorage.getItem("poikatsu-ichiran-skip")||"{}")||{}}catch(e){}
let UNLOCK=false;try{UNLOCK=localStorage.getItem("poikatsu-ichiran-unlock")==="1"}catch(e){}
const s1done=()=>ids(STEPS[0]).every(i=>D[i]);
const locked=k=>!UNLOCK&&!s1done()&&["s3","s4","s5"].includes(k);
const SL=[
 {k:"ポイ活ってなに？",h:"スマホだけでできる\n超かんたんな\nおこづかい稼ぎ",p:"アプリに登録したり、\n届いた物を送ったりするだけで、\nお金がもらえます"},
 {k:"もらえる見込み",pre:"毎月",num:"15,000〜20,000",unit:"円",p:"STEP1の2つをやると、\n毎月もらえます"},
 {k:"ほかにも、こんなことで",h:"もらえるものが\nたくさんあります",rows:[["資料を家に取り寄せるだけ","1,400〜3,500円"],["アプリに登録するだけ","1,000〜2,750円"],["銀行の口座を作るだけ","1,500〜20,000円"],["カードを作るだけ","2,400〜15,000円"]],p:"どれもスマホで、5〜30分ほどで終わります"},
 {k:"人と話す・見に行くだけでも",h:"もらえます",rows:[["保険の人の話を聞く","1社 5,000〜7,000円"],["家の値段を電話で聞く","1社 1,400〜4,200円"],["住宅展示場を見に行く","5,000〜20,000円"],["お客さんとしてお店を見る","2,000〜3,000円"]],p:"契約したり、買ったりしなくて大丈夫です"},
 {k:"あなたの合計見込み",num:"約__TOTAL__",unit:"円",sub:"＋ 毎月 15,000〜20,000円",p:"いろいろな案件を全部やった場合の目安です。\nできるものだけでもOK"},
 {k:"ひとりじゃない",h:"一緒に\n進められます",p:"わからないことは、\nいつでもLINEで相談できます。\n会える人は、となりで一緒に申し込めます"},
 {k:"まずはこれからやってね",h:"届いた商品を、\n送り返すだけ",chips:["申し込み5分","お金いらない","1個1,000円"]},
 {k:"やり方は3つだけ",list:["「申し込む」を押して、\n名前などを書く","届いた商品を、\n箱にまとめて送る","このページで\n「できた！」を押す"]},
 {k:"さあ、始めよう",h:"今日の1件は\n5分で終わります",p:"迷ったら、画面の一番下の\nボタンからLINEで相談",last:1}];
(function(){let r=35000;STEPS.slice(2).forEach(s=>(s.groups||[]).forEach(g=>g.items.forEach(it=>r+=it.v)));
  const rest=yen(Math.round(r/1000)*1000),tot=yen(Math.round((r+50000)/1000)*1000);
  SL.forEach(x=>{["num","p"].forEach(k=>{if(x[k])x[k]=x[k].replace("__TOTAL__",tot)});if(x.chips)x.chips=x.chips.map(c=>c.replace("__REST__",rest))});
  window.__TOT=tot;})();
let SI=0;
const CB="https://cdn.prod.website-files.com/69bcd664c814f802dfc1f9bc/";
const CH={zen:"6a0e7f9af1db89c3a6ae9065_00001.png",tora:"6a70266ae5f12c26d2a3d285_1.png",inu:"6a70266ac13831cf359778e7_2.png",kuma:"6a70266aa1ff6f59ec812945_3.png",kawauso:"6a70266ad1ab382fc10978ef_4.png",tanuki:"6a7026769e2205658e4dcf33_5.png",hari:"6a7026766ecb7a47b56ebb18_6.png",yagi:"6a7026762c071c03355c8bfe_7.png",shika:"6a702676a7841ebf741a64f4_8.png",usagi:"6a70268550fc4f50233a9ecd_9.png",iruka:"6a702685c809e1923ad83c99_10.png",pen:"6a70265dca6398021cf1f4f2_11.png",alpaca:"6a70262a50fc4f50233a8c22_12.png",ookami:"6a70262ab25c4707662d931f_13.png",flamingo:"6a70262aca6398021cf1e0db_14.png",ushi:"6a70262a9b897dc237d18d55_15.png",shimauma:"6a70262a6d2fe099771978d4_16.png"};
const img=(k,c)=>`<img class="${c}" src="${CB+CH[k]}" alt="" onerror="this.remove()">`;
const SC=["yagi","kuma","usagi","inu","zen",["kuma","yagi"],"kawauso","yagi","kuma"];
const STAMP=["tora","tanuki","hari","alpaca","ookami","flamingo","ushi","shimauma","iruka","pen"];
const PC={s1:"kuma",s2:"pen",s3:"usagi",s4:"iruka",s5:"shika"};
const br=t=>esc(t).replace(/\n/g,"<br>");
function slide(){const x=SL[SI],el=document.getElementById("pk-slide");
  const sc=SC[SI]||"yagi",big=sc==="zen";
  let h=`<div class="cchrs${big?" big":""}">${(Array.isArray(sc)?sc:[sc]).map(k=>img(k,"cchr")).join("")}</div><span class="ck">${esc(x.k)}</span>`;
  if(x.h)h+=`<div class="ch">${br(x.h)}</div>`;
  if(x.num)h+=`<div class="cnum">${x.pre?`<span class="pre">${esc(x.pre)}</span>`:""}<span class="n${x.num.length>8?" long":""}">${esc(x.num)}<small>${esc(x.unit)}</small></span></div>`;
  if(x.sub)h+=`<div class="csub">${esc(x.sub)}</div>`;
  if(x.chips)h+=`<div class="cc">${x.chips.map(c=>`<span>${esc(c)}</span>`).join("")}</div>`;
  if(x.rows)h+=`<ul class="crows">${x.rows.map(r=>`<li><span>${esc(r[0])}</span><b>${esc(r[1])}</b></li>`).join("")}</ul>`;
  if(x.list)h+=`<ol class="cli">${x.list.map((c,i)=>`<li><b>${i+1}</b><span>${br(c)}</span></li>`).join("")}</ol>`;
  if(x.p)h+=`<p class="cn">${br(x.p)}</p>`;
  h+=`<div class="dots">${SL.map((_,i)=>`<i class="${i===SI?"on":""}"></i>`).join("")}</div>`;
  h+=`<span class="cgo" aria-hidden="true">${x.last?"タップして始める":"タップして次へ"}</span>`;
  if(!x.last)h+=`<button type="button" class="skip2" data-skip2="1">説明をとばして、すぐ始める</button>`;
  el.innerHTML=h;el.classList.remove("pop2");void el.offsetWidth;el.classList.add("pop2");}
function showCover(on){const c=document.getElementById("pk-cover");
  if(on){SI=0;slide();c.classList.remove("out");c.hidden=false;document.documentElement.style.overflow="hidden";return}
  const fin=()=>{c.hidden=true;document.documentElement.style.overflow="";const m=document.getElementById("pk-main");m.classList.remove("in");void m.offsetWidth;m.classList.add("in")};
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){fin();return}
  c.classList.add("out");setTimeout(fin,320);}
const cov=document.getElementById("pk-cover");
const nextSlide=()=>{if(SI<SL.length-1){SI++;slide()}else showCover(false)};
cov.addEventListener("click",e=>{if(e.target.closest("[data-skip2]")){showCover(false);return}nextSlide()});
cov.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();nextSlide()}});
document.getElementById("pk-skipBtn").addEventListener("click",e=>{e.stopPropagation();showCover(false)});
document.getElementById("pk-hmTot").textContent=`＋ 全部やると合計 約${window.__TOT}円`;
document.getElementById("pk-openCover").addEventListener("click",()=>showCover(true));
window.__pkCover=showCover;
function stamps(){const n=Object.keys(D).length,N=10,k=Math.min(n,N);
  document.getElementById("pk-stamps").innerHTML=`<span class="sl">スタンプカード ${n}/${N}</span><div class="sg">${Array.from({length:N},(_,i)=>`<i class="${i<k?"on":""}">${i<k?img(STAMP[i],"sti"):i+1}</i>`).join("")}</div>`;}
function level(){const n=Object.keys(D).length,s1=ids(STEPS[0]).filter(i=>D[i]).length,s2=ids(STEPS[1]).every(i=>D[i]);
  let b,m;
  if(n===0){b="スタート前";m="まずは今日の1件から。申し込みは5分で終わります"}
  else if(s1<2){b="はじめの一歩";m=`いいスタートです。あと${2-s1}つで毎月もらえるようになります`}
  else if(!s2){b="毎月もらえる人";m="毎月の分ができました。次はSTEP2で1回約50,000円"}
  else if(n<10){b="STEP2クリア";m=`STEP2まで完了。できた数${n}こ。10こで次のランクです`}
  else{b="ポイ活上手";m=`できた数${n}こ。ここまで来た人はかなり少ないです`}
  document.getElementById("pk-lvBadge").textContent=b;document.getElementById("pk-lvMsg").textContent=m;}
let lastM=0,cuT=null;
function countUp(el,to){const from=lastM;lastM=to;if(from===to||matchMedia("(prefers-reduced-motion: reduce)").matches){el.textContent=`毎月 ${yen(to)}円`;return}
  const t0=performance.now(),dur=700;cancelAnimationFrame(cuT);el.classList.remove("bump");void el.offsetWidth;el.classList.add("bump");
  const step=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=`毎月 ${yen(Math.round(from+(to-from)*e))}円`;if(k<1)cuT=requestAnimationFrame(step)};cuT=requestAnimationFrame(step);}
function money(){let m=0,o=0;Object.keys(D).forEach(id=>{const v=VAL(id);m+=v.m||0;o+=v.o||0});
  countUp(document.getElementById("pk-moneyM"),m);
  document.getElementById("pk-moneyO").textContent=o?`＋ 1回だけ ${yen(o)}円`:"";
  document.getElementById("pk-bar2").style.width=Math.min(100,m/20000*100)+"%";}
function today(){
  const el=document.getElementById("pk-today");
  const next=ORDER.find(x=>!D[x.id]&&!SKIPT[x.id])||ORDER.find(x=>!D[x.id]);
  if(!next){el.innerHTML=`<div class="today all"><h2>全部できました</h2><span>おつかれさまでした。新しい案件が入ったらLINEでお知らせします。</span></div>`;return}
  let h;
  if(next.k){const f=F[next.k],v=FV[next.k];
    h=`<div class="today">${img("yagi","tchr")}<span class="tt">今日やること</span><h2>${esc(f.p)}</h2><span class="of">${esc(f.n)}</span>
      <div class="tam">${esc(f.a)}</div><div class="tchips"><span>${TM[next.k]}</span><span>${v.m?"毎月もらえる":"1回もらえる"}</span></div>
      <div class="steps3">${f.s.map((x,i)=>`<div><b>${i+1}</b>${esc(x)}</div>`).join("")}</div>
      <details class="guide tg2"><summary>くわしいやり方を見る</summary><ol>${f.g.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></details>
      ${f.fx?fxFlow():`<a class="btn go" href="${f.u}" target="_blank" rel="noopener">${esc(f.b)}</a>`}`;
  }else{const it=next.it,s=next.s;
    const go=it.links?it.links[0][1]:it.u;
    h=`<div class="today">${img("yagi","tchr")}<span class="tt">今日やること</span><h2>${esc(plain(it))}</h2><span class="of">${esc(it.n)}</span>
      <div class="tam">${esc(it.a)}</div><div class="tchips"><span>${EZ[it.e]}</span><span>${it.m==="0円"?"お金いらない":"最初に "+esc(it.m)}</span></div>
      <a class="btn go" href="${go}" target="_blank" rel="noopener">${s.moppy?"モッピーで申し込む":"申し込む"}</a>`;}
  h+=`<div class="tb"><button type="button" class="ok" data-done="${esc(next.id)}">できた！</button><button type="button" data-skip="${esc(next.id)}">ほかのにする</button></div></div>`;
  el.innerHTML=h;
}
let tt=null;
function toast(id){const v=VAL(id);const t=document.getElementById("pk-toast");const amt=v.m?`＋${yen(v.m)}円（毎月）`:v.o?`＋${yen(v.o)}円`:"できた！";
  t.textContent=amt+" 受け取る予定に入りました";t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2600);}
function stepTabs(){
  document.getElementById("pk-steps").innerHTML=STEPS.map(s=>{const a=ids(s),d=a.filter(i=>D[i]).length,lk=locked(s.k);
    return `<button type="button" class="st ${s.k}${d>0?" clear":""}" role="tab" data-s="${s.k}" aria-selected="${s.k===CUR}"><span class="sb">STEP${s.b}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${lk?'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>':ICON[s.k]}</svg><span>${s.l.replace("\n","<br>")}</span><small>${lk?"あとで":d+"/"+a.length}</small></button>`}).join("");
}
// ===== FX：連絡のしかた =====
// 個人LINEの友だち追加URL（LINE → ホーム右上の友だち追加 → QRコード → マイQRコード → リンクをコピー）
const FX_LINE="ここに個人LINEのURL";
// Cloudflare Worker（finbook-fx）の受け口。ボタンが押されたら記録される
const FX_HOOK="https://finbook-fx.toasovie-unei888.workers.dev/fx";
const FX_TPL=n=>`初めまして！\n${n||"◯◯"}です！\nおかねの図書館のサイトからFXの件でご連絡しました！\n\n宜しくお願い致します🙇`;
let FXN="",MEM={};try{FXN=localStorage.getItem("pk-fxname")||""}catch(_){}
try{if(window.$memberstackDom)window.$memberstackDom.getCurrentMember().then(r=>{const m=r&&r.data;if(!m)return;MEM={id:m.id,email:m.auth&&m.auth.email};
  const cf=m.customFields||{};if(!FXN){FXN=cf["first-name"]||cf["name"]||"";document.querySelectorAll(".fxname").forEach(x=>{x.value=FXN});fxSync()}}).catch(()=>{})}catch(_){}
function fxFlow(){return `<div class="fxf">
  <label class="fl"><b>1</b>名前を入れる</label><input class="fxname" type="text" inputmode="text" autocomplete="name" placeholder="例：山田花子" value="${esc(FXN)}" aria-label="名前">
  <span class="fl"><b>2</b>このメッセージをコピー</span><div class="fxmsg">${br(FX_TPL(FXN))}</div>
  <button type="button" class="btn fxcopy" data-fxcopy="1">メッセージをコピーする</button><span class="fxok" aria-live="polite"></span>
  <span class="fl"><b>3</b>LINEを追加して、貼り付けて送る</span>
  <a class="btn btn-line fxgo" href="${FX_LINE.startsWith("http")?FX_LINE:"#"}" target="_blank" rel="noopener" data-fxgo="1">${FX_LINE.startsWith("http")?"LINEを追加する":"LINEのURLを準備中です"}</a>
</div>`}
function fxSync(){document.querySelectorAll(".fxmsg").forEach(x=>{x.innerHTML=br(FX_TPL(FXN))})}
document.addEventListener("input",e=>{if(!e.target.classList.contains("fxname"))return;FXN=e.target.value.trim();try{localStorage.setItem("pk-fxname",FXN)}catch(_){}
  document.querySelectorAll(".fxname").forEach(x=>{if(x!==e.target)x.value=e.target.value});fxSync()});
document.addEventListener("click",e=>{
  const c=e.target.closest("[data-fxcopy]");
  if(c){const t=FX_TPL(FXN),ok=c.parentNode.querySelector(".fxok");
    const done=()=>{if(ok)ok.textContent="コピーしました。LINEのトークに貼り付けてください"};
    const fb=()=>{const m=c.parentNode.querySelector(".fxmsg");const r=document.createRange();r.selectNodeContents(m);const sel=getSelection();sel.removeAllRanges();sel.addRange(r);if(ok)ok.textContent="文字を長押ししてコピーしてください"};
    if(!FXN&&ok){ok.textContent="先に名前を入れてください";return}
    try{navigator.clipboard.writeText(t).then(done,fb)}catch(_){fb()}return}
  const g=e.target.closest("[data-fxgo]");
  if(g){if(!FX_LINE.startsWith("http")){e.preventDefault();return}
    if(FX_HOOK.startsWith("http")){const body=JSON.stringify({case:"FX（XM・HFM）",name:FXN,memberId:MEM.id||"",email:MEM.email||"",at:new Date().toISOString()});
      try{if(!(navigator.sendBeacon&&navigator.sendBeacon(FX_HOOK,new Blob([body],{type:"text/plain"}))))fetch(FX_HOOK,{method:"POST",body,mode:"no-cors",keepalive:true})}catch(_){}}}
});
function feat(key){
  const f=F[key],id="f-"+f.n,dn=!!D[id];
  return `<div class="feat${f.mon?" mon":""}">
    <div class="ft"><div><h3>${esc(f.p)}</h3><div class="of">${esc(f.n)}</div></div><div class="amt">${esc(f.a)}</div></div>
    <div class="steps3">${f.s.map((x,i)=>`<div><b>${i+1}</b>${esc(x)}</div>`).join("")}</div>
    <div class="note">${esc(f.c)}</div>
    <details class="guide"><summary>くわしいやり方を見る</summary><ol>${f.g.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></details>
    ${f.fx?fxFlow():""}
    <div class="fa">${f.fx?"<span></span>":`<a class="btn ${f.cls}" href="${f.u}" target="_blank" rel="noopener">${esc(f.b)}</a>`}<button type="button" class="btn btn-done" data-done="${esc(id)}" aria-pressed="${dn}">${dn?"できた":"できたら押す"}</button></div>
  </div>`;
}
function row(it,s){
  const id=s.k+"-"+it.n,dn=!!D[id],op=OPEN===id;
  const go=it.links?`<div class="links">${it.links.map(l=>`<a href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])}</a>`).join("")}</div>`:
    `<a class="btn ${s.moppy?"btn-moppy":(it.r==="kc"||it.r==="line"?"btn-line":"btn-go")}" href="${it.u}" target="_blank" rel="noopener">${s.moppy?"モッピーで申し込む":(it.r==="kc"?"LINEで相談する":it.r==="line"?"LINEから申し込む":"申し込む")}</a>`;
  return `<div class="row${dn?" done":""}${op?" open":""}">
    <div class="row-l"><button type="button" class="dot" data-done="${esc(id)}" aria-pressed="${dn}" aria-label="${esc(it.n)}をやった"><i>${CHECK}</i></button>
      <button type="button" class="row-h" data-open="${esc(id)}" aria-expanded="${op}"><span><span class="rn">${esc(plain(it))}</span><span class="rm"><span class="tg ${it.m==="0円"?"free":"pay"}">${it.m==="0円"?"お金いらない":"最初に "+esc(it.m)}</span><span class="of">${esc(it.n)}</span></span></span><span class="ra">${esc(it.a)}</span><span class="chev" aria-hidden="true"></span></button></div>
    ${op?`<div class="row-b"><div class="do">${esc(it.d)}</div><div class="kv"><span>もらえる時期：${esc(it.w)}</span><span>かかる時間：${EZ[it.e]}</span></div>${it.c?`<div class="note">${esc(it.c)}</div>`:""}${go}</div>`:""}
  </div>`;
}
function pane(){
  const s=STEPS.find(x=>x.k===CUR),i=STEPS.indexOf(s);
  if(locked(s.k)){const P=document.getElementById("pk-pane");P.className="pane "+s.k;P.innerHTML=`<div class="phead"><span class="sn">STEP${s.b}</span><h2>${esc(s.h)}</h2></div><div class="lock"><b>STEP1の2つが終わると開きます</b><span>まずは毎月もらえる2つから。一度にたくさん見ると迷ってしまうので、順番にしています。</span><button type="button" data-unlock="1">それでも先に見る</button></div>`;return}
  let h=`<div class="phead">${img(PC[s.k],"pchr")}<span class="sn">STEP${s.b}</span><h2>${esc(s.h)}</h2><p class="why">${esc(s.w)}</p></div>`;
  if(s.calc)h+=`<div class="calc">${s.calc.map((c,j)=>`<div${j===s.calc.length-1?' class="sum"':""}><span>${esc(c[0])}</span><span>${esc(c[1])}</span></div>`).join("")}</div>`;
  if(s.moppy)h+=`<div class="helper one"><a href="${MOPPY_JOIN}" target="_blank" rel="noopener"><b>最初にモッピーに無料登録（3分）</b><span>ここの案件は全部モッピーから申し込みます</span></a></div>`;
  (s.feat||[]).forEach(k=>h+=feat(k));
  if(s.groups&&s.groups.length){
    let g=GSEL[s.k];if(!s.groups.find(x=>x.t===g))g=s.groups[0].t;
    const G=s.groups.find(x=>x.t===g),tot=G.items.reduce((a,x)=>a+x.v,0);
    h+=`<div class="gchips" role="group" aria-label="ジャンル">${s.groups.map(x=>`<button type="button" class="gchip" data-g="${esc(x.t)}" aria-pressed="${x.t===g}">${esc(x.t)} ${x.items.length}</button>`).join("")}</div>`;
    if(tot)h+=`<p class="gd">${G.items.length}件で 約${yen(tot)}円</p>`;
    h+=`<div class="rows">${G.items.map(it=>row(it,s)).join("")}</div>`;
  }
  if(i<STEPS.length-1)h+=`<div class="next"><button type="button" class="btn" data-s="${STEPS[i+1].k}">次はSTEP${STEPS[i+1].b}：${esc(STEPS[i+1].h)}</button></div>`;
  const P=document.getElementById("pk-pane");P.className="pane "+s.k;P.innerHTML=h;void P.offsetWidth;P.classList.add("in");
}
function render(){money();level();stamps();today();stepTabs();pane();}
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-s],[data-done],[data-open],[data-g],[data-skip],[data-unlock]");if(!t)return;
  if(t.dataset.skip){SKIPT[t.dataset.skip]=1;try{localStorage.setItem("poikatsu-ichiran-skip",JSON.stringify(SKIPT))}catch(_){}today();return}
  if(t.dataset.unlock){UNLOCK=true;try{localStorage.setItem("poikatsu-ichiran-unlock","1")}catch(_){}render();return}
  if(t.dataset.s){CUR=t.dataset.s;OPEN=null;save();render();document.getElementById("pk2").scrollIntoView({behavior:"smooth"});return}
  if(t.dataset.done){const id=t.dataset.done;if(D[id])delete D[id];else{D[id]=1;toast(id)}save();render();return}
  if(t.dataset.open){OPEN=OPEN===t.dataset.open?null:t.dataset.open;pane();return}
  if(t.dataset.g){GSEL[CUR]=t.dataset.g;OPEN=null;save();pane();}
});
render();

}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
