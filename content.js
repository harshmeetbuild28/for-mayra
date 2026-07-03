/* =====================================================================
   💛 EDIT EVERYTHING IN THIS FILE — it's the main file you need to touch.
   Replace the placeholder text, add your photos to the /images folder,
   and update the "photo" filenames below to match.
   ===================================================================== */

const CONTENT = {

  // ---- The basics ----------------------------------------------------
  herName:   "Mayra Janina Tapia Chamorro",          // her name / nickname
  yourName:  "Harsho",        // your name
  petName:   "Leo",            // your pet's name
  petType:   "Cat",              // dog / cat / pup / kitty etc.

  // Shown on the opening cover of the scrapbook
  coverTitle:    "Its my babu's Happy Birthday",
  coverSubtitle: "A little scrapbook of Babu cute and Babu not so cute — flip through it with me 💛",
  coverPhoto:    "images/cover.jpg",   // a favourite photo of you two

  // Your photos float around the background as little heart cut-outs (with the emoji hearts).
  // Add as many as you like. Leave [] for just emoji hearts.
  // Example: ["images/bg1.jpg", "images/bg2.jpg", "images/bg3.jpg"]
  bgImages: ["images/bg1.jpg", "images/bg2.jpg", "images/bg3.jpg", "images/bg4.jpg", "images/bg5.jpg"],

  // ---- The journey ---------------------------------------------------
  // Each "page" is either a MEMORY (a photo + story) or a QUESTION.
  // For QUESTION pages, set "correct" to the index (0,1,2,3) of the answer
  // that lets her continue. NO other answer will ever advance.
  //
  // Every time she picks a wrong answer, YOUR correct answer grows bigger.
  // After a few wrong tries it takes over the whole screen until she clicks it.
  // Optional per-question knobs:
  //   takeoverAfter: 4        -> how many wrong tries before it fills the screen
  //   wrongReactions: [ ... ] -> custom escalating teasing messages (one per try)
  //   date: "2026-06-25"      -> this page stays HIDDEN until that day, then appears
  //                              automatically. No date = always visible. This is how
  //                              a new question can unlock each day on its own.
  pages: [

    {
      type: "memory",
      tape: "The very first phase",
      title: "The first ever pictures",
      photo: "images/memory1.jpg",
      caption: "The beginning of our story  ✨",
      text: "You see these are the very first images of you on my phone that was taken on 28th Oct 23, and we didn't take our picture together(second) till 01 Jan 24. This reflects the first phase was a denial phase :D	  "
    },

    {
      type: "question",
      tape: "Quiz time!",
      // re-using the first-pictures collage already uploaded (shows both photos)
      photos: ["images/memory1.jpg"],
      question: "Where were these 2 images clicked? hmmmm???",
      options: [
        "Piha beach and North Head Summit",                       // A
        "Mercer Bay loop walk and Mt Victoria uphill walkway",    // B
        "Mercer Bay loop walk and Mount Victoria Summit",         // C  ✅
        "Mcgregor street and Liverpool street"                    // D
      ],
      correct: 2,                 // C is the right one
      teaser: "Are you sure it's not Mcgregor street and Liverpool street? 😏",
      rightReaction: "Yesss! Mercer Bay loop walk & Mount Victoria Summit 🥹",
      wrongReaction: "Nope... keep trying 😏"
    },

    {
      // ---- WRITE YOUR CUTE MESSAGE HERE (shown right before the slideshow) ----
      type: "memory",
      tape: "A little note 💛",
      title: "Then there were three",
      photo: "",                         // no photo here — just your message
      caption: "",
      text: "And before we knew it, our family grew from 2 to 3 members and soon to be 4 💛 Here is a slideshow of our little bebu in her early days and us together"
    },

    {
      // ---- SLIDESHOW of you two + your pet ----
      // Add 9–10 photos. Upload them as slide1.jpg, slide2.jpg, ... in the images folder.
      type: "slideshow",
      tape: "Us + Leo",
      title: "Our little family 🐾",
      caption: "Swipe through our favourites ✨",
      intervalMs: 3500,                  // auto-advance speed in ms (3500 = 3.5s)
      photos: [
        "images/slide1.jpg",
        "images/slide2.jpg",
        "images/slide3.jpg",
        "images/slide4.jpg",
        "images/slide5.jpg",
        "images/slide6.jpg",
        "images/slide7.jpg",
        "images/slide8.jpg",
      ]
    },

    {
      type: "question",
      tape: "Quiz time!",
      question: "What's my absolute favourite thing about you?",
      options: [
        "My cooking",
        "Everything 💛",
        "My playlists",
        "My jokes"
      ],
      correct: 1,
      rightReaction: "Correct. It's genuinely everything ❤️",
      wrongReaction: "Close... but think bigger 😘"
    },

    {
      // ---- WRITE YOUR ADVENTURES MESSAGE HERE (shown right before the slideshow) ----
      type: "memory",
      tape: "A little note 💛",
      title: "All the adventures we had so far and many more to come",
      photo: "",                         // no photo here — just your message
      caption: "",
      text: "Over time we have had quite a bit of adventures together.... Some good, some really good and some were like epic COME ON!!! I don't know about you but my favorite part about these adventures is you 💛"
    },

    {
      // ---- ADVENTURES SLIDESHOW ----
      // Add up to 20 photos. Upload them as adv1.jpg, adv2.jpg, ... adv20.jpg in images.
      type: "slideshow",
      tape: "Adventures",
      title: "Our adventures over the years 🌍",
      caption: "Swipe through the memories ✨",
      intervalMs: 3500,                  // auto-advance speed in ms (3500 = 3.5s)
      photos: [
        "images/adv1.jpg",  "images/adv2.jpg",  "images/adv3.jpg",  "images/adv4.jpg",
        "images/adv5.jpg",  "images/adv6.jpg",  "images/adv7.jpg",  "images/adv8.jpg",
        "images/adv9.jpg",  "images/adv10.jpg", "images/adv11.jpg", "images/adv12.jpg",
        "images/adv13.jpg", "images/adv14.jpg", "images/adv15.jpg", "images/adv16.jpg",
        "images/adv17.jpg", "images/adv18.jpg", "images/adv19.jpg", "images/adv20.jpg"
      ]
    },

    {
      // ---- BONUS PICTURE page (text first, then the image) ----
      type: "memory",
      textFirst: true,
      tape: "A little bonus 💛",
      title: "Here is your favorite Uncle Wishing you HAPPY BIRTHDAY",
      photo: "images/bonus.jpg",          // upload as bonus.jpg
      caption: "",
      text: ""                            // add any extra words here if you like
    },

    {
      // ---- HER REACTION page (text first, then her picture) ----
      type: "memory",
      textFirst: true,
      tape: "😏",
      title: "Your ONLY acceptable reaction to this:",
      photo: "images/reaction.jpg",       // upload Mayra's reaction pic as reaction.jpg
      caption: "",
      text: ""
    },

    {
      type: "question",
      tape: "Last one!",
      question: "Will you let me spoil you all day?",
      options: [
        "No, I'm fine",
        "Maybe later",
        "Yes, obviously 🎉",
        "Only if there's cake"
      ],
      correct: 2,
      rightReaction: "Perfect answer 🎉",
      wrongReaction: "Wrong button, my love — pick the happy one 😄"
    },

    {
      // ---- BONUS BONUS question ----
      type: "question",
      tape: "Bonus bonus! 🎁",
      question: "What is the answer to 5 × 5?",
      options: ["10", "15", "20", "25"],
      correct: 3,                 // 25
      teaser: "If you can answer this you'll receive a very special gift 😉",
      rightReaction: "Correct! Your special gift is on its way... 🎁",
      wrongReaction: "Hmm, try again, my clever girl 😏"
    }

  ],

  // The LOCKED page she sees until her birthday — the final surprise only opens on the 4th.
  comeback: {
    tape: "Almost there ⏳",
    title: "Want to open it early? 😏",
    message: "Go on then... try to open your surprise. Catch the button if you can 👇"
  },

  // ---- The finale ----------------------------------------------------
  // revealDate: the finale stays locked (she sees the 'comeback' card instead) until
  // this day arrives — her birthday. Set to her birthday.
  finale: {
    revealDate: "2026-06-24",   // ⚠ TEMP for local preview only — I'll set back to 2026-07-04 before you push!
    tape: "The End… or the beginning 💍",
    title: "Happy Birthday, My Love",
    photo: "",                  // no photo on the finale — video + message only
    message: "Write your big heartfelt birthday message here. This is the last page she sees after finishing the scrapbook — make it count. Tell her what she means to you and what you're wishing for her this year. 💛",
    signoff: "Forever yours,\nHarsho 💛",

    // 🎬 BIRTHDAY VIDEO (appears on this finale, which only unlocks on her birthday):
    //   • Small file (< ~80 MB): put it in C:\Web and set   video: "birthday-video.mp4"
    //   • Bigger video (recommended): upload to YouTube as UNLISTED, then use the EMBED url
    //       e.g.  videoEmbed: "https://www.youtube.com/embed/XXXXXXXXXXX"
    video: "",         // local file name, e.g. "birthday-video.mp4"
    videoEmbed: "https://www.youtube.com/embed/6ItDGWPkaEc?rel=0"   // your YouTube video
  }

};
