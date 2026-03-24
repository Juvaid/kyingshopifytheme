if (!customElements.get('before-after-slider')) {
  customElements.define('before-after-slider', class BeforeAfterSlider extends HTMLElement {
    constructor() {
      super();
      this.container = this.querySelector('.ba-image-container');
      this.afterImage = this.querySelector('.ba-image-after');
      this.handle = this.querySelector('.ba-handle');
      this.initialPosition = this.dataset.initialPosition || 50;
      this.isResizing = false;

      this.init();
    }

    init() {
      // Set initial position
      this.updatePosition(this.initialPosition);

      // Events
      this.handle.addEventListener('mousedown', (e) => {
         e.stopPropagation();
         this.isResizing = true;
      });
      this.handle.addEventListener('touchstart', (e) => {
         this.isResizing = true;
      }, { passive: true });
      
      window.addEventListener('mouseup', () => this.isResizing = false);
      window.addEventListener('touchend', () => this.isResizing = false);
      
      window.addEventListener('mousemove', (e) => this.onMove(e));
      window.addEventListener('touchmove', (e) => this.onMove(e), { passive: false });
    }

    onMove(e) {
      if (!this.isResizing) return;
      if (e.type === 'touchmove') e.preventDefault();

      const x = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;
      const rect = this.container.getBoundingClientRect();
      const offsetX = x - rect.left - window.scrollX;
      let percentage = (offsetX / rect.width) * 100;

      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      this.updatePosition(percentage);
    }

    updatePosition(percentage) {
      if (this.afterImage) this.afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      if (this.handle) this.handle.style.left = `${percentage}%`;
    }
  });
}
