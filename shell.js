/* shell.js - Quiz Studio helpers that studio.js expects from its host page:
   1) window.IQADM  : who counts as an admin in the browser (the REAL check is firestore.rules - keep both lists the same)
   2) window.IQAUTH : Google sign-in. Normal browser = pop-up. Android app / Windows app = the real browser opens this same site
                      with ?iqlink=CODE, you sign in there, and the app picks the sign-in up through Firestore (authlink/{code}). */
(function(){var C=window.IQ_CONFIG||{},list=(C.admins||[]).map(function(x){return String(x).trim().toLowerCase();}).filter(Boolean);
window.IQADM={isAdminEmail:function(m){m=String(m||'').trim().toLowerCase();return !!m&&list.indexOf(m)>=0;},isMaster:function(){return false;},unlocked:function(){return false;}};})();
(function(){'use strict';
if(window.IQAUTH)return;
var CFG=(window.IQ_CONFIG&&window.IQ_CONFIG.firebase)||{};
var BASE='https://www.gstatic.com/firebasejs/10.12.2/';
/* the address of the hosted web copy of this app (GitHub Pages), e.g. https://yourname.github.io/yourrepo/ */
var WEB_URL=String((window.IQ_CONFIG&&window.IQ_CONFIG.publicUrl)||'').replace(/\s+/g,'');if(/YOUR-SITE/i.test(WEB_URL))WEB_URL='';
var TTL=4*60*1000;
function native(){try{return !!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());}catch(e){return false;}}
function embedded(){return native()||/; wv\)|\bwv\b|FBAN|FBAV|Instagram|Electron/i.test(navigator.userAgent||'');}
function plug(n){try{return(window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins[n])||null;}catch(e){return null;}}
function err(c,m){var e=new Error(m||c);e.code=c;return e;}
function webUrl(){return WEB_URL||(native()?'':location.origin+location.pathname);}
function rnd(){var a=new Uint8Array(16);(window.crypto||window.msCrypto).getRandomValues(a);return Array.prototype.map.call(a,function(x){return('0'+x.toString(16)).slice(-2);}).join('');}
function el(tag,st,txt){var e=document.createElement(tag);if(st)e.setAttribute('style',st);if(txt!=null)e.textContent=txt;return e;}
var BTN='font:600 15px system-ui,sans-serif;padding:11px 18px;border-radius:12px;border:1px solid #c9d0e6;background:#fff;color:#16204a;cursor:pointer;margin:6px 6px 0 0';
var BTNP='font:700 15px system-ui,sans-serif;padding:11px 18px;border-radius:12px;border:0;background:#2338c9;color:#fff;cursor:pointer;margin:6px 6px 0 0';
function sheet(title,text){
  var ov=el('div','position:fixed;inset:0;z-index:2147483647;background:rgba(10,16,40,.62);display:flex;align-items:center;justify-content:center;padding:18px;font-family:system-ui,sans-serif');
  var c=el('div','background:#fff;color:#16204a;border-radius:18px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.35)');
  var h=el('div','font:800 19px system-ui,sans-serif;margin-bottom:8px',title),p=el('div','font:500 15px/1.5 system-ui,sans-serif;color:#33406b',text),row=el('div','margin-top:14px');
  c.append(h,p,row);ov.append(c);document.body.append(ov);
  return{row:row,text:function(t){p.textContent=t;},title:function(t){h.textContent=t;},close:function(){try{ov.remove();}catch(e){}},btn:function(label,fn,primary){var b=el('button',primary?BTNP:BTN,label);b.type='button';b.addEventListener('click',fn);row.append(b);return b;}};}

/* ---- installed app: sign in with the phone's own browser, then pick the sign-in up here ---- */
function viaPlugin(au,auth,P){
  return P.signInWithGoogle({skipNativeAuth:true}).then(function(r){
    var c=(r&&r.credential)||{};if(!c.idToken&&!c.accessToken)throw err('iq/no-token','Google did not return a sign-in token.');
    return au.signInWithCredential(auth,au.GoogleAuthProvider.credential(c.idToken||null,c.accessToken||null));});}
