import { useMemo, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"

export default function AbsenceCalculator() {

    const weeksCount = 10;
    const noExcusedAbsencePercentage = 0.15;
    const excusedAbsencePercentage = 0.25;

    const [lecturesPerWeek, setLecturesPerWeek] = useState(2);
    const [currentNoExcusedAbsences, setCurrentNoExcusedAbsences] = useState(0);
    const [currentExcusedAbsences, setCurrentExcusedAbsences] = useState(0);

    const singleLecturePercentage = useMemo(() => Math.round(((1 * 100) / (weeksCount * lecturesPerWeek)) * 100) / 100, [weeksCount, lecturesPerWeek]);
    const maxNoExcusedAbsences = useMemo(() => Math.floor(((weeksCount * lecturesPerWeek * noExcusedAbsencePercentage) - currentNoExcusedAbsences)), [weeksCount, lecturesPerWeek, noExcusedAbsencePercentage, currentNoExcusedAbsences]);
    const maxExcusedAbsences = useMemo(() => Math.floor(((weeksCount * lecturesPerWeek * excusedAbsencePercentage) - currentExcusedAbsences)), [weeksCount, lecturesPerWeek, excusedAbsencePercentage, currentExcusedAbsences]);

    function formatLecturesPerWeek(lecturesPerWeek) {
        switch (lecturesPerWeek) {
            case 1:
                return "محاضرة فردية";
            case 2:
                return "محاضرة زوجية";
            case 3:
                return "محاضرة زوجية ومحاضرة فردية";
            case 4:
                return "محاضرتين زوجية";
            default:
                return "";
        }
    }

    function formatMaxNoExcusedAbsences(maxNoExcusedAbsences) {
        switch (lecturesPerWeek) {
            case 1:
                if (maxNoExcusedAbsences <= 0) {
                    return "لا يمكنك الغياب بدون عذر";
                }
                else if (maxNoExcusedAbsences === 1) {
                    return "محاضرة واحدة";
                } else {
                    return `${maxNoExcusedAbsences} محاضرات`;
                }
            case 2:
                if (maxNoExcusedAbsences <= 1) {
                    return "لا يمكنك الغياب بدون عذر";
                }
                else if (maxNoExcusedAbsences <= 3) {
                    return "محاضرة واحدة";
                }
        }
    }

    function formatHours(hours) {
        if (!hours) {
            return "";
        }
        else if (hours <= 0) {
            return "لا يمكنك الغياب";
        } else if (hours === 1) {
            return "ساعة واحدة";
        } else if (hours === 2) {
            return "ساعتين";
        } else {
            return `${hours} ساعات`;
        }
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2">
                <Label htmlFor="lecturesPerWeek">عدد الساعات في الأسبوع:</Label>
                <div className="relative">
                    <Input
                        id="lecturesPerWeek"
                        type="number"
                        value={lecturesPerWeek}
                        onChange={(e) => setLecturesPerWeek(e.target.value ? Number(e.target.value) : undefined)}
                        min={1}
                        max={4}
                    />
                    <span className="absolute top-1/2 end-8 transform -translate-y-1/2 text-muted-foreground pointer-events-none max-w-32 sm:max-w-none">
                        {formatLecturesPerWeek(lecturesPerWeek)}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <Label htmlFor="currentNoExcusedAbsences">ساعات الغياب الحالية بدون عذر:</Label>
                <Input
                    id="currentNoExcusedAbsences"
                    type="number"
                    value={currentNoExcusedAbsences}
                    onChange={(e) => setCurrentNoExcusedAbsences(e.target.value ? Number(e.target.value) : undefined)}
                />
            </div>
            <div className="grid grid-cols-2">
                <Label htmlFor="currentExcusedAbsences">ساعات الغياب الحالية بعذر:</Label>
                <Input
                    id="currentExcusedAbsences"
                    type="number"
                    value={currentExcusedAbsences}
                    onChange={(e) => setCurrentExcusedAbsences(e.target.value ? Number(e.target.value) : undefined)}
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>نسبة الغياب للساعة الواحدة</CardTitle>
                    </CardHeader>
                    <CardContent className='text-2xl font-bold text-end'>
                        {singleLecturePercentage ? `${singleLecturePercentage}%` : ''}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>تقدر تغيب بدون عذر</CardTitle>
                    </CardHeader>
                    <CardContent className='text-2xl font-bold text-end'>
                        {formatHours(maxNoExcusedAbsences)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>تقدر تغيب بعذر</CardTitle>
                    </CardHeader>
                    <CardContent className='text-2xl font-bold text-end'>
                        {formatHours(maxExcusedAbsences)}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
