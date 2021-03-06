import { VirtualDOM } from "./app.implement.js";
import { SubjectList } from "./app.subjectlist.js";

export class SemesterSheet extends VirtualDOM implements Iterable<SubjectList> {

    private readonly subjectList: SubjectList[] = [];

    public readonly semester: string;

    private selList: SubjectList | null = null;

    public onlistdelete: ((deletedList: SubjectList) => void) | null = null;

    public constructor(semester: string) {
        super();

        this.semester = semester;
    }

    [Symbol.iterator]() {
        let i = 0;
        return {
            next: () => ({
                value: this.subjectList[i++],
                done: i > this.subjectList.length
            })
        }
    }

    public get listCount(): number {
        return this.subjectList.length;
    }

    public get totalCredit(): number {
        let credit = 0;

        for (const list of this) {
            credit += list.credit;
        }

        return credit;
    }

    public get gpa(): number {
        let credit = 0;
        let creditSum = 0;

        for (const list of this) {
            credit += list.credit;
            creditSum += list.credit * list.gradeAsNumber;
        }

        return credit ? creditSum / credit : 0;
    }

    public get gradeCount(): GradeListCount {
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

    public createList(id: string, name: string, credit: number, grade: Grade): SubjectList {
        const s = new SubjectList(id, name, credit, grade);

        this.subjectList.push(s);

        // mount event listener
        s.onselect = () => {
            this.selList?.el.classList.remove("sel");
            s.el.classList.add("sel");

            this.selList = s;
        }

        s.ondelete = () => {
            const i = this.subjectList.indexOf(s);

            this.subjectList.splice(i, 1);

            s.el.remove();

            this.reorder();

            this.onlistdelete?.(s);
        }

        // set list order
        s.order = this.subjectList.length;

        return s;
    }

    public deselect(): void {
        this.selList?.el.classList.remove("sel");
        this.selList = null;
    }

    public forEach(callbackFn: (value: SubjectList, index: number, array: SubjectList[]) => void): void {
        this.subjectList.forEach(callbackFn);
    }

    public moveSelectionUp(): void {
        if (!this.selList) return;

        const index = this.subjectList.indexOf(this.selList);

        if (index > 0) {
            const temp = this.subjectList.splice(index, 1)[0];
            this.subjectList.splice(index - 1, 0, temp);

            this.reorder();
        }
    }

    public moveSelectionDown(): void {
        if (!this.selList) return;

        const index = this.subjectList.indexOf(this.selList);

        if (index <= this.subjectList.length) {
            const temp = this.subjectList.splice(index, 1)[0];
            this.subjectList.splice(index + 1, 0, temp);

            this.reorder();
        }
    }

    private reorder(): void {
        this.forEach((list, i) => list.order = i + 1);
    }
}