import template from "bundle-text:./home.template.html"
import dataOpenSection from "../../assets/dataOpenSection"

export class Home extends HTMLElement {
    #shadow = this.attachShadow({ mode: 'closed' })
    #container!: HTMLElement

    constructor() {
        super()
    }

    connectedCallback() {
        this.#shadow.innerHTML = template
        this.#container = this.#shadow.querySelector("section") as HTMLElement
        dataOpenSection(this.#container)
        this.#showAllowed("unlogged")
    }

    #showAllowed(level: string) {
        const els = this.#container.querySelectorAll<HTMLElement>(`[data-permission*="${level}"]`)
        els.forEach(el => {
            el.classList.add("show")
            el.closest(".menu-item")?.classList.add("show")
        })
    }

    #hide(level: string) {
        const els = this.#container.querySelectorAll<HTMLElement>(`[data-permission*="${level}"]`)
        els.forEach(el => {
            el.classList.remove("show")
            el.closest(".menu-item")?.classList.remove("show")
        })
    }

}

customElements.define("cnucg-home", Home)