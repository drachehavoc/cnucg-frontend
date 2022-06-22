import QRCode, { QRCodeRenderersOptions } from "qrcode"
import template from "bundle-text:./carteira-nacional.template.html"

export class CarteiraNacional extends HTMLElement {
    #shadow = this.attachShadow({ mode: 'open' })

    constructor() {
        super()
        this.#shadow.innerHTML = template
        this.#validar()
    }

    #validar() {
        const carteira = <HTMLElement>this.#shadow.querySelector("section.carteira")
        const erro = <HTMLElement>this.#shadow.querySelector("section.erro")
        const canvas = this.#shadow.querySelector("#qr-code")
        const doc = <HTMLParagraphElement>this.#shadow.querySelector("#doc")

        this.addEventListener("desktop-show", ev => {
            const cnucg = location.hash.replace(/.+?\//ig, "")

            if (cnucg !== "111.111.111.111") {
                carteira.classList.add("hide")
                erro.classList.remove("hide")
                return
            }

            //
            erro.classList.add("hide")
            carteira.classList.remove("hide")

            //
            doc.innerHTML = cnucg
            const options: QRCodeRenderersOptions = { width: 400, margin: 0 }
            QRCode.toCanvas(canvas, cnucg, options, err => {
                if (err) console.error(err)
            })
        })

    }
}

customElements.define("cnucg-carteira-nacional", CarteiraNacional)