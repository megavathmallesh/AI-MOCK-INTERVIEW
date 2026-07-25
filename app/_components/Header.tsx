import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'


function Header() {
  return (
      <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
        <h1 className="text-base font-bold md:text-2xl">AI Mock Interview</h1>
      </div>
      <Link href="/dashboard" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block dark:text-gray-400 dark:hover:text-white">
       <Button  size="lg" className="w-24 transform rounded-lg bg-blue-700 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700">
          Get Started
       </Button>
       </Link>
    </nav>
  )
}

export default Header