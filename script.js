
// ==========================================
// DOM ELEMENTS
// ==========================================

const landingScreen = document.getElementById("landing-screen");
const openInviteBtn = document.getElementById("open-invite-btn");
const mainContent = document.getElementById("main-content");
const floatingControls = document.getElementById("floating-controls");

const toggleScrollBtn = document.getElementById("toggle-scroll-btn");
const toggleMusicBtn = document.getElementById("toggle-music-btn");

// ==========================================
// BACKGROUND WEDDING MUSIC (MP3)
// ==========================================

const weddingMusic = new Audio("music/srilatha.mp3");

weddingMusic.loop = true;
weddingMusic.volume = 0.5;

let isMusicMuted = false;

function startCelebrationAudio() {

    weddingMusic.play()
        .then(() => {
            isMusicMuted = false;

            if (toggleMusicBtn) {
                toggleMusicBtn.textContent = "🔊 Sound";
            }
        })
        .catch((error) => {
            console.log("Music playback error:", error);
        });
}

// Music Mute / Unmute
if (toggleMusicBtn) {

    toggleMusicBtn.addEventListener("click", () => {

        if (weddingMusic.paused) {

            weddingMusic.play().then(() => {
                isMusicMuted = false;
                toggleMusicBtn.textContent = "🔊 Sound";
            }).catch(error => {
                console.log("Music playback error:", error);
            });

        } else {

            weddingMusic.pause();
            isMusicMuted = true;
            toggleMusicBtn.textContent = "🔇 Muted";

        }

    });

}

// ==========================================
// AUTO-SCROLL SETTINGS
// ==========================================

let isAutoScrolling = false;
let autoScrollAnimId = null;

const scrollSpeed = 0.85; // Lower = slower, Higher = faster

// ==========================================
// AUTO-SCROLL ENGINE
// ==========================================

function autoScrollStep() {

    if (!isAutoScrolling) return;

    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    if (window.scrollY < maxScroll - 1) {

        window.scrollBy(0, scrollSpeed);

        autoScrollAnimId =
            requestAnimationFrame(autoScrollStep);

    } else {

        pauseAutoScroll();

    }

}

// ==========================================
// START AUTO-SCROLL
// ==========================================

function startAutoScroll() {

    if (isAutoScrolling) return;

    isAutoScrolling = true;

    toggleScrollBtn.textContent = "⏸ Pause Tour";

    autoScrollAnimId =
        requestAnimationFrame(autoScrollStep);

}

// ==========================================
// PAUSE AUTO-SCROLL
// ==========================================

function pauseAutoScroll() {

    isAutoScrolling = false;

    toggleScrollBtn.textContent = "▶ Resume Tour";

    if (autoScrollAnimId) {

        cancelAnimationFrame(autoScrollAnimId);

        autoScrollAnimId = null;

    }

}

// ==========================================
// STOP AUTO-SCROLL ON USER INTERACTION
// ==========================================

window.addEventListener("wheel", () => {

    if (isAutoScrolling) {
        pauseAutoScroll();
    }

}, { passive: true });

window.addEventListener("touchmove", () => {

    if (isAutoScrolling) {
        pauseAutoScroll();
    }

}, { passive: true });

// ==========================================
// INVITATION BUTTON EVENT
// ==========================================

openInviteBtn.addEventListener("click", () => {

    // Fade out landing screen
    landingScreen.classList.add("fade-out");

    setTimeout(() => {

        // Hide landing screen
        landingScreen.classList.add("hidden");

        // Show main invitation content
        mainContent.classList.remove("hidden");

        // Show floating controls
        floatingControls.classList.remove("hidden");

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

        // Start MP3 background music
        startCelebrationAudio();

        // Start automatic scrolling
        setTimeout(() => {
            startAutoScroll();
        }, 900);

    }, 750);

});

// ==========================================
// PAUSE / RESUME TOUR BUTTON
// ==========================================

toggleScrollBtn.addEventListener("click", () => {

    if (isAutoScrolling) {

        pauseAutoScroll();

    } else {

        startAutoScroll();

    }

});

// ==========================================
// WEDDING COUNTDOWN TIMER
// ==========================================

// Format: Year, MonthIndex (0-11), Day, Hour, Minute
// November = 10

const weddingDate = new Date(2026, 10, 22, 11, 28, 0).getTime();

function updateCountdown() {

    const now = new Date().getTime();

    const diff = weddingDate - now;

    if (diff > 0) {

        const days = Math.floor(
            diff / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (diff / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
            (diff / (1000 * 60)) % 60
        );

        const seconds = Math.floor(
            (diff / 1000) % 60
        );

        document.getElementById("days").innerText =
            String(days).padStart(2, "0");

        document.getElementById("hours").innerText =
            String(hours).padStart(2, "0");

        document.getElementById("minutes").innerText =
            String(minutes).padStart(2, "0");

        document.getElementById("seconds").innerText =
            String(seconds).padStart(2, "0");

    } else {

        document.querySelector(".timer-container").innerHTML =
            "<p style='color: #4a0e17; font-weight: bold;'>The Auspicious Wedding Day Has Arrived!</p>";

    }

}

// Update countdown every second
setInterval(updateCountdown, 1000);

updateCountdown();
