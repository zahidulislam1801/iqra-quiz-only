# Quiz Studio: Complete Setup Guide

After this guide you will have:
- A **website** at `https://iqra-quiz.pages.dev` (Cloudflare Pages). Admins build quizzes there, and learners open quiz links there.
- An **Android APK** (built automatically by GitHub).
- A **Windows app (.exe)** (built automatically by GitHub).

Everything runs on free plans. You do not need to write code. You only click, copy and paste.
Set aside about 40 to 60 minutes for the first time.

## The order of work

| Step | What you do | Where |
|---|---|---|
| 1 | Create a new GitHub repository and upload these files | github.com |
| 2 | Create the Firebase project (login + database) | console.firebase.google.com |
| 3 | Create a Cloudflare account and publish the site | dash.cloudflare.com |
| 4 | Put your Firebase details into `config.js` and allow your site address in Firebase | GitHub + Firebase |
| 5 | Test the site | your site |
| 6 | Build the Android APK | GitHub Actions |
| 7 | Build the Windows app | GitHub Actions |

Do the steps in this order. Step 4 needs information from steps 2 and 3.

---

## Step 1: Create the GitHub repository

Do not touch your old `iqravocab` repository, except to copy logo files out of it. The new project is a separate repository.

1. Sign in at https://github.com.
2. Click the **+** at the top right, then **New repository**.
3. Repository name: `iqra-quiz-studio`.
4. Choose **Private**. (Private is needed for the Android signing key in step 6.)
5. Leave everything else unticked and click **Create repository**.
6. On the empty repository page click the link **uploading an existing file**.
7. Drag all the files and folders I gave you into the page, keeping the same folder structure. The top level of the repository must show: `index.html`, `config.js`, `studio.js`, `shell.js`, `sw.js`, `manifest.webmanifest`, `firestore.rules`, `package.json`, `capacitor.config.json`, `_headers`, `.github` and `desktop`.
   - Files inside `.github/workflows/` and `desktop/` need those folders. If you can only upload single files, use **Add file > Create new file** and type the path in the name box, for example `.github/workflows/android.yml` (typing `/` creates a folder), then paste the contents.
8. **Copy your app logo files** from your old `iqravocab` repository into this new repository (download them from the old repo, then upload them here at the top level). These five files are needed:
   - `icon-192.png`
   - `icon-512.png`
   - `icon-maskable-512.png`
   - `apple-touch-icon.png`
   - `logo.svg`

   This is what makes Quiz Studio use the same logo as your IQRA VOCAB app. The Android and Windows builds will stop with a clear message if any of them is missing.
9. Click **Commit changes**.

---

## Step 2: Create the Firebase project

Firebase gives you Google login and the database that stores quizzes and results.

### 2.1 Create the project
1. Open https://console.firebase.google.com and sign in with Google.
2. Click **Create a project** (or **Add project**).
3. Name: `iqra-quiz-studio`, then **Continue**.
4. Turn **Google Analytics** off, then **Create project**. Click **Continue** when it finishes.

### 2.2 Add a web app (this gives you your config values)
1. On the project home page click the **`</>`** (Web) icon.
2. App nickname: `Quiz Studio Web`.
3. Do **not** tick Firebase Hosting. Click **Register app**.
4. You will see a code box with `const firebaseConfig = { apiKey: "...", authDomain: "...", ... }`.
5. Copy these six values into a notepad: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
6. Click **Continue to console**.

You can see them again later at: gear icon > **Project settings** > **General** > **Your apps**.

### 2.3 Turn on Google sign-in
1. Left menu: **Build > Authentication** > **Get started**.
2. Open the **Sign-in method** tab and click **Google**.
3. Switch **Enable** on.
4. Choose your Gmail as the **Project support email**.
5. Click **Save**.

### 2.4 Create the database (Firestore)
1. Left menu: **Build > Firestore Database** > **Create database**.
2. Choose a location close to your users, for example `asia-south1 (Mumbai)`. It cannot be changed later.
3. Click **Next**, choose **Start in production mode**, then **Create**.

