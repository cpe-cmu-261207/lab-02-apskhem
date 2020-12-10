export class VirtualDOM {
    constructor() {
        this.el = document.createElement("div");
    }
    appendTo(parent) {
        parent.append(this.el);
    }
}
