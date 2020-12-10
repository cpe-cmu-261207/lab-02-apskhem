import { RippleEffect } from "./app.effects.js";
import { VirtualDOM } from "./app.implement.js";

export class SubjectList extends VirtualDOM {

    private readonly aside1 = document.createElement("aside");
    private readonly aside2 = document.createElement("aside");
    private readonly aside3 = document.createElement("aside");
    private readonly aside4 = document.createElement("aside");
    private readonly aside5 = document.createElement("aside");
    private readonly aside6 = document.createElement("aside");

    private readonly numberSpan = document.createElement("span");
    private readonly gradeIcon = document.createElement("div");
    private readonly deleteIcon = document.createElement("i");

    public ondelete: ((el: SubjectList) => void) | null = null;
    public onselect: ((el: SubjectList) => void) | null = null;

    public constructor(id: string, name: string, credit: number, grade: Grade) {
        super();

        this.subjectId = id;
        this.subjectName = name;
        this.credit = credit;
        this.grade = grade;

        // setup classes
        this.el.classList.add("subject-list");
        this.aside5.classList.add("grade-icon-container", "flex-center");
        this.aside6.classList.add("flex-center");
        this.deleteIcon.classList.add("fas", "fa-times");

        // append children
        this.aside1.append(this.numberSpan);
        this.aside5.append(this.gradeIcon);
        this.aside6.append(this.deleteIcon);
        this.el.append(this.aside1, this.aside2, this.aside3, this.aside4, this.aside5, this.aside6);

        // setup event listener
        this.deleteIcon.addEventListener("click", this.delete);
        this.el.addEventListener("click", this.select);
    }

    public get order(): number {
        return parseInt(this.numberSpan.textContent ?? "");
    }

    public set order(value: number) {
        this.numberSpan.textContent = `${value}.`;
    }

    public get subjectId(): string {
        return this.aside2.textContent ?? "";
    }

    public set subjectId(value: string) {
        this.aside2.textContent = value;
    }

    public get subjectName(): string {
        return this.aside3.textContent ?? "";
    }

    public set subjectName(value: string) {
        this.aside3.textContent = value;
    }

    public get credit(): number {
        return +(this.aside4.textContent ?? 0);
    }

    public set credit(value: number) {
        this.aside4.textContent = `${value}`;
    }

    public get grade(): Grade {
        return this.gradeIcon.textContent as Grade;
    }

    public set grade(value: Grade) {
        const iconName = value.toLowerCase().replace("+", "p") + "-icon";

        this.gradeIcon.className = "";
        this.gradeIcon.classList.add(iconName);
        this.gradeIcon.textContent = value;
    }

    public get gradeAsNumber(): number {
        switch (this.grade) {
            case "A": return 4;
            case "B+": return 3.5;
            case "B": return 3;
            case "C+": return 2.5;
            case "C": return 2;
            case "D+": return 1.5;
            case "D": return 1;
            case "F": return 0;
            default: throw Error("Cannot get grade as number");
        }
    }

    private delete = (e: MouseEvent) => {
        e.stopPropagation();

        this.ondelete?.(this);
    }

    private select = (e: MouseEvent) => {
        e.stopPropagation();

        new RippleEffect(e.offsetX, e.offsetY, this.el);
        
        this.onselect?.(this);
    }
}