function toggleMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const menu = document.getElementById('mobileMenu');

  // Toggle visibility of the overlay
  if (overlay.style.display === 'block') {
    // If closing, hide the menu first (transition will run)
    menu.classList.remove('open');
    // Hide overlay after transition (or immediately for simplicity)
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300); // Wait for CSS transition time

  } else {
    // If opening, show the overlay immediately, then start transition
    overlay.style.display = 'block';
    // Use setTimeout to ensure the browser registers display:block before starting transition
    setTimeout(() => {
      menu.classList.add('open');
    }, 10);
  }
}

function toggleSubMenu(event) {
  // Prevent link navigation
  event.preventDefault();

  // Find the parent LI of the clicked link
  const parentLi = event.currentTarget.closest('.mobile-dropdown-parent');

  // The content is the element with class .sub-menu-content inside the parent LI
  const content = parentLi.querySelector('.sub-menu-content');

  // Find the toggle icon within the anchor tag
  const icon = event.currentTarget.querySelector('.dropdown-toggle');

  if (content && icon) {
    if (content.classList.contains('open')) {
      // Close the menu
      content.classList.remove('open');
      icon.textContent = '+';
    } else {
      // Open the menu
      content.classList.add('open');
      icon.textContent = '-';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('pressTrack');

  // Calculate the total scroll distance for 9 items
  function calcDistance() {
    const items = track.querySelectorAll('.press-item');
    if (items.length < 9) return 0;

    let total = 0;
    const gap = 32;

    for (let i = 0; i < 9; i++) {
      total += items[i].getBoundingClientRect().width + gap;
    }

    return total;
  }

  // Dynamically create @keyframes rule based on distance
  function updateAnimation() {
    const distance = calcDistance();
    const sheet = document.createElement('style');
    sheet.innerHTML = `
            @keyframes press-slide {
                from { transform: translateX(0); }
                to { transform: translateX(-${distance}px); }
            }
        `;
    document.head.appendChild(sheet);

    track.style.animation = 'none';
    void track.offsetWidth; // Restart animation
    track.style.animation = 'press-slide 35s linear infinite';
  }

  updateAnimation();
  window.addEventListener('resize', updateAnimation);
});

// product-section-js 
function setupPuploveCarousel() {
  const wrapper = document.getElementById("puplove-cards-id");
  const nextButtons = document.querySelectorAll(".puplove-next-btn");

  if (!wrapper || nextButtons.length === 0) return;

  nextButtons.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      if (window.matchMedia("(max-width: 768px)").matches) {
        const cards = wrapper.querySelectorAll(".puplove-card");
        if (cards.length > index + 1) {
          const nextCard = cards[index + 1];
          const cardWidth = nextCard.offsetWidth;
          const wrapperPadding = (wrapper.clientWidth - cardWidth) / 2;

          wrapper.scrollTo({
            left: nextCard.offsetLeft - wrapperPadding,
            behavior: "smooth",
          });
        } else {
          wrapper.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    });
  });

  if (window.matchMedia("(min-width: 769px)").matches) {
    nextButtons.forEach((btn) => (btn.style.display = "none"));
  }
}

window.onload = setupPuploveCarousel;

// video-section-js 
const TRACK_ID = "video-carousel-track";
const NUM_VIDEOS = 7;
const SCROLL_SPEED = 1; // Pixels per interval for auto-scroll
const SCROLL_INTERVAL = 25; // Milliseconds (40 FPS)
const MOBILE_BREAKPOINT = 640; // Defined in CSS

// SVG Icons (Play, Pause, Volume Up, Volume Off)
const ICON_PLAY =
  '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const ICON_PAUSE =
  '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
const ICON_VOL_UP =
  '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.81 5 3.53 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
const ICON_VOL_OFF =
  '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 15.17 21 13.63 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.81 5 3.53 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.27 4.27 1.51-1.51L5.73 3 4.27 3zm11.23 11.23l-3.71-3.71v-2.06c2.89.81 5 3.53 5 6.71 0 1.01-.25 1.96-.7 2.82l-1.49-1.49z"/></svg>';

// --- State and Setup ---
let scrollIntervalId = null;
let trackElement = null;
let singleSetWidth = 0; // Width of one set of 7 cards + gaps
let isTransitioning = false; // Flag to prevent scroll listener from triggering during instant jumps

// ** STEP 1: Define your image URLs here **
const videoImageUrls = [
  "./images/video1-thumbnail.png", // Placeholder 1
  "./images/video2-thumbnail.jpg", // Placeholder 2
  "./images/video1-thumbnail.png", // Placeholder 3
  "https://your-domain.com/path/to/video4.jpg", // Placeholder 4
  "./images/video1-thumbnail.png", // Placeholder 5
  "https://your-domain.com/path/to/video6.jpg", // Placeholder 6
  "./images/video1-thumbnail.png", // Placeholder 7
];
// Replace the above URLs with the actual image links for your 7 videos.

