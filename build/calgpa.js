import { CreatePane, SummaryPane, UpperControllerPane } from "./app.panels.js";
class CalGpaApp {
    static main(...args) {
        var _a;
        const dummySheet = this.upperPane.createSheet("1/2562");
        dummySheet.onlistdelete = () => {
            this.updateSummary();
        };
        this.sheets.push(dummySheet);
        dummySheet.createList("261207", "Basic Comp. Lab", 3, "A");
        dummySheet.createList("261218", "Algorithm", 3, "C+");
        this.setCurrentSheet(dummySheet);
        for (const list of (_a = this.selSheet) !== null && _a !== void 0 ? _a : []) {
            list.appendTo(this.listContainer);
        }
        this.updateSummary();
        this.upperPane.onsheetcreate = (sheet) => {
            this.sheets.push(sheet);
            sheet.onlistdelete = () => {
                this.updateSummary();
            };
            this.setCurrentSheet(sheet);
        };
        this.upperPane.onsheetchange = (sheet) => {
            this.clearListContainer();
            for (const list of sheet) {
                list.appendTo(this.listContainer);
            }
            this.setCurrentSheet(sheet);
            this.updateSummary();
        };
        this.createPane.onlistcreate = (form) => {
            var _a;
            const { id, name, credit, grade } = form;
            const list = (_a = this.selSheet) === null || _a === void 0 ? void 0 : _a.createList(id, name, credit, grade);
            list === null || list === void 0 ? void 0 : list.appendTo(this.listContainer);
            this.updateSummary();
        };
        this.summaryPane.onquery = (value, type) => {
            const dlist = [];
            for (const sheet of type === "all" ? this.sheets : this.selSheet ? [this.selSheet] : []) {
                for (const list of sheet) {
                    if (list.subjectId.slice(0, 3) === value) {
                        dlist.push(list);
                    }
                }
            }
            if (dlist.length) {
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
        };
    }
    static setCurrentSheet(sheet) {
        this.selSheet = sheet;
    }
    static updateSummary() {
        if (!this.selSheet)
            return;
        if (!this.selSheet.listCount) {
            this.listContainer.append(this.emptyText);
        }
        else {
            this.emptyText.remove();
        }
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
                semesterGradeCount[key] += d[key];
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
    static clearListContainer() {
        if (!this.selSheet)
            return;
        for (const list of this.selSheet) {
            list.el.remove();
        }
    }
}
CalGpaApp.listContainer = document.getElementById("subject-list-container");
CalGpaApp.emptyText = document.getElementById("empty-list");
CalGpaApp.createPane = new CreatePane();
CalGpaApp.summaryPane = new SummaryPane();
CalGpaApp.upperPane = new UpperControllerPane();
CalGpaApp.sheets = [];
CalGpaApp.selSheet = null;
window.onload = () => {
    CalGpaApp.main();
    window.onload = null;
};
