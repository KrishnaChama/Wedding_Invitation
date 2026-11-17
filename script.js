// --- DOM Elements ---
const landingScreen = document.getElementById("landing-screen");
const openInviteBtn = document.getElementById("open-invite-btn");
const mainContent = document.getElementById("main-content");
const floatingControls = document.getElementById("floating-controls");
const toggleScrollBtn = document.getElementById("toggle-scroll-btn");
//const toggleMusicBtn = document.getElementById("toggle-music-btn");

// --- Auto-Scroll State ---
let isAutoScrolling = false;
let autoScrollAnimId = null;
const scrollSpeed = 0.85; // Pixels per frame (lower is slower, higher is faster)

// --- Web Audio API Traditional Chime Synthesizer ---
let audioCtx = null;
let musicInterval = null;
let isMusicMuted = false;

function initAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
}

function playShehnaiNote(frequency, duration) {
  if (!audioCtx || isMusicMuted) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Auspicious warm brass/shehnai harmonic texture
  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function startCelebrationAudio() {
  initAudio();
  // Traditional celebratory melodic scale (Sa, Re, Ga, Pa, Dha)
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
  let noteIndex = 0;

  musicInterval = setInterval(() => {
    if (!isMusicMuted) {
      playShehnaiNote(notes[noteIndex % notes.length], 0.9);
      noteIndex++;
    }
  }, 1100);
}

// --- Auto-Scroll Engine ---
function autoScrollStep() {
  if (!isAutoScrolling) return;

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  
  if (window.scrollY < maxScroll - 1) {
    window.scrollBy(0, scrollSpeed);
    autoScrollAnimId = requestAnimationFrame(autoScrollStep);
  } else {
    // Reached bottom
    pauseAutoScroll();
  }
}

function startAutoScroll() {
  isAutoScrolling = true;
  toggleScrollBtn.textContent = "⏸ Pause Tour";
  autoScrollAnimId = requestAnimationFrame(autoScrollStep);
}

function pauseAutoScroll() {
  isAutoScrolling = false;
  toggleScrollBtn.textContent = "▶ Resume Tour";
  if (autoScrollAnimId) {
    cancelAnimationFrame(autoScrollAnimId);
  }
}

// Allow user touch or mouse wheel to politely pause the tour
window.addEventListener("wheel", () => {
  if (isAutoScrolling) pauseAutoScroll();
}, { passive: true });

window.addEventListener("touchmove", () => {
  if (isAutoScrolling) pauseAutoScroll();
}, { passive: true });

// --- Button Event Listeners ---
openInviteBtn.addEventListener("click", () => {
  // Fade out landing screen
  landingScreen.classList.add("fade-out");

  setTimeout(() => {
    landingScreen.classList.add("hidden");
    mainContent.classList.remove("hidden");
    floatingControls.classList.remove("hidden");

    // Scroll to the top of main content
    window.scrollTo({ top: 0, behavior: "instant" });

    // Start background music & auto-scroll tour
    startCelebrationAudio();
    setTimeout(startAutoScroll, 900);
  }, 750);
});

toggleScrollBtn.addEventListener("click", () => {
  if (isAutoScrolling) {
    pauseAutoScroll();
  } else {
    startAutoScroll();
  }
});

toggleMusicBtn.addEventListener("click", () => {
  isMusicMuted = !isMusicMuted;
  toggleMusicBtn.textContent = isMusicMuted ? "🔇 Muted" : "🔊 Sound";
});

// --- Countdown Timer ---
// Set target wedding date (Year, MonthIndex 0-11, Day, Hour, Minute)
const weddingDate = new Date(2026, 10, 22, 11, 28, 0).getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").innerText = String(days).padStart(2, "0");
    document.getElementById("hours").innerText = String(hours).padStart(2, "0");
    document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
    document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");
  } else {
    document.querySelector(".timer-container").innerHTML = "<p style='color: #4a0e17; font-weight: bold;'>The Auspicious Wedding Day Has Arrived!</p>";
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();