function relay(au,auth){
  var base=webUrl();
  if(!base){return new Promise(function(res,rej){var s=sheet('One setting is missing','This app needs the address of its web copy to sign in with Google from inside the app. Please ask the app owner to set it (publicUrl in config.js).');s.btn('OK',function(){s.close();rej(err('auth/popup-closed-by-user'));},true);});}
  var code=rnd(),url=base+(base.indexOf('?')<0?'?':'&')+'iqlink='+code;
  return import(BASE+'firebase-firestore.js').then(function(fs){
    var ref=fs.doc(fs.getFirestore(auth.app),'authlink',code);
    return new Promise(function(res,rej){
      var done=false,tm=0,t0=Date.now();
      var ui=sheet('Sign in with Google','Your browser is opening. Sign in there, then come back to this app. It will continue by itself.');
      function end(fn,v){if(done)return;done=true;clearTimeout(tm);try{document.removeEventListener('visibilitychange',wake);window.removeEventListener('focus',wake);}catch(e){}ui.close();fn(v);}
      function wake(){if(done||document.hidden)return;clearTimeout(tm);poll();}
      function open(){var B=plug('Browser');try{if(B&&B.open){B.open({url:url});return;}}catch(e){}try{window.open(url,'_blank');}catch(e){}}
      ui.btn('Open browser again',open,true);
      ui.btn('Cancel',function(){end(rej,err('auth/popup-closed-by-user'));});
      open();
      var busyP=false;
      var poll=function(){
        if(done||busyP)return;
        if(Date.now()-t0>TTL){end(rej,err('auth/popup-closed-by-user','Sign-in timed out.'));return;}
        busyP=true;
        fs.getDoc(ref).then(function(s){
          busyP=false;
          if(done)return;
          var d=s.exists()?(s.data()||{}):null;
          if(d&&d.idToken){
            busyP=true;fs.deleteDoc(ref).catch(function(){});
            var B=plug('Browser');try{if(B&&B.close)B.close();}catch(e){}
            au.signInWithCredential(auth,au.GoogleAuthProvider.credential(d.idToken)).then(function(r){end(res,r);},function(e){end(rej,e);});
            return;}
          tm=setTimeout(poll,1200);
        }).catch(function(){busyP=false;tm=setTimeout(poll,2500);});
      };
      document.addEventListener('visibilitychange',wake);window.addEventListener('focus',wake);
      poll();
    });});}

function signIn(au,auth){
  var P=plug('FirebaseAuthentication');
  if(native()&&P&&P.signInWithGoogle)return viaPlugin(au,auth,P);
  if(embedded())return relay(au,auth);
  var p=new au.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
  return au.signInWithPopup(auth,p);}
function signOut(au,auth){
  var P=plug('FirebaseAuthentication');try{if(native()&&P&&P.signOut)P.signOut().catch(function(){});}catch(e){}
  return au.signOut(auth);}

/* ---- the web copy, opened by the app with ?iqlink=code: sign in here and hand the sign-in back ---- */
function linkMode(){
  var m=/[?&]iqlink=([0-9a-f]{16,64})(?:&|$)/.exec(location.search);if(!m||native())return;
  var code=m[1],s=sheet('Link your app','Tap the button, choose your Google account, then return to the Quiz Studio.');
  s.btn('Sign in with Google',function(){
    s.text('Signing in\u2026');
    Promise.all([import(BASE+'firebase-app.js'),import(BASE+'firebase-auth.js'),import(BASE+'firebase-firestore.js')]).then(function(a){
      var app=a[0].getApps().length?a[0].getApp():a[0].initializeApp(CFG),au=a[1],fs=a[2],auth=au.getAuth(app),p=new au.GoogleAuthProvider();
      p.setCustomParameters({prompt:'select_account'});
      return au.signInWithPopup(auth,p).then(function(r){
        var c=au.GoogleAuthProvider.credentialFromResult(r);if(!c||!c.idToken)throw err('iq/no-token');
        return fs.setDoc(fs.doc(fs.getFirestore(app),'authlink',code),{idToken:c.idToken,t:Date.now()});});
    }).then(function(){s.title('Done');s.text('You are signed in. Go back to the Quiz Studio now; it continues by itself.');s.row.replaceChildren();if(/Android/i.test(navigator.userAgent||'')){var bk='intent://signin#Intent;scheme=iqquizstudio;end';s.btn('Open Quiz Studio',function(){location.href=bk;},true);try{location.href=bk;}catch(e){}}})
    .catch(function(e){s.title('Could not sign in');s.text((e&&e.code==='permission-denied')?'The cloud rules do not allow this yet. The app owner must publish the authlink rule.':'Please try again ('+((e&&e.code)||'error')+').');});
  },true);
}
window.IQAUTH={signIn:signIn,signOut:signOut,native:native,embedded:embedded};

if(document.body)linkMode();else document.addEventListener('DOMContentLoaded',linkMode);
})();
