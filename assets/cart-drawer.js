class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    const overlay = this.querySelector('#CartDrawer-Overlay');
    if (overlay) overlay.addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
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

    this.classList.toggle('is-empty', parsedState.item_count === 0);

    setTimeout(() => {
      const overlay = this.querySelector('#CartDrawer-Overlay');
      if (overlay) overlay.addEventListener('click', this.close.bind(this));

      // Animate entry for the new item
      const items = this.querySelectorAll('.cart-item');
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
