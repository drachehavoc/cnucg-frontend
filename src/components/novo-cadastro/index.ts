import template from "bundle-text:./home.template.html"
import dataApiCEP from "../../assets/dataApiCEP"
import dataOpenSection from "../../assets/dataOpenSection"
import dataIBGEEstadoCidade from "../../assets/dataIBGEEStadoCidade"
import dataInstituicoes from "../../assets/dataInstituicoes"
import dataMaioridade from "../../assets/dataMaioridade"
import dataMask from "../../assets/dataMask"

export class NovoCadastro extends HTMLElement {
    #shadow = this.attachShadow({ mode: 'closed' })

    constructor() {
        super()
    }

    connectedCallback() {
        this.#shadow.innerHTML = template
        const form = this.#shadow.querySelector("form") as HTMLFormElement
        dataMask(form)
        dataApiCEP(form)
        dataOpenSection(form)
        dataIBGEEstadoCidade(form)
        dataInstituicoes(form)
        dataMaioridade(form)
    }
}

customElements.define("cnucg-novo-cadastro", NovoCadastro)