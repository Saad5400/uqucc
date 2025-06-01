import React, { useState, useEffect, useCallback } from 'react';

// Utility function to convert Arabic-Indic digits to Latin digits (with trimming)
function convertArabicToLatinDigits(arabicNumber: string): string {
    return arabicNumber
        .trim()
        .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d: string) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
        .replace(/٫/g, ".")  // Replace Arabic decimal separator with "."
        .replace(/،/g, ".") // Replace Arabic decimal separator with "."
        .replace(/,/g, "."); // Replace Arabic decimal separator with "."
}

// Use parseFloat to capture any decimals (after trimming)
function parseArabicFloat(arabicNumber: string): number {
    const latinNumber = convertArabicToLatinDigits(arabicNumber);
    return parseFloat(latinNumber);
}

const grades = {
    "A+": 4.0,
    "A": 3.75,
    "B+": 3.5,
    "B": 3.0,
    "C+": 2.5,
    "C": 2.0,
    "D+": 1.5,
    "D": 1.0,
    "F": 0.0
} as const;

type GradeValue = keyof typeof grades;

interface Course {
    id: string;
    name?: string;
    grade?: GradeValue;
    credits?: string;
}

interface GPACalculatorProps {
    title?: string;
}

const GPACalculator: React.FC<GPACalculatorProps> = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [gpa, setGpa] = useState<number>(0);
    const [approximateGpa, setApproximateGpa] = useState<number>(0);
    const [totalCredits, setTotalCredits] = useState<number>(0);
    const [totalWeightedGrade, setTotalWeightedGrade] = useState<number>(0);

    // Initialize courses from localStorage
    useEffect(() => {
        const savedCourses = localStorage.getItem('courses');
        if (savedCourses) {
            try {
                const parsedCourses = JSON.parse(savedCourses);
                // Add unique IDs to existing courses if they don't have them
                const coursesWithIds = parsedCourses.map((course: any, index: number) => ({
                    ...course,
                    id: course.id || `course-${Date.now()}-${index}`
                }));
                setCourses(coursesWithIds);
            } catch (error) {
                console.error('Error parsing saved courses:', error);
                setCourses([{ id: `course-${Date.now()}` }]);
            }
        } else {
            setCourses([{ id: `course-${Date.now()}` }]);
        }
    }, []);

    // Save courses to localStorage whenever courses change
    useEffect(() => {
        localStorage.setItem('courses', JSON.stringify(courses));
    }, [courses]);

    // Calculate GPA whenever courses change
    useEffect(() => {
        let newTotalCredits = 0;
        let newTotalWeightedGrade = 0;

        for (const course of courses) {
            if (course.grade && course.credits) {
                const credits = parseArabicFloat(course.credits);
                if (!isNaN(credits) && credits > 0) {
                    newTotalCredits += credits;
                    newTotalWeightedGrade += grades[course.grade] * credits;
                }
            }
        }

        setTotalCredits(newTotalCredits);
        setTotalWeightedGrade(newTotalWeightedGrade);

        if (newTotalCredits > 0) {
            const calculatedGpa = newTotalWeightedGrade / newTotalCredits;
            setGpa(Number(calculatedGpa.toFixed(5)));
            setApproximateGpa(Number(calculatedGpa.toFixed(2)));
        } else {
            setGpa(0);
            setApproximateGpa(0);
        }
    }, [courses]);

    const addCourse = useCallback(() => {
        setCourses(prev => [{ id: `course-${Date.now()}` }, ...prev]);
    }, []);

    const removeCourse = useCallback((courseId: string) => {
        setCourses(prev => prev.filter(course => course.id !== courseId));
    }, []);

    const updateCourse = useCallback((courseId: string, field: keyof Course, value: string) => {
        setCourses(prev => prev.map(course =>
            course.id === courseId
                ? { ...course, [field]: value }
                : course
        ));
    }, []);

    const exportData = useCallback(async () => {
        try {
            const data = { courses };
            await navigator.clipboard.writeText(JSON.stringify(data));
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('خطأ في تصدير البيانات');
        }
    }, [courses]);

    const importData = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            const data = JSON.parse(text);

            if (data.courses && Array.isArray(data.courses)) {
                // Add unique IDs to imported courses
                const coursesWithIds = data.courses.map((course: any, index: number) => ({
                    ...course,
                    id: course.id || `imported-${Date.now()}-${index}`
                }));
                setCourses(coursesWithIds);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            alert('خطأ في استيراد البيانات');
        }
    }, []);

    return (
        <>
            <h3 style={{
                color: 'var(--ifm-color-primary)',
                fontSize: 'var(--ifm-h3-font-size)',
                marginBottom: '1rem'
            }}>
                {gpa ? (
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        width: '100%'
                    }}>
                        <li style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid var(--ifm-color-emphasis-300)',
                            padding: '0.5rem 0'
                        }}>
                            <span>معدلك الحقيقي:</span>
                            <span>{gpa}</span>
                        </li>
                        <li style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid var(--ifm-color-emphasis-300)',
                            padding: '0.5rem 0'
                        }}>
                            <span>معدلك التقريبي:</span>
                            <span>{approximateGpa}</span>
                        </li>
                        <li style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid var(--ifm-color-emphasis-300)',
                            padding: '0.5rem 0'
                        }}>
                            <span>الساعات المجتازة:</span>
                            <span>{totalCredits}</span>
                        </li>
                        <li style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0'
                        }}>
                            <span>إجمالي النقاط:</span>
                            <span>{totalWeightedGrade.toFixed(2)}</span>
                        </li>
                    </ul>
                ) : (
                    <span>املأ البيانات لحساب المعدل</span>
                )}
            </h3>

            <hr style={{ border: 'none', borderTop: '1px solid var(--ifm-color-emphasis-300)' }} />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}>
                <button
                    onClick={addCourse}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--ifm-color-primary)',
                        borderRadius: '6px',
                        color: 'var(--ifm-color-primary)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary)';
                        e.currentTarget.style.color = 'var(--ifm-color-primary-contrast-background)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--ifm-color-primary)';
                    }}
                >
                    إضافة مقرر
                </button>

                {courses.map((course) => (
                    <div key={course.id} style={{ display: 'flex' }}>
                        <button
                            onClick={() => removeCourse(course.id)}
                            style={{
                                width: 'fit-content',
                                padding: '0.75rem 1rem',
                                backgroundColor: 'var(--ifm-color-danger)',
                                border: '1px solid var(--ifm-color-danger)',
                                borderTopRightRadius: '6px',
                                borderBottomRightRadius: '6px',
                                borderTopLeftRadius: '0',
                                borderBottomLeftRadius: '0',
                                color: 'white',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                fontFamily: 'inherit'
                            }}
                        >
                            حذف
                        </button>

                        <input
                            type="text"
                            value={course.name || ''}
                            onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                            placeholder="اسم المقرر"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--ifm-color-emphasis-300)',
                                borderRight: 'none',
                                borderLeft: 'none',
                                borderRadius: '0',
                                fontSize: '1rem',
                                backgroundColor: 'var(--ifm-color-emphasis-0)',
                                color: 'var(--ifm-color-content)',
                                fontFamily: 'inherit'
                            }}
                        />

                        <input
                            type="text"
                            value={course.credits || ''}
                            onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                            placeholder="الساعات"
                            style={{
                                width: '100px',
                                minWidth: '100px',
                                padding: '0.75rem',
                                border: '1px solid var(--ifm-color-emphasis-300)',
                                borderRadius: '0',
                                fontSize: '1rem',
                                backgroundColor: 'var(--ifm-color-emphasis-0)',
                                color: 'var(--ifm-color-content)',
                                fontFamily: 'inherit'
                            }}
                        />

                        <select
                            value={course.grade || ''}
                            onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                            style={{
                                width: '100px',
                                minWidth: '100px',
                                padding: '0.75rem',
                                border: '1px solid var(--ifm-color-emphasis-300)',
                                borderTopLeftRadius: '6px',
                                borderBottomLeftRadius: '6px',
                                borderTopRightRadius: '0',
                                borderBottomRightRadius: '0',
                                borderRight: 'none',
                                fontSize: '1rem',
                                backgroundColor: 'var(--ifm-color-emphasis-0)',
                                color: 'var(--ifm-color-content)',
                                fontFamily: 'inherit',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">التقدير</option>
                            {Object.keys(grades).map((grade) => (
                                <option key={grade} value={grade}>
                                    {grade}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {/* Export/Import section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{
                    margin: '0',
                    color: 'var(--ifm-color-content-secondary)',
                    fontSize: '0.9rem'
                }}>
                    يمكنك تصدير واستيراد البيانات لنقلها بين الأجهزة أو الاحتفاظ بها، هذه الخاصية منفصلة عن الحفظ التلقائي
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={exportData}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--ifm-color-primary)',
                            borderRadius: '6px',
                            color: 'var(--ifm-color-primary)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: 'inherit'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary)';
                            e.currentTarget.style.color = 'var(--ifm-color-primary-contrast-background)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--ifm-color-primary)';
                        }}
                    >
                        تصدير البيانات
                    </button>
                    <button
                        onClick={importData}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--ifm-color-primary)',
                            borderRadius: '6px',
                            color: 'var(--ifm-color-primary)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: 'inherit'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary)';
                            e.currentTarget.style.color = 'var(--ifm-color-primary-contrast-background)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--ifm-color-primary)';
                        }}
                    >
                        استيراد البيانات
                    </button>
                </div>
            </div>
        </>
    );
};

export default GPACalculator;
