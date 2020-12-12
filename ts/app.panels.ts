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

        this.creditInput.addEventListener("input", () => {
            // force it to be one digit input
            if (this.creditInput.value) {
                this.creditInput.value = this.creditInput.value[0];
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
        if (!this.idInput.value || this.idInput.value.length !== 6) {
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

    public static instance: UpperControllerPane | null = null;

    public readonly createIcon = document.getElementById("new-semester-btn") as HTMLElement;
    public readonly newSemesterIcon = [...document.getElementsByClassName("create-semester-icon")] as HTMLElement[];
    public readonly semesterTabContainer = document.getElementById("semester-tab") as HTMLElement;

    private runningYear = 2562;

    private readonly tabs: HTMLElement[] = [];

    private selTab: HTMLElement | null = null;
    private selIcon: HTMLElement | null = null;

    public onsheetcreate: ((sheet: SemesterSheet) => void) | null = null;
    public onsheetchange: ((semester: SemesterSheet) => void) | null = null;

    public constructor() {

        // singleton
        if (UpperControllerPane.instance) {
            return UpperControllerPane.instance;
        }
        else {
            UpperControllerPane.instance = this;
        }

        // init icons event handler
        for (const icon of this.newSemesterIcon) {
            icon.addEventListener("click", () => {
                if (icon.classList.contains("disabled")) return;

                this.selIcon?.classList.remove("sel");

                if (this.selIcon === icon) {
                    this.selIcon = null;
                    this.createIcon.classList.add("disabled");
                    return;
                }

                icon.classList.add("sel");
                this.createIcon.classList.remove("disabled");

                this.selIcon = icon;
            });
        }

        this.createIcon.addEventListener("click", this.create);
    }

    private create = () => {
        if (!this.validate()) return;        

        if (this.selIcon?.textContent === "1") {
            this.newSemesterIcon[0].classList.add("disabled");
            this.newSemesterIcon[1].classList.remove("disabled");
            this.newSemesterIcon[2].classList.add("disabled");
            this.runningYear++;
            
        }
        else if (this.selIcon?.textContent === "2") {
            this.newSemesterIcon[0].classList.remove("disabled");
            this.newSemesterIcon[1].classList.add("disabled");
            this.newSemesterIcon[2].classList.remove("disabled");
        }
        else {
            this.newSemesterIcon[0].classList.remove("disabled");
            this.newSemesterIcon[1].classList.add("disabled");
            this.newSemesterIcon[2].classList.add("disabled");
        }

        const s = this.createSheet(`${this.selIcon?.textContent ?? ""}/${this.runningYear}`);

        this.selIcon?.classList.remove("sel");
        this.createIcon.classList.add("disabled");
        this.selIcon = null;
        
        this.onsheetcreate?.(s);
    }

    private validate(): boolean {
        return !!this.selIcon && this.newSemesterIcon.filter(v => v.classList.contains("sel")).length === 1;
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
    
    public readonly typeIcons = [...document.getElementsByClassName("subject-query-icon")] as HTMLElement[];
    public readonly subjectDigitInput = document.getElementById("subject-query-input") as HTMLInputElement;

    private selTypeIcon: HTMLElement | null = null;

    public onquery: ((digit: string, type: "all" | "current") => void) | null = null;

    public constructor() {
        
        // singleton
        if (SummaryPane.instance) {
            return SummaryPane.instance;
        }
        else {
            SummaryPane.instance = this;
        }

        // init icons event handler
        for (const icon of this.typeIcons) {
            icon.addEventListener("click", () => {
                if (icon.classList.contains("disabled")) return;
                if (this.selTypeIcon === icon) return;

                this.selTypeIcon?.classList.remove("sel");
                icon.classList.add("sel");

                this.selTypeIcon = icon;

                // also stimulate event
                this.tryQuery();
            });
        }

        // click first type icon
        this.typeIcons[0].click();

        // init subject query input
        this.subjectDigitInput.addEventListener("input", () => {
            if (this.subjectDigitInput.value.length !== 3) {
                this.cellC[0].textContent = "N/A";
                this.cellC[1].textContent = "N/A";

                return;
            }

            this.onquery?.(this.subjectDigitInput.value, this.queryType);
        });
    }

    public get queryType(): "all" | "current" {
        return this.selTypeIcon?.textContent === "*" ? "all" : "current";
    }

    public popErrorRippleEffect(): void {
        new RippleEffect(0, 0, this.subjectDigitInput.parentElement as HTMLElement, "error-ripple");
    }

    public popPassedRippleEffect(): void {
        new RippleEffect(0, 0, this.subjectDigitInput.parentElement as HTMLElement, "passed-ripple")
    }

    public tryQuery(): void {
        if (this.subjectDigitInput.value.length === 3) {
            this.onquery?.(this.subjectDigitInput.value, this.queryType);
        }
    }
}