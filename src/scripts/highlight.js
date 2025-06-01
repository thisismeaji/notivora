const track = document.getElementById("carouselTrack");
const buttons = document.querySelectorAll("#navCarousel button");
const metaParagraphs = document.querySelectorAll(".meta > p");

const slidesCount = buttons.length; // jumlah slide asli (exclude clone)
let currentIndex = 1; // start dari slide asli pertama (index 1 karena index 0 clone terakhir)
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let isDragging = false;

// lebar slide dihitung ulang setiap resize
let slideWidth = 0;

function updateSlideWidth() {
  if (!track) return;
  const slide = track.querySelector(".card");
  if (!slide) return;

  const style = window.getComputedStyle(track);
  const gap = parseFloat(style.gap) || 0;

  slideWidth = slide.clientWidth + gap; // Tambahkan gap ke lebar slide
}

function updateCarousel(index, withTransition = true) {
  if (!track) return;
  updateSlideWidth();

  currentIndex = index;

  if (withTransition) {
    track.style.transition = "transform 0.4s ease-in-out";
  } else {
    track.style.transition = "none";
  }

  currentTranslate = -currentIndex * slideWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();

  // Update tombol navigasi sesuai slide asli (exclude clone)
  const navIndex = (currentIndex - 1 + slidesCount) % slidesCount;
  buttons.forEach((btn, i) => {
    btn.classList.toggle("active", i === navIndex);
  });
}

function setSliderPosition() {
  if (!track) return;
  track.style.transform = `translateX(${currentTranslate}px)`;
}

function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function touchStart(index, event) {
  currentIndex = index;
  startPos = getPositionX(event);
  isDragging = true;
  animationID = requestAnimationFrame(animation);
  if (track) {
    track.classList.add("grabbing");
    track.style.transition = "none"; // matikan transisi selama drag
  }
}

function touchMove(event) {
  if (!isDragging) return;
  const currentPosition = getPositionX(event);
  const diff = currentPosition - startPos;
  currentTranslate = prevTranslate + diff;
}

function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  if (track) {
    track.classList.remove("grabbing");
  }

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100) currentIndex += 1;
  if (movedBy > 100) currentIndex -= 1;

  updateCarousel(currentIndex);

  if (!track) return;
  track.addEventListener("transitionend", onTransitionEnd);
}

function onTransitionEnd() {
  if (!track) return;
  track.style.transition = "none";

  if (currentIndex === 0) {
    currentIndex = slidesCount;
    updateCarousel(currentIndex, false);
  } else if (currentIndex === slidesCount + 1) {
    currentIndex = 1;
    updateCarousel(currentIndex, false);
  }

  // Re-enable transition after instant jump
  setTimeout(() => {
    if (track) {
      track.style.transition = "transform 0.4s ease-in-out";
    }
  }, 20);

  if (track) {
    track.removeEventListener("transitionend", onTransitionEnd);
  }
}

function getPositionX(event) {
  if (event.type.includes("mouse")) {
    return event.pageX;
  } else {
    return event.touches[0].clientX;
  }
}

// tombol navigasi
buttons.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    currentIndex = idx + 1; // karena clone di awal
    updateCarousel(currentIndex);
  });
});

// event drag/swipe
if (track) {
  track.addEventListener("mousedown", (e) => touchStart(currentIndex, e));
  track.addEventListener("mousemove", touchMove);
  track.addEventListener("mouseup", touchEnd);
  track.addEventListener("mouseleave", () => {
    if (isDragging) touchEnd();
  });

  track.addEventListener("touchstart", (e) => touchStart(currentIndex, e));
  track.addEventListener("touchmove", touchMove);
  track.addEventListener("touchend", touchEnd);
}

window.addEventListener("resize", () => {
  updateCarousel(currentIndex, false);
});

// start carousel di slide pertama (index 1)
updateCarousel(currentIndex, false);

metaParagraphs.forEach((p) => {
  let originalText = p.textContent.trim();
  const maxWords = 20;
  const words = originalText.split(/\s+/);

  if (words.length > maxWords) {
    p.textContent = words.slice(0, maxWords).join(" ") + " ...";
  }
});
