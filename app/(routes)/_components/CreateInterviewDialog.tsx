"use client"
import React, { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import UploadResume from './UploadResume'
import JobDescription from './JobDescription'
import axios from 'axios'
import { Loader2Icon } from 'lucide-react'
import {UserDetailContext}  from '@/context/UserDetailContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


export default function CreateInterviewDialog() {
   
    const[formData,setFormData]=useState<any>();
    const [file,setFiles]=useState<File|null>();
    const [loading,setLoading]=useState(false);
    const {userDetail, setUserDetails}=useContext(UserDetailContext);
    const saveInterviewQuestion=useMutation(api.Interview.SavedInterviewQuestion);
    const router=useRouter();
    const onHandleInputChange=(field:string,value:string)=>{
        setFormData((prev:any)=>({...prev,
            [field]:value
            }))

    }

    const onSubmit=async()=>{
      
      setLoading (true);
        const formdata_=new FormData();
        formdata_.append("file",file??"");
        formdata_.append("jobTitle",formData?.jobTitle);
        formdata_.append("jobDescription",formData?.jobDescription);

        try {
          const res = await axios.post("/api/generate-interview-questions", formdata_);
          console.log("✅ API response data:", JSON.stringify(res.data, null, 2));
          console.log("✅ webhookResponse object:", res.data?.webhookResponse);

          if(res.data?.status==429){
            toast.warning(res?.data?.result);
            console.log(res?.data?.result);
            return;
          }
          
          //save to database
          const interviewId=await saveInterviewQuestion({
            questions:res.data?.webhookResponse || [],
            resumeUrl:res.data?.fileUrl || "",
            uId:userDetail?._id,
            jobTitle:formData?.jobTitle,
            jobDescription:formData?.jobDescription,


          });
          // console.log(res);
          router.push('/interview/' + interviewId);

        }catch (error) {
          console.log(error);
        }finally {        
            setLoading(false);
        }
      }

  return (
     <Dialog>
  <DialogTrigger asChild >
    <Button size="lg" className="w-30 transform rounded-lg bg-blue-700 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"> Create Interview </Button>
  </DialogTrigger>
  <DialogContent  className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
    <DialogHeader>
      <DialogTitle>Please submit following details.</DialogTitle>
      <DialogDescription>
        We will use these details to generate interview questions and conduct the mock interview.
      </DialogDescription>
    </DialogHeader>
     <Tabs defaultValue="upload-resume" className="w-full mt-5 items-center">
  <TabsList >
    <TabsTrigger value="upload-resume">Upload Resume</TabsTrigger>
    <TabsTrigger value="job-description">Job Description</TabsTrigger>
  </TabsList>
  <TabsContent value="upload-resume"><UploadResume setFiles={(file:File)=>setFiles(file)}/></TabsContent>
  <TabsContent value="job-description"><JobDescription onHandleInputChange={onHandleInputChange} /></TabsContent>
</Tabs>


<DialogFooter className='flex gap-6'>
      <DialogClose asChild>
        <Button className="w-24 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">Cancel</Button>
      </DialogClose>
        <Button size="lg" className="w-24 transform rounded-lg bg-blue-700 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
        onClick={onSubmit} disabled={loading ||  (!file && !formData?.jobDescription)}>
          {/* <Loader2Icon className="animate-spin"/>  */}
          Submit</Button>
    </DialogFooter>

  </DialogContent>
</Dialog>
  )
}
