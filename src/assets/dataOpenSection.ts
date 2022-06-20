export default function dataOpenSection(d: HTMLElement) {
    d.querySelectorAll("[data-open-section]").forEach((el: any) => {
        const sectionName = el.dataset.openSection
        el.addEventListener("click", (ev: MouseEvent) => {
            ev.preventDefault()
            window.location.hash = sectionName 
            delete el.dataset.open
        })
    })
}