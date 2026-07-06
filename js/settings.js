document.addEventListener('click', function (e) {
  if (e.target && e.target.closest('[data-logout]')) {
    // Clear any client-side session markers and redirect to login
    try { localStorage.removeItem('adminLoggedIn'); } catch (err) {}
    window.location.href = 'login.html';
  }
});

// Make settings list clickable when button is used (support keyboard)
document.addEventListener('DOMContentLoaded', function (){
  document.querySelectorAll('.settings-item').forEach(item => {
    item.addEventListener('keydown', (ev)=>{ if(ev.key === 'Enter') item.click(); });
  });
});
