import React, { useState, useEffect, useCallback, useRef } from 'react';
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

interface ParsedCourse {
    code: string;
    name: string;
    creditHours: number;
    passedHours: number;
    degree: number;
    grade: string;
    points: number;
}

interface ParsedSemester {
    term: string;
    academicYear: string;
    semesterGPA: number | null;
    cumulativeGPA: number | null;
    courses: ParsedCourse[];
}

interface ParsedAcademicRecord {
    studentId: string;
    issueDate: string;
    GPA: number;
    status: string;
    name: string;
    degree: string;
    studyType: string;
    faculty: string;
    major: string;
    totalCreditHours: number;
    passedHours: number;
    cumulativeGPA: number;
    totalPoints: number;
    semesters: ParsedSemester[];
}

interface GPACalculatorProps {
    title?: string;
}

// Function to load PDF.js dynamically
async function loadPDFJS(): Promise<any> {
    // Check if PDF.js is already loaded
    if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
        return (window as any).pdfjsLib;
    }

    // Load PDF.js from CDN
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.min.mjs';
        script.type = 'module';
        script.onload = () => {
            // Wait a bit for the module to initialize
            setTimeout(() => {
                const pdfjsLib = (globalThis as any).pdfjsLib;
                if (pdfjsLib) {
                    // Set up worker
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs';
                    resolve(pdfjsLib);
                } else {
                    reject(new Error('PDF.js failed to load'));
                }
            }, 100);
        };
        script.onerror = () => reject(new Error('Failed to load PDF.js'));
        document.head.appendChild(script);
    });
}

// Function to extract text from PDF
async function extractTextFromPDF(file: File): Promise<string> {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
        throw new Error('PDF processing is only available in the browser');
    }

    // Load PDF.js
    const pdfjsLib = await loadPDFJS();
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    
    let allText = '';
    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
        allText += pageText + '\n\n';
    }
    
    return allText;
}

// Function to parse academic record text
function parseAcademicRecord(text: string): ParsedAcademicRecord | null {
    try {
        const studentIdMatch = text.match(/Student ID\s*:\s*(\d+)/);
        const issueDateMatch = text.match(/Date\s*:\s*([\d]{2}-[\d]{2}-[\d]{4})/);
        const gpaMatch = text.match(/GPA\s*:\s*([\d\.]+)/);
        const statusMatch = text.match(/Status\s*:\s*(\w+)/);
        const nameMatch = text.match(/Name\s*:\s*([A-Z ,]+)/);
        const degreeMatch = text.match(/Degree\s*:\s*([\w ]+?)\s*Study type/);
        const studyTypeMatch = text.match(/Study type\s*:\s*([A-Za-z ]+)/);
        const facultyMatch = text.match(/Faculty\s*:\s*([A-Za-z &]+)/);
        const majorMatch = text.match(/Major\s*:\s*([A-Za-z &]+)/);
        const totalCreditHoursMatch = text.match(/Crd Hrs\s*:\s*(\d+)/);
        const passedHoursMatch = text.match(/Passed Hrs\s*:\s*(\d+)/);
        const cumulativeGpaMatch = text.match(/Accum GPA\s*:\s*([\d\.]+)/);
        const totalPointsMatch = text.match(/Points\s*:\s*([\d\.]+)/);

        if (!studentIdMatch || !gpaMatch) {
            throw new Error('Required fields not found');
        }

        // Parse semesters
        const semesterPattern = /(First|Second|Third) Semester\s+([\d\/]+)(.*?)(?=(?:First|Second|Third) Semester|$)/gs;
        const semesters: ParsedSemester[] = [];
        let semesterMatch;
        
        while ((semesterMatch = semesterPattern.exec(text)) !== null) {
            const [, term, year, block] = semesterMatch;
            
            const semGpaMatch = block.match(/S\.GPA\s*:\s*([\d\.]+)/);
            const cumGpaMatch = block.match(/Ac\. GPA\s*:\s*([\d\.]+)/);
            
            const courses: ParsedCourse[] = [];
            const coursePattern = /^([A-Z0-9]+)\s+(.+?)\s+(\d+)\s+(\d+)\s+(\d+(?:\.\d+)?)\s+([A-F][\+\-]?)\s+(\d+\.\d+)/gm;
            let courseMatch;
            
            while ((courseMatch = coursePattern.exec(block)) !== null) {
                const [, code, title, ch, ph, deg, grade, pts] = courseMatch;
                courses.push({
                    code,
                    name: title.trim(),
                    creditHours: parseInt(ch),
                    passedHours: parseInt(ph),
                    degree: parseFloat(deg),
                    grade,
                    points: parseFloat(pts)
                });
            }
            
            semesters.push({
                term: `${term} Semester`,
                academicYear: year,
                semesterGPA: semGpaMatch ? parseFloat(semGpaMatch[1]) : null,
                cumulativeGPA: cumGpaMatch ? parseFloat(cumGpaMatch[1]) : null,
                courses
            });
        }

        return {
            studentId: studentIdMatch[1],
            issueDate: issueDateMatch ? issueDateMatch[1] : '',
            GPA: parseFloat(gpaMatch[1]),
            status: statusMatch ? statusMatch[1] : '',
            name: nameMatch ? nameMatch[1].trim() : '',
            degree: degreeMatch ? degreeMatch[1].trim() : '',
            studyType: studyTypeMatch ? studyTypeMatch[1].trim() : '',
            faculty: facultyMatch ? facultyMatch[1].trim() : '',
            major: majorMatch ? majorMatch[1].trim() : '',
            totalCreditHours: totalCreditHoursMatch ? parseInt(totalCreditHoursMatch[1]) : 0,
            passedHours: passedHoursMatch ? parseInt(passedHoursMatch[1]) : 0,
            cumulativeGPA: cumulativeGpaMatch ? parseFloat(cumulativeGpaMatch[1]) : 0,
            totalPoints: totalPointsMatch ? parseFloat(totalPointsMatch[1]) : 0,
            semesters
        };
    } catch (error) {
        console.error('Error parsing academic record:', error);
        return null;
    }
}

