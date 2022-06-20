type TypeInstituicoes = [
    {
        id: number
        razao_social: string
    }
]
export default async function dataInstituicoes(d: HTMLElement) {
    const req = await fetch("http://localhost:3000/instituicao/1/1000")
    const data: TypeInstituicoes = await req.json()
    const opts = data.map(v => `<option value="${v.id}">${v.razao_social}</option>`)
    d.querySelectorAll("[data-instituicoes]").forEach(async (el: any) => el.innerHTML = `<option></option>${opts}`)
}