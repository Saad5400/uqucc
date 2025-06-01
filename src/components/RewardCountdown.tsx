import React, { useState, useEffect } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const RewardCountdown: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [nextPaymentDate, setNextPaymentDate] = useState<Date>(new Date());
    const [isPaymentDay, setIsPaymentDay] = useState(false);

    const calculateNextPaymentDate = (currentDate: Date): Date => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Start with the 27th of current month
        let paymentDate = new Date(year, month, 27);
        
        // Apply the adjustment rules first
        const dayOfWeek = paymentDate.getDay();
        if (dayOfWeek === 5) { // Friday
            paymentDate.setDate(26); // Move to Thursday
        } else if (dayOfWeek === 6) { // Saturday
            paymentDate.setDate(28); // Move to Sunday
        }

        // If we're past the payment date (including adjustments), move to next month
        if (currentDate.toDateString() === paymentDate.toDateString()) {
            // It's payment day today
            return paymentDate;
        } else if (currentDate > paymentDate) {
            // Move to next month
            paymentDate = new Date(year, month + 1, 27);
            const nextDayOfWeek = paymentDate.getDay();
            if (nextDayOfWeek === 5) { // Friday
                paymentDate.setDate(26); // Move to Thursday
            } else if (nextDayOfWeek === 6) { // Saturday
                paymentDate.setDate(28); // Move to Sunday
            }
        }

        return paymentDate;
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    useEffect(() => {
        const currentDate = new Date();
        const paymentDate = calculateNextPaymentDate(currentDate);
        setNextPaymentDate(paymentDate);
        setIsPaymentDay(isToday(paymentDate));

        const timer = setInterval(() => {
            const now = new Date();
            const currentPaymentDate = calculateNextPaymentDate(now);

            // Update payment date if it has changed (moved to next month)
            setNextPaymentDate(prevDate => {
                const newDate = calculateNextPaymentDate(now);
                return prevDate.getTime() !== newDate.getTime() ? newDate : prevDate;
            });

            // Update countdown
            const difference = currentPaymentDate.getTime() - now.getTime();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }

            // Check if it's payment day
            setIsPaymentDay(isToday(currentPaymentDate));
        }, 1000);

        return () => clearInterval(timer);
    }, []); // Empty dependency array - only run once on mount

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    if (isPaymentDay) {
        return (
            <div className="shadow-lg text-primary bg-card-bg rounded-2xl p-8 text-center my-8 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-60" style={{
                    background: 'linear-gradient(45deg, rgba(var(--ifm-color-primary-rgb), 0.05) 25%, transparent 25%, transparent 75%, rgba(var(--ifm-color-primary-rgb), 0.05) 75%), linear-gradient(45deg, rgba(var(--ifm-color-primary-rgb), 0.05) 25%, transparent 25%, transparent 75%, rgba(var(--ifm-color-primary-rgb), 0.05) 75%)',
                    backgroundSize: '30px 30px',
                    backgroundPosition: '0 0, 15px 15px'
                }}></div>
                
                <div className="text-6xl mb-4 animate-bounce relative z-10">🎉💰🎊</div>
                
                <h2 className="text-primary mb-4 text-3xl font-bold relative z-10">مبروك! اليوم يوم صرف المكافأة</h2>
                
                <p className="text-xl text-primary opacity-80 mb-6 relative z-10">
                    ممكن تاخذ حتى 24 ساعة عشان توصل المكافأة لحسابك
                </p>
                
                {/* Add some CSS animation styles */}
                <style>{`
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% {
                            transform: translateY(0);
                        }
                        40% {
                            transform: translateY(-10px);
                        }
                        60% {
                            transform: translateY(-5px);
                        }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <>
            <div className="text-primary grid grid-cols-4 gap-4 mb-6">
                <div className="shadow-md bg-card-bg rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-3xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm opacity-80">يوم</div>
                </div>
                <div className="shadow-md bg-card-bg rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-3xl font-bold">{timeLeft.hours}</div>
                    <div className="text-sm opacity-80">ساعة</div>
                </div>
                <div className="shadow-md bg-card-bg rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-sm opacity-80">دقيقة</div>
                </div>
                <div className="shadow-md bg-card-bg rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-sm opacity-80">ثانية</div>
                </div>
            </div>

            <div className="shadow-md text-primary bg-card-bg rounded-lg p-4">
                <p className="!mb-0 text-base">
                    موعد المكافأة القادمة: <strong>{formatDate(nextPaymentDate)}</strong>
                </p>
            </div>
        </>
    );
};

export default RewardCountdown;
