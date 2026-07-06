// Availability Management System
(() => {
  // Get all necessary DOM elements
  const calendarDays = document.querySelectorAll('[data-calendar-day]');
  const slots = document.querySelectorAll('[data-slot]');
  const selectedDateDisplay = document.querySelector('[data-selected-date]');
  const resetButton = document.querySelector('button:has-text("Reset day")');
  const saveButton = document.querySelector('button:has-text("Save changes")');
  const topbarButtons = document.querySelectorAll('.admin-topbar__actions button');
  
  // Get the actual reset and save buttons by index (since :has-text isn't supported)
  let resetBtn = null;
  let saveBtn = null;
  topbarButtons.forEach(btn => {
    if (btn.textContent.trim() === 'Reset day') resetBtn = btn;
    if (btn.textContent.trim() === 'Save changes') saveBtn = btn;
  });

  // Storage key for availability data
  const AVAILABILITY_STORAGE_KEY = 'doctorAvailability';
  
  // Default time slots available
  const allSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM'
  ];

  // Get stored availability data or initialize empty object
  const getStoredAvailability = () => {
    const stored = localStorage.getItem(AVAILABILITY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  // Save availability data to localStorage
  const saveAvailability = (data) => {
    localStorage.setItem(AVAILABILITY_STORAGE_KEY, JSON.stringify(data));
  };

  // Get the current selected date in a normalized format (YYYY-MM-DD)
  const getSelectedDateKey = () => {
    if (!selectedDateDisplay) return null;
    const dateText = selectedDateDisplay.textContent.trim();
    // Convert "04 May" format to a comparable key
    const [day, month] = dateText.split(' ');
    const monthMap = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const monthNum = monthMap[month] || '01';
    // Assume current year (2026)
    return `2026-${monthNum}-${day}`;
  };

  // Load availability for the selected date
  const loadAvailabilityForDate = () => {
    const dateKey = getSelectedDateKey();
    if (!dateKey) return;

    const availability = getStoredAvailability();
    const dateAvailability = availability[dateKey] || [];

    // Clear all selections first
    slots.forEach(slot => {
      slot.classList.remove('is-selected');
    });

    // Re-highlight the stored slots
    slots.forEach(slot => {
      const slotTime = slot.textContent.trim();
      if (dateAvailability.includes(slotTime)) {
        slot.classList.add('is-selected');
      }
    });
  };

  // Handle calendar day selection
  calendarDays.forEach(day => {
    day.addEventListener('click', () => {
      loadAvailabilityForDate();
    });
  });

  // Handle slot toggle
  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      slot.classList.toggle('is-selected');
    });
  });

  // Handle Reset Day button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Clear all slot selections for the current day
      slots.forEach(slot => {
        slot.classList.remove('is-selected');
      });
    });
  }

  // Handle Save Changes button
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const dateKey = getSelectedDateKey();
      if (!dateKey) {
        alert('Please select a date first');
        return;
      }

      // Get all currently selected slots
      const selectedSlots = Array.from(slots)
        .filter(slot => slot.classList.contains('is-selected'))
        .map(slot => slot.textContent.trim());

      // Update storage
      const availability = getStoredAvailability();
      if (selectedSlots.length > 0) {
        availability[dateKey] = selectedSlots;
      } else {
        // Remove the date entry if no slots are selected
        delete availability[dateKey];
      }
      
      saveAvailability(availability);

      // Show success message
      showNotification('Availability saved successfully!');
      
      // Dispatch custom event so appointment.js can update if needed
      const event = new CustomEvent('availabilityUpdated', {
        detail: { dateKey, slots: selectedSlots }
      });
      document.dispatchEvent(event);
    });
  }

  // Show temporary notification
  const showNotification = (message) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1f8f5a;
      color: white;
      padding: 16px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      font-weight: 600;
      font-size: 0.95rem;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      notification.addEventListener('animationend', () => notification.remove());
      
      // Add fade out animation
      const style = document.createElement('style');
      if (!document.querySelector('style[data-notification-animation]')) {
        style.setAttribute('data-notification-animation', '');
        style.textContent = `
          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
          }
        `;
        document.head.appendChild(style);
      }
    }, 3000);
  };

  // Load availability on page load
  loadAvailabilityForDate();
})();
