import { Home } from "./components/home"
import { NovoCadastro } from "./components/novo-cadastro"
import { CDCDesktop } from "./components/cdc-desktop"
import { Login } from "./components/login"

//
const main = document.querySelector("main") as HTMLElement

// prenvent animation before load
window.addEventListener("load", () => {
    document.querySelectorAll(".preload").forEach(el => {
        el.classList.remove("preload")
    })
})

// 
const desktop = new CDCDesktop()
desktop.addSection(new Home, "home")
desktop.addSection(new NovoCadastro, "novo-cadastro")
desktop.addSection(new NovoCadastro, "documento")
desktop.addSection(new Login, "acesso")
main.append(desktop)

window.addEventListener('load', ev => {
    const curr = location.hash.substring(1)
    if (!curr) return
    desktop.show(curr)
})

window.addEventListener('hashchange', ev => {
    const curr = (new URL(ev.newURL).hash).substring(1)
    desktop.show(curr)
})