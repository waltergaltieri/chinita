import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { GAME_DATA } from './data';
import { Card } from './components/Card';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { BackgroundParticles } from './components/BackgroundParticles';

function App() {
    const [status, setStatus] = useState('splash'); // splash | playing | loading | result
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [analysisLines, setAnalysisLines] = useState([]);

    const currentQuestion = GAME_DATA.questions[currentIdx];

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8B5CF6', '#3B82F6', '#ffffff']
        });
    };

    const handleStart = () => {
        setStatus('playing');
        setCurrentIdx(0);
        setScore(0);
        setFeedback(null);
    };

    const handleVote = (vote) => {
        if (feedback) return;

        const isCorrect = vote === currentQuestion.correctAnswer;

        if (navigator.vibrate) {
            navigator.vibrate(isCorrect ? 15 : 40);
        }

        if (isCorrect) {
            setScore(prev => prev + 1);
            triggerConfetti();
        }

        setFeedback({
            isCorrect,
            text: isCorrect ? currentQuestion.onCorrect : currentQuestion.onWrong,
            correctAnswer: currentQuestion.correctAnswer
        });
    };

    const handleContinue = () => {
        setFeedback(null);

        if (currentIdx < GAME_DATA.questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
        } else {
            startLoadingSequence();
        }
    };

    const startLoadingSequence = () => {
        setStatus('loading');
        setAnalysisLines([]);

        const lines = [
            "📊 Contando palabras...",
            "☕ Detectando mate...",
            "🧠 Analizando ironías...",
            "❤️ Midiendo nivel de enamoramiento..."
        ];

        lines.forEach((line, index) => {
            setTimeout(() => {
                setAnalysisLines(prev => [...prev, line]);
            }, 500 + (index * 800));
        });

        setTimeout(() => {
            setStatus('result');
        }, 4500);
    };

    const handleShare = async () => {
        const total = GAME_DATA.questions.length;
        const pct = Math.round((score / total) * 100);
        const text = `Hice un juego con nuestra llamada… saqué ${pct}% (${score}/${total} aciertos) ❤️`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Victoria vs Walter',
                    text: text,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            navigator.clipboard.writeText(text);
            alert('¡Copiado al portapapeles!');
        }
    };

    // --- RENDERERS ---

    if (status === 'splash') {
        return (
            <>
                <BackgroundParticles />
                <div className="screen-container" style={{ justifyContent: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ margin: 'auto', textAlign: 'center', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}
                    >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h1 className="title-gradient">Victoria vs Walter</h1>
                            <p style={{ color: '#6B7280', marginBottom: '40px', fontSize: '1.1rem', letterSpacing: '0.5px' }}>EL DESAFÍO DEFINITIVO</p>

                            {/* Removed glass-card wrapper for a cleaner "text on background" look */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="whitespace-pre-line splash-text-clean"
                            >
                                {GAME_DATA.startScreenText}
                            </motion.div>
                        </div>

                        <motion.div style={{ paddingBottom: '20px' }}>
                            <motion.button
                                className="btn-primary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{ scale: [1, 1.03, 1] }}
                                transition={{ scale: { duration: 2, repeat: Infinity } }}
                                style={{ fontSize: '1.2rem', padding: '20px' }}
                                onClick={handleStart}
                            >
                                EMPEZAR
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </>
        );
    }

    // Include Background for all other screens too
    const CommonLayout = ({ children }) => (
        <>
            <BackgroundParticles />
            {children}
        </>
    );

    if (status === 'loading') {
        return (
            <CommonLayout>
                <div className="screen-container" style={{ justifyContent: 'center', textAlign: 'left' }}>
                    <div className="glass-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
                        <div className="loader" style={{ width: '56px', height: '56px', border: '5px solid #E5E7EB', borderTopColor: '#8B5CF6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }}></div>
                        <h2 style={{ marginBottom: '16px', color: '#4B5563' }}>{GAME_DATA.endScreenTitle}</h2>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', textAlign: 'left', display: 'inline-block' }}>
                            {analysisLines.map((line, i) => (
                                <li key={i} style={{ padding: '8px 0', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {line}
                                </li>
                            ))}
                        </ul>
                        <p style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>{GAME_DATA.endScreenLoadingText}</p>
                    </div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </CommonLayout>
        );
    }

    if (status === 'result') {
        const total = GAME_DATA.questions.length;
        const pct = Math.round((score / total) * 100);

        return (
            <CommonLayout>
                <div className="screen-container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ margin: 'auto', textAlign: 'center', width: '100%' }}
                    >
                        <h2 className="title-gradient" style={{ fontSize: '2rem', marginBottom: '24px' }}>Resultados</h2>

                        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-around', padding: '24px', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Aciertos</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#8B5CF6' }}>{score}/{total}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Efectividad</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3B82F6' }}>{pct}%</div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
                            <p className="whitespace-pre-line" style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6, color: '#374151' }}>
                                {GAME_DATA.endScreenText}
                            </p>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#6B7280', fontStyle: 'italic', marginBottom: '24px' }}>
                            Gracias por jugar conmigo.<br />Prefiero seguir esta historia fuera de la pantalla.
                        </p>

                        <button className="btn-primary" onClick={handleStart} style={{ marginBottom: '12px' }}>Jugar de nuevo</button>
                        <button className="btn-primary" onClick={handleShare} style={{ background: 'white', color: '#1F2937', border: '1px solid #E5E7EB', boxShadow: 'none' }}>Compartir</button>
                    </motion.div>
                </div>
            </CommonLayout>
        );
    }

    // PLAYING STATE
    return (
        <CommonLayout>
            <div className="screen-container">
                {/* Header */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#4B5563', fontWeight: 600 }}>
                        <span>Pregunta {currentIdx + 1} / {GAME_DATA.questions.length}</span>
                        <span>{score} Aciertos</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIdx) / GAME_DATA.questions.length) * 100}%` }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)' }}
                        />
                    </div>
                </div>

                {/* Card Area */}
                <div className="card-stack">
                    <Card
                        key={currentQuestion.id}
                        data={currentQuestion}
                        onVote={handleVote}
                        disabled={!!feedback}
                    />
                    <FeedbackOverlay
                        feedback={feedback}
                        onContinue={handleContinue}
                    />
                </div>

                {/* Controls */}
                <div style={{ marginTop: 'auto', textAlign: 'center', opacity: feedback ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            className="btn-primary bg-victoria"
                            onClick={() => handleVote('Victoria')}
                            disabled={!!feedback}
                            aria-label="Victoria"
                        >
                            Victoria
                        </button>
                        <button
                            className="btn-primary bg-walter"
                            onClick={() => handleVote('Walter')}
                            disabled={!!feedback}
                            aria-label="Walter"
                        >
                            Walter
                        </button>
                    </div>
                </div>
            </div>
        </CommonLayout>
    );
}

export default App;
