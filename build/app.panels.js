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
        this.creditInput.addEventListener("input", () => {
            if (this.creditInput.value) {
                this.creditInput.value = this.creditInput.value[0];
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
        if (!this.idInput.value || this.idInput.value.length !== 6) {
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
        this.createIcon = document.getElementById("new-semester-btn");
        this.newSemesterIcon = [...document.getElementsByClassName("create-semester-icon")];
        this.semesterTabContainer = document.getElementById("semester-tab");
        this.runningYear = 2562;
        this.tabs = [];
        this.selTab = null;
        this.selIcon = null;
        this.onsheetcreate = null;
        this.onsheetchange = null;
        this.create = () => {
            var _a, _b, _c, _d, _e, _f;
            if (!this.validate())
                return;
            if (((_a = this.selIcon) === null || _a === void 0 ? void 0 : _a.textContent) === "1") {
                this.newSemesterIcon[0].classList.add("disabled");
                this.newSemesterIcon[1].classList.remove("disabled");
                this.newSemesterIcon[2].classList.add("disabled");
                this.runningYear++;
            }
            else if (((_b = this.selIcon) === null || _b === void 0 ? void 0 : _b.textContent) === "2") {
                this.newSemesterIcon[0].classList.remove("disabled");
                this.newSemesterIcon[1].classList.add("disabled");
                this.newSemesterIcon[2].classList.remove("disabled");
            }
            else {
                this.newSemesterIcon[0].classList.remove("disabled");
                this.newSemesterIcon[1].classList.add("disabled");
                this.newSemesterIcon[2].classList.add("disabled");
            }
            const s = this.createSheet(`${(_d = (_c = this.selIcon) === null || _c === void 0 ? void 0 : _c.textContent) !== null && _d !== void 0 ? _d : ""}/${this.runningYear}`);
            (_e = this.selIcon) === null || _e === void 0 ? void 0 : _e.classList.remove("sel");
            this.createIcon.classList.add("disabled");
            this.selIcon = null;
            (_f = this.onsheetcreate) === null || _f === void 0 ? void 0 : _f.call(this, s);
        };
        if (UpperControllerPane.instance) {
            return UpperControllerPane.instance;
        }
        else {
            UpperControllerPane.instance = this;
        }
        for (const icon of this.newSemesterIcon) {
            icon.addEventListener("click", () => {
                var _a;
                if (icon.classList.contains("disabled"))
                    return;
                (_a = this.selIcon) === null || _a === void 0 ? void 0 : _a.classList.remove("sel");
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
    validate() {
        return !!this.selIcon && this.newSemesterIcon.filter(v => v.classList.contains("sel")).length === 1;
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
UpperControllerPane.instance = null;
export class SummaryPane {
    constructor() {
        this.cellA = [...document.getElementsByClassName("t-a")];
        this.cellB = [...document.getElementsByClassName("t-b")];
        this.cellC = [...document.getElementsByClassName("t-c")];
        this.typeIcons = [...document.getElementsByClassName("subject-query-icon")];
        this.subjectDigitInput = document.getElementById("subject-query-input");
        this.selTypeIcon = null;
        this.onquery = null;
        if (SummaryPane.instance) {
            return SummaryPane.instance;
        }
        else {
            SummaryPane.instance = this;
        }
        for (const icon of this.typeIcons) {
            icon.addEventListener("click", () => {
                var _a;
                if (icon.classList.contains("disabled"))
                    return;
                if (this.selTypeIcon === icon)
                    return;
                (_a = this.selTypeIcon) === null || _a === void 0 ? void 0 : _a.classList.remove("sel");
                icon.classList.add("sel");
                this.selTypeIcon = icon;
                this.tryQuery();
            });
        }
        this.typeIcons[0].click();
        this.subjectDigitInput.addEventListener("input", () => {
            var _a;
            if (this.subjectDigitInput.value.length !== 3) {
                this.cellC[0].textContent = "N/A";
                this.cellC[1].textContent = "N/A";
                return;
            }
            (_a = this.onquery) === null || _a === void 0 ? void 0 : _a.call(this, this.subjectDigitInput.value, this.queryType);
        });
    }
    get queryType() {
        var _a;
        return ((_a = this.selTypeIcon) === null || _a === void 0 ? void 0 : _a.textContent) === "*" ? "all" : "current";
    }
    popErrorRippleEffect() {
        new RippleEffect(0, 0, this.subjectDigitInput.parentElement, "error-ripple");
    }
    popPassedRippleEffect() {
        new RippleEffect(0, 0, this.subjectDigitInput.parentElement, "passed-ripple");
    }
    tryQuery() {
        var _a;
        if (this.subjectDigitInput.value.length === 3) {
            (_a = this.onquery) === null || _a === void 0 ? void 0 : _a.call(this, this.subjectDigitInput.value, this.queryType);
        }
    }
}
SummaryPane.instance = null;
