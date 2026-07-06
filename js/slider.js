document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector("[data-slider-track]");
  const originalSlides = Array.from(slider.querySelectorAll("[data-slide]"));
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  const dots = Array.from(slider.querySelectorAll("[data-slider-dot]"));
  const autoplay = slider.hasAttribute("data-slider-autoplay");
  const interval = Number(slider.getAttribute("data-slider-interval") || 4000);
  let index = 0;
  let isAnimating = false;
  let timer = null;

  if (autoplay && originalSlides.length > 1) {
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    firstClone.setAttribute("data-slide-clone", "true");
    lastClone.setAttribute("data-slide-clone", "true");
    track.insertBefore(lastClone, originalSlides[0]);
    track.appendChild(firstClone);
    index = 1;
  }

  const slides = Array.from(slider.querySelectorAll("[data-slide]"));
  const firstLogicalIndex = autoplay && originalSlides.length > 1 ? 1 : 0;
  const lastLogicalIndex = autoplay && originalSlides.length > 1 ? slides.length - 2 : slides.length - 1;

  const getLogicalIndex = () => {
    if (!autoplay || originalSlides.length <= 1) {
      return index;
    }
    if (index <= 0) {
      return originalSlides.length - 1;
    }
    if (index >= slides.length - 1) {
      return 0;
    }
    return index - 1;
  };

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    const logicalIndex = autoplay && originalSlides.length > 1 ? getLogicalIndex() : index;
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", String(slideIndex !== index));
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === logicalIndex);
      dot.setAttribute("aria-current", dotIndex === logicalIndex ? "true" : "false");
    });
  };

  const jumpTo = (targetIndex, animate = true) => {
    if (!animate) {
      track.style.transition = "none";
      index = targetIndex;
      update();
      requestAnimationFrame(() => {
        track.style.transition = "";
      });
      return;
    }

    index = targetIndex;
    update();
  };

  prev?.addEventListener("click", () => {
    if (isAnimating) return;
    if (autoplay && originalSlides.length > 1) {
      index -= 1;
      update();
      return;
    }
    index = (index - 1 + slides.length) % slides.length;
    update();
  });

  next?.addEventListener("click", () => {
    if (isAnimating) return;
    if (autoplay && originalSlides.length > 1) {
      index += 1;
      update();
      return;
    }
    index = (index + 1) % slides.length;
    update();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      if (autoplay && originalSlides.length > 1) {
        index = dotIndex + 1;
      } else {
        index = dotIndex;
      }
      update();
    });
  });

  track.addEventListener("transitionstart", () => {
    isAnimating = true;
  });

  track.addEventListener("transitionend", () => {
    isAnimating = false;
    if (!autoplay || originalSlides.length <= 1) return;

    if (index === 0) {
      jumpTo(originalSlides.length, false);
    } else if (index === slides.length - 1) {
      jumpTo(1, false);
    }
  });

  const startAutoplay = () => {
    if (!autoplay || originalSlides.length <= 1) return;
    timer = window.setInterval(() => {
      index += 1;
      update();
    }, interval);
  };

  const stopAutoplay = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);
  slider.addEventListener("focusin", stopAutoplay);
  slider.addEventListener("focusout", startAutoplay);

  update();
  startAutoplay();
});
