import { Home } from "./components/home"
import { NovoCadastro } from "./components/novo-cadastro"
import { CDCDesktop } from "./components/cdc-desktop"
import { Login } from "./components/login"
import { CarteiraNacionalValidar } from "./components/carteira-nacional-validar"
import { CarteiraNacional } from "./components/carteira-nacional/carteira-nacional.component"

//
const main = document.querySelector("main") as HTMLElement

// prenvent animation before load
window.addEventListener("load", () => {
    document.querySelectorAll(".preload").forEach(el => {
        el.classList.remove("preload")
    })
})

// 
const home = new Home

// 
const desktop = new CDCDesktop()
desktop.addSection(home, "home")
desktop.addSection(new NovoCadastro, "novo-cadastro")
desktop.addSection(new CarteiraNacionalValidar, "validar-documento")
desktop.addSection(new CarteiraNacional, "documento")
desktop.addSection(new Login, "acesso")
main.append(desktop)

window.addEventListener('load', ev => {
    const curr = location.hash.substring(1).replace(/\/.*/ig, "")
    if (!curr) return
    desktop.show(curr)
})

window.addEventListener('hashchange', ev => {
    const curr = (new URL(ev.newURL).hash).substring(1).replace(/\/.*/ig, "")
    desktop.show(curr)
})

//
window.addEventListener("login", ev => {
    const detail = (ev as CustomEvent).detail
    home.showAllowed(detail)
    home.hide("only-unlogged")
})