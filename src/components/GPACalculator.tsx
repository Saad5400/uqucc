import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h3 
                style={{
                    color: 'var(--ifm-color-primary)',
                    fontSize: 'var(--ifm-h3-font-size)',
                    marginBottom: '1rem'
                }}
                layout
            >
                <AnimatePresence mode="wait">
                    {gpa ? (
                        <motion.ul 
                            key="gpa-results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                width: '100%'
                            }}
                        >
                            <motion.li 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid var(--ifm-color-emphasis-300)',
                                    padding: '0.5rem 0'
                                }}
                            >
                                <span>معدلك الحقيقي:</span>
                                <motion.span
                                    key={gpa}
                                    initial={{ scale: 1.2, color: 'var(--ifm-color-primary)' }}
                                    animate={{ scale: 1, color: 'inherit' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {gpa}
                                </motion.span>
                            </motion.li>
                            <motion.li 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid var(--ifm-color-emphasis-300)',
                                    padding: '0.5rem 0'
                                }}
                            >
                                <span>معدلك التقريبي:</span>
                                <motion.span
                                    key={approximateGpa}
                                    initial={{ scale: 1.2, color: 'var(--ifm-color-primary)' }}
                                    animate={{ scale: 1, color: 'inherit' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {approximateGpa}
                                </motion.span>
                            </motion.li>
                            <motion.li 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid var(--ifm-color-emphasis-300)',
                                    padding: '0.5rem 0'
                                }}
                            >
                                <span>الساعات المجتازة:</span>
                                <motion.span
                                    key={totalCredits}
                                    initial={{ scale: 1.2, color: 'var(--ifm-color-primary)' }}
                                    animate={{ scale: 1, color: 'inherit' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {totalCredits}
                                </motion.span>
                            </motion.li>
                            <motion.li 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.5rem 0'
                                }}
                            >
                                <span>إجمالي النقاط:</span>
                                <motion.span
                                    key={totalWeightedGrade.toFixed(2)}
                                    initial={{ scale: 1.2, color: 'var(--ifm-color-primary)' }}
                                    animate={{ scale: 1, color: 'inherit' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {totalWeightedGrade.toFixed(2)}
                                </motion.span>
                            </motion.li>
                        </motion.ul>
                    ) : (
                        <motion.span
                            key="empty-state"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            املأ البيانات لحساب المعدل
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.h3>

            <motion.hr 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ 
                    border: 'none', 
                    borderTop: '1px solid var(--ifm-color-emphasis-300)',
                    transformOrigin: 'left'
                }} 
            />

            <motion.div 
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <motion.button
                    onClick={addCourse}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='text-center'
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
                </motion.button>

                <AnimatePresence>
                    {courses.map((course, index) => (
                        <motion.div 
                            key={course.id} 
                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            transition={{ 
                                duration: 0.3,
                                delay: index * 0.05
                            }}
                            layout
                            style={{ display: 'flex' }}
                        >
                            <motion.button
                                onClick={() => removeCourse(course.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
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
                            </motion.button>

                            <motion.input
                                type="text"
                                value={course.name || ''}
                                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                                placeholder="اسم المقرر"
                                whileFocus={{ scale: 1.02 }}
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
                                    fontFamily: 'inherit',
                                    transition: 'all 0.2s ease'
                                }}
                            />

                            <motion.input
                                type="text"
                                value={course.credits || ''}
                                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                                placeholder="الساعات"
                                whileFocus={{ scale: 1.02 }}
                                style={{
                                    width: '100px',
                                    minWidth: '100px',
                                    padding: '0.75rem',
                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                    borderRadius: '0',
                                    fontSize: '1rem',
                                    backgroundColor: 'var(--ifm-color-emphasis-0)',
                                    color: 'var(--ifm-color-content)',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.2s ease'
                                }}
                            />

                            <motion.select
                                value={course.grade || ''}
                                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                                whileFocus={{ scale: 1.02 }}
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
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <option value="">التقدير</option>
                                {Object.keys(grades).map((grade) => (
                                    <option key={grade} value={grade}>
                                        {grade}
                                    </option>
                                ))}
                            </motion.select>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Export/Import section */}
            <motion.div 
                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <p style={{
                    margin: '0',
                    color: 'var(--ifm-color-content-secondary)',
                    fontSize: '0.9rem'
                }}>
                    يمكنك تصدير واستيراد البيانات لنقلها بين الأجهزة أو الاحتفاظ بها، هذه الخاصية منفصلة عن الحفظ التلقائي
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <motion.button
                        onClick={exportData}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
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
                    </motion.button>
                    <motion.button
                        onClick={importData}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
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
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GPACalculator;
