export class HelpModal {
  constructor({ helpIconId = 'help-icon', modalOverlaySelector = '.modal-overlay' } = {}) {
    this.helpIcon = document.getElementById(helpIconId);
    this.modalOverlay = document.querySelector(modalOverlaySelector);

    if (!this.helpIcon || !this.modalOverlay) {
      console.warn('HelpModal: необходимые элементы не найдены в DOM');
      return;
    }

    this.closeButton = this.modalOverlay.querySelector('.close-button');
    this.helpModal = this.modalOverlay.querySelector('.help-modal');

    this.handleOpen = this.openModal.bind(this);
    this.handleKeyDownIcon = this.onIconKeyDown.bind(this);
    this.handleOverlayClick = this.closeModal.bind(this);
    this.handleModalClick = (e) => e.stopPropagation();
    this.handleCloseClick = this.closeModal.bind(this);
    this.handleWindowKeyDown = this.onWindowKeyDown.bind(this);
  }

  init() {
    if (!this.helpIcon || !this.modalOverlay) return;

    this.helpIcon.addEventListener('click', this.handleOpen);
    this.helpIcon.addEventListener('keydown', this.handleKeyDownIcon);

    this.modalOverlay.addEventListener('click', this.handleOverlayClick);
    this.helpModal.addEventListener('click', this.handleModalClick);
    this.closeButton.addEventListener('click', this.handleCloseClick);

    window.addEventListener('keydown', this.handleWindowKeyDown);
  }

  openModal() {
    this.modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    this.closeButton.focus();
  }

  closeModal() {
    this.modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    this.helpIcon.focus();
  }

  onIconKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.openModal();
    }
  }

  onWindowKeyDown(e) {
    if (e.key === 'Escape' && this.modalOverlay.style.display === 'flex') {
      this.closeModal();
    }
  }

  destroy() {
    if (!this.helpIcon || !this.modalOverlay) return;

    this.helpIcon.removeEventListener('click', this.handleOpen);
    this.helpIcon.removeEventListener('keydown', this.handleKeyDownIcon);

    this.modalOverlay.removeEventListener('click', this.handleOverlayClick);
    this.helpModal.removeEventListener('click', this.handleModalClick);
    this.closeButton.removeEventListener('click', this.handleCloseClick);

    window.removeEventListener('keydown', this.handleWindowKeyDown);
  }
}
