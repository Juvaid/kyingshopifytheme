if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        if (!this.form) return;
        this.variantIdInput.disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        if (!this.submitButton) return;
        this.submitButtonText = this.submitButton.querySelector('span');

        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        if (!this.cart) return; // Fallback to native form submission if no JS cart component

        const submitter = evt.submitter || document.activeElement;
        // If the submitter is NOT our 'add' button (e.g. it's the 'Buy It Now' button), let the form submit normally
        if (submitter && submitter.getAttribute('name') !== 'add') return;

        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        const loadingElement = this.querySelector('.loading-dots') || this.querySelector('.loading__spinner');
        if (loadingElement) loadingElement.classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        const isQuickAdd = this.closest('.product-card') || this.classList.contains('quick-add-form');

        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
              .join(',')
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        const startTime = Date.now();
        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(0, 600 - elapsedTime);

            setTimeout(() => {
              this.handleResponse(response, formData, isQuickAdd);
            }, delay);
          })
          .catch((e) => {
            console.error(e);
            this.submitButton.classList.remove('loading');
            this.submitButton.removeAttribute('aria-disabled');
            const loadingElement = this.querySelector('.loading-dots') || this.querySelector('.loading__spinner');
            if (loadingElement) loadingElement.classList.add('hidden');
          });
      }

      handleResponse(response, formData, isQuickAdd) {
        if (response.status) {
          publish(PUB_SUB_EVENTS.cartError, {
            source: 'product-form',
            productVariantId: formData.get('id'),
            errors: response.errors || response.description,
            message: response.message,
          });
          this.handleErrorMessage(response.description);

          const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
          if (!soldOutMessage) {
            this.submitButton.classList.remove('loading');
            this.submitButton.removeAttribute('aria-disabled');
            const loadingElement = this.querySelector('.loading-dots') || this.querySelector('.loading__spinner');
            if (loadingElement) loadingElement.classList.add('hidden');
            return;
          }
          this.submitButton.setAttribute('aria-disabled', true);
          this.submitButtonText.classList.add('hidden');
          soldOutMessage.classList.remove('hidden');
          this.error = true;
        } else if (!this.cart) {
          window.location = window.routes.cart_url;
          return;
        } else {
          this.error = false;
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener(
              'modalClosed',
              () => {
                setTimeout(() => {
                  this.cart.renderContents(response, !isQuickAdd);
                });
              },
              { once: true },
            );
            quickAddModal.hide(true);
          } else {
            this.cart.renderContents(response, !isQuickAdd);
          }

          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: 'product-form',
            productVariantId: formData.get('id'),
            cartData: response,
            isQuickAdd: isQuickAdd
          });
        }

        // Cleanup
        this.submitButton.classList.remove('loading');
        if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
        if (!this.error) this.submitButton.removeAttribute('aria-disabled');
        const loadingElement = this.querySelector('.loading-dots') || this.querySelector('.loading__spinner');
        if (loadingElement) loadingElement.classList.add('hidden');
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

      toggleSubmitButton(disable = true, text) {
        if (disable) {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (text) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute('disabled');
          this.submitButtonText.textContent = window.variantStrings.addToCart;
        }
      }

      get variantIdInput() {
        return this.form.querySelector('[name=id]');
      }
    },
  );
}
