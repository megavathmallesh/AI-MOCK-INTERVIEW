"use client";
import React, { createContext, useState } from 'react'
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';
import { UserDetailContext } from '@/context/UserDetailContext';


function Provider({children}:any) {
   const {user}=useUser();
   const createUserMutation=useMutation(api.users.CreateUser);
   const [userDetail,setUserDetail]=useState<any>();
   console.log('user');

  useEffect(()=>{
    user && createUser();
  },[user]);

  const createUser=async()=>{
    if(user) {
    const result=await createUserMutation({
        name:user?.fullName??"",
        imageUrl:user?.imageUrl,
        email:user?.primaryEmailAddress?.emailAddress??""
    });
    console.log(result);
    setUserDetail(result);
  }
  
  };
  return (
    <UserDetailContext.Provider value={{ userDetail,setUserDetail}}>
    <div>{children}</div>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUserDetailContext=()=>{
  return createContext(UserDetailContext);
  
}