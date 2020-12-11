import { CreatePane, SummaryPane, UpperControllerPane } from "./app.panels.js";
import { SemesterSheet } from "./app.semestersheet.js";

class CalGpaApp {

    public static readonly listContainer = document.getElementById("subject-list-container") as HTMLElement;
    public static readonly emptyText = document.getElementById("empty-list") as HTMLElement;

    public static readonly createPane = new CreatePane();
    public static readonly summaryPane = new SummaryPane();
    public static readonly upperPane = new UpperControllerPane();

    public static sheets: SemesterSheet[] = [];
    public static selSheet: SemesterSheet | null = null;

    public static main(...args: Object[]): void {

        // dummy initialization
        const dummySheet = this.upperPane.createSheet("1/2562");

        dummySheet.onlistdelete = () => {
            this.updateSummary();
        }

        this.sheets.push(dummySheet);

        dummySheet.createList("261207", "Basic Comp. Lab", 3, "A");
        dummySheet.createList("261218", "Algorithm", 3, "C+");

        this.setCurrentSheet(dummySheet);

        for (const list of this.selSheet ?? []) {
            list.appendTo(this.listContainer);
        }

        this.updateSummary();

        // new sheet event handler
        this.upperPane.onsheetcreate = (sheet) => {
            this.sheets.push(sheet);

            sheet.onlistdelete = () => {
                this.updateSummary();
            }

            this.setCurrentSheet(sheet);
        }

        // sheet tab change event handler
        this.upperPane.onsheetchange = (sheet) => {
            this.clearListContainer();

            for (const list of sheet) {
                list.appendTo(this.listContainer);
            }

            this.setCurrentSheet(sheet);

            this.updateSummary();
        }

        // new list event handler
        this.createPane.onlistcreate = (form) => {
            const { id, name, credit, grade } = form;

            const list = this.selSheet?.createList(id, name, credit, grade);

            list?.appendTo(this.listContainer);

            this.updateSummary();
        }

        // subject filter query event handler
        this.summaryPane.onquery = (value, type) => {
            const dlist = [];

            // get all matched data
            for (const sheet of type === "all" ? this.sheets : this.selSheet ? [this.selSheet] : []) {
                for (const list of sheet) {
                    if (list.subjectId.slice(0, 3) === value) {
                        dlist.push(list);
                    }
                }
            }

            // evaluate
            if (dlist.length) {

                // sum list
                let weight = 0;
                let sumWeight = 0;
                for (const list of dlist) {
                    weight += list.credit;
                    sumWeight += list.credit * list.gradeAsNumber;
                }

                this.summaryPane.cellC[0].textContent = `${weight}`;
                this.summaryPane.cellC[1].textContent = `${weight ? sumWeight / weight : 0}`;

                this.summaryPane.popPassedRippleEffect();
            }
            else {
                this.summaryPane.cellC[0].textContent = "N/A";
                this.summaryPane.cellC[1].textContent = "N/A";

                this.summaryPane.popErrorRippleEffect();
            }
        }
    }

    public static setCurrentSheet(sheet: SemesterSheet): void {
        this.selSheet = sheet;
    }

    public static updateSummary(): void {
        // display empty list
        if (!this.selSheet) return;

        if (!this.selSheet.listCount) {
            this.listContainer.append(this.emptyText);
        }
        else {
            this.emptyText.remove();
        }

        // calculate summary
        let semesterWeight = 0;
        let semesterWeightSum = 0;
        const semesterGradeCount = {
            "A": 0,
            "B+": 0,
            "B": 0,
            "C+": 0,
            "C": 0,
            "D+": 0,
            "D": 0,
            "F": 0,
        };

        for (const sheet of this.sheets) {
            semesterWeight += sheet.totalCredit;
            semesterWeightSum += sheet.gpa * sheet.totalCredit;

            const d = sheet.gradeCount;
            for (const key in semesterGradeCount) {
                semesterGradeCount[key as keyof GradeListCount] += d[key as keyof GradeListCount];
            }
        }

        this.summaryPane.cellA[0].textContent = `${this.selSheet.totalCredit}`;
        this.summaryPane.cellA[1].textContent = `${semesterWeight}`;
        this.summaryPane.cellA[2].textContent = `${this.selSheet.gpa.toFixed(2)}`;
        this.summaryPane.cellA[3].textContent = `${semesterWeight ? (semesterWeightSum / semesterWeight).toFixed(2) : 0}`;

        const selGradeCount = this.selSheet.gradeCount;
        this.summaryPane.cellB[0].textContent = `${selGradeCount["F"]}`;
        this.summaryPane.cellB[1].textContent = `${selGradeCount["D"]}`;
        this.summaryPane.cellB[2].textContent = `${selGradeCount["D+"]}`;
        this.summaryPane.cellB[3].textContent = `${selGradeCount["C"]}`;
        this.summaryPane.cellB[4].textContent = `${selGradeCount["C+"]}`;
        this.summaryPane.cellB[5].textContent = `${selGradeCount["B"]}`;
        this.summaryPane.cellB[6].textContent = `${selGradeCount["B+"]}`;
        this.summaryPane.cellB[7].textContent = `${selGradeCount["A"]}`;

        this.summaryPane.cellB[8].textContent = `${semesterGradeCount["F"]}`;
        this.summaryPane.cellB[9].textContent = `${semesterGradeCount["D"]}`;
        this.summaryPane.cellB[10].textContent = `${semesterGradeCount["D+"]}`;
        this.summaryPane.cellB[11].textContent = `${semesterGradeCount["C"]}`;
        this.summaryPane.cellB[12].textContent = `${semesterGradeCount["C+"]}`;
        this.summaryPane.cellB[13].textContent = `${semesterGradeCount["B"]}`;
        this.summaryPane.cellB[14].textContent = `${semesterGradeCount["B+"]}`;
        this.summaryPane.cellB[15].textContent = `${semesterGradeCount["A"]}`;

        this.summaryPane.tryQuery();
    }

    public static clearListContainer(): void {
        if (!this.selSheet) return;

        for (const list of this.selSheet) {
            list.el.remove();
        }
    }
}

window.onload = () => {
    CalGpaApp.main();

    window.onload = null;
};