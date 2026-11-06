/* ===========================================================================================
   config.js  -  THE ONLY FILE YOU NEED TO EDIT (3 things).
   =========================================================================================== */
window.IQ_CONFIG = {

  /* 1) FIREBASE: Firebase Console > Project settings (gear icon) > General > "Your apps" > Web app > "SDK setup and configuration" > Config.
        Copy the values from there and paste them between the quotes.                                                              */
  firebase: {
    apiKey:            "PASTE_API_KEY_HERE",
    authDomain:        "PASTE_PROJECT_ID.firebaseapp.com",
    projectId:         "PASTE_PROJECT_ID",
    storageBucket:     "PASTE_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "PASTE_SENDER_ID",
    appId:             "PASTE_APP_ID"
  },

  /* 2) YOUR WEBSITE ADDRESS (the Cloudflare Pages address, with https:// and a / at the end).
        Quiz links, QR codes and the Android / Windows sign-in use it.  Already set for you.                    */
  publicUrl: "https://iqra-quiz.pages.dev/",

  /* 3) ADMINS: Google e-mails that may open the studio and make quizzes (lower-case).
        The SAME e-mails must also be in firestore.rules (see SETUP.md). The rules are the real lock; this list only hides the studio. */
  /* (optional) The name printed on PDFs, papers and certificates. */
  brand: "IQRA QUIZ",

  admins: ["zahidulislam1801@gmail.com", "iqravocab@gmail.com"]
};
