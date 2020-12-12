export class VirtualDOM {
    constructor() {
        this.el = document.createElement("div");
    }
    appendTo(parent) {
        parent.append(this.el);
    }
}
export class AppInitializer {
    static start(...args) { }
    static onkeydown(e) { }
}
