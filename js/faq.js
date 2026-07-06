const accordion = document.querySelector("[data-faq-accordion]");

if (accordion) {
  const items = Array.from(accordion.querySelectorAll("[data-faq-item]"));

  const setPanelState = (item, expanded) => {
    const trigger = item.querySelector("[data-faq-trigger]");
    const panel = item.querySelector("[data-faq-panel]");

    item.classList.toggle("is-open", expanded);
    trigger.setAttribute("aria-expanded", String(expanded));

    if (expanded) {
      panel.hidden = false;
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      panel.style.opacity = "1";
    } else {
      panel.style.maxHeight = "0px";
      panel.style.opacity = "0";
      window.setTimeout(() => {
        if (!item.classList.contains("is-open")) {
          panel.hidden = true;
        }
      }, 240);
    }
  };

  const closeOthers = (activeItem) => {
    items.forEach((item) => {
      if (item !== activeItem) {
        setPanelState(item, false);
      }
    });
  };

  items.forEach((item, index) => {
    const trigger = item.querySelector("[data-faq-trigger]");
    const panel = item.querySelector("[data-faq-panel]");

    panel.hidden = index !== 0;
    panel.style.maxHeight = index === 0 ? `${panel.scrollHeight}px` : "0px";
    panel.style.opacity = index === 0 ? "1" : "0";

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      closeOthers(item);
      setPanelState(item, !isOpen);
    });
  });

  window.addEventListener("resize", () => {
    items.forEach((item) => {
      const trigger = item.querySelector("[data-faq-trigger]");
      const panel = item.querySelector("[data-faq-panel]");

      if (trigger.getAttribute("aria-expanded") === "true") {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });
}
