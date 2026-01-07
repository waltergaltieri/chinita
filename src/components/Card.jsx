import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';

export const Card = ({ data, onVote, disabled }) => {
    const cardRef = useRef(null);
    const controls = useAnimation();
    const x = useMotionValue(0);

    // Rotation based on x position
    const rotate = useTransform(x, [-200, 200], [-25, 25]);

    // Badge Opacity
    const opacityVictoria = useTransform(x, [-150, -20], [1, 0]);
    const opacityWalter = useTransform(x, [20, 150], [0, 1]);

    const handleDragEnd = async (event, info) => {
        if (disabled) return;

        const offset = info.offset.x;
        const velocity = info.velocity.x;
        const threshold = 100;

        if (offset < -threshold || velocity < -500) {
            // Swipe Left -> Victoria
            await controls.start({ x: -500, rotate: -30, opacity: 0, transition: { duration: 0.3 } });
            onVote('Victoria');
        } else if (offset > threshold || velocity > 500) {
            // Swipe Right -> Walter
            await controls.start({ x: 500, rotate: 30, opacity: 0, transition: { duration: 0.3 } });
            onVote('Walter');
        } else {
            // Snap back
            controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        }
    };

    // Reset animation when data changes (new card)
    useEffect(() => {
        x.set(0);
        controls.set({ x: 0, rotate: 0, opacity: 1 });
        controls.start({
            scale: [0.9, 1],
            opacity: [0, 1],
            transition: { duration: 0.4 }
        });
    }, [data.id, controls, x]);

    return (
        <motion.div
            ref={cardRef}
            className="card"
            style={{ x, rotate, touchAction: 'none' }}
            drag={disabled ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            animate={controls}
        >
            {/* Badges */}
            <motion.div className="vote-badge badge-victoria" style={{ opacity: opacityVictoria }}>
                VICTORIA
            </motion.div>
            <motion.div className="vote-badge badge-walter" style={{ opacity: opacityWalter }}>
                WALTER
            </motion.div>

            <div className="card-content">
                <h3>{data.question}</h3>
            </div>

            <p className="card-instruction">
                ⬅️ Victoria &nbsp;|&nbsp; Walter ➡️
            </p>
        </motion.div>
    );
};
