# 記憶道 Kiokudō — The Way of Memory

A personal training app for memory championships. It runs in a phone browser, works offline, and keeps all data on your phone.

## What's inside

- **学 Learn**: 37 lessons in 5 levels (初 Foundations → 基 Core systems → 上 Advanced → 速 Speed & volume → 達 Competition ready). Each lesson has three steps:
  - **文 Literature**: what the books and research say (Cicero, Ad Herennium, Quintilian, Lorayne & Lucas, O'Brien, Foer, Ericsson, Ebbinghaus, Make It Stick, Lynne Kelly, Matteo Ricci, Vedic and hifz traditions, and more), summarised in our own words with the source named.
  - **技 Technique**: steps, an animated diagram and a worked example.
  - **稽古 Exercise**: a timed drill with a target score. A lesson is complete when you hit the target.
- **練 Train**: trainers for all 10 competition disciplines (numbers, binary, words, cards, names & faces, dates, abstract images, spoken numbers, speed numbers, speed cards), plus Memory League 1-minute sprints and mini and full mock championships.
- **声 Voice diary**: record spoken notes after a session, with optional live transcript (Chrome). Audio is saved on the phone.
- **型 Systems**: your 00–99, card and PAO images, with spaced flashcards.
- **宮 Palaces**: build, store and "walk" your memory palaces.
- **名言 Quotes**: 61 motivating sayings from Japan, China, Korea, South-East Asia, South Asia, the Middle East and Africa, each with the original text, pronunciation and meaning.
- **辞書 Glossary**: tap any Japanese word in the app to see its reading and meaning.

## Real face photos (optional)

Names & faces can use real portraits from Unsplash (free under the Unsplash License, photographer credited in the app). Unsplash needs a free personal Access Key:

1. Sign up at https://unsplash.com/developers (free).
2. **Your apps → New Application**, accept the terms, name it "Kiokudo".
3. Copy the **Access Key** (not the Secret Key).
4. In the app: **道具 Tools → 設定 Settings → Real face photos**, paste the key, tap **Load face photos**.

The app runs 16 searches (diverse ages and backgrounds) and stores about 300–480 photo links on your phone. Photos are loaded from Unsplash when you train, so you need internet for them; offline, the app falls back to drawn faces. Tap **Load face photos** again any time for a fresh set. The key stays only on your phone and is never put in the GitHub files.

## Put it on GitHub Pages

1. Create a new repository on github.com, for example `kiokudo` (Public).
2. Click **Add file → Upload files**. Select **all the files** from the unzipped folder (there are no subfolders, so this works from a phone). Click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. Wait 1–2 minutes. Your app is at `https://YOUR-USERNAME.github.io/kiokudo/`.
5. On your phone, open that link in Chrome (Android) or Safari (iPhone) and choose **Add to Home screen**.

GitHub Pages serves over HTTPS, which the microphone (voice diary) and offline mode both need.

## Updating

Edit or re-upload files on GitHub. If you change any file, also bump `VERSION` in `sw.js` (e.g. `kiokudo-v3`) so phones fetch the new version.

## Backups

Progress, systems and palaces live in the browser's storage. Use **道具 Tools → 設定 Settings → Export backup** regularly. Diary recordings can be downloaded one by one.

## Content notes

Literature sections are summaries in our own words, not copies of the books. Ancient texts are quoted in our own translation. World records are from IAM/WMSC statistics (2026) and change often.
