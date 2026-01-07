import React from 'react';
import { motion } from 'framer-motion';

export const FeedbackOverlay = ({ feedback, onContinue }) => {
    if (!feedback) return null;

    const isCorrect = feedback.isCorrect;

    return (
        <motion.div
            className="feedback-overlay-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
        >
            <div className={`feedback-card ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                <div className="feedback-header">
                    <span className="feedback-icon">{isCorrect ? '✅' : '❌'}</span>
                    <h2>{isCorrect ? '¡Correcto!' : 'Incorrecto'}</h2>
                </div>

                <div className="feedback-body">
                    <p className="feedback-message">{feedback.text}</p>
                    <div className="feedback-divider"></div>
                    <p className="correct-answer-label">
                        Respuesta correcta: <strong>{feedback.correctAnswer}</strong>
                    </p>
                </div>

                <button className="btn-continue" onClick={onContinue}>
                    Continuar ➜
                </button>
            </div>
        </motion.div>
    );
};
