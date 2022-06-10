import type {Ref} from "vue";

export default function applySVG(div: Ref<HTMLDivElement | null>, svg: SVGSVGElement) {
    div.value?.append(svg)
}