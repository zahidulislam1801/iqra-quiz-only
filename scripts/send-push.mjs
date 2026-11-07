import admin from 'firebase-admin';
admin.initializeApp({credential:admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))});
const db=admin.firestore(),meta=db.doc('meta/push');
const last=(await meta.get()).data()?.last||Date.now()-6*60*1000,now=Date.now();
const toks=(await db.collection('push_tokens').get()).docs.map(d=>({uid:d.id,...d.data()}));
const pick=a=>toks.filter(t=>a==='all'||t.role===a||(a.startsWith('cls:')&&t.cls===a.slice(4)));
async function send(list,n){const tokens=[...new Set(list.map(t=>t.token))];if(!tokens.length)return;
  const r=await admin.messaging().sendEachForMulticast({tokens,data:{title:String(n.title||'New notice'),body:String(n.body||'').slice(0,180)}});
  r.responses.forEach((x,i)=>{if(!x.success&&/not-registered|invalid/.test(x.error?.code||''))db.collection('push_tokens').where('token','==',tokens[i]).get().then(s=>s.forEach(d=>d.ref.delete()));});}
for(const d of (await db.collection('notices').where('at','>',last).get()).docs){const n=d.data();if(n.exp&&n.exp<now)continue;await send(pick(n.aud||'all'),n);}
try{for(const d of (await db.collectionGroup('inbox').where('at','>',last).get()).docs){const u=d.ref.parent.parent.id;await send(toks.filter(t=>t.uid===u),d.data());}}catch(e){console.log('inbox skipped:',e.message);}
await meta.set({last:now});
