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
        let paymentDate = new Date(year, month, 28);
        
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
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                color: 'white',
                margin: '2rem 0',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated background elements */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)',
                    backgroundSize: '30px 30px',
                    backgroundPosition: '0 0, 15px 15px',
                    opacity: 0.3
                }}></div>
                
                <div style={{ 
                    fontSize: '4rem', 
                    marginBottom: '1rem',
                    animation: 'bounce 2s infinite',
                    position: 'relative',
                    zIndex: 1
                }}>🎉💰🎊</div>
                
                <h2 style={{ 
                    color: 'white', 
                    marginBottom: '1rem',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    position: 'relative',
                    zIndex: 1
                }}>مبروك! اليوم يوم صرف المكافأة</h2>
                
                <p style={{ 
                    fontSize: '1.3rem', 
                    opacity: 0.95,
                    marginBottom: '1.5rem',
                    position: 'relative',
                    zIndex: 1
                }}>
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
            <div style={{
                color: 'var(--ifm-color-primary)',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    boxShadow: '0 1.5px 3px 0 rgb(0 0 0 / 15%)',
                    background: 'var(--ifm-card-background-color)',
                    borderRadius: '12px',
                    padding: '1rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft.days}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>يوم</div>
                </div>
                <div style={{
                    boxShadow: '0 1.5px 3px 0 rgb(0 0 0 / 15%)',
                    background: 'var(--ifm-card-background-color)',
                    borderRadius: '12px',
                    padding: '1rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft.hours}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>ساعة</div>
                </div>
                <div style={{
                    boxShadow: '0 1.5px 3px 0 rgb(0 0 0 / 15%)',
                    background: 'var(--ifm-card-background-color)',
                    borderRadius: '12px',
                    padding: '1rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft.minutes}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>دقيقة</div>
                </div>
                <div style={{
                    boxShadow: '0 1.5px 3px 0 rgb(0 0 0 / 15%)',
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
                boxShadow: '0 1.5px 3px 0 rgb(0 0 0 / 15%)',
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
