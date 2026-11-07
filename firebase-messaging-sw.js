importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:'AIzaSyD0p0PtUFHjGbm-Fh80F9KP8e4YpvXyxyc',authDomain:'iqra-quiz.firebaseapp.com',projectId:'iqra-quiz',messagingSenderId:'972580275825',appId:'1:972580275825:web:085dc2e2d47ee746597dd0'});
const m=firebase.messaging();
m.onBackgroundMessage(p=>{const d=p.data||{};self.registration.showNotification(d.title||'New notice',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png'});});
