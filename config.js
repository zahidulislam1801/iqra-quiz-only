/* ===========================================================================================
   config.js  -  THE ONLY FILE YOU NEED TO EDIT (3 things).
   =========================================================================================== */
window.IQ_CONFIG = {

  /* 1) FIREBASE: Firebase Console > Project settings (gear icon) > General > "Your apps" > Web app > "SDK setup and configuration" > Config.
        Copy the values from there and paste them between the quotes.                                                              */
  firebase: {
    apiKey:            "AIzaSyD0p0PtUFHjGbm-Fh80F9KP8e4YpvXyxyc",
    authDomain:        "iqra-quiz.firebaseapp.com",
    projectId:         "iqra-quiz",
    storageBucket:     "iqra-quiz.firebasestorage.app",
    messagingSenderId: "972580275825",
    appId:             "1:972580275825:web:085dc2e2d47ee746597dd0"
  },

  /* 2) YOUR WEBSITE ADDRESS (the Cloudflare Pages address, with https:// and a / at the end).
        Quiz links, QR codes and the Android / Windows sign-in use it.  Already set for you. */
  publicUrl: "https://iqra-quiz.pages.dev/",

  /* (optional) The name printed on PDFs, papers and certificates. */
  brand: "IQRA QUIZ",

  /* 3) ADMINS: Google e-mails that may open the studio and make quizzes (lower-case).
        The SAME e-mails must also be in firestore.rules. The rules are the real lock; this list only hides the studio. */
  admins: ["zahidulislam1801@gmail.com", "iqravocab@gmail.com"]
};
