<template>
  <div class="mb-4">
    <!-- Payment Day Celebration -->
    <div
      v-if="isPaymentDay"
      class="relative p-8 my-8 overflow-hidden text-center shadow-lg text-primary bg-card-bg rounded-2xl"
    >
      <!-- Animated background elements -->
      <div
        class="absolute inset-0 opacity-60"
        :style="{
          background:
            'linear-gradient(45deg, rgba(var(--color-primary-rgb), 0.05) 25%, transparent 25%, transparent 75%, rgba(var(--color-primary-rgb), 0.05) 75%), linear-gradient(45deg, rgba(var(--color-primary-rgb), 0.05) 25%, transparent 25%, transparent 75%, rgba(var(--color-primary-rgb), 0.05) 75%)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }"
      ></div>

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
      <div class="grid grid-cols-4 gap-4 mb-0">
        <div class="p-4 shadow-md bg-card rounded-xl backdrop-blur-sm">
          <div class="text-3xl font-bold text-primary">{{ timeLeft.days }}</div>
          <div class="text-sm opacity-80">يوم</div>
        </div>
        <div class="p-4 shadow-md bg-card rounded-xl backdrop-blur-sm">
          <div class="text-3xl font-bold text-primary">
            {{ timeLeft.hours }}
          </div>
          <div class="text-sm opacity-80">ساعة</div>
        </div>
        <div class="p-4 shadow-md bg-card rounded-xl backdrop-blur-sm">
          <div class="text-3xl font-bold text-primary">
            {{ timeLeft.minutes }}
          </div>
          <div class="text-sm opacity-80">دقيقة</div>
        </div>
        <div class="p-4 shadow-md bg-card rounded-xl backdrop-blur-sm">
          <div class="text-3xl font-bold text-primary">
            {{ timeLeft.seconds }}
          </div>
          <div class="text-sm opacity-80">ثانية</div>
        </div>
      </div>

      <div class="p-4 rounded-lg shadow-md bg-card">
        <p class="!mb-0 text-base">
          موعد المكافأة القادمة:
          <strong class="text-primary">{{
            formatDate(nextPaymentDate)
          }}</strong>
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

const RIYADH_TIMEZONE = 'Asia/Riyadh';
const PAYMENT_DAY = 27;

/**
 * Gets the current date and time in Riyadh timezone as a UTC Date object
 * This ensures consistent calculations across server and client
 */
const getCurrentRiyadhDate = (): Date => {
  // Get current time in Riyadh timezone using Intl API
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: RIYADH_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(new Date());
  const dateComponents = {
    year: parseInt(parts.find(p => p.type === 'year')!.value),
    month: parseInt(parts.find(p => p.type === 'month')!.value) - 1, // Month is 0-indexed
    day: parseInt(parts.find(p => p.type === 'day')!.value),
    hour: parseInt(parts.find(p => p.type === 'hour')!.value),
    minute: parseInt(parts.find(p => p.type === 'minute')!.value),
    second: parseInt(parts.find(p => p.type === 'second')!.value)
  };

  // Create UTC date that represents the current Riyadh time
  return new Date(Date.UTC(
    dateComponents.year,
    dateComponents.month,
    dateComponents.day,
    dateComponents.hour,
    dateComponents.minute,
    dateComponents.second
  ));
};

/**
 * Creates a UTC Date object representing a specific Riyadh date/time
 */
const createRiyadhDateInUTC = (year: number, month: number, day: number, hour = 0, minute = 0, second = 0): Date => {
  return new Date(Date.UTC(year, month, day, hour, minute, second));
};

/**
 * Adjusts payment date if it falls on Friday or Saturday
 * Friday moves to Thursday, Saturday moves to Sunday
 */
const adjustPaymentDateForWeekend = (year: number, month: number, day: number): Date => {
  const date = createRiyadhDateInUTC(year, month, day);
  const dayOfWeek = date.getUTCDay();
  
  if (dayOfWeek === 5) { // Friday
    return createRiyadhDateInUTC(year, month, day - 1); // Move to Thursday
  } else if (dayOfWeek === 6) { // Saturday
    return createRiyadhDateInUTC(year, month, day + 1); // Move to Sunday
  }
  
  return date;
};

/**
 * Calculates the next payment date based on current Riyadh time
 * Returns a UTC Date object for consistent calculations
 */
const calculateNextPaymentDate = (): Date => {
  const currentRiyadhDate = getCurrentRiyadhDate();
  const year = currentRiyadhDate.getUTCFullYear();
  const month = currentRiyadhDate.getUTCMonth();
  const day = currentRiyadhDate.getUTCDate();

  // Start with the payment day of current month
  let paymentDate = adjustPaymentDateForWeekend(year, month, PAYMENT_DAY);

  // Check if we need to move to next month
  const todayUTC = createRiyadhDateInUTC(year, month, day);
  
  if (todayUTC > paymentDate) {
    // Move to next month
    const nextMonth = month + 1;
    const nextYear = nextMonth > 11 ? year + 1 : year;
    const adjustedMonth = nextMonth > 11 ? 0 : nextMonth;
    paymentDate = adjustPaymentDateForWeekend(nextYear, adjustedMonth, PAYMENT_DAY);
  }

  return paymentDate;
};

const isToday = (paymentDate: Date): boolean => {
  const currentRiyadhDate = getCurrentRiyadhDate();
  return (
    currentRiyadhDate.getUTCFullYear() === paymentDate.getUTCFullYear() &&
    currentRiyadhDate.getUTCMonth() === paymentDate.getUTCMonth() &&
    currentRiyadhDate.getUTCDate() === paymentDate.getUTCDate()
  );
};

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const now = getCurrentRiyadhDate();
  const difference = targetDate.getTime() - now.getTime();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  } else {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};

const formatDate = (date: Date): string => {
  // Convert UTC date to display in Riyadh timezone and Hijri calendar
  return date.toLocaleDateString("ar-SA-u-ca-islamic", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: RIYADH_TIMEZONE,
  });
};

// Initialize with server-side values using UTC
const paymentDate = calculateNextPaymentDate();

// Reactive state that works on both server and client
const timeLeft = ref<TimeLeft>(calculateTimeLeft(paymentDate));
const nextPaymentDate = ref<Date>(paymentDate);
const isPaymentDay = ref<boolean>(isToday(paymentDate));

// Update function that can be called both server and client side
const updateCountdown = () => {
  const currentPaymentDate = calculateNextPaymentDate();

  // Update payment date if it has changed (moved to next month)
  if (nextPaymentDate.value.getTime() !== currentPaymentDate.getTime()) {
    nextPaymentDate.value = currentPaymentDate;
  }

  // Update countdown
  timeLeft.value = calculateTimeLeft(currentPaymentDate);

  // Check if it's payment day
  isPaymentDay.value = isToday(currentPaymentDate);
};

// Timer reference for cleanup
let timer: NodeJS.Timeout | null = null;

// Client-side hydration and timer setup
onMounted(() => {
  // Update immediately on mount to sync with client time
  updateCountdown();

  // Set up interval for real-time updates (every second)
  timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

updateCountdown();

function formatDay(days: number): string {
  console.log(days);
  switch (days) {
    case 1:
      return "يوم واحد";
    case 2:
      return "يومان";
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      return `${days} أيام`;
    default:
      return `${days} يوم`;
  }
}

const seo = {
  title: `بعد ${formatDay(timeLeft.value.days)} تصرف المكافأة القادمة`,
  description: `تصرف المكافأة عند بداية يوم 
    ${formatDate(nextPaymentDate.value)}
    زر الموقع لتفاصيل أكثر وأدق`,
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
