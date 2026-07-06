document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('save-appointment')?.addEventListener('click', ()=>{
    const data = {
      slotDuration: document.getElementById('slot-duration')?.value,
      maxPerDay: document.getElementById('max-per-day')?.value,
      cancelWindow: document.getElementById('cancel-window')?.value,
      requireApproval: !!document.getElementById('require-approval')?.checked,
      allowSameDay: !!document.getElementById('allow-same-day')?.checked
    };
    console.log('Save appointment settings', data);
    const btn = document.getElementById('save-appointment');
    const msg = document.createElement('div'); msg.className='admin-help'; msg.textContent='Appointment settings saved (local demo).';
    btn.parentNode.insertBefore(msg, btn.nextSibling);
    setTimeout(()=>msg.remove(),3000);
  });
});
