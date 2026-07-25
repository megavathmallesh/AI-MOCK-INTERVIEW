"use client"
import React, { useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button';
import EmptyState from './EmptyState';
import CreateInterviewDialog from '../_components/CreateInterviewDialog';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Dashboard() {
  const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const interviewList = useQuery(
    api.Interview.GetAllInterviews, 
    userDetail?._id ? { userId: userDetail._id } : "skip"
  );

  return (
    <div className='py-10 px-5 md:px-14 lg:px-28 xl:px-44 max-w-7xl mx-auto'> 

      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className='text-lg text-muted-foreground'>My Dashboard</h2>
          <h2 className='text-3xl font-bold'> Welcome, {user?.fullName} </h2>
        </div>
        <CreateInterviewDialog />
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Previous Interviews</h3>
        
        {interviewList === undefined ? (
           <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-primary"/></div>
        ) : interviewList?.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewList?.map((interview, index) => (
              <div key={index} className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-lg mb-1 line-clamp-1">{interview.jobTitle || 'General Interview'}</h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {interview.jobDescription || 'No description provided'}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${interview.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {interview.status === 'completed' ? 'Completed' : 'Draft'}
                  </span>
                  
                  {interview.status === 'completed' && (
                    <Button size="sm" onClick={() => router.push(`/interview/${interview._id}/feedback`)}>
                      View Feedback
                    </Button>
                  )}
                  {interview.status !== 'completed' && (
                     <Button size="sm" variant="outline" onClick={() => router.push(`/interview/${interview._id}/start`)}>
                       Resume
                     </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard