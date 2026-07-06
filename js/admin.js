(() => {
  const body = document.body;

  // Ensure mobile-only navbar + drawer exist (single reusable component)
  const ensureMobileNav = () => {
    // Don't recreate if already present
    if (document.querySelector('.admin-topbar--mobile') && document.querySelector('.admin-sidebar--mobile')) return;

    // Try to reuse desktop nav markup if present
    const desktopNav = document.querySelector('[data-admin-nav]');
    const navInner = desktopNav ? desktopNav.innerHTML : `
      <a class="admin-sidebar__link" href="dashboard.html">Dashboard</a>
      <a class="admin-sidebar__link" href="appointments.html">Appointments</a>
      <a class="admin-sidebar__link" href="inquiries.html">Inquiries</a>
      <a class="admin-sidebar__link" href="treatments.html">Treatments</a>
      <a class="admin-sidebar__link" href="availability.html">Availability</a>
      <a class="admin-sidebar__link" href="gallery.html">Gallery</a>
      <a class="admin-sidebar__link" href="doctor-profile.html">Doctor Profile</a>
      <a class="admin-sidebar__link" href="login.html">Logout</a>
    `;

    // Backdrop
    let backdropEl = document.querySelector('[data-admin-backdrop]');
    if (!backdropEl) {
      backdropEl = document.createElement('div');
      backdropEl.className = 'admin-backdrop';
      backdropEl.setAttribute('data-admin-backdrop', '');
      body.prepend(backdropEl);
    }

    // Mobile sidebar (drawer)
    if (!document.querySelector('.admin-sidebar--mobile')) {
      const aside = document.createElement('aside');
      aside.className = 'admin-sidebar admin-sidebar--mobile';
      aside.setAttribute('data-admin-sidebar', '');
      aside.innerHTML = `
        <div class="admin-sidebar__header">
          <div class="admin-brand"><span class="admin-brand__mark" aria-hidden="true"></span><span>Juhi Admin</span></div>
          <button class="admin-sidebar__close" type="button" data-sidebar-close aria-label="Close sidebar">×</button>
        </div>
        <nav class="admin-sidebar__nav" data-admin-nav>
          ${navInner}
        </nav>
        <div class="admin-sidebar__footer">Juhi Eye Care admin</div>
      `;
      body.prepend(aside);
    }

    // Mobile topbar
    if (!document.querySelector('.admin-topbar--mobile')) {
      const header = document.createElement('header');
      header.className = 'admin-topbar admin-topbar--mobile';
      header.innerHTML = `
        <div class="admin-topbar__title">
          <button class="admin-sidebar__toggle" type="button" data-sidebar-toggle aria-label="Open sidebar">☰</button>
          <div><h1>Juhi Admin</h1></div>
        </div>
        <div class="admin-topbar__actions"><!-- optional avatar place --></div>
      `;
      // insert header after backdrop (so it's visible)
      const firstChild = body.querySelector('main, .admin-shell, #main');
      if (firstChild) firstChild.before(header);
      else body.prepend(header);
    }
  };

  // Run ensure before selecting UI nodes — skip on the login page to avoid showing the hamburger there
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage !== 'login.html') {
    ensureMobileNav();
  }

  const desktopSidebar = document.querySelector('.admin-sidebar:not(.admin-sidebar--mobile)[data-admin-sidebar]');
  const mobileSidebar = document.querySelector('.admin-sidebar--mobile[data-admin-sidebar]');
  const backdrop = document.querySelector('[data-admin-backdrop]');
  const openers = document.querySelectorAll('[data-sidebar-toggle]');
  const closers = document.querySelectorAll('[data-sidebar-close]');

  const getActiveSidebar = () => {
    // On small screens use mobile sidebar if present
    if (window.innerWidth < 1024 && mobileSidebar) return mobileSidebar;
    return desktopSidebar || mobileSidebar;
  };

  const setSidebar = (open) => {
    const sidebar = getActiveSidebar();
    if (!sidebar || !backdrop) return;
    sidebar.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-visible', open);
    body.style.overflow = open ? 'hidden' : '';
  };

  openers.forEach((button) => {
    button.addEventListener('click', () => setSidebar(true));
  });

  closers.forEach((button) => {
    button.addEventListener('click', () => setSidebar(false));
  });

  if (backdrop) {
    backdrop.addEventListener("click", () => setSidebar(false));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSidebar(false);
  });

  document.querySelectorAll("[data-admin-nav] a").forEach((link) => {
    const current = window.location.pathname.split("/").pop();
    const href = link.getAttribute("href")?.split("/").pop();
    if (href && href === current) {
      link.classList.add("is-active");
    }
    // Close drawer after selecting a menu item on mobile
    link.addEventListener("click", () => {
      setSidebar(false);
    });
  });

  document.querySelectorAll("[data-login-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = form.querySelector('#email')?.value.trim() || '';
      const password = form.querySelector('#password')?.value || '';

      // Hardcoded admin credentials (client-side). Only this combo will be allowed.
      const ADMIN_EMAIL = 'virajathakre123@gmail.com';
      const ADMIN_PASSWORD = 'Thanks Viraj';

      // Remove previous error if any
      let err = form.querySelector('[data-login-error]');
      if (err) err.remove();

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Successful login (client-side). Redirect to admin dashboard.
        window.location.href = "dashboard.html";
        return;
      }

      // Show accessible inline error message for failed attempts
      err = document.createElement('div');
      err.setAttribute('data-login-error', '');
      err.className = 'admin-login-error';
      err.setAttribute('role', 'alert');
      err.textContent = 'Invalid email or password.';
      const submitBtn = form.querySelector('button[type=submit]');
      if (submitBtn && submitBtn.parentNode) submitBtn.parentNode.insertBefore(err, submitBtn.nextSibling);
      else form.appendChild(err);
    });
  });

  // Password show/hide toggle for inputs with `data-password-toggle`
  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const wrap = button.closest('.admin-input-wrap');
      const input = wrap?.querySelector('input');
      if (!input) return;
      const wasPassword = input.type === 'password';
      input.type = wasPassword ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(!wasPassword));
      button.setAttribute('aria-label', wasPassword ? 'Hide password' : 'Show password');
      button.querySelector('.icon--show')?.classList.toggle('is-hidden', !wasPassword);
      button.querySelector('.icon--hide')?.classList.toggle('is-hidden', wasPassword);
    });
  });

  document.querySelectorAll("[data-status-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const badge = button.closest("[data-status-row]")?.querySelector("[data-status-badge]");
      if (!badge) return;
      const current = badge.dataset.status || "pending";
      const next = current === "pending" ? "confirmed" : current === "confirmed" ? "cancelled" : "pending";
      badge.dataset.status = next;
      badge.textContent = next === "pending" ? "Pending" : next === "confirmed" ? "Confirmed" : "Cancelled";
      badge.className = `admin-badge admin-badge--${next}`;
    });
  });

  document.querySelectorAll("[data-inquiry-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest("[data-inquiry-item]");
      if (!item) return;
      item.classList.add("is-complete");
      const badge = item.querySelector("[data-inquiry-badge]");
      if (badge) {
        badge.textContent = "Replied";
        badge.className = "admin-badge admin-badge--confirmed";
      }
      button.textContent = "Followed up";
      button.disabled = true;
    });
  });

  document.querySelectorAll("[data-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-selected");
    });
  });

  document.querySelectorAll("[data-calendar-day]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-calendar-day].is-selected").forEach((active) => {
        active.classList.remove("is-selected");
      });
      button.classList.add("is-selected");
      const output = document.querySelector("[data-selected-date]");
      if (output) output.textContent = button.dataset.date || button.textContent.trim();
    });
  });

  document.querySelectorAll("[data-treatment-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-active");
      button.textContent = button.classList.contains("is-active") ? "Live" : "Draft";
    });
  });

  document.querySelectorAll("[data-remove-card]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("[data-removable-card]")?.remove();
    });
  });

  document.querySelectorAll("[data-gallery-upload]").forEach((input) => {
    input.addEventListener("change", () => {
      const grid = document.querySelector("[data-gallery-grid]");
      if (!grid || !input.files?.length) return;
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const card = document.createElement("article");
          card.className = "admin-gallery-card";
          card.setAttribute("data-removable-card", "");
          card.innerHTML = `
            <div class="admin-gallery-card__media"><img alt="${file.name}" src="${reader.result}"></div>
            <div class="admin-gallery-card__body">
              <div>
                <h4 class="admin-gallery-card__title">${file.name}</h4>
                <div class="admin-gallery-card__caption">Uploaded just now</div>
              </div>
              <div class="admin-actions">
                <button class="admin-mini-button admin-mini-button--danger" type="button" data-remove-card>Delete</button>
              </div>
            </div>
          `;
          grid.prepend(card);
          card.querySelector("[data-remove-card]")?.addEventListener("click", () => card.remove());
        };
        reader.readAsDataURL(file);
      });
      input.value = "";
    });
  });

  document.querySelectorAll("[data-profile-photo-input]").forEach((input) => {
    input.addEventListener("change", () => {
      const preview = document.querySelector("[data-profile-photo-preview]");
      if (!preview || !input.files?.[0]) return;
      const reader = new FileReader();
      reader.onload = () => {
        preview.innerHTML = `<img alt="Doctor profile preview" src="${reader.result}">`;
      };
      reader.readAsDataURL(input.files[0]);
    });
  });

  document.querySelectorAll("[data-restore-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      const preview = document.querySelector("[data-profile-photo-preview]");
      if (!preview) return;
      preview.innerHTML = `<div class="admin-photo-frame__empty">Current profile photo</div>`;
      const fileInput = document.querySelector("[data-profile-photo-input]");
      if (fileInput) fileInput.value = "";
    });
  });

  document.querySelectorAll("[data-add-treatment]").forEach((button) => {
    button.addEventListener("click", () => {
      const title = document.querySelector("[data-treatment-title]")?.value.trim();
      const slug = document.querySelector("[data-treatment-slug]")?.value.trim();
      const summary = document.querySelector("[data-treatment-summary]")?.value.trim();
      const list = document.querySelector("[data-treatment-list]");
      if (!title || !list) return;

      const card = document.createElement("article");
      card.className = "admin-list-card";
      card.setAttribute("data-removable-card", "");
      card.innerHTML = `
        <div class="admin-list-card__head">
          <div>
            <h4 class="admin-list-card__title">${title}</h4>
            <div class="admin-list-card__sub">${slug || "New treatment"}</div>
          </div>
          <span class="admin-badge admin-badge--pending">Draft</span>
        </div>
        <div class="admin-list-card__body">${summary || "New treatment content ready for editing."}</div>
        <div class="admin-list-card__footer">
          <button class="admin-mini-button" type="button">Edit</button>
          <button class="admin-mini-button admin-mini-button--primary" type="button" data-treatment-toggle>Draft</button>
          <button class="admin-mini-button admin-mini-button--danger" type="button" data-remove-card>Remove</button>
        </div>
      `;
      list.prepend(card);
      card.querySelectorAll("[data-treatment-toggle]").forEach((toggle) => {
        toggle.addEventListener("click", () => {
          toggle.classList.toggle("is-active");
          toggle.textContent = toggle.classList.contains("is-active") ? "Live" : "Draft";
        });
      });
      card.querySelector("[data-remove-card]")?.addEventListener("click", () => card.remove());
      const inputs = ["data-treatment-title", "data-treatment-slug", "data-treatment-summary"];
      inputs.forEach((selector) => {
        const field = document.querySelector(`[${selector}]`);
        if (field) field.value = "";
      });
    });
  });
})();
