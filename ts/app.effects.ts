export class RippleEffect {
    
    public constructor(x: number, y: number, parent: HTMLElement, modifier?: string) {
        const ripple = document.createElement("div");
        ripple.classList.add("ripple");

        if (modifier) ripple.classList.add(modifier);

        ripple.style.left = (x || 0) + "px";
        ripple.style.top = (y || 0) + "px";

        parent.append(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}