// appointments.js — simple client-side filtering and drawer interactions
document.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('appointments-table');
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const search = document.getElementById('search-box');
  const dateInput = document.getElementById('filter-date');
  const emptyState = document.getElementById('empty-state');

  function matchesFilter(row) {
    const name = row.dataset.name.toLowerCase();
    const phone = row.dataset.phone.toLowerCase();
    const q = (search.value || '').trim().toLowerCase();
    const date = dateInput.value;
    if (date && row.dataset.date !== date) return false;
    if (!q) return true;
    return name.includes(q) || phone.includes(q) || row.dataset.email.toLowerCase().includes(q);
  }

  function applyFilters() {
    let visible = 0;
    rows.forEach(r => {
      // only show confirmed/completed (exclude pending)
      const statusText = r.querySelector('.admin-badge')?.textContent?.trim().toLowerCase() || '';
      if (statusText === 'pending') { r.style.display = 'none'; return; }
      if (matchesFilter(r)) { r.style.display = ''; visible++; } else { r.style.display = 'none'; }
    });
    emptyState.style.display = visible === 0 ? '' : 'none';
  }

  search.addEventListener('input', applyFilters);
  dateInput.addEventListener('change', applyFilters);
  applyFilters();

  // Drawer interactions
  const drawer = document.getElementById('appt-drawer');
  const drawerName = document.getElementById('drawer-name');
  const drawerPhone = document.getElementById('drawer-phone');
  const drawerEmail = document.getElementById('drawer-email');
  const drawerTreatment = document.getElementById('drawer-treatment');
  const drawerDatetime = document.getElementById('drawer-datetime');
  const drawerMessage = document.getElementById('drawer-message');
  const drawerNotes = document.getElementById('drawer-notes');
  let activeRow = null;

  function openDrawer(row) {
    activeRow = row;
    drawerName.textContent = row.dataset.name;
    drawerPhone.textContent = row.dataset.phone;
    drawerEmail.textContent = row.dataset.email;
    drawerTreatment.textContent = row.dataset.treatment;
    drawerDatetime.textContent = row.dataset.date + ' • ' + row.dataset.time;
    drawerMessage.textContent = row.dataset.message;
    drawerNotes.value = '';
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    // add slight pulse animation to active row
    row.classList.add('active-row');
    setTimeout(()=> row.classList.remove('active-row'), 260);
  }

  function closeDrawer() {
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    activeRow = null;
  }

  document.addEventListener('click', function (e) {
    if (e.target.matches('[data-view]')) {
      const row = e.target.closest('tr');
      openDrawer(row);
    }
    if (e.target.matches('.drawer-close')) closeDrawer();
    if (e.target.matches('#mark-complete')) {
      if (!activeRow) return;
      const badge = activeRow.querySelector('.admin-badge');
      badge.textContent = 'Completed';
      badge.className = 'admin-badge admin-badge--completed';
      closeDrawer();
    }
    if (e.target.matches('#cancel-appointment')) {
      if (!activeRow) return;
      const badge = activeRow.querySelector('.admin-badge');
      badge.textContent = 'Cancelled';
      badge.className = 'admin-badge admin-badge--cancelled';
      closeDrawer();
    }
  });

  // overlay click closes drawer
  const overlay = document.getElementById('drawer-overlay');
  overlay.addEventListener('click', closeDrawer);

  // close drawer on escape
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
});
