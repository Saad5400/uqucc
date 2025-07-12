<template>
    <div>
        <div class="mb-8 typography">
            <h1>
                المكافأة القادمة
            </h1>
        </div>
        <!-- Payment Day Celebration -->
        <div v-if="isPaymentDay"
            class="relative p-8 my-8 overflow-hidden text-center shadow-lg text-primary bg-card-bg rounded-2xl">
            <!-- Animated background elements -->
            <div class="absolute inset-0 opacity-60" :style="{
                background: 'linear-gradient(45deg, rgba(var(--color-primary-rgb), 0.05) 25%, transparent 25%, transparent 75%, rgba(var(--color-primary-rgb), 0.05) 75%), linear-gradient(45deg, rgba(var(--color-primary-rgb), 0.05) 25%, transparent 25%, transparent 75%, rgba(var(--color-primary-rgb), 0.05) 75%)',
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 15px 15px'
            }"></div>

            <div class="relative z-10 mb-4 text-6xl animate-bounce">🎉💰🎊</div>

            <h2 class="relative z-10 mb-4 text-3xl font-bold text-primary">
                مبروك! اليوم يوم صرف المكافأة
            </h2>

            <p class="relative z-10 mb-6 text-xl text-primary opacity-80">
                ممكن تاخذ حتى 24 ساعة عشان توصل المكافأة لحسابك
            </p>
        </div>

        <!-- Countdown Display -->
        <template v-else>
            <div class="grid grid-cols-4 gap-4 mb-6">
                <div class="p-4 shadow-md bg-card rounded-xl backdrop-blur-sm">
                    <div class="text-3xl font-bold text-primary">{{ timeLeft.days }}</div>
                    <div class="text-sm opacity-80">يوم</div>
                </div>
                <div class="p-4 shadow-md bg-card rounded-xl backdrop-blur-sm">
                    <div class="text-3xl font-bold text-primary">{{ timeLeft.hours }}</div>
                    <div class="text-sm opacity-80">ساعة</div>
                </div>
                <div class="p-4 shadow-md bg-card rounded-xl backdrop-blur-sm">
                    <div class="text-3xl font-bold text-primary">{{ timeLeft.minutes }}</div>
                    <div class="text-sm opacity-80">دقيقة</div>
                </div>
                <div class="p-4 shadow-md bg-card rounded-xl backdrop-blur-sm">
                    <div class="text-3xl font-bold text-primary">{{ timeLeft.seconds }}</div>
                    <div class="text-sm opacity-80">ثانية</div>
                </div>
            </div>

            <div class="p-4 rounded-lg shadow-md bg-card">
                <p class="!mb-0 text-base">
                    موعد المكافأة القادمة: <strong class="text-primary">{{ formatDate(nextPaymentDate) }}</strong>
                </p>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const calculateNextPaymentDate = (currentDate: Date): Date => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Start with the 27th of current month
    let paymentDate = new Date(year, month, 27)

    // Apply the adjustment rules first
    const dayOfWeek = paymentDate.getDay()
    if (dayOfWeek === 5) { // Friday
        paymentDate.setDate(26) // Move to Thursday
    } else if (dayOfWeek === 6) { // Saturday
        paymentDate.setDate(28) // Move to Sunday
    }

    // If we're past the payment date (including adjustments), move to next month
    if (currentDate.toDateString() === paymentDate.toDateString()) {
        // It's payment day today
        return paymentDate
    } else if (currentDate > paymentDate) {
        // Move to next month
        paymentDate = new Date(year, month + 1, 27)
        const nextDayOfWeek = paymentDate.getDay()
        if (nextDayOfWeek === 5) { // Friday
            paymentDate.setDate(26) // Move to Thursday
        } else if (nextDayOfWeek === 6) { // Saturday
            paymentDate.setDate(28) // Move to Sunday
        }
    }

    return paymentDate
}

const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
    const now = new Date()
    const difference = targetDate.getTime() - now.getTime()

    if (difference > 0) {
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        }
    } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
}

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })
}

// Initialize with server-side values
const currentDate = new Date()
const paymentDate = calculateNextPaymentDate(currentDate)

// Reactive state that works on both server and client
const timeLeft = ref<TimeLeft>(calculateTimeLeft(paymentDate))
const nextPaymentDate = ref<Date>(paymentDate)
const isPaymentDay = ref<boolean>(isToday(paymentDate))

// Update function that can be called both server and client side
const updateCountdown = () => {
    const now = new Date()
    const currentPaymentDate = calculateNextPaymentDate(now)

    // Update payment date if it has changed (moved to next month)
    if (nextPaymentDate.value.getTime() !== currentPaymentDate.getTime()) {
        nextPaymentDate.value = currentPaymentDate
    }

    // Update countdown
    timeLeft.value = calculateTimeLeft(currentPaymentDate)

    // Check if it's payment day
    isPaymentDay.value = isToday(currentPaymentDate)
}

// Timer reference for cleanup
let timer: NodeJS.Timeout | null = null

// Client-side hydration and timer setup
onMounted(() => {
    // Update immediately on mount to sync with client time
    updateCountdown()

    // Set up interval for real-time updates
    timer = setInterval(updateCountdown, 300)
})

onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
    }
})


updateCountdown()

function formatDay(days: number): string {
    console.log(days)
    switch (days) {
        case 1:
            return "يوم واحد"
        case 2:
            return "يومان"
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return `${days} أيام`
        default:
            return `${days} يوم`
    }
}

const seo = {
    title: `بعد ${formatDay(timeLeft.value.days)} تصرف المكافأة القادمة`,
    description: `تصرف المكافأة عند بداية يوم 
    ${formatDate(nextPaymentDate.value)}
    زر الموقع لتفاصيل أكثر وأدق`
};
useSeoMeta(seo);
</script>

<style scoped>
@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-10px);
    }

    60% {
        transform: translateY(-5px);
    }
}

.animate-bounce {
    animation: bounce 1s infinite;
}
</style>