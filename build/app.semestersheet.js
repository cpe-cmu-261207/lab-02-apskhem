import { VirtualDOM } from "./app.implement.js";
import { SubjectList } from "./app.subjectlist.js";
export class SemesterSheet extends VirtualDOM {
    constructor(semester) {
        super();
        this.subjectList = [];
        this.selList = null;
        this.onlistdelete = null;
        this.semester = semester;
    }
    [Symbol.iterator]() {
        let i = 0;
        return {
            next: () => ({
                value: this.subjectList[i++],
                done: i > this.subjectList.length
            })
        };
    }
    get listCount() {
        return this.subjectList.length;
    }
    get totalCredit() {
        let credit = 0;
        for (const list of this) {
            credit += list.credit;
        }
        return credit;
    }
    get gpa() {
        let credit = 0;
        let creditSum = 0;
        for (const list of this) {
            credit += list.credit;
            creditSum += list.credit * list.gradeAsNumber;
        }
        return credit ? creditSum / credit : 0;
    }
    get gradeCount() {
        const g = {
            "A": 0,
            "B+": 0,
            "B": 0,
            "C+": 0,
            "C": 0,
            "D+": 0,
            "D": 0,
            "F": 0,
        };
        for (const list of this) {
            g[list.grade]++;
        }
        return g;
    }
    createList(id, name, credit, grade) {
        const s = new SubjectList(id, name, credit, grade);
        this.subjectList.push(s);
        s.onselect = () => {
            var _a;
            (_a = this.selList) === null || _a === void 0 ? void 0 : _a.el.classList.remove("sel");
            s.el.classList.add("sel");
            this.selList = s;
        };
        s.ondelete = () => {
            var _a;
            const i = this.subjectList.indexOf(s);
            this.subjectList.splice(i, 1);
            s.el.remove();
            this.reorder();
            (_a = this.onlistdelete) === null || _a === void 0 ? void 0 : _a.call(this, s);
        };
        s.order = this.subjectList.length;
        return s;
    }
    deselect() {
        var _a;
        (_a = this.selList) === null || _a === void 0 ? void 0 : _a.el.classList.remove("sel");
        this.selList = null;
    }
    forEach(callbackFn) {
        this.subjectList.forEach(callbackFn);
    }
    moveSelectionUp() {
        if (!this.selList)
            return;
        const index = this.subjectList.indexOf(this.selList);
        if (index > 0) {
            const temp = this.subjectList.splice(index, 1)[0];
            this.subjectList.splice(index - 1, 0, temp);
            this.reorder();
        }
    }
    moveSelectionDown() {
        if (!this.selList)
            return;
        const index = this.subjectList.indexOf(this.selList);
        if (index <= this.subjectList.length) {
            const temp = this.subjectList.splice(index, 1)[0];
            this.subjectList.splice(index + 1, 0, temp);
            this.reorder();
        }
    }
    reorder() {
        this.forEach((list, i) => list.order = i + 1);
    }
}
