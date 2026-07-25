import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { jobTitle, jobDescription, userAnswers } = body;

        const prompt = `
        You are an expert technical interviewer. I will provide you with the job details and a transcript of the mock interview questions and the user's answers.
        
        Job Title: ${jobTitle || 'General'}
        Job Description: ${jobDescription || 'General'}
        
        Interview Transcript:
        ${userAnswers.map((ua: any, index: number) => `Q${index + 1}: ${ua.question}\nUser's Answer: ${ua.answer}`).join('\n\n')}
        
        Based on the above transcript, please provide:
        1. A general rating out of 10.
        2. Constructive overall feedback on their performance.
        3. Specific areas of improvement.
        4. A brief suggestion on how to answer each question better.
        
        Return the result as a structured string formatted in Markdown.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const feedback = response.text || "No feedback generated.";

        return NextResponse.json({ feedback });
    } catch (error) {
        console.error("Feedback generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate feedback." },
            { status: 500 }
        );
    }
}
