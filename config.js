/* ===========================================================================================
   config.js  -  THE ONLY FILE YOU NEED TO EDIT.
   =========================================================================================== */
window.IQ_CONFIG = {

  firebase: {
    apiKey:            "AIzaSyD0p0PtUFHjGbm-Fh80F9KP8e4YpvXyxyc",
    authDomain:        "iqra-quiz.firebaseapp.com",
    projectId:         "iqra-quiz",
    storageBucket:     "iqra-quiz.firebasestorage.app",
    messagingSenderId: "972580275825",
    appId:             "1:972580275825:web:085dc2e2d47ee746597dd0"
  },

  publicUrl: "https://iqra-quiz.pages.dev/",

  brand: "IQRA QUIZ",

  admins: ["zahidulislam1801@gmail.com", "iqravocab@gmail.com"],

  /* Push alerts: Web Push public key from Firebase > Cloud Messaging */
  vapidKey: "BExzaXQS4XqK2eymbgu2duhLSja80WEDfh35XpQ_BNMFzu8eS7Zk8Kn4poZk6bI8n3x6GBBlzxyT0e9uxeKxF1o",

  /* App update centre: GitHub repo that holds the Releases */
  updater: { repo: "zahidulislam1801/iqra-quiz-only" }
};
