import type {Ref} from "vue";

export default function applySVG (ref : Ref<SVGElement | null>, svg : SVGSVGElement | null) {
    if (ref.value != null && svg?.outerHTML != undefined) ref.value.outerHTML = svg.outerHTML
}