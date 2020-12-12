export abstract class VirtualDOM {

    public readonly el = document.createElement("div");

    public constructor() { }

    public appendTo(parent: HTMLElement): void {
        parent.append(this.el);
    }
}

export abstract class AppInitializer {

    public static start(...args: Object[]): void { }
    public static onkeydown(e: KeyboardEvent): void { }

}