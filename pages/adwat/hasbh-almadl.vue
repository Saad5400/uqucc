<template>
    <div class="mb-8 typography">
        <h1>حاسبة المعدل</h1>
    </div>
    <div class="mb-8">
        <div v-auto-animate>
            <div v-if="totalCredits" class="grid grid-cols-2 gap-4 mb-4 lg:grid-cols-4">
                <!-- Real GPA -->
                <Card>
                    <CardHeader>
                        <CardTitle>المعدل الدقيق</CardTitle>
                    </CardHeader>
                    <CardContent class="text-2xl font-bold text-end">
                        {{ gpa }}
                    </CardContent>
                </Card>

                <!-- Approximate GPA -->
                <Card>
                    <CardHeader>
                        <CardTitle>المعدل التقريبي</CardTitle>
                    </CardHeader>
                    <CardContent class="text-2xl font-bold text-end">
                        {{ approximateGpa }}
                    </CardContent>
                </Card>

                <!-- Total Credits -->
                <Card>
                    <CardHeader>
                        <CardTitle>إجمالي الساعات</CardTitle>
                    </CardHeader>
                    <CardContent class="text-2xl font-bold text-end">
                        {{ totalCredits }}
                    </CardContent>
                </Card>

                <!-- Total Points -->
                <Card>
                    <CardHeader>
                        <CardTitle>إجمالي النقاط</CardTitle>
                    </CardHeader>
                    <CardContent class="text-2xl font-bold text-end">
                        {{ totalPoints }}
                    </CardContent>
                </Card>
            </div>

            <p v-else class="mb-4 text-muted-foreground">املأ البيانات لحساب المعدل</p>
        </div>

        <div class="flex items-center justify-between gap-2">
            <Button @click="addCourse" class="flex-1">
                إضافة مقرر
                <Plus />
            </Button>
            <div class="flex gap-2">
                <Button variant="secondary" @click="exportCourses" class="flex-1">
                    تصدير البيانات
                    <FileDown />
                </Button>
                <Button variant="secondary" @click="importCourses" class="flex-1">
                    استيراد البيانات
                    <FileUp />
                </Button>
            </div>
        </div>

        <div v-auto-animate class="mt-4 space-y-2">
            <div v-for="course in courses" :key="course.id" class="flex gap-2">
                <Button variant="destructive" @click="removeCourse(course.id)">
                    <Trash />
                </Button>
                <Input v-model="course.name" placeholder="اسم المقرر" />
                <Input v-model="course.credits" placeholder="الساعات" class="w-42" />
                <Select :model-value="course.grade?.value"
                    @update:model-value="(val) => updateCourseField(course.id, 'grade', { value: val, label: val })">
                    <SelectTrigger class="w-42">
                        <SelectValue placeholder="التقدير" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="grade in Object.keys(gradeValues)" :key="grade" :value="grade">
                            {{ grade }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Plus, FileDown, FileUp, Trash } from 'lucide-vue-next'
import { nanoid } from 'nanoid'

interface Course {
    id: string
    name: string
    credits: string
    grade?: {
        value: string
        label: string
    }
}

// Convert Arabic-Indic digits and separators to a JS number
const parseArabicNumber = (text = '') =>
    parseFloat(
        text
            .trim()
            .replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit) + '')
            .replace(/[٫،,]/g, '.')
    ) || 0

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
}

// Initialize courses with data from localStorage (client-side only)
const courses = ref<Course[]>([])

// Load courses from localStorage on client-side
const loadCourses = () => {
    if (import.meta.client) {
        const stored = JSON.parse(localStorage.getItem('courses') || '[]')
        courses.value = stored.map((course: any) => ({
            id: nanoid(),
            name: course.name || '',
            credits: course.credits || '',
            grade: course.grade
                ? { value: course.grade.value, label: course.grade.value }
                : undefined,
        }))
    }
}

// Save courses to localStorage
const saveCourses = () => {
    if (import.meta.client) {
        const toStore = courses.value.map(({ id, ...rest }) => rest)
        localStorage.setItem('courses', JSON.stringify(toStore))
    }
}

// Watch for changes and save to localStorage
watch(courses, saveCourses, { deep: true })

// Computed statistics
const stats = computed(() => {
    const { creditsSum, pointsSum } = courses.value.reduce(
        (acc, { credits, grade }) => {
            const creditValue = parseArabicNumber(credits)

            // Only include in calculation if BOTH credits and grade are entered
            if (creditValue > 0 && grade?.value && gradeValues[grade.value] !== undefined) {
                acc.creditsSum += creditValue
                acc.pointsSum += creditValue * gradeValues[grade.value]
            }

            return acc
        },
        { creditsSum: 0, pointsSum: 0 }
    )

    const average = creditsSum ? pointsSum / creditsSum : 0
    return {
        gpa: +average.toFixed(5),
        approximateGpa: +average.toFixed(2),
        totalCredits: creditsSum,
        totalPoints: pointsSum,
    }
})

// Individual computed refs for easier template access
const gpa = computed(() => stats.value.gpa)
const approximateGpa = computed(() => stats.value.approximateGpa)
const totalCredits = computed(() => stats.value.totalCredits)
const totalPoints = computed(() => stats.value.totalPoints)

// Course management functions
const addCourse = () => {
    courses.value.unshift({
        id: nanoid(),
        name: '',
        credits: '',
        grade: undefined
    })
}

const removeCourse = (id: string) => {
    const index = courses.value.findIndex(course => course.id === id)
    if (index > -1) {
        courses.value.splice(index, 1)
    }
}

const updateCourseField = (
    id: string,
    field: 'name' | 'credits' | 'grade',
    value: any
) => {
    const course = courses.value.find(c => c.id === id)
    if (course) {
        course[field] = value
    }
}

// Import/Export functions
const exportCourses = async () => {
    try {
        await navigator.clipboard.writeText(JSON.stringify({ courses: courses.value }))
        // Replace with your toast implementation
        console.log('تم نسخ البيانات للحافظة')
        // You can use useToast() or any other toast library available in your Nuxt app
    } catch (error) {
        console.error('خطأ في تصدير البيانات')
    }
}

const importCourses = async () => {
    try {
        const clipboardText = await navigator.clipboard.readText()
        const parsed = JSON.parse(clipboardText)
        if (!Array.isArray(parsed.courses)) throw new Error()

        courses.value = parsed.courses.map((course: any) => ({
            id: nanoid(),
            name: course.name || '',
            credits: course.credits || '',
            grade: course.grade
                ? { value: course.grade.value, label: course.grade.value }
                : undefined,
        }))

        console.log('تم استيراد البيانات بنجاح')
    } catch {
        console.error('خطأ في استيراد البيانات')
    }
}

// Load courses on mount
onMounted(() => {
    loadCourses()
})

const seo = {
    title: 'حاسبة المعدل',
    description: 'احسب معدلك الدراسي لجامعة أم القرى',
};
useSeoMeta(seo);
defineOgImageComponent('Seo', seo);
</script>