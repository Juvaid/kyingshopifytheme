/**
 * Sticky Add to Cart Component
 * Syncs with the main product form and provides a persistent ATC bar.
 */
if (!customElements.get('sticky-atc')) {
  customElements.define('sticky-atc', class StickyATC extends HTMLElement {
    constructor() {
      super();
      this.sectionId = this.dataset.section;
      this.alwaysVisible = this.dataset.alwaysVisible === 'true';
      this.mobileAlwaysVisible = this.dataset.mobileAlwaysVisible === 'true';
      this.isMobile = window.innerWidth < 750;
      
      this.elements = {
        button: this.querySelector('.sticky-atc__submit'),
        buttonText: this.querySelector('.sticky-atc__submit-text'),
        qtyInput: this.querySelector('.sticky-atc__qty-input'),
        price: this.querySelector('.sticky-atc__price'),
        image: this.querySelector('.sticky-atc__image'),
        mainSubmitButton: document.querySelector(`#ProductSubmitButton-${this.sectionId}`),
        mainQtyInput: document.querySelector(`#Quantity-${this.sectionId}`)
      };

      if (!this.elements.mainSubmitButton || !this.elements.button) {
        console.warn('StickyATC: Essential elements not found.', {
          mainSubmitButton: !!this.elements.mainSubmitButton,
          stickySubmitButton: !!this.elements.button
        });
        return;
      }

      this.init();
    }

    init() {
      this.bindEvents();
      this.setupObserver();
      this.subscribeToEvents();
      
      if (this.alwaysVisible || (this.isMobile && this.mobileAlwaysVisible)) {
        this.classList.add('is-active');
      }
    }

    setupObserver() {
      // If mobile and mobile-always-visible is on, or if global alwaysVisible is on, don't use observer
      const shouldAlwaysShow = (this.isMobile && this.mobileAlwaysVisible) || (!this.isMobile && this.alwaysVisible);
      if (shouldAlwaysShow) return;

      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0
      };

      // We observe the main submit button's container or a nearby element 
      // to trigger the sticky bar when the primary CTA is no longer visible.
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Show sticky bar if the main button is above the viewport
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            this.classList.add('is-active');
          } else {
            this.classList.remove('is-active');
          }
        });
      }, options);

      this.observer.observe(this.elements.mainSubmitButton);
    }

    bindEvents() {
      // Handle Sticky ATC click
      this.elements.button.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.elements.mainSubmitButton.disabled) return;

        // Visual feedback
        this.setLoading(true);
        
        // Trigger the main product form's submit button
        this.elements.mainSubmitButton.click();
        
        // The main product-form.js handles the actual AJAX addition.
        // We listen for the cart update to reset our loading state.
      });

      // Bi-directional Quantity Sync: Sticky -> Main
      if (this.elements.qtyInput && this.elements.mainQtyInput) {
        this.elements.qtyInput.addEventListener('change', () => {
          this.elements.mainQtyInput.value = this.elements.qtyInput.value;
          this.elements.mainQtyInput.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Bi-directional Quantity Sync: Main -> Sticky
        this.elements.mainQtyInput.addEventListener('change', () => {
          this.elements.qtyInput.value = this.elements.mainQtyInput.value;
        });
      }
    }

    subscribeToEvents() {
      // Sync on variant change
      if (window.PUB_SUB_EVENTS && window.subscribe) {
        window.subscribe(window.PUB_SUB_EVENTS.variantChange, (event) => {
          if (event.data.sectionId !== this.sectionId) return;
          this.onVariantChange(event.data.variant);
        });

        // Reset loading state on cart updates or errors
        window.subscribe(window.PUB_SUB_EVENTS.cartUpdate, () => this.setLoading(false));
        window.subscribe(window.PUB_SUB_EVENTS.cartError, () => this.setLoading(false));
      }

      // External update event support
      document.addEventListener('sticky-atc:update', () => this.setLoading(false));
    }

    onVariantChange(variant) {
      if (!variant) {
        this.updateButtonState('unavailable');
        return;
      }

      // Update Button
      if (variant.available) {
        this.updateButtonState('available');
      } else {
        this.updateButtonState('soldOut');
      }

      // Update Price via DOM copying for consistency with theme styling
      const mainPrice = document.querySelector(`#price-${this.sectionId}`);
      if (mainPrice && this.elements.price) {
        this.elements.price.innerHTML = mainPrice.innerHTML;
      }

      // Update Image
      if (variant.featured_image && this.elements.image) {
        this.elements.image.src = variant.featured_image.src;
      }
    }

    updateButtonState(state) {
      const strings = window.variantStrings || {};
      
      switch(state) {
        case 'available':
          this.elements.button.disabled = false;
          this.elements.buttonText.textContent = strings.addToCart || 'Add to Cart';
          break;
        case 'soldOut':
          this.elements.button.disabled = true;
          this.elements.buttonText.textContent = strings.soldOut || 'Sold Out';
          break;
        case 'unavailable':
          this.elements.button.disabled = true;
          this.elements.buttonText.textContent = strings.unavailable || 'Unavailable';
          break;
      }
    }

    setLoading(isLoading) {
      if (isLoading) {
        this.elements.button.classList.add('loading');
        this.querySelector('.loading__spinner')?.classList.remove('hidden');
        this.elements.buttonText.classList.add('hidden');
      } else {
        this.elements.button.classList.remove('loading');
        this.querySelector('.loading__spinner')?.classList.add('hidden');
        this.elements.buttonText.classList.remove('hidden');
      }
    }
  });
}

// Ensure sticky bar handles window resize for mobile detection
window.addEventListener('resize', () => {
  const stickyAtc = document.querySelector('sticky-atc');
  if (stickyAtc) {
    stickyAtc.isMobile = window.innerWidth < 750;
    // Re-check visibility if needed
    if (stickyAtc.isMobile && stickyAtc.mobileAlwaysVisible) {
      stickyAtc.classList.add('is-active');
    } else if (!stickyAtc.isMobile && !stickyAtc.alwaysVisible) {
      // Re-initialize observer or check current scroll if moving from mobile to desktop
      stickyAtc.classList.remove('is-active');
    }
  }
});
