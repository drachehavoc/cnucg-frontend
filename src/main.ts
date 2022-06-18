import imask from "imask"

window.onload = ev => {
    document.querySelectorAll(".preload").forEach(el => {
        el.classList.remove("preload")
    })
}

new class FronendActions {
    constructor() {
        window["x"] = this
        // this.showLoggedMenus("user")
        // this.showLoggedMenus("admin")
        this.attachMaioridade()
        this.attachOpenAction()
        this.attachCloseActions()
        this.attachDataMasks()
        this.attachIBGEEstadoCidade()
        this.attachActionApiCEP()
    }

    async attachMaioridade() {
        const date = new Date()
        const y = date.getFullYear()
        document.querySelectorAll("[data-maioridade]").forEach(async (el: any) => {
            el.setAttribute("max", `${y-18}-01-01`)
            el.setAttribute("min", `${y-90}-01-01`)
        })
    }

    async attachIBGEEstadoCidade() {
        // https://servicodados.ibge.gov.br/api/docs/localidades
        const reqEstados = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        const estados = await reqEstados.json()
        const options = "<option></optiom>" + estados.map(estado => `<option value="${estado.sigla}">${estado.sigla} - ${estado.nome}</option>`).join("")
        const cache: { [key: string]: any } = {}
        document.querySelectorAll("[data-ibge-estados]").forEach(async (estadoEl: any) => {
            estadoEl.innerHTML = options
            estadoEl.removeAttribute("disabled")
            const cidadeEl = estadoEl.closest("form")[estadoEl.dataset.ibgeEstados]
            delete estadoEl.dataset.ibgeEstados
            estadoEl.addEventListener("change", async ev => {
                const uf = estadoEl.value
                if (!cache[uf]) {
                    const reqCidades = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`)
                    const cidades = await reqCidades.json()
                    cache[uf] = cidades.map(cidade => `<option>${cidade.nome}</option>`).join("")
                }
                cidadeEl.removeAttribute("disabled")
                cidadeEl.innerHTML = cache[uf]
                estadoEl.dispatchEvent(new Event("cidadeloaded"))
            })
        })
    }

    attachActionApiCEP() {
        document.querySelectorAll("[data-api-cep]").forEach((el: any) => {
            el.addEventListener("keyup", async ev => {
                if (el.value.length >= 9) {
                    const reqDados = await fetch(`https://viacep.com.br/ws/${el.value}/json/`)
                    const dados = await reqDados.json()

                    if (dados.erro) return

                    const form = el.closest("form")
                    const estadoEl = form.querySelector("[data-api-cep-uf]")

                    estadoEl.value = dados.uf
                    estadoEl.dispatchEvent(new Event('change'))
                    estadoEl.addEventListener('cidadeloaded', ev => {
                        form.querySelector("[data-api-cep-localidade]").value = dados.localidade
                    })

                    form.querySelector("[data-api-cep-logradouro]").value = dados.logradouro
                    form.querySelector("[data-api-cep-complemento]").value = dados.complemento
                    form.querySelector("[data-api-cep-bairro]").value = dados.bairro
                    form.querySelector("[data-api-cep-ddd]").value = `(${dados.ddd})`
                    console.log(dados)

                }
                delete el.dataset.apiCep
            })
        })
    }

    attachOpenAction() {
        document.querySelectorAll("[data-open]").forEach((el: any) => {
            const target = el.dataset.open
            el.addEventListener("click", ev => {
                ev.preventDefault()
                this.showSection(target)
                delete el.dataset.open
            })
        })
    }

    attachCloseActions() {
        document.querySelectorAll("[data-close]").forEach((el: any) => {
            const target = el.dataset.close
            el.addEventListener("click", ev => {
                ev.preventDefault()
                this.hideSection(target)
                delete el.dataset.close
            })
        })
    }

    attachDataMasks() {
        document.querySelectorAll("[data-mask]").forEach((el: any) => {
            imask(el, { mask: el.dataset.mask })
            delete el.dataset.mask
        });
    }

    showLoggedMenus(permission: string) {
        const pm = document.querySelector(".permission-name")
        let found = false

        if (pm)
            pm.innerHTML += `<span>${permission}</span>`

        document
            .querySelectorAll(`[data-permission="${permission}"]`)
            .forEach(el => {
                el.closest(".menu-item")?.removeAttribute("data-unlogged")
                el.removeAttribute("data-permission")
                el.classList.add(permission)
                found = true
            })

        if (found)
            document
                .querySelectorAll("[data-only-unlogged]")
                .forEach(el => el.remove())

    }

    showSection(sectionClass: string) {
        document.querySelector(`.${sectionClass}`)?.classList.remove("before-show")
        document.querySelector(".home")?.classList.add("close")
    }

    hideSection(sectionClass: string) {
        document.querySelector(`.${sectionClass}`)?.classList.add("before-show")
        document.querySelector(".home")?.classList.remove("close")
    }
}