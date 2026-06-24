# 💛 Our Scrapbook — a birthday website

A playful retro-scrapbook site that walks her through memories of you two (and your pet),
with little quiz moments where only the answer *you* chose lets her continue.
Finishing the scrapbook reveals your birthday message with confetti.

---

## 📁 What's in here

| File | What it is | Do you edit it? |
|------|-----------|-----------------|
| `content.js` | All the text, questions, answers & photo names | ✅ **Yes — this is your file** |
| `images/` | Your photos | ✅ Yes — drop photos here |
| `index.html` | The page | ❌ No |
| `style.css` | The scrapbook look | ❌ Only if you want to tweak colors |
| `app.js` | The engine | ❌ No |

---

## ✍️ Step 1 — Make it yours (edit `content.js`)

Open `content.js` in any text editor (Notepad works). Everything you change is at the top:

- **`herName`, `yourName`, `petName`** — fill these in.
- **`coverTitle` / `coverSubtitle`** — the opening cover text.
- **`pages`** — the journey. Each block is either a `memory` (photo + story) or a
  `question`. Edit the text, the `options`, and set `correct` to which option (0, 1, 2 or 3)
  lets her continue. The first option is `0`.
- **`rightReaction` / `wrongReaction`** — the cute messages for right/wrong picks.
- **`finale`** — your big birthday message at the end.

Add or remove `memory`/`question` blocks freely — just keep the commas and curly braces.

## 🖼️ Step 2 — Add your photos

1. Put your photos in the **`images`** folder.
2. Name them to match `content.js`, **or** rename the `"photo":` lines to match your files.
   Default names expected: `cover.jpg`, `memory1.jpg`, `quiz1.jpg`, `pet1.jpg`,
   `quiz2.jpg`, `memory2.jpg`, `quiz3.jpg`, `finale.jpg`.
3. The placeholder images in there now are just so it looks complete — replace them.
   (Tip: keep photos under ~1 MB each so the site loads fast. `.jpg` or `.png` both work.)

## 👀 Step 3 — Preview it on your computer

Just double-click `index.html` — it opens in your browser. Click through to test it.

---

## 🚀 Step 4 — Publish it free with GitHub Pages

You'll have a live link like `https://YOUR-USERNAME.github.io/our-scrapbook/`.

### Easiest way (no command line)

1. Go to **github.com** and sign in (create a free account if needed).
2. Click the **+** (top-right) → **New repository**.
   - Name it something like `our-scrapbook`.
   - Set it to **Public**.
   - Click **Create repository**.
3. On the new repo page, click **uploading an existing file**.
4. Drag in **all the files from this folder** — `index.html`, `style.css`, `content.js`,
   `app.js`, and the **`images`** folder. (You can skip `README.md`, `.gitignore`, and any
   `node_modules` / `_test.js` if present — they're not needed for the site.)
5. Click **Commit changes**.
6. Go to **Settings → Pages** (left sidebar).
7. Under **Source**, choose **Deploy from a branch**, pick branch **`main`** and folder
   **`/ (root)`**, then **Save**.
8. Wait ~1 minute, refresh, and GitHub shows your live link at the top of that page. 🎉

### If you prefer the command line

```bash
cd path/to/this/folder
git init
git add index.html style.css content.js app.js images
git commit -m "Birthday scrapbook 💛"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/our-scrapbook.git
git push -u origin main
```

Then do **Settings → Pages** (steps 6–8 above) to turn on the live site.

---

## 💡 Tips

- **Custom link wording:** the repo name becomes part of the URL, so name it sweetly.
- **Keep it a surprise:** a Public repo means the *code* is visible to anyone who finds it,
  but nobody will stumble on your link. Share it with her privately.
- **Change colors:** in `style.css`, the `--accent` and `--accent2` values near the top
  control the pink and green accents.

Made with love. Happy birthday to her 💛
