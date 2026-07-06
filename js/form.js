const appointmentApiBase = window.JUHI_API_BASE_URL || (window.location.protocol === 'file:' ? 'http://127.0.0.1:8000' : '');
const appointmentApiEndpoint = `${appointmentApiBase}/api/appointment-requests/`;

document.querySelectorAll('[data-form]').forEach((form) => {
  const status = form.querySelector('[data-form-status]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status) {
      status.textContent = '';
    }

    if (!form.classList.contains('appointment-form')) {
      if (status) {
        status.textContent = 'Thank you. Your message has been received and the clinic team will review it.';
      }
      form.reset();
      return;
    }

    const invalidField = Array.from(form.elements).find((field) => {
      return typeof field.checkValidity === 'function' && !field.checkValidity();
    });

    if (invalidField) {
      invalidField.reportValidity();
      return;
    }

    const fullName = form.querySelector('[name="full_name"]')?.value.trim() || '';
    const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
    const treatment = form.querySelector('[name="treatment"]')?.value.trim() || '';
    const appointmentDate = form.querySelector('[name="appointment_date"]')?.value || '';
    const appointmentTime = form.querySelector('[name="appointment_time"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value.trim() || '';
    const message = form.querySelector('[name="message"]')?.value.trim() || '';

    const payload = {
      full_name: fullName,
      phone,
      email,
      treatment,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      message,
    };

    try {
      const response = await fetch(appointmentApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        data = {};
      }

      if (!response.ok || !data.success) {
        if (status) {
          status.textContent = data.error || `Unable to submit appointment request right now. Please try again later.`;
        }
        console.error('Appointment submission failed:', data);
        return;
      }

      if (form.classList.contains('appointment-form')) {
        window.location.href = 'appointment-success.html';
        return;
      }

      if (status) {
        status.textContent = 'Your appointment request has been submitted and is pending approval. You will receive an email once it is confirmed.';
      }
      form.reset();
      form.querySelectorAll('[data-time-slot]').forEach((slot, index) => {
        const isActive = index === 0;
        slot.classList.toggle('is-active', isActive);
        slot.setAttribute('aria-pressed', String(isActive));
      });
      const timeInput = form.querySelector('[data-time-input]');
      if (timeInput) {
        timeInput.value = '9:00 AM';
      }
      document.dispatchEvent(new CustomEvent('form:reset'));
    } catch (error) {
      console.error('Appointment submission error:', error);
      if (status) {
        status.textContent = appointmentApiBase
          ? `Unable to connect to the booking service at ${appointmentApiBase}. Please make sure the Django server is running.`
          : 'Unable to submit appointment request at this time. Please try again later.';
      }
    }
  });
});
