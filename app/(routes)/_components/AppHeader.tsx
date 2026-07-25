import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

const MenuOption = [
  {
    name: 'Dashboard',
    path: '/dashboard'
  },
  {
    name: 'Upgrade',
    path: '/upgrade'
  },
  {
    name: 'How it works?',
    path: '/#how-it-works'
  },
]


function Header() {
  return (
      <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
        <h1 className="text-base font-bold md:text-2xl">AI Mock Interview</h1>
      </div>

      <div>
        <ul className='flex gap-5'>
            {MenuOption.map((option, index) => (
              <li key={index} className='ml-4 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100'>
                <Link href={option.path}>{option.name}</Link>
              </li>
            ))}
        </ul>

      </div>
      <UserButton/>
    </nav>
  )
}

export default Header