
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PROCESS_FLOW } from './constants';
import type { ProcessStep } from './types';
import { StepStatus } from './types';
import { CheckCircleIcon, MicrophoneIcon, BranchIcon } from './components/icons';

const StepIndicator: React.FC<{ step: ProcessStep, status: StepStatus }> = ({ step, status }) => {
    const getStatusClasses = () => {
        switch (status) {
            case StepStatus.Completed:
                return {
                    iconContainer: 'bg-teal-500 border-teal-400',
                    icon: 'text-white',
                    text: 'text-gray-300',
                    line: 'bg-teal-500'
                };
            case StepStatus.Current:
                return {
                    iconContainer: 'bg-blue-500 border-blue-400 ring-4 ring-blue-500/30',
                    icon: 'text-white',
                    text: 'text-white font-bold',
                    line: 'bg-gray-700'
                };
            case StepStatus.Skipped:
                return {
                    iconContainer: 'bg-gray-600 border-gray-500',
                    icon: 'text-gray-400',
                    text: 'text-gray-500 line-through',
                    line: 'bg-gray-700'
                };
            default: // Pending
                return {
                    iconContainer: 'bg-gray-700 border-gray-600',
                    icon: 'text-gray-400',
                    text: 'text-gray-400',
                    line: 'bg-gray-700'
                };
        }
    };

    const { iconContainer, icon, text, line } = getStatusClasses();

    const isDecisionStep = !!step.decision;

    const Icon = isDecisionStep ? BranchIcon : CheckCircleIcon;

    return (
        <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${iconContainer} transition-all duration-300`}>
                   <Icon className={`w-6 h-6 ${icon}`} />
                </div>
                {!step.isFinal && <div className={`w-0.5 h-16 mt-2 ${line}`}></div>}
            </div>
            <div className="pt-1">
                <p className={`text-lg ${text} transition-colors duration-300`}>{step.title}</p>
            </div>
        </div>
    );
};

const CommandButton: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean; variant?: 'primary' | 'secondary' }> = ({ onClick, children, disabled = false, variant = 'primary' }) => {
    const baseClasses = "w-full text-left p-4 rounded-lg font-mono text-sm flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
    const variantClasses = variant === 'primary' 
        ? "bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500"
        : "bg-gray-700 hover:bg-gray-600 text-gray-300 focus:ring-gray-500";
    const disabledClasses = "disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed";

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses} ${disabledClasses}`}>
            <span>{children}</span>
            <span className="text-xs font-sans bg-black/20 px-2 py-1 rounded">EXECUTE</span>
        </button>
    );
}

const TypingEffect: React.FC<{ text: string, onComplete: () => void }> = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
                onComplete();
            }
        }, 20); // Faster typing speed
        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    return <p>{displayedText}</p>;
};

