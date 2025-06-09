import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from './ui/select';

// Convert Arabic-Indic digits and separators to a JS number
const parseArabicNumber = (text = '') =>
    parseFloat(
        text.trim()
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
    const [courses, setCourses] = useState(() =>
        JSON.parse(localStorage.getItem('courses') || '[{}]')
    );

    // Persist courses to localStorage
    useEffect(() => {
        localStorage.setItem('courses', JSON.stringify(courses));
    }, [courses]);

    // Setup auto-animate on the course list container
    const [listContainer] = useAutoAnimate();

    // Compute GPA metrics
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

    // Handlers for course operations
    const addCourse = () => setCourses(prev => [{}, ...prev]);
    const removeCourse = (index: number) =>
        setCourses(prev => prev.filter((_, i) => i !== index));
    const updateCourseField = (
        index: number,
        field: 'name' | 'credits' | 'grade',
        value: any
    ) => {
        setCourses(prev =>
            prev.map((course, i) =>
                i === index ? { ...course, [field]: value } : course
            )
        );
    };

    // Export and import data to/from clipboard
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
                    ...course,
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
            {totalCredits ? (
                <ul className="space-y-2">
                    {[
                        ['معدلك الحقيقي', gpa],
                        ['معدلك التقريبي', approximateGpa],
                        ['الساعات المجتازة', totalCredits],
                        ['إجمالي النقاط', totalPoints],
                    ].map(([label, value]) => (
                        <li key={label} className="flex justify-between border-b">
                            <span>{label}:</span>
                            <span>{value}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>املأ البيانات لحساب المعدل</p>
            )}

            <Button onClick={addCourse} className="w-full mt-4">
                إضافة مقرر
            </Button>

            <div ref={listContainer} className="space-y-2 mt-4">
                {courses.map((course, idx) => (
                    <div key={idx} className="flex gap-2">
                        <Button
                            variant="destructive"
                            onClick={() => removeCourse(idx)}
                        >
                            حذف
                        </Button>
                        <Input
                            value={course.name || ''}
                            onChange={e => updateCourseField(idx, 'name', e.target.value)}
                            placeholder="اسم المقرر"
                        />
                        <Input
                            value={course.credits || ''}
                            onChange={e => updateCourseField(idx, 'credits', e.target.value)}
                            placeholder="الساعات"
                            className="w-20"
                        />
                        <Select
                            value={course.grade?.value}
                            onValueChange={val =>
                                updateCourseField(idx, 'grade', { value: val, label: val })
                            }
                        >
                            <SelectTrigger className="w-20">
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

            <div className="flex gap-4 mt-4">
                <Button onClick={exportCourses} className="flex-1">
                    تصدير البيانات
                </Button>
                <Button onClick={importCourses} className="flex-1">
                    استيراد البيانات
                </Button>
            </div>
        </div>
    );
}