### 2.5 Paste the security rules
1. In Firestore open the **Rules** tab.
2. Delete everything in the box (Ctrl+A, then Delete).
3. Open `firestore.rules` from your GitHub repository, copy all of it and paste it into the box.
4. Find this line:
   ```
   function isMaster() { return signed() && me() in ['zahidulislam1801@gmail.com','iqravocab@gmail.com']; }
   ```
   Inside the square brackets, put the Gmail address(es) of your admins, lower case, each in single quotes and separated by commas. The Gmail you will use to build quizzes must be in this list.
5. Click **Publish**.

Only the Gmail addresses in this list can create quizzes. Everyone else can only open a quiz link and take the quiz.

---

## Step 3: Cloudflare account and the website

### 3.1 Create the account
1. Open https://dash.cloudflare.com/sign-up.
2. Enter your email and a password, then **Sign up**.
3. Cloudflare emails you a verification link. Open it and click **Verify email**.
4. Sign in. Choose the **Free** plan if asked. No card is needed.
5. If it asks you to add a domain, skip it. You do not need a domain.

### 3.2 Publish the site (Pages)
1. Left menu: **Workers & Pages**.
2. Click **Create** (or **Create application**).
3. Choose the **Pages** tab. If you only see Workers, click the small link such as "Looking to deploy Pages? Get started".
4. Click **Import an existing Git repository > Get started**.
5. Click **Connect GitHub**. On the GitHub page choose **Only select repositories**, select `iqra-quiz-studio`, then **Install & Authorize**.
6. Back in Cloudflare select the `iqra-quiz-studio` repository and click **Begin setup**.
7. **Project name:** `iqra-quiz`. This gives the address `https://iqra-quiz.pages.dev`. (If the name is already taken, Cloudflare tells you. Then pick another name and use that address everywhere below instead, including `publicUrl` in `config.js`.)
8. **Production branch:** `main`.
9. **Framework preset:** `None`.
10. **Build command:** leave empty.
11. **Build output directory:** leave empty (or `/`).
12. Click **Save and Deploy** and wait one to two minutes until you see **Success**.

---

## Step 4: Fill in `config.js` and allow your site in Firebase

### 4.1 Edit `config.js` on GitHub
1. In your repository click `config.js`, then the pencil icon (**Edit this file**).
2. Replace the six `PASTE_...` values in the `firebase` block with the values from step 2.2. Keep the quotes and commas.
3. `publicUrl` is already set to `https://iqra-quiz.pages.dev/`. Change it only if your Cloudflare address is different.
4. Set `admins` to the same Gmail addresses you put in `firestore.rules`.
5. Optional: `brand` is the name printed on PDFs, papers and certificates.
6. Click **Commit changes** twice. Cloudflare republishes the site by itself in one to two minutes.

### 4.2 Allow the website address in Firebase
Without this, sign-in fails with `auth/unauthorized-domain`.
1. Firebase Console > **Authentication** > **Settings** tab > **Authorized domains**.
2. Click **Add domain**.
3. Type `iqra-quiz.pages.dev` (no `https://`) and click **Add**.

---

## Step 5: Test the website

1. Open https://iqra-quiz.pages.dev.
2. You should see the Quiz Studio page and the **Open Quiz Studio** button. If it says "Setup is not finished", `config.js` does not have your Firebase values yet (step 4.1).
3. Click **Open Quiz Studio**, then **Sign in with Google** with an admin Gmail.
4. Create a small quiz with **+ New quiz**, save it and make a link.
5. Open that link on your phone. If the quiz starts, everything works.

---

## Step 6: Build the Android APK

### 6.1 Create the signing key (do this once)
Without a fixed key, every new APK must be installed after removing the old app. With the key, new builds update the old one.

