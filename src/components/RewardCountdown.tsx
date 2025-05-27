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

        // If we're past the 27th (or adjusted date), move to next month
        if (currentDate > paymentDate) {
            paymentDate = new Date(year, month + 1, 27);
        }

        // Apply the adjustment rules
        const dayOfWeek = paymentDate.getDay();

        if (dayOfWeek === 5) { // Friday
            paymentDate.setDate(26); // Move to Thursday
        } else if (dayOfWeek === 6) { // Saturday
            paymentDate.setDate(28); // Move to Sunday
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
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                color: 'white',
                margin: '2rem 0',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ color: 'white', marginBottom: '1rem' }}>مبروك! اليوم يوم صرف المكافأة</h2>
                <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                    يتم صرف المكافآت اليوم - {formatDate(new Date())}
                </p>
                <div style={{
                    background: 'var(--ifm-card-background-color)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '1rem'
                }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        تحقق من حسابك البنكي لاستلام المكافأة
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{
                color: 'var(--ifm-color-primary)',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    background: 'var(--ifm-card-background-color)',
                    borderRadius: '12px',
                    padding: '1rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft.days}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>يوم</div>
                </div>
                <div style={{
                    background: 'var(--ifm-card-background-color)',
                    borderRadius: '12px',
                    padding: '1rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft.hours}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>ساعة</div>
                </div>
                <div style={{
                    background: 'var(--ifm-card-background-color)',
                    borderRadius: '12px',
                    padding: '1rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft.minutes}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>دقيقة</div>
                </div>
                <div style={{
                    background: 'var(--ifm-card-background-color)',
                    borderRadius: '12px',
                    padding: '1rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft.seconds}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>ثانية</div>
                </div>
            </div>

            <div style={{
                color: 'var(--ifm-color-primary)',
                background: 'var(--ifm-card-background-color)',
                borderRadius: '8px',
                padding: '1rem'
            }}>
                <p style={{ margin: 0, fontSize: '1rem' }}>
                    موعد المكافأة القادمة: <strong>{formatDate(nextPaymentDate)}</strong>
                </p>
            </div>
        </>
    );
};

export default RewardCountdown;
