// Author: Jonas
// Description: Contains the class Graph-Layout, which is used in every graph
export {GraphLayout}

// Used in graphs to determine ratio
class GraphLayout {
    // width, in pixels
    public width: number
    // height, in pixels
    public height: number
    // top margin, in pixels
    public marginTop: number
    // right margin, in pixels
    public marginRight: number
    // bottom margin, in pixels
    public marginBottom: number
    // left margin, in pixels
    public marginLeft: number

    constructor(width: number, height: number, marginTop?: number, marginRight?: number, marginBottom?: number, marginLeft?: number) {
        this.width = width;
        this.height = height;
        this.marginTop = marginTop ?? 0;
        this.marginRight = marginRight ?? 0;
        this.marginBottom = marginBottom ?? 0;
        this.marginLeft = marginLeft ?? 0;
    }
}
