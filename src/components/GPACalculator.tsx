import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Utility functions
function convertArabicToLatinDigits(arabicNumber: string): string {
    return arabicNumber
        .trim()
        .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d: string) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
        .replace(/٫|،|,/g, ".");
}

function parseArabicFloat(arabicNumber: string): number {
    return parseFloat(convertArabicToLatinDigits(arabicNumber));
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
interface Course { id: string; name?: string; grade?: GradeValue; credits?: string; }

// Reusable animated components with internal styles
const AnimatedButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={clsx(
            'border-none rounded text-base font-semibold py-3 px-4 transition-all duration-200 ease-in-out font-inherit cursor-pointer',
            className
        )}
        {...props}
    >
        {children}
    </motion.button>
);

const AnimatedInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
    <motion.input
        className={clsx(
            'border-1 rounded py-3 px-3 transition-all duration-200 ease-in-out font-inherit text-base bg-background text-content',
            className
        )}
        {...props}
    />
);

const AnimatedSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, children, ...props }) => (
    <motion.select
        whileFocus={{ scale: 1.02 }}
        className={clsx(
            'rounded py-3 px-3 transition-all duration-200 ease-in-out font-inherit text-base bg-background text-content cursor-pointer',
            className
        )}
        {...props}
    >
        {children}
    </motion.select>
);

// Stat list item
const StatItem: React.FC<{ label: string; value: React.ReactNode; delay: number }> = ({ label, value, delay }) => (
    <motion.li
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex justify-between border-b border-border py-2"
    >
        <span>{label}</span>
        <motion.span initial={{ scale: 1.2, color: 'var(--ifm-color-primary)' }} animate={{ scale: 1, color: 'inherit' }} transition={{ duration: 0.3 }}>
            {value}
        </motion.span>
    </motion.li>
);

// Course row
const CourseItem: React.FC<{ course: Course; index: number; remove: () => void; update: (field: keyof Course, value: string) => void; }> = ({ course, index, remove, update }) => (
    <motion.div
        initial={{ opacity: 0, x: -20, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.9 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        layout
        className="flex gap-2"
    >
        <AnimatedButton onClick={remove} className="bg-danger text-white">
            X
        </AnimatedButton>
        <AnimatedInput
            type="text"
            value={course.name || ''}
            onChange={(e) => update('name', e.target.value)}
            placeholder="اسم المقرر"
            className="w-full"
        />
        <AnimatedInput
            type="text"
            value={course.credits || ''}
            onChange={(e) => update('credits', e.target.value)}
            placeholder="الساعات"
            className="min-w-24"
        />
        <AnimatedSelect
            value={course.grade || ''}
            onChange={(e) => update('grade', e.target.value)}
            className="min-w-24"
        >
            <option value="">التقدير</option>
            {Object.keys(grades).map(g => <option key={g} value={g}>{g}</option>)}
        </AnimatedSelect>
    </motion.div>
);

const GPACalculator: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [gpa, setGpa] = useState<number>(0);
    const [approximateGpa, setApproximateGpa] = useState<number>(0);
    const [totalCredits, setTotalCredits] = useState<number>(0);
    const [totalWeightedGrade, setTotalWeightedGrade] = useState<number>(0);

    useEffect(() => {
        const saved = localStorage.getItem('courses');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setCourses(parsed.map((c: any, i: number) => ({ ...c, id: c.id || `course-${Date.now()}-${i}` })));
            } catch {
                setCourses([{ id: `course-${Date.now()}` }]);
            }
        } else setCourses([{ id: `course-${Date.now()}` }]);
    }, []);

    useEffect(() => { localStorage.setItem('courses', JSON.stringify(courses)); }, [courses]);

    useEffect(() => {
        let creditsSum = 0, weightedSum = 0;
        courses.forEach(c => {
            if (c.grade && c.credits) {
                const cr = parseArabicFloat(c.credits);
                if (!isNaN(cr) && cr > 0) {
                    creditsSum += cr;
                    weightedSum += grades[c.grade] * cr;
                }
            }
        });
        setTotalCredits(creditsSum);
        setTotalWeightedGrade(weightedSum);
        if (creditsSum > 0) {
            const val = weightedSum / creditsSum;
            setGpa(Number(val.toFixed(5)));
            setApproximateGpa(Number(val.toFixed(2)));
        } else {
            setGpa(0);
            setApproximateGpa(0);
        }
    }, [courses]);

    const addCourse = useCallback(() => setCourses(prev => [{ id: `course-${Date.now()}` }, ...prev]), []);
    const removeCourse = useCallback((id: string) => setCourses(prev => prev.filter(c => c.id !== id)), []);
    const updateCourse = useCallback((id: string, field: keyof Course, value: string) => {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    }, []);

    const exportData = useCallback(async () => {
        try { await navigator.clipboard.writeText(JSON.stringify({ courses })); }
        catch { alert('خطأ في تصدير البيانات'); }
    }, [courses]);

    const importData = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            const data = JSON.parse(text);
            if (data.courses && Array.isArray(data.courses)) {
                setCourses(data.courses.map((c: any, i: number) => ({ ...c, id: c.id || `imported-${Date.now()}-${i}` })));
            } else throw new Error();
        } catch { alert('خطأ في استيراد البيانات'); }
    }, []);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <motion.h3 className="text-primary text-2xl mb-4" layout>
                <AnimatePresence mode="wait">
                    {gpa ? (
                        <motion.ul key="gpa-results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="list-none !p-0 !m-0 w-full">
                            <StatItem label="معدلك الحقيقي:" value={gpa} delay={0.1} />
                            <StatItem label="معدلك التقريبي:" value={approximateGpa} delay={0.2} />
                            <StatItem label="الساعات المجتازة:" value={totalCredits} delay={0.3} />
                            <StatItem label="إجمالي النقاط:" value={totalWeightedGrade.toFixed(2)} delay={0.4} />
                        </motion.ul>
                    ) : (
                        <motion.span key="empty-state" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                            املأ البيانات لحساب المعدل
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.h3>

            <motion.hr initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="border-none border-t border-border origin-left" />
            <motion.div className="flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <AnimatedButton onClick={addCourse} className="w-full bg-primary border border-primary rounded-md text-primary-contrast text-center">
                    إضافة مقرر
                </AnimatedButton>
                <AnimatePresence>
                    {courses.map((c, i) => (
                        <CourseItem key={c.id} course={c} index={i} remove={() => removeCourse(c.id)} update={(f, v) => updateCourse(c.id, f, v)} />
                    ))}
                </AnimatePresence>
            </motion.div>

            <motion.div className="flex flex-col gap-2 mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                <p className="m-0 text-content-secondary text-sm">يمكنك تصدير واستيراد البيانات لنقلها بين الأجهزة أو الاحتفاظ بها، هذه الخاصية منفصلة عن الحفظ التلقائي</p>
                <div className="flex gap-4">
                    <AnimatedButton onClick={exportData} className="w-full bg-primary border border-primary rounded-md text-primary-contrast">
                        تصدير البيانات
                    </AnimatedButton>
                    <AnimatedButton onClick={importData} className="w-full bg-primary border border-primary rounded-md text-primary-contrast">
                        استيراد البيانات
                    </AnimatedButton>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GPACalculator;
