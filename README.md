# AI Mock Interview Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://ai-mock-interview-eight-wheat.vercel.app/)

Master Your Job Interview with AI-Powered Practice and Feedback!

[**Visit the Live App**](https://ai-mock-interview-eight-wheat.vercel.app/)

Practice real interview questions with AI, get instant feedback, and improve your confidence, communication, and problem-solving skills to land your dream job.

## 🚀 Features
- **AI-Powered Mock Interviews:** Realistic interview scenarios generated dynamically using Google GenAI.
- **Instant & Actionable Feedback:** Get comprehensive feedback on your answers to improve quickly.
- **Secure Authentication:** Seamless user login and management powered by Clerk.
- **Real-time Database:** Fast, reliable, and scalable backend data syncing with Convex.
- **Beautiful & Modern UI:** Sleek, responsive, and accessible design built with Tailwind CSS, Shadcn UI, and smooth animations via Motion.
- **Resume Uploading:** Upload your resume in PDF format to get a tailored mock interview experience.
- **Enhanced Security:** Application security and rate limiting protected by Arcjet.

## 🛠️ Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Frontend Library:** React 19
- **Styling:** Tailwind CSS v4, [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Motion](https://motion.dev/)
- **Backend / DB:** [Convex](https://www.convex.dev/)
- **Authentication:** [Clerk](https://clerk.com/)
- **AI Model:** Google GenAI
- **Security:** [Arcjet](https://arcjet.com/)

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd ai-mock-interview
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the necessary environment variables for Convex, Clerk, Google GenAI, and Arcjet.
   
   *Example `.env.local`:*
   ```env
   # Convex
   CONVEX_DEPLOYMENT=...
   NEXT_PUBLIC_CONVEX_URL=...

   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...

   # Google Gen AI
   GOOGLE_API_KEY=...

   # Arcjet
   ARCJET_KEY=...
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is [MIT](LICENSE) licensed.
