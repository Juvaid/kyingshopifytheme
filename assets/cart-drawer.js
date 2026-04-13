class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.bindOverlay();
    this.setHeaderCartIconAccessibility();
  }

  bindOverlay() {
    const overlay = this.querySelector('#CartDrawer-Overlay');
    if (overlay) {
      // Remove old listeners by cloning
      const newOverlay = overlay.cloneNode(true);
      overlay.parentNode.replaceChild(newOverlay, overlay);
      newOverlay.addEventListener('click', this.close.bind(this));
    }
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (document.body.dataset.cartPending === 'true') {
        // Add-to-cart is in-flight: open drawer now with loading indicator,
        // then refresh once the server confirms the add.
        this.classList.add('is-loading');
        this.open(cartLink);
        const unsubscribe = subscribe(PUB_SUB_EVENTS.cartUpdate, () => {
          unsubscribe();
          this.refreshSections().then(() => this.classList.remove('is-loading'));
        });
      } else {
        // No pending add — fetch latest cart, then open.
        this.refreshSections().then(() => this.open(cartLink));
      }
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.refreshSections().then(() => this.open(cartLink));
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);

    // Use timeout to ensure animation triggers correctly
    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        if (containerToTrapFocusOn) trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true },
    );

    document.body.classList.add('overflow-hidden');
  }

  /**
   * Fetches the latest cart sections from the server and directly
   * updates the DOM. Uses the Section Rendering API format which
   * returns { sectionId: htmlString } at the top level.
   */
  refreshSections() {
    const sectionDefs = this.getSectionsToRender();
    const sectionNames = [...new Set(sectionDefs.map((s) => s.section || s.id))];
    const url = `${window.routes.cart_url}?sections=${sectionNames.join(',')}`;

    return fetch(url)
      .then((res) => res.json())
      .then((sectionsHtml) => {
        sectionDefs.forEach((section) => {
          const sectionId = section.section || section.id;
          const html = sectionsHtml[sectionId];
          if (!html) return;

          const sectionElement = section.selector
            ? document.querySelector(section.selector)
            : document.getElementById(section.id);
          if (!sectionElement) return;

          const selector = section.selector || `#${section.id}`;
          const newInnerHTML = this.getSectionInnerHTML(html, selector);
          if (newInnerHTML !== '') {
            sectionElement.innerHTML = newInnerHTML;
          }
        });

        // Determine is-empty state from the data-item-count attribute
        const cartDrawerHtml = sectionsHtml['cart-drawer'];
        if (cartDrawerHtml) {
          const doc = new DOMParser().parseFromString(cartDrawerHtml, 'text/html');
          const cartItemsEl = doc.querySelector('#CartDrawer-CartItems');
          const itemCount = cartItemsEl ? parseInt(cartItemsEl.dataset.itemCount || '0', 10) : 0;
          this.classList.toggle('is-empty', itemCount === 0);
        }

        this.bindOverlay();
      })
      .catch((err) => {
        console.error('Cart drawer refresh failed:', err);
      });
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling && cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    if (cartDrawerNote.parentElement) {
      cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
    }
  }

  renderContents(parsedState, shouldOpen = true) {
    this.productId = parsedState.id;

    if (parsedState.sections) {
      this.getSectionsToRender().forEach((section) => {
        const sectionId = section.section || section.id;
        if (!parsedState.sections[sectionId]) return;

        const sectionElement = section.selector
          ? document.querySelector(section.selector)
          : document.getElementById(section.id);

        if (!sectionElement) return;

        const html = parsedState.sections[sectionId];
        const selector = section.selector || `#${section.id}`;
        sectionElement.innerHTML = this.getSectionInnerHTML(html, selector);
      });
    }

    let isEmpty = false;
    if (typeof parsedState.item_count !== 'undefined') {
      isEmpty = parsedState.item_count === 0;
    } else if (parsedState.sections && parsedState.sections['cart-drawer']) {
      const doc = new DOMParser().parseFromString(parsedState.sections['cart-drawer'], 'text/html');
      const cartItemsEl = doc.querySelector('#CartDrawer-CartItems');
      const itemCount = cartItemsEl ? parseInt(cartItemsEl.dataset.itemCount || '0', 10) : 0;
      isEmpty = itemCount === 0;
    }

    this.classList.toggle('is-empty', isEmpty);
    const cartDrawerItems = this.querySelector('cart-drawer-items');
    if (cartDrawerItems) cartDrawerItems.classList.toggle('is-empty', isEmpty);
    const footer = this.querySelector('#CartDrawer-Footer');
    if (footer) footer.classList.toggle('hidden', isEmpty);

    setTimeout(() => {
      this.bindOverlay();

      // Animate entry for the new item
      const items = this.querySelectorAll('.cart-item, .cart-item-card');
      if (items.length > 0) {
        const newItem =
          Array.from(items).find(
            (item) => item.dataset.id && item.dataset.id.toString() === this.productId?.toString(),
          ) || items[0];
        if (newItem) newItem.classList.add('cart-item--added');
      }

      if (shouldOpen) this.open();
    });
  }

  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer-CartItems',
        section: 'cart-drawer',
        selector: '#CartDrawer-CartItems',
      },
      {
        id: 'CartDrawer-Footer',
        section: 'cart-drawer',
        selector: '#CartDrawer-Footer',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '#cart-icon-bubble',
      },
      {
        id: 'CartDrawer-Upsell',
        section: 'cart-drawer',
        selector: '#CartDrawer-Upsell',
      },
      {
        id: 'CartDrawer-Empty-Featured',
        section: 'cart-drawer',
        selector: '#CartDrawer-Empty-Featured',
      },

      {
        id: 'CartDrawer-EmptyState',
        section: 'cart-drawer',
        selector: '.drawer__inner-empty',
      },
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const target = doc.querySelector(selector);
    if (target) return target.innerHTML;
    return '';
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer-CartItems',
        section: 'cart-drawer',
        selector: '#CartDrawer-CartItems',
      },
      {
        id: 'CartDrawer-Footer',
        section: 'cart-drawer',
        selector: '#CartDrawer-Footer',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '#cart-icon-bubble',
      },
      {
        id: 'CartDrawer-Upsell',
        section: 'cart-drawer',
        selector: '#CartDrawer-Upsell',
      },
      {
        id: 'CartDrawer-Empty-Featured',
        section: 'cart-drawer',
        selector: '#CartDrawer-Empty-Featured',
      },

      {
        id: 'CartDrawer-EmptyState',
        section: 'cart-drawer',
        selector: '.drawer__inner-empty',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);
