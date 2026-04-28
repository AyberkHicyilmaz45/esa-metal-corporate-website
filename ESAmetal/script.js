const cursorRing = document.getElementById("cursorRing");

const clickableNodes = document.querySelectorAll(

  "a, button, .clickable, input, textarea, select, .service-card, .material-item"

);



window.addEventListener("mousemove", (event) => {

  cursorRing.style.left = `${event.clientX}px`;

  cursorRing.style.top = `${event.clientY}px`;

});



clickableNodes.forEach((node) => {

  node.addEventListener("mouseenter", () => cursorRing.classList.add("active"));

  node.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));

});



const materialButtons = document.querySelectorAll(".material-item");

materialButtons.forEach((button) => {

  button.addEventListener("mouseenter", () => {

    materialButtons.forEach((item) => item.classList.remove("active"));

    button.classList.add("active");

  });

});



function setupMobileMenu() {

  const menuBtn = document.getElementById("mobileMenuBtn");

  const nav = document.getElementById("mainNav");

  if (!menuBtn || !nav) return;



  const toggleMenu = (force) => {

    const shouldOpen = typeof force === "boolean" ? force : !nav.classList.contains("is-open");

    nav.classList.toggle("is-open", shouldOpen);

    document.body.style.overflow = shouldOpen && window.innerWidth <= 720 ? "hidden" : "";

    const icon = menuBtn.querySelector("i");

    if (icon) {

      icon.classList.toggle("bi-list", !shouldOpen);

      icon.classList.toggle("bi-x-lg", shouldOpen);

    }

  };



  menuBtn.addEventListener("click", () => toggleMenu());



  nav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => toggleMenu(false));

  });



  window.addEventListener("resize", () => {

    if (window.innerWidth > 720) toggleMenu(false);

  });



  document.addEventListener("click", (event) => {

    if (window.innerWidth > 720) return;

    if (nav.contains(event.target) || menuBtn.contains(event.target)) return;

    toggleMenu(false);

  });



  window.addEventListener("keydown", (event) => {

    if (event.key === "Escape") toggleMenu(false);

  });

}



function setupHeroStrip() {

  const heroSection = document.getElementById("hero");

  const heroStrip = document.getElementById("heroStrip");

  const heroPrev = document.getElementById("heroPrev");

  const heroNext = document.getElementById("heroNext");

  const heroDots = document.getElementById("heroDots");

  if (!heroStrip) return;

  const slides = Array.from(heroStrip.querySelectorAll(".hero-slide"));

  const dots = [];

  let current = 0;

  let dragStartX = 0;

  let dragCurrentX = 0;

  let isDragging = false;

  let autoTimer;



  const setActiveSlide = (nextIndex) => {

    current = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === current));

    dots.forEach((dot, index) => dot.classList.toggle("is-active", index === current));

  };



  const scheduleAuto = () => {

    clearInterval(autoTimer);

    autoTimer = setInterval(() => setActiveSlide(current + 1), 5200);

  };



  const onPointerDown = (clientX) => {

    isDragging = true;

    dragStartX = clientX;

    dragCurrentX = clientX;

    heroStrip.style.cursor = "grabbing";

    clearInterval(autoTimer);

  };



  const onPointerMove = (clientX) => {

    if (!isDragging) return;

    dragCurrentX = clientX;

  };



  const onPointerUp = () => {

    if (!isDragging) return;

    isDragging = false;

    heroStrip.style.cursor = "grab";

    const delta = dragCurrentX - dragStartX;

    const threshold = window.innerWidth * 0.12;

    if (delta < -threshold) setActiveSlide(current + 1);

    else if (delta > threshold) setActiveSlide(current - 1);

    else setActiveSlide(current);

    scheduleAuto();

  };



  heroStrip.addEventListener("mousedown", (event) => onPointerDown(event.clientX));

  window.addEventListener("mousemove", (event) => onPointerMove(event.clientX));

  window.addEventListener("mouseup", onPointerUp);



  heroStrip.addEventListener("touchstart", (event) => onPointerDown(event.touches[0].clientX), { passive: true });

  window.addEventListener("touchmove", (event) => onPointerMove(event.touches[0].clientX), { passive: true });

  window.addEventListener("touchend", onPointerUp);



  if (heroPrev) {

    heroPrev.addEventListener("click", () => {

      setActiveSlide(current - 1);

      scheduleAuto();

    });

  }



  if (heroNext) {

    heroNext.addEventListener("click", () => {

      setActiveSlide(current + 1);

      scheduleAuto();

    });

  }



  if (heroDots) {

    slides.forEach((_, index) => {

      const dot = document.createElement("button");

      dot.type = "button";

      dot.className = "hero-dot clickable";

      dot.setAttribute("aria-label", `${index + 1}. slayta git`);

      dot.addEventListener("click", () => {

        setActiveSlide(index);

        scheduleAuto();

      });

      heroDots.appendChild(dot);

      dots.push(dot);

    });

  }



  window.addEventListener("mousemove", (event) => {

    if (!heroSection) return;

    const inRightZone = event.clientX > window.innerWidth * 0.64;

    heroSection.classList.toggle("hero-arrow-active", inRightZone);

  });



  setActiveSlide(0);

  scheduleAuto();

}



