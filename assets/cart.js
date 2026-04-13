class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
      if (cartItems) {
        cartItems.updateQuantity(this.dataset.index, 0, event);
      }
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement =
      document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, ON_CHANGE_DEBOUNCE_TIMER);

    this.addEventListener('change', debouncedOnChange.bind(this));
  }

  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (event.source === 'cart-items') {
        return;
      }
      // product-form.js already updates the cart-drawer directly via renderContents().
      // Skipping this redundant fetch prevents race conditions that blank out the drawer items.
      if (event.source === 'product-form' && this.tagName === 'CART-DRAWER-ITEMS') {
        return;
      }
      return this.onCartUpdate();
    });
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }

  resetQuantityInput(id) {
    const input = this.querySelector(`#Quantity-${id}`);
    if (input) {
      input.value = input.getAttribute('value');
    }
    this.isEnterPressed = false;
  }

  setValidity(event, index, message) {
    event.target.setCustomValidity(message);
    event.target.reportValidity();
    this.resetQuantityInput(index);
    event.target.select();
  }

  validateQuantity(event) {
    const inputValue = parseInt(event.target.value);
    const index = event.target.dataset.index;
    let message = '';

    if (inputValue < event.target.dataset.min && inputValue !== 0) {
      message = window.quickOrderListStrings.min_error.replace('[min]', event.target.dataset.min);
    } else if (inputValue > parseInt(event.target.max)) {
      message = window.quickOrderListStrings.max_error.replace('[max]', event.target.max);
    } else if (inputValue % parseInt(event.target.step) !== 0) {
      message = window.quickOrderListStrings.step_error.replace('[step]', event.target.step);
    }

    if (message) {
      this.setValidity(event, index, message);
    } else {
      event.target.setCustomValidity('');
      event.target.reportValidity();
      this.updateQuantity(
        index,
        inputValue,
        event,
        document.activeElement.getAttribute('name'),
        event.target.dataset.quantityVariantId,
      );
    }
  }

  onChange(event) {
    this.validateQuantity(event);
  }

  onCartUpdate() {
    // Only fetch if an EXTERNAL update happened (like Quick Add)
    const isDrawer = this.tagName === 'CART-DRAWER-ITEMS';
    const sectionId = isDrawer ? 'cart-drawer' : 'main-cart-items';
    const targetSelector = isDrawer ? '#CartDrawer-CartItems' : 'cart-items';

    const sections = ['cart-icon-bubble', sectionId];
    return fetch(`${routes.cart_url}?sections=${sections.join(',')}&update=${Date.now()}`)
      .then((response) => response.json())
      .then((parsedState) => {
        const sourceHtml = parsedState[sectionId];
        const parser = new DOMParser();
        const doc = parser.parseFromString(sourceHtml, 'text/html');

        // Update items
        const sourceItems = doc.querySelector(targetSelector);
        const targetItems = document.querySelector(targetSelector);
        if (targetItems && sourceItems) {
            targetItems.innerHTML = sourceItems.innerHTML;
        }

        // Update footer/totals
        if (isDrawer) {
            const sourceFooter = doc.querySelector('#CartDrawer-Footer');
            const targetFooter = document.querySelector('#CartDrawer-Footer');
            if (targetFooter && sourceFooter) {
                targetFooter.innerHTML = sourceFooter.innerHTML;
                targetFooter.classList.toggle('hidden', sourceFooter.classList.contains('hidden'));
            }

            // Sync upsell & empty-featured sections
            const updatableSections = ['#CartDrawer-Upsell', '#CartDrawer-Empty-Featured'];
            updatableSections.forEach(selector => {
              const source = doc.querySelector(selector);
              const target = document.querySelector(selector);
              if (target && source) {
                target.innerHTML = source.innerHTML;
                target.classList.remove('hidden');
              }
            });
            
            const cartDrawer = document.querySelector('cart-drawer');
            const itemCount = sourceItems ? parseInt(sourceItems.dataset.itemCount || '0') : 0;
            if (cartDrawer) {
              cartDrawer.classList.toggle('is-empty', itemCount === 0);
            }
        }

        // Update cart icon bubble
        const iconHtml = parsedState['cart-icon-bubble'];
        const targetIcon = document.getElementById('cart-icon-bubble');
        if (targetIcon) {
            targetIcon.innerHTML = this.getSectionInnerHTML(iconHtml, '#cart-icon-bubble');
        }
      })
      .catch((e) => console.error(e));
  }

  getSectionsToRender() {
    const sections = [];

    const mainCartItems = document.getElementById('main-cart-items');
    if (mainCartItems) {
      sections.push({
        id: 'main-cart-items',
        section: mainCartItems.dataset.id,
        selector: '.js-contents',
      });
    }

    const mainCartFooter = document.getElementById('main-cart-footer');
    if (mainCartFooter) {
      sections.push({
        id: 'main-cart-footer',
        section: mainCartFooter.dataset.id || 'main-cart-footer',
        selector: '.js-contents',
      });
    }

    const cartDrawer = document.getElementById('CartDrawer');
    if (cartDrawer) {
        // Targeted sections for drawer to avoid wiping upsells
        sections.push({
            id: 'CartDrawer-CartItems',
            section: 'cart-drawer',
            selector: '#CartDrawer-CartItems',
        });
        sections.push({
            id: 'CartDrawer-Footer',
            section: 'cart-drawer',
            selector: '#CartDrawer-Footer',
        });
        sections.push({
            id: 'CartDrawer-Empty-Featured',
            section: 'cart-drawer',
            selector: '#CartDrawer-Empty-Featured',
        });
        sections.push({
            id: 'CartDrawer-EmptyState',
            section: 'cart-drawer',
            selector: '.drawer__inner-empty',
        });
    }

    const cartIconBubble = document.getElementById('cart-icon-bubble');
    if (cartIconBubble) {
      sections.push({
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '#cart-icon-bubble',
      });
    }

    return sections;
  }

  updateQuantity(line, quantity, event, name, variantId) {
    const eventTarget = event && event.currentTarget instanceof CartRemoveButton ? 'clear' : 'change';
    const cartPerformanceUpdateMarker = CartPerformance.createStartingMarker(`${eventTarget}:user-action`);

    // Handle removal animation
    if (quantity === 0) {
      const lineItem = document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
      if (lineItem) {
        lineItem.classList.add('cart-item--removing');
        setTimeout(() => this.performUpdate(line, quantity, eventTarget, name, variantId, cartPerformanceUpdateMarker), 300);
        return;
      }
    }

    this.performUpdate(line, quantity, eventTarget, name, variantId, cartPerformanceUpdateMarker);
  }

  performUpdate(line, quantity, eventTarget, name, variantId, cartPerformanceUpdateMarker) {
    this.enableLoading(line);

    // Safety timeout: always unlock UI after 10s max
    const safetyTimer = setTimeout(() => this.disableLoading(line), 10000);

    const sectionsToRender = this.getSectionsToRender().map((section) => section.section);
    const body = JSON.stringify({
      line: parseInt(line),
      quantity: parseInt(quantity),
      sections: Array.from(new Set(sectionsToRender)),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => response.text())
      .then((state) => {
        const parsedState = JSON.parse(state);

        CartPerformance.measure(`${eventTarget}:paint-updated-sections`, () => {
          const quantityElement =
            document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
          const items = document.querySelectorAll('.cart-item');

          if (parsedState.errors) {
            if (quantityElement) quantityElement.value = quantityElement.getAttribute('value');
            this.updateLiveRegions(line, parsedState.errors);
            return;
          }

          this.classList.toggle('is-empty', parsedState.item_count === 0);
          const cartDrawerWrapper = document.querySelector('cart-drawer');
          const cartFooter = document.getElementById('main-cart-footer');

          if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
          if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

          if (parsedState.sections) {
            this.getSectionsToRender().forEach((section) => {
              const elementToReplace =
                document.getElementById(section.id)?.querySelector(section.selector) ||
                document.getElementById(section.id);
              
              if (elementToReplace && parsedState.sections[section.section]) {
                const sectionHtml = parsedState.sections[section.section];
                const sectionSelector = section.selector;
                
                elementToReplace.innerHTML = this.getSectionInnerHTML(sectionHtml, sectionSelector);
                
                // If it's the footer, we need to sync hidden state
                if (section.id === 'CartDrawer-Footer') {
                    const temp = new DOMParser().parseFromString(sectionHtml, 'text/html').querySelector(sectionSelector);
                    if (temp) {
                        elementToReplace.classList.toggle('hidden', temp.classList.contains('hidden'));
                    }
                }
              }

              // Trigger pop animation for updated quantity
              if (section.id === 'main-cart-items' || section.id === 'CartDrawer-CartItems') {
                const root = elementToReplace || document;
                const input = root.querySelector(`#Quantity-${line}, #Drawer-quantity-${line}`);
                if (input) {
                  input.classList.add('cart-quantity--pop');
                  setTimeout(() => input.classList.remove('cart-quantity--pop'), 400);
                }
              }
            });
          }

          // Guard: these elements may not exist when the last item is removed
          if (parsedState.item_count > 0) {
            const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;
            let message = '';
            if (items.length === parsedState.items.length && updatedValue !== parseInt(quantityElement?.value)) {
              if (typeof updatedValue === 'undefined') {
                message = window.cartStrings.error;
              } else {
                message = window.cartStrings.quantityError.replace('[quantity]', updatedValue);
              }
            }
            this.updateLiveRegions(line, message);
          }

          const lineItem =
            document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
          if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
            cartDrawerWrapper
              ? trapFocus(cartDrawerWrapper, lineItem.querySelector(`[name="${name}"]`))
              : lineItem.querySelector(`[name="${name}"]`).focus();
          } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
            const emptyState = cartDrawerWrapper.querySelector('.drawer__inner-empty');
            if (emptyState) trapFocus(emptyState, emptyState.querySelector('a'));
          }
        });

        publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: parsedState, variantId: variantId });
      })
      .catch((e) => {
        console.error(e);
        this.querySelectorAll('.loading__spinner').forEach((overlay) => overlay.classList.add('hidden'));
        const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
        if (errors) errors.textContent = window.cartStrings.error;
      })
      .finally(() => {
        clearTimeout(safetyTimer);
        this.disableLoading(line);
        CartPerformance.measureFromMarker(`${eventTarget}:user-action`, cartPerformanceUpdateMarker);
      });
  }

  updateLiveRegions(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError) {
        const errorText = lineItemError.querySelector('.cart-item__error-text');
        if (errorText) errorText.textContent = message;
    }

    if (this.lineItemStatusElement) this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus =
      document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
    if (cartStatus) {
        cartStatus.setAttribute('aria-hidden', false);
        setTimeout(() => {
          cartStatus.setAttribute('aria-hidden', true);
        }, 1000);
    }
  }

  getSectionInnerHTML(html, selector) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const parsed = doc.querySelector(selector);
    if (parsed) return parsed.innerHTML;
    return '';
  }

  enableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    if (mainCartItems) mainCartItems.classList.add('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading__spinner`);

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));

    if (document.activeElement) document.activeElement.blur();
    if (this.lineItemStatusElement) this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading(line) {
    // Forcefully remove disabled state from all possible containers
    document.querySelectorAll('.cart__items--disabled').forEach((el) => el.classList.remove('cart__items--disabled'));

    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    if (mainCartItems) mainCartItems.classList.remove('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading__spinner`);

    cartItemElements.forEach((overlay) => overlay.classList.add('hidden'));
    cartDrawerItemElements.forEach((overlay) => overlay.classList.add('hidden'));
  }
}

customElements.define('cart-items', CartItems);
