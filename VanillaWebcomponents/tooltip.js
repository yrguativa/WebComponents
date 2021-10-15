class wcTooltip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: `open` });
        this._tooltipText = '';
        this._tooltipVisible = false;
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    background-color: var(--primary-color, black);
                    color: var(--secondary-color, white);
                    position: absolute;
                    z-index: 10;
                    padding: 10px 15px;
                    border-radius: 8px;
                    margin-top: 5px;
                    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.26)
                }
                :host {
                    color: grey;
                }
                :host-context(p){
                    text-decoration: underline;
                    margin: 0;
                }
                ::slotted(.bold-text) {
                    font-weight: bold;
                    color: teal;
                }
            </style>
            <slot></slot>
        `;
    }
    static get observedAttributes() {
        return ['text-tooltip', 'class'];
    }
    connectedCallback() {
        if (this.hasAttribute('text-tooltip')) {
            this._tooltipText = this.getAttribute('text-tooltip');
        }

        this.addEventListener('mouseenter', this._showTooltip.bind(this));
        this.addEventListener('mouseleave', this._hideTooltip.bind(this));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        if (name === 'text-tooltip') {
            this._tooltipText = newValue;
        }
    }
    disconnectCallback() {
        this.removeEventListener('mouseenter', this);
        this.removeEventListener('mouseleave', this);
    }

    _render() {
        let tooltipContainer = this.shadowRoot.querySelector('div#tooltipContaniner');
        if (this._tooltipVisible) {
            tooltipContainer = document.createElement('div');
            tooltipContainer.id = "tooltipContaniner";
            tooltipContainer.textContent = this._tooltipText;
            this.shadowRoot.appendChild(tooltipContainer);
        } else {
            if (tooltipContainer) {
                this.shadowRoot.removeChild(tooltipContainer);
            }
        }
    }
    _showTooltip() {
        this._tooltipVisible = true;
        this._render();
    }
    _hideTooltip() {
        this._tooltipVisible = false;
        this._render();
    }
}

customElements.define('wc-tooltip', wcTooltip);