export default async function dataMaioridade(d: HTMLElement) {
    const date = new Date()
    const y = date.getFullYear()
    d.querySelectorAll("[data-maioridade]").forEach(async (el: any) => {
        el.setAttribute("max", `${y - 18}-01-01`)
        el.setAttribute("min", `${y - 90}-01-01`)
    })
}