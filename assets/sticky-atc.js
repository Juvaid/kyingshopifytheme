if (!customElements.get('sticky-atc')) {
  customElements.define('sticky-atc', class StickyATC extends HTMLElement {
    constructor() {
      super();
      this.button = this.querySelector('.sticky-atc__submit');
      this.sectionId = this.dataset.section;
      this.mainSubmitButton = document.querySelector(`#ProductSubmitButton-${this.sectionId}`);
      
      if (!this.mainSubmitButton || !this.button) return;

      this.setupObserver();
      this.bindEvents();
      this.subscribeToVariants();
    }

    setupObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            this.classList.add('is-active');
          } else {
            this.classList.remove('is-active');
          }
        });
      }, options);

      this.observer.observe(this.mainSubmitButton);
    }

    bindEvents() {
      this.button.addEventListener('click', () => {
        // Find the main form and click its submit button
        if (!this.mainSubmitButton.disabled) {
          this.mainSubmitButton.click();
        }
      });
    }

    subscribeToVariants() {
      // Sync state if variant changes
      if (window.PUB_SUB_EVENTS) {
        window.subscribe(window.PUB_SUB_EVENTS.variantChange, (event) => {
          if (event.data.sectionId !== this.sectionId) return;
          
          if (!event.data.variant) {
            this.button.disabled = true;
            this.button.querySelector('span').textContent = window.variantStrings.unavailable;
            return;
          }

          if (event.data.variant.available) {
            this.button.disabled = false;
            this.button.querySelector('span').textContent = window.variantStrings.addToCart;
          } else {
            this.button.disabled = true;
            this.button.querySelector('span').textContent = window.variantStrings.soldOut;
          }
        });
      }
    }
  });
}
