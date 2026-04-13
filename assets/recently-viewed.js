if (!customElements.get('recently-viewed')) {
  customElements.define('recently-viewed', class RecentlyViewed extends HTMLElement {
    constructor() {
      super();
      this.productHandle = this.dataset.productHandle;
      this.limit = parseInt(this.dataset.limit) || 4;
      this.grid = this.querySelector('.grid');
      
      this.init();
    }
    
    async init() {
      this.recordProduct();
      await this.renderRecentlyViewed();
    }
    
    recordProduct() {
      if (!this.productHandle) return;
      
      let viewed = [];
      try {
        viewed = JSON.parse(localStorage.getItem('kyingRecentlyViewed') || '[]');
      } catch (e) {}
      
      // Remove current product if it exists to deal with duplicates
      viewed = viewed.filter(handle => handle !== this.productHandle);
      
      // Add to beginning
      viewed.unshift(this.productHandle);
      
      // Limit to 10
      viewed = viewed.slice(0, 10);
      
      localStorage.setItem('kyingRecentlyViewed', JSON.stringify(viewed));
    }
    
    async renderRecentlyViewed() {
      if (!this.grid) return;
      
      let viewed = [];
      try {
        viewed = JSON.parse(localStorage.getItem('kyingRecentlyViewed') || '[]');
      } catch (e) {}
      
      if (this.productHandle) {
        viewed = viewed.filter(handle => handle !== this.productHandle);
      }
      
      viewed = viewed.slice(0, this.limit);
      
      if (viewed.length === 0) {
        this.style.display = 'none';
        return;
      }
      
      this.classList.remove('hidden');
      
      const productHTMLs = await Promise.all(
        viewed.map(handle => 
          fetch(`/products/${handle}?section_id=recently-viewed-card`)
            .then(res => res.text())
            .then(html => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const card = doc.querySelector('.card-wrapper');
              return card ? card.outerHTML : '';
            })
            .catch(() => '')
        )
      );
      
      const validHTMLs = productHTMLs.filter(html => html !== '');
      if (validHTMLs.length > 0) {
        this.grid.innerHTML = validHTMLs.map(html => `<li class="grid__item">${html}</li>`).join('');
      } else {
        this.style.display = 'none';
      }
    }
  });
}
