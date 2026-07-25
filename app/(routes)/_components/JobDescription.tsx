import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

function JobDescription({onHandleInputChange}:any) {
  return (
    <div className='border rounded-2xl p-10'>
        <div>
            <label>Job Title </label>
            <input type="text" placeholder='e.g. Software Engineer' className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
             onChange={(event) => onHandleInputChange('jobTitle', event.target.value)}
            />

        </div>
         <div className="mt-6">
  <label>Job Description</label>

  <textarea
    placeholder="Enter or paste Job Description"
    className="w-full min-h-30 max-h-50 overflow-y-auto resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    onChange={(event) =>
      onHandleInputChange("jobDescription", event.target.value)
    }
  />
        </div>
    </div>
  )
}

export default JobDescription