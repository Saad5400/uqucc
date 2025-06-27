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

    const weeks = 10;            // عدد أسابيع المقرر
    const maxUnexcRate = 0.15;   // %15 حد الغياب بدون عذر
    const maxAbsRate = 0.25;     // %25 حد الغياب الكلي

    const [lecsPerWk, setLecsPerWk] = useState<string>('2');
    const [unexcCnt, setUnexcCnt] = useState<string>('0'); // ساعات غياب بدون عذر
    const [excCnt, setExcCnt] = useState<string>('0'); // ساعات غياب بعذر

    /** وزن كل محاضرة كنسبة مئوية من إجمالي الساعات */
    const lecWeight = useMemo(() => {
        const weight = (1 * 100) / (weeks * parseInt(lecsPerWk));
        return Math.round(weight * 100) / 100;  // دقة منزلتين
    }, [weeks, lecsPerWk]);

    /** إجمالي عدد الساعات في الفصل */
    const totalHours = useMemo(() => weeks * parseInt(lecsPerWk), [weeks, lecsPerWk]);

    /** الساعات المتبقية قبل تجاوز 15% غياب بدون عذر */
    const unexcLeft = useMemo(() => {
        const total = parseInt(unexcCnt) + parseInt(excCnt);
        const maxUnexcHours = Math.floor(totalHours * maxUnexcRate);
        const maxAbsHours = Math.floor(totalHours * maxAbsRate);

        // 1) by the unexcused‐only cap
        const byUnexcRule = maxUnexcHours - parseInt(unexcCnt);
        // 2) by the overall cap (subtract what you've already used)
        const byTotalRule = maxAbsHours - total;

        // you can only take the stricter of the two
        return Math.min(byUnexcRule, byTotalRule);
    }, [totalHours, maxUnexcRate, maxAbsRate, unexcCnt, excCnt]);

    /** الساعات المتبقية قبل تجاوز 25% غياب كلي */
    const absLeft = useMemo(() => {
        const absCnt = parseInt(unexcCnt) + parseInt(excCnt);
        const maxAbsHours = Math.floor(totalHours * maxAbsRate);
        return maxAbsHours - absCnt;             // قد تكون سالبة إن تجاوز الحد
    }, [totalHours, maxAbsRate, unexcCnt, excCnt]);

    function formatLecturesPerWeek(lecturesPerWeek) {
        switch (lecturesPerWeek) {
            case '1':
                return "محاضرة فردية";
            case '2':
                return "محاضرة زوجية";
            case '3':
                return "محاضرة زوجية ومحاضرة فردية";
            case '4':
                return "محاضرتين زوجية";
            default:
                return "";
        }
    }

    function formatHours(hours) {
        if (!hours && hours !== 0) {
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
                        value={lecsPerWk}
                        onChange={(e) => setLecsPerWk(e.target.value ?? '')}
                        min={1}
                        max={4}
                    />
                    <span className="absolute top-1/2 end-8 transform -translate-y-1/2 text-muted-foreground pointer-events-none max-w-32 sm:max-w-none">
                        {formatLecturesPerWeek(lecsPerWk)}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <Label htmlFor="currentNoExcusedAbsences">ساعات الغياب الحالية بدون عذر:</Label>
                <Input
                    id="currentNoExcusedAbsences"
                    type="number"
                    value={unexcCnt}
                    onChange={(e) => setUnexcCnt(e.target.value ?? '')}
                />
            </div>
            <div className="grid grid-cols-2">
                <Label htmlFor="currentExcusedAbsences">ساعات الغياب الحالية بعذر:</Label>
                <Input
                    id="currentExcusedAbsences"
                    type="number"
                    value={excCnt}
                    onChange={(e) => setExcCnt(e.target.value ?? '')}
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>نسبة الغياب للساعة الواحدة</CardTitle>
                    </CardHeader>
                    <CardContent className='text-2xl font-bold text-end'>
                        {lecWeight ? `${lecWeight}%` : ''}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>تقدر تغيب بدون عذر</CardTitle>
                    </CardHeader>
                    <CardContent className='text-2xl font-bold text-end'>
                        {formatHours(unexcLeft)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>تقدر تغيب بعذر</CardTitle>
                    </CardHeader>
                    <CardContent className='text-2xl font-bold text-end'>
                        {formatHours(absLeft)}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
