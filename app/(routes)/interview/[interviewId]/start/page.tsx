"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Mic, MicOff, Volume2, ArrowRight, Save, Loader2, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

type InterviewData = {
    jobTitle: string | null;
    jobDescription: string | null;
    interviewQuestions: { question: string; answer?: string }[];
    userId: string | null;
    _id: string;
};

type UserAnswer = {
    question: string;
    answer: string;
};

function StartInterview() {
    const { interviewId } = useParams();
    const router = useRouter();
    const convex = useConvex();
    const saveAnswers = useMutation(api.Interview.SaveInterviewAnswersAndFeedback);
    
    const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        GetInterviewQuestions();
        
        // Initialize Speech Recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                
                recognitionRef.current.onresult = (event: any) => {
                    let interimTranscript = '';
                    let finalTranscript = '';
                    
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }
                    
                    if (finalTranscript) {
                        setCurrentAnswer(prev => prev + (prev ? ' ' : '') + finalTranscript);
                    }
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsRecording(false);
                };
                
                recognitionRef.current.onend = () => {
                    setIsRecording(false);
                };
            } else {
                console.warn("Speech Recognition not supported in this browser.");
            }
        }
    }, [interviewId]);

    const GetInterviewQuestions = async () => {
        if (!interviewId) return;
        const result = await convex.query(api.Interview.GetInterviewQuestions, {
            interviewRecordId: interviewId as Id<"InterviewSessionTable">
        });
        
        let questions = result?.interviewQuestions;
        if (typeof questions === 'string') {
            try {
                questions = JSON.parse(questions);
            } catch (e) {
                console.error("Failed to parse interview questions", e);
                questions = [];
            }
        }
        
        setInterviewData({
            ...result,
            interviewQuestions: questions || []
        } as unknown as InterviewData);
    };

    const textToSpeech = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        } else {
            toast.error("Text-to-speech not supported in this browser.");
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                    setIsRecording(true);
                    toast.success("Recording started...");
                } catch (e) {
                    console.error(e);
                    toast.error("Could not start recording.");
                }
            } else {
                toast.error("Speech recognition not supported in your browser.");
            }
        }
    };

    const handleSaveAnswer = () => {
        if (!currentAnswer.trim()) {
            return false;
        }
        
        const questionText = interviewData?.interviewQuestions[currentQuestionIndex]?.question || '';
        
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = {
            question: questionText,
            answer: currentAnswer
        };
        setUserAnswers(newAnswers);
        return true;
    };

    const nextQuestion = () => {
        const hasAnswer = handleSaveAnswer();
        if (!hasAnswer && !currentAnswer.trim()) {
             toast.error("Please provide an answer before moving on.");
             return;
        }
        if (currentQuestionIndex < (interviewData?.interviewQuestions?.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentAnswer(userAnswers[currentQuestionIndex + 1]?.answer || '');
        }
    };

    const finishInterview = async () => {
        if (!currentAnswer.trim()) {
            toast.error("Please provide an answer before finishing.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            const finalAnswers = [...userAnswers];
            const currentQ = interviewData?.interviewQuestions[currentQuestionIndex]?.question || '';
            finalAnswers[currentQuestionIndex] = { question: currentQ, answer: currentAnswer };
            setUserAnswers(finalAnswers);

            // Request AI Feedback
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobTitle: interviewData?.jobTitle,
                    jobDescription: interviewData?.jobDescription,
                    userAnswers: finalAnswers
                })
            });

            if (!response.ok) {
                throw new Error("Failed to generate feedback");
            }

            const { feedback } = await response.json();

            await saveAnswers({
                interviewRecordId: interviewId as Id<"InterviewSessionTable">,
                userAnswers: finalAnswers,
                feedback: feedback
            });

            toast.success("Interview completed! Feedback generated.");
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while saving the interview.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!interviewData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const currentQuestion = interviewData.interviewQuestions[currentQuestionIndex];

    return (
        <div className="container mx-auto p-4 md:p-10 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-6">
                
                {/* Left Panel - Question & Controls */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-card text-card-foreground shadow-sm border rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1} of {interviewData.interviewQuestions.length}</h2>
                            <button 
                                onClick={() => textToSpeech(currentQuestion?.question || '')}
                                className="p-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                                title="Listen to question"
                            >
                                <Volume2 className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <p className="text-lg md:text-xl font-medium mb-8 leading-relaxed">
                            {currentQuestion?.question}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-muted-foreground">Your Answer</label>
                                <button 
                                    onClick={toggleRecording}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        isRecording 
                                        ? 'bg-destructive text-destructive-foreground animate-pulse' 
                                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    } cursor-pointer`}
                                >
                                    {isRecording ? (
                                        <><StopCircle className="h-4 w-4" /> Stop Recording</>
                                    ) : (
                                        <><Mic className="h-4 w-4" /> Start Recording</>
                                    )}
                                </button>
                            </div>
                            
                            <textarea
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                placeholder="Type your answer here or use the microphone to dictate..."
                                className="w-full h-48 p-4 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            {currentQuestionIndex < interviewData.interviewQuestions.length - 1 ? (
                                <button 
                                    onClick={nextQuestion}
                                    className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center gap-2 font-medium cursor-pointer"
                                >
                                    Next Question <ArrowRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button 
                                    onClick={finishInterview}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center gap-2 font-medium cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                                    ) : (
                                        <><Save className="h-4 w-4" /> Finish & Get Feedback</>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Conversation History */}
                <div className="flex-1 bg-card text-card-foreground shadow-sm border rounded-xl flex flex-col h-[600px] overflow-hidden">
                    <div className="p-4 border-b bg-muted/30">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            Conversation History
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {userAnswers.length === 0 && currentQuestionIndex === 0 && !currentAnswer && (
                            <div className="text-center text-muted-foreground py-10">
                                Your interview conversation will appear here.
                            </div>
                        )}
                        
                        {userAnswers.map((ua, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex justify-start">
                                    <div className="bg-secondary/50 p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm">
                                        <span className="font-semibold block mb-1 text-primary">Interviewer (Q{idx + 1})</span>
                                        {ua.question}
                                    </div>
                                </div>
                                {ua.answer && (
                                    <div className="flex justify-end">
                                        <div className="bg-primary p-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm text-primary-foreground">
                                            <span className="font-semibold block mb-1 opacity-80">You</span>
                                            {ua.answer}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Render Current In-Progress Answer */}
                        <div className="space-y-4">
                            <div className="flex justify-start">
                                <div className="bg-secondary/50 p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm border-l-2 border-primary">
                                    <span className="font-semibold block mb-1 text-primary">Interviewer (Current)</span>
                                    {currentQuestion?.question}
                                </div>
                            </div>
                            {currentAnswer && (
                                <div className="flex justify-end">
                                    <div className="bg-primary/90 p-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm text-primary-foreground">
                                        <span className="font-semibold block mb-1 opacity-80">You (Typing...)</span>
                                        {currentAnswer}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default StartInterview;