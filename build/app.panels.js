import { RippleEffect } from "./app.effects.js";
import { SemesterSheet } from "./app.semestersheet.js";
export class CreatePane {
    constructor() {
        this.idInput = document.getElementById("create-id-input");
        this.nameInput = document.getElementById("create-name-input");
        this.creditInput = document.getElementById("create-credit-input");
        this.gradeContainer = document.getElementById("create-grade-selector");
        this.createIcon = document.getElementById("create-btn");
        this.selGradeIcon = null;
        this.onlistcreate = null;
        if (CreatePane.instance) {
            return CreatePane.instance;
        }
        else {
            CreatePane.instance = this;
        }
        for (const gradeIcon of this.gradeContainer.children) {
            gradeIcon.addEventListener("click", () => {
                if (this.selGradeIcon === gradeIcon)
                    return;
                if (this.selGradeIcon)
                    this.selGradeIcon.classList.remove("sel");
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
        this.gradeContainer.children[0].click();
    }
    createListFormat() {
        var _a;
        if (!this.validate())
            return null;
        const form = {
            id: this.idInput.value,
            name: this.nameInput.value,
            credit: this.creditInput.valueAsNumber,
            grade: this.getSelectedGrade()
        };
        this.reset();
        (_a = this.onlistcreate) === null || _a === void 0 ? void 0 : _a.call(this, form);
        return form;
    }
    validate() {
        if (!this.idInput.value) {
            this.idInput.focus();
            new RippleEffect(0, 0, this.idInput.parentElement, "error-ripple");
            return false;
        }
        if (!this.nameInput.value) {
            this.nameInput.focus();
            new RippleEffect(0, 0, this.nameInput.parentElement, "error-ripple");
            return false;
        }
        if (!this.creditInput.value) {
            this.creditInput.focus();
            new RippleEffect(0, 0, this.creditInput.parentElement, "error-ripple");
            return false;
        }
        return true;
    }
    reset() {
        this.idInput.blur();
        this.nameInput.blur();
        this.creditInput.blur();
        this.idInput.value = "";
        this.nameInput.value = "";
        this.creditInput.value = "";
        this.selectGrade("F");
    }
    getSelectedGrade() {
        var _a, _b;
        return (_b = (_a = this.selGradeIcon) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : "F";
    }
    selectGrade(grade) {
        for (const icon of this.gradeContainer.children) {
            if (icon.textContent === grade) {
                icon.click();
                break;
            }
        }
    }
}
CreatePane.instance = null;
export class UpperControllerPane {
    constructor() {
        this.semesterInput = document.getElementById("new-semester-input");
        this.createIcon = document.getElementById("new-semester-btn");
        this.semesterTabContainer = document.getElementById("semester-tab");
        this.tabs = [];
        this.selTab = null;
        this.onsheetcreate = null;
        this.onsheetchange = null;
        this.create = () => {
            var _a;
            if (!this.validate())
                return;
            const s = this.createSheet(this.semesterInput.value);
            this.semesterInput.value = "";
            (_a = this.onsheetcreate) === null || _a === void 0 ? void 0 : _a.call(this, s);
        };
        this.semesterInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.semesterInput.blur();
                this.createIcon.click();
            }
        });
        this.createIcon.addEventListener("click", this.create);
    }
    validate() {
        if (!this.semesterInput.value)
            return false;
        return true;
    }
    createSheet(semester) {
        const t = document.createElement("aside");
        const s = new SemesterSheet(semester);
        t.textContent = semester;
        t.addEventListener("click", () => {
            var _a, _b;
            if (this.selTab === t)
                return;
            (_a = this.selTab) === null || _a === void 0 ? void 0 : _a.classList.remove("sel");
            t.classList.add("sel");
            this.selTab = t;
            (_b = this.onsheetchange) === null || _b === void 0 ? void 0 : _b.call(this, s);
        });
        t.click();
        this.semesterTabContainer.append(t);
        return s;
    }
}
export class SummaryPane {
    constructor() {
        this.cellA = [...document.getElementsByClassName("t-a")];
        this.cellB = [...document.getElementsByClassName("t-b")];
        this.cellC = [...document.getElementsByClassName("t-c")];
        if (SummaryPane.instance) {
            return SummaryPane.instance;
        }
        else {
            SummaryPane.instance = this;
        }
    }
}
SummaryPane.instance = null;
