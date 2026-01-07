import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundParticles = () => {
    // Generate random particles
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // random start horizontal %
        duration: Math.random() * 10 + 10, // random duration between 10-20s
        delay: Math.random() * 10,
        size: Math.random() * 15 + 5 // size 5-20px
    }));

    return (
        <div className="animated-background">
            <div className="bg-gradient-overlay" />

            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="rising-particle"
                    style={{
                        left: `${p.x}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    initial={{ bottom: '-10%', opacity: 0 }}
                    animate={{
                        bottom: '120%',
                        opacity: [0, 0.6, 0] // Fade in, then fade out
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Kept a couple of soft orbs for ambient color, but subtler */}
            <div className="ambient-glow glow-victoria" />
            <div className="ambient-glow glow-walter" />
        </div>
    );
};
