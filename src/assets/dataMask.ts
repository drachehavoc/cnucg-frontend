import imask from "imask"

export default function (form: HTMLFormElement) {
    form.querySelectorAll("[data-mask]").forEach((el: any) => {
        imask(el, { mask: el.dataset.mask })
        delete el.dataset.mask
    });
}