export default function App() {
    const [currentStepId, setCurrentStepId] = useState<number>(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());
    const [showResponse, setShowResponse] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const currentStep = useMemo(() => PROCESS_FLOW[currentStepId], [currentStepId]);

    const handleStepProgression = useCallback((nextStepId: number, skippedPath?: 'truePositive' | 'falsePositive') => {
        setIsProcessing(true);
        setShowResponse(false);

        setTimeout(() => {
            setCompletedSteps(prev => new Set(prev).add(currentStepId));

            if (skippedPath) {
                if (skippedPath === 'truePositive') {
                    setSkippedSteps(prev => new Set(prev).add(PROCESS_FLOW[4].decision!.falsePositive.nextStepId));
                } else {
                    setSkippedSteps(prev => new Set(prev).add(PROCESS_FLOW[4].decision!.truePositive.nextStepId));
                }
            }
            setCurrentStepId(nextStepId);
            setUserInput('');
            
            setTimeout(() => {
                setShowResponse(true);
                setIsProcessing(false);
            }, 300);

        }, 1000);

    }, [currentStepId]);

    const handleDecision = (decisionPath: 'truePositive' | 'falsePositive') => {
        if (!currentStep.decision) return;
        const nextStepId = currentStep.decision[decisionPath].nextStepId;
        const skippedPath = decisionPath === 'truePositive' ? 'falsePositive' : 'truePositive';
        handleStepProgression(nextStepId, skippedPath);
    };

    const handleTextInputSubmit = () => {
        if (!currentStep.nextStepId || userInput.trim() === '') return;
        handleStepProgression(currentStep.nextStepId);
    };

    const allSteps = useMemo(() => {
      return [
        PROCESS_FLOW[0],
        PROCESS_FLOW[1],
        PROCESS_FLOW[2],
        PROCESS_FLOW[3],
        PROCESS_FLOW[4],
        PROCESS_FLOW[5],
        PROCESS_FLOW[7],
        PROCESS_FLOW[9],
        PROCESS_FLOW[6],
        PROCESS_FLOW[8],
      ].filter((step, index, self) => self.findIndex(s => s.id === step.id) === index);
    }, []);

    const getStepStatus = (stepId: number): StepStatus => {
        if (currentStepId === stepId) return StepStatus.Current;
        if (completedSteps.has(stepId)) return StepStatus.Completed;
        if (skippedSteps.has(stepId)) return StepStatus.Skipped;
        return StepStatus.Pending;
    };
    
    useEffect(() => {
      // Show initial response on load
      const timer = setTimeout(() => setShowResponse(true), 500);
      return () => clearTimeout(timer);
    }, []);


    return (
        <div className="min-h-screen bg-gray-900 font-sans">
            <header className="bg-gray-900/80 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-center text-white">Flujo Interactivo de Cumplimiento Transaccional</h1>
                <p className="text-center text-gray-400 text-sm mt-1">Simulación de investigación de alertas con un Asistente de IA</p>
            </header>

            <main className="flex flex-col md:flex-row max-w-7xl mx-auto p-4 md:p-8 gap-8">
                <aside className="md:w-1/3 lg:w-1/4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-white">Pasos del Proceso</h2>
                        {allSteps.map(step => (
                            <StepIndicator key={step.id} step={step} status={getStepStatus(step.id)} />
                        ))}
                    </div>
                </aside>

                <section className="flex-1">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="mb-4">
                            <span className="text-blue-400 font-semibold">OC (Oficial de Cumplimiento)</span>
                            <p className="text-gray-300 mt-1">{currentStep.description}</p>
                        </div>

                        <div className="bg-gray-900 p-4 rounded-lg my-6">
                            <label className="text-xs text-gray-500 uppercase font-bold">Comando de Voz Simulado</label>
                            
                            {currentStep.decision ? (
                                <div className="mt-2 space-y-3">
                                    <CommandButton onClick={() => handleDecision('truePositive')} disabled={isProcessing} variant="primary">
                                        {currentStep.decision.truePositive.command}
                                    </CommandButton>
                                    <CommandButton onClick={() => handleDecision('falsePositive')} disabled={isProcessing} variant="secondary">
                                        {currentStep.decision.falsePositive.command}
                                    </CommandButton>
                                </div>
                            ) : currentStep.requiresInput ? (
                                <div className="mt-2">
                                    {currentStep.requiresInput === 'justification' && (
                                      <>
                                        <textarea 
                                          value={userInput}
                                          onChange={e => setUserInput(e.target.value)}
                                          placeholder="Ej: La transacción es consistente con el historial del cliente..." 
                                          className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200"
                                          rows={3}
                                        />
                                        <CommandButton onClick={handleTextInputSubmit} disabled={isProcessing || userInput.trim() === ''}>
                                            Enviar Justificación y Cerrar
                                        </CommandButton>
                                      </>
                                    )}
                                    {currentStep.requiresInput === 'voiceNote' && (
                                       <>
                                        <div className="flex items-center space-x-3 bg-gray-800 border border-gray-600 rounded-md p-3 mt-2">
                                            <MicrophoneIcon className="w-6 h-6 text-red-500 animate-pulse" />
                                            <textarea 
                                                value={userInput}
                                                onChange={e => setUserInput(e.target.value)}
                                                placeholder="Dicte o escriba su análisis aquí..." 
                                                className="flex-1 bg-transparent focus:outline-none text-gray-200 resize-none"
                                                rows={3}
                                            />
                                        </div>
                                        <CommandButton onClick={handleTextInputSubmit} disabled={isProcessing || userInput.trim() === ''}>
                                            Adjuntar Nota y Continuar
                                        </CommandButton>
                                      </>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-2">
                                    {!currentStep.isFinal && (
                                        <CommandButton onClick={() => handleStepProgression(currentStep.nextStepId!)} disabled={isProcessing}>
                                            {currentStep.command}
                                        </CommandButton>
                                    )}
                                </div>
                            )}
                        </div>

                        {showResponse && (
                           <div className="min-h-[100px]">
                              {currentStep.assistantResponse}
                           </div>
                        )}
                        
                    </div>
                </section>
            </main>
        </div>
    );
}
