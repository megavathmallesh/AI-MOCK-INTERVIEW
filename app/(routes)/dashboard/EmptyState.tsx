import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import  CreateInterviewDialog  from '../_components/CreateInterviewDialog'

function EmptyState() {
  return (
    <div className='mt-14 flex flex-col items-center gap-5 border-dashed p-10 border-4 rounded-2xl bg-gray-50'>
        <img src="/logoo.svg" alt="abc" className="h-35 w-35" />
    <h2 className= 'mt-2 text-lg text-gray-500'> You do not have any Interview created </h2>
    <CreateInterviewDialog />
    </div>
  )
}

export default EmptyState