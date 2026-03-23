class PriceRangeSlider extends HTMLElement {
  constructor() {
    super();
    this.container = this.querySelector('.range-slider');
    this.track = this.querySelector('.range-slider__track');
    this.range = this.querySelector('.range-slider__range');
    this.minInput = this.querySelector('.range-slider__input--min');
    this.maxInput = this.querySelector('.range-slider__input--max');
    
    // Find corresponding number inputs in the parent/sibling facets__price-inputs
    this.parent = this.closest('.facets__price') || this.parentElement;
    this.numberMin = this.parent.querySelector('input[name="' + this.minInput.getAttribute('aria-label') + '"]') || 
                      this.parent.querySelector('input[id$="-GTE"]');
    this.numberMax = this.parent.querySelector('input[name="' + this.maxInput.getAttribute('aria-label') + '"]') || 
                      this.parent.querySelector('input[id$="-LTE"]');

    this.minInput.addEventListener('input', this.onSliderInput.bind(this));
    this.maxInput.addEventListener('input', this.onSliderInput.bind(this));
    
    if (this.numberMin) this.numberMin.addEventListener('input', this.onNumberInput.bind(this));
    if (this.numberMax) this.numberMax.addEventListener('input', this.onNumberInput.bind(this));

    this.updateRangeFill();
  }

  onSliderInput(event) {
    const isMin = event.target === this.minInput;
    let valMin = parseInt(this.minInput.value);
    let valMax = parseInt(this.maxInput.value);

    // Prevent handles from crossing
    const minGap = 1; 
    if (valMax - valMin < minGap) {
      if (isMin) {
        this.minInput.value = valMax - minGap;
      } else {
        this.maxInput.value = valMin + minGap;
      }
    }

    this.updateNumberInputs();
    this.updateRangeFill();
    
    // Trigger 'input' on the number inputs to notify FacetFiltersForm
    if (this.numberMin) this.numberMin.dispatchEvent(new Event('input', { bubbles: true }));
  }

  onNumberInput(event) {
    const valMin = this.numberMin ? parseInt(this.numberMin.value) || 0 : 0;
    const valMax = this.numberMax ? parseInt(this.numberMax.value) || parseInt(this.getAttribute('data-max')) : parseInt(this.getAttribute('data-max'));

    this.minInput.value = valMin;
    this.maxInput.value = valMax;
    this.updateRangeFill();
  }

  updateNumberInputs() {
    if (this.numberMin) this.numberMin.value = this.minInput.value;
    if (this.numberMax) this.numberMax.value = this.maxInput.value;
  }

  updateRangeFill() {
    const min = parseInt(this.minInput.min);
    const max = parseInt(this.minInput.max);
    const valMin = parseInt(this.minInput.value);
    const valMax = parseInt(this.maxInput.value);

    const percent1 = ((valMin - min) / (max - min)) * 100;
    const percent2 = ((valMax - min) / (max - min)) * 100;

    this.range.style.left = percent1 + '%';
    this.range.style.width = (percent2 - percent1) + '%';
  }
}

if (!customElements.get('price-range-slider')) {
  customElements.define('price-range-slider', PriceRangeSlider);
}
