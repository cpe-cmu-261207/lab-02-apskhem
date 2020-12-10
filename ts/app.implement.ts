export abstract class VirtualDOM {

    public readonly el = document.createElement("div");

    public constructor() { }

    public appendTo(parent: HTMLElement): void {
        parent.append(this.el);
    }
}