1. GitHub repository > **Actions** tab. If asked, click **I understand my workflows, go ahead and enable them**.
2. In the left list click **Make Android signing key (run ONCE)**, then **Run workflow**, then the green **Run workflow** button.
3. Wait a minute, refresh, and open the run. Wait for the green tick.
4. At the bottom of the run page, in **Summary**, you will see three values: `KEY_ALIAS`, `KEYSTORE_PASSWORD`, `KEYSTORE_BASE64`.
5. Save all three somewhere safe (a password manager). If you lose them you can never update the installed app.
6. Go to repository **Settings > Secrets and variables > Actions > New repository secret** and add three secrets (names exactly as written, in capitals):
   - `KEY_ALIAS` = `quizstudio`
   - `KEYSTORE_PASSWORD` = the password from the summary
   - `KEYSTORE_BASE64` = the long text from the summary (copy all of it)

If this workflow refuses to run, your repository is public. Make it private under Settings > General > Danger Zone > Change visibility.

### 6.2 Build the APK
1. **Actions** > **Build Android APK** > **Run workflow** > **Run workflow**.
2. It takes 5 to 10 minutes. A green tick means success. If you see a red cross, open the run, copy the red error line and send it to me.
3. On the repository home page click **Releases** (right side) > **Quiz Studio Android (latest)**.
4. Under **Assets** click `Quiz-Studio.apk` to download it.
5. Open the file on your phone. Allow "Install unknown apps" if asked, then **Install**.

### 6.3 How sign-in works in the APK
Tapping **Sign in with Google** opens your phone's browser. After you sign in there, the app takes you back and signs in automatically. Google does not allow sign-in inside an app window, so this hand-over is used.

---

## Step 7: Build the Windows app

1. **Actions** > **Build Windows app** > **Run workflow** > **Run workflow**.
2. After 5 to 10 minutes (green tick) open **Releases > Quiz Studio for Windows (latest)**.
3. Download `Quiz-Studio-Setup.exe` and double-click it.
4. If Windows shows "Windows protected your PC", click **More info > Run anyway**. This is normal for apps from a publisher Windows does not know.
5. A **Quiz Studio** icon appears on the desktop.

The Windows app opens your website in its own window, so website changes appear in it automatically. You do not need to rebuild it when the site changes.

---

## Changing things later

| What | How |
|---|---|
| Any website file | Edit or upload it on GitHub. Cloudflare publishes it automatically. |
| Add an admin | Add the Gmail to `admins` in `config.js` AND to `isMaster()` in Firebase Rules (then Publish). |
| New APK after changes | It rebuilds when site files change, or run **Build Android APK** manually. The APK carries its own copy of the site files. |
| Your own domain | Cloudflare Pages > your project > **Custom domains**. Then change `publicUrl` in `config.js` and add the domain under Firebase Authorized domains. |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Setup is not finished" | Put your Firebase values into `config.js` (step 4.1). |
| `auth/unauthorized-domain` when signing in | Add `iqra-quiz.pages.dev` under Firebase Authentication > Settings > Authorized domains (step 4.2). |
| Sign-in works but "permission denied" | Your Gmail must be in the Firebase Rules AND in `config.js`. Make sure you clicked **Publish** on the Rules. |
| Quiz link says "not a valid quiz link" | The link was copied incompletely, or the quiz link is switched off or expired. |
| APK sign-in does not return to the app | Check `publicUrl` in `config.js`, then rebuild the APK. |
| Android build fails with "Missing icon-192.png" (or another logo file) | Copy the five logo files from your old repository (step 1.8). |
| New APK will not install ("package conflicts") | Step 6.1 was not done. Uninstall the old app once, install the new one, then do step 6.1. |
| Windows build error "publicUrl in config.js is not set" | Fix `publicUrl` in `config.js`. |

---

## Good to know

- Answer keys are stored inside the quiz link document. This suits ordinary quizzes and practice, not strictly secured exams.
- A web page cannot fully block phone screenshots. Watermarks and warnings discourage them.
- Firebase's free plan has daily limits (about 50,000 reads and 20,000 writes). That is enough for small and medium use.
- This is a new Firebase project, so quizzes from the IQRA VOCAB app do not appear here.
- Sharing the old Firebase project is possible, but its Rules would need to combine the old app's rules and these rules. A new project is safer.
