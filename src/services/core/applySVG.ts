import type {Ref} from "vue";

export default function applySVG (div : Ref<HTMLDivElement | null>, svg : SVGSVGElement | null) {
    if (div.value != null && svg?.outerHTML != undefined)
        div.value.innerHTML = svg.outerHTML
}