const logoMarquee = document.getElementById("logoMarquee");

const logoTrack = document.getElementById("logoTrack");



let isDragging = false;

let startX = 0;

let currentTranslate = 0;

let autoSpeed = 0.7;

let isUserControlling = false;



function normalizeLoop(value) {

  const trackWidth = logoTrack.scrollWidth / 2;

  if (trackWidth === 0) return 0;

  while (value <= -trackWidth) value += trackWidth;

  while (value > 0) value -= trackWidth;

  return value;

}



function applyTranslate(value) {

  currentTranslate = normalizeLoop(value);

  logoTrack.style.transform = `translateX(${currentTranslate}px)`;

}



function startAutoLoop() {

  const animate = () => {

    if (!isUserControlling) {

      applyTranslate(currentTranslate - autoSpeed);

    }

    requestAnimationFrame(animate);

  };

  requestAnimationFrame(animate);

}



logoMarquee.addEventListener("mousedown", (event) => {

  isDragging = true;

  isUserControlling = true;

  startX = event.clientX;

  event.preventDefault();

  logoTrack.style.cursor = "grabbing";

});



window.addEventListener("mouseup", () => {

  if (isDragging) {

    isDragging = false;

    logoTrack.style.cursor = "grab";

    setTimeout(() => {

      isUserControlling = false;

    }, 1000);

  }

});



window.addEventListener("mousemove", (event) => {

  if (!isDragging) return;

  const delta = event.clientX - startX;

  startX = event.clientX;

  applyTranslate(currentTranslate + delta);

});



logoMarquee.addEventListener("wheel", (event) => {

  event.preventDefault();

  isUserControlling = true;

  applyTranslate(currentTranslate - event.deltaY * 0.7);

  clearTimeout(window.marqueeTimer);

  window.marqueeTimer = setTimeout(() => {

    isUserControlling = false;

  }, 1200);

});



logoMarquee.addEventListener("touchstart", (event) => {

  isDragging = true;

  isUserControlling = true;

  startX = event.touches[0].clientX;

});



window.addEventListener("touchmove", (event) => {

  if (!isDragging) return;

  event.preventDefault();

  const pointX = event.touches[0].clientX;

  const delta = pointX - startX;

  startX = pointX;

  applyTranslate(currentTranslate + delta);

}, { passive: false });



window.addEventListener("touchend", () => {

  if (!isDragging) return;

  isDragging = false;

  setTimeout(() => {

    isUserControlling = false;

  }, 1000);

});



startAutoLoop();

setupHeroStrip();

setupMobileMenu();



document.querySelectorAll(".logo-track img, .hero-slide img").forEach((img) => {

  img.addEventListener("dragstart", (event) => event.preventDefault());

});








const btn = document.querySelector('.esa-btn-elite');

btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Hafif esneme hareketi
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px) scale(1.02)`;
});

btn.addEventListener('mouseleave', () => {
    // Eski yerine dönüş
    btn.style.transform = 'translate(0px, 0px) scale(1)';
});
