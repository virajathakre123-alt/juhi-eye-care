document.addEventListener('DOMContentLoaded', () => {
  const requestsList = document.getElementById('requests-list');
  const emptyState = document.getElementById('requests-empty');

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function normalizePhone(phone) {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return '91' + digits;
    }
    if (digits.length === 11 && digits.startsWith('0')) {
      return '91' + digits.slice(1);
    }
    return digits;
  }

  function buildWhatsAppUrl(request) {
    if (!request.phone) return '';
    const normalized = normalizePhone(request.phone);
    if (!normalized) return '';

    const message = `Hello ${request.patient_name}, your appointment at Juhi Eye Care is confirmed for ${formatDate(request.requested_date)} at ${request.requested_time}. Please arrive 10 minutes early.`;
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  }

  function renderRequest(request) {
    const card = document.createElement('article');
    card.className = 'card request';
    card.dataset.requestId = request.id;

    card.innerHTML = `
      <span class="status">Pending</span>
      <h2>Request: ${request.treatment || 'Appointment'}</h2>
      <p><strong>From:</strong> ${request.patient_name} — <em>${request.phone || 'No phone'}</em></p>
      <p><strong>Date:</strong> ${formatDate(request.requested_date)} | <strong>Time:</strong> ${request.requested_time}</p>
      <p>${request.message || ''}</p>
      <div class="admin-actions" style="margin-top:10px;"></div>
    `;

    const actions = card.querySelector('.admin-actions');
    const approveButton = document.createElement('button');
    approveButton.type = 'button';
    approveButton.className = 'admin-mini-button admin-mini-button--primary';
    approveButton.textContent = 'Approve';
    approveButton.addEventListener('click', () => handleStatusChange(request.id, 'approve', card));

    const rejectButton = document.createElement('button');
    rejectButton.type = 'button';
    rejectButton.className = 'admin-mini-button admin-mini-button--danger';
    rejectButton.textContent = 'Reject';
    rejectButton.addEventListener('click', () => handleStatusChange(request.id, 'reject', card));

    actions.appendChild(approveButton);
    actions.appendChild(rejectButton);
    return card;
  }

  function updateEmptyState() {
    const cards = requestsList.querySelectorAll('.card.request');
    emptyState.style.display = cards.length === 0 ? '' : 'none';
  }

  function handleStatusChange(requestId, action, card) {
    const url = `/api/appointment-requests/${requestId}/${action}/`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          console.error(data.error || 'Failed to update request status');
          return;
        }

        const statusTag = card.querySelector('.status');
        statusTag.textContent = action === 'approve' ? 'Approved' : 'Rejected';
        statusTag.classList.add(action === 'approve' ? 'admin-badge--confirmed' : 'admin-badge--cancelled');

        if (action === 'approve') {
          addWhatsAppButton(card, requestId);
        } else {
          card.querySelector('.admin-actions').remove();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function addWhatsAppButton(card, requestId) {
    const phone = card.querySelector('p em')?.textContent || '';
    const patientName = card.querySelector('p strong')?.nextSibling?.textContent?.trim() || '';
    const dateText = card.querySelectorAll('p')[1]?.textContent || '';
    const [datePart, timePart] = dateText.replace('Date:', '').replace('Time:', '').split('|').map((item) => item.trim());
    const treatmentHeading = card.querySelector('h2')?.textContent.replace('Request: ', '').trim();
    const message = `Hello ${patientName}, your appointment at Juhi Eye Care is confirmed for ${datePart} at ${timePart}. Please arrive 10 minutes early.`;
    const normalized = normalizePhone(phone);
    if (!normalized) return;

    const whatsappLink = document.createElement('a');
    whatsappLink.href = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.className = 'admin-mini-button admin-mini-button--secondary';
    whatsappLink.textContent = 'Message on WhatsApp';
    card.querySelector('.admin-actions').appendChild(whatsappLink);
  }

  function loadPendingRequests() {
    fetch('/api/appointment-requests/pending/')
      .then((response) => response.json())
      .then((data) => {
        requestsList.querySelectorAll('.card.request').forEach((existing) => existing.remove());
        if (data.success && Array.isArray(data.requests) && data.requests.length > 0) {
          data.requests.forEach((request) => {
            requestsList.appendChild(renderRequest(request));
          });
        }
        updateEmptyState();
      })
      .catch((error) => {
        console.error('Unable to load pending requests', error);
      });
  }

  loadPendingRequests();
});
