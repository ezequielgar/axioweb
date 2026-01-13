import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface AxioLogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function AxioLogo({ className = '', size = 'md' }: AxioLogoProps) {
    const [isExiting, setIsExiting] = useState(false);
    const navigate = useNavigate();

    const sizeClasses = {
        sm: 'h-12',
        md: 'h-16',
        lg: 'h-20'
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsExiting(true);

        // Esperar a que termine la animación antes de navegar
        setTimeout(() => {
            navigate('/');
        }, 800);
    };

    return (
        <motion.a
            href="/"
            onClick={handleClick}
            className={`inline-block cursor-pointer ${className}`}
            initial={{ scale: 1, opacity: 1 }}
            animate={isExiting ? {
                rotate: 720,
                scale: 0,
                opacity: 0
            } : {
                scale: 1,
                opacity: 1
            }}
            transition={{
                duration: isExiting ? 0.8 : 0.3,
                ease: isExiting ? [0.6, 0.01, 0.05, 0.95] : 'easeOut'
            }}
            whileHover={!isExiting ? {
                scale: 1.05,
                filter: 'brightness(1.2)'
            } : {}}
            whileTap={!isExiting ? { scale: 0.95 } : {}}
            style={{
                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 16px rgba(59, 130, 246, 0.3))',
            }}
        >
            <motion.img
                src="/logo_true.png"
                alt="AXIO IT Outsourcing"
                className={`${sizeClasses[size]} w-auto`}
                animate={!isExiting ? {
                    filter: [
                        'brightness(1) drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))',
                        'brightness(1.1) drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))',
                        'brightness(1) drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))'
                    ]
                } : {}}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
        </motion.a>
    );
}