// --- Card Generation and Event Handlers ---

/**
 * Creates the HTML structure for a single video card.
 */
function createVideoCard(index) {
  // ** STEP 2: Use the index to select the correct URL **
  const imageIndex = index - 1; // index is 1-based, array is 0-based
  const imageUrl = videoImageUrls[imageIndex];

  return `
                <div class="video-card" data-video-id="${index}" data-playing="false" data-muted="false">
                    <div class="video-placeholder">
                        <img src="${imageUrl}" onerror="this.src='https://placehold.co/310x434/92e076/ffffff?text=Video+${index}'" alt="Video Thumbnail ${index}">
                    </div>
                    <div class="video-controls">
                        <button class="control-btn play-pause-btn" data-control="play" aria-label="Play Video ${index}">
                            ${ICON_PLAY}
                        </button>
                        <button class="control-btn mute-unmute-btn" data-control="mute" aria-label="Mute Video ${index}">
                            ${ICON_VOL_UP}
                        </button>
                    </div>
                </div>
            `;
}
// ... (rest of the JavaScript functions)

/**
 * Attaches event listeners to the cards for interaction.
 */
function attachEventListeners() {
  const track = document.getElementById(TRACK_ID);

  // Delegate the click events to the track element
  track.addEventListener("click", (event) => {
    const button = event.target.closest(".control-btn");
    if (!button) return;

    const card = button.closest(".video-card");
    if (!card) return;

    const videoId = card.getAttribute("data-video-id");

    if (button.classList.contains("play-pause-btn")) {
      togglePlayPause(card, videoId);
    } else if (button.classList.contains("mute-unmute-btn")) {
      toggleMuteUnmute(card, videoId);
    }
  });

  // Add manual scroll listener for bidirectional looping (now active on all screens)
  track.addEventListener("scroll", handleManualLoop);
}

/**
 * Toggles the play/pause state for all instances of a video card.
 */
function togglePlayPause(clickedCard, videoId) {
  const allCards = document.querySelectorAll(
    `.video-card[data-video-id="${videoId}"]`
  );

  allCards.forEach((card) => {
    const isPlaying = card.getAttribute("data-playing") === "true";
    const newState = !isPlaying;

    card.setAttribute("data-playing", newState);

    const btn = card.querySelector(".play-pause-btn");
    if (newState) {
      btn.innerHTML = ICON_PAUSE;
      btn.setAttribute("aria-label", `Pause Video ${videoId}`);
    } else {
      btn.innerHTML = ICON_PLAY;
      btn.setAttribute("aria-label", `Play Video ${videoId}`);
    }
  });
}

/**
 * Toggles the mute/unmute state for all instances of a video card.
 */
function toggleMuteUnmute(clickedCard, videoId) {
  const allCards = document.querySelectorAll(
    `.video-card[data-video-id="${videoId}"]`
  );

  allCards.forEach((card) => {
    const isMuted = card.getAttribute("data-muted") === "true";
    const newState = !isMuted;

    card.setAttribute("data-muted", newState);

    const btn = card.querySelector(".mute-unmute-btn");
    if (newState) {
      btn.innerHTML = ICON_VOL_OFF;
      btn.setAttribute("aria-label", `Unmute Video ${videoId}`);
    } else {
      btn.innerHTML = ICON_VOL_UP;
      btn.setAttribute("aria-label", `Mute Video ${videoId}`);
    }
  });
}

// --- Continuous Scroll Logic ---

/**
 * Calculates the width of a single set of 7 video cards plus their gaps.
 */
function calculateSingleSetWidth() {
  const firstCard = trackElement.querySelector(".video-card");
  if (!firstCard) return 0;

  const style = getComputedStyle(trackElement);
  // We use the root variable fallback here since getComputedStyle is unreliable in some environments
  const gap = parseFloat(style.getPropertyValue("gap")) || 20;

  const cardWidth = firstCard.offsetWidth;

  // Width of 7 cards + 6 gaps
  singleSetWidth = cardWidth * NUM_VIDEOS + gap * (NUM_VIDEOS - 1);
}

/**
 * Handles the instant jumps for seamless manual looping (both forward and backward).
 * This logic now runs on all screen sizes.
 */
