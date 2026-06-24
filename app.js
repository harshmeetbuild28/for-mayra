/* ===========  Scrapbook engine — no need to edit this file  =========== */

document.addEventListener("DOMContentLoaded", () => {
  const C = CONTENT;

  /* heart SVG (injected into the correct answer when it starts growing) */
  function heartSVG(uid){
    return `
      <svg class="heart-svg" viewBox="0 0 32 29.6" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <radialGradient id="hg${uid}" cx="35%" cy="28%" r="80%">
            <stop offset="0%" stop-color="#ff9ebb"/>
            <stop offset="50%" stop-color="#f0476f"/>
            <stop offset="100%" stop-color="#c41d54"/>
          </radialGradient>
        </defs>
        <path fill="url(#hg${uid})"
          d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4
             c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z"/>
        <ellipse class="shine" cx="10.5" cy="8" rx="3.4" ry="2.2" fill="#ffffff" opacity="0.45"/>
      </svg>`;
  }

  function setPhoto(imgEl, src){
    const frame = imgEl.closest(".polaroid");
    if(!src){ if(frame) frame.style.display = "none"; return; }
    imgEl.src = src;
    imgEl.onerror = () => { if(frame) frame.style.display = "none"; };
  }

  /* ---- COVER ---- */
  document.getElementById("coverTitle").textContent = C.coverTitle;
  document.getElementById("coverSub").textContent   = C.coverSubtitle;
  setPhoto(document.getElementById("coverImg"), C.coverPhoto);

  /* ---- FINALE ---- */
  document.getElementById("finaleTape").textContent  = C.finale.tape;
  document.getElementById("finaleTitle").textContent = C.finale.title;
  document.getElementById("finaleMsg").textContent   = C.finale.message;
  document.getElementById("finaleSign").textContent  = C.finale.signoff;
  setPhoto(document.getElementById("finaleImg"), C.finale.photo);

  /* ---- date unlocking: a page appears only on/after its date ---- */
  const TODAY = new Date(); TODAY.setHours(0,0,0,0);
  function unlocked(dateStr){
    if(!dateStr) return true;
    const dt = new Date(dateStr + "T00:00:00");
    return TODAY.getTime() >= dt.getTime();
  }
  const finaleReady = unlocked(C.finale.revealDate);

  /* ---- comeback card (shown before her birthday once today's questions are done) ---- */
  const cb = C.comeback || {};
  document.getElementById("comebackTape").textContent  = cb.tape  || "See you tomorrow 💛";
  document.getElementById("comebackTitle").textContent = cb.title || "That's all for today";
  document.getElementById("comebackMsg").textContent   = cb.message || "Come back tomorrow for the next one 💛";

  /* ---- BUILD PAGES (only the ones unlocked so far) ---- */
  const pagesWrap = document.getElementById("pages");
  const livePages = C.pages.filter(p => unlocked(p.date));

  livePages.forEach((p, i) => {
    const sec = document.createElement("section");

    if(p.type === "memory"){
      sec.className = "page";
      const photoBlock = `
        <div class="polaroid big">
          <img alt="${p.title || ''}" />
          <span class="tape tape-tl"></span>
          <span class="tape tape-br"></span>
        </div>`;
      const textBlock = `
        <h2 class="mem-title">${p.title || ""}</h2>
        <p class="mem-caption">${p.caption || ""}</p>
        <p class="mem-text">${p.text || ""}</p>`;
      sec.innerHTML = `
        <span class="washi">${p.tape || ""}</span>
        ${p.textFirst ? textBlock + photoBlock : photoBlock + textBlock}
        <button class="btn next">Turn the page →</button>`;
      setPhoto(sec.querySelector("img"), p.photo);
      sec.querySelector(".next").addEventListener("click", () => go(i + 1));
    }

    else if(p.type === "question"){
      sec.className = "page qpage";
      const hasClues = p.photos && p.photos.length;
      const photosHTML = hasClues
        ? `<div class="q-photos">${p.photos.map(() =>
            `<div class="polaroid"><img alt="clue"/><span class="tape tape-tl"></span></div>`).join("")}</div>`
        : "";
      sec.innerHTML = `
        <div class="q-head">
          <span class="washi">${p.tape || "Quiz time!"}</span>
          ${photosHTML}
          <h2 class="q-text">${p.question}</h2>
          <p class="reaction"></p>
        </div>
        ${(p.photo && !hasClues) ? `<div class="q-corner"><div class="polaroid"><img alt="us"/><span class="tape tape-tl"></span></div></div>` : ""}
        <div class="arena"></div>`;

      const arena    = sec.querySelector(".arena");
      const reaction = sec.querySelector(".reaction");
      if(hasClues){
        const imgs = sec.querySelectorAll(".q-photos img");
        p.photos.forEach((src, k) => { if(imgs[k]) setPhoto(imgs[k], src); });
      } else if(p.photo){
        const cimg = sec.querySelector(".q-corner img"); if(cimg) setPhoto(cimg, p.photo);
      }

      let wrongCount = 0;
      let correctBtn = null;
      let answered   = false;
      let revealed   = false;
      const takeoverAt = p.takeoverAfter || 8;   // wrong tries before it fills the screen
      const teaser = p.teaser || "";

      const nudges = p.wrongReactions || [
        p.wrongReaction || "Hmm, that's not it 😏",
        "Nope — try again, my love 😄",
        "Still not the one 👀",
        "Getting warmer? ...no 😅",
        "It's starting to grow 🎈",
        "You can run but you can't hide 💞",
        "Almost no escape now 😂",
        "Just catch the big heart already 💛"
      ];

      arena._bubbles = [];
      const allBubs    = [];   // every option's bubble object
      const hiddenBubs = [];   // options held back until her first try

      // which options appear first (e.g. firstPair:[2,3] = just C and D)
      const firstSet = (p.firstPair && p.firstPair.length)
        ? p.firstPair : p.options.map((_, k) => k);

      function showBub(bub){ arena.appendChild(bub.el); arena._bubbles.push(bub); }
      function placeBubble(bub){
        const W = arena.clientWidth || window.innerWidth;
        const H = arena.clientHeight || window.innerHeight;
        const w = bub.el.offsetWidth || 150, h = bub.el.offsetHeight || 54;
        bub.x = Math.random()*Math.max(1, W - w);
        bub.y = Math.random()*Math.max(1, H - h);
        const sp = 1.1 + Math.random()*1.3, a = Math.random()*Math.PI*2;
        bub.vx = Math.cos(a)*sp; bub.vy = Math.sin(a)*sp;
        bub.frozen = false; bub.el._bub = bub;
        bub.el.style.left = bub.x + "px"; bub.el.style.top = bub.y + "px";
      }
      function revealRest(){
        if(revealed || !hiddenBubs.length) return;
        revealed = true;
        hiddenBubs.forEach(bub => { showBub(bub); placeBubble(bub); });
      }

      p.options.forEach((opt, oi) => {
        const b = document.createElement("button");
        b.className = "bubble";
        b.innerHTML = `<span class="lbl">${opt}</span>`;
        b.style.setProperty("--rot", (Math.random()*8 - 4) + "deg");
        if(oi === p.correct) correctBtn = b;

        const bub = { el:b, x:0, y:0, vx:0, vy:0, frozen:false, _idx:oi };
        allBubs.push(bub);

        b.addEventListener("click", () => {
          if(answered) return;
          if(oi === p.correct){
            answered = true;
            win(b, reaction, p, arena, i);
          } else {
            wrongCount++;
            reaction.classList.remove("good");
            reaction.textContent = nudges[Math.min(wrongCount - 1, nudges.length - 1)];
            b.classList.add("shake");
            setTimeout(() => b.classList.remove("shake"), 450);
            revealRest();                 // bring in the rest of the options
            growHeart(correctBtn, i, wrongCount, takeoverAt);
          }
        });
      });

      // show only the first set to begin with
      allBubs.forEach(bub => {
        if(firstSet.indexOf(bub._idx) !== -1) showBub(bub);
        else hiddenBubs.push(bub);
      });
      if(teaser) reaction.textContent = teaser;

      // full reset so a replay starts this question from scratch
      sec._reset = () => {
        wrongCount = 0;
        answered = false;
        revealed = false;
        reaction.classList.remove("good");
        allBubs.forEach(bub => {
          const el = bub.el;
          el.disabled = false;
          el.classList.remove("shake", "dim", "chosen", "heart-mode", "takeover");
          const svg = el.querySelector(".heart-svg"); if(svg) svg.remove();
          el.style.width = ""; el.style.height = "";
          el.style.left = ""; el.style.top = "";
          const lbl = el.querySelector(".lbl"); if(lbl) lbl.style.fontSize = "";
          bub.frozen = false;
          if(el.parentNode) el.parentNode.removeChild(el);
        });
        arena._bubbles = [];
        hiddenBubs.length = 0;
        allBubs.forEach(bub => {
          if(firstSet.indexOf(bub._idx) !== -1) showBub(bub);
          else hiddenBubs.push(bub);
        });
        reaction.textContent = teaser || "";
        arena._inited = false;
      };

      sec._initArena = () => initArena(arena);
    }

    else if(p.type === "slideshow"){
      sec.className = "page slideshow-page";
      const photos = p.photos || [];
      sec.innerHTML = `
        <span class="washi">${p.tape || ""}</span>
        <h2 class="mem-title">${p.title || ""}</h2>
        ${p.caption ? `<p class="mem-caption">${p.caption}</p>` : ""}
        <div class="slideshow">
          <div class="slides">
            ${photos.map((src, k) =>
              `<img class="slide${k===0 ? " on" : ""}" alt="slide ${k+1}" data-src="${src}">`).join("")}
          </div>
          <button class="sl-arrow prev" aria-label="previous">‹</button>
          <button class="sl-arrow next" aria-label="next">›</button>
        </div>
        <div class="sl-dots">${photos.map((_, k) => `<i class="${k===0 ? "on" : ""}"></i>`).join("")}</div>
        <button class="btn next-page">Turn the page →</button>`;

      const slides = Array.from(sec.querySelectorAll(".slide"));
      const sdots  = Array.from(sec.querySelectorAll(".sl-dots i"));
      slides.forEach(img => {
        img.src = img.dataset.src;
        img.onerror = () => { img.dataset.broken = "1"; };
      });

      let idx = 0;
      function showSlide(n){
        if(!slides.length) return;
        idx = (n + slides.length) % slides.length;
        slides.forEach((im, k) => im.classList.toggle("on", k === idx));
        sdots.forEach((dd, k) => dd.classList.toggle("on", k === idx));
      }
      sec.querySelector(".sl-arrow.prev").addEventListener("click", () => showSlide(idx - 1));
      sec.querySelector(".sl-arrow.next").addEventListener("click", () => showSlide(idx + 1));
      sdots.forEach((dd, k) => dd.addEventListener("click", () => showSlide(k)));

      // auto-advance, but only while this page is the one being viewed
      setInterval(() => { if(sec.classList.contains("active")) showSlide(idx + 1); }, p.intervalMs || 3500);

      sec.querySelector(".next-page").addEventListener("click", () => go(i + 1));
      sec._reset = () => showSlide(0);
    }

    pagesWrap.appendChild(sec);
  });

  /* ---- the correct answer turns into a heart & inflates like a balloon ---- */
  function growHeart(btn, uid, wrongCount, takeoverAt){
    if(!btn.classList.contains("heart-mode")){
      btn.insertAdjacentHTML("afterbegin", heartSVG(uid));
      btn.classList.add("heart-mode");
    }
    const bub = btn._bub;
    if(wrongCount >= takeoverAt){
      btn.classList.add("takeover");
      if(bub) bub.frozen = true;          // stop bouncing; it's fixed & full-screen
      btn.style.width = ""; btn.style.height = "";
      btn.querySelector(".lbl").style.fontSize = "";
    } else {
      const size = 120 + wrongCount * 42;  // px — inflates with each wrong try
      btn.style.width  = size + "px";
      btn.style.height = size + "px";
      btn.querySelector(".lbl").style.fontSize = Math.max(15, size/7.5) + "px";
    }
  }

  /* ---- she finally clicks the right one ---- */
  function win(btn, reaction, p, arena, i){
    reaction.textContent = p.rightReaction || "Yes! 💛";
    reaction.classList.add("good");
    arena.querySelectorAll(".bubble").forEach(o => { o.disabled = true; o.classList.add("dim"); });
    btn.classList.remove("dim");
    btn.classList.add("chosen");
    if(arena._bubbles) arena._bubbles.forEach(b => b.frozen = true);
    celebrate();
    setTimeout(() => go(i + 1), 1300);
  }

  /* ====================  BOUNCING PHYSICS ENGINE  ==================== */
  function initArena(arena){
    const W = arena.clientWidth, H = arena.clientHeight;
    arena._bubbles.forEach(bb => {
      const w = bb.el.offsetWidth || 120, h = bb.el.offsetHeight || 54;
      bb.x = Math.random() * Math.max(1, W - w);
      bb.y = Math.random() * Math.max(1, H - h);
      const speed = 1.1 + Math.random() * 1.3;
      const ang   = Math.random() * Math.PI * 2;
      bb.vx = Math.cos(ang) * speed;
      bb.vy = Math.sin(ang) * speed;
      bb.frozen = false;
      bb.el._bub = bb;
      bb.el.style.left = bb.x + "px";
      bb.el.style.top  = bb.y + "px";
    });
    arena._inited = true;
  }

  function tick(){
    const active = document.querySelector(".page.qpage.active");
    if(active && active._initArena){
      const arena = active.querySelector(".arena");
      if(arena && !arena._inited && arena.clientWidth > 0) initArena(arena);
      if(arena && arena._inited){
        const W = arena.clientWidth, H = arena.clientHeight;
        arena._bubbles.forEach(bb => {
          if(bb.frozen) return;
          const w = bb.el.offsetWidth, h = bb.el.offsetHeight;
          bb.x += bb.vx; bb.y += bb.vy;
          if(bb.x <= 0){ bb.x = 0; bb.vx = Math.abs(bb.vx); }
          if(bb.x + w >= W){ bb.x = W - w; bb.vx = -Math.abs(bb.vx); }
          if(bb.y <= 0){ bb.y = 0; bb.vy = Math.abs(bb.vy); }
          if(bb.y + h >= H){ bb.y = H - h; bb.vy = -Math.abs(bb.vy); }
          bb.el.style.left = bb.x + "px";
          bb.el.style.top  = bb.y + "px";
        });
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ---- NAVIGATION ---- */
  const cover    = document.getElementById("cover");
  const finale   = document.getElementById("finale");
  const comeback = document.getElementById("comeback");
  const allDynamic = Array.from(pagesWrap.children);
  const total = livePages.length;

  const prog = document.getElementById("progress");
  for(let i=0;i<total;i++){ const d=document.createElement("i"); prog.appendChild(d); }
  const dots = Array.from(prog.children);

  // your photos drift around the background as little hearts
  const floatPhotos = C.bgImages || [];
  const phLayer = document.getElementById("photoHearts");
  function photoHeart(src, uid){
    // a little taped polaroid scrap drifting in the background
    return `<div class="ph-svg ph-scrap"><span class="ph-tape"></span><img src="${src}" alt=""></div>`;
  }
  const phData = [];
  function buildPhotoHearts(){
    if(!floatPhotos.length || !phLayer) return;
    const count = Math.max(7, floatPhotos.length + 3);
    const W = window.innerWidth, H = window.innerHeight;
    for(let i=0;i<count;i++){
      const el = document.createElement("div");
      el.className = "photo-heart";
      el.innerHTML = photoHeart(floatPhotos[i % floatPhotos.length], i);
      const size = 80 + Math.random()*70;
      el.style.width = size + "px"; el.style.height = size + "px";
      phLayer.appendChild(el);
      phData.push({ el, size,
        x: Math.random()*Math.max(1, W - size),
        y: Math.random()*Math.max(1, H - size),
        vx: (Math.random()<.5?-1:1)*(0.3 + Math.random()*0.45),
        vy: (Math.random()<.5?-1:1)*(0.3 + Math.random()*0.45) });
    }
  }
  function floatTick(){
    const W = window.innerWidth, H = window.innerHeight;
    phData.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x <= 0){ p.x = 0; p.vx = Math.abs(p.vx); }
      if(p.x + p.size >= W){ p.x = W - p.size; p.vx = -Math.abs(p.vx); }
      if(p.y <= 0){ p.y = 0; p.vy = Math.abs(p.vy); }
      if(p.y + p.size >= H){ p.y = H - p.size; p.vy = -Math.abs(p.vy); }
      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });
    requestAnimationFrame(floatTick);
  }
  buildPhotoHearts();
  requestAnimationFrame(floatTick);

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let turning = false;

  function show(el){
    const current = document.querySelector(".page.active");

    const reveal = () => {
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active", "turn-out"));
      el.classList.add("active");
      window.scrollTo({top:0, behavior:"smooth"});
      if(el._initArena){
        const arena = el.querySelector(".arena");
        arena._inited = false;               // re-seed positions for this view
        requestAnimationFrame(() => initArena(arena));
      }
      turning = false;
    };

    // literally turn the current page away first, then reveal the next one
    if(current && current !== el && !reduceMotion){
      turning = true;
      current.classList.add("turn-out");
      setTimeout(reveal, 470);
    } else {
      reveal();
    }
  }

  function go(index){
    if(turning) return;                 // ignore taps mid page-turn
    if(index < total){
      show(allDynamic[index]);
      dots.forEach((d,i)=>d.classList.toggle("on", i<=index));
    } else if(finaleReady){
      show(finale);
      dots.forEach(d=>d.classList.add("on"));
      celebrate();
    } else {
      // questions for today are done, but it's not her birthday yet
      show(comeback);
      dots.forEach(d=>d.classList.add("on"));
    }
  }

  function restart(){
    allDynamic.forEach(pg => { if(pg._reset) pg._reset(); });   // start every quiz over
    show(cover);
    dots.forEach(d=>d.classList.remove("on"));
  }

  document.getElementById("startBtn").addEventListener("click", () => go(0));
  document.getElementById("replayBtn").addEventListener("click", restart);
  const cbReplay = document.getElementById("comebackReplay");
  if(cbReplay) cbReplay.addEventListener("click", restart);

  /* ---- BACKGROUND MUSIC ---- */
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  let musicOn = false;
  function setMusic(on){
    if(!bgMusic) return;
    musicOn = on;
    if(on){
      bgMusic.volume = 0.45;
      bgMusic.play().catch(() => {});           // ignore if no file / blocked
      musicToggle.textContent = "🎵";
      musicToggle.classList.add("on");
    } else {
      bgMusic.pause();
      musicToggle.textContent = "🔇";
      musicToggle.classList.remove("on");
    }
  }
  if(musicToggle){
    musicToggle.addEventListener("click", () => setMusic(!musicOn));
  }
  // start the music on her very first interaction (browsers block it any earlier)
  function firstGesture(){ if(!musicOn) setMusic(true); }
  document.getElementById("startBtn").addEventListener("click", firstGesture, { once: true });
  ["pointerdown", "touchstart", "keydown"].forEach(ev =>
    document.addEventListener(ev, firstGesture, { once: true, passive: true }));

  /* ---- FLOATING MUSIC NOTES ---- */
  const heartsBox = document.getElementById("hearts");
  const glyphs = ["♪","♫","♩","♬","♡"];
  const noteColors = ["#c74a6c","#566894","#cf9a3e","#a8345a"];
  setInterval(() => {
    const s = document.createElement("span");
    s.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    s.style.left = Math.random()*100 + "vw";
    s.style.fontSize = (16 + Math.random()*20) + "px";
    s.style.color = noteColors[Math.floor(Math.random()*noteColors.length)];
    s.style.animationDuration = (8 + Math.random()*7) + "s";
    heartsBox.appendChild(s);
    setTimeout(() => s.remove(), 16000);
  }, 850);

  /* ---- DRIFTING DOODLES (stars, sparkles, little notes) ---- */
  const shapesBox = document.getElementById("shapes");
  const shapeGlyphs = ["✦","✧","✶","❀","☆","♪","✿","✩"];
  const shapeColors = ["#cf9a3e","#c74a6c","#566894","#d98ca8","#b6c2a0"];
  if(shapesBox){
    setInterval(() => {
      const s = document.createElement("span");
      s.textContent = shapeGlyphs[Math.floor(Math.random()*shapeGlyphs.length)];
      s.style.left = Math.random()*100 + "vw";
      s.style.fontSize = (12 + Math.random()*22) + "px";
      s.style.color = shapeColors[Math.floor(Math.random()*shapeColors.length)];
      s.style.opacity = (0.35 + Math.random()*0.4).toFixed(2);
      s.style.animationDuration = (9 + Math.random()*9) + "s";
      shapesBox.appendChild(s);
      setTimeout(() => s.remove(), 19000);
    }, 650);
  }

  /* ---- CONFETTI ---- */
  function makeConfetti(n){
    const colors = ["#c74a6c","#566894","#cf9a3e","#d98ca8","#a8345a","#fff"];
    for(let i=0;i<n;i++){
      const c = document.createElement("div");
      c.style.cssText = `position:fixed;z-index:50;top:-20px;width:9px;height:14px;pointer-events:none;`
        + `left:${Math.random()*100}vw;background:${colors[i%colors.length]};`
        + `transform:rotate(${Math.random()*360}deg);border-radius:2px;`;
      document.body.appendChild(c);
      const dur = 2200 + Math.random()*1800;
      if(typeof c.animate !== "function"){ setTimeout(() => c.remove(), dur); continue; }
      c.animate(
        [{transform:"translateY(0) rotate(0)", opacity:1},
         {transform:`translateY(105vh) rotate(${720+Math.random()*360}deg)`, opacity:.9}],
        {duration:dur, easing:"ease-in"}
      ).onfinish = () => c.remove();
    }
  }
  function celebrate(){ makeConfetti(140); setTimeout(() => makeConfetti(90), 600); }

});
