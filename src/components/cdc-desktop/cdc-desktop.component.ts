import template from "bundle-text:./cdc-desktop.template.html"

export class DesktopEvent extends CustomEvent<{ sectionName: string }> {
    constructor(type: string, sectionName: string) {
        super(type, { detail: { sectionName } })
    }
}

export class CDCDesktop extends HTMLElement {
    #shadowRoot = this.attachShadow({ mode: 'closed' })
    #history: Array<string> = []
    #host = this.#shadowRoot.host
    #main!: HTMLElement

    // static get observedAttributes() {
    //     return ['content'];
    // }

    constructor() {
        super()
        this.#shadowRoot.innerHTML = template
        this.#main = <HTMLElement>this.#shadowRoot.querySelector("main")
    }

    #transitionShow(el: HTMLElement, distance: number) {
        el.style.setProperty("--section-transition", "0s")
        el.style.setProperty("--section-opacity", "0")
        el.style.setProperty("--section-translateX", `${distance}%`)
        el.style.setProperty("--section-visibility", "hidden")
        setTimeout(() => {
            el.style.setProperty("--section-transition", ".3s")
            el.style.setProperty("--section-opacity", "1")
            el.style.setProperty("--section-translateX", "0%")
            el.style.setProperty("--section-visibility", "visible")
        })
    }

    #transitionHide(el: HTMLElement, distance: number) {
        el.style.setProperty("--section-transition", ".3s")
        el.style.setProperty("--section-opacity", "0")
        el.style.setProperty("--section-translateX", `${distance}%`)
        el.style.setProperty("--section-visibility", "hidden")
    }

    #getCurrentSection() {
        const key = this.#history.at(-1) ?? 0
        return typeof key == "string"
            ? <HTMLElement>this.#main.querySelector(`#${key}`)
            : <HTMLElement>this.#main.children[key]
    }

    #getSection(key: number | string) {
        if (!key)
            return <HTMLElement>this.#main.querySelector("section")

        return typeof key == "string"
            ? <HTMLElement>this.#main.querySelector(`#${key}`)
            : <HTMLElement>this.#main.children[key]
    }

    show(key: number | string, goesBack: boolean = false) {
        if (!this.#main) return

        let next = this.#getSection(key)
        if (!next) return

        let curr = this.#getCurrentSection()
        if (!curr) return

        if (goesBack || this.#history.at(-2) == next.id) {
            this.#transitionHide(curr, 25) // goes to left
            this.#transitionShow(next, -25) // come form right
            this.#history.pop()
            next.children[0].dispatchEvent(new DesktopEvent("desktop-show", next.id))
            curr.children[0].dispatchEvent(new DesktopEvent("desktop-hide", curr.id))
            return
        }

        this.#transitionHide(curr, -25) // goes to left
        this.#transitionShow(next, 25) // come form right
        this.#history.push(next.id)
        next.children[0].dispatchEvent(new DesktopEvent("desktop-show", next.id))
        curr.children[0].dispatchEvent(new DesktopEvent("desktop-hide", curr.id))
    }

    addSection(el: HTMLElement, name?: string) {
        const section = document.createElement("section")
        section.id = name ?? el.dataset.name ?? `id_${(Date.now() * Math.random()).toString(36).replace(".", "")}`
        section.style.setProperty("--section-visibility", "hidden")
        section.append(el)
        this.#main.append(section)
    }

    connectedCallback() {
        this.#host.querySelectorAll<HTMLElement>("*").forEach(el => {
            if (el instanceof HTMLScriptElement || el instanceof HTMLStyleElement)
                return this.#shadowRoot.append(el)
            this.addSection(el)
        })
        const frst = <HTMLElement>this.#main.children[0]
        frst.style.setProperty("--section-visibility", "visible")
        this.#history.push(<string>frst.getAttribute("id"))
    }
}

customElements.define("cdc-desktop", CDCDesktop)