// Function to convert parsed courses to the component's Course format
function convertParsedCoursesToCourses(parsedRecord: ParsedAcademicRecord): Course[] {
    const allCourses: Course[] = [];
    
    parsedRecord.semesters.forEach(semester => {
        semester.courses.forEach(course => {
            // Map the grade to our grade system
            let mappedGrade: GradeValue | undefined;
            if (course.grade in grades) {
                mappedGrade = course.grade as GradeValue;
            }
            
            allCourses.push({
                id: `imported-${Date.now()}-${Math.random()}`,
                name: `${course.code} - ${course.name}`,
                grade: mappedGrade,
                credits: course.creditHours.toString()
            });
        });
    });
    
    return allCourses;
}

const GPACalculator: React.FC<GPACalculatorProps> = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [gpa, setGpa] = useState<number>(0);
    const [approximateGpa, setApproximateGpa] = useState<number>(0);
    const [totalCredits, setTotalCredits] = useState<number>(0);
    const [totalWeightedGrade, setTotalWeightedGrade] = useState<number>(0);
    const [isProcessingPDF, setIsProcessingPDF] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    }, [courses]);    const importData = useCallback(async () => {
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
    }, []);    const handlePDFUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setUploadStatus('يرجى اختيار ملف PDF');
            return;
        }

        // Check if we're in the browser
        if (typeof window === 'undefined') {
            setUploadStatus('PDF upload is only available in the browser');
            return;
        }

        setIsProcessingPDF(true);
        setUploadStatus('جاري تحميل PDF.js...');

        try {
            setUploadStatus('جاري معالجة الملف...');
            
            // Extract text from PDF
            const text = await extractTextFromPDF(file);
            console.log('Extracted text:', text);
            
            if (!text || text.trim().length === 0) {
                throw new Error('No text could be extracted from the PDF');
            }
            
            setUploadStatus('جاري تحليل البيانات...');
            
            // Parse the academic record
            const parsedRecord = parseAcademicRecord(text);
            
            if (!parsedRecord) {
                throw new Error('Could not parse academic record. Please ensure the PDF is an English academic transcript.');
            }
            
            if (!parsedRecord.semesters || parsedRecord.semesters.length === 0) {
                throw new Error('No courses found in the academic record');
            }

            // Convert to courses format and set
            const importedCourses = convertParsedCoursesToCourses(parsedRecord);
            
            if (importedCourses.length === 0) {
                throw new Error('No valid courses could be imported from the academic record');
            }
            
            setCourses(importedCourses);
            
            setUploadStatus(`تم استيراد ${importedCourses.length} مقرر بنجاح من ${parsedRecord.semesters.length} فصل دراسي`);
            
            // Clear the status after 5 seconds
            setTimeout(() => {
                setUploadStatus('');
            }, 5000);
            
        } catch (error) {
            console.error('Error processing PDF:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            if (errorMessage.includes('PDF.js failed to load')) {
                setUploadStatus('خطأ في تحميل مكتبة PDF.js. تأكد من اتصالك بالإنترنت');
            } else if (errorMessage.includes('No text could be extracted')) {
                setUploadStatus('لا يمكن استخراج النص من هذا الملف. تأكد أن الملف ليس محمي أو مشفر');
            } else if (errorMessage.includes('No courses found') || errorMessage.includes('No valid courses')) {
                setUploadStatus('لم يتم العثور على مقررات في الملف. تأكد أن الملف هو كشف درجات صحيح');
            } else if (errorMessage.includes('Could not parse academic record')) {
                setUploadStatus('تعذر تحليل كشف الدرجات. تأكد أن الملف باللغة الإنجليزية وفي التنسيق الصحيح');
            } else {
                setUploadStatus('خطأ في معالجة الملف. تأكد من أن الملف هو كشف درجات باللغة الإنجليزية');
            }
        } finally {
            setIsProcessingPDF(false);
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, []);return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h3
                className="text-primary text-2xl mb-4"
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
                            className="list-none p-0 m-0 w-full"
                        >
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex justify-between border-b border-border py-2"
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
                                className="flex justify-between border-b border-border py-2"
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
                                className="flex justify-between border-b border-border py-2"
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
                                className="flex justify-between py-2"
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
                className="border-none border-t border-border origin-left"
            />            <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {/* PDF Upload section */}
                <motion.div
                    className="border border-border rounded-md p-4 bg-background"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h4 className="text-content text-lg mb-3 m-0">رفع كشف الدرجات</h4>
                    <p className="text-content-secondary text-sm mb-3 m-0">
                        ارفع كشف الدرجات (PDF) باللغة الإنجليزية لملء البيانات تلقائياً
                    </p>
                    
                    <div className="flex flex-col gap-2">
                        <motion.label
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 px-4 bg-transparent border border-primary rounded-md text-primary text-base cursor-pointer transition-all duration-200 ease-in-out font-inherit text-center hover:bg-primary hover:text-primary-contrast flex items-center justify-center gap-2"
                        >
                            {isProcessingPDF ? (
                                <>
                                    <span className="animate-spin">⟳</span>
                                    جاري المعالجة...
                                </>
                            ) : (
                                <>
                                    📄 اختيار ملف PDF
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handlePDFUpload}
                                disabled={isProcessingPDF}
                                className="hidden"
                            />
                        </motion.label>
                        
                        {uploadStatus && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-sm m-0 ${
                                    uploadStatus.includes('خطأ') || uploadStatus.includes('يرجى')
                                        ? 'text-danger'
                                        : uploadStatus.includes('بنجاح')
                                        ? 'text-success'
                                        : 'text-content-secondary'
                                }`}
                            >
                                {uploadStatus}
                            </motion.p>
                        )}
                    </div>
                </motion.div>

                <motion.button
                    onClick={addCourse}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 bg-transparent border border-primary rounded-md text-primary text-base cursor-pointer transition-all duration-200 ease-in-out font-inherit text-center hover:bg-primary hover:text-primary-contrast"
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
                            className="flex"
                        >
                            <motion.button
                                onClick={() => removeCourse(course.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-fit py-3 px-4 bg-danger border border-danger rounded-s-md rounded-e-none text-white text-sm cursor-pointer font-inherit"
                            >
                                حذف
                            </motion.button>

                            <motion.input
                                type="text"
                                value={course.name || ''}
                                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                                placeholder="اسم المقرر"
                                whileFocus={{ scale: 1.02 }}
                                className="w-full py-3 px-3 border-t border-b border-border border-s-0 border-l-0 rounded-none text-base bg-background text-content font-inherit transition-all duration-200 ease-in-out"
                            />                            <motion.input
                                type="text"
                                value={course.credits || ''}
                                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                                placeholder="الساعات"
                                whileFocus={{ scale: 1.02 }}
                                className="w-24 min-w-24 py-3 px-3 border border-border rounded-none text-base bg-background text-content font-inherit transition-all duration-200 ease-in-out"
                            />

                            <motion.select
                                value={course.grade || ''}
                                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                                whileFocus={{ scale: 1.02 }}
                                className="w-24 min-w-24 py-3 px-3 border border-border rounded-e-md rounded-s-none border-s-0 text-base bg-background text-content font-inherit cursor-pointer transition-all duration-200 ease-in-out"
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
            </motion.div>            {/* Export/Import section */}
            <motion.div
                className="flex flex-col gap-2 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <p className="m-0 text-content-secondary text-sm">
                    يمكنك تصدير واستيراد البيانات لنقلها بين الأجهزة أو الاحتفاظ بها، هذه الخاصية منفصلة عن الحفظ التلقائي
                </p>
                <div className="flex gap-4">
                    <motion.button
                        onClick={exportData}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-4 bg-transparent border border-primary rounded-md text-primary text-base cursor-pointer transition-all duration-200 ease-in-out font-inherit hover:bg-primary hover:text-primary-contrast"
                    >
                        تصدير البيانات
                    </motion.button>
                    <motion.button
                        onClick={importData}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-4 bg-transparent border border-primary rounded-md text-primary text-base cursor-pointer transition-all duration-200 ease-in-out font-inherit hover:bg-primary hover:text-primary-contrast"
                    >
                        استيراد البيانات
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GPACalculator;
