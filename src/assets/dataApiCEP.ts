type TypeCEP = {
    logradouro: string
    localidade: string
    complemento: string
    bairro: string
    ddd: string
    uf: string
    erro?: boolean
}

export default function dataApiCEP(form: HTMLFormElement) {
    form.querySelectorAll("[data-api-cep]").forEach((el: any) => {
        el.addEventListener("keyup", async () => {
            if (el.value.length >= 9) {
                const reqDados = await fetch(`https://viacep.com.br/ws/${el.value}/json/`)
                const dados: TypeCEP = await reqDados.json()

                if (dados.erro) return

                const form = el.closest("form")
                const dom = {
                    estado: form.querySelector("[data-api-cep-uf]"),
                    logradouro: <HTMLInputElement>form.querySelector("[data-api-cep-logradouro]"),
                    complemento: form.querySelector("[data-api-cep-complemento]"),
                    bairro: form.querySelector("[data-api-cep-bairro]"),
                    ddd: form.querySelector("[data-api-cep-ddd]"),
                    localidade: form.querySelector("[data-api-cep-localidade]"),
                }

                Object.values(dom).forEach((el: HTMLInputElement) => {
                    el.setAttribute("disabled", "disabled")
                    el.value = "carregando..."
                })

                console.log("aasdasd")
                dom.estado.value = dados.uf
                dom.estado.dispatchEvent(new Event('change'))
                dom.estado.addEventListener('cidadeloaded', () => {
                    dom.localidade.value = dados.localidade
                })

                dom.logradouro.value = dados.logradouro
                dom.complemento.value = dados.complemento
                dom.bairro.value = dados.bairro
                dom.ddd.value = `(${dados.ddd}) `

                Object.values(dom).forEach((el: HTMLInputElement) => el.removeAttribute("disabled"))
            }

            delete el.dataset.apiCep
        })
    })
}