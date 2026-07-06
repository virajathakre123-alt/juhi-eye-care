const appointmentCalendar = document.querySelector("[data-appointment-calendar]");

if (appointmentCalendar) {
  const monthLabel = appointmentCalendar.querySelector("[data-month-label]");
  const calendarGrid = appointmentCalendar.querySelector("[data-calendar-grid]");
  const prevButton = appointmentCalendar.querySelector("[data-month-prev]");
  const nextButton = appointmentCalendar.querySelector("[data-month-next]");
  const dateSelect = document.querySelector("[data-date-select]");
  const timeInput = document.querySelector("[data-time-input]");
  const slotContainer = document.querySelector("[data-time-slots]");
  const noSlotsNote = document.querySelector("[data-no-slots]");

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get admin-configured availability from localStorage
  const getAdminAvailability = () => {
    const stored = localStorage.getItem('doctorAvailability');
    return stored ? JSON.parse(stored) : {};
  };

  // Build dynamic available days and slots based on admin configuration
  const buildAvailabilityFromAdmin = () => {
    const adminData = getAdminAvailability();
    const availableDays = {};
    const availableSlots = {};

    Object.entries(adminData).forEach(([dateKey, slots]) => {
      // Parse dateKey format: "2026-05-04"
      const [year, month, day] = dateKey.split('-').map(Number);
      const monthKey = `${year}-${month - 1}`;
      
      if (!availableDays[monthKey]) {
        availableDays[monthKey] = [];
      }
      availableDays[monthKey].push(day);
      availableSlots[dateKey] = slots;
    });

    return { availableDays, availableSlots };
  };

  // Fallback to default slots if no admin configuration exists
  const defaultAvailableSlots = {
    "2026-05-04": ["09:00 AM","09:30 AM","11:00 AM"],
    "2026-06-21": ["09:00 AM","10:00 AM","11:00 AM"]
  };

  let { availableDays, availableSlots } = buildAvailabilityFromAdmin();
  
  // Use defaults if empty
  if (Object.keys(availableSlots).length === 0) {
    availableSlots = defaultAvailableSlots;
    availableDays = {
      "2026-4": [4],
      "2026-5": [21]
    };
  }

  let currentDate = new Date(2026, 4, 1);
  let selectedDate = "2026-05-04";

  const formatDateValue = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const formatSelectLabel = (year, month, day) => {
    return `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;
  };

  const syncSelectOptions = (year, month) => {
    const key = `${year}-${month}`;
    const days = availableDays[key] || [];
    const existingDay = Number(selectedDate.split("-")[2]);
    const activeDay = days.includes(existingDay) ? existingDay : days[0];

    if (!days.length) {
      dateSelect.innerHTML = '<option value="">No dates available</option>';
      dateSelect.value = "";
      return;
    }

    dateSelect.innerHTML = days.map((day) => {
      const value = formatDateValue(year, month, day);
      const label = formatSelectLabel(year, month, day);
      const selected = day === activeDay ? " selected" : "";
      return `<option value="${value}"${selected}>${label}</option>`;
    }).join("");

    selectedDate = formatDateValue(year, month, activeDay);
    dateSelect.value = selectedDate;
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const key = `${year}-${month}`;
    const days = availableDays[key] || [];

    monthLabel.textContent = `${monthNames[month]} ${year}`;
    syncSelectOptions(year, month);
    calendarGrid.innerHTML = "";

    for (let index = 0; index < firstDay; index += 1) {
      const blank = document.createElement("span");
      blank.className = "appointment-calendar__empty";
      blank.setAttribute("aria-hidden", "true");
      calendarGrid.appendChild(blank);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const button = document.createElement("button");
      const value = formatDateValue(year, month, day);
      const isAvailable = days.includes(day);
      const isSelected = value === selectedDate;

      button.type = "button";
      button.textContent = String(day);
      button.className = "appointment-calendar__day";
      button.setAttribute("role", "gridcell");

      if (!isAvailable) {
        button.classList.add("is-disabled");
        button.disabled = true;
      }

      if (isSelected) {
        button.classList.add("is-selected");
        button.setAttribute("aria-current", "date");
      }

      button.addEventListener("click", () => {
        selectedDate = value;
        dateSelect.value = value;
        renderCalendar();
        renderSlotsForDate(selectedDate);
      });

      calendarGrid.appendChild(button);
    }
  };

  prevButton?.addEventListener("click", () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    renderCalendar();
  });

  nextButton?.addEventListener("click", () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    renderCalendar();
  });

  dateSelect?.addEventListener("change", () => {
    if (!dateSelect.value) {
      return;
    }

    selectedDate = dateSelect.value;
    const [year, month] = selectedDate.split("-");
    currentDate = new Date(Number(year), Number(month) - 1, 1);
    renderCalendar();
    renderSlotsForDate(selectedDate);
  });

  /* Render time slots for a specific date. Only admin-defined slots (in availableSlots)
     will be shown. If none exist, show a friendly message. */
  const renderSlotsForDate = (dateValue) => {
    if (!slotContainer) return;
    const slots = availableSlots[dateValue] || [];
    slotContainer.innerHTML = "";

    if (!slots.length) {
      if (noSlotsNote) noSlotsNote.style.display = "block";
      slotContainer.setAttribute("aria-hidden", "true");
      if (timeInput) timeInput.value = "";
      return;
    }

    if (noSlotsNote) noSlotsNote.style.display = "none";
    slotContainer.removeAttribute("aria-hidden");

    slots.forEach((slot) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "appointment-slot";
      btn.textContent = slot;
      btn.setAttribute("data-time-value", slot);
      btn.setAttribute("data-time-slot", "");
      btn.setAttribute("aria-pressed", "false");

      btn.addEventListener("click", () => {
        // clear previous
        const existing = Array.from(slotContainer.querySelectorAll(".appointment-slot"));
        existing.forEach((s) => {
          s.classList.remove("is-active");
          s.setAttribute("aria-pressed", "false");
        });

        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");

        if (timeInput) timeInput.value = slot;
      });

      slotContainer.appendChild(btn);
    });

    // auto-select first slot if none selected yet
    const first = slotContainer.querySelector(".appointment-slot");
    if (first) {
      first.classList.add("is-active");
      first.setAttribute("aria-pressed", "true");
      if (timeInput) timeInput.value = first.dataset.timeValue || first.textContent.trim();
    }
  };

  document.addEventListener("form:reset", () => {
    currentDate = new Date(2026, 4, 1);
    selectedDate = "2026-05-04";
    renderCalendar();
    renderSlotsForDate(selectedDate);
  });

  // Listen for availability updates from admin
  document.addEventListener("availabilityUpdated", () => {
    const { availableDays: updatedDays, availableSlots: updatedSlots } = buildAvailabilityFromAdmin();
    Object.assign(availableDays, updatedDays);
    Object.assign(availableSlots, updatedSlots);
    renderCalendar();
    renderSlotsForDate(selectedDate);
  });

  renderCalendar();
  renderSlotsForDate(selectedDate);
}
