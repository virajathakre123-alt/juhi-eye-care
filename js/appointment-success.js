const successCard = document.querySelector("[data-success-card]");
const receiptButton = document.querySelector("[data-download-receipt]");
const receiptStatus = document.querySelector("[data-receipt-status]");

if (successCard) {
  window.requestAnimationFrame(() => {
    successCard.classList.add("is-visible");
  });
}

receiptButton?.addEventListener("click", () => {
  if (receiptStatus) {
    receiptStatus.textContent = "Appointment receipt download will be available once connected to your booking system.";
  }
});
