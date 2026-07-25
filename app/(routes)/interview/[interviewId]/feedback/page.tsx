"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function FeedbackPage() {
    const { interviewId } = useParams();
    const router = useRouter();
    const convex = useConvex();

    const [interviewData, setInterviewData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (interviewId) {
            fetchInterviewDetails();
        }
    }, [interviewId]);

    const fetchInterviewDetails = async () => {
        try {
            const result = await convex.query(api.Interview.GetInterviewQuestions, {
                interviewRecordId: interviewId as Id<"InterviewSessionTable">
            });
            setInterviewData(result);
        } catch (error) {
            console.error("Error fetching interview details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!interviewData) {
        return (
            <div className="flex flex-col h-screen items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Interview Not Found</h2>
                <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-10 max-w-5xl">
            <Button variant="ghost" className="mb-6 pl-0" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="bg-card text-card-foreground shadow-sm border rounded-xl p-6 md:p-10 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <h1 className="text-3xl font-bold">Interview Feedback</h1>
                </div>

                <p className="text-muted-foreground mb-8 text-lg">
                    Here is your personalized feedback and performance review for the <span className="font-semibold text-primary">{interviewData.jobTitle || 'General'}</span> mock interview.
                </p>

                <div className="prose prose-blue max-w-none dark:prose-invert">
                    {interviewData.feedback ? (
                        <ReactMarkdown>{interviewData.feedback}</ReactMarkdown>
                    ) : (
                        <p className="text-muted-foreground italic">No feedback was generated for this interview.</p>
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 mt-10">Your Answers Transcript</h2>
            <div className="space-y-6">
                {interviewData.userAnswers && interviewData.userAnswers.length > 0 ? (
                    interviewData.userAnswers.map((item: any, index: number) => (
                        <div key={index} className="border rounded-lg p-6 bg-muted/20">
                            <h3 className="font-semibold text-lg mb-3">Q{index + 1}: {item.question}</h3>
                            <div className="bg-background border rounded p-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Your Answer</span>
                                <p>{item.answer || <span className="italic text-muted-foreground">No answer provided</span>}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground italic">No answers were recorded for this interview.</p>
                )}
            </div>
        </div>
    );
}

export default FeedbackPage;
