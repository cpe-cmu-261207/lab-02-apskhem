type Grade = "F" | "D" | "D+" | "C" | "C+" | "B" | "B+" | "A";

interface GradeListCount {
    "A": number,
    "B+": number,
    "B": number,
    "C+": number,
    "C": number,
    "D+": number,
    "D": number,
    "F": number,
}

interface SubjectDataForm {
    id: string;
    name: string;
    credit: number;
    grade: Grade;
}