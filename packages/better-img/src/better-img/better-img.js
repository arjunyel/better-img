class BetterImg extends HTMLElement {
  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        :host {
          display: block;
        }
      </style>
      <img />
    `;
    return template;
  }

  static get observedAttributes() {
    return ["url", "fallback", "width", "height", "alt", "log"];
  }

  constructor() {
    super();
    this.attachShadowDOM();
  }

  connectedCallback() {
    this.usingFallback = false;
    this.img.onerror = this.onImgError.bind(this);
    this.upgradeProperties();
    this.setProperties();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.setProperties();
  }

  attachShadowDOM() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(BetterImg.template.content.cloneNode(true));
  }

  upgradeProperties() {
    BetterImg.observedAttributes.forEach(prop => {
      if (this.hasOwnProperty(prop)) {
        let value = this[prop];
        delete this[prop];
        this[prop] = value;
      }
    });
  }

  setProperties() {
    this.setSrc(this.url);
    this.img.width = this.width;
    this.img.height = this.height;
    this.img.alt = this.alt;
  }

  get img() {
    return this.shadowRoot.querySelector("img");
  }

  get url() {
    return this.getAttribute("url");
  }

  set url(url) {
    this.setAttribute("url", url);
  }

  get width() {
    return this.getAttribute("width") || 480;
  }

  set width(width) {
    this.setAttribute("width", width);
  }

  get height() {
    return this.getAttribute("height") || 640;
  }

  set height(height) {
    this.setAttribute("height", height);
  }

  get alt() {
    return this.getAttribute("alt") || "";
  }

  set alt(alt) {
    this.setAttribute("alt", alt);
  }

  get fallback() {
    return this.getAttribute("fallback");
  }

  set fallback(fallback) {
    return this.setAttribute("fallback", fallback);
  }

  get logCallback() {
    return this.getAttribute("log");
  }

  set logCallback(callback) {
    this.setAttribute("log", callback);
  }

  onImgError(err) {
    this.logError(err);
    this.useFallback();
  }

  useFallback() {
    if (this.fallback && !this.usingFallback) {
      this.setAttribute("url", this.fallback);
      this.setSrc(this.fallback);
      this.usingFallback = true;
    }
  }

  logError(err) {
    if (this.logCallback) {
      window[this.logCallback](err);
    }
  }

  setSrc(url) {
    this.img.src = url;
  }
}

customElements.define("better-img", BetterImg);
