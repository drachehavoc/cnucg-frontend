import template from "bundle-text:./documentacao.component.html"

export class Documentacao extends HTMLElement {
    #shadow = this.attachShadow({ mode: 'open' })

    constructor() {
        super()
        this.#shadow.innerHTML = template
    }
}

customElements.define("cnucg-documentacao", Documentacao)