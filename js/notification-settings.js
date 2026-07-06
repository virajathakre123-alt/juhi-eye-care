document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('save-notifications')?.addEventListener('click', ()=>{
    const data = {
      newAppointment: !!document.getElementById('notify-new-appointment')?.checked,
      cancel: !!document.getElementById('notify-cancel')?.checked,
      inquiry: !!document.getElementById('notify-inquiry')?.checked,
      email: !!document.getElementById('notify-email')?.checked
    };
    console.log('Save notification settings', data);
    const btn = document.getElementById('save-notifications');
    const msg = document.createElement('div'); msg.className='admin-help'; msg.textContent='Notification preferences saved (local demo).';
    btn.parentNode.insertBefore(msg, btn.nextSibling);
    setTimeout(()=>msg.remove(),3000);
  });
});
