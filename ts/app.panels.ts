import { RippleEffect } from "./app.effects.js";
import { SemesterSheet } from "./app.semestersheet.js";

export class CreatePane {

    private static instance: CreatePane | null = null;

    public readonly idInput = document.getElementById("create-id-input") as HTMLInputElement;
    public readonly nameInput = document.getElementById("create-name-input") as HTMLInputElement;
    public readonly creditInput = document.getElementById("create-credit-input") as HTMLInputElement;
    public readonly gradeContainer = document.getElementById("create-grade-selector") as HTMLElement;
    public readonly createIcon = document.getElementById("create-btn") as HTMLElement;

    private selGradeIcon: HTMLElement | null = null;

    public onlistcreate: ((newlist: SubjectDataForm) => void) | null = null;

    public constructor() {
        
        // singleton
        if (CreatePane.instance) {
            return CreatePane.instance;
        }
        else {
            CreatePane.instance = this;
        }

        // add event listeners to icon elements
        for (const gradeIcon of this.gradeContainer.children as HTMLCollectionOf<HTMLElement>) {
            gradeIcon.addEventListener("click", () => {
                if (this.selGradeIcon === gradeIcon) return;
    
                if (this.selGradeIcon) this.selGradeIcon.classList.remove("sel");
                gradeIcon.classList.add("sel");
    
                this.selGradeIcon = gradeIcon;
            });
        }

        this.idInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();

                this.nameInput.focus();
            }
        });

        this.nameInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();

                this.creditInput.focus();
            }
        });

        this.creditInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();

                this.createListFormat();
            }
        });

        this.createIcon.addEventListener("click", (e) => {
            e.stopPropagation();

            this.createListFormat();
        });

        // init icon by clicking first icon
        (this.gradeContainer.children[0] as HTMLElement).click();
    }

    public createListFormat(): SubjectDataForm | null {
        if (!this.validate()) return null;

        const form: SubjectDataForm = {
            id: this.idInput.value,
            name: this.nameInput.value,
            credit: this.creditInput.valueAsNumber,
            grade: this.getSelectedGrade()
        }

        this.reset();

        this.onlistcreate?.(form);

        return form;
    }

    private validate(): boolean {
        if (!this.idInput.value) {
            this.idInput.focus();
            new RippleEffect(0, 0, this.idInput.parentElement as HTMLElement, "error-ripple");
            return false;
        }
        if (!this.nameInput.value) {
            this.nameInput.focus();
            new RippleEffect(0, 0, this.nameInput.parentElement as HTMLElement, "error-ripple");
            return false;
        }
        if (!this.creditInput.value) {
            this.creditInput.focus();
            new RippleEffect(0, 0, this.creditInput.parentElement as HTMLElement, "error-ripple");
            return false;
        }

        return true;
    }

    private reset(): void {
        this.idInput.blur();
        this.nameInput.blur();
        this.creditInput.blur();

        this.idInput.value = "";
        this.nameInput.value = "";
        this.creditInput.value = "";
        this.selectGrade("F");
    }

    private getSelectedGrade(): Grade {
        return this.selGradeIcon?.textContent as Grade ?? "F";
    }

    private selectGrade(grade: Grade): void {
        for (const icon of this.gradeContainer.children as HTMLCollectionOf<HTMLElement>) {
            if (icon.textContent === grade) {
                icon.click();

                break;
            }
        }
    }
}

export class UpperControllerPane {

    public readonly semesterInput = document.getElementById("new-semester-input") as HTMLInputElement;
    public readonly createIcon = document.getElementById("new-semester-btn") as HTMLElement;

    public readonly semesterTabContainer = document.getElementById("semester-tab") as HTMLElement;

    private readonly tabs: HTMLElement[] = [];

    private selTab: HTMLElement | null = null;

    public onsheetcreate: ((sheet: SemesterSheet) => void) | null = null;
    public onsheetchange: ((semester: SemesterSheet) => void) | null = null;

    public constructor() {
        this.semesterInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();

                this.semesterInput.blur();

                this.createIcon.click();
            }
        });

        this.createIcon.addEventListener("click", this.create);
    }

    private create = () => {
        if (!this.validate()) return;
        
        const s = this.createSheet(this.semesterInput.value);

        this.semesterInput.value = "";
        
        this.onsheetcreate?.(s);
    }

    private validate(): boolean {
        if (!this.semesterInput.value) return false;
        
        return true;
    }

    public createSheet(semester: string): SemesterSheet {
        const t = document.createElement("aside");
        const s = new SemesterSheet(semester);
        t.textContent = semester;

        // add event listener
        t.addEventListener("click", () => {
            if (this.selTab === t) return;

            this.selTab?.classList.remove("sel");
            t.classList.add("sel");

            this.selTab = t;

            this.onsheetchange?.(s);
        });

        // select newly created element
        t.click();

        this.semesterTabContainer.append(t);

        return s;
    }
}

export class SummaryPane {

    private static instance: SummaryPane | null = null;

    public readonly cellA = [...document.getElementsByClassName("t-a")];
    public readonly cellB = [...document.getElementsByClassName("t-b")];
    public readonly cellC = [...document.getElementsByClassName("t-c")];

    public constructor() {
        
        // singleton
        if (SummaryPane.instance) {
            return SummaryPane.instance;
        }
        else {
            SummaryPane.instance = this;
        }
    }
}