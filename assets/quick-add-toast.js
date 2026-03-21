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

      this._bindEvents();
      this._initFormInterception();
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

    _initFormInterception() {
      // Use event delegation to capture all current and future quick-add forms
      document.addEventListener('submit', (e) => {
        const form = e.target;
        if (!form.matches('.form[data-type="add-to-cart-form"]')) return;
        e.preventDefault();
        const btn = form.querySelector('.btn-quick-add');
        if (btn) this._handleSubmit(form, btn);
      }, true); // capture phase so we get it before any other handlers
    }

    async _handleSubmit(form, btn) {
      if (btn.disabled || btn.dataset.loading === 'true') return;

      // Set loading state
      btn.dataset.loading = 'true';
      btn.setAttribute('aria-disabled', 'true');
      const spinner = btn.querySelector('.loading__spinner');
      const span = btn.querySelector('span');
      if (spinner) spinner.classList.remove('hidden');
      if (span) span.classList.add('hidden');

      try {
        const formData = new FormData(form);
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
          body: formData
        });

        const data = await response.json();

        if (!response.ok || data.status) {
          this._showError(data.description || 'Could not add item to cart.');
          return;
        }

        // Success — show toast with product info
        this._showToast(data);
        this._updateCartCount();

      } catch (err) {
        console.error('[QuickAddToast] Error:', err);
        this._showError('Something went wrong. Please try again.');
      } finally {
        // Reset button
        btn.dataset.loading = 'false';
        btn.removeAttribute('aria-disabled');
        if (spinner) spinner.classList.add('hidden');
        if (span) span.classList.remove('hidden');
      }
    }

    _showToast(product) {
      // Populate product info
      if (this.titleEl) this.titleEl.textContent = product.product_title;
      if (this.priceEl) this.priceEl.textContent = this._formatMoney(product.final_price);
      if (this.imageEl && product.image) {
        this.imageEl.src = product.image.replace(/\.(\w+)(\?|$)/, '_120x120.$1$2');
        this.imageEl.alt = product.product_title;
      }

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
      if (this.imageEl) this.imageEl.src = '';
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
        const res = await fetch('/cart.js');
        const cart = await res.json();
        const count = cart.item_count;
        // Update all cart count bubbles
        document.querySelectorAll('[data-cart-count], .cart-count-bubble span[aria-hidden]').forEach(el => {
          el.textContent = count;
        });
        const bubbles = document.querySelectorAll('.cart-count-bubble');
        bubbles.forEach(b => {
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
          minimumFractionDigits: 0
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
