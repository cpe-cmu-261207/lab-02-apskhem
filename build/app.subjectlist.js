import { RippleEffect } from "./app.effects.js";
import { VirtualDOM } from "./app.implement.js";
export class SubjectList extends VirtualDOM {
    constructor(id, name, credit, grade) {
        super();
        this.aside1 = document.createElement("aside");
        this.aside2 = document.createElement("aside");
        this.aside3 = document.createElement("aside");
        this.aside4 = document.createElement("aside");
        this.aside5 = document.createElement("aside");
        this.aside6 = document.createElement("aside");
        this.numberSpan = document.createElement("span");
        this.gradeIcon = document.createElement("div");
        this.deleteIcon = document.createElement("i");
        this.ondelete = null;
        this.onselect = null;
        this.delete = (e) => {
            var _a;
            e.stopPropagation();
            (_a = this.ondelete) === null || _a === void 0 ? void 0 : _a.call(this, this);
        };
        this.select = (e) => {
            var _a;
            e.stopPropagation();
            new RippleEffect(e.offsetX, e.offsetY, this.el);
            (_a = this.onselect) === null || _a === void 0 ? void 0 : _a.call(this, this);
        };
        this.subjectId = id;
        this.subjectName = name;
        this.credit = credit;
        this.grade = grade;
        this.el.classList.add("subject-list");
        this.aside5.classList.add("grade-icon-container", "flex-center");
        this.aside6.classList.add("flex-center");
        this.deleteIcon.classList.add("fas", "fa-times");
        this.aside1.append(this.numberSpan);
        this.aside5.append(this.gradeIcon);
        this.aside6.append(this.deleteIcon);
        this.el.append(this.aside1, this.aside2, this.aside3, this.aside4, this.aside5, this.aside6);
        this.deleteIcon.addEventListener("click", this.delete);
        this.el.addEventListener("click", this.select);
    }
    get order() {
        var _a;
        return parseInt((_a = this.numberSpan.textContent) !== null && _a !== void 0 ? _a : "");
    }
    set order(value) {
        this.numberSpan.textContent = `${value}.`;
    }
    get subjectId() {
        var _a;
        return (_a = this.aside2.textContent) !== null && _a !== void 0 ? _a : "";
    }
    set subjectId(value) {
        this.aside2.textContent = value;
    }
    get subjectName() {
        var _a;
        return (_a = this.aside3.textContent) !== null && _a !== void 0 ? _a : "";
    }
    set subjectName(value) {
        this.aside3.textContent = value;
    }
    get credit() {
        var _a;
        return +((_a = this.aside4.textContent) !== null && _a !== void 0 ? _a : 0);
    }
    set credit(value) {
        this.aside4.textContent = `${value}`;
    }
    get grade() {
        return this.gradeIcon.textContent;
    }
    set grade(value) {
        const iconName = value.toLowerCase().replace("+", "p") + "-icon";
        this.gradeIcon.className = "";
        this.gradeIcon.classList.add(iconName);
        this.gradeIcon.textContent = value;
    }
    get gradeAsNumber() {
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
}
