import React, { useState, useEffect, useMemo } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"
import { Plus, FileDown, FileUp, Trash } from 'lucide-react';

// Convert Arabic-Indic digits and separators to a JS number
const parseArabicNumber = (text = '') =>
    parseFloat(
        text
            .trim()
            .replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit) + '')
            .replace(/[٫،,]/g, '.')
    ) || 0;

const gradeValues: Record<string, number> = {
    'A+': 4,
    A: 3.75,
    'B+': 3.5,
    B: 3,
    'C+': 2.5,
    C: 2,
    'D+': 1.5,
    D: 1,
    F: 0,
};

export default function GPACalculator() {
    // Load courses and ensure each has a stable random id
    const [courses, setCourses] = useState(() => {
        if (typeof window === 'undefined') return [];

        const stored = JSON.parse(localStorage.getItem('courses') || '[]');
        return stored.map((course: any) => ({
            id: nanoid(),
            name: course.name || '',
            credits: course.credits || '',
            grade: course.grade
                ? { value: course.grade.value, label: course.grade.value }
                : undefined,
        }));
    });

    // Persist courses (excluding id) to localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const toStore = courses.map(({ id, ...rest }) => rest);
        localStorage.setItem('courses', JSON.stringify(toStore));
    }, [courses]);

    const [listContainer] = useAutoAnimate();
    const [statsContainer] = useAutoAnimate();

    const { gpa, approximateGpa, totalCredits, totalPoints } = useMemo(() => {
        const { creditsSum, pointsSum } = courses.reduce(
            (acc, { credits, grade }) => {
                const creditValue = parseArabicNumber(credits);
                acc.creditsSum += creditValue;
                acc.pointsSum += creditValue * (grade?.value ? gradeValues[grade.value] : 0);
                return acc;
            },
            { creditsSum: 0, pointsSum: 0 }
        );

        const average = creditsSum ? pointsSum / creditsSum : 0;
        return {
            gpa: +average.toFixed(5),
            approximateGpa: +average.toFixed(2),
            totalCredits: creditsSum,
            totalPoints: pointsSum,
        };
    }, [courses]);

    // Handlers
    const addCourse = () =>
        setCourses(prev => [{ id: nanoid(), name: '', credits: '', grade: undefined }, ...prev]);

    const removeCourse = (id: string) =>
        setCourses(prev => prev.filter(course => course.id !== id));

    const updateCourseField = (
        id: string,
        field: 'name' | 'credits' | 'grade',
        value: any
    ) => {
        setCourses(prev =>
            prev.map(course =>
                course.id === id ? { ...course, [field]: value } : course
            )
        );
    };

    const exportCourses = () => {
        navigator.clipboard.writeText(JSON.stringify({ courses }));
        toast.success('تم نسخ البيانات للحافظة');
    };

    const importCourses = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const parsed = JSON.parse(clipboardText);
            if (!Array.isArray(parsed.courses)) throw new Error();
            setCourses(
                parsed.courses.map((course: any) => ({
                    id: nanoid(),
                    name: course.name || '',
                    credits: course.credits || '',
                    grade: course.grade
                        ? { value: course.grade.value, label: course.grade.value }
                        : undefined,
                }))
            );
            toast.success('تم استيراد البيانات بنجاح');
        } catch {
            toast.error('خطأ في استيراد البيانات');
        }
    };

    return (
        <div className="container max-w-screen-md mb-8">
            <div ref={statsContainer}>
                {totalCredits ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4 mb-4">
                        {/* Real GPA */}
                        <Card>
                            <CardHeader>
                                <CardTitle>المعدل الدقيق</CardTitle>
                            </CardHeader>
                            <CardContent className='text-2xl font-bold text-end'>
                                {gpa}
                            </CardContent>
                        </Card>
                        {/* Approximate GPA */}
                        <Card>
                            <CardHeader>
                                <CardTitle>المعدل التقريبي</CardTitle>
                            </CardHeader>
                            <CardContent className='text-2xl font-bold text-end'>
                                {approximateGpa}
                            </CardContent>
                        </Card>
                        {/* Total Credits */}
                        <Card>
                            <CardHeader>
                                <CardTitle>إجمالي الساعات</CardTitle>
                            </CardHeader>
                            <CardContent className='text-2xl font-bold text-end'>
                                {totalCredits}
                            </CardContent>
                        </Card>
                        {/* Total Points */}
                        <Card>
                            <CardHeader>
                                <CardTitle>إجمالي النقاط</CardTitle>
                            </CardHeader>
                            <CardContent className='text-2xl font-bold text-end'>
                                {totalPoints}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <p className="text-muted-foreground">املأ البيانات لحساب المعدل</p>
                )}
            </div>

            <div className='flex justify-between items-center gap-2'>
                <Button onClick={addCourse} className="flex-1">
                    إضافة مقرر
                    <Plus />
                </Button>
                <div className="flex gap-2">
                    <Button variant='secondary' onClick={exportCourses} className="flex-1">
                        تصدير البيانات
                        <FileDown />
                    </Button>
                    <Button variant='secondary' onClick={importCourses} className="flex-1">
                        استيراد البيانات
                        <FileUp />
                    </Button>
                </div>
            </div>

            <div ref={listContainer} className="space-y-2 mt-4">
                {courses.map(course => (
                    <div key={course.id} className="flex gap-2">
                        <Button
                            variant="destructive"
                            onClick={() => removeCourse(course.id)}
                        >
                            <Trash />
                        </Button>
                        <Input
                            value={course.name}
                            onChange={e => updateCourseField(course.id, 'name', e.target.value)}
                            placeholder="اسم المقرر"
                        />
                        <Input
                            value={course.credits}
                            onChange={e => updateCourseField(course.id, 'credits', e.target.value)}
                            placeholder="الساعات"
                            className="w-42"
                        />
                        <Select
                            value={course.grade?.value}
                            onValueChange={val =>
                                updateCourseField(course.id, 'grade', { value: val, label: val })
                            }
                        >
                            <SelectTrigger className="w-42">
                                <SelectValue placeholder="التقدير" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(gradeValues).map(g => (
                                    <SelectItem key={g} value={g}>
                                        {g}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
        </div>
    );
}
