import template from "bundle-text:./login-error.template.html"

export class LoginError extends HTMLElement {
    #shadow = this.attachShadow({ mode: 'closed' })

    constructor() {
        super()
    }

    connectedCallback() {
        this.#shadow.innerHTML = template
    }
}

customElements.define("cnucg-login-error", LoginError)