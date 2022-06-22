import template from "bundle-text:./login.template.html"
import dataMask from "../../assets/dataMask"

export class Login extends HTMLElement {
    #shadow = this.attachShadow({ mode: 'closed' })

    constructor() {
        super()
    }

    connectedCallback() {
        this.#shadow.innerHTML = template
        const form = this.#shadow.querySelector("form") as HTMLFormElement
        dataMask(form)
        form.addEventListener("submit", ev => {
            ev.preventDefault()
            const login = form.login.value.replace(/[\.-]+/ig, "")
            const pass = form.password.value

            if (login == "11111111111") {
                window.dispatchEvent(new CustomEvent("login", { detail: "user" }))
                console.warn("REMOVER ESSA LINHA: application fake somente para apresentação")
                console.warn("#")
                localStorage.setItem("cnucg", "111.111.111.111") 
                location.hash = "home"
                return
            }
            
            if (login == "77777777777") {
                window.dispatchEvent(new CustomEvent("login", { detail: "admin" }))
                location.hash = "home"
                return
            }

            location.hash = "acesso-erro"
        })
    }
}

customElements.define("cnucg-login", Login)