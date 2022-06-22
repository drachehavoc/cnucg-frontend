import QrScanner from 'qr-scanner'
import template from "bundle-text:./carteira-nacional-validar.template.html"
import dataMask from "../../assets/dataMask"

export class CarteiraNacionalValidar extends HTMLElement {
    #shadow = this.attachShadow({ mode: 'open' })
    #host = this.#shadow.host
    #form: HTMLFormElement
    #select: HTMLSelectElement
    #selectOriginalClone: HTMLSelectElement
    #prevQrScaner: QrScanner | null = null
    #canvasContainer: HTMLCanvasElement

    constructor() {
        super()
        this.#shadow.innerHTML = template
        this.#form = this.#shadow.querySelector("form") as HTMLFormElement
        this.#select = this.#form.cameras
        this.#selectOriginalClone = this.#select.cloneNode(true) as HTMLSelectElement
        this.#canvasContainer = this.#form.querySelector(".qr-show-cam") as HTMLCanvasElement

        dataMask(this.#form)
        this.#attachCNUCGEventListener()

        this.addEventListener("desktop-show", ev => {
            this.#getQrCodeReady()
            this.#attachSelectCameraEventListener()
        })

        this.addEventListener("desktop-hide", ev => {
            this.#qrCodeDisable()
        })

        this.#form.addEventListener("submit", ev => {
            ev.preventDefault()
        })

    }

    async #qrCodeDisable() {
        //
        if (this.#prevQrScaner) {
            this.#prevQrScaner.stop()
            this.#prevQrScaner.destroy()
            this.#prevQrScaner = null
        }

        //
        this.#canvasContainer.classList.add("hide")

        // remove listeners
        const selectClone = this.#selectOriginalClone.cloneNode(true) as HTMLSelectElement
        this.#select.replaceWith(selectClone)
        this.#select = selectClone
    }

    async #getQrCodeReady() {
        const devices = await QrScanner.listCameras(true);

        //
        let opts = `<option value="">-- escolha uma câmera --</option>`
        devices.forEach(dvc => opts += `<option value="${dvc.id}">${dvc.label}</option>`)
        this.#select.innerHTML = opts
        this.#select.removeAttribute("disabled")

        //
        // const image = this.#form.querySelector("#qr-source")
        // QrScanner.scanImage(image)
        //     .then(result => console.log(result))
        //     .catch(error => console.log(error || 'No QR code found.'));

        //
        this.#attachSelectCameraEventListener()
    }

    #attachSelectCameraEventListener() {
        const inputTarget = <HTMLSelectElement>this.#form.cnucg
        const canvas = this.#canvasContainer.querySelector(".qr-show-cam canvas") as HTMLCanvasElement
        const sourceElement = document.createElement("video")
        this.#select.addEventListener("change", ev => {
            //
            const preferredCamera = this.#select.value

            // trocar a câmera
            if (this.#prevQrScaner) {
                this.#prevQrScaner.setCamera(preferredCamera)
                return
            }

            //
            if ((new Date()).getFullYear() >= 2022)
                console.warn("Considere alterar esse código para API nativa (Barcode Detection API) caso ela já esteja implementada.")

            // onDecode
            const onDecode = ({ data }: { data: string }) => {
                if (!this.#prevQrScaner) return
                this.#select.value = ""
                inputTarget.value = data
                this.#canvasContainer.classList.add("hide")
                this.#prevQrScaner.stop()
                this.#prevQrScaner = null
            }

            //
            const qrScanner = this.#prevQrScaner =
                new QrScanner(sourceElement, onDecode, { preferredCamera });

            //
            this.#canvasContainer.classList.remove("hide")

            // gabiarra A: ñ foi utilizada pq assim eu não posso 
            // fazer animações com o canvas, pois ele só é adicionado 
            // na tela depois de criar QrScanner
            // canvas.parentElement?.prepend(qrScanner.$canvas)

            // gambiara B: a biblioteca QrScanner cria o elemento 
            // HTMLVideoElement dentro do WebComponent por isso a 
            // gambiarra é copiar cada um dos frames em um canvas
            const ctx = canvas.getContext("2d")
            const loopGambiarra = () => {
                canvas.width = qrScanner.$canvas.width
                canvas.height = qrScanner.$canvas.height
                ctx?.drawImage(qrScanner.$canvas, 0, 0)
                requestAnimationFrame(loopGambiarra)
            }
            requestAnimationFrame(loopGambiarra)

            // inicia o componente
            // qrScanner.setCamera(cameraId)
            qrScanner.start()
        })
    }

    #attachCNUCGEventListener() {
        const cnucg = this.#form.cnucg
        this.#form.addEventListener("submit", ev => {
            ev.preventDefault()
            location.hash = `documento/${Date.now().toString(36)}/${cnucg.value}`
        })
    }
}

customElements.define("cnucg-carteira-nacional-validar", CarteiraNacionalValidar)