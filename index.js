// ============================================================
// PRESENTE / VALE-PRESENTE
// ============================================================

function initGift() {
  const giftBox = document.querySelector('#gift-box');
  const giftModal = document.querySelector('#gift-modal');
  const giftClose = document.querySelector('#gift-close');

  if (!giftBox || !giftModal || !giftClose) return;

  giftBox.addEventListener('click', () => {
    giftBox.classList.add('opened');

    setTimeout(() => {
      giftModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 350);
  });

  function closeGiftModal() {
    giftModal.classList.remove('open');
    document.body.style.overflow = '';

    setTimeout(() => {
      giftBox.classList.remove('opened');
    }, 400);
  }

  giftClose.addEventListener('click', closeGiftModal);

  giftModal.addEventListener('click', (e) => {
    if (e.target === giftModal) {
      closeGiftModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (giftModal.classList.contains('open') && e.key === 'Escape') {
      closeGiftModal();
    }
  });
}
