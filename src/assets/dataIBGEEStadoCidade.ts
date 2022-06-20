type TypeEstados = [
    {
        sigla: string[2]
        nome: string
    }
]

type TypeCidades = [
    {
        nome: string
    }
]



export default async function dataIBGEEstadoCidade(d: HTMLElement) {
    // https://servicodados.ibge.gov.br/api/docs/localidades
    const reqEstados = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    const estados: TypeEstados = await reqEstados.json()
    const options = "<option></optiom>" + estados.map(estado => `<option value="${estado.sigla}">${estado.sigla} - ${estado.nome}</option>`).join("")
    const cache: { [key: string]: any } = {}
    d.querySelectorAll("[data-ibge-estados]").forEach(async (estadoEl: any) => {
        estadoEl.innerHTML = options
        estadoEl.removeAttribute("disabled")
        const cidadeEl = estadoEl.closest("form")[estadoEl.dataset.ibgeEstados]
        delete estadoEl.dataset.ibgeEstados
        estadoEl.addEventListener("change", async () => {
            const uf = estadoEl.value
            if (!cache[uf]) {
                const reqCidades = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`)
                const cidades: TypeCidades = await reqCidades.json()
                cache[uf] = cidades.map(cidade => `<option>${cidade.nome}</option>`).join("")
            }
            cidadeEl.removeAttribute("disabled")
            cidadeEl.innerHTML = cache[uf]
            estadoEl.dispatchEvent(new Event("cidadeloaded"))
        })
    })
}