function handleManualLoop() {
  // Only run the loop logic if not currently transitioning or width hasn't been calculated
  if (isTransitioning || singleSetWidth === 0) return;

  const scrollPos = trackElement.scrollLeft;

  // Determine if we are on a desktop (where scroll-behavior is smooth)
  const isDesktop = window.innerWidth > MOBILE_BREAKPOINT;

  // --- Backward Jump Logic ---
  // If the scroll position is near 0 (scrolled into the first clone set)
  if (scrollPos < SCROLL_SPEED) {
    isTransitioning = true;

    // Instantaneously jump to the start of the third (last) set of videos
    if (isDesktop) trackElement.style.scrollBehavior = "auto";
    trackElement.scrollLeft = 2 * singleSetWidth;

    // Reset back to smooth behavior on desktop after the jump
    requestAnimationFrame(() => {
      isTransitioning = false;
      if (isDesktop) trackElement.style.scrollBehavior = "smooth";
    });
    return;
  }

  // --- Forward Jump Logic ---
  // If the scroll position is past the Original set (into the third clone set)
  if (scrollPos >= 2 * singleSetWidth) {
    isTransitioning = true;

    // Instantaneously jump back to the start of the second (Original) set
    if (isDesktop) trackElement.style.scrollBehavior = "auto";
    trackElement.scrollLeft = singleSetWidth;

    // Reset back to smooth behavior on desktop after the jump
    requestAnimationFrame(() => {
      isTransitioning = false;
      if (isDesktop) trackElement.style.scrollBehavior = "smooth";
    });
    return;
  }
}

/**
 * The loop function that handles automatic scrolling (forward only) and resetting.
 * This remains disabled on mobile (<= 640px).
 */
function autoScrollLoop() {
  // Disable auto-scroll on small screens as requested
  if (window.innerWidth <= MOBILE_BREAKPOINT) {
    stopAutoScroll();
    return;
  }

  // Scroll the container by the defined speed
  trackElement.scrollLeft += SCROLL_SPEED;

  // Check if we've scrolled past the Original set (into the third clone)
  if (trackElement.scrollLeft >= 2 * singleSetWidth) {
    // Instantly jump back to the start of the Original set
    trackElement.scrollLeft = singleSetWidth;
  }
}

/**
 * Starts the automatic scrolling loop.
 */
function startAutoScroll() {
  if (scrollIntervalId || window.innerWidth <= MOBILE_BREAKPOINT) return; // Already running or on mobile

  // On large screens, start the auto-scroll
  scrollIntervalId = setInterval(autoScrollLoop, SCROLL_INTERVAL);
}

/**
 * Stops the automatic scrolling loop.
 */
function stopAutoScroll() {
  clearInterval(scrollIntervalId);
  scrollIntervalId = null;
}

/**
 * Initialization function.
 */
function initCarousel() {
  trackElement = document.getElementById(TRACK_ID);

  if (!trackElement) {
    console.error("Carousel track element not found.");
    return;
  }

  // 1. Generate the initial set of 7 videos HTML
  let originalContent = "";
  for (let i = 1; i <= NUM_VIDEOS; i++) {
    originalContent += createVideoCard(i);
  }

  // 2. Insert three sets: [Clone 1] + [Original] + [Clone 2]
  trackElement.innerHTML =
    originalContent + originalContent + originalContent;

  // 3. Attach event listeners (includes play/pause/mute and manual scroll loop)
  attachEventListeners();

  // 4. Calculate the width of one set
  calculateSingleSetWidth();

  // 5. Start the carousel focused on the "Original" set (the middle one)
  // This is the starting position for all screen sizes
  trackElement.scrollLeft = singleSetWidth;

  // 6. Start the automatic scroll loop (if not on mobile)
  startAutoScroll();

  // 7. Handle pausing on hover/touch (only affects auto-scroll on desktop/tablet)
  trackElement.addEventListener("mouseenter", stopAutoScroll);
  trackElement.addEventListener("mouseleave", startAutoScroll);

  // Re-evaluate scroll status on window resize
  window.addEventListener("resize", () => {
    // Recalculate width on resize (important as card sizes change based on media queries)
    calculateSingleSetWidth();

    // If switching to mobile, stop auto scroll. If switching back to desktop, restart it.
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      stopAutoScroll();
    } else if (!scrollIntervalId) {
      // Reset view to the middle set when returning to desktop view
      trackElement.scrollLeft = singleSetWidth;
      startAutoScroll();
    }
  });
}

// Initialize the carousel when the window loads
window.onload = initCarousel;
// faq-sections-js 
const accordions = document.querySelectorAll(".accordion-header");

accordions.forEach((header) => {
  header.addEventListener("click", () => {
    const openItem = document.querySelector(".accordion-header.active");

    // Close already open accordion
    if (openItem && openItem !== header) {
      openItem.classList.remove("active");
      openItem.nextElementSibling.classList.remove("open");
      openItem.querySelector("span").textContent = "+";
    }

    // Toggle current accordion
    header.classList.toggle("active");
    const content = header.nextElementSibling;
    content.classList.toggle("open");

    // Update plus/minus sign
    const symbol = header.querySelector("span");
    symbol.textContent = header.classList.contains("active") ? "-" : "+";
  });
});
