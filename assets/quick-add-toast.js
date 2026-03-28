/**
 * Quick Add Toast - AJAX Add to Cart Handler
 * Intercepts .btn-quick-add form submissions, adds item to cart
 * via the Shopify AJAX API, and shows a toast notification.
 */

(function () {
  'use strict';

  class QuickAddToast {
    constructor() {
      this.toast = document.getElementById('quick-add-toast');
      if (!this.toast) return;

      this.settings = window.QuickAddToastSettings || { duration: 5000 };
      this.dismissTimer = null;
      this.progressBar = document.getElementById('quick-add-toast-progress');
      this.titleEl = document.getElementById('quick-add-toast-title');
      this.priceEl = document.getElementById('quick-add-toast-price');
      this.imageEl = document.getElementById('quick-add-toast-image');
      this.labelEl = this.toast.querySelector('.quick-add-toast__label');
      this.imageWrapEl = this.toast.querySelector('.quick-add-toast__image-wrap');
      this.actionsEl = this.toast.querySelector('.quick-add-toast__actions');

      this._bindEvents();
      this._initSubscriber();
    }

    _bindEvents() {
      // Close button
      document.getElementById('quick-add-toast-close')?.addEventListener('click', () => this.hide());
      // Continue Shopping button
      document.getElementById('quick-add-toast-continue')?.addEventListener('click', () => this.hide());
      // Hide on outside click
      document.addEventListener('click', (e) => {
        if (this.toast && !this.toast.contains(e.target)) {
          this.hide();
        }
      });
    }

    _initSubscriber() {
      if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
        subscribe(PUB_SUB_EVENTS.cartUpdate, this.onCartUpdate.bind(this));
      }
    }

    onCartUpdate(event) {
      if (event.source !== 'product-form' || !event.isQuickAdd || !event.cartData || event.cartData.status) return;

      // Skip toast if cart drawer is active
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer && cartDrawer.classList.contains('active')) return;

      this._showToast(event.cartData);
      this._updateCartCount();
    }

    _showToast(product) {
      // Populate product info
      let displayTitle = product.product_title;
      if (this.settings.truncateEnabled && displayTitle.length > this.settings.truncateLimit) {
        displayTitle =
          displayTitle.substring(0, this.settings.cart_product_name_limit || this.settings.truncateLimit) + '...';
      }
      if (this.titleEl) this.titleEl.textContent = displayTitle;
      if (this.priceEl) this.priceEl.textContent = this._formatMoney(product.final_price);
      if (this.imageEl && product.image) {
        this.imageEl.src = product.image.replace(/\.(\w+)(\?|$)/, '_120x120.$1$2');
        this.imageEl.alt = product.product_title;
        if (this.imageWrapEl) this.imageWrapEl.style.display = '';
      } else {
        if (this.imageWrapEl) this.imageWrapEl.style.display = 'none';
      }

      if (this.labelEl) this.labelEl.style.display = '';
      if (this.actionsEl) this.actionsEl.style.display = '';

      this.toast.removeAttribute('hidden');
      // Force reflow then animate in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.toast.classList.add('is-visible');
          // Start progress bar
          if (this.progressBar) {
            this.progressBar.classList.remove('is-running');
            void this.progressBar.offsetWidth; // force reflow
            this.progressBar.classList.add('is-running');
          }
        });
      });

      // Auto-dismiss
      clearTimeout(this.dismissTimer);
      this.dismissTimer = setTimeout(() => this.hide(), this.settings.duration || 5000);
    }

    hide() {
      if (!this.toast) return;
      this.toast.classList.remove('is-visible');
      clearTimeout(this.dismissTimer);
      // Hide after animation
      setTimeout(() => {
        this.toast.setAttribute('hidden', '');
        if (this.progressBar) {
          this.progressBar.classList.remove('is-running');
        }
      }, 420);
    }

    _showError(message) {
      // Show a brief error toast
      if (this.titleEl) this.titleEl.textContent = message;
      if (this.priceEl) this.priceEl.textContent = '';
      if (this.imageWrapEl) this.imageWrapEl.style.display = 'none';
      if (this.labelEl) this.labelEl.style.display = 'none';
      if (this.actionsEl) this.actionsEl.style.display = 'none';
      this.toast.removeAttribute('hidden');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.toast.classList.add('is-visible');
        });
      });
      clearTimeout(this.dismissTimer);
      this.dismissTimer = setTimeout(() => this.hide(), 3000);
    }

    async _updateCartCount() {
      try {
        const cartUrl = window.routes ? window.routes.cart_url : '/cart';
        const res = await fetch(`${cartUrl}?sections=cart-icon-bubble`);
        const parsedState = await res.json();
        const html = parsedState['cart-icon-bubble'];

        if (html) {
          const targetIcon = document.getElementById('cart-icon-bubble');
          if (targetIcon) {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const sourceIcon = doc.querySelector('#cart-icon-bubble') || doc.querySelector('.shopify-section');
            if (sourceIcon) {
              targetIcon.innerHTML = sourceIcon.innerHTML;
            }
          }
        }

        // Also update any other standalone cart counts on the page
        const cartJsonRes = await fetch(`${cartUrl}.js`);
        const cart = await cartJsonRes.json();
        const count = cart.item_count;

        document.querySelectorAll('[data-cart-count], .cart-count-bubble span[aria-hidden]').forEach((el) => {
          el.textContent = count;
        });

        const bubbles = document.querySelectorAll('.cart-count-bubble');
        bubbles.forEach((b) => {
          if (count === 0) {
            b.style.display = 'none';
          } else {
            b.style.display = '';
          }
        });
      } catch (e) {
        // silently fail — cart count update is non-critical
      }
    }

    _formatMoney(cents) {
      const amount = (cents / 100).toFixed(2);
      // Use Shopify's currency code if available
      const currencyCode = window.Shopify?.currency?.active || 'INR';
      try {
        return new Intl.NumberFormat(document.documentElement.lang || 'en-IN', {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: 0,
        }).format(cents / 100);
      } catch {
        return `${currencyCode} ${amount}`;
      }
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new QuickAddToast());
  } else {
    new QuickAddToast();
  }
})();
