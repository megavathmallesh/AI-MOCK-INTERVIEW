import React from 'react'
import { CheckCircle2, Upload, Target, MessageSquare } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: "Upload Your Resume",
    description: "Start by uploading your current resume in PDF format. Our system analyzes your experience, skills, and background to tailor the interview specifically to you.",
    icon: Upload,
  },
  {
    id: 2,
    title: "Provide Job Details",
    description: "Enter the job title and description of the role you're aiming for. This ensures the questions you practice are highly relevant to your target job.",
    icon: Target,
  },
  {
    id: 3,
    title: "AI Generates Questions",
    description: "Our advanced AI models cross-reference your resume with the job description to generate realistic, challenging mock interview questions.",
    icon: CheckCircle2,
  },
  {
    id: 4,
    title: "Practice & Get Feedback",
    description: "Answer the generated questions and receive instant, actionable feedback to improve your confidence and communication skills.",
    icon: MessageSquare,
  }
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Master your next interview in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="relative p-6 bg-slate-50 rounded-2xl border border-slate-100 dark:bg-neutral-900 dark:border-neutral-800 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 dark:bg-blue-900/30 dark:text-blue-400">
                <step.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3 dark:text-white">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
