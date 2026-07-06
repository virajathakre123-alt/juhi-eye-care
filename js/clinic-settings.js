document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('clinic-form');
  const save = document.getElementById('save-clinic');
  save?.addEventListener('click', ()=>{
    const data = {
      name: document.getElementById('clinic-name')?.value,
      address: document.getElementById('clinic-address')?.value,
      phone: document.getElementById('clinic-phone')?.value,
      whatsapp: document.getElementById('clinic-whatsapp')?.value,
      email: document.getElementById('clinic-email')?.value,
      start: document.getElementById('clinic-start')?.value,
      end: document.getElementById('clinic-end')?.value,
      days: Array.from(document.querySelectorAll('[data-day]:checked')).map(i=>i.value)
    };
    console.log('Save clinic settings', data);
    const msg = document.createElement('div'); msg.className='admin-help'; msg.textContent='Clinic information saved (local demo).';
    save.parentNode.insertBefore(msg, save.nextSibling);
    setTimeout(()=>msg.remove(),3000);
  });
});
