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

// video-section

document.addEventListener("DOMContentLoaded", () => {
  const playButtons = document.querySelectorAll(".play-btn");
  const muteButtons = document.querySelectorAll(".mute-btn");
  const videos = document.querySelectorAll(".scroll-video");

  playButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const video = videos[index];

      if (video.paused) {
        // Pause all other videos
        videos.forEach((v, i) => {
          if (i !== index) {
            v.pause();
            playButtons[i].textContent = "▶";
          }
        });
        video.play();
        btn.textContent = "⏸";
      } else {
        video.pause();
        btn.textContent = "▶";
      }
    });
  });

  muteButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const video = videos[index];
      video.muted = !video.muted;
      btn.textContent = video.muted ? "🔇" : "🔊";
    });
  });
});

//pup section-js
function setupPupCarousel() {
  const wrapper = document.getElementById("pup-wrapper-id");
  const nextButtons = document.querySelectorAll(".pup-next-btn");
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (!wrapper || nextButtons.length === 0 || !isMobile) return;

  nextButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const targetId = btn.getAttribute("data-target");
      const targetCard = document.getElementById(targetId);

      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: "smooth",
          inline: "start",
        });
      } else if (targetId === "pup-card-1") {
        document.getElementById("pup-card-1").scrollIntoView({
          behavior: "smooth",
          inline: "start",
        });
      }
    });
  });
}

window.onload = setupPupCarousel;
window.onresize = setupPupCarousel;


// scoop-section-js 
const buttons = document.querySelectorAll('.scoop-toggle');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const dropdown = btn.closest('.scoop-card').querySelector('.scoop-dropdown');
    const isActive = btn.classList.contains('active');

    // Close all others
    document.querySelectorAll('.scoop-toggle').forEach(b => {
      b.classList.remove('active');
      b.textContent = '+';
    });
    document.querySelectorAll('.scoop-dropdown').forEach(d => {
      d.classList.remove('show');
    });

    // Toggle current
    if (!isActive) {
      btn.classList.add('active');
      btn.textContent = '×';
      dropdown.classList.add('show');
    }
  });
});

//faq-section-js
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
