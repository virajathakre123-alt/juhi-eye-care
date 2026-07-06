const navbarSlots = document.querySelectorAll("[data-navbar-include]");
const fallbackNavbar = `
<nav class="desktop-navbar" aria-label="Desktop navigation">
  <a class="desktop-navbar__brand" href="index.html" aria-label="Dr. Juhi Dhokne home">
    <img class="desktop-navbar__logo" src="assets/images/figma-logo.png" alt="" aria-hidden="true">
    <span>Dr. Juhi Dhokne</span>
  </a>
  <ul class="desktop-navbar__links">
    <li><a data-nav-link href="index.html">Home</a></li>
    <li><a data-nav-link href="about.html">About</a></li>
    <li><a data-nav-link href="gallery.html">Gallery</a></li>
    <li><a data-nav-link href="treatments.html">Treatment</a></li>
    <li><a data-nav-link href="testimonials.html">Patient Testimonial</a></li>
    <li><a data-nav-link href="faq.html">FAQ's</a></li>
    <li><a data-nav-link href="contact.html">Contact</a></li>
  </ul>
  <a class="desktop-navbar__cta" data-nav-link href="appointment.html">Book Appointment</a>
</nav>`;

navbarSlots.forEach(async (slot) => {
  const source = slot.getAttribute("data-navbar-include");

  try {
    const response = await fetch(source);

    if (!response.ok) {
      throw new Error(`Unable to load ${source}`);
    }

    slot.innerHTML = await response.text();
    document.dispatchEvent(new CustomEvent("navbar:loaded"));
  } catch (error) {
    slot.innerHTML = fallbackNavbar;
    document.dispatchEvent(new CustomEvent("navbar:loaded"));